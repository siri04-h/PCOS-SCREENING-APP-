const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cycleRoutes = require('./routes/cycleRoutes');
const dailyLogRoutes = require('./routes/dailyLogRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const emotionRoutes = require('./routes/emotionRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Lunara Backend',
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/cycles', cycleRoutes);

app.use('/api/daily-logs', dailyLogRoutes);

app.use('/api/symptoms', symptomRoutes);

app.use('/api/emotions', emotionRoutes);

app.use('/api/predictions', predictionRoutes);

module.exports = app;