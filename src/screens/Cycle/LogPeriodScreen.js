import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { colors, type, spacing } from '../../theme/theme';
import { Input } from '../../components/Input';
import { Button, Chip, Eyebrow } from '../../components/UI';
import cycleApi from '../../api/cycleApi';

const FLOWS = ['Light', 'Medium', 'Heavy'];
const SYMPTOMS = [
  'Cramps',
  'Headache',
  'Bloating',
  'Fatigue',
  'Backache',
  'Mood swings',
];

export default function LogPeriodScreen({ navigation }) {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState('');
  const [flow, setFlow] = useState('Medium');
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
    if (!startDate) {
      Alert.alert(
        'Start date needed',
        'Please enter the date your period started.'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await cycleApi.logPeriod({
        startDate,
        endDate: endDate || undefined,
        flow: flow.toLowerCase(),
        symptoms,
      });

      console.log('Period Saved:', response.data);

      Alert.alert(
        'Logged',
        'Your period has been added to your cycle history.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CycleCalendar'),
          },
        ]
      );
    } catch (e) {
      console.log('Log Period Error:', e.response?.data || e.message);

      Alert.alert(
        "Couldn't save",
        e.response?.data?.message || e.message
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
      <Eyebrow>Log a period</Eyebrow>

      <Text style={[type.h1, { marginTop: 6, marginBottom: spacing.lg }]}>
        Add to your history
      </Text>

      <Input
        label="Start date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
        placeholder="2026-09-15"
      />

      <Input
        label="End date (optional)"
        value={endDate}
        onChangeText={setEndDate}
        placeholder="2026-09-19"
      />

      <Text style={type.label}>Flow</Text>

      <View
        style={[styles.chipRow, { marginTop: 8, marginBottom: spacing.md }]}
      >
        {FLOWS.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={flow === item}
            onPress={() => setFlow(item)}
          />
        ))}
      </View>

      <Text style={type.label}>Symptoms during this period</Text>

      <View
        style={[styles.chipRow, { marginTop: 8, marginBottom: spacing.lg }]}
      >
        {SYMPTOMS.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={symptoms.includes(item)}
            onPress={() => toggleSymptom(item)}
          />
        ))}
      </View>

      <Button
        title="Save period"
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
    paddingBottom: 60,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});