import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';

export const OnboardingScreen = ({ navigation }: any) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>{t('roleSelection')}</Text>
        
        <TouchableOpacity 
          style={styles.cardButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('SeniorPanel')}
        >
          <Text style={styles.cardTitle}>{t('seniorRole')}</Text>
          <Text style={styles.cardSubtitle}>{t('seniorDesc')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.cardButton, styles.cardButtonCaregiver]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CaregiverPanel')}
        >
          <Text style={[styles.cardTitle, styles.cardTitleCaregiver]}>{t('caregiverRole')}</Text>
          <Text style={[styles.cardSubtitle, styles.cardSubtitleCaregiver]}>{t('caregiverDesc')}</Text>
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
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.large,
    color: theme.colors.textMain,
    marginBottom: 20,
    textAlign: 'center',
  },
  cardButton: {
    backgroundColor: theme.colors.card,
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: theme.ui.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.ui.shadow,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.large,
    color: theme.colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.sizes.normal,
    color: theme.colors.textMain,
    textAlign: 'center',
  },
  cardButtonCaregiver: {
    backgroundColor: theme.colors.primary,
  },
  cardTitleCaregiver: {
    color: theme.colors.card,
  },
  cardSubtitleCaregiver: {
    color: theme.colors.background,
  },
});