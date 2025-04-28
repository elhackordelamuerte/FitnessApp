import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useExerciseStore } from '@/store/exerciseStore';
import { useMemo } from 'react';

export const CategoryBreakdown = () => {
  const { colors } = useTheme();
  const { exercises } = useExerciseStore();

  // Calculate category breakdown
  const categories = useMemo(() => {
    const categoryCount = {
      Strength: 0,
      Cardio: 0,
      Flexibility: 0,
      Balance: 0,
    };
    
    exercises.forEach(exercise => {
      categoryCount[exercise.category]++;
    });
    
    const total = exercises.length;
    
    return [
      {
        name: 'Strength',
        count: categoryCount.Strength,
        percentage: Math.round((categoryCount.Strength / total) * 100),
        color: colors.primary,
      },
      {
        name: 'Cardio',
        count: categoryCount.Cardio,
        percentage: Math.round((categoryCount.Cardio / total) * 100),
        color: colors.secondary,
      },
      {
        name: 'Flexibility',
        count: categoryCount.Flexibility,
        percentage: Math.round((categoryCount.Flexibility / total) * 100),
        color: colors.accent,
      },
      {
        name: 'Balance',
        count: categoryCount.Balance,
        percentage: Math.round((categoryCount.Balance / total) * 100),
        color: colors.warning,
      },
    ].filter(category => category.count > 0);
  }, [exercises, colors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.barContainer}>
        <View style={styles.progressBar}>
          {categories.map((category, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                { 
                  backgroundColor: category.color,
                  width: `${category.percentage}%`,
                }
              ]}
            />
          ))}
        </View>
      </View>
      
      <View style={styles.legendContainer}>
        {categories.map((category, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: category.color }]} />
            <Text style={[styles.legendText, { color: colors.text }]}>
              {category.name} ({category.percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  barContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 16,
    borderRadius: 8,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressSegment: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
  },
});