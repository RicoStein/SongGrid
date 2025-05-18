import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import styles from './LoginScreenStyles';

const CLIENT_ID = '5302b82cbc5c41e8ab83e4ea80f6e56d';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

// ⚠️ Redirect URI für Expo Go
const REDIRECT_URI = AuthSession.makeRedirectUri({
  useProxy: true,
} as any);

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) {
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

          console.log('🔐 Spotify TokenResponse:', tokenResult);

          if (tokenResult.access_token) {
            console.log('✅ Zugriffstoken erfolgreich empfangen.');
            onLoginSuccess(tokenResult.access_token);
          } else {
            console.error('❌ Token-Tausch fehlgeschlagen:', tokenResult);
          }
        } catch (error) {
          console.error('❌ Fehler beim Token-Abruf:', error);
        }
      }
    }

    handleAuth();
  }, [response]);

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground}>
        <Text style={styles.welcomeText}>Willkommen bei</Text>
        <Text style={styles.titleText}>SongGrid</Text>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <TouchableOpacity
          disabled={!request}
          style={styles.loginButton}
          onPress={() => promptAsync({ useProxy: true } as any)}
        >
          <Text style={styles.loginButtonText}>Mit Spotify anmelden</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBackground}>
        <View style={styles.socialsContainer}>
          <TouchableOpacity onPress={() => openLink('https://x.com/deinprofil')}>
            <Image source={require('../../assets/x.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://instagram.com/deinprofil')}>
            <Image source={require('../../assets/instagram.png')} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
