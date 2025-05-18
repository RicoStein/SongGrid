import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Alert,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function CustomDrawerContent(props: any) {
  const { navigation, onLogout } = props;

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Profil bearbeiten"
        onPress={() => navigation.navigate('Profile')}
      />
      <DrawerItem
        label="Einstellungen"
        onPress={() => navigation.navigate('Settings')}
      />
      <DrawerItem
        label="Abmelden"
        onPress={() => {
          Alert.alert(
            'Abmelden',
            'Willst du dich wirklich abmelden?',
            [
              { text: 'Abbrechen', style: 'cancel' },
              {
                text: 'Ja',
                onPress: () => {
                  onLogout();
                  navigation.closeDrawer();
                },
              },
            ],
            { cancelable: true }
          );
        }}
      />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator({
  onLogout,
  accessToken,
}: {
  onLogout: () => void;
  accessToken: string;
}) {
  return (
    <Drawer.Navigator
    id={undefined}
      screenOptions={({ navigation }) => ({
        drawerStyle: { width: '75%' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={styles.burgerButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.burgerLine} />
            <View style={[styles.burgerLine, { marginVertical: 4 }]} />
            <View style={styles.burgerLine} />
          </TouchableOpacity>
        ),
        headerRight: () => null,
        headerTitleAlign: 'center',
      })}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onLogout={onLogout} />
      )}
    >
      <Drawer.Screen name="Home">
        {() => <HomeScreen accessToken={accessToken} />}
      </Drawer.Screen>
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings">
        {() => <SettingsScreen accessToken={accessToken} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  function LoginWrapper(props: any) {
    return <LoginScreen {...props} onLoginSuccess={setAccessToken} />;
  }

  function handleLogout() {
    setAccessToken(null);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        {accessToken ? (
          <Stack.Screen name="Drawer">
            {() => (
              <DrawerNavigator
                onLogout={handleLogout}
                accessToken={accessToken}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login" component={LoginWrapper} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  burgerButton: {
    paddingLeft: 15,
    paddingVertical: 10,
  },
  burgerLine: {
    width: 28,
    height: 4,
    backgroundColor: '#0B3D91',
    borderRadius: 2,
  },
});
