import axiosInstance from './axios';

export const adminApi = {
  getDashboardData: (timeRange: string = 'DAY', metric: string = 'Lượng bệnh nhân') => 
    axiosInstance.get(`/v1/admin/dashboard?timeRange=${timeRange}&metric=${encodeURIComponent(metric)}`).then(res => res.data),
  getReportsData: (type: string, filter: string) => axiosInstance.get(`/v1/admin/reports?reportType=${type}&performanceFilter=${filter}`).then(res => res.data),
};
