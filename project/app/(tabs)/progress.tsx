import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useExerciseStore } from '@/store/exerciseStore';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StatsCard } from '@/components/StatsCard';
import { WeeklyProgress } from '@/components/WeeklyProgress';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';

export default function ProgressScreen() {
  const { colors } = useTheme();
  const { exercises, streak, completionHistory } = useExerciseStore();

  // Calculate statistics
  const totalExercisesCompleted = completionHistory.reduce(
    (sum, day) => sum + day.completed, 
    0
  );
  
  const mostFrequentCategory = "Strength"; // This would be calculated based on actual data
  const completionRate = completionHistory.length > 0 
    ? Math.round((totalExercisesCompleted / (completionHistory.length * exercises.length)) * 100) 
    : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.Text 
          style={[styles.title, { color: colors.text }]}
          entering={FadeInDown.delay(100).springify()}
        >
          Your Progress
        </Animated.Text>

        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <StatsCard 
              title="Completion Rate" 
              value={`${completionRate}%`}
              icon="percent"
              color={colors.primary}
            />
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <StatsCard 
              title="Current Streak" 
              value={`${streak} days`}
              icon="flame"
              color={colors.secondary}
            />
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <StatsCard 
              title="Exercises Done" 
              value={totalExercisesCompleted.toString()}
              icon="check-circle"
              color={colors.accent}
            />
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <StatsCard 
              title="Top Category" 
              value={mostFrequentCategory}
              icon="award"
              color={colors.success}
            />
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(600).springify()}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            This Week
          </Text>
          <WeeklyProgress />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700).springify()}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Exercise Breakdown
          </Text>
          <CategoryBreakdown />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
    marginTop: 24,
  },
});