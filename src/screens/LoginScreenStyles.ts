import { StyleSheet } from 'react-native';

// Farbvariablen
const COLORS = {
  background: '#320E3B',       // Dunkles Blau
  buttonBackground: '#E56399', // Helles Blau
  buttonText: '#320E3B',       // Gleicher Ton wie Hintergrund
  white: '#FFFFFF',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBackground: {
    alignItems: 'center',
    paddingTop: 160, // weiter runter
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 22, // größer
    color: COLORS.white,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 38, // größer
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 25,
  },
  logo: {
    width: 180,   // größer
    height: 180,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  loginButton: {
    backgroundColor: COLORS.buttonBackground,
    paddingVertical: 16,
    paddingHorizontal: 42,
    borderRadius: 30,
    marginTop: 40,
  },
  loginButtonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100, // noch weiter hochgezogen
  },
  socialsContainer: {
    flexDirection: 'row',
    gap: 30,
  },
  socialIcon: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
  },
});
