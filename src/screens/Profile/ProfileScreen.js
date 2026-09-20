import React from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { colors, type, spacing } from '../../theme/theme';
import { Card, Button, Eyebrow } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const hp = user?.healthProfile || {};

const onLogout = async () => {
  await logout();
};

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Eyebrow>Profile</Eyebrow>
      <Text style={[type.h1, { marginTop: 6, marginBottom: spacing.lg }]}>{user?.name}</Text>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={type.h2}>Account</Text>
        <Row label="Email" value={user?.email} />
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={type.h2}>Health profile</Text>
        <Row label="Age" value={hp.age} />
        <Row label="Height" value={hp.heightCm ? `${hp.heightCm} cm` : undefined} />
        <Row label="Weight" value={hp.weightKg ? `${hp.weightKg} kg` : undefined} />
        <Row label="Avg. cycle length" value={hp.avgCycleLength ? `${hp.avgCycleLength} days` : undefined} />
        <Row label="Family history of PCOS" value={hp.pcosFamilyHistory} />
      </Card>

      <Card style={{ marginBottom: spacing.lg }}>
        <Text style={type.h2}>Privacy</Text>
        <Text style={[type.bodyMuted, { marginTop: 6 }]}>
          Your data is only shared with a healthcare professional when you choose to share a report.
          Camera and microphone are used only during emotion check-ins you start yourself.
        </Text>
      </Card>

      <Button title="Sign out" variant="outline" onPress={onLogout} />
    </ScrollView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={type.bodyMuted}>{label}</Text>
      <Text style={type.label}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, backgroundColor: colors.moonlight, flexGrow: 1, paddingTop: 60, paddingBottom: 60 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
});
