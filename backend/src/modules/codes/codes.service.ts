import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { ReferralCode } from './entities/referral-code.entity';
import { Target } from '../targets/entities/target.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { Report } from '../reports/entities/report.entity';
import { CreateCodeDto } from './dto/create-code.dto';
import { FeedbackDto, ReportDto } from './dto/feedback.dto';

@Injectable()
export class CodesService {
  constructor(
    @InjectRepository(ReferralCode)
    private codeRepository: Repository<ReferralCode>,
    @InjectRepository(Target)
    private targetRepository: Repository<Target>,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  /**
   * 获取邀请码详情
   */
  async findOne(id: number, userId?: number) {
    const code = await this.codeRepository.findOne({
      where: { id },
      relations: { user: true, target: true },
    });
    if (!code) {
      throw new NotFoundException('邀请码不存在');
    }

    const isLoggedIn = !!userId;
    const isOwner = userId && code.userId === userId;

    // 查询当前用户的投票
    let myFeedback = null;
    if (userId) {
      myFeedback = await this.feedbackRepository.findOne({
        where: { referralCodeId: id, userId },
      });
    }

    return {
      id: code.id,
      code: isLoggedIn ? code.code : this.maskCode(code.code),
      isFullCode: isLoggedIn,
      user: code.user
        ? { id: code.user.id, nickname: code.user.nickname, avatar: code.user.avatar }
        : null,
      target: code.target ? { id: code.target.id, name: code.target.name } : null,
      link: isLoggedIn ? code.link : null,
      rewardShare: code.rewardShare,
      rewardReceive: code.rewardReceive,
      description: code.description,
      expireAt: code.expireAt,
      viewCount: code.viewCount,
      validCount: code.validCount,
      invalidCount: code.invalidCount,
      status: code.status,
      createdAt: code.createdAt,
      canFeedback: isLoggedIn && !isOwner,
      isOwner: !!isOwner,
      myFeedback: myFeedback ? myFeedback.vote : null,
    };
  }

  /**
   * 上传邀请码
   */
  async create(userId: number, dto: CreateCodeDto) {
    // 1. 检查目标
    const target = await this.targetRepository.findOne({
      where: { id: dto.targetId, status: 'active' },
    });
    if (!target) {
      throw new NotFoundException('目标不存在或未启用');
    }

    // 2. 检查邀请码唯一
    const existing = await this.codeRepository.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException('该邀请码已被上传');
    }

    // 3. 每日上传限制
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await this.codeRepository.count({
      where: {
        userId,
        targetId: dto.targetId,
        createdAt: MoreThanOrEqual(today),
      },
    });
    if (todayCount >= 3) {
      throw new BadRequestException('同一目标每日最多上传 3 条邀请码');
    }

    // 4. 创建
    const code = this.codeRepository.create({
      targetId: dto.targetId,
      userId,
      code: dto.code,
      link: dto.link,
      rewardShare: dto.rewardShare,
      rewardReceive: dto.rewardReceive,
      description: dto.description,
      expireAt: dto.expireAt ? new Date(dto.expireAt) : null,
      status: 'pending',
    });
    await this.codeRepository.save(code);

    return { id: code.id, code: this.maskCode(code.code), status: code.status };
  }

  /**
   * 增加查看次数
   */
  async incrementView(id: number) {
    const code = await this.codeRepository.findOne({ where: { id } });
    if (!code) {
      throw new NotFoundException('邀请码不存在');
    }
    code.viewCount += 1;
    await this.codeRepository.save(code);
    return { viewCount: code.viewCount };
  }

  /**
   * 提交反馈
   */
  async feedback(userId: number, codeId: number, dto: FeedbackDto) {
    const code = await this.codeRepository.findOne({ where: { id: codeId } });
    if (!code) {
      throw new NotFoundException('邀请码不存在');
    }

    // 不能给自己的邀请码投票
    if (code.userId === userId) {
      throw new ForbiddenException('不能给自己的邀请码投票');
    }

    let feedback = await this.feedbackRepository.findOne({
      where: { referralCodeId: codeId, userId },
    });

    if (feedback) {
      const oldVote = feedback.vote;
      feedback.vote = dto.vote;
      feedback.comment = dto.comment;
      await this.feedbackRepository.save(feedback);

      if (oldVote === 'valid' && dto.vote === 'invalid') {
        code.validCount = Math.max(0, code.validCount - 1);
        code.invalidCount += 1;
      } else if (oldVote === 'invalid' && dto.vote === 'valid') {
        code.invalidCount = Math.max(0, code.invalidCount - 1);
        code.validCount += 1;
      }
    } else {
      feedback = this.feedbackRepository.create({
        referralCodeId: codeId,
        userId,
        vote: dto.vote,
        comment: dto.comment,
      });
      await this.feedbackRepository.save(feedback);

      if (dto.vote === 'valid') {
        code.validCount += 1;
      } else {
        code.invalidCount += 1;
      }
    }

    // 更新状态
    code.status = this.calculateStatus(code.validCount, code.invalidCount);
    await this.codeRepository.save(code);

    return {
      validCount: code.validCount,
      invalidCount: code.invalidCount,
      status: code.status,
    };
  }

  /**
   * 举报邀请码
   */
  async report(userId: number, codeId: number, dto: ReportDto) {
    const code = await this.codeRepository.findOne({ where: { id: codeId } });
    if (!code) {
      throw new NotFoundException('邀请码不存在');
    }

    const existing = await this.reportRepository.findOne({
      where: { referralCodeId: codeId, userId },
    });
    if (existing) {
      throw new ConflictException('您已举报过该邀请码');
    }

    const report = this.reportRepository.create({
      referralCodeId: codeId,
      userId,
      reason: dto.reason,
      detail: dto.detail,
      status: 'pending',
    });
    await this.reportRepository.save(report);

    return { id: report.id, status: report.status };
  }

  /**
   * 我的上传
   */
  async findMyCodes(userId: number) {
    const list = await this.codeRepository.find({
      where: { userId },
      relations: { target: true },
      order: { createdAt: 'DESC' },
    });

    const result = list.map((c) => ({
      id: c.id,
      target: c.target ? { id: c.target.id, name: c.target.name } : null,
      code: c.code,
      viewCount: c.viewCount,
      validCount: c.validCount,
      invalidCount: c.invalidCount,
      status: c.status,
      createdAt: c.createdAt,
    }));

    return { list: result, total: result.length };
  }

  /**
   * 我的反馈
   */
  async findMyFeedbacks(userId: number) {
    const list = await this.feedbackRepository.find({
      where: { userId },
      relations: { referralCode: { target: true } },
      order: { createdAt: 'DESC' },
    });

    const result = list.map((f) => ({
      id: f.id,
      referralCode: f.referralCode
        ? {
            id: f.referralCode.id,
            code: this.maskCode(f.referralCode.code),
            target: f.referralCode.target
              ? { id: f.referralCode.target.id, name: f.referralCode.target.name }
              : null,
          }
        : null,
      vote: f.vote,
      comment: f.comment,
      createdAt: f.createdAt,
    }));

    return { list: result, total: result.length };
  }

  /**
   * 计算状态
   */
  private calculateStatus(validCount: number, invalidCount: number): string {
    if (validCount > invalidCount) return 'valid';
    if (invalidCount > validCount) return 'invalid';
    return 'pending';
  }

  /**
   * 隐藏邀请码
   */
  private maskCode(code: string): string {
    if (!code || code.length <= 6) return code;
    return `${code.substring(0, 3)}***${code.substring(code.length - 3)}`;
  }
}
