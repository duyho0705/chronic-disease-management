import axiosInstance from './axios';

export const configApi = {
  getConfig: () => axiosInstance.get('/v1/admin/config').then(res => res.data),
  updateConfig: (data: any) => axiosInstance.put('/v1/admin/config', data).then(res => res.data),
  regenerateApiKey: () => axiosInstance.post('/v1/admin/config/regenerate-key').then(res => res.data),
};
