import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CodesController } from './codes.controller';
import { CodesService } from './codes.service';
import { ReferralCode } from './entities/referral-code.entity';
import { Target } from '../targets/entities/target.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { Report } from '../reports/entities/report.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReferralCode, Target, Feedback, Report]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [CodesController],
  providers: [CodesService, JwtAuthGuard, OptionalJwtAuthGuard],
  exports: [CodesService],
})
export class CodesModule {}
