// A tiny in-memory fake backend used while MOCK_MODE is on (see src/config.js).
// Every function here resolves/rejects the same shape the real axios calls
// would — { data: ... } on success, or a thrown error with a `response`
// object on failure — so screens never need to know the difference.

function ok(data, delayMs = 350) {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), delayMs));
}

function fail(message, status = 400, delayMs = 350) {
  return new Promise((_, reject) =>
    setTimeout(() => {
      const err = new Error(message);
      err.response = { status, data: { message } };
      reject(err);
    }, delayMs)
  );
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ---- in-memory "database" ----------------------------------------------

let nextId = 1;
const newId = () => String(nextId++);

const db = {
  user: null, // the signed-in user object
  cycles: [
    {
      id: newId(),
      startDate: isoDate(daysAgo(38)),
      endDate: isoDate(daysAgo(34)),
      flow: 'medium',
      symptoms: ['Cramps', 'Fatigue'],
      lengthDays: 29,
    },
    {
      id: newId(),
      startDate: isoDate(daysAgo(9)),
      endDate: isoDate(daysAgo(5)),
      flow: 'medium',
      symptoms: ['Cramps', 'Headache'],
      lengthDays: null,
    },
  ],
  dailyLogs: Array.from({ length: 10 }).map((_, i) => ({
    date: isoDate(daysAgo(9 - i)),
    sleepHours: [6.5, 7, 5.5, 7.5, 8, 6, 7, 5, 7.5, 6.5][i],
    stressLevel: [3, 2, 4, 2, 1, 3, 2, 5, 2, 3][i],
    energyLevel: [3, 4, 2, 4, 5, 3, 4, 2, 4, 3][i],
    waterIntakeMl: 1500,
    activityMinutes: 20,
    foodCravings: ['Sweet'],
    physicalSymptoms: [],
  })),
  symptoms: [
    { id: newId(), date: isoDate(daysAgo(2)), symptoms: ['Bloating', 'Acne'], notes: '' },
    { id: newId(), date: isoDate(daysAgo(5)), symptoms: ['Cramps', 'Headache'], notes: '' },
  ],
  emotions: Array.from({ length: 7 }).map((_, i) => ({
    date: isoDate(daysAgo(6 - i)),
    overallEmotion: ['Calm', 'Happy', 'Stressed', 'Neutral', 'Anxious', 'Calm', 'Happy'][i],
  })),
  pcosResult: null, // populated after runPcosScreening() is called
  recommendations: [
    {
      id: newId(),
      title: 'Prioritize sleep this week',
      message: 'Your sleep has been below your usual level for 3 days in a row. Consider a consistent bedtime tonight.',
      basedOn: 'Sleep pattern vs. your baseline',
    },
    {
      id: newId(),
      title: 'Gentle movement may help',
      message: 'Light activity like walking has been linked to lower stress on days you\u2019ve logged it. Even 15 minutes counts.',
      basedOn: 'Stress and activity check-ins',
    },
  ],
  patterns: [
    {
      title: 'Poor sleep + high stress near cycle day 23',
      description: 'Over your last two cycles, low sleep and elevated stress tend to show up together around day 23.',
    },
  ],
};

// ---- auth -----------------------------------------------------------------

export function mockRegister({ name, email }) {
  const user = {
    id: newId(),
    name: name || 'New User',
    email,
    onboarded: false,
    healthProfile: {},
  };
  db.user = user;
  return ok({ token: 'mock-token', user });
}

export function mockLogin({ email }) {
  // Any credentials "work" in mock mode, and log in as a returning user
  // who has already completed onboarding, so you land straight on the
  // dashboard with sample data already in place.
  const user = {
    id: db.user?.id || newId(),
    name: db.user?.name || 'Sneha',
    email: email || 'sneha@example.com',
    onboarded: true,
    healthProfile: db.user?.healthProfile?.age
      ? db.user.healthProfile
      : {
          age: 26,
          heightCm: 162,
          weightKg: 58,
          avgCycleLength: 28,
          avgPeriodLength: 5,
          pcosFamilyHistory: 'no',
        },
  };
  db.user = user;
  return ok({ token: 'mock-token', user });
}

export function mockUpdateHealthProfile(payload) {
  if (!db.user) return fail('Not signed in', 401);
  db.user.healthProfile = payload;
  db.user.onboarded = true;
  return ok({ healthProfile: payload });
}

// ---- cycles -----------------------------------------------------------------

export function mockLogPeriod(payload) {
  const record = {
    id: newId(),
    startDate: payload.startDate,
    endDate: payload.endDate || null,
    flow: payload.flow,
    symptoms: payload.symptoms || [],
    lengthDays: null,
  };
  db.cycles.push(record);
  db.cycles.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  return ok(record);
}

export function mockGetCycles() {
  return ok([...db.cycles].reverse());
}

export function mockGetCycleSummary() {
  const sorted = [...db.cycles].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  const latest = sorted[0];
  const avgCycleLength = 28;
  const avgPeriodLength = 5;
  let currentCycleDay = 14;
  if (latest) {
    const diffDays = Math.floor((Date.now() - new Date(latest.startDate).getTime()) / 86400000) + 1;
    currentCycleDay = Math.max(1, diffDays);
  }
  const predictedNextPeriod = Math.max(0, avgCycleLength - currentCycleDay);
  return ok({ currentCycleDay, avgCycleLength, avgPeriodLength, predictedNextPeriod });
}

// ---- daily logs & symptoms --------------------------------------------------

export function mockSubmitDailyLog(payload) {
  const idx = db.dailyLogs.findIndex((l) => l.date === payload.date);
  if (idx >= 0) db.dailyLogs[idx] = { ...db.dailyLogs[idx], ...payload };
  else db.dailyLogs.push(payload);
  return ok(payload);
}

export function mockGetDailyLogHistory() {
  return ok([...db.dailyLogs].sort((a, b) => new Date(b.date) - new Date(a.date)));
}

export function mockLogSymptoms(payload) {
  const record = { id: newId(), ...payload };
  db.symptoms.unshift(record);
  return ok(record);
}

export function mockGetSymptomHistory() {
  return ok([...db.symptoms]);
}

// ---- emotion -----------------------------------------------------------------

export function mockFuseAndSubmit(payload) {
  const options = ['Calm', 'Happy', 'Stressed', 'Anxious', 'Neutral'];
  const overallEmotion = payload.selfReport || options[Math.floor(Math.random() * options.length)];
  const record = { date: payload.date, overallEmotion };
  const idx = db.emotions.findIndex((e) => e.date === payload.date);
  if (idx >= 0) db.emotions[idx] = record;
  else db.emotions.push(record);
  return ok(record);
}

export function mockGetEmotionHistory() {
  return ok([...db.emotions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7).reverse());
}

// ---- predictions / recommendations -------------------------------------------

export function mockRunPcosScreening() {
  const hasFamilyHistory = db.user?.healthProfile?.pcosFamilyHistory === 'yes';
  const riskScore = hasFamilyHistory ? 68 : 34;
  const riskLevel = riskScore >= 60 ? 'Moderate' : riskScore >= 75 ? 'High' : 'Low';
  const result = {
    riskLevel: riskScore >= 65 ? 'Moderate' : 'Low',
    riskScore,
    shap: [
      { feature: 'Cycle irregularity', contribution: 0.22, direction: 'increases' },
      { feature: 'Family history', contribution: hasFamilyHistory ? 0.19 : 0.04, direction: 'increases' },
      { feature: 'BMI', contribution: 0.11, direction: 'increases' },
      { feature: 'Regular sleep', contribution: 0.08, direction: 'decreases' },
      { feature: 'Activity level', contribution: 0.06, direction: 'decreases' },
    ],
    generatedAt: new Date().toISOString(),
  };
  db.pcosResult = result;
  return ok(result, 900);
}

export function mockGetLatestPcosResult() {
  if (!db.pcosResult) return fail('No screening yet', 404, 200);
  return ok(db.pcosResult);
}

export function mockGetPcosHistory() {
  return ok(db.pcosResult ? [db.pcosResult] : []);
}

export function mockGetRecommendations() {
  return ok([...db.recommendations]);
}

export function mockGetPatterns() {
  return ok(db.dailyLogs.length >= 5 ? [...db.patterns] : []);
}

export function mockGetBaseline() {
  if (db.dailyLogs.length < 4) return ok(null);
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const sleepVals = db.dailyLogs.map((l) => l.sleepHours).filter(Boolean);
  const stressVals = db.dailyLogs.map((l) => l.stressLevel).filter(Boolean);
  const usualSleep = avg(sleepVals.slice(0, -2));
  const currentSleep = avg(sleepVals.slice(-2));
  const usualStress = avg(stressVals.slice(0, -2));
  const currentStress = avg(stressVals.slice(-2));
  return ok({
    sleepHours: { usual: usualSleep.toFixed(1), current: currentSleep.toFixed(1) },
    stressLevel: { usual: usualStress.toFixed(1), current: currentStress.toFixed(1) },
  });
}

export function mockGetAlerts() {
  return ok([]);
}

export function mockShareReport() {
  return ok({ shared: true });
}

export default db;
