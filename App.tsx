import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  if (!accessToken) {
    return <LoginScreen onLoginSuccess={(token) => setAccessToken(token)} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
      id={undefined}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = 'ellipse';

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Mehr') {
              iconName = 'grid';
            } else if (route.name === 'Profil') {
              iconName = 'person';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0B3D91',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home">
          {() => <HomeScreen accessToken={accessToken} />}
        </Tab.Screen>
        <Tab.Screen name="Mehr" component={PlaceholderScreen} />
        <Tab.Screen name="Profil">
          {() => <SettingsScreen accessToken={accessToken} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
