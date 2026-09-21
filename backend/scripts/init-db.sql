-- AI 邀请码分享平台 - 数据初始化参考脚本（SQLite）
-- 版本：v1.0
-- 日期：2026-09-21
--
-- 说明：
--   项目启动时会由 DataInitService 自动建表并初始化数据（推荐）。
--   本脚本仅作为手动初始化的参考，需在表结构已存在后执行。
--   使用 SQLite 客户端执行，例如：
--     sqlite3 backend/data/ai_referral_platform.db < scripts/init-db.sql

-- ============================================
-- 1. 管理员账号
-- ============================================
-- 密码：admin123（bcrypt 加密后的值，请替换为实际加密结果）
INSERT INTO users (email, password, nickname, role, status, created_at, updated_at)
VALUES (
    'admin@example.com',
    '$2b$10$YourHashedPasswordHere',
    '管理员',
    'admin',
    'active',
    datetime('now'),
    datetime('now')
);

-- ============================================
-- 2. 预置目标
-- ============================================
INSERT INTO targets (name, slug, category, logo_url, website, description, is_preset, status, created_at, updated_at)
VALUES
    -- AI 编程
    ('OpenCode', 'opencode', 'AI 编程', NULL, 'https://opencode.ai', 'AI 编程助手', 1, 'active', datetime('now'), datetime('now')),
    ('Cursor', 'cursor', 'AI 编程', NULL, 'https://cursor.sh', 'AI 代码编辑器', 1, 'active', datetime('now'), datetime('now')),
    ('GitHub Copilot', 'github-copilot', 'AI 编程', NULL, 'https://github.com/features/copilot', 'GitHub AI 编程助手', 1, 'active', datetime('now'), datetime('now')),
    ('Claude Code', 'claude-code', 'AI 编程', NULL, 'https://claude.ai', 'Claude AI 编程助手', 1, 'active', datetime('now'), datetime('now')),
    ('Windsurf', 'windsurf', 'AI 编程', NULL, 'https://codeium.com/windsurf', 'Codeium AI 编辑器', 1, 'active', datetime('now'), datetime('now')),
    ('Replit', 'replit', 'AI 编程', NULL, 'https://replit.com', '在线编程平台', 1, 'active', datetime('now'), datetime('now')),
    ('v0', 'v0', 'AI 编程', NULL, 'https://v0.dev', 'Vercel AI 生成 UI', 1, 'active', datetime('now'), datetime('now')),
    ('Bolt.new', 'bolt-new', 'AI 编程', NULL, 'https://bolt.new', 'AI 全栈开发', 1, 'active', datetime('now'), datetime('now')),
    ('Lovable', 'lovable', 'AI 编程', NULL, 'https://lovable.dev', 'AI 应用构建', 1, 'active', datetime('now'), datetime('now')),
    ('Qoder', 'qoder', 'AI 编程', NULL, 'https://qoder.ai', 'AI 编程工具', 1, 'active', datetime('now'), datetime('now')),
    -- AI 写作/办公
    ('Notion AI', 'notion-ai', 'AI 写作', NULL, 'https://notion.so', 'Notion AI 写作助手', 1, 'active', datetime('now'), datetime('now')),
    ('Gamma', 'gamma', 'AI 写作', NULL, 'https://gamma.app', 'AI 演示文稿', 1, 'active', datetime('now'), datetime('now')),
    ('Kimi', 'kimi', 'AI 写作', NULL, 'https://kimi.moonshot.cn', '月之暗面 AI 助手', 1, 'active', datetime('now'), datetime('now')),
    ('豆包', 'doubao', 'AI 写作', NULL, 'https://doubao.com', '字节跳动 AI 助手', 1, 'active', datetime('now'), datetime('now')),
    ('通义千问', 'tongyi', 'AI 写作', NULL, 'https://tongyi.aliyun.com', '阿里 AI 助手', 1, 'active', datetime('now'), datetime('now')),
    -- AI 绘图/视频/音频
    ('Midjourney', 'midjourney', 'AI 绘图', NULL, 'https://midjourney.com', 'AI 图像生成', 1, 'active', datetime('now'), datetime('now')),
    ('Runway', 'runway', 'AI 视频', NULL, 'https://runwayml.com', 'AI 视频生成', 1, 'active', datetime('now'), datetime('now')),
    ('Suno', 'suno', 'AI 音频', NULL, 'https://suno.ai', 'AI 音乐生成', 1, 'active', datetime('now'), datetime('now')),
    ('ElevenLabs', 'elevenlabs', 'AI 音频', NULL, 'https://elevenlabs.io', 'AI 语音合成', 1, 'active', datetime('now'), datetime('now')),
    -- AI 搜索
    ('Perplexity', 'perplexity', 'AI 搜索', NULL, 'https://perplexity.ai', 'AI 搜索引擎', 1, 'active', datetime('now'), datetime('now'));

-- ============================================
-- 完成
-- ============================================
SELECT '初始化完成' AS status;
SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS target_count FROM targets;
