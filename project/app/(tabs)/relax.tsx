import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  Easing,
  FadeIn 
} from 'react-native-reanimated';
import { Pause, Play } from 'lucide-react-native';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const { width, height } = Dimensions.get('window');

export default function RelaxScreen() {
  const { colors } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [duration, setDuration] = useState(120); // 2 minutes default
  const timerRef = useRef(null);
  const { playBreatheSound, stopBreatheSound, playRelaxSound, stopRelaxSound } = useSoundEffects();
  
  // Animation values
  const circleScale = useSharedValue(1);
  const breatheText = useSharedValue('Breathe In');

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev >= duration) {
            clearInterval(timerRef.current);
            setIsActive(false);
            stopBreatheSound();
            stopRelaxSound();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      // Start ambient and breathing sounds
      playRelaxSound();
      playBreatheSound();
    } else {
      clearInterval(timerRef.current);
      stopBreatheSound();
      stopRelaxSound();
    }

    return () => {
      clearInterval(timerRef.current);
      stopBreatheSound();
      stopRelaxSound();
    };
  }, [isActive, duration]);

  // Start breathing animation when relax mode is active
  useEffect(() => {
    if (isActive) {
      // Animate circle expansion and contraction
      circleScale.value = withRepeat(
        withTiming(1.3, { duration: 4000, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      );
      
      // Alternate breathing text
      const breathTextInterval = setInterval(() => {
        breatheText.value = breatheText.value === 'Breathe In' ? 'Breathe Out' : 'Breathe In';
      }, 4000);
      
      return () => {
        clearInterval(breathTextInterval);
        circleScale.value = withTiming(1);
      };
    }
  }, [isActive]);

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: circleScale.value }],
    };
  });

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const remainingTime = duration - seconds;

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    stopBreatheSound();
    stopRelaxSound();
  };

  // Duration options
  const durationOptions = [
    { label: '2 min', value: 120 },
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.relaxGradientStart, colors.relaxGradientEnd]}
        style={styles.gradientBackground}
      />
      
      <View style={styles.content}>
        <Animated.Text 
          style={[styles.title, { color: colors.white }]}
          entering={FadeIn.delay(200)}
        >
          Relax Mode
        </Animated.Text>
        
        <Animated.Text 
          style={[styles.subtitle, { color: colors.white }]}
          entering={FadeIn.delay(300)}
        >
          Take a moment to breathe deeply
        </Animated.Text>
        
        <View style={styles.circleContainer}>
          <Animated.View 
            style={[
              styles.breathingCircle, 
              { backgroundColor: colors.circleBackground },
              animatedCircleStyle
            ]}
          />
          
          <Text style={[styles.timerText, { color: colors.white }]}>
            {formatTime(remainingTime)}
          </Text>
          
          <Animated.Text style={[styles.breatheText, { color: colors.white }]}>
            {breatheText.value}
          </Animated.Text>
        </View>
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[styles.controlButton, { backgroundColor: colors.controlBackground }]} 
            onPress={toggleTimer}
          >
            {isActive ? 
              <Pause color={colors.white} size={24} /> : 
              <Play color={colors.white} size={24} />
            }
            <Text style={[styles.buttonText, { color: colors.white }]}>
              {isActive ? 'Pause' : 'Start'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.durationSelector}>
          <Text style={[styles.durationLabel, { color: colors.white }]}>
            Duration:
          </Text>
          <View style={styles.durationButtons}>
            {durationOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.durationButton,
                  duration === option.value && { backgroundColor: colors.durationActiveBackground },
                  { borderColor: colors.white }
                ]}
                onPress={() => {
                  setDuration(option.value);
                  if (isActive) {
                    setSeconds(0);
                  }
                }}
              >
                <Text 
                  style={[
                    styles.durationButtonText, 
                    { color: colors.white },
                    duration === option.value && { fontFamily: 'Nunito-Bold' }
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
    marginBottom: 40,
    textAlign: 'center',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    height: width * 0.8,
  },
  breathingCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    opacity: 0.2,
    position: 'absolute',
  },
  timerText: {
    fontSize: 48,
    fontFamily: 'Nunito-Bold',
  },
  breatheText: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    marginTop: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    minWidth: 120,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    marginLeft: 8,
  },
  durationSelector: {
    marginTop: 40,
  },
  durationLabel: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 12,
    textAlign: 'center',
  },
  durationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  durationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 6,
    borderWidth: 1,
  },
  durationButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
});