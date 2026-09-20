import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Target } from './entities/target.entity';
import { ReferralCode } from '../codes/entities/referral-code.entity';
import { CreateTargetDto } from './dto/create-target.dto';

@Injectable()
export class TargetsService {
  constructor(
    @InjectRepository(Target)
    private targetRepository: Repository<Target>,
    @InjectRepository(ReferralCode)
    private codeRepository: Repository<ReferralCode>,
  ) {}

  /**
   * 获取目标列表（支持分类、搜索、分页）
   */
  async findAll(query: {
    category?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 20;

    const qb = this.targetRepository
      .createQueryBuilder('target')
      .where('target.status = :status', { status: 'active' });

    if (query.category) {
      qb.andWhere('target.category = :category', { category: query.category });
    }

    if (query.keyword) {
      qb.andWhere('(target.name LIKE :keyword OR target.slug LIKE :keyword)', {
        keyword: `%${query.keyword}%`,
      });
    }

    qb.orderBy('target.createdAt', 'DESC');
    qb.skip((page - 1) * pageSize).take(pageSize);

    const [list, total] = await qb.getManyAndCount();

    // 统计每个目标下的邀请码数量
    const result = await Promise.all(
      list.map(async (target) => {
        const codeCount = await this.codeRepository.count({
          where: { targetId: target.id },
        });
        return { ...target, codeCount };
      }),
    );

    return { list: result, total, page, pageSize };
  }

  /**
   * 获取目标详情
   */
  async findOne(id: number) {
    const target = await this.targetRepository.findOne({ where: { id } });
    if (!target) {
      throw new NotFoundException('目标不存在');
    }
    const codeCount = await this.codeRepository.count({
      where: { targetId: id },
    });
    return { ...target, codeCount };
  }

  /**
   * 获取目标下的邀请码列表
   */
  async findCodes(
    targetId: number,
    query: { sort?: string; page?: number; pageSize?: number },
  ) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 20;

    const target = await this.targetRepository.findOne({
      where: { id: targetId },
    });
    if (!target) {
      throw new NotFoundException('目标不存在');
    }

    const qb = this.codeRepository
      .createQueryBuilder('code')
      .leftJoinAndSelect('code.user', 'user')
      .where('code.targetId = :targetId', { targetId })
      .andWhere('code.status != :removed', { removed: 'removed' });

    switch (query.sort) {
      case 'newest':
        qb.orderBy('code.createdAt', 'DESC');
        break;
      case 'most_view':
        qb.orderBy('code.viewCount', 'DESC');
        break;
      case 'most_valid':
        qb.orderBy('code.validCount', 'DESC');
        break;
      default:
        // 默认：有效票优先 + 最新
        qb.orderBy('code.validCount', 'DESC').addOrderBy(
          'code.createdAt',
          'DESC',
        );
    }

    qb.skip((page - 1) * pageSize).take(pageSize);

    const [list, total] = await qb.getManyAndCount();

    const masked = list.map((code) => ({
      id: code.id,
      code: this.maskCode(code.code),
      user: code.user
        ? { id: code.user.id, nickname: code.user.nickname, avatar: code.user.avatar }
        : null,
      viewCount: code.viewCount,
      validCount: code.validCount,
      invalidCount: code.invalidCount,
      status: code.status,
      createdAt: code.createdAt,
    }));

    return { list: masked, total, page, pageSize };
  }

  /**
   * 申请新增目标
   */
  async apply(dto: CreateTargetDto, userId: number) {
    // 检查同名或同 slug
    const existing = await this.targetRepository.findOne({
      where: [{ name: dto.name }, { slug: dto.slug }],
    });
    if (existing) {
      throw new ConflictException('该目标已存在或正在审核中');
    }

    const target = this.targetRepository.create({
      name: dto.name,
      slug: dto.slug,
      category: dto.category,
      website: dto.website,
      logoUrl: dto.logoUrl,
      description: dto.description,
      isPreset: false,
      status: 'pending',
      createdBy: userId,
    });

    await this.targetRepository.save(target);
    return { id: target.id, name: target.name, status: target.status };
  }

  /**
   * 获取我的申请
   */
  async findMyApplications(userId: number) {
    const list = await this.targetRepository.find({
      where: { createdBy: userId },
      order: { createdAt: 'DESC' },
    });
    return { list, total: list.length };
  }

  /**
   * 隐藏邀请码中间部分
   */
  private maskCode(code: string): string {
    if (!code || code.length <= 6) return code;
    return `${code.substring(0, 3)}***${code.substring(code.length - 3)}`;
  }
}
