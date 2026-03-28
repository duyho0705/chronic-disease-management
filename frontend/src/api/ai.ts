import axiosInstance from './axios';

export interface AIChatRequest {
  message: string;
}

export interface AIChatResponse {
  reply: string;
  agentName: string;
}

export const aiService = {
  chat: async (data: AIChatRequest) => {
    const response = await axiosInstance.post<any>('/v1/ai/chat', data);
    return response.data.data as AIChatResponse;
  },
};
