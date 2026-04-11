import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Platform,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { names } from '../../data/names';
import type { Name } from '../../data/names';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { useTasbeeh } from '../../hooks/useTasbeeh';
import { colors, fonts, spacing, radius } from '../../constants/theme';

const { width: W } = Dimensions.get('window');

/* ─── Single Carousel Card ─────────────────────────────────────────────────── */
function LearnCard({
  item,
  isFavorite,
  onToggleFavorite,
  onPress,
  count,
  onIncrement,
  onReset,
}: {
  item: Name;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
  count: number;
  onIncrement: () => void;
  onReset: () => void;
}) {
  return (
    <View style={[styles.cardOuter, { width: W }]}>
      <View style={styles.card}>

        {/* ── Ambient glow layers ── */}
        <View style={styles.glowTopLeft} />
        <View style={styles.glowBottomRight} />

        {/* ── Top row: number badge + favourite ── */}
        <View style={styles.topRow}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{String(item.id).padStart(2, '0')}</Text>
          </View>
          <TouchableOpacity onPress={onToggleFavorite} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? colors.favorite : 'rgba(241,245,249,0.35)'}
            />
          </TouchableOpacity>
        </View>

        {/* ── Arabic hero ── */}
        <View style={styles.arabicWrap}>
          <View style={styles.arabicHalo} />
          <Text style={styles.arabic}>{item.arabic}</Text>

          {/* Tasbih counter */}
          <TouchableOpacity
            style={styles.counter}
            onPress={onIncrement}
            onLongPress={onReset}
            activeOpacity={0.75}
          >
            <Text style={styles.counterCount}>{count}</Text>
            <Text style={styles.counterLabel}>TASBIH</Text>
          </TouchableOpacity>
        </View>

        {/* ── Transliteration ── */}
        <Text style={styles.translit}>{item.transliteration.toUpperCase()}</Text>

        {/* ── Ornamental rule ── */}
        <View style={styles.rule}>
          <View style={styles.ruleLine} />
          <View style={styles.ruleDiamond} />
          <View style={styles.ruleLine} />
        </View>

        {/* ── Meaning ── */}
        <Text style={styles.meaning}>{item.meaning}</Text>

        {/* ── Description ── */}
        <Text style={styles.desc} numberOfLines={3}>{item.description}</Text>

        {/* ── Footer chips ── */}
        <View style={styles.chips}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{item.type}</Text>
          </View>
          <View style={[styles.chip, styles.chipGold]}>
            <Ionicons name="book-outline" size={11} color={colors.gold} />
            <Text style={[styles.chipText, styles.chipTextGold]}>
              {' '}{item.quranicRefs.length} {item.quranicRefs.length === 1 ? 'Ref' : 'Refs'}
            </Text>
          </View>
        </View>

        {/* ── Tap hint ── */}
        <Text style={styles.tapHint}>Tap card for full detail →</Text>

        {/* ── Invisible tap area ── */}
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={0.0} onPress={onPress} />
      </View>
    </View>
  );
}

/* ─── Screen ────────────────────────────────────────────────────────────────── */
const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

export default function LearnScreen() {
  const router = useRouter();
  const favs = useFavoritesContext();
  const { counts, increment, reset } = useTasbeeh();
  const listRef = useRef<FlatList<Name>>(null);
  const [idx, setIdx] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) setIdx(viewableItems[0].index);
    },
    []
  );

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(names.length - 1, next));
    listRef.current?.scrollToIndex({ index: clamped, animated: true });
  };

  const pct = ((idx + 1) / names.length) * 100;

  return (
    <View style={styles.screen}>

      {/* ── Progress bar ── */}
      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          <Text style={styles.progressCurrent}>{idx + 1}</Text>
          <Text style={styles.progressOf}> / 99</Text>
        </Text>
      </View>

      {/* ── Carousel ── */}
      <FlatList
        ref={listRef}
        data={names}
        keyExtractor={(n) => String(n.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, i) => ({ length: W, offset: W * i, index: i })}
        renderItem={({ item }) => (
          <LearnCard
            item={item}
            isFavorite={favs.favorites.has(item.id)}
            onToggleFavorite={() => favs.toggle(item.id)}
            onPress={() => router.push(`/name/${item.id}`)}
            count={counts[item.id] || 0}
            onIncrement={() => increment(item.id)}
            onReset={() => reset(item.id)}
          />
        )}
      />

      {/* ── Prev / Next row ── */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtn, idx === 0 && styles.navBtnOff]}
          onPress={() => goTo(idx - 1)}
          disabled={idx === 0}
        >
          <Ionicons name="chevron-back" size={18} color={idx === 0 ? colors.grayDim : colors.primary} />
          <Text style={[styles.navLabel, idx === 0 && styles.navLabelOff]}>Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.centerBtn}
          onPress={() => router.push(`/name/${names[idx].id}`)}
        >
          <Text style={styles.centerBtnText}>Full Detail</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, styles.navBtnRight, idx === names.length - 1 && styles.navBtnOff]}
          onPress={() => goTo(idx + 1)}
          disabled={idx === names.length - 1}
        >
          <Text style={[styles.navLabel, idx === names.length - 1 && styles.navLabelOff]}>Next</Text>
          <Ionicons name="chevron-forward" size={18} color={idx === names.length - 1 ? colors.grayDim : colors.primary} />
        </TouchableOpacity>
      </View>

    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* Progress */
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 8 : spacing.sm,
    paddingBottom: 10,
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(17,212,82,0.12)',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  progressLabel: {
    minWidth: 36,
    textAlign: 'right',
  },
  progressCurrent: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  progressOf: {
    color: colors.grayDim,
    fontSize: 12,
  },

  /* Card outer wrapper (full paging width) */
  cardOuter: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },

  /* Card itself */
  card: {
    flex: 1,
    backgroundColor: '#0f1f14',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(17,212,82,0.15)',
    padding: spacing.lg,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  /* Ambient glow layers */
  glowTopLeft: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(17,212,82,0.07)',
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(212,175,55,0.05)',
  },

  /* Top row */
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    zIndex: 1,
  },
  numberBadge: {
    borderWidth: 1,
    borderColor: 'rgba(17,212,82,0.35)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(17,212,82,0.08)',
  },
  numberText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  /* Arabic */
  arabicWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    zIndex: 1,
  },
  arabicHalo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(17,212,82,0.06)',
  },
  arabic: {
    fontFamily: fonts.arabicBold,
    fontSize: 72,
    color: '#FFFFFF',
    textAlign: 'center',
    writingDirection: 'rtl',
    textShadowColor: 'rgba(17,212,82,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    lineHeight: 100,
  },

  /* Transliteration */
  translit: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 5,
    marginBottom: spacing.md,
    zIndex: 1,
  },

  /* Ornamental rule */
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    zIndex: 1,
  },
  ruleLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212,175,55,0.25)',
  },
  ruleDiamond: {
    width: 6,
    height: 6,
    backgroundColor: colors.gold,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 10,
  },

  /* Meaning */
  meaning: {
    textAlign: 'center',
    color: '#f1f5f9',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: spacing.sm,
    zIndex: 1,
  },

  /* Description */
  desc: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: spacing.lg,
    zIndex: 1,
  },

  /* Chips */
  chips: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: spacing.md,
    zIndex: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(17,212,82,0.2)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(17,212,82,0.06)',
  },
  chipText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: '600',
  },
  chipGold: {
    borderColor: 'rgba(212,175,55,0.25)',
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  chipTextGold: {
    color: colors.gold,
  },

  /* Tasbih counter */
  counter: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  counterCount: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 20,
  },
  counterLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 1,
  },

  /* Tap hint */
  tapHint: {
    textAlign: 'center',
    color: 'rgba(241,245,249,0.2)',
    fontSize: 11,
    letterSpacing: 0.5,
    zIndex: 1,
  },

  /* Nav row */
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.sm : spacing.md,
    paddingTop: spacing.sm,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 70,
  },
  navBtnRight: {
    justifyContent: 'flex-end',
  },
  navBtnOff: {
    opacity: 0.3,
  },
  navLabel: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  navLabelOff: {
    color: colors.grayDim,
  },
  centerBtn: {
    borderWidth: 1,
    borderColor: 'rgba(17,212,82,0.3)',
    borderRadius: radius.full,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: 'rgba(17,212,82,0.08)',
  },
  centerBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
