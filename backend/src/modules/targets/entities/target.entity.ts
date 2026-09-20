import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReferralCode } from '../../codes/entities/referral-code.entity';

@Entity('targets')
export class Target {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'logo_url' })
  logoUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false, name: 'is_preset' })
  isPreset: boolean;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  status: string; // 'pending' | 'active' | 'rejected' | 'disabled'

  @Column({ type: 'integer', nullable: true, name: 'created_by' })
  createdBy: number;

  @Column({ type: 'integer', nullable: true, name: 'approved_by' })
  approvedBy: number;

  @Column({ type: 'datetime', nullable: true, name: 'approved_at' })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true, name: 'reject_reason' })
  rejectReason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by' })
  approver: User;

  @OneToMany(() => ReferralCode, (code) => code.target)
  referralCodes: ReferralCode[];
}
