import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const MOCK_WARDS = [
  { id: '1', name: 'Babcia Janina', status: 'Wszystkie leki przyjęte', isAlert: false },
  { id: '2', name: 'Dziadek Stefan', status: 'Pominięto dawkę poranną', isAlert: true },
];

export const CaregiverPanelScreen = ({ navigation }: any) => {
  const renderWardCard = ({ item }: { item: typeof MOCK_WARDS[0] }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <Feather name="user" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.wardName}>{item.name}</Text>
          <View style={styles.statusRow}>
            <Feather 
              name={item.isAlert ? "alert-circle" : "check-circle"} 
              size={14} 
              color={item.isAlert ? theme.colors.actionAlert : theme.colors.actionReady} 
            />
            <Text style={[styles.wardStatus, item.isAlert && styles.wardStatusAlert]}>
              {item.status}
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={24} color={theme.colors.textMain} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Twoi Podopieczni</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Feather name="settings" size={24} color={theme.colors.textMain} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_WARDS}
        keyExtractor={(item) => item.id}
        renderItem={renderWardCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.mainActionButton} activeOpacity={0.8}>
          <Feather name="plus" size={24} color={theme.colors.card} />
          <Text style={styles.mainActionText}>Dodaj Podopiecznego</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  settingsButton: {
    padding: 8,
    marginRight: -8,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.large,
    color: theme.colors.textMain,
  },
  listContainer: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.ui.borderRadius,
    padding: 16,
    ...theme.ui.shadow,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  wardName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.normal,
    color: theme.colors.textMain,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wardStatus: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 14,
    color: theme.colors.actionReady,
  },
  wardStatusAlert: {
    color: theme.colors.actionAlert,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  mainActionButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: theme.ui.borderRadius,
    ...theme.ui.shadow,
    gap: 10,
  },
  mainActionText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.normal,
    color: theme.colors.card,
  },
});