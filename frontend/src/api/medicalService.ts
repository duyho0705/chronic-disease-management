import axiosInstance from './axios';

export const medicalServiceApi = {
  getAll: () => axiosInstance.get('/api/v1/medical-services'),
  getById: (id: number) => axiosInstance.get(`/api/v1/medical-services/${id}`),
  create: (data: any) => axiosInstance.post('/api/v1/medical-services', data),
  update: (id: number, data: any) => axiosInstance.put(`/api/v1/medical-services/${id}`, data),
  delete: (id: number) => axiosInstance.delete(`/api/v1/medical-services/${id}`),
  toggleStatus: (id: number) => axiosInstance.patch(`/api/v1/medical-services/${id}/toggle-status`),
};
