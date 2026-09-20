import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import HealthProfileScreen from '../screens/Auth/HealthProfileScreen';

export default function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.moonlight }}>
        <ActivityIndicator color={colors.lavenderDeep} size="large" />
      </View>
    );
  }

  return (
   <NavigationContainer
  documentTitle={{
    enabled: true,
    formatter: (options, route) => options?.title || route?.name || "Lunara",
  }}
>
  {!user ? (
    <AuthNavigator />
  ) : !user.onboarded ? (
    <HealthProfileScreen />
  ) : (
    <MainTabNavigator />
  )}
</NavigationContainer>
  );
}
