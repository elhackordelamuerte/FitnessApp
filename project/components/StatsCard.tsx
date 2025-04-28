import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Award, CircleCheck as CheckCircle, Flame, Percent } from 'lucide-react-native';

interface StatsCardProps {
  title: string;
  value: string;
  icon: 'award' | 'check-circle' | 'flame' | 'percent';
  color: string;
}

export const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  const { colors } = useTheme();

  const getIcon = () => {
    switch (icon) {
      case 'award':
        return <Award size={24} color={color} />;
      case 'check-circle':
        return <CheckCircle size={24} color={color} />;
      case 'flame':
        return <Flame size={24} color={color} />;
      case 'percent':
        return <Percent size={24} color={color} />;
      default:
        return <CheckCircle size={24} color={color} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <Text style={[styles.value, { color: colors.text }]}>
        {value}
      </Text>
      <Text style={[styles.title, { color: colors.textSecondary }]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    marginBottom: 12,
  },
  value: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
  },
});