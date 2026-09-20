import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ReferralCode } from '../../codes/entities/referral-code.entity';
import { Feedback } from '../../feedbacks/entities/feedback.entity';
import { Report } from '../../reports/entities/report.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'user',
  })
  role: string; // 'user' | 'admin'

  @Column({
    type: 'varchar',
    length: 20,
    default: 'active',
  })
  status: string; // 'active' | 'banned'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 关联关系
  @OneToMany(() => ReferralCode, (code) => code.user)
  referralCodes: ReferralCode[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
