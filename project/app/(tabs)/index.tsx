import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { GreetingHeader } from '@/components/GreetingHeader';
import { ProgressCircle } from '@/components/ProgressCircle';
import { ExerciseItem } from '@/components/ExerciseItem';
import { useExerciseStore } from '@/store/exerciseStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { exercises, toggleExercise, resetDailyExercises } = useExerciseStore();
  const [completedCount, setCompletedCount] = useState(0);
  const [streak, setStreak] = useState(0);

  // Calculate completed exercises
  useEffect(() => {
    const completed = exercises.filter(ex => ex.completed).length;
    setCompletedCount(completed);
  }, [exercises]);

  // Update streak based on completion data from store
  useEffect(() => {
    // This would normally load from AsyncStorage
    setStreak(useExerciseStore.getState().streak);
  }, [completedCount]);

  const progress = exercises.length > 0 ? completedCount / exercises.length : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <GreetingHeader />
        
        <View style={styles.progressContainer}>
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <ProgressCircle progress={progress} />
          </Animated.View>
          
          <Animated.View 
            style={styles.streakContainer} 
            entering={FadeInDown.delay(200).springify()}
          >
            <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
              Current Streak
            </Text>
            <Text style={[styles.streakValue, { color: colors.text }]}>
              {streak} {streak === 1 ? 'day' : 'days'}
            </Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Today's Exercises
          </Text>
        </Animated.View>

        <View style={styles.exercisesList}>
          {exercises.map((exercise, index) => (
            <Animated.View 
              key={exercise.id} 
              entering={FadeInDown.delay(400 + index * 100).springify()}
            >
              <ExerciseItem
                exercise={exercise}
                onToggle={() => toggleExercise(exercise.id)}
              />
            </Animated.View>
          ))}
        </View>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  streakContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  streakLabel: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    marginBottom: 4,
  },
  streakValue: {
    fontSize: 22,
    fontFamily: 'Nunito-Bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginTop: 24,
    marginBottom: 16,
  },
  exercisesList: {
    marginBottom: 20,
  },
});