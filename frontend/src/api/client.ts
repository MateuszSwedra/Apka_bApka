import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 5000,
});

export const api = {
  takeMedication: async (scheduleId: string) => {
    const response = await apiClient.post(`/medications/${scheduleId}/take`);
    return response.data;
  },
  register: async (role: string, name: string) => {
    const response = await apiClient.post('/users/register', { role, name });
    return response.data;
  },
  pairSenior: async (caregiverId: string, pairingCode: string) => {
    const response = await apiClient.post('/users/pair', { caregiverId, pairingCode });
    return response.data;
  },
  getWards: async (caregiverId: string) => {
    const response = await apiClient.get(`/users/${caregiverId}/wards`);
    return response.data;
  },
  createSchedule: async (seniorId: string, name: string, dosage: string, cronExpression: string) => {
    const response = await apiClient.post('/medications/schedule', { seniorId, name, dosage, cronExpression });
    return response.data;
  }
};