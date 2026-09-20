import request from './request';

export const authApi = {
  login: (data: { email: string; password: string }) =>
    request.post('/auth/login', data),
};

export const adminApi = {
  pendingTargets: () => request.get<any, { list: any[]; total: number }>('/admin/targets/pending'),
  approveTarget: (id: number) => request.post(`/admin/targets/${id}/approve`),
  rejectTarget: (id: number, reason: string) =>
    request.post(`/admin/targets/${id}/reject`, { reason }),

  codes: (params?: any) =>
    request.get<any, { list: any[]; total: number }>('/admin/codes', { params }),
  removeCode: (id: number) => request.post(`/admin/codes/${id}/remove`),

  reports: (status?: string) =>
    request.get<any, { list: any[]; total: number }>('/admin/reports', {
      params: status ? { status } : {},
    }),
  resolveReport: (id: number, action: 'remove' | 'reject') =>
    request.post(`/admin/reports/${id}/resolve`, { action }),

  stats: () => request.get<any, any>('/admin/stats'),
  users: () => request.get<any, { list: any[]; total: number }>('/admin/users'),
  toggleUser: (id: number) => request.post(`/admin/users/${id}/toggle`),
};
