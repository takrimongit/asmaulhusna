import React, { useState, useMemo } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { names } from '../../data/names';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { NameCard } from '../../components/NameCard';
import { SearchBar } from '../../components/SearchBar';
import { colors, spacing } from '../../constants/theme';

export default function NamesScreen() {
  const [query, setQuery] = useState('');
  const favs = useFavoritesContext();
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!query.trim()) return names;
    const q = query.toLowerCase();
    return names.filter(
      (n) =>
        n.transliteration.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q) ||
        String(n.id).includes(q)
    );
  }, [query]);

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <NameCard
            item={item}
            isFavorite={favs.favorites.has(item.id)}
            onPress={() => router.push(`/name/${item.id}`)}
            onToggleFavorite={() => favs.toggle(item.id)}
          />
        )}
        ListHeaderComponent={
          !query ? (
            <View style={styles.headerContainer}>
              <Text style={styles.arabicHeader}>أسماء الله الحسنى</Text>
              <Text style={styles.subHeader}>THE 99 BEAUTIFUL NAMES</Text>
              <View style={styles.divider} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No names found</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  arabicHeader: {
    fontFamily: 'Amiri-Bold',
    fontSize: 32,
    color: colors.white,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  subHeader: {
    fontSize: 11,
    color: colors.gray,
    letterSpacing: 3,
    marginTop: spacing.xs,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: colors.primary,
    marginTop: spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    color: colors.gray,
    fontSize: 15,
  },
});
