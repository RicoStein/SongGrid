import React from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context'; // 👈 NEU

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GAME_MODES = [
  {
    id: 'ClassicSettings',
    title: 'Classic Mode',
    image: require('../../assets/classic.png'),
    description: 'Rate Songs aus Jahrzehnten.',
  },
  {
    id: 'PartySettings',
    title: 'Party Mode',
    image: require('../../assets/party.png'),
    description: 'Spiele gemeinsam mit Freunden.',
  },
  {
    id: 'ChallengeSettings',
    title: 'Challenge Mode',
    image: require('../../assets/challenge.png'),
    description: 'Zeitdruck trifft Musikkenntnis.',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const screenWidth = Dimensions.get('window').width;
  const numColumns = screenWidth > 600 ? 2 : 1;

  const renderItem = ({ item }: { item: typeof GAME_MODES[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.id as keyof RootStackParamList)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={GAME_MODES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 16 },
  card: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#0B3D91' },
  image: { width: '100%', height: 120, borderRadius: 8, marginBottom: 10 },
  description: { fontSize: 14, color: '#444', textAlign: 'center' },
});
