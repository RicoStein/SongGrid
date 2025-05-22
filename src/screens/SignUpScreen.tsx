import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../screens/LoginScreenStyles';
import CustomCheckbox from '../components/CustomCheckbox';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [termsError, setTermsError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Email Validation
  const validateEmail = (value: string) => {
    if (!value) return "E-Mail darf nicht leer sein";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Ungültiges E-Mail-Format";
    return '';
  };

  // Password Validation
  const validatePassword = (value: string) => {
    if (!value) return "Passwort darf nicht leer sein";
    if (value.length < 8) return "Mindestens 8 Zeichen";
    if (!/[A-Z]/.test(value)) return "Mindestens ein Großbuchstabe";
    if (!/[a-z]/.test(value)) return "Mindestens ein Kleinbuchstabe";
    if (!/[0-9]/.test(value)) return "Mindestens eine Zahl";
    if (!/[!@#$%^&*(),.?":{}|<>_\-\/;=+`'[\]\\]/.test(value)) return "Mindestens ein Sonderzeichen";
    return '';
  };

  // Confirm Validation
  const validateConfirm = (confirmValue: string) => {
    if (confirmValue !== password) return "Passwörter stimmen nicht überein";
    return '';
  };

  // On Register
  const onRegister = () => {
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmErr = validateConfirm(confirm);
    const termsErr = !acceptTerms ? "AGB müssen akzeptiert werden" : '';

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmError(confirmErr);
    setTermsError(termsErr);

    if (!emailErr && !passwordErr && !confirmErr && !termsErr) {
      alert('Registrierung erfolgreich!');
      // Registrierung (API call) ausführen...
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f0528' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={{ flex: 1, backgroundColor: '#0f0528' }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              backgroundColor: '#0f0528',
              paddingHorizontal: 24,
              paddingBottom: 40,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
            />

            <Text style={styles.title}>CREATE YOUR ACCOUNT</Text>
            <Text style={styles.subtitle}>Fill in your details to register</Text>

            {/* USERNAME */}
            <View style={styles.inputWrapper}>
              <Image source={require('../../assets/user-icon.png')} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#b1b0b6"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            {/* EMAIL */}
            <View style={styles.inputWrapper}>
              <Image source={require('../../assets/email-icon.png')} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#b1b0b6"
                value={email}
                onChangeText={v => {
                  setEmail(v);
                  setEmailError(validateEmail(v));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {emailError ? <Text style={{ color: 'red', marginBottom: 6 }}>{emailError}</Text> : null}

            {/* PASSWORD */}
            <View style={styles.inputWrapper}>
              <Image source={require('../../assets/lock-icon.png')} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#b1b0b6"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={v => {
                  setPassword(v);
                  setPasswordError(validatePassword(v));
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIconContainer}
              >
                <Image
                  source={
                    showPassword
                      ? require('../../assets/eye-open.png')
                      : require('../../assets/eye-closed.png')
                  }
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={{ color: 'red', marginBottom: 6 }}>{passwordError}</Text> : null}

            {/* CONFIRM PASSWORD */}
            <View style={styles.inputWrapper}>
              <Image source={require('../../assets/lock-icon.png')} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#b1b0b6"
                secureTextEntry={!showConfirm}
                value={confirm}
                onChangeText={v => {
                  setConfirm(v);
                  setConfirmError(validateConfirm(v));
                }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                style={styles.eyeIconContainer}
              >
                <Image
                  source={
                    showConfirm
                      ? require('../../assets/eye-open.png')
                      : require('../../assets/eye-closed.png')
                  }
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
            {confirmError ? <Text style={{ color: 'red', marginBottom: 6 }}>{confirmError}</Text> : null}

            {/* AGB */}
            <View style={styles.optionsRow}>
              <CustomCheckbox
                value={acceptTerms}
                onValueChange={setAcceptTerms}
                label="I accept the Terms"
              />
            </View>
            {termsError ? <Text style={{ color: 'red', marginBottom: 6 }}>{termsError}</Text> : null}

            {/* REGISTER BUTTON */}
            <TouchableOpacity style={styles.loginButton} onPress={onRegister}>
              <Text style={styles.loginButtonText}>REGISTER</Text>
            </TouchableOpacity>

            {/* Already have an account? */}
            <Text style={styles.signup}>
              Already have an account?{' '}
              <Text
                style={styles.signupLink}
                onPress={() => navigation.navigate('Transition', { target: 'Login' })}
              >
                Login
              </Text>
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
