import client from './client';
import { MOCK_MODE } from '../config';
import {
  mockSubmitDailyLog,
  mockGetDailyLogHistory,
  mockLogSymptoms,
  mockGetSymptomHistory,
} from './mockData';

export const checkinApi = {
  submitDailyLog: (payload) =>
    MOCK_MODE ? mockSubmitDailyLog(payload) : client.post('/daily-logs', payload),
  // payload: { date, sleepHours, waterIntakeMl, foodCravings: [], activityMinutes,
  //            energyLevel: 1-5, stressLevel: 1-5 }

  getDailyLog: (date) => client.get(`/daily-logs/${date}`),

  getDailyLogHistory: (params) =>
    MOCK_MODE ? mockGetDailyLogHistory() : client.get('/daily-logs', { params }),
};

export const symptomsApi = {
  logSymptoms: (payload) =>
    MOCK_MODE ? mockLogSymptoms(payload) : client.post('/symptoms', payload),
  // payload: { date, symptoms: ['acne','bloating','cramps',...], notes }

  getSymptomHistory: (params) =>
    MOCK_MODE ? mockGetSymptomHistory() : client.get('/symptoms', { params }),
};

export default { checkinApi, symptomsApi };
