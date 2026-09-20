-- AI 邀请码分享平台数据库初始化脚本
-- 版本：v1.0
-- 日期：2026-09-20

-- 注意：此脚本仅用于手动初始化数据库
-- NestJS 项目会自动同步表结构（开发环境）

-- ============================================
-- 1. 创建管理员账号
-- ============================================

-- 密码：admin123（bcrypt 加密后的值）
INSERT INTO users (email, password, nickname, role, status, created_at, updated_at)
VALUES (
    'admin@example.com',
    '$2b$10$YourHashedPasswordHere',  -- 需要替换为实际的 bcrypt 加密密码
    '管理员',
    'admin',
    'active',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 2. 插入预置目标
-- ============================================

INSERT INTO targets (name, slug, category, logo_url, website, description, is_preset, status, created_at, updated_at)
VALUES
    -- AI 编程
    ('OpenCode', 'opencode', 'AI 编程', NULL, 'https://opencode.ai', 'AI 编程助手', TRUE, 'active', NOW(), NOW()),
    ('Cursor', 'cursor', 'AI 编程', NULL, 'https://cursor.sh', 'AI 代码编辑器', TRUE, 'active', NOW(), NOW()),
    ('GitHub Copilot', 'github-copilot', 'AI 编程', NULL, 'https://github.com/features/copilot', 'GitHub AI 编程助手', TRUE, 'active', NOW(), NOW()),
    ('Claude Code', 'claude-code', 'AI 编程', NULL, 'https://claude.ai', 'Claude AI 编程助手', TRUE, 'active', NOW(), NOW()),
    ('Windsurf', 'windsurf', 'AI 编程', NULL, 'https://codeium.com/windsurf', 'Codeium AI 编辑器', TRUE, 'active', NOW(), NOW()),
    ('Replit', 'replit', 'AI 编程', NULL, 'https://replit.com', '在线编程平台', TRUE, 'active', NOW(), NOW()),
    ('v0', 'v0', 'AI 编程', NULL, 'https://v0.dev', 'Vercel AI 生成 UI', TRUE, 'active', NOW(), NOW()),
    ('Bolt.new', 'bolt-new', 'AI 编程', NULL, 'https://bolt.new', 'AI 全栈开发', TRUE, 'active', NOW(), NOW()),
    ('Lovable', 'lovable', 'AI 编程', NULL, 'https://lovable.dev', 'AI 应用构建', TRUE, 'active', NOW(), NOW()),
    ('Qoder', 'qoder', 'AI 编程', NULL, 'https://qoder.ai', 'AI 编程工具', TRUE, 'active', NOW(), NOW()),
    
    -- AI 写作/办公
    ('Notion AI', 'notion-ai', 'AI 写作', NULL, 'https://notion.so', 'Notion AI 写作助手', TRUE, 'active', NOW(), NOW()),
    ('Gamma', 'gamma', 'AI 写作', NULL, 'https://gamma.app', 'AI 演示文稿', TRUE, 'active', NOW(), NOW()),
    ('Kimi', 'kimi', 'AI 写作', NULL, 'https://kimi.moonshot.cn', '月之暗面 AI 助手', TRUE, 'active', NOW(), NOW()),
    ('豆包', 'doubao', 'AI 写作', NULL, 'https://doubao.com', '字节跳动 AI 助手', TRUE, 'active', NOW(), NOW()),
    ('通义千问', 'tongyi', 'AI 写作', NULL, 'https://tongyi.aliyun.com', '阿里 AI 助手', TRUE, 'active', NOW(), NOW()),
    
    -- AI 绘图/视频
    ('Midjourney', 'midjourney', 'AI 绘图', NULL, 'https://midjourney.com', 'AI 图像生成', TRUE, 'active', NOW(), NOW()),
    ('Runway', 'runway', 'AI 视频', NULL, 'https://runwayml.com', 'AI 视频生成', TRUE, 'active', NOW(), NOW()),
    ('Suno', 'suno', 'AI 音频', NULL, 'https://suno.ai', 'AI 音乐生成', TRUE, 'active', NOW(), NOW()),
    ('ElevenLabs', 'elevenlabs', 'AI 音频', NULL, 'https://elevenlabs.io', 'AI 语音合成', TRUE, 'active', NOW(), NOW()),
    
    -- AI 搜索
    ('Perplexity', 'perplexity', 'AI 搜索', NULL, 'https://perplexity.ai', 'AI 搜索引擎', TRUE, 'active', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. 创建索引（如果 TypeORM 未自动创建）
-- ============================================

-- users 表索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- targets 表索引
CREATE INDEX IF NOT EXISTS idx_targets_slug ON targets(slug);
CREATE INDEX IF NOT EXISTS idx_targets_category ON targets(category);
CREATE INDEX IF NOT EXISTS idx_targets_status ON targets(status);
CREATE INDEX IF NOT EXISTS idx_targets_created_by ON targets(created_by);

-- referral_codes 表索引
CREATE INDEX IF NOT EXISTS idx_referral_codes_target ON referral_codes(target_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_status ON referral_codes(status);
CREATE INDEX IF NOT EXISTS idx_referral_codes_created_at ON referral_codes(created_at DESC);

-- feedbacks 表索引
CREATE INDEX IF NOT EXISTS idx_feedbacks_referral_code ON feedbacks(referral_code_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_user ON feedbacks(user_id);

-- reports 表索引
CREATE INDEX IF NOT EXISTS idx_reports_referral_code ON reports(referral_code_id);
CREATE INDEX IF NOT EXISTS idx_reports_user ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- ============================================
-- 完成
-- ============================================

-- 查询统计
SELECT '初始化完成' AS status;
SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS target_count FROM targets;
