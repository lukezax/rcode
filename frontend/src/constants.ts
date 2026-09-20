export const CATEGORIES = [
  'AI 编程',
  'AI 写作',
  'AI 绘图',
  'AI 视频',
  'AI 音频',
  'AI 搜索',
  'AI 办公',
  'AI Agent',
];

export const CODE_STATUS: Record<string, { text: string; color: string }> = {
  pending: { text: '待验证', color: 'gray' },
  valid: { text: '有效', color: 'green' },
  invalid: { text: '无效', color: 'red' },
  expired: { text: '已过期', color: 'orange' },
  removed: { text: '已下架', color: 'gray' },
};

export const TARGET_STATUS: Record<string, { text: string; color: string }> = {
  pending: { text: '待审批', color: 'orange' },
  active: { text: '已启用', color: 'green' },
  rejected: { text: '已拒绝', color: 'red' },
  disabled: { text: '已停用', color: 'gray' },
};
