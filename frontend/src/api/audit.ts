import axiosInstance from './axios';

export const auditApi = {
  getAuditLogs: (params: any) => axiosInstance.get('/v1/admin/audit-logs', { params }).then(res => res.data),
  deleteAuditLog: (id: number) => axiosInstance.delete(`/v1/admin/audit-logs/${id}`).then(res => res.data),
  batchDeleteAuditLogs: (ids: number[]) => axiosInstance.post('/v1/admin/audit-logs/batch-delete', { ids }).then(res => res.data),
  clearAllAuditLogs: () => axiosInstance.delete('/v1/admin/audit-logs/clear-all').then(res => res.data),
};
