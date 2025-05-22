import React from 'react';
import { Easing } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ClassicSettingsScreen from './src/screens/ClassicSettingsScreen';
import ChallengeSettingsScreen from './src/screens/ChallengeSettingsScreen';
import PartySettingsScreen from './src/screens/PartySettingsScreen';
import GameOverlayScreen from './src/screens/GameOverlayScreen';
import TransitionScreen from './src/screens/TransitionScreen';

import { SpotifyProvider, useSpotify } from './src/context/SpotifyContext';
import { RootStackParamList, RootTabParamList } from './src/navigation/types';

import { TransitionSpecs } from '@react-navigation/stack';
import type { StackNavigationOptions } from '@react-navigation/stack';

const FadeTransition: StackNavigationOptions = {
  gestureDirection: 'horizontal', // ✅ korrekt typisiert
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 600,
        easing: Easing.out(Easing.ease),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 600,
        easing: Easing.in(Easing.ease),
      },
    },
  },
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
  headerShown: false,
};

// Tabs für Hauptmenü
const Tab = createBottomTabNavigator<RootTabParamList>();
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

// Auth Stack mit Animation
const AuthStack = createStackNavigator<RootStackParamList>();
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0f0528' },
        ...FadeTransition, // ✅ Unsere eigene Transition
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="Transition" component={TransitionScreen} />
    </AuthStack.Navigator>
  );
}

// App-Stack mit In-App Screens
const AppStack = createNativeStackNavigator<RootStackParamList>();
function AppNavigator() {
  return (
    <AppStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Tabs" component={MainTabs} />
      <AppStack.Screen
        name="ClassicSettings"
        component={ClassicSettingsScreen}
        options={{ headerShown: true, title: 'Classic Mode' }}
      />
      <AppStack.Screen name="ChallengeSettings" component={ChallengeSettingsScreen} />
      <AppStack.Screen name="PartySettings" component={PartySettingsScreen} />
      <AppStack.Screen
        name="GameOverlay"
        component={GameOverlayScreen}
        options={{ presentation: 'transparentModal', headerShown: false }}
      />
    </AppStack.Navigator>
  );
}

// Root: Entscheidet zwischen Auth & App
function RootAppNavigator() {
  const { accessToken } = useSpotify();

  return (
    <NavigationContainer>
      {accessToken ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

// Haupt-App
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0f0528' }}>
      <SpotifyProvider>
        <RootAppNavigator />
      </SpotifyProvider>
    </GestureHandlerRootView>
  );
}
