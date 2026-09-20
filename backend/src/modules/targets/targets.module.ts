import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { TargetsController } from './targets.controller';
import { TargetsService } from './targets.service';
import { Target } from './entities/target.entity';
import { ReferralCode } from '../codes/entities/referral-code.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Target, ReferralCode]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [TargetsController],
  providers: [TargetsService, JwtAuthGuard],
  exports: [TargetsService],
})
export class TargetsModule {}
