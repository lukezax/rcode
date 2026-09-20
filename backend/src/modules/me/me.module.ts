import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MeController } from './me.controller';
import { CodesModule } from '../codes/codes.module';
import { TargetsModule } from '../targets/targets.module';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Module({
  imports: [
    CodesModule,
    TargetsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [MeController],
  providers: [JwtAuthGuard],
})
export class MeModule {}
