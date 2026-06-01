import axiosInstance from './axios';

export const authApi = {
  login: async (data: any) => {
    const response = await axiosInstance.post('/v1/auth/login', data);
    return response.data;
  },
  getMe: async () => {
    const response = await axiosInstance.get('/v1/users/me');
    return response.data;
  },
  updateProfile: async (data: { fullName?: string; phone?: string; avatarUrl?: string }) => {
    const response = await axiosInstance.put('/v1/users/me', data);
    return response.data;
  },
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/v1/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
