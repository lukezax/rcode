import {
  IsString,
  IsOptional,
  IsInt,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCodeDto {
  @ApiProperty({ example: 1, description: '目标 ID' })
  @IsInt()
  targetId: number;

  @ApiProperty({ example: 'ABCDEF123456', description: '邀请码' })
  @IsString()
  @MaxLength(100)
  code: string;

  @ApiPropertyOptional({ description: '推荐链接' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  link?: string;

  @ApiPropertyOptional({ description: '分享者奖励说明' })
  @IsString()
  @IsOptional()
  rewardShare?: string;

  @ApiPropertyOptional({ description: '被分享者奖励说明' })
  @IsString()
  @IsOptional()
  rewardReceive?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '有效期（ISO 日期）' })
  @IsDateString()
  @IsOptional()
  expireAt?: string;
}
