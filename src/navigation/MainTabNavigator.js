import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/theme';

import DashboardScreen from '../screens/Home/DashboardScreen';
import DailyCheckInScreen from '../screens/DailyCheckIn/DailyCheckInScreen';
import EmotionInputScreen from '../screens/Emotion/EmotionInputScreen';
import SymptomTrackingScreen from '../screens/Symptoms/SymptomTrackingScreen';
import CycleCalendarScreen from '../screens/Cycle/CycleCalendarScreen';
import LogPeriodScreen from '../screens/Cycle/LogPeriodScreen';
import PCOSRiskResultScreen from '../screens/AI/PCOSRiskResultScreen';
import AIInsightsScreen from '../screens/AI/AIInsightsScreen';
import RecommendationsScreen from '../screens/AI/RecommendationsScreen';
import ProgressAnalyticsScreen from '../screens/Progress/ProgressAnalyticsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const HomeStackNav = createNativeStackNavigator();
const CycleStackNav = createNativeStackNavigator();
const InsightsStackNav = createNativeStackNavigator();
const ProgressStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

const stackOptions = { headerShown: false };

function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={stackOptions}>
      <HomeStackNav.Screen name="DashboardHome" component={DashboardScreen} />
      <HomeStackNav.Screen name="CheckIn" component={DailyCheckInScreen} />
      <HomeStackNav.Screen name="Emotion" component={EmotionInputScreen} />
      <HomeStackNav.Screen name="Symptoms" component={SymptomTrackingScreen} />
      <HomeStackNav.Screen name="Cycle" component={CycleCalendarScreen} />
      <HomeStackNav.Screen name="LogPeriod" component={LogPeriodScreen} />
      <HomeStackNav.Screen name="PCOSResult" component={PCOSRiskResultScreen} />
      <HomeStackNav.Screen name="Recommendations" component={RecommendationsScreen} />
      <HomeStackNav.Screen name="Progress" component={ProgressAnalyticsScreen} />
    </HomeStackNav.Navigator>
  );
}

function CycleStack() {
  return (
    <CycleStackNav.Navigator screenOptions={stackOptions}>
      <CycleStackNav.Screen name="CycleCalendar" component={CycleCalendarScreen} />
      <CycleStackNav.Screen name="LogPeriod" component={LogPeriodScreen} />
    </CycleStackNav.Navigator>
  );
}

function InsightsStack() {
  return (
    <InsightsStackNav.Navigator screenOptions={stackOptions}>
      <InsightsStackNav.Screen name="AIInsights" component={AIInsightsScreen} />
      <InsightsStackNav.Screen name="PCOSResult" component={PCOSRiskResultScreen} />
      <InsightsStackNav.Screen name="Recommendations" component={RecommendationsScreen} />
    </InsightsStackNav.Navigator>
  );
}

function ProgressStack() {
  return (
    <ProgressStackNav.Navigator screenOptions={stackOptions}>
      <ProgressStackNav.Screen name="ProgressAnalytics" component={ProgressAnalyticsScreen} />
    </ProgressStackNav.Navigator>
  );
}

function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={stackOptions}>
      <ProfileStackNav.Screen name="ProfileHome" component={ProfileScreen} />
    </ProfileStackNav.Navigator>
  );
}

const ICONS = {
  Home: '🏠',
  CycleTab: '🌙',
  InsightsTab: '✨',
  ProgressTab: '📊',
  ProfileTab: '👤',
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.lavenderDeep,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: { borderTopColor: colors.border, height: 64, paddingTop: 6, paddingBottom: 10 },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarIcon: ({ focused }) => <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>{ICONS.Home}</Text> }}
      />
      <Tab.Screen
        name="CycleTab"
        component={CycleStack}
        options={{ title: 'Cycle', tabBarIcon: ({ focused }) => <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>{ICONS.CycleTab}</Text> }}
      />
      <Tab.Screen
        name="InsightsTab"
        component={InsightsStack}
        options={{ title: 'Insights', tabBarIcon: ({ focused }) => <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>{ICONS.InsightsTab}</Text> }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressStack}
        options={{ title: 'Progress', tabBarIcon: ({ focused }) => <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>{ICONS.ProgressTab}</Text> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: 'Profile', tabBarIcon: ({ focused }) => <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>{ICONS.ProfileTab}</Text> }}
      />
    </Tab.Navigator>
  );
}
