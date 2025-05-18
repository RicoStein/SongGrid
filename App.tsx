import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';

import ClassicSettingsScreen from './src/screens/ClassicSettingsScreen';
import ChallengeSettingsScreen from './src/screens/ChallengeSettingsScreen';
import PartySettingsScreen from './src/screens/PartySettingsScreen';

import { SpotifyProvider, useSpotify } from './src/context/SpotifyContext';
import { RootStackParamList, RootTabParamList } from './src/navigation/types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'ellipse';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Einstellungen') iconName = 'settings';
          else if (route.name === 'Profil') iconName = 'person';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0B3D91',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Einstellungen" component={SettingsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootApp() {
  const { accessToken } = useSpotify();

  if (!accessToken) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined}>
        <Stack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ClassicSettings" component={ClassicSettingsScreen} />
        <Stack.Screen name="ChallengeSettings" component={ChallengeSettingsScreen} />
        <Stack.Screen name="PartySettings" component={PartySettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SpotifyProvider>
      <RootApp />
    </SpotifyProvider>
  );
}
