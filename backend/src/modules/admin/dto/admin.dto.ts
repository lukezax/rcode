import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RejectTargetDto {
  @ApiProperty({ description: '拒绝原因' })
  @IsString()
  reason: string;
}

export class ResolveReportDto {
  @ApiProperty({ enum: ['remove', 'reject'], description: '处理动作' })
  @IsString()
  @IsIn(['remove', 'reject'])
  action: 'remove' | 'reject';
}
