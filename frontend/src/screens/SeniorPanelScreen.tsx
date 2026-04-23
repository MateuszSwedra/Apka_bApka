import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { api } from '../api/client';

export const SeniorPanelScreen = ({ navigation }: any) => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isTaken, setIsTaken] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pl' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleTakeMedication = async () => {
    try {
      setIsLoading(true);
      const mockScheduleId = '123e4567-e89b-12d3-a456-426614174000';
      await api.takeMedication(mockScheduleId);
      setIsTaken(true);
    } catch (error: any) {
      console.error("Szczegóły błędu:", error);
      Alert.alert(
        'Błąd techniczny', 
        `Wiadomość: ${error.message}\nURL: ${process.env.EXPO_PUBLIC_API_URL}`
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleLanguage} style={styles.langButton} activeOpacity={0.8}>
          <Feather name="globe" size={20} color={theme.colors.primary} />
          <Text style={styles.langButtonText}>{t('changeLang')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{t('seniorWelcome')}</Text>
          <Text style={styles.subGreeting}>Janina</Text>
        </View>

        <View style={styles.infoCard}>
          <Feather name="clock" size={28} color={theme.colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Następna dawka:</Text>
            <Text style={styles.infoValue}>18:00 - Wieczór</Text>
            <Text style={styles.infoPills}>Ibuprofen (1 tabletka)</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.giantButton, isTaken && styles.giantButtonSuccess]} 
          activeOpacity={0.8}
          onPress={handleTakeMedication}
          disabled={isLoading || isTaken}
        >
          <View style={styles.iconCircle}>
            {isLoading ? (
              <ActivityIndicator size="large" color={theme.colors.actionReady} />
            ) : (
              <Feather name={isTaken ? "check-circle" : "check"} size={40} color={isTaken ? theme.colors.actionReady : theme.colors.actionReady} />
            )}
          </View>
          <Text style={styles.giantButtonText}>
            {isTaken ? 'LEKI PRZYJĘTE' : t('takeMedsBtn')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.ui.borderRadius,
    gap: 8,
    ...theme.ui.shadow,
  },
  langButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
    color: theme.colors.primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  greetingContainer: {
    alignItems: 'center',
  },
  greeting: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.sizes.large,
    color: theme.colors.textMain,
  },
  subGreeting: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.huge,
    color: theme.colors.primary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    width: '100%',
    padding: 24,
    borderRadius: theme.ui.borderRadius,
    alignItems: 'center',
    gap: 20,
    ...theme.ui.shadow,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 14,
    color: theme.colors.textMain,
    opacity: 0.7,
  },
  infoValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 22,
    color: theme.colors.textMain,
    marginTop: 4,
  },
  infoPills: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.primary,
    marginTop: 4,
  },
  giantButton: {
    backgroundColor: theme.colors.actionReady,
    width: '100%',
    paddingVertical: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    ...theme.ui.shadow,
    elevation: 8,
  },
  giantButtonSuccess: {
    backgroundColor: '#81C784',
  },
  iconCircle: {
    backgroundColor: theme.colors.card,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  giantButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 24,
    color: theme.colors.card,
    textAlign: 'center',
  },
});