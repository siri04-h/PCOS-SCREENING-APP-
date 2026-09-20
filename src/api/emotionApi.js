import client from './client';
import { MOCK_MODE } from '../config';
import { mockFuseAndSubmit, mockGetEmotionHistory } from './mockData';

function mockOk() {
  return new Promise((resolve) => setTimeout(() => resolve({ data: { received: true } }), 300));
}

export const emotionApi = {
  submitTextEmotion: (text) =>
    MOCK_MODE ? mockOk() : client.post('/emotions/text', { text }),

  submitVoiceEmotion: (audioUri) => {
    if (MOCK_MODE) return mockOk();
    const form = new FormData();
    form.append('audio', { uri: audioUri, name: 'voice.m4a', type: 'audio/m4a' });
    return client.post('/emotions/voice', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  submitFaceEmotion: (photoUri) => {
    if (MOCK_MODE) return mockOk();
    const form = new FormData();
    form.append('image', { uri: photoUri, name: 'face.jpg', type: 'image/jpeg' });
    return client.post('/emotions/face', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  submitSelfReport: (emotion) =>
    MOCK_MODE ? mockOk() : client.post('/emotions/self-report', { emotion }),

  // Sends whichever signals were captured this session and asks the backend
  // to fuse them (Emotion AI) into one overall emotion result.
  fuseAndSubmit: (payload) =>
    MOCK_MODE ? mockFuseAndSubmit(payload) : client.post('/emotions/fuse', payload),
  // payload: { date, text, selfReport, voiceResultId, faceResultId }

  getEmotionHistory: (params) =>
    MOCK_MODE ? mockGetEmotionHistory() : client.get('/emotions', { params }),
};

export default emotionApi;
