import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, type, spacing, radii } from '../../theme/theme';
import { Card, Badge, Eyebrow, EmptyState, Button } from '../../components/UI';
import client from '../../api/client';
import { checkinApi } from '../../api/checkinApi';

export default function AIInsightsScreen() {
  const [prediction, setPrediction] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);

  const load = useCallback(async () => {
    try {
      const [predictionRes, logsRes] = await Promise.allSettled([
        client.get('/predictions/pcos/latest'),
        checkinApi.getDailyLogHistory({ limit: 7 }),
      ]);

      // PCOS Prediction
      if (predictionRes.status === 'fulfilled') {
        const data = predictionRes.value.data?.prediction || predictionRes.value.data;

        setPrediction({
          riskLevel: data.riskLevel || data.risk_level || 'Low',
          riskScore: data.riskScore || data.risk_score || 0,
          shap: data.shap || [],
          createdAt: data.createdAt || data.created_at,
        });
      } else {
        setPrediction(null);
      }

      // Emotion trend from daily logs
      if (logsRes.status === 'fulfilled') {
        const logs =
          logsRes.value.data?.dailyLogs ||
          logsRes.value.data ||
          [];

        const trend = logs
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((log) => ({
            date: log.date,
            emotion: getEmotion(log.energyLevel, log.stressLevel),
            energy: log.energyLevel,
            stress: log.stressLevel,
          }));

        setEmotionHistory(trend);
      } else {
        setEmotionHistory([]);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const runScreening = async () => {
    try {
      await client.post('/predictions/pcos');
      load();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Eyebrow>AI Insights</Eyebrow>

      <Text style={[type.h1, { marginTop: 6, marginBottom: spacing.lg }]}>
        What Lunara has noticed
      </Text>

      {!prediction ? (
        <Card>
          <EmptyState
            icon="✨"
            message="Run your first PCOS screening to see AI insights."
          />
          <Button
            title="Run PCOS Screening"
            onPress={runScreening}
            style={{ marginTop: spacing.md }}
          />
        </Card>
      ) : (
        <Card style={{ marginBottom: spacing.lg }}>
          <Badge
            label={prediction.riskLevel}
            color={
              prediction.riskLevel === 'High'
                ? colors.coral
                : prediction.riskLevel === 'Medium'
                ? colors.lavenderDeep
                : colors.sage
            }
          />

          <Text style={[type.h2, { marginTop: spacing.sm }]}>
            Risk Score: {prediction.riskScore}%
          </Text>

          <Text style={[type.bodyMuted, { marginTop: 6 }]}>
            Based on your health profile and symptom patterns.
          </Text>

          <Text style={[type.caption, { marginTop: spacing.sm }]}>
            Screened on{' '}
            {prediction.createdAt
              ? new Date(prediction.createdAt).toLocaleDateString()
              : new Date().toLocaleDateString()}
          </Text>
        </Card>
      )}

      <Text style={[type.h2, { marginBottom: spacing.sm }]}>
        Emotion trend (last 7 days)
      </Text>

      {emotionHistory.length === 0 ? (
        <Card>
          <EmptyState
            icon="🧠"
            message="Complete a daily check-in to see your emotion trend."
          />
        </Card>
      ) : (
        <Card>
          {emotionHistory.map((item, index) => (
            <View key={index} style={styles.emotionRow}>
              <View>
                <Text style={type.label}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text style={type.bodyMuted}>
                  Energy: {item.energy}/5 • Stress: {item.stress}/5
                </Text>
              </View>

              <View
                style={[
                  styles.emotionBadge,
                  { backgroundColor: getEmotionColor(item.emotion) },
                ]}
              >
                <Text style={styles.badgeText}>{item.emotion}</Text>
              </View>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

function getEmotion(energy, stress) {
  if (energy >= 4 && stress <= 2) return 'Happy';
  if (energy >= 3 && stress <= 3) return 'Calm';
  if (stress >= 4) return 'Stressed';
  if (energy <= 2) return 'Tired';
  return 'Neutral';
}

function getEmotionColor(emotion) {
  switch (emotion) {
    case 'Happy':
      return '#8BC34A';
    case 'Calm':
      return '#7E57C2';
    case 'Stressed':
      return '#E57373';
    case 'Tired':
      return '#B0BEC5';
    default:
      return '#D1C4E9';
  }
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.lg,
    backgroundColor: colors.moonlight,
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 60,
  },

  emotionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },

  emotionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
  },

  badgeText: {
    color: '#fff',
    fontWeight: '600',
  },
});