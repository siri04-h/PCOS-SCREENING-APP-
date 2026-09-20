import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Alert } from 'react-native';
import { colors, type, spacing } from '../../theme/theme';
import { Input } from '../../components/Input';
import { Button, Chip, Eyebrow } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

const SYMPTOM_OPTIONS = [
  'Irregular periods',
  'Heavy bleeding',
  'Acne',
  'Excess hair growth',
  'Hair thinning',
  'Weight changes',
  'Fatigue',
  'Mood swings',
  'Bloating',
  'Pelvic pain',
  'Sleep issues',
  'None of these',
];

export default function HealthProfileScreen() {
  const { completeHealthProfile } = useAuth();

  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [avgCycleLength, setAvgCycleLength] = useState('');
  const [avgPeriodLength, setAvgPeriodLength] = useState('');
  const [familyHistory, setFamilyHistory] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (symptom) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const onSubmit = async () => {
    if (!age || !heightCm || !weightKg || !avgCycleLength) {
      Alert.alert(
        'Missing information',
        'Please enter Age, Height, Weight and Average Cycle Length.'
      );
      return;
    }

    setLoading(true);

    try {
      await completeHealthProfile({
        age: Number(age),
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        avgCycleLength: Number(avgCycleLength),
        avgPeriodLength: avgPeriodLength
          ? Number(avgPeriodLength)
          : undefined,
        pcosFamilyHistory: familyHistory,
        knownConditions: [],
        symptomsChecklist: symptoms,
      });

      // No navigation here.
      // RootNavigator will automatically open MainTabNavigator
      // because user.onboarded becomes true.
    } catch (e) {
      Alert.alert(
        'Could not save',
        e?.response?.data?.message || 'Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.body}
      keyboardShouldPersistTaps="handled"
    >
      <Eyebrow>Step 2 of 2</Eyebrow>

      <Text style={[type.h1, { marginTop: 6, marginBottom: spacing.xs }]}>
        Your health profile
      </Text>

      <Text style={[type.bodyMuted, { marginBottom: spacing.lg }]}>
        This stays private and helps personalize your screening.
      </Text>

      <View style={styles.row}>
        <Input
          label="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          placeholder="21"
          style={styles.half}
        />

        <Input
          label="Height (cm)"
          value={heightCm}
          onChangeText={setHeightCm}
          keyboardType="number-pad"
          placeholder="168"
          style={styles.half}
        />
      </View>

      <View style={styles.row}>
        <Input
          label="Weight (kg)"
          value={weightKg}
          onChangeText={setWeightKg}
          keyboardType="number-pad"
          placeholder="70"
          style={styles.half}
        />

        <Input
          label="Avg. cycle length (days)"
          value={avgCycleLength}
          onChangeText={setAvgCycleLength}
          keyboardType="number-pad"
          placeholder="30"
          style={styles.half}
        />
      </View>

      <Input
        label="Avg. period length (days)"
        value={avgPeriodLength}
        onChangeText={setAvgPeriodLength}
        keyboardType="number-pad"
        placeholder="5"
      />

      <Text style={type.label}>Family history of PCOS</Text>

      <View style={[styles.chipRow, { marginTop: 8, marginBottom: spacing.md }]}>
        {['yes', 'no', 'unsure'].map((value) => (
          <Chip
            key={value}
            label={value.charAt(0).toUpperCase() + value.slice(1)}
            selected={familyHistory === value}
            onPress={() => setFamilyHistory(value)}
          />
        ))}
      </View>

      <Text style={type.label}>Symptoms you've noticed</Text>

      <View style={[styles.chipRow, { marginTop: 8, marginBottom: spacing.lg }]}>
        {SYMPTOM_OPTIONS.map((symptom) => (
          <Chip
            key={symptom}
            label={symptom}
            selected={symptoms.includes(symptom)}
            onPress={() => toggleSymptom(symptom)}
          />
        ))}
      </View>

      <Button
        title="Finish setup"
        onPress={onSubmit}
        loading={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.lg,
    backgroundColor: colors.moonlight,
    flexGrow: 1,
    paddingTop: 60,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    width: '48%',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});