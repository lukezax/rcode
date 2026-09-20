/**
 * 隐藏邀请码中间部分
 * @param code 完整邀请码
 * @returns 隐藏后的邀请码
 */
export function maskCode(code: string): string {
  if (!code || code.length <= 6) {
    return code;
  }
  const start = code.substring(0, 3);
  const end = code.substring(code.length - 3);
  return `${start}***${end}`;
}

/**
 * XSS 过滤
 * @param input 输入字符串
 * @returns 过滤后的字符串
 */
export function sanitizeInput(input: string): string {
  if (!input) return input;
  
  // 简单的 XSS 过滤，移除危险的 HTML 标签
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
