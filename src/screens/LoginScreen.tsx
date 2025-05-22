import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AuthSession from 'expo-auth-session';
import styles from './LoginScreenStyles';
import { useSpotify } from '../context/SpotifyContext';
import CustomCheckbox from '../components/CustomCheckbox';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const CLIENT_ID = '5302b82cbc5c41e8ab83e4ea80f6e56d';
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};
const REDIRECT_URI = AuthSession.makeRedirectUri({
  useProxy: true,
} as any);

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setAccessToken } = useSpotify();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: [
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'playlist-read-private',
        'streaming',
      ],
      redirectUri: REDIRECT_URI,
      responseType: 'code',
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    async function handleAuth() {
      if (response?.type === 'success' && response.params.code) {
        const code = response.params.code;
        const codeVerifier = request?.codeVerifier || '';

        const body = new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier,
        });

        try {
          const tokenResponse = await fetch(discovery.tokenEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
          });

          const tokenResult = await tokenResponse.json();
          if (tokenResult.access_token) {
            setAccessToken(tokenResult.access_token);
          }
        } catch (error) {
          console.error('Fehler beim Abruf des Tokens', error);
        }
      }
    }

    handleAuth();
  }, [response]);

  const openLink = (url: string) => Linking.openURL(url);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f0528' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={{ flex: 1, backgroundColor: '#0f0528' }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              backgroundColor: '#0f0528',
              paddingHorizontal: 24,
              paddingBottom: 40,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
            />

            <Text style={styles.title}>LOGIN TO YOUR ACCOUNT</Text>
            <Text style={styles.subtitle}>Enter your login information</Text>

            {/* Email Field with Icon */}
            <View style={styles.inputWrapper}>
              <Image source={require('../../assets/email-icon.png')} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#b1b0b6"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Field with Icon + Eye */}
            <View style={styles.inputWrapper}>
              <Image source={require('../../assets/lock-icon.png')} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#b1b0b6"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIconContainer}
              >
                <Image
                  source={
                    showPassword
                      ? require('../../assets/eye-open.png')
                      : require('../../assets/eye-closed.png')
                  }
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Options */}
            <View style={styles.optionsRow}>
              <CustomCheckbox
                value={rememberMe}
                onValueChange={setRememberMe}
                label="Remember me"
              />
              <TouchableOpacity>
                <Text style={styles.forgot}>Forgot password</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => promptAsync({ useProxy: true } as any)}
            >
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>

            {/* Social Icons */}
            <View style={styles.socials}>
              <TouchableOpacity onPress={() => openLink('https://x.com')}>
                <View style={styles.circle}>
                  <Image source={require('../../assets/x.png')} style={styles.icon} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink('https://instagram.com')}>
                <View style={styles.circle}>
                  <Image source={require('../../assets/instagram.png')} style={styles.icon} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink('https://facebook.com')}>
                <View style={styles.circle}>
                  <Image source={require('../../assets/facebook.png')} style={styles.icon} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Sign Up */}
            <Text style={styles.signup}>
              Don’t have an account?{' '}
              <Text
                style={styles.signupLink}
                onPress={() => navigation.navigate('Transition', { target: 'SignUp' })}
              >
                Sign Up
              </Text>
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
