import api from './api';
import { DailyTrackerData, ProteinLog } from '../types';

export const trackerService = {
  async getDailyTracker(date?: string): Promise<DailyTrackerData> {
    const res = await api.get('/tracker/daily', { params: { date } });
    return res.data.data;
  },

  async logProtein(data: { mealType: string; foodName: string; proteinGrams: number; calories?: number; date?: string }): Promise<ProteinLog> {
    const res = await api.post('/tracker/log', data);
    return res.data.data;
  },

  async saveGoal(data: any) {
    const res = await api.post('/tracker/goal', data);
    return res.data.data;
  },

  async deleteLog(id: string) {
    const res = await api.delete(`/tracker/log/${id}`);
    return res.data;
  },
};
