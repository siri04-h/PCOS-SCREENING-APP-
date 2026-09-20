import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, type, spacing } from '../../theme/theme';
import { Input } from '../../components/Input';
import { Button, Card, Chip, Eyebrow } from '../../components/UI';
import { symptomsApi } from '../../api/checkinApi';

const CATEGORIES = {
  Physical: ['Cramps', 'Bloating', 'Headache', 'Breast tenderness', 'Back pain', 'Nausea', 'Fatigue'],
  'Skin & hair': ['Acne', 'Excess hair growth', 'Hair thinning', 'Oily skin'],
  Digestive: ['Bloating', 'Constipation', 'Diarrhea', 'Appetite changes'],
};

export default function SymptomTrackingScreen() {
  const [selected, setSelected] = useState([]);
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await symptomsApi.getSymptomHistory({ limit: 10 });
      setHistory(data || []);
    } catch (e) {}
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const toggle = (s) =>
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const onSubmit = async () => {
    if (selected.length === 0) {
      Alert.alert('Pick at least one', 'Select the symptoms you’re noticing today.');
      return;
    }
    setLoading(true);
    try {
      await symptomsApi.logSymptoms({
        date: new Date().toISOString().slice(0, 10),
        symptoms: selected,
        notes,
      });
      setSelected([]);
      setNotes('');
      load();
      Alert.alert('Logged', 'Today’s symptoms have been saved.');
    } catch (e) {
      Alert.alert('Couldn’t save', 'Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
      <Eyebrow>Symptom tracking</Eyebrow>
      <Text style={[type.h1, { marginTop: 6, marginBottom: spacing.lg }]}>What are you noticing?</Text>

      {Object.entries(CATEGORIES).map(([cat, items]) => (
        <Card key={cat} style={{ marginBottom: spacing.md }}>
          <Text style={type.h2}>{cat}</Text>
          <View style={[styles.chipRow, { marginTop: spacing.sm }]}>
            {items.map((s) => (
              <Chip key={s} label={s} selected={selected.includes(s)} onPress={() => toggle(s)} />
            ))}
          </View>
        </Card>
      ))}

      <Input label="Notes (optional)" value={notes} onChangeText={setNotes} placeholder="Anything else you'd like to add" />
      <Button title="Save symptoms" onPress={onSubmit} loading={loading} style={{ marginBottom: spacing.xl }} />

      <Text style={type.h2}>Recent history</Text>
      {history.length === 0 ? (
        <Text style={[type.bodyMuted, { marginTop: spacing.sm }]}>No symptoms logged yet.</Text>
      ) : (
        history.map((h, i) => (
          <Card key={h.id || i} style={{ marginTop: spacing.sm }}>
            <Text style={type.label}>{h.date}</Text>
            <Text style={type.bodyMuted}>{(h.symptoms || []).join(', ')}</Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, backgroundColor: colors.moonlight, flexGrow: 1, paddingTop: 60, paddingBottom: 60 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
