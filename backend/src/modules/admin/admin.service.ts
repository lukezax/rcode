import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Target } from '../targets/entities/target.entity';
import { ReferralCode } from '../codes/entities/referral-code.entity';
import { Report } from '../reports/entities/report.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Target)
    private targetRepository: Repository<Target>,
    @InjectRepository(ReferralCode)
    private codeRepository: Repository<ReferralCode>,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 待审批目标列表
   */
  async findPendingTargets() {
    const list = await this.targetRepository.find({
      where: { status: 'pending' },
      relations: { creator: true },
      order: { createdAt: 'DESC' },
    });
    const result = list.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      category: t.category,
      website: t.website,
      description: t.description,
      createdBy: t.creator
        ? { id: t.creator.id, nickname: t.creator.nickname }
        : null,
      createdAt: t.createdAt,
    }));
    return { list: result, total: result.length };
  }

  /**
   * 通过目标申请
   */
  async approveTarget(id: number, adminId: number) {
    const target = await this.targetRepository.findOne({ where: { id } });
    if (!target) throw new NotFoundException('目标不存在');
    target.status = 'active';
    target.approvedBy = adminId;
    target.approvedAt = new Date();
    await this.targetRepository.save(target);
    return { id: target.id, status: target.status };
  }

  /**
   * 拒绝目标申请
   */
  async rejectTarget(id: number, adminId: number, reason: string) {
    const target = await this.targetRepository.findOne({ where: { id } });
    if (!target) throw new NotFoundException('目标不存在');
    target.status = 'rejected';
    target.approvedBy = adminId;
    target.approvedAt = new Date();
    target.rejectReason = reason;
    await this.targetRepository.save(target);
    return { id: target.id, status: target.status };
  }

  /**
   * 邀请码管理列表
   */
  async findCodes(query: {
    targetId?: number;
    status?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 20;

    const qb = this.codeRepository
      .createQueryBuilder('code')
      .leftJoinAndSelect('code.target', 'target')
      .leftJoinAndSelect('code.user', 'user');

    if (query.targetId) {
      qb.andWhere('code.targetId = :targetId', { targetId: query.targetId });
    }
    if (query.status) {
      qb.andWhere('code.status = :status', { status: query.status });
    }
    if (query.keyword) {
      qb.andWhere('code.code LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      });
    }

    qb.orderBy('code.createdAt', 'DESC');
    qb.skip((page - 1) * pageSize).take(pageSize);

    const [list, total] = await qb.getManyAndCount();

    const result = list.map((c) => ({
      id: c.id,
      code: c.code,
      target: c.target ? { id: c.target.id, name: c.target.name } : null,
      user: c.user ? { id: c.user.id, nickname: c.user.nickname } : null,
      viewCount: c.viewCount,
      validCount: c.validCount,
      invalidCount: c.invalidCount,
      status: c.status,
      createdAt: c.createdAt,
    }));

    return { list: result, total, page, pageSize };
  }

  /**
   * 下架邀请码
   */
  async removeCode(id: number) {
    const code = await this.codeRepository.findOne({ where: { id } });
    if (!code) throw new NotFoundException('邀请码不存在');
    code.status = 'removed';
    await this.codeRepository.save(code);
    return { id: code.id, status: code.status };
  }

  /**
   * 举报列表
   */
  async findReports(status?: string) {
    const where = status ? { status } : {};
    const list = await this.reportRepository.find({
      where,
      relations: {
        referralCode: { target: true },
        user: true,
      },
      order: { createdAt: 'DESC' },
    });
    const result = list.map((r) => ({
      id: r.id,
      referralCode: r.referralCode
        ? {
            id: r.referralCode.id,
            code: r.referralCode.code,
            target: r.referralCode.target
              ? { id: r.referralCode.target.id, name: r.referralCode.target.name }
              : null,
          }
        : null,
      user: r.user ? { id: r.user.id, nickname: r.user.nickname } : null,
      reason: r.reason,
      detail: r.detail,
      status: r.status,
      createdAt: r.createdAt,
    }));
    return { list: result, total: result.length };
  }

  /**
   * 处理举报
   */
  async resolveReport(id: number, action: 'remove' | 'reject') {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) throw new NotFoundException('举报不存在');

    if (action === 'remove') {
      const code = await this.codeRepository.findOne({
        where: { id: report.referralCodeId },
      });
      if (code) {
        code.status = 'removed';
        await this.codeRepository.save(code);
      }
      report.status = 'resolved';
    } else {
      report.status = 'rejected';
    }

    await this.reportRepository.save(report);
    return { id: report.id, status: report.status };
  }

  /**
   * 统计数据
   */
  async getStats() {
    const [targetCount, codeCount, userCount] = await Promise.all([
      this.targetRepository.count(),
      this.codeRepository.count(),
      this.userRepository.count(),
    ]);

    const [pendingTargetCount, pendingReportCount, validCodeCount, invalidCodeCount] =
      await Promise.all([
        this.targetRepository.count({ where: { status: 'pending' } }),
        this.reportRepository.count({ where: { status: 'pending' } }),
        this.codeRepository.count({ where: { status: 'valid' } }),
        this.codeRepository.count({ where: { status: 'invalid' } }),
      ]);

    return {
      targetCount,
      codeCount,
      userCount,
      pendingTargetCount,
      pendingReportCount,
      validCodeCount,
      invalidCodeCount,
    };
  }

  /**
   * 用户列表
   */
  async findUsers() {
    const list = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
    const result = list.map((u) => ({
      id: u.id,
      email: u.email,
      nickname: u.nickname,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
    }));
    return { list: result, total: result.length };
  }

  /**
   * 封禁/解封用户
   */
  async toggleUserStatus(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('用户不存在');
    user.status = user.status === 'active' ? 'banned' : 'active';
    await this.userRepository.save(user);
    return { id: user.id, status: user.status };
  }
}
