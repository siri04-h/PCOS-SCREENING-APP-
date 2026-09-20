import client from './client';
import { MOCK_MODE } from '../config';
import {
  mockRunPcosScreening,
  mockGetLatestPcosResult,
  mockGetPcosHistory,
  mockGetRecommendations,
  mockGetPatterns,
  mockGetBaseline,
  mockGetAlerts,
  mockShareReport,
} from './mockData';

export const predictionApi = {
  // Triggers Member 2's PCOS Risk Model via the Node -> FastAPI bridge.
  runPcosScreening: () =>
    MOCK_MODE ? mockRunPcosScreening() : client.post('/predictions/pcos'),
  // -> { riskLevel: 'Low'|'Moderate'|'High', riskScore: 0-100,
  //      shap: [{ feature, contribution, direction }] }

  getLatestPcosResult: () =>
    MOCK_MODE ? mockGetLatestPcosResult() : client.get('/predictions/pcos/latest'),

  getPcosHistory: (params) =>
    MOCK_MODE ? mockGetPcosHistory() : client.get('/predictions/pcos', { params }),
};

export const recommendationApi = {
  getRecommendations: () =>
    MOCK_MODE ? mockGetRecommendations() : client.get('/recommendations'),
  // -> [{ id, title, message, basedOn, createdAt }]

  getPatterns: () =>
    MOCK_MODE ? mockGetPatterns() : client.get('/recommendations/patterns'),
  // Member 4's detected personal patterns, e.g. "poor sleep + high stress near CD23"

  getBaseline: () =>
    MOCK_MODE ? mockGetBaseline() : client.get('/recommendations/baseline'),
  // -> { sleepHours: {usual, current}, stressLevel: {usual, current}, ... }

  getAlerts: () =>
    MOCK_MODE ? mockGetAlerts() : client.get('/recommendations/alerts'),
  // Persistent-change / non-diagnostic wellness alerts

  shareReportWithDoctor: (doctorEmail) =>
    MOCK_MODE ? mockShareReport() : client.post('/recommendations/share-report', { doctorEmail }),
};

export default { predictionApi, recommendationApi };
