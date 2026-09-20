import { IsString, IsIn, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FeedbackDto {
  @ApiProperty({ example: 'valid', enum: ['valid', 'invalid'], description: '投票' })
  @IsString()
  @IsIn(['valid', 'invalid'])
  vote: string;

  @ApiPropertyOptional({ description: '一句话点评' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  comment?: string;
}

export class ReportDto {
  @ApiProperty({ example: '已失效', description: '举报原因' })
  @IsString()
  @MaxLength(50)
  reason: string;

  @ApiPropertyOptional({ description: '详细说明' })
  @IsString()
  @IsOptional()
  detail?: string;
}
