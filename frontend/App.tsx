import './src/i18n';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import i18n from 'i18next';

import { theme } from './src/theme/theme';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { CaregiverPanelScreen } from './src/screens/CaregiverPanelScreen';
import { SeniorPanelScreen } from './src/screens/SeniorPanelScreen';
import { AddWardScreen } from './src/screens/AddWardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Onboarding');

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('user_lang');
        const savedRole = await AsyncStorage.getItem('user_role');

        if (savedLang) {
          i18n.changeLanguage(savedLang);
        }

        if (savedRole) {
          setInitialRoute(savedRole === 'CAREGIVER' ? 'CaregiverPanel' : 'SeniorPanel');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    checkConfig();
  }, []);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="CaregiverPanel" component={CaregiverPanelScreen} />
        <Stack.Screen name="SeniorPanel" component={SeniorPanelScreen} />
        <Stack.Screen name="AddWard" component={AddWardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});