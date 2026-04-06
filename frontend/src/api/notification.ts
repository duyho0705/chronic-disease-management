import axiosInstance from './axios';

export const notificationApi = {
    getNotifications: async () => {
        const response = await axiosInstance.get('/v1/notifications');
        return response.data;
    },
    getUnreadCount: async () => {
        const response = await axiosInstance.get('/v1/notifications/unread-count');
        return response.data;
    },
    markAsRead: async (id: number | string) => {
        const response = await axiosInstance.put(`/v1/notifications/${id}/read`);
        return response.data;
    },
    markAllAsRead: async () => {
        const response = await axiosInstance.put('/v1/notifications/read-all');
        return response.data;
    },
    clearAll: async () => {
        // Backend 'delete' might be needed for clear all, but we have markAllAsRead
        // For now, let's just mark all as read or implement a clear all in backend
        const response = await axiosInstance.put('/v1/notifications/read-all');
        return response.data;
    },
    delete: async (id: number | string) => {
        const response = await axiosInstance.delete(`/v1/notifications/${id}`);
        return response.data;
    }
};
