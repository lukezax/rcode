import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';
import { Target } from '../../modules/targets/entities/target.entity';

@Injectable()
export class DataInitService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Target)
    private targetRepository: Repository<Target>,
  ) {}

  async onModuleInit() {
    await this.initAdmin();
    await this.initPresetTargets();
  }

  /**
   * 初始化管理员账号
   */
  private async initAdmin() {
    const adminEmail = 'admin@example.com';
    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = this.userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        nickname: '管理员',
        role: 'admin',
        status: 'active',
      });
      await this.userRepository.save(admin);
      console.log('✅ 管理员账号初始化成功');
      console.log('   邮箱: admin@example.com');
      console.log('   密码: admin123');
    }
  }

  /**
   * 初始化预置目标
   */
  private async initPresetTargets() {
    const presetTargets = [
      // AI 编程
      { name: 'OpenCode', slug: 'opencode', category: 'AI 编程', website: 'https://opencode.ai', description: 'AI 编程助手' },
      { name: 'Cursor', slug: 'cursor', category: 'AI 编程', website: 'https://cursor.sh', description: 'AI 代码编辑器' },
      { name: 'GitHub Copilot', slug: 'github-copilot', category: 'AI 编程', website: 'https://github.com/features/copilot', description: 'GitHub AI 编程助手' },
      { name: 'Claude Code', slug: 'claude-code', category: 'AI 编程', website: 'https://claude.ai', description: 'Claude AI 编程助手' },
      { name: 'Windsurf', slug: 'windsurf', category: 'AI 编程', website: 'https://codeium.com/windsurf', description: 'Codeium AI 编辑器' },
      { name: 'Replit', slug: 'replit', category: 'AI 编程', website: 'https://replit.com', description: '在线编程平台' },
      { name: 'v0', slug: 'v0', category: 'AI 编程', website: 'https://v0.dev', description: 'Vercel AI 生成 UI' },
      { name: 'Bolt.new', slug: 'bolt-new', category: 'AI 编程', website: 'https://bolt.new', description: 'AI 全栈开发' },
      { name: 'Lovable', slug: 'lovable', category: 'AI 编程', website: 'https://lovable.dev', description: 'AI 应用构建' },
      { name: 'Qoder', slug: 'qoder', category: 'AI 编程', website: 'https://qoder.ai', description: 'AI 编程工具' },
      
      // AI 写作/办公
      { name: 'Notion AI', slug: 'notion-ai', category: 'AI 写作', website: 'https://notion.so', description: 'Notion AI 写作助手' },
      { name: 'Gamma', slug: 'gamma', category: 'AI 写作', website: 'https://gamma.app', description: 'AI 演示文稿' },
      { name: 'Kimi', slug: 'kimi', category: 'AI 写作', website: 'https://kimi.moonshot.cn', description: '月之暗面 AI 助手' },
      { name: '豆包', slug: 'doubao', category: 'AI 写作', website: 'https://doubao.com', description: '字节跳动 AI 助手' },
      { name: '通义千问', slug: 'tongyi', category: 'AI 写作', website: 'https://tongyi.aliyun.com', description: '阿里 AI 助手' },
      
      // AI 绘图/视频
      { name: 'Midjourney', slug: 'midjourney', category: 'AI 绘图', website: 'https://midjourney.com', description: 'AI 图像生成' },
      { name: 'Runway', slug: 'runway', category: 'AI 视频', website: 'https://runwayml.com', description: 'AI 视频生成' },
      { name: 'Suno', slug: 'suno', category: 'AI 音频', website: 'https://suno.ai', description: 'AI 音乐生成' },
      { name: 'ElevenLabs', slug: 'elevenlabs', category: 'AI 音频', website: 'https://elevenlabs.io', description: 'AI 语音合成' },
      
      // AI 搜索
      { name: 'Perplexity', slug: 'perplexity', category: 'AI 搜索', website: 'https://perplexity.ai', description: 'AI 搜索引擎' },
    ];

    for (const targetData of presetTargets) {
      const existing = await this.targetRepository.findOne({
        where: { slug: targetData.slug },
      });

      if (!existing) {
        const target = this.targetRepository.create({
          ...targetData,
          isPreset: true,
          status: 'active',
        });
        await this.targetRepository.save(target);
      }
    }

    console.log('✅ 预置目标初始化成功');
  }
}
