import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { names } from '../../data/names';
import { useFavorites } from '../../hooks/useFavorites';
import { colors, fonts, spacing, radius } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - spacing.md * 2 - CARD_GAP) / 2;

function getNameOfTheDay() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return names[(dayOfYear - 1) % names.length];
}

export default function HomeScreen() {
  const router = useRouter();
  const favs = useFavorites();
  const nameOfDay = useMemo(() => getNameOfTheDay(), []);
  const previewNames = names.slice(0, 4);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Name of the Day Hero */}
      <TouchableOpacity
        style={styles.heroCard}
        activeOpacity={0.85}
        onPress={() => router.push(`/name/${nameOfDay.id}`)}
      >
        <View style={styles.heroArabicContainer}>
          <Text style={styles.heroArabic}>{nameOfDay.arabic}</Text>
          <Text style={styles.heroTranslit}>{nameOfDay.transliteration.toUpperCase()}</Text>
        </View>
        <View style={styles.heroInfo}>
          <Text style={styles.heroLabel}>NAME OF THE DAY</Text>
          <Text style={styles.heroName}>{nameOfDay.transliteration}</Text>
          <Text style={styles.heroMeaning}>{nameOfDay.meaning}</Text>
        </View>
        <TouchableOpacity
          style={styles.reflectButton}
          onPress={() => router.push(`/name/${nameOfDay.id}`)}
        >
          <Text style={styles.reflectText}>Reflect</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={0.7}
        onPress={() => router.push('/(tabs)/names')}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search 99 Names...</Text>
      </TouchableOpacity>

      {/* The 99 Names Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>The 99 Names</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/names')}>
          <Text style={styles.viewAll}>View All  ›</Text>
        </TouchableOpacity>
      </View>

      {/* 2-column Grid Preview */}
      <View style={styles.grid}>
        {previewNames.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.gridCard}
            activeOpacity={0.75}
            onPress={() => router.push(`/name/${item.id}`)}
          >
            <View style={styles.gridCardHeader}>
              <View style={styles.gridBadge}>
                <Text style={styles.gridBadgeText}>
                  {String(item.id).padStart(2, '0')}
                </Text>
              </View>
              <Text style={styles.gridArabic}>{item.arabic}</Text>
            </View>
            <Text style={styles.gridTranslit}>{item.transliteration}</Text>
            <Text style={styles.gridMeaning}>{item.meaning}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Hero Card
  heroCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  heroArabicContainer: {
    backgroundColor: 'rgba(17,212,82,0.08)',
    paddingVertical: 36,
    alignItems: 'center',
  },
  heroArabic: {
    fontFamily: fonts.arabicBold,
    fontSize: 56,
    color: colors.white,
    textAlign: 'center',
  },
  heroTranslit: {
    fontSize: 11,
    color: colors.gray,
    letterSpacing: 3,
    marginTop: 4,
  },
  heroInfo: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  heroLabel: {
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroName: {
    fontSize: 26,
    color: colors.white,
    fontWeight: '700',
  },
  heroMeaning: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 2,
  },
  reflectButton: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  reflectText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: colors.gray,
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.white,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: CARD_GAP,
  },
  gridCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  gridCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  gridBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridBadgeText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
  },
  gridArabic: {
    fontFamily: fonts.arabic,
    fontSize: 22,
    color: colors.white,
    writingDirection: 'rtl',
  },
  gridTranslit: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
    marginBottom: 2,
  },
  gridMeaning: {
    fontSize: 12,
    color: colors.gray,
  },
});
