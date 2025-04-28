import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  interpolateColor
} from 'react-native-reanimated';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';
import { Exercise } from '@/store/exerciseStore';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface ExerciseItemProps {
  exercise: Exercise;
  onToggle: () => void;
}

export const ExerciseItem = ({ exercise, onToggle }: ExerciseItemProps) => {
  const { colors } = useTheme();
  const { playCompleteSound } = useSoundEffects();
  const isCompleted = exercise.completed;
  
  // Animation values
  const checkScale = useSharedValue(isCompleted ? 1 : 0);
  const bgOpacity = useSharedValue(isCompleted ? 1 : 0);
  
  // Update animations when completion status changes
  if (isCompleted && checkScale.value === 0) {
    checkScale.value = withSpring(1, { damping: 12 });
    bgOpacity.value = withTiming(1, { duration: 300 });
    playCompleteSound();
  } else if (!isCompleted && checkScale.value === 1) {
    checkScale.value = withTiming(0, { duration: 200 });
    bgOpacity.value = withTiming(0, { duration: 200 });
  }
  
  // Animated styles
  const containerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      bgOpacity.value,
      [0, 1],
      [colors.card, colors.primaryLight + '40'] // 25% opacity
    );
    
    return {
      backgroundColor,
    };
  });
  
  const checkIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkScale.value }],
      opacity: checkScale.value,
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <TouchableOpacity 
        style={styles.touchable}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <View style={styles.exerciseInfo}>
            <Text style={styles.icon}>{exercise.icon}</Text>
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                {exercise.name}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {exercise.sets} {exercise.sets === 1 ? 'set' : 'sets'} × {exercise.reps} {
                  exercise.category === 'Cardio' || exercise.category === 'Flexibility' 
                    ? 'sec' 
                    : 'reps'
                }
              </Text>
            </View>
          </View>
          
          <View style={styles.checkContainer}>
            <View style={[styles.checkCircle, { borderColor: colors.primary }]}>
              <Animated.View style={checkIconStyle}>
                <CheckCircle2 
                  size={24} 
                  color={colors.primary} 
                  fill={colors.primary} 
                  fillOpacity={0.2}
                />
              </Animated.View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  touchable: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
  checkContainer: {
    marginLeft: 16,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});