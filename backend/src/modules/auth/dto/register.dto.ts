import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: '邮箱' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ example: 'password123', description: '密码（8-50位）' })
  @IsString()
  @MinLength(8, { message: '密码至少 8 位' })
  @MaxLength(50, { message: '密码最多 50 位' })
  password: string;

  @ApiPropertyOptional({ example: '用户昵称', description: '昵称' })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: '昵称最多 100 位' })
  nickname?: string;
}
