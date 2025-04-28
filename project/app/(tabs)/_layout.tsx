import { Tabs } from 'expo-router';
import { Chrome as Home, ChartBar as BarChart2, Play, Settings } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function TabLayout() {
  const { colors } = useTheme();

  const tabBarStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(colors.background, { duration: 250 }),
      borderTopColor: withTiming(colors.border, { duration: 250 }),
    };
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'Nunito-SemiBold',
          fontSize: 12,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon={Home} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon={BarChart2} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="relax"
        options={{
          title: 'Relax',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon={Play} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon={Settings} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const TabBarIcon = ({ icon: Icon, color, size }) => {
  return (
    <View style={styles.iconContainer}>
      <Icon size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});