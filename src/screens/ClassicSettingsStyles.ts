import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f2f5',
    gap: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginBottom: 16,
  },

  // ⬛️ Wrapper ohne Radius – nur Struktur
dropdownWrapper: {
  backgroundColor: '#fff',
  overflow: 'hidden',
  marginBottom: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#ccc',
},


  // 🟦 Header (nur oben abgerundet)
dropdownHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  paddingHorizontal: 16,
  paddingVertical: 14,
  // 🔥 KEIN borderBottom oder border hier!
},

dropdownHeaderWithDivider: {
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
},

  // Wenn das Menü geschlossen ist, unten auch abrunden
  dropdownHeaderCollapsed: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  // 🧱 Body (FilterGrid) bekommt unten die Rundung
 dropdownContent: {
  backgroundColor: '#fff',
  padding: 10,
},
dropdownWrapperBottomRounded: {
  borderBottomLeftRadius: 12,
  borderBottomRightRadius: 12,
},

  dropdownText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#666',
  },

  playButton: {
    backgroundColor: '#0B3D91',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
