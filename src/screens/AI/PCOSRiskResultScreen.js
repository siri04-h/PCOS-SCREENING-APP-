import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, type, spacing, radii, riskColor } from '../../theme/theme';
import { Card, Button, Badge, Eyebrow } from '../../components/UI';
import { predictionApi } from '../../api/predictionApi';

export default function PCOSRiskResultScreen() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await predictionApi.getLatestPcosResult();
      setResult(data);
    } catch (e) {
      // No screening yet is a normal state, not an error to surface.
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const runScreening = async () => {
    setRunning(true);
    try {
      const { data } = await predictionApi.runPcosScreening();
      setResult(data);
    } catch (e) {
      Alert.alert('Couldn’t run screening', 'Make sure you’ve completed your health profile and logged a few cycles first.');
    } finally {
      setRunning(false);
    }
  };

  const color = riskColor(result?.riskLevel);
  const maxContribution = result?.shap?.length
    ? Math.max(...result.shap.map((s) => Math.abs(s.contribution)))
    : 1;

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Eyebrow>PCOS screening</Eyebrow>
      <Text style={[type.h1, { marginTop: 6, marginBottom: spacing.lg }]}>Risk explanation</Text>

      {!result && !loading ? (
        <Card>
          <Text style={type.body}>
            Run an AI screening using your cycle history, symptoms, and health profile. This is a
            wellness screening, not a medical diagnosis.
          </Text>
          <Button title="Run screening" onPress={runScreening} loading={running} style={{ marginTop: spacing.md }} />
        </Card>
      ) : null}

      {result ? (
        <>
          <Card style={styles.resultCard}>
            <Badge label={`${result.riskLevel} risk`} color={color} />
            <Text style={[type.hero, { marginTop: spacing.sm }]}>{result.riskScore}%</Text>
            <Text style={type.bodyMuted}>Estimated likelihood based on your current data</Text>
          </Card>

          <Card style={{ marginTop: spacing.md }}>
            <Text style={type.h2}>Main contributing factors</Text>
            <Text style={[type.bodyMuted, { marginTop: 4, marginBottom: spacing.md }]}>
              Generated with SHAP — each bar shows how much a factor pushed your result up or down.
            </Text>
            {(result.shap || []).map((s, i) => (
              <View key={i} style={styles.shapRow}>
                <Text style={styles.shapLabel} numberOfLines={1}>{s.feature}</Text>
                <View style={styles.shapTrack}>
                  <View
                    style={[
                      styles.shapFill,
                      {
                        width: `${(Math.abs(s.contribution) / maxContribution) * 100}%`,
                        backgroundColor: s.direction === 'increases' ? colors.coral : colors.sage,
                      },
                    ]}
                  />
                </View>
                <Text style={type.caption}>{s.direction === 'increases' ? '↑' : '↓'}</Text>
              </View>
            ))}
          </Card>

          <Card style={{ marginTop: spacing.md }}>
            <Text style={type.h2}>What this means</Text>
            <Text style={[type.body, { marginTop: 6 }]}>
              This screening highlights patterns worth discussing with a healthcare professional —
              it does not diagnose PCOS on its own. Bring this result to your next appointment.
            </Text>
          </Card>

          <Button title="Re-run screening" variant="outline" onPress={runScreening} loading={running} style={{ marginTop: spacing.lg }} />
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, backgroundColor: colors.moonlight, flexGrow: 1, paddingTop: 60, paddingBottom: 60 },
  resultCard: { alignItems: 'flex-start' },
  shapRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  shapLabel: { ...type.caption, width: 120 },
  shapTrack: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.cloud, marginHorizontal: spacing.sm, overflow: 'hidden' },
  shapFill: { height: '100%', borderRadius: 5 },
});
