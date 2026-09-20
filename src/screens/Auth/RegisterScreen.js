import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { colors, type, spacing } from '../../theme/theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing info', 'Fill in every field to create your account.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Passwords don’t match', 'Double check both password fields.');
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password });
      // Navigation to HealthProfile setup happens automatically via
      // RootNavigator once `user.onboarded` is false.
    } catch (e) {
      Alert.alert('Couldn’t create account', e?.response?.data?.message || 'Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
      <Text style={[type.h1, { marginTop: spacing.xl }]}>Create your account</Text>
      <Text style={[type.bodyMuted, { marginBottom: spacing.lg }]}>
        A few details to get started — the rest builds up as you use Lunara.
      </Text>
      <Input label="Name" value={name} onChangeText={setName} placeholder="Your name" />
      <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
      <Input label="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry />
      <Input label="Confirm password" value={confirm} onChangeText={setConfirm} placeholder="Re-enter password" secureTextEntry />
      <Button title="Continue" onPress={onSubmit} loading={loading} style={{ marginTop: spacing.sm }} />
      <Button title="Back to sign in" variant="ghost" onPress={() => navigation.goBack()} style={{ marginTop: spacing.sm }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, backgroundColor: colors.moonlight, flexGrow: 1 },
});
