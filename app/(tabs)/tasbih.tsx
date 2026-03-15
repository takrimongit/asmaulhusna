import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors, spacing, radius } from '../../constants/theme';

export default function TasbihScreen() {
  const [count, setCount] = useState(0);
  const [target] = useState(33);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    setCount((c) => c + 1);
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleReset = useCallback(() => setCount(0), []);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Tap to count</Text>

      <View style={styles.countContainer}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.target}>/ {target}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${Math.min((count / target) * 100, 100)}%` }]} />
      </View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity style={styles.tapButton} onPress={handlePress} activeOpacity={0.8}>
          <Text style={styles.tapText}>سبحان الله</Text>
          <Text style={styles.tapSubtext}>SubhanAllah</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  subtitle: {
    fontSize: 13,
    color: colors.gray,
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  count: {
    fontSize: 64,
    color: colors.gold,
    fontWeight: '700',
  },
  target: {
    fontSize: 20,
    color: colors.gray,
    marginLeft: 4,
  },
  progressBar: {
    width: '60%',
    height: 3,
    backgroundColor: colors.card,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
  tapButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapText: {
    fontFamily: 'Amiri-Bold',
    fontSize: 28,
    color: colors.gold,
  },
  tapSubtext: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
    letterSpacing: 1,
  },
  resetButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  resetText: {
    color: colors.gray,
    fontSize: 14,
  },
});
