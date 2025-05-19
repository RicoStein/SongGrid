import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f2f5',
    gap: 0,
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginBottom: 16,
  },
  shadowWrapper: {
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderRadius: 12,
    marginBottom: 20,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dropdownBody: {
    padding: 10,
    backgroundColor: '#fff',
  },

  dropdownContent: {
    backgroundColor: '#fff',
    padding: 10,
  },

  roundSlider: {
    width: '100%',
    marginTop: 10,
  },

  dividerLine: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
    marginTop: -4,
    marginBottom: 10,
    borderRadius: 1,
  },

  fixedButtonWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    backgroundColor: 'white', // optional: visuelle Trennung
    paddingTop: 12,
    alignItems: 'center',
    zIndex: 10,
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 8, // falls nötig
  },

  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roundButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },

  roundButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },

  roundButtonSelected: {
    backgroundColor: '#6c63ff',
  },

  roundButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },

  roundButtonTextSelected: {
    color: '#fff',
  },
});



export default styles;
