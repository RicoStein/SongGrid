import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSpotify } from '../context/SpotifyContext';
import TrackPopup from '../components/TrackPopup';
import FilterGrid from '../components/FilterGrid';
import styles from './ClassicSettingsStyles';

const GENRE_OPTIONS = [
  {
    id: 'pop',
    label: 'Pop',
    colorImage: require('../../assets/filters/pop.png'),
    bwImage: require('../../assets/filters/bw/pop.png'),
  },
  {
    id: 'rock',
    label: 'Rock',
    colorImage: require('../../assets/filters/rock.png'),
    bwImage: require('../../assets/filters/bw/rock.png'),
  },
  {
    id: 'hip-hop',
    label: 'Hip Hop',
    colorImage: require('../../assets/filters/hip-hop.png'),
    bwImage: require('../../assets/filters/bw/hip-hop.png'),
  },
  {
    id: 'jazz',
    label: 'Jazz',
    colorImage: require('../../assets/filters/jazz.png'),
    bwImage: require('../../assets/filters/bw/jazz.png'),
  },
  {
    id: 'electronic',
    label: 'Electronic',
    colorImage: require('../../assets/filters/electronic.png'),
    bwImage: require('../../assets/filters/bw/electronic.png'),
  },
];

const DECADE_OPTIONS = [
  {
    id: '80s',
    label: '80er',
    colorImage: require('../../assets/filters/80s.png'),
    bwImage: require('../../assets/filters/bw/80s.png'),
  },
  {
    id: '90s',
    label: '90er',
    colorImage: require('../../assets/filters/90s.png'),
    bwImage: require('../../assets/filters/bw/90s.png'),
  },
  {
    id: '2000s',
    label: '2000er',
    colorImage: require('../../assets/filters/2000s.png'),
    bwImage: require('../../assets/filters/bw/2000s.png'),
  },
  {
    id: '2010s',
    label: '2010er',
    colorImage: require('../../assets/filters/2010s.png'),
    bwImage: require('../../assets/filters/bw/2010s.png'),
  },
  {
    id: '2020s',
    label: '2020er',
    colorImage: require('../../assets/filters/2020s.png'),
    bwImage: require('../../assets/filters/bw/2020s.png'),
  },
];

export default function ClassicSettingsScreen() {
  const { accessToken } = useSpotify();
  const [genresExpanded, setGenresExpanded] = useState(false);
  const [decadesExpanded, setDecadesExpanded] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDecades, setSelectedDecades] = useState<string[]>([]);
  const [trackInfo, setTrackInfo] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleSelection = (
    id: string,
    selected: string[],
    setSelected: (val: string[]) => void
  ) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((v) => v !== id)
        : [...selected, id]
    );
  };

  const handlePlaySong = async () => {
    if (!accessToken) {
      Alert.alert('Fehler', 'Kein Zugriffstoken verfügbar.');
      return;
    }

    const genrePool = selectedGenres.length ? selectedGenres : GENRE_OPTIONS.map(o => o.id);
    const decadePool = selectedDecades.length ? selectedDecades : DECADE_OPTIONS.map(o => o.id);

    const genre = pickRandom(genrePool);
    const decade = pickRandom(decadePool);
    const year = mapDecadeToYear(decade);
    const offset = Math.floor(Math.random() * 1000);

    const query = encodeURIComponent(`genre:"${genre}" year:${year}`);
    const url = `https://api.spotify.com/v1/search?q=${query}&type=track&market=DE&limit=1&offset=${offset}`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error(`Spotify-API-Fehler: ${res.status}`);
      const data = await res.json();
      const item = data.tracks?.items?.[0];
      if (!item?.uri) throw new Error('Kein Treffer gefunden.');

      await playSong(item.uri, accessToken);
      setIsPlaying(true);

      setTrackInfo({
        title: item.name,
        artist: item.artists.map((a) => a.name).join(', '),
        year: item.album.release_date?.substring(0, 4) || 'Unbekannt',
        genre,
        image: item.album.images?.[0]?.url,
      });
      setPopupVisible(true);
    } catch (err) {
      console.error(err);
      Alert.alert('Fehler', err.message || 'Unbekannter Fehler');
    }
  };

  const togglePlayback = async () => {
    const endpoint = isPlaying
      ? 'https://api.spotify.com/v1/me/player/pause'
      : 'https://api.spotify.com/v1/me/player/play';

    await fetch(endpoint, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    setIsPlaying(!isPlaying);
  };

  const playSong = async (uri: string, token: string) => {
  const url = 'https://api.spotify.com/v1/me/player/play';

  console.log('🎵 URI:', uri);
  console.log('🔐 Token (gekürzt):', token?.slice(0, 25) + '...');

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: [uri] }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Fehler beim Abspielen:', response.status, error);
    throw new Error(`Spotify-API-Fehler: ${response.status}`);
  }

  console.log('✅ Song erfolgreich gestartet!');
};


  const pickRandom = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const mapDecadeToYear = (label: string) => {
    const mapping: Record<string, string> = {
      '80s': '1985',
      '90s': '1995',
      '2000s': '2005',
      '2010s': '2015',
      '2020s': '2023',
    };
    return mapping[label] ?? '2020';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Classic Mode</Text>

      {/* 📦 GENRE FILTER */}
<View style={styles.shadowWrapper}>
  <View style={styles.dropdownContainer}>
    <TouchableOpacity
      style={styles.dropdownHeader}
      onPress={() => setGenresExpanded(!genresExpanded)}
    >
      <Text style={styles.dropdownText}>Genre</Text>
      <Text style={styles.dropdownArrow}>{genresExpanded ? '▲' : '▼'}</Text>
    </TouchableOpacity>

    {genresExpanded && (
      <View style={styles.dropdownBody}>
        <View style={styles.dividerLine} />
        <FilterGrid
          options={GENRE_OPTIONS}
          selected={selectedGenres}
          onToggle={(id) =>
            toggleSelection(id, selectedGenres, setSelectedGenres)
          }
        />
      </View>
    )}
  </View>
</View>


{/* 📦 DECADE FILTER */}
<View style={styles.shadowWrapper}>
  <View style={styles.dropdownContainer}>
    <TouchableOpacity
      style={styles.dropdownHeader}
      onPress={() => setDecadesExpanded(!decadesExpanded)}
    >
      <Text style={styles.dropdownText}>Jahrzehnt</Text>
      <Text style={styles.dropdownArrow}>{decadesExpanded ? '▲' : '▼'}</Text>
    </TouchableOpacity>

    {decadesExpanded && (
      <View style={styles.dropdownBody}>
        <View style={styles.dividerLine} />
        <FilterGrid
          options={DECADE_OPTIONS}
          selected={selectedDecades}
          onToggle={(id) =>
            toggleSelection(id, selectedDecades, setSelectedDecades)
          }
        />
      </View>
    )}
  </View>
</View>



      <TouchableOpacity style={styles.playButton} onPress={handlePlaySong}>
        <Text style={styles.playButtonText}>🎧 Song abspielen</Text>
      </TouchableOpacity>

      {trackInfo && (
        <TrackPopup
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          onTogglePlayPause={togglePlayback}
          onSkip={() => {
            setPopupVisible(false);
            handlePlaySong();
          }}
          isPlaying={isPlaying}
          track={trackInfo}
        />
      )}
    </ScrollView>
  );
}
