import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hier kommen bald Einstellungen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: '#555' },
});

/*
import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

type Props = {
  accessToken: string;
};

export default function SettingsScreen({ accessToken }: Props) {
  const handlePlayPopSong = async () => {
    console.log('🎯 Button gedrückt – Zugriffstoken vorhanden:', !!accessToken);

    try {
      console.log('📚 Verfügbare Genres abrufen...');
      await fetchAvailableGenres(accessToken);

      console.log('📱 Geräte abrufen...');
      const targetDeviceId = await getMobileDeviceId(accessToken);

      if (!targetDeviceId) {
        Alert.alert('Kein Handy erkannt', 'Öffne die Spotify-App auf deinem Smartphone.');
        return;
      }

      console.log('✅ Zielgerät erkannt. Umschalten auf Gerät ID:', targetDeviceId);
      await transferPlaybackToDevice(accessToken, targetDeviceId);

      console.log('📡 Pop-Song abrufen...');
      const uri = await getRandomPopSong(accessToken);

      if (!uri) {
        console.warn('⚠️ Kein Song-URI erhalten.');
        Alert.alert('Fehler', 'Kein Song gefunden.');
        return;
      }

      console.log('▶️ Versuche Song auf Handy abzuspielen...');
      await playSong(uri, accessToken);

      await getCurrentPlayback(accessToken);

      Alert.alert('🎵 Song sollte jetzt auf dem Handy laufen!');
    } catch (err) {
      console.error('❌ Fehler im Button-Handler:', err);
      Alert.alert('Fehler', 'Song konnte nicht abgespielt werden.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profil bearbeiten (hier deine Formulare)</Text>
      <Button title="🎧 Zufälligen Pop-Song abspielen" onPress={handlePlayPopSong} />
    </View>
  );
}

// 📚 Genres abrufen (optional)
async function fetchAvailableGenres(accessToken: string) {
  try {
    const res = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log('📡 Genre-Endpunkt Antwortstatus:', res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.warn('❗ Fehler beim Abrufen der Genres:', errText);
      return;
    }

    const data = await res.json();
    console.log('✅ Verfügbare Genres:', data.genres);
  } catch (error) {
    console.error('❌ Fehler beim Genre-Abruf:', error);
  }
}

// 📱 Finde dein Handy als Zielgerät
async function getMobileDeviceId(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await res.json();
    const devices = data.devices;

    console.log('📱 Alle Geräte:', devices);

    // Geräte mit Typ „Smartphone“ bevorzugt
    const mobileDevice = devices.find((device: any) =>
      device.type === 'Smartphone'
    );

    if (mobileDevice) {
      console.log('📲 Zielgerät gefunden:', mobileDevice.name);
      return mobileDevice.id;
    }

    console.warn('⚠️ Kein Mobilgerät gefunden.');
    return null;
  } catch (error) {
    console.error('❌ Fehler beim Abrufen der Geräte:', error);
    return null;
  }
}


// 🔄 Umschalten des Wiedergabegeräts
async function transferPlaybackToDevice(accessToken: string, deviceId: string) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false,
      }),
    });

    console.log('🔁 Transfer response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('⚠️ Fehler beim Wechseln des Geräts:', errorText);
    }
  } catch (error) {
    console.error('❌ Fehler in transferPlaybackToDevice():', error);
  }
}

// 🎶 Pop-Song holen
async function getRandomPopSong(accessToken: string): Promise<string | null> {
  try {
    const url = 'https://api.spotify.com/v1/recommendations?seed_genres=pop&seed_tracks=4uLU6hMCjMI75M1A2tKUQC&limit=1&market=DE';
    console.log('🌐 Fetching:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('🔍 Antwortstatus von getRandomPopSong:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('⚠️ API Error:', errorText);
      return getFallbackTrack();
    }

    const data = await response.json();
    if (data.tracks && data.tracks.length > 0) {
      const trackUri = data.tracks[0].uri;
      console.log('🎶 Song URI:', trackUri);
      return trackUri;
    }

    console.warn('⚠️ Keine Songs gefunden.');
    return getFallbackTrack();
  } catch (error) {
    console.error('❌ Fehler in getRandomPopSong:', error);
    return getFallbackTrack();
  }
}


// 🧻 Fallback-Song
function getFallbackTrack(): string {
  const fallbackUri = 'spotify:track:4uLU6hMCjMI75M1A2tKUQC'; // Rick Astley
  console.warn('🔁 Fallback verwendet:', fallbackUri);
  return fallbackUri;
}

// ▶️ Song starten
async function playSong(uri: string, accessToken: string) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [uri] }),
    });

    console.log('🔄 playSong Status:', response.status);

    if (response.status !== 204) {
      const errorText = await response.text();
      console.error('⚠️ Fehler beim Abspielen:', errorText);
    } else {
      console.log('✅ Song gestartet!');
    }
  } catch (error) {
    console.error('❌ Fehler in playSong():', error);
  }
}

// 🔍 Playback anzeigen
async function getCurrentPlayback(accessToken: string) {
  try {
    const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.status === 204) {
      console.log('⏹️ Kein Song läuft.');
      return;
    }

    const data = await res.json();
    const track = data?.item;
    if (track) {
      const artists = track.artists.map((a: any) => a.name).join(', ');
      console.log(`🎧 Läuft: ${track.name} – ${artists}`);
    } else {
      console.log('🕵️ Kein Track-Objekt.');
    }
  } catch (error) {
    console.error('❌ Fehler beim Playback-Abruf:', error);
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  heading: { fontSize: 18, marginBottom: 20 },
});
*/