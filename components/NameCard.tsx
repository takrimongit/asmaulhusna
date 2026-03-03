import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius, spacing } from '../constants/theme';
import type { Name } from '../data/names';

interface Props {
  item: Name;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function NameCard({ item, isFavorite, onPress, onToggleFavorite }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{item.id}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.arabic}>{item.arabic}</Text>
        <Text style={styles.transliteration}>{item.transliteration}</Text>
        <Text style={styles.meaning}>{item.meaning}</Text>
      </View>

      <TouchableOpacity
        style={styles.heart}
        onPress={onToggleFavorite}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.heartIcon, isFavorite && styles.heartActive]}>
          {isFavorite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.goldDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  numberText: {
    color: colors.goldDim,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  arabic: {
    fontFamily: fonts.arabic,
    fontSize: 22,
    color: colors.gold,
    textAlign: 'right',
    marginBottom: 2,
    writingDirection: 'rtl',
  },
  transliteration: {
    fontSize: 13,
    color: colors.goldLight,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  meaning: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  heart: {
    marginLeft: spacing.sm,
    paddingLeft: spacing.sm,
  },
  heartIcon: {
    fontSize: 20,
    color: colors.gray,
  },
  heartActive: {
    color: colors.favorite,
  },
});
