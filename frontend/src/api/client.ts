import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 5000,
});

export const medicationsApi = {
  takeMedication: async (scheduleId: string) => {
    const response = await apiClient.post(`/medications/${scheduleId}/take`);
    return response.data;
  },
};