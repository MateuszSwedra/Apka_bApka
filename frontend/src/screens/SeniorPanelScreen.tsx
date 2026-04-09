import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';

export const SeniorPanelScreen = ({ navigation }: any) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pl' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleLanguage} style={styles.langButton} activeOpacity={0.8}>
          <Text style={styles.langButtonText}>{t('changeLang')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.greeting}>{t('seniorWelcome')}</Text>
        
        <TouchableOpacity style={styles.giantButton} activeOpacity={0.8}>
          <Text style={styles.giantButtonText}>{t('takeMedsBtn')}</Text>
        </TouchableOpacity>

        <Text style={styles.infoText}>{t('medsTakenInfo')}</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.card,
    borderRadius: theme.ui.borderRadius,
    ...theme.ui.shadow,
  },
  langButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
    color: theme.colors.primary,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
  },
  greeting: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.huge,
    color: theme.colors.textMain,
    textAlign: 'center',
  },
  giantButton: {
    backgroundColor: theme.colors.actionReady,
    width: '100%',
    paddingVertical: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.ui.shadow,
    elevation: 8,
  },
  giantButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.large,
    color: theme.colors.card,
    textAlign: 'center',
  },
  infoText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.sizes.large,
    color: theme.colors.textMain,
    textAlign: 'center',
  },
});