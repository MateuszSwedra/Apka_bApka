import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 5000,
});

export const api = {
  // --- AUTORYZACJA ---
  registerAccount: async (email: string, pass: string) => {
    const res = await apiClient.post('/users/auth/register', { email, password: pass });
    return res.data;
  },
  login: async (email: string, pass: string) => {
    const res = await apiClient.post('/users/auth/login', { email, password: pass });
    return res.data;
  },
  setRole: async (userId: string, role: string, name: string) => {
    const res = await apiClient.post(`/users/${userId}/role`, { role, name });
    return res.data;
  },
  
  // --- OPIEKUN ---
  pairSenior: async (caregiverId: string, pairingCode: string) => {
    const res = await apiClient.post('/users/pair', { caregiverId, pairingCode });
    return res.data;
  },
  getWards: async (caregiverId: string) => {
    const res = await apiClient.get(`/users/${caregiverId}/wards`);
    return res.data;
  },
  createSchedule: async (seniorId: string, name: string, dosage: string, cronExpression: string) => {
    const res = await apiClient.post('/medications/schedule', { seniorId, name, dosage, cronExpression });
    return res.data;
  },
  getSeniorMedications: async (seniorId: string) => {
    const res = await apiClient.get(`/medications/senior/${seniorId}`);
    return res.data;
  },
  takeMedication: async (scheduleId: string) => {
    const res = await apiClient.post(`/medications/${scheduleId}/take`);
    return res.data;
  }
};