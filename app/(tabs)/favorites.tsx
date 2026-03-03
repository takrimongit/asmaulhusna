import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { names } from '../../data/names';
import { useFavorites } from '../../hooks/useFavorites';
import { NameCard } from '../../components/NameCard';
import { colors, spacing } from '../../constants/theme';

export default function FavoritesScreen() {
  const favs = useFavorites();
  const router = useRouter();

  const favoriteNames = names.filter((n) => favs.favorites.has(n.id));

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteNames}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <NameCard
            item={item}
            isFavorite={true}
            onPress={() => router.push(`/name/${item.id}`)}
            onToggleFavorite={() => favs.toggle(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyArabic}>♡</Text>
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart icon on any name to save it here
            </Text>
          </View>
        }
        contentContainerStyle={favoriteNames.length === 0 ? styles.emptyContainer : styles.list}
        showsVerticalScrollIndicator={false}
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
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl * 2,
  },
  emptyArabic: {
    fontSize: 48,
    color: colors.goldDim,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});
