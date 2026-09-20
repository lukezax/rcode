import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReferralCode } from '../../codes/entities/referral-code.entity';

@Entity('feedbacks')
@Unique('uq_feedbacks_code_user', ['referralCodeId', 'userId'])
@Index('idx_feedbacks_referral_code', ['referralCodeId'])
@Index('idx_feedbacks_user', ['userId'])
export class Feedback {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'integer', name: 'referral_code_id' })
  referralCodeId: number;

  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 10 })
  vote: string; // 'valid' | 'invalid'

  @Column({ type: 'varchar', length: 500, nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => ReferralCode, (code) => code.feedbacks)
  @JoinColumn({ name: 'referral_code_id' })
  referralCode: ReferralCode;

  @ManyToOne(() => User, (user) => user.feedbacks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
