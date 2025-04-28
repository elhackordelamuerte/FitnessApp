import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Bell, 
  Dumbbell, 
  Clock, 
  User, 
  ChevronRight 
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useExerciseStore } from '@/store/exerciseStore';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { resetDailyExercises } = useExerciseStore();
  const [notifications, setNotifications] = useState(true);

  const SettingItem = ({ icon: Icon, title, value, toggle, onPress, isSwitch = false }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }]} 
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.settingIconContainer}>
        <Icon size={20} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        <View style={styles.settingControl}>
          {isSwitch ? (
            <Switch
              value={value}
              onValueChange={toggle}
              trackColor={{ false: colors.switchTrackOff, true: colors.primary }}
              thumbColor={colors.switchThumb}
            />
          ) : (
            <>
              <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const SettingSection = ({ title, children }) => (
    <View style={styles.settingSection}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.Text 
          style={[styles.title, { color: colors.text }]}
          entering={FadeInDown.delay(100).springify()}
        >
          Settings
        </Animated.Text>
        
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <SettingSection title="Appearance">
            <SettingItem
              icon={isDark ? Moon : Sun}
              title="Dark Mode"
              value={isDark ? "On" : "Off"}
              toggle={toggleTheme}
              isSwitch
              onPress={toggleTheme}
            />
          </SettingSection>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <SettingSection title="Notifications">
            <SettingItem
              icon={Bell}
              title="Workout Reminders"
              value={notifications ? "On" : "Off"}
              toggle={() => setNotifications(!notifications)}
              isSwitch
              onPress={() => setNotifications(!notifications)}
            />
          </SettingSection>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <SettingSection title="Workout Preferences">
            <SettingItem
              icon={Dumbbell}
              title="Exercise Difficulty"
              value="Intermediate"
              onPress={() => {}}
            />
            <SettingItem
              icon={Clock}
              title="Workout Duration"
              value="30 minutes"
              onPress={() => {}}
            />
          </SettingSection>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <SettingSection title="Account">
            <SettingItem
              icon={User}
              title="Profile"
              value="Edit"
              onPress={() => {}}
            />
          </SettingSection>
        </Animated.View>
        
        <Animated.View 
          style={styles.buttonContainer}
          entering={FadeInDown.delay(600).springify()}
        >
          <TouchableOpacity 
            style={[styles.resetButton, { backgroundColor: colors.dangerSoft }]}
            onPress={resetDailyExercises}
          >
            <Text style={[styles.resetButtonText, { color: colors.danger }]}>
              Reset Progress for Today
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Version 1.0.0
          </Text>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    marginBottom: 20,
  },
  settingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 36,
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
  },
  settingControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    marginRight: 4,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  resetButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 40,
  },
  versionText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
  },
});