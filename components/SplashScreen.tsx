import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { colors } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const QUOTES = [
  '"And to Allah belong the best names, so\ninvoke Him by them."',
  '"He is Allah, the Creator, the Inventor,\nthe Fashioner."',
  '"Allah — there is no deity except Him.\nTo Him belong the best names."',
];

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreenView({ onFinish }: SplashScreenProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const [percent, setPercent] = useState(0);
  const [quoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(progress, {
      toValue: 1,
      duration: 2800,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(onFinish, 400);
    });

    const listener = progress.addListener(({ value }) => {
      setPercent(Math.round(value * 100));
    });
    return () => progress.removeListener(listener);
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Background gradient layers */}
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />

      <Animated.View style={[styles.content, { opacity: fadeIn }]}>
        {/* Circular emblem */}
        <View style={styles.emblemOuter}>
          <View style={styles.emblemInner}>
            <Text style={styles.emblemArabic}>الحليم</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} adjustsFontSizeToFit numberOfLines={2}>
          ASMA UL{'\n'}HUSNA
        </Text>
        <Text style={styles.subtitle}>THE 99 BEAUTIFUL NAMES</Text>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>INITIALIZING</Text>
            <Text style={styles.progressPercent}>{percent}%</Text>
          </View>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: barWidth }]} />
          </View>
        </View>

        {/* Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quote}>{QUOTES[quoteIndex]}</Text>
        </View>

        {/* Dots */}
        <View style={styles.dots}>
          {QUOTES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === quoteIndex && styles.dotActive]}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const CONTENT_WIDTH = width - 48;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: '#0A1F12',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    backgroundColor: '#071A0E',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#1A3A24',
    borderWidth: 3,
    borderColor: '#3D6B4A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  emblemInner: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A4A32',
  },
  emblemArabic: {
    fontFamily: 'Amiri-Bold',
    fontSize: 52,
    color: colors.gold,
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Amiri-Bold',
    fontSize: 44,
    color: colors.gold,
    textAlign: 'center',
    letterSpacing: 6,
    lineHeight: 56,
    marginTop: 32,
    width: CONTENT_WIDTH,
  },
  subtitle: {
    fontSize: 13,
    color: '#5A8A65',
    letterSpacing: 4,
    marginTop: 8,
    textAlign: 'center',
    width: CONTENT_WIDTH,
  },
  progressContainer: {
    width: CONTENT_WIDTH,
    marginTop: 40,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    color: '#5A8A65',
    letterSpacing: 2,
  },
  progressPercent: {
    fontSize: 13,
    color: colors.gold,
    fontWeight: '600',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#1A3A24',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
  quoteContainer: {
    position: 'absolute',
    bottom: 80,
    width: CONTENT_WIDTH,
  },
  quote: {
    fontFamily: 'Amiri-Regular',
    fontSize: 16,
    color: '#5A8A65',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  dots: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1A3A24',
  },
  dotActive: {
    backgroundColor: '#5A8A65',
  },
});
