import axiosInstance from './axios';

export const clinicApi = {
  createClinic: async (clinicData: any) => {
    const response = await axiosInstance.post('/v1/admin/clinics', clinicData);
    return response.data;
  },
  
  getClinics: async (params?: any) => {
    const response = await axiosInstance.get('/v1/admin/clinics', { params });
    return response.data;
  },

  getClinicStats: async () => {
    const response = await axiosInstance.get('/v1/admin/clinics/stats');
    return response.data;
  },

  updateClinic: async (id: string, clinicData: any) => {
    const response = await axiosInstance.put(`/v1/admin/clinics/${id}`, clinicData);
    return response.data;
  },

  toggleStatus: async (id: string) => {
    const response = await axiosInstance.patch(`/v1/admin/clinics/${id}/toggle-status`);
    return response.data;
  },
};
