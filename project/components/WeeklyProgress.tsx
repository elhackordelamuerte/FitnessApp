import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useExerciseStore } from '@/store/exerciseStore';
import { useMemo } from 'react';

export const WeeklyProgress = () => {
  const { colors } = useTheme();
  const { completionHistory } = useExerciseStore();

  // Get days of the week with short names
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Calculate the weekly data
  const weeklyData = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
    
    // Create an array for the last 7 days
    return days.map((day, index) => {
      // Calculate the date for this day
      const date = new Date(today);
      date.setDate(today.getDate() - dayOfWeek + index);
      const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      
      // Find completion data for this day
      const completionData = completionHistory.find(item => item.date === dateString);
      
      // Calculate completion percentage
      let completionPercentage = 0;
      if (completionData) {
        completionPercentage = Math.round((completionData.completed / completionData.total) * 100);
      }
      
      // Check if this day is today
      const isToday = index === dayOfWeek;
      
      return {
        day,
        percentage: completionPercentage,
        isToday,
      };
    });
  }, [completionHistory]);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.barsContainer}>
        {weeklyData.map((data, index) => (
          <View key={index} style={styles.dayColumn}>
            <View style={styles.barContainer}>
              <View 
                style={[
                  styles.barBackground, 
                  { backgroundColor: colors.border }
                ]}
              >
                <View 
                  style={[
                    styles.barFill, 
                    { 
                      backgroundColor: data.percentage > 0 ? colors.primary : 'transparent',
                      height: `${data.percentage}%`,
                    }
                  ]}
                />
              </View>
            </View>
            <Text 
              style={[
                styles.dayText, 
                { 
                  color: data.isToday ? colors.primary : colors.textSecondary,
                  fontFamily: data.isToday ? 'Nunito-Bold' : 'Nunito-Regular'
                }
              ]}
            >
              {data.day}
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
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  dayColumn: {
    alignItems: 'center',
    width: '13%',
  },
  barContainer: {
    height: 100,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  barBackground: {
    height: 100,
    width: 8,
    borderRadius: 4,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  barFill: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 4,
  },
  dayText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
  },
});