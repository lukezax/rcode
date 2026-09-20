import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: '邮箱' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ example: 'password123', description: '密码' })
  @IsString()
  @MinLength(8, { message: '密码至少 8 位' })
  @MaxLength(50, { message: '密码最多 50 位' })
  password: string;
}
