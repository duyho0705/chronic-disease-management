import axiosInstance from './axios';

export const auditApi = {
  getAuditLogs: (params: any) => axiosInstance.get('/v1/admin/audit-logs', { params }).then(res => res.data),
};
