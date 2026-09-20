import { IsString, IsOptional, MaxLength, IsUrl, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTargetDto {
  @ApiProperty({ example: '新工具', description: '工具名称' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'new-tool', description: '唯一标识（URL友好）' })
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiProperty({ 
    example: 'AI 编程', 
    description: '分类',
    enum: ['AI 编程', 'AI 写作', 'AI 绘图', 'AI 视频', 'AI 音频', 'AI 搜索', 'AI 办公', 'AI Agent']
  })
  @IsString()
  @IsIn(['AI 编程', 'AI 写作', 'AI 绘图', 'AI 视频', 'AI 音频', 'AI 搜索', 'AI 办公', 'AI Agent'])
  category: string;

  @ApiPropertyOptional({ example: 'https://new-tool.com', description: '官网' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  website?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png', description: 'Logo URL' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  logoUrl?: string;

  @ApiPropertyOptional({ example: '工具简介', description: '简介' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '申请理由', description: '申请理由' })
  @IsString()
  @MaxLength(500)
  reason: string;
}
