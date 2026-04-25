import './src/i18n';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';

import { theme } from './src/theme/theme';
import { AuthScreen } from './src/screens/AuthScreen';
import { RoleSelectionScreen } from './src/screens/RoleSelectionScreen';
import { CaregiverPanelScreen } from './src/screens/CaregiverPanelScreen';
import { SeniorPanelScreen } from './src/screens/SeniorPanelScreen';
import { AddWardScreen } from './src/screens/AddWardScreen';
import { WardDetailsScreen } from './src/screens/WardDetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Auth');

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  useEffect(() => {
    const checkState = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        const role = await AsyncStorage.getItem('user_role');

        if (!userId) {
          setInitialRoute('Auth');
        } else if (!role) {
          setInitialRoute('RoleSelection');
        } else {
          setInitialRoute(role === 'CAREGIVER' ? 'CaregiverPanel' : 'SeniorPanel');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    checkState();
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
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="CaregiverPanel" component={CaregiverPanelScreen} />
        <Stack.Screen name="SeniorPanel" component={SeniorPanelScreen} />
        <Stack.Screen name="AddWard" component={AddWardScreen} />
        <Stack.Screen name="WardDetails" component={WardDetailsScreen} />
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