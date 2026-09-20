import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Target } from '../../targets/entities/target.entity';
import { Feedback } from '../../feedbacks/entities/feedback.entity';
import { Report } from '../../reports/entities/report.entity';

@Entity('referral_codes')
@Index('idx_referral_codes_target', ['targetId'])
@Index('idx_referral_codes_user', ['userId'])
@Index('idx_referral_codes_code', ['code'])
@Index('idx_referral_codes_status', ['status'])
@Index('idx_referral_codes_created_at', ['createdAt'])
export class ReferralCode {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'integer', name: 'target_id' })
  targetId: number;

  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  code: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  link: string;

  @Column({ type: 'text', nullable: true, name: 'reward_share' })
  rewardShare: string;

  @Column({ type: 'text', nullable: true, name: 'reward_receive' })
  rewardReceive: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'datetime', nullable: true, name: 'expire_at' })
  expireAt: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  status: string; // 'pending' | 'valid' | 'invalid' | 'expired' | 'removed'

  @Column({ type: 'integer', default: 0, name: 'view_count' })
  viewCount: number;

  @Column({ type: 'integer', default: 0, name: 'valid_count' })
  validCount: number;

  @Column({ type: 'integer', default: 0, name: 'invalid_count' })
  invalidCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => Target, (target) => target.referralCodes)
  @JoinColumn({ name: 'target_id' })
  target: Target;

  @ManyToOne(() => User, (user) => user.referralCodes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Feedback, (feedback) => feedback.referralCode)
  feedbacks: Feedback[];

  @OneToMany(() => Report, (report) => report.referralCode)
  reports: Report[];
}
