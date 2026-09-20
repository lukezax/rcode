import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

export const databaseConfig = (): TypeOrmModuleOptions => {
  const dbPath = process.env.DB_DATABASE || 'data/ai_referral_platform.db';

  // 确保数据库文件所在目录存在
  const dir = dirname(dbPath);
  if (dir && dir !== '.' && !existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  return {
    type: 'sqljs',
    location: dbPath,
    autoSave: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: false,
  };
};
