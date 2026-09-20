import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'sqljs',
  location: process.env.DB_DATABASE || 'data/ai_referral_platform.db',
  autoSave: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development', // 生产环境应使用 migration
  logging: process.env.NODE_ENV === 'development',
});
