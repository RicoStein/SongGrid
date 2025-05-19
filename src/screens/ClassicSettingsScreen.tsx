
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSpotify } from '../context/SpotifyContext';
import FilterGrid from '../components/FilterGrid';
import styles from './ClassicSettingsStyles';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const GENRE_OPTIONS = [
  { id: 'pop', label: 'Pop', colorImage: require('../../assets/filters/pop.png'), bwImage: require('../../assets/filters/bw/pop.png') },
  { id: 'rock', label: 'Rock', colorImage: require('../../assets/filters/rock.png'), bwImage: require('../../assets/filters/bw/rock.png') },
  { id: 'hip-hop', label: 'Hip Hop', colorImage: require('../../assets/filters/hip-hop.png'), bwImage: require('../../assets/filters/bw/hip-hop.png') },
  { id: 'jazz', label: 'Jazz', colorImage: require('../../assets/filters/jazz.png'), bwImage: require('../../assets/filters/bw/jazz.png') },
  { id: 'electronic', label: 'Electronic', colorImage: require('../../assets/filters/electronic.png'), bwImage: require('../../assets/filters/bw/electronic.png') },
  { id: 'party', label: 'Party', colorImage: require('../../assets/filters/electronic.png'), bwImage: require('../../assets/filters/bw/electronic.png') },
  { id: 'schlager', label: 'Schlager', colorImage: require('../../assets/filters/electronic.png'), bwImage: require('../../assets/filters/bw/electronic.png') },
  { id: 'german', label: 'Deutsch', colorImage: require('../../assets/filters/electronic.png'), bwImage: require('../../assets/filters/bw/electronic.png') },
];

const DECADE_OPTIONS = [
  { id: '80s', label: '80er', colorImage: require('../../assets/filters/80s.png'), bwImage: require('../../assets/filters/bw/80s.png') },
  { id: '90s', label: '90er', colorImage: require('../../assets/filters/90s.png'), bwImage: require('../../assets/filters/bw/90s.png') },
  { id: '2000s', label: '2000er', colorImage: require('../../assets/filters/2000s.png'), bwImage: require('../../assets/filters/bw/2000s.png') },
  { id: '2010s', label: '2010er', colorImage: require('../../assets/filters/2010s.png'), bwImage: require('../../assets/filters/bw/2010s.png') },
  { id: '2020s', label: '2020er', colorImage: require('../../assets/filters/2020s.png'), bwImage: require('../../assets/filters/bw/2020s.png') },
];

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const mapDecadeToYear = (label) => {
  const mapping = {
    '80s': '1980-1989',
    '90s': '1990-1999',
    '2000s': '2000-2009',
    '2010s': '2010-2019',
    '2020s': '2020-2025',
  };
  return mapping[label] ?? '2020-2025';
};

export default function ClassicSettingsScreen() {
  const { accessToken } = useSpotify();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const [genresExpanded, setGenresExpanded] = useState(false);
  const [decadesExpanded, setDecadesExpanded] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [selectedRounds, setSelectedRounds] = useState(5);

  const toggleSelection = (id, selected, setSelected) => {
    setSelected(selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]);
  };

  const handlePlaySong = async () => {
    if (!accessToken) {
      Alert.alert('Fehler', 'Kein Zugriffstoken verfügbar.');
      return;
    }

    const genrePool = selectedGenres.length ? selectedGenres : GENRE_OPTIONS.map(o => o.id);
    const decadePool = selectedDecades.length ? selectedDecades : DECADE_OPTIONS.map(o => o.id);
    const combinations = genrePool.flatMap(genre =>
      decadePool.map(decade => ({ genre, year: mapDecadeToYear(decade) }))
    );

    shuffleArray(combinations);
    let foundTrack = null;

    for (const combo of combinations) {
      const query = encodeURIComponent(`genre:"${combo.genre}" year:${combo.year}`);
      const offset = Math.floor(Math.random() * 1000);
      const url = `https://api.spotify.com/v1/search?q=${query}&type=track&market=DE&limit=50&offset=${offset}`;

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) continue;

        const data = await res.json();
        const tracks = data.tracks?.items ?? [];
        if (tracks.length === 0) continue;

        const selected = pickRandom(tracks);
        foundTrack = { ...selected, genre: combo.genre };
        break;
      } catch { }
    }

    if (!foundTrack) {
      Alert.alert('Fehler', 'Kein Song gefunden.');
      return;
    }

    await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [foundTrack.uri] }),
    });

    navigation.navigate('GameOverlay', {
      track: {
        uri: foundTrack.uri,
        title: foundTrack.name,
        artist: foundTrack.artists.map((a) => a.name).join(', '),
        year: foundTrack.album.release_date?.substring(0, 4) || 'Unbekannt',
        genre: foundTrack.genre,
        image: foundTrack.album.images?.[0]?.url,
      }
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Classic Mode</Text>

        {/* Genre Filter */}
        <View style={styles.shadowWrapper}>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity onPress={() => setGenresExpanded(!genresExpanded)} style={styles.dropdownHeader}>
              <Text style={styles.dropdownText}>Genre</Text>
              <Text style={styles.dropdownArrow}>{genresExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {genresExpanded && (
              <View style={styles.dropdownBody}>
                <View style={styles.dividerLine} />
                <FilterGrid
                  options={GENRE_OPTIONS}
                  selected={selectedGenres}
                  onToggle={(id) => toggleSelection(id, selectedGenres, setSelectedGenres)}
                />
              </View>
            )}
          </View>
        </View>

        {/* Decade Filter */}
        <View style={styles.shadowWrapper}>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity onPress={() => setDecadesExpanded(!decadesExpanded)} style={styles.dropdownHeader}>
              <Text style={styles.dropdownText}>Jahrzehnt</Text>
              <Text style={styles.dropdownArrow}>{decadesExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {decadesExpanded && (
              <View style={styles.dropdownBody}>
                <View style={styles.dividerLine} />
                <FilterGrid
                  options={DECADE_OPTIONS}
                  selected={selectedDecades}
                  onToggle={(id) => toggleSelection(id, selectedDecades, setSelectedDecades)}
                />
              </View>
            )}
          </View>
        </View>

        {/* Round Selector */}
        <View style={styles.shadowWrapper}>
          <View style={[styles.dropdownContainer, { paddingHorizontal: 16, paddingVertical: 12 }]}>
            <Text style={styles.dropdownText}>Rundenanzahl: {selectedRounds}</Text>
            <Slider
              style={{ width: '100%', height: 40, marginTop: 8 }}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={selectedRounds}
              minimumTrackTintColor="#0B3D91"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#0B3D91"
              onValueChange={(value) => setSelectedRounds(value)}
            />
          </View>
        </View>

        <View style={{ height: 80 + insets.bottom }} />
      </ScrollView>

      <View style={{
        position: 'absolute',
        bottom: insets.bottom + 16,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10
      }}>
        <TouchableOpacity style={styles.playButton} onPress={handlePlaySong}>
          <Text style={styles.playButtonText}>🎧 Spiel starten</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
