import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSpotify } from '../context/SpotifyContext';

type SpotifyUser = {
  display_name: string;
  id: string;
  images: { url: string }[];
};

export default function ProfileScreen() {
  const { accessToken } = useSpotify();
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const [profilePic, setProfilePic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (!accessToken) return;

      try {
        const res = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Spotify API returned ${res.status}`);
        }

        const data: SpotifyUser = await res.json();
        setDisplayName(data.display_name ?? 'Spotify Nutzer');
        setUserId('#' + (data.id ?? 'unbekannt'));

        if (data.images && data.images.length > 0) {
          setProfilePic({ uri: data.images[0].url });
        } else {
          setProfilePic(require('../../assets/default_avatar.png'));
        }
      } catch (error) {
        console.error('Fehler beim Laden der Userdaten', error);
        setDisplayName('Spotify Nutzer');
        setUserId('#unbekannt');
        setProfilePic(require('../../assets/default_avatar.png'));
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [accessToken]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0B3D91" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={profilePic} style={styles.avatar} />
      <Text style={styles.id}>UserID: {userId}</Text>
      <Text style={styles.label}>Anzeigename:</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 80 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  id: { marginBottom: 10, fontSize: 16 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  input: {
    width: '80%',
    borderColor: '#0B3D91',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
