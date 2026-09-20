import client from './client';
import { MOCK_MODE } from '../config';
import { mockLogPeriod, mockGetCycles, mockGetCycleSummary } from './mockData';

export const cycleApi = {
  logPeriod: (payload) =>
    MOCK_MODE ? mockLogPeriod(payload) : client.post('/cycles', payload),
  // payload: { startDate, endDate, flow: 'light'|'medium'|'heavy', symptoms: [] }

  getCycles: (params) =>
    MOCK_MODE ? mockGetCycles() : client.get('/cycles', { params }),
  // params: { limit, before } for pagination through history

  updateCycle: (id, payload) => client.put(`/cycles/${id}`, payload),

  getCycleSummary: () =>
    MOCK_MODE ? mockGetCycleSummary() : client.get('/cycles/summary'),
  // -> { currentCycleDay, predictedNextPeriod, avgCycleLength, avgPeriodLength }
};

export default cycleApi;
