import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { names } from '../../data/names';
import { useFavorites } from '../../hooks/useFavorites';
import { colors, fonts, spacing, radius } from '../../constants/theme';

export default function NameDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { favorites, toggle } = useFavorites();

  const name = names.find((n) => n.id === Number(id));
  if (!name) return null;

  const isFav = favorites.has(name.id);
  const prev = names.find((n) => n.id === name.id - 1);
  const next = names.find((n) => n.id === name.id + 1);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Ring ornament */}
        <View style={styles.ringOuter}>
          <View style={styles.ringInner}>
            <Text style={styles.numberText}>{name.id}</Text>
          </View>
        </View>

        {/* Arabic name */}
        <Text style={styles.arabic}>{name.arabic}</Text>
        <Text style={styles.transliteration}>{name.transliteration}</Text>

        {/* Gold divider */}
        <View style={styles.divider} />

        {/* Meaning */}
        <View style={styles.meaningCard}>
          <Text style={styles.meaningLabel}>MEANING</Text>
          <Text style={styles.meaningText}>{name.meaning}</Text>
        </View>

        {/* Description */}
        <View style={styles.descCard}>
          <Text style={styles.descText}>{name.description}</Text>
        </View>

        {/* Favourite button */}
        <TouchableOpacity
          style={[styles.favButton, isFav && styles.favButtonActive]}
          onPress={() => toggle(name.id)}
        >
          <Text style={styles.favButtonText}>
            {isFav ? '♥  Remove from Favourites' : '♡  Add to Favourites'}
          </Text>
        </TouchableOpacity>

        {/* Prev / Next navigation */}
        <View style={styles.nav}>
          {prev ? (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.setParams({ id: String(prev.id) })}
            >
              <Text style={styles.navArrow}>←</Text>
              <Text style={styles.navLabel}>{prev.transliteration}</Text>
            </TouchableOpacity>
          ) : <View style={styles.navButton} />}

          {next ? (
            <TouchableOpacity
              style={[styles.navButton, styles.navRight]}
              onPress={() => navigation.setParams({ id: String(next.id) })}
            >
              <Text style={styles.navLabel}>{next.transliteration}</Text>
              <Text style={styles.navArrow}>→</Text>
            </TouchableOpacity>
          ) : <View style={styles.navButton} />}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  ringOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  ringInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: colors.gold,
    fontSize: 22,
    fontWeight: '700',
  },
  arabic: {
    fontFamily: fonts.arabicBold,
    fontSize: 48,
    color: colors.gold,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: spacing.sm,
  },
  transliteration: {
    fontSize: 18,
    color: colors.goldLight,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: spacing.lg,
  },
  divider: {
    width: 80,
    height: 1,
    backgroundColor: colors.goldDim,
    marginBottom: spacing.lg,
  },
  meaningCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  meaningLabel: {
    fontSize: 10,
    color: colors.gray,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  meaningText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  descCard: {
    width: '100%',
    backgroundColor: colors.backgroundLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  descText: {
    fontSize: 15,
    color: colors.gray,
    lineHeight: 24,
    textAlign: 'center',
  },
  favButton: {
    borderWidth: 1,
    borderColor: colors.goldDim,
    borderRadius: radius.full,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  favButtonActive: {
    backgroundColor: colors.card,
    borderColor: colors.favorite,
  },
  favButtonText: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '600',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  navRight: {
    justifyContent: 'flex-end',
  },
  navArrow: {
    color: colors.goldDim,
    fontSize: 18,
  },
  navLabel: {
    color: colors.gray,
    fontSize: 12,
  },
});
