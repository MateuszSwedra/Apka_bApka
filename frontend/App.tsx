import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { theme } from './src/theme/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Witaj w bApce!</Text>
        <Text style={styles.text}>Aplikacja załadowana pomyślnie.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.ui.borderRadius,
    padding: 30,
    ...theme.ui.shadow,
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.large,
    color: theme.colors.primary,
    marginBottom: 10,
  },
  text: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.sizes.normal,
    color: theme.colors.textMain,
    lineHeight: theme.typography.lineHeight,
  },
});