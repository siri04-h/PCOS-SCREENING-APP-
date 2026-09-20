import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, type, spacing, radii, shadow, riskColor } from '../../theme/theme';
import { Card, Eyebrow, Badge } from '../../components/UI';
import MoonPhase from '../../components/MoonPhase';
import cycleApi from '../../api/cycleApi';
import { recommendationApi, predictionApi } from '../../api/predictionApi';
import { useAuth } from '../../context/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [cycle, setCycle] = useState(null);
  const [pcos, setPcos] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [cycleRes, pcosRes, recRes] = await Promise.allSettled([
        cycleApi.getCycleSummary(),
        predictionApi.getLatestPcosResult(),
        recommendationApi.getRecommendations(),
      ]);
      if (cycleRes.status === 'fulfilled') setCycle(cycleRes.value.data);
      if (pcosRes.status === 'fulfilled') setPcos(pcosRes.value.data);
      if (recRes.status === 'fulfilled') setRecommendation(recRes.value.data?.[0]);
    } catch (e) {
      // Fail quietly on dashboard load; individual screens surface their own errors.
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const cycleDay = cycle?.currentCycleDay ?? 14;
  const cycleLen = cycle?.avgCycleLength ?? 28;
  const progress = Math.min(1, cycleDay / cycleLen);

  return (
    <ScrollView
      style={{ backgroundColor: colors.moonlight }}
      contentContainerStyle={styles.body}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.lavenderDeep} />}
    >
      <Text style={type.bodyMuted}>Hello, {user?.name?.split(' ')[0] || 'there'}</Text>
      <Text style={type.h1}>Here’s where you are today</Text>

      <Card style={styles.cycleCard}>
        <View style={{ flex: 1 }}>
          <Eyebrow>Cycle day {cycleDay} of {cycleLen}</Eyebrow>
          <Text style={[type.h2, { marginTop: 6 }]}>
            {cycle?.phaseLabel || phaseFromDay(cycleDay, cycleLen)}
          </Text>
          <Text style={[type.bodyMuted, { marginTop: 4 }]}>
            {cycle?.predictedNextPeriod
              ? `Next period predicted in ${cycle.predictedNextPeriod} days`
              : 'Log your period to sharpen this prediction'}
          </Text>
          <Pressable onPress={() => navigation.navigate('Cycle')}>
            <Text style={styles.link}>View cycle calendar →</Text>
          </Pressable>
        </View>
        <MoonPhase progress={progress} size={84} />
      </Card>

      <View style={styles.quickRow}>
        <QuickAction label="Daily check-in" emoji="📝" bg={colors.lavender} onPress={() => navigation.navigate('CheckIn')} />
        <QuickAction label="How I feel" emoji="🧠" bg={colors.blush} onPress={() => navigation.navigate('Emotion')} />
        <QuickAction label="Symptoms" emoji="🩺" bg={colors.sage} onPress={() => navigation.navigate('Symptoms')} />
      </View>

      <Card style={{ marginTop: spacing.md }}>
        <View style={styles.spread}>
          <Eyebrow>PCOS screening</Eyebrow>
          {pcos?.riskLevel ? <Badge label={pcos.riskLevel} color={riskColor(pcos.riskLevel)} /> : null}
        </View>
        {pcos ? (
          <>
            <Text style={[type.h2, { marginTop: 6 }]}>{pcos.riskLevel} risk — {pcos.riskScore}%</Text>
            <Text style={type.bodyMuted}>Based on your latest cycle, symptom and profile data.</Text>
          </>
        ) : (
          <Text style={[type.bodyMuted, { marginTop: 6 }]}>
            Run your first AI screening once you’ve logged a few days of data.
          </Text>
        )}
        <Pressable onPress={() => navigation.navigate('PCOSResult')}>
          <Text style={styles.link}>{pcos ? 'View full explanation →' : 'Learn more →'}</Text>
        </Pressable>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Eyebrow>Today’s insight</Eyebrow>
        <Text style={[type.body, { marginTop: 6 }]}>
          {recommendation?.message ||
            'Complete a daily check-in so Lunara can start noticing your patterns.'}
        </Text>
        <Pressable onPress={() => navigation.navigate('Recommendations')}>
          <Text style={styles.link}>See all recommendations →</Text>
        </Pressable>
      </Card>

      <Pressable style={styles.progressLink} onPress={() => navigation.navigate('Progress')}>
        <Text style={type.label}>Open full progress & analytics →</Text>
      </Pressable>
    </ScrollView>
  );
}

function QuickAction({ label, emoji, bg, onPress }) {
  return (
    <Pressable style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.85 }]} onPress={onPress}>
      <View style={[styles.quickIconBadge, { backgroundColor: bg + '30' }]}>
        <Text style={{ fontSize: 20 }}>{emoji}</Text>
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

function phaseFromDay(day, len) {
  const ratio = day / len;
  if (ratio < 0.2) return 'Menstrual phase';
  if (ratio < 0.45) return 'Follicular phase';
  if (ratio < 0.55) return 'Ovulation window';
  return 'Luteal phase';
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, paddingTop: 60, paddingBottom: 100 },
  cycleCard: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cloud,
    borderWidth: 1,
    borderColor: colors.border,
  },
  spread: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { ...type.label, color: colors.lavenderDeep, marginTop: 10 },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  quickAction: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 4,
    ...shadow.card,
  },
  quickIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: { ...type.caption, textAlign: 'center' },
  progressLink: { alignSelf: 'center', marginTop: spacing.lg },
});
