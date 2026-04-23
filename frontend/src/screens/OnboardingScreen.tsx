import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { api } from '../api/client';

export const OnboardingScreen = ({ navigation }: any) => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState<'LANGUAGE' | 'ROLE'>('LANGUAGE');
  const [fadeAnim] = useState(new Animated.Value(1));
  const [isLoading, setIsLoading] = useState(false);

  const changeStep = (nextStep: 'LANGUAGE' | 'ROLE') => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setStep(nextStep);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const handleLanguageSelect = async (lang: string) => {
    await AsyncStorage.setItem('user_lang', lang);
    i18n.changeLanguage(lang);
    changeStep('ROLE');
  };

  const handleRoleSelect = async (role: 'CAREGIVER' | 'SENIOR') => {
    try {
      setIsLoading(true);
      const defaultName = role === 'SENIOR' ? 'Senior' : 'Opiekun';
      
      // WYWOŁANIE API - tu może dziać się błąd jeśli backend nie działa lub link w .env jest zły
      const user = await api.register(role, defaultName);
      
      await AsyncStorage.setItem('user_role', role);
      await AsyncStorage.setItem('user_id', user.id);
      if (user.pairingCode) {
        await AsyncStorage.setItem('pairing_code', user.pairingCode);
      }
      
      navigation.replace(role === 'CAREGIVER' ? 'CaregiverPanel' : 'SeniorPanel');
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        'Błąd połączenia', 
        'Nie udało się zarejestrować. Sprawdź czy backend działa i czy link w .env jest aktualny.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.content}>
          {step === 'LANGUAGE' ? (
            <>
              <Text style={styles.title}>Wybierz język / Choose language</Text>
              <View style={styles.grid}>
                <TouchableOpacity style={styles.langCard} onPress={() => handleLanguageSelect('pl')}>
                  <Text style={styles.emoji}>🇵L</Text>
                  <Text style={styles.langText}>Polski</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.langCard} onPress={() => handleLanguageSelect('en')}>
                  <Text style={styles.emoji}>🇺S</Text>
                  <Text style={styles.langText}>English</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>{t('roleSelection')}</Text>
              {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
              ) : (
                <View style={styles.roleContainer}>
                  <TouchableOpacity 
                    style={[styles.roleCard, { backgroundColor: theme.colors.seniorAccent }]}
                    onPress={() => handleRoleSelect('SENIOR')}
                  >
                    <Feather name="heart" size={50} color={theme.colors.card} />
                    <Text style={styles.roleTitle}>{t('seniorRole')}</Text>
                    <Text style={styles.roleDesc}>{t('seniorDesc')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.roleCard, { backgroundColor: theme.colors.caregiverAccent }]}
                    onPress={() => handleRoleSelect('CAREGIVER')}
                  >
                    <Feather name="users" size={50} color={theme.colors.card} />
                    <Text style={styles.roleTitle}>{t('caregiverRole')}</Text>
                    <Text style={styles.roleDesc}>{t('caregiverDesc')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        {/* PRZYCISK LOGOWANIA WIDOCZNY ZAWSZE NA DOLE */}
        {!isLoading && (
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginText}>Masz już konto? Zaloguj się</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontFamily: theme.typography.fontFamily.bold, fontSize: theme.typography.sizes.large, color: theme.colors.textMain, textAlign: 'center', marginBottom: 40 },
  grid: { flexDirection: 'row', gap: 20 },
  langCard: { backgroundColor: theme.colors.card, padding: 30, borderRadius: theme.ui.borderRadius, alignItems: 'center', width: '45%', ...theme.ui.shadow },
  emoji: { fontSize: 40, marginBottom: 10 },
  langText: { fontFamily: theme.typography.fontFamily.bold, fontSize: 18, color: theme.colors.primary },
  roleContainer: { width: '100%', gap: 20 },
  roleCard: { width: '100%', padding: 30, borderRadius: theme.ui.borderRadius, alignItems: 'center', ...theme.ui.shadow },
  roleTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: 24, color: theme.colors.card, marginTop: 15 },
  roleDesc: { fontFamily: theme.typography.fontFamily.regular, fontSize: 16, color: theme.colors.card, opacity: 0.9, marginTop: 5 },
  loginButton: { padding: 20, alignItems: 'center' },
  loginText: { fontFamily: theme.typography.fontFamily.regular, fontSize: 16, color: theme.colors.primary, textDecorationLine: 'underline' },
});