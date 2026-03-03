import { Tabs } from 'expo-router';
import { colors } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.backgroundLight,
          borderTopColor: colors.cardBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.gray,
        tabBarLabelStyle: { fontSize: 11, letterSpacing: 0.5 },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.gold,
        headerTitleStyle: { fontWeight: '700', letterSpacing: 1.5 },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ASMA UL HUSNA',
          tabBarLabel: 'All Names',
          tabBarIcon: ({ color, size }) => (
            <TabIcon glyph="☪" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'FAVOURITES',
          tabBarLabel: 'Favourites',
          tabBarIcon: ({ color, size }) => (
            <TabIcon glyph="♥" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ glyph, color, size }: { glyph: string; color: string; size: number }) {
  const { Text } = require('react-native');
  return <Text style={{ color, fontSize: size - 2 }}>{glyph}</Text>;
}
