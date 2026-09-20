import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReferralCode } from '../../codes/entities/referral-code.entity';

@Entity('reports')
@Index('idx_reports_referral_code', ['referralCodeId'])
@Index('idx_reports_user', ['userId'])
@Index('idx_reports_status', ['status'])
export class Report {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'integer', name: 'referral_code_id' })
  referralCodeId: number;

  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 50 })
  reason: string;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  status: string; // 'pending' | 'resolved' | 'rejected'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // 关联关系
  @ManyToOne(() => ReferralCode, (code) => code.reports)
  @JoinColumn({ name: 'referral_code_id' })
  referralCode: ReferralCode;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
