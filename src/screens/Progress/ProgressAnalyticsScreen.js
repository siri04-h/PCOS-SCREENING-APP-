import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { colors, type, spacing } from '../../theme/theme';
import { Card, Eyebrow, EmptyState } from '../../components/UI';
import { checkinApi } from '../../api/checkinApi';
import cycleApi from '../../api/cycleApi';

const screenWidth = Dimensions.get('window').width - spacing.lg * 2;

const chartConfig = {
  backgroundGradientFrom: colors.white,
  backgroundGradientTo: colors.white,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(139,118,196,${opacity})`,
  labelColor: () => colors.inkMuted,
  propsForDots: {
    r: '4',
  },
};

export default function ProgressAnalyticsScreen() {
  const [logs, setLogs] = useState([]);
  const [cycles, setCycles] = useState([]);

  const load = useCallback(async () => {
    try {
      const [logsRes, cyclesRes] = await Promise.all([
        checkinApi.getDailyLogHistory({ limit: 14 }),
        cycleApi.getCycles({ limit: 6 }),
      ]);

      const dailyLogs = logsRes.data.dailyLogs || [];
      const cycleList = cyclesRes.data.cycles || [];

      console.log('Daily Logs:', dailyLogs);
      console.log('Cycles:', cycleList);

      setLogs(dailyLogs.reverse());
      setCycles(cycleList);
    } catch (error) {
      console.log('Progress load error:', error.response?.data || error.message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  let chartLogs = [...logs];

  if (chartLogs.length === 1) {
    chartLogs = [...chartLogs, { ...chartLogs[0] }];
  }

  const hasLogs = chartLogs.length > 0;

  const labels = chartLogs.map((l) => formatDate(l.date));
  const sleepData = chartLogs.map((l) => l.sleepHours || 0);
  const stressData = chartLogs.map((l) => l.stressLevel || 0);
  const energyData = chartLogs.map((l) => l.energyLevel || 0);

  const cycleLengths = cycles
    .map((c) => c.lengthDays)
    .filter((v) => typeof v === 'number');

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Eyebrow>Progress</Eyebrow>

      <Text style={[type.h1, { marginTop: 6, marginBottom: spacing.lg }]}>
        Trends over time
      </Text>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={type.h2}>Sleep (hours)</Text>

        {hasLogs ? (
          <LineChart
            data={{
              labels: thinLabels(labels),
              datasets: [{ data: sleepData }],
            }}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        ) : (
          <EmptyState
            icon="😴"
            message="Log a daily check-in to see your sleep trend."
          />
        )}
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={type.h2}>Stress vs. Energy</Text>

        {hasLogs ? (
          <LineChart
            data={{
              labels: thinLabels(labels),
              datasets: [
                {
                  data: stressData,
                  color: () => colors.coral,
                },
                {
                  data: energyData,
                  color: () => colors.sage,
                },
              ],
              legend: ['Stress', 'Energy'],
            }}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        ) : (
          <EmptyState
            icon="⚡"
            message="Log a daily check-in to compare stress and energy."
          />
        )}
      </Card>

      <Card>
        <Text style={type.h2}>Cycle length history</Text>

        {cycleLengths.length > 0 ? (
          <View style={{ marginTop: spacing.sm }}>
            {cycles.map((cycle) => (
              <View key={cycle._id} style={styles.cycleRow}>
                <Text style={type.bodyMuted}>
                  {formatDate(cycle.startDate)}
                </Text>

                <Text style={type.label}>
                  {cycle.lengthDays} days
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="🌙"
            message="Log a couple of periods to track cycle length over time."
          />
        )}
      </Card>
    </ScrollView>
  );
}

function formatDate(date) {
  const d = new Date(date);

  return `${String(d.getDate()).padStart(2, '0')}/${String(
    d.getMonth() + 1
  ).padStart(2, '0')}`;
}

function thinLabels(labels) {
  if (labels.length <= 7) return labels;

  const step = Math.ceil(labels.length / 7);

  return labels.map((label, index) => (index % step === 0 ? label : ''));
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.lg,
    backgroundColor: colors.moonlight,
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 60,
  },

  chart: {
    marginTop: spacing.sm,
    borderRadius: 16,
  },

  cycleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
});