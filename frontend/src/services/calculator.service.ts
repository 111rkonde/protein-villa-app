import api from './api';

export const calculatorService = {
  async calculateProtein(data: {
    age: number;
    gender: string;
    weight: number;
    height: number;
    activityLevel: string;
    goal: string;
  }) {
    const res = await api.post('/calculator/protein', data);
    return res.data.data;
  },

  async calculateFitnessMetrics(data: {
    age: number;
    gender: string;
    weight: number;
    height: number;
    activityLevel: string;
    goal?: string;
  }) {
    const res = await api.post('/calculator/fitness', data);
    return res.data.data;
  },
};
