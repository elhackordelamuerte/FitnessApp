import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useMemo } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const GreetingHeader = () => {
  const { colors } = useTheme();
  
  // Get greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);
  
  // Format today's date 
  const formattedDate = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text 
        style={[styles.date, { color: colors.textSecondary }]}
        entering={FadeInDown.delay(100).springify()}
      >
        {formattedDate}
      </Animated.Text>
      
      <Animated.Text 
        style={[styles.greeting, { color: colors.text }]}
        entering={FadeInDown.delay(200).springify()}
      >
        {greeting}, ready to move?
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
  },
});