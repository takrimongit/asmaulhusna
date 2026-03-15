import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { names } from '../../data/names';
import { useFavorites } from '../../hooks/useFavorites';
import { colors, fonts, spacing, radius } from '../../constants/theme';

export default function NameDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { favorites, toggle } = useFavorites();

  const name = names.find((n) => n.id === Number(id));
  const audioUri = name ? `https://cdn.islamic.network/audio/99-names/${name.id}.mp3` : undefined;
  const player = useAudioPlayer(audioUri);
  const status = useAudioPlayerStatus(player);

  // Update audio source when navigating between names
  useEffect(() => {
    if (audioUri) {
      player.replace(audioUri);
    }
  }, [audioUri]);

  const handlePlayPause = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.seekTo(0);
      player.play();
    }
  };

  if (!name) return null;

  const isFav = favorites.has(name.id);
  const prev = names.find((n) => n.id === name.id - 1);
  const next = names.find((n) => n.id === name.id + 1);

  const handleShare = async () => {
    await Share.share({
      message: `${name.arabic} - ${name.transliteration}\n${name.meaning}\n\n${name.description}`,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Name Detail</Text>
        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Ionicons name="share-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Arabic Hero Card */}
        <View style={styles.heroCard}>
          {/* Gradient layers */}
          <View style={styles.gradientBase} />
          <View style={styles.gradientTop} />
          <View style={styles.gradientBottom} />

          <View style={styles.heroContent}>
            <Text style={styles.heroArabic}>{name.arabic}</Text>
            <Text style={styles.heroTranslit}>{name.transliteration.toUpperCase()}</Text>
          </View>

          {/* Sound button */}
          <TouchableOpacity style={styles.soundButton} activeOpacity={0.8} onPress={handlePlayPause}>
            {status.isBuffering ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name={status.playing ? 'pause' : 'volume-high'} size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Meaning title */}
        <Text style={styles.meaningTitle}>{name.meaning}</Text>

        {/* Description */}
        <Text style={styles.description}>{name.description}</Text>

        {/* Info cards row */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Ionicons name="book-outline" size={24} color="#11d452" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>MENTIONS</Text>
            <Text style={styles.infoValue}>{name.mentions} Times</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="sparkles-outline" size={24} color="#11d452" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>TYPE</Text>
            <Text style={styles.infoValue}>{name.type}</Text>
          </View>
        </View>

        {/* Quranic References */}
        <View style={styles.quranSection}>
          <View style={styles.quranHeader}>
            <Text style={styles.quranBadge}>99</Text>
            <Text style={styles.quranTitle}>Quranic References</Text>
          </View>
          {name.quranicRefs && name.quranicRefs.length > 0 ? (
            name.quranicRefs.map((ref, i) => (
              <View key={i} style={styles.quranCard}>
                <Text style={styles.quranArabic}>{ref.arabic}</Text>
                <Text style={styles.quranTranslation}>{ref.translation}</Text>
                <Text style={styles.quranSource}>{ref.surah} {ref.ayah}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.quranText}>
              This name appears in the Quran and is one of the 99 beautiful names of Allah.
            </Text>
          )}
        </View>

        {/* Favourite button */}
        <TouchableOpacity
          style={[styles.favButton, isFav && styles.favButtonActive]}
          onPress={() => toggle(name.id)}
        >
          <Text style={[styles.favButtonText, isFav && styles.favButtonTextActive]}>
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
    backgroundColor: '#0d140f',
  },
  /* ─── Header ─── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 56 : spacing.md,
    paddingBottom: 12,
    backgroundColor: '#0d140f',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(17,212,82,0.1)',
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  /* ─── Scroll ─── */
  scroll: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl * 2,
  },
  /* ─── Arabic Hero Card ─── */
  heroCard: {
    marginTop: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(17,212,82,0.10)',
    overflow: 'hidden',
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#0d140f',
  },
  gradientBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17,212,82,0.08)',
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(17,212,82,0.03)',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(17,212,82,0.15)',
  },
  heroContent: {
    alignItems: 'center',
    paddingVertical: 48,
    zIndex: 1,
  },
  heroArabic: {
    fontFamily: fonts.arabicBold,
    fontSize: 64,
    color: '#FFFFFF',
    textAlign: 'center',
    writingDirection: 'rtl',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroTranslit: {
    fontSize: 16,
    color: '#11d452',
    letterSpacing: 6,
    marginTop: 12,
    fontWeight: '700',
  },
  soundButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#11d452',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#11d452',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  /* ─── Meaning ─── */
  meaningTitle: {
    fontSize: 30,
    color: '#f1f5f9',
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 8,
  },
  /* ─── Description ─── */
  description: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 28,
    marginBottom: 24,
    textAlign: 'center',
  },
  /* ─── Info Cards ─── */
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(17,212,82,0.05)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(17,212,82,0.10)',
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  infoIcon: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 10,
    color: 'rgba(241,245,249,0.6)',
    letterSpacing: 2,
    marginBottom: 6,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  /* ─── Quranic Reference ─── */
  quranSection: {
    marginBottom: 24,
  },
  quranHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  quranBadge: {
    fontSize: 18,
    color: '#d4af37',
    fontWeight: '800',
    fontStyle: 'italic',
  },
  quranTitle: {
    fontSize: 20,
    color: '#f1f5f9',
    fontWeight: '700',
  },
  quranText: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 24,
  },
  quranCard: {
    backgroundColor: 'rgba(17,212,82,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(17,212,82,0.08)',
    borderRadius: radius.xl,
    padding: 16,
    marginBottom: 10,
  },
  quranArabic: {
    fontFamily: fonts.arabicBold,
    fontSize: 22,
    color: '#f1f5f9',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 38,
    marginBottom: 10,
  },
  quranTranslation: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 10,
  },
  quranSource: {
    fontSize: 13,
    color: '#11d452',
    fontWeight: '600',
  },
  /* ─── Favourite ─── */
  favButton: {
    borderWidth: 1,
    borderColor: 'rgba(17,212,82,0.10)',
    borderRadius: radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(17,212,82,0.05)',
  },
  favButtonActive: {
    borderColor: colors.favorite,
    backgroundColor: '#1A0A0E',
  },
  favButtonText: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: '600',
  },
  favButtonTextActive: {
    color: colors.favorite,
  },
  /* ─── Navigation ─── */
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
    color: '#11d452',
    fontSize: 18,
  },
  navLabel: {
    color: '#94a3b8',
    fontSize: 13,
  },
});
