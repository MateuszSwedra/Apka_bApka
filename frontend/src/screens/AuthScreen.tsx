import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import { api } from '../api/client';

export const AuthScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const isStrongPassword = (pass: string) => {
    // Min 8 znaków, 1 wielka litera, 1 cyfra
    const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(pass);
  };

const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('fillAllFields') || 'Wypełnij wszystkie pola');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert(t('error'), t('invalidEmail') || 'Podaj poprawny adres e-mail');
      return;
    }

    if (!isLogin && !isStrongPassword(password)) {
      Alert.alert(
        t('weakPasswordTitle') || 'Słabe hasło', 
        t('weakPasswordDesc') || 'Hasło musi mieć min. 8 znaków, zawierać cyfrę i wielką literę'
      );
      return;
    }

    setIsLoading(true);
    try {
      const user = isLogin 
        ? await api.login(email, password)
        : await api.registerAccount(email, password);

      await AsyncStorage.setItem('user_id', user.id);
      
      if (user.pairingCode) {
        await AsyncStorage.setItem('pairing_code', user.pairingCode);
      }
      
      if (user.role) {
        await AsyncStorage.setItem('user_role', user.role);
        navigation.replace(user.role === 'CAREGIVER' ? 'CaregiverPanel' : 'SeniorPanel');
      } else {
        navigation.replace('RoleSelection');
      }
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || t('authError') || 'Błąd autoryzacji';
      Alert.alert(t('error'), errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logoText}>bApka</Text>
            <Text style={styles.subTitle}>
              {isLogin ? t('welcomeBack') || 'Witaj z powrotem' : t('createAccount') || 'Stwórz konto'}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={styles.input} 
                placeholder="np. jan@kowalski.pl" 
                value={email} 
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('password') || 'Hasło'}</Text>
              <TextInput 
                style={styles.input} 
                placeholder="********" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
              />
              {!isLogin && (
                <Text style={styles.hint}>
                  Min. 8 znaków, wielka litera i cyfra
                </Text>
              )}
            </View>

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleAuth} 
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? t('loginBtn') || 'Zaloguj się' : t('registerBtn') || 'Zarejestruj się'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsLogin(!isLogin)} 
              style={styles.switchButton}
              disabled={isLoading}
            >
              <Text style={styles.switchText}>
                {isLogin 
                  ? t('noAccount') || 'Nie masz konta? Zarejestruj się' 
                  : t('haveAccount') || 'Masz już konto? Zaloguj się'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 48,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textMain,
    opacity: 0.8,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
    color: theme.colors.textMain,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: theme.colors.card,
    padding: 18,
    borderRadius: 15,
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textMain,
    ...theme.ui.shadow,
  },
  hint: {
    fontSize: 12,
    color: theme.colors.textMain,
    opacity: 0.5,
    marginTop: 6,
    marginLeft: 4,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    ...theme.ui.shadow,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 18,
  },
  switchButton: {
    marginTop: 25,
    alignItems: 'center',
    padding: 10,
  },
  switchText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});