import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#0f0528',
  input: '#11082b',
  inputBorder: '#302a4b',
  text: '#b1b0b6',
  button: '#5538fb',
  signup: '#442fd3',
  iconBg: '#180e33',
  white: '#fff',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.inputBorder,
    borderWidth: 0.75,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 8,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    paddingVertical: 14,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  forgot: {
    color: COLORS.text,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: COLORS.button,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 32,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  signup: {
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 30,
  },
  signupLink: {
    color: COLORS.signup,
    fontWeight: 'bold',
  },
  socials: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 10,
  },
  circle: {
    backgroundColor: COLORS.iconBg,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
