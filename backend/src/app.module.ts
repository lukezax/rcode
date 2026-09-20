import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { TargetsModule } from './modules/targets/targets.module';
import { CodesModule } from './modules/codes/codes.module';
import { MeModule } from './modules/me/me.module';
import { AdminModule } from './modules/admin/admin.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DataInitService } from './common/services/data-init.service';
import { User } from './modules/users/entities/user.entity';
import { Target } from './modules/targets/entities/target.entity';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // 数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    
    // 注册实体
    TypeOrmModule.forFeature([User, Target]),
    
    // 业务模块
    AuthModule,
    TargetsModule,
    CodesModule,
    MeModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 数据初始化服务
    DataInitService,
    // 全局异常过滤器
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // 全局响应转换拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
