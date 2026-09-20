import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, type, spacing } from '../../theme/theme';
import { Card, Button, Eyebrow } from '../../components/UI';
import { checkinApi } from '../../api/checkinApi';
import cycleApi from '../../api/cycleApi';
import client from '../../api/client';

export default function RecommendationsScreen() {
  const [logs, setLogs] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [doctorEmail, setDoctorEmail] = useState('');

  const load = useCallback(async () => {
    const [logsRes, cyclesRes, predictionRes] = await Promise.allSettled([
      checkinApi.getDailyLogHistory({ limit: 14 }),
      cycleApi.getCycles({ limit: 6 }),
      client.get('/predictions/pcos/latest'),
    ]);

    if (logsRes.status === 'fulfilled') {
      setLogs(logsRes.value.data?.dailyLogs || logsRes.value.data || []);
    }

    if (cyclesRes.status === 'fulfilled') {
      setCycles(cyclesRes.value.data?.cycles || cyclesRes.value.data || []);
    }

    if (predictionRes.status === 'fulfilled') {
      setPrediction(predictionRes.value.data?.prediction || predictionRes.value.data);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const recommendations = useMemo(() => {
    const items = [];

    const latest = logs[0];

    if (latest) {
      if (latest.sleepHours && latest.sleepHours < 7) {
        items.push({
          icon: '😴',
          title: 'Improve sleep',
          text: `You slept ${latest.sleepHours} hours. Aim for 7–9 hours to support hormonal balance.`,
        });
      }

      if (latest.waterIntakeMl && latest.waterIntakeMl < 2000) {
        items.push({
          icon: '💧',
          title: 'Drink more water',
          text: `Try reaching about 2 litres of water daily.`,
        });
      }

      if (latest.stressLevel >= 4) {
        items.push({
          icon: '🧘',
          title: 'Reduce stress',
          text: 'Try a 10-minute breathing exercise or a short walk today.',
        });
      }

      if (latest.energyLevel <= 2) {
        items.push({
          icon: '⚡',
          title: 'Boost energy',
          text: 'Include iron-rich foods like spinach, lentils and beans.',
        });
      }

      if (latest.foodCravings?.includes('Chocolate')) {
        items.push({
          icon: '🍫',
          title: 'Chocolate cravings',
          text: 'Pair chocolate with nuts or fruit to help manage cravings.',
        });
      }

      if (latest.foodCravings?.includes('Fried food')) {
        items.push({
          icon: '🥗',
          title: 'Choose lighter meals',
          text: 'Try baked or roasted alternatives for better energy.',
        });
      }
    }

    if (prediction) {
      const risk =
        prediction.riskLevel ||
        prediction.risk_level ||
        'Low';

      if (risk === 'High') {
        items.push({
          icon: '🏥',
          title: 'Consider medical follow-up',
          text: 'Your screening suggests discussing your symptoms with a healthcare professional.',
        });
      } else if (risk === 'Medium') {
        items.push({
          icon: '📅',
          title: 'Track consistently',
          text: 'Continue logging symptoms and cycles to identify patterns.',
        });
      } else {
        items.push({
          icon: '🌱',
          title: 'Keep healthy habits',
          text: 'Continue tracking your cycle, sleep and hydration.',
        });
      }
    }

    if (cycles.length > 0) {
      const latestCycle = cycles[0];

      if (!latestCycle.endDate) {
        items.push({
          icon: '🩸',
          title: 'Update your period',
          text: 'Add your period end date when it finishes for more accurate predictions.',
        });
      }
    }

    if (items.length === 0) {
      items.push({
        icon: '✨',
        title: 'Start building your insights',
        text: 'Log daily check-ins and period history to receive personalized recommendations.',
      });
    }

    return items;
  }, [logs, cycles, prediction]);

  const shareReport = () => {
    if (!doctorEmail.trim()) {
      Alert.alert('Email required', 'Please enter a doctor email.');
      return;
    }

    Alert.alert(
      'Report Ready',
      `Your health summary is ready to share with ${doctorEmail}.`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Eyebrow>For you</Eyebrow>

      <Text style={[type.h1, { marginTop: 6, marginBottom: spacing.lg }]}>
        Personalized recommendations
      </Text>

      <View style={{ gap: spacing.md }}>
        {recommendations.map((item, index) => (
          <Card key={index}>
            <View style={styles.row}>
              <Text style={styles.icon}>{item.icon}</Text>

              <View style={{ flex: 1 }}>
                <Text style={type.h2}>{item.title}</Text>

                <Text style={[type.bodyMuted, { marginTop: 4 }]}>
                  {item.text}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={type.h2}>Share with a healthcare professional</Text>

        <Text style={[type.bodyMuted, { marginTop: 6 }]}>
          Share your cycle history, symptoms, trends and PCOS screening summary.
        </Text>

        <View style={{ marginTop: spacing.md }}>
          <Text style={type.label}>Doctor email</Text>

          <View style={styles.input}>
            <Text
              style={{ color: doctorEmail ? colors.ink : colors.inkMuted }}
              onPress={() => {}}
            >
              {doctorEmail || 'doctor@clinic.com'}
            </Text>
          </View>

          <Button
            title="Share report"
            onPress={shareReport}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.lg,
    backgroundColor: colors.moonlight,
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 60,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  icon: {
    fontSize: 28,
    marginRight: spacing.md,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: colors.white,
    marginTop: 8,
  },
});