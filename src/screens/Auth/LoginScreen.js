import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { colors, type, spacing, gradients } from '../../theme/theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Enter your email and password to continue.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      Alert.alert('Couldn’t sign in', e?.response?.data?.message || 'Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={gradients.hero} style={styles.hero}>
        <Svg width={70} height={70} viewBox="0 0 70 70" style={{ marginBottom: spacing.md }}>
          <Circle cx="35" cy="35" r="32" fill={colors.midnightSoft} />
          <Circle cx="35" cy="35" r="32" fill={colors.lavender} opacity={0.5} />
          <Circle cx="24" cy="35" r="26" fill={colors.midnight} />
        </Svg>
        <Text style={styles.heroTitle}>Lunara</Text>
        <Text style={styles.heroSub}>Your cycle, understood.</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={type.h1}>Welcome back</Text>
        <Text style={[type.bodyMuted, { marginBottom: spacing.lg }]}>
          Sign in to see where you are today.
        </Text>
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
        <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
        <Button title="Sign in" onPress={onSubmit} loading={loading} style={{ marginTop: spacing.sm }} />
        <Button
          title="Create an account"
          variant="ghost"
          onPress={() => navigation.navigate('Register')}
          style={{ marginTop: spacing.sm }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 80,
    paddingBottom: 36,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTitle: { fontFamily: type.hero.fontFamily, fontSize: 30, color: colors.inkOnDark },
  heroSub: { fontFamily: type.body.fontFamily, fontSize: 14, color: colors.inkOnDarkMuted, marginTop: 4 },
  body: { padding: spacing.lg, backgroundColor: colors.moonlight, flexGrow: 1 },
});
