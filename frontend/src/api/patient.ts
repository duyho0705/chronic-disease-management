import axiosInstance from './axios';

export const patientApi = {
  recordMetric: async (metricData: any) => {
    // Controller mapping is /api/v1/patient/health-metrics
    const response = await axiosInstance.post('/v1/patient/health-metrics', metricData);
    return response.data;
  },

  getHistory: async (page = 0, size = 10) => {
    const response = await axiosInstance.get(`/v1/patient/health-metrics/history?page=${page}&size=${size}`);
    return response.data;
  },

  getMetricsSummary: async (period = 'WEEK') => {
    const response = await axiosInstance.get(`/v1/patient/health-metrics/summary?period=${period}`);
    return response.data;
  },

  getChartData: async (metricType: string, period = 'WEEK') => {
    const response = await axiosInstance.get(`/v1/patient/health-metrics/chart?metricType=${metricType}&period=${period}`);
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/v1/patient/profile');
    return response.data;
  }
};
