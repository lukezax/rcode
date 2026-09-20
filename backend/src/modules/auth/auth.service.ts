import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 用户注册
   */
  async register(registerDto: RegisterDto) {
    const { email, password, nickname } = registerDto;

    // 检查邮箱是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('邮箱已被注册');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      nickname: nickname || email.split('@')[0],
      role: 'user',
      status: 'active',
    });

    await this.userRepository.save(user);

    // 生成 token
    const token = this.generateToken(user);

    // 返回用户信息（不包含密码）
    const { password: _, ...result } = user;
    return {
      user: result,
      token,
    };
  }

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 查找用户
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 检查用户状态
    if (user.status === 'banned') {
      throw new UnauthorizedException('账号已被封禁');
    }

    // 生成 token
    const token = this.generateToken(user);

    // 返回用户信息（不包含密码）
    const { password: _, ...result } = user;
    return {
      user: result,
      token,
    };
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return user;
  }

  /**
   * 生成 JWT Token
   */
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      nickname: user.nickname,
    };

    return this.jwtService.sign(payload);
  }
}
