import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by name or meaning..."
        placeholderTextColor={colors.gray}
        value={value}
        onChangeText={onChangeText}
        selectionColor={colors.primary}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    color: colors.white,
    fontSize: 14,
  },
});
