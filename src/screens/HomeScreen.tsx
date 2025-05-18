import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

type SpotifyUser = {
  display_name: string;
  id: string;
  images: { url: string }[];
};

export default function HomeScreen({ accessToken }: { accessToken: string }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const [profilePic, setProfilePic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Spotify Userdaten laden
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
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
    <View style={{ flex: 1 }}>
      <Text style={styles.welcomeText}>Willkommen im HomeScreen!</Text>

      {/* Avatar oben rechts */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.avatarContainer}>
        <Image source={profilePic} style={styles.avatar} />
      </TouchableOpacity>

      {/* Profil Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Profil Einstellungen</Text>

            <Text>UserID: {userId}</Text>

            <Text>Anzeigename:</Text>
            <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} />

            <Image source={profilePic} style={styles.avatarLarge} />

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={{ color: 'white' }}>Schließen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 24,
    marginTop: 100,
    marginLeft: 20,
    fontWeight: 'bold',
    color: '#0B3D91',
  },
  avatarContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0B3D91',
  },
  avatar: {
    width: 60,
    height: 60,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 15,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderColor: '#0B3D91',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: '#0B3D91',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
