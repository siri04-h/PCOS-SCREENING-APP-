const axios = require('axios');

const FASTAPI_URL =
  process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

const fastApiClient = axios.create({
  baseURL: FASTAPI_URL,
  timeout: 15000,
});

const predictPCOS = async (payload) => {
  const response = await fastApiClient.post('/predict', payload);

  return response.data;
};

module.exports = {
  predictPCOS,
};