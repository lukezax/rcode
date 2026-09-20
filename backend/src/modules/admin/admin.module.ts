import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Target } from '../targets/entities/target.entity';
import { ReferralCode } from '../codes/entities/referral-code.entity';
import { Report } from '../reports/entities/report.entity';
import { User } from '../users/entities/user.entity';
import { AdminGuard } from '../../common/guards/admin.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Target, ReferralCode, Report, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}
