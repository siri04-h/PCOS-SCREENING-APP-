import client from './client';
import { MOCK_MODE } from '../config';
import { mockRegister, mockLogin, mockUpdateHealthProfile } from './mockData';

export const authApi = {
  register: (payload) =>
    MOCK_MODE ? mockRegister(payload) : client.post('/auth/register', payload),
  // payload: { name, email, password }

  login: (payload) =>
    MOCK_MODE ? mockLogin(payload) : client.post('/auth/login', payload),
  // payload: { email, password } -> { token, user }

  getProfile: () => client.get('/users/me'),

  updateHealthProfile: (payload) =>
    MOCK_MODE ? mockUpdateHealthProfile(payload) : client.put('/users/me/health-profile', payload),
  // payload: { age, heightCm, weightKg, avgCycleLength, avgPeriodLength,
  //            pcosFamilyHistory, knownConditions, symptomsChecklist }
};

export default authApi;
