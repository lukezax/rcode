import request from './request';

// ========== 类型 ==========
export interface Target {
  id: number;
  name: string;
  slug: string;
  category: string;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  codeCount?: number;
}

export interface CodeListItem {
  id: number;
  code: string;
  user: { id: number; nickname: string; avatar: string | null } | null;
  viewCount: number;
  validCount: number;
  invalidCount: number;
  status: string;
  createdAt: string;
}

export interface CodeDetail {
  id: number;
  code: string;
  isFullCode: boolean;
  user: { id: number; nickname: string; avatar: string | null } | null;
  target: { id: number; name: string } | null;
  link: string | null;
  rewardShare: string | null;
  rewardReceive: string | null;
  description: string | null;
  expireAt: string | null;
  viewCount: number;
  validCount: number;
  invalidCount: number;
  status: string;
  createdAt: string;
  canFeedback: boolean;
  isOwner: boolean;
  myFeedback: string | null;
}

export interface Page<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ========== 认证 ==========
export const authApi = {
  register: (data: { email: string; password: string; nickname?: string }) =>
    request.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    request.post('/auth/login', data),
  me: () => request.get('/auth/me'),
};

// ========== 目标 ==========
export const targetApi = {
  list: (params?: { category?: string; keyword?: string; page?: number; pageSize?: number }) =>
    request.get<any, Page<Target>>('/targets', { params }),
  detail: (id: number | string) => request.get<any, Target>(`/targets/${id}`),
  codes: (id: number | string, params?: { sort?: string; page?: number; pageSize?: number }) =>
    request.get<any, Page<CodeListItem>>(`/targets/${id}/codes`, { params }),
  apply: (data: any) => request.post('/targets/apply', data),
};

// ========== 邀请码 ==========
export const codeApi = {
  detail: (id: number | string) => request.get<any, CodeDetail>(`/codes/${id}`),
  create: (data: any) => request.post('/codes', data),
  view: (id: number | string) => request.post(`/codes/${id}/view`),
  feedback: (id: number | string, data: { vote: string; comment?: string }) =>
    request.post(`/codes/${id}/feedback`, data),
  report: (id: number | string, data: { reason: string; detail?: string }) =>
    request.post(`/codes/${id}/report`, data),
};

// ========== 用户中心 ==========
export const meApi = {
  codes: () => request.get<any, { list: any[]; total: number }>('/me/codes'),
  feedbacks: () => request.get<any, { list: any[]; total: number }>('/me/feedbacks'),
  applications: () => request.get<any, { list: any[]; total: number }>('/me/applications'),
};
