import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

// Configure animated Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressCircleProps {
  progress: number; // from 0 to 1
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
}

export const ProgressCircle = ({ 
  progress, 
  size = 180, 
  strokeWidth = 12,
  showPercentage = true
}: ProgressCircleProps) => {
  const { colors } = useTheme();
  
  // Calculate circle parameters
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Animated stroke dash offset
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = withTiming(
      circumference * (1 - progress),
      { duration: 1000 }
    );
    return { strokeDashoffset };
  });

  // Format percentage for display
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      
      {showPercentage && (
        <View style={styles.textContainer}>
          <Text style={[styles.percentText, { color: colors.text }]}>
            {percentage}%
          </Text>
          <Text style={[styles.completeText, { color: colors.textSecondary }]}>
            Complete
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
  },
  completeText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    marginTop: 4,
  },
});