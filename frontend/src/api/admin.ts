import axiosInstance from './axios';

export const adminApi = {
  getDashboardData: () => axiosInstance.get('/v1/admin/dashboard').then(res => res.data),
  // Additional admin-specific calls can be added here
};
