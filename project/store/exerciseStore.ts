import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

// Types
export interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets: number;
  category: 'Strength' | 'Cardio' | 'Flexibility' | 'Balance';
  icon: string;
  completed: boolean;
}

interface DailyCompletion {
  date: string;
  completed: number;
  total: number;
}

interface ExerciseState {
  exercises: Exercise[];
  streak: number;
  lastCompletionDate: string | null;
  completionHistory: DailyCompletion[];
  
  // Actions
  toggleExercise: (id: string) => void;
  resetDailyExercises: () => void;
  loadExercises: () => Promise<void>;
  saveState: () => Promise<void>;
}

// Get today's date string
const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

// Default exercises
const defaultExercises: Exercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    reps: 15,
    sets: 3,
    category: 'Strength',
    icon: '💪',
    completed: false,
  },
  {
    id: '2',
    name: 'Squats',
    reps: 20,
    sets: 3,
    category: 'Strength',
    icon: '🏋️',
    completed: false,
  },
  {
    id: '3',
    name: 'Jumping Jacks',
    reps: 30,
    sets: 2,
    category: 'Cardio',
    icon: '🏃',
    completed: false,
  },
  {
    id: '4',
    name: 'Plank',
    reps: 60,
    sets: 2,
    category: 'Strength',
    icon: '🧘',
    completed: false,
  },
  {
    id: '5',
    name: 'Lunges',
    reps: 12,
    sets: 2,
    category: 'Strength',
    icon: '👟',
    completed: false,
  },
  {
    id: '6',
    name: 'Stretching',
    reps: 30,
    sets: 1,
    category: 'Flexibility',
    icon: '🤸',
    completed: false,
  },
];

// Create exercise store
export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [...defaultExercises],
  streak: 0,
  lastCompletionDate: null,
  completionHistory: [],
  
  toggleExercise: (id: string) => {
    set(state => {
      const updatedExercises = state.exercises.map(ex => 
        ex.id === id ? { ...ex, completed: !ex.completed } : ex
      );
      
      // Check if all exercises are completed
      const allCompleted = updatedExercises.every(ex => ex.completed);
      const todayString = getTodayString();
      let updatedStreak = state.streak;
      let updatedLastCompletionDate = state.lastCompletionDate;
      let updatedCompletionHistory = [...state.completionHistory];
      
      if (allCompleted && state.lastCompletionDate !== todayString) {
        // Update streak
        updatedLastCompletionDate = todayString;
        
        // Check if we completed exercises yesterday to maintain streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
        
        if (state.lastCompletionDate === yesterdayString) {
          updatedStreak += 1;
        } else if (!state.lastCompletionDate || state.lastCompletionDate !== todayString) {
          // Reset streak if we missed a day, but not if we're already counted today
          updatedStreak = 1;
        }
        
        // Update completion history
        const todayCompleted = updatedExercises.filter(ex => ex.completed).length;
        const existingEntry = updatedCompletionHistory.findIndex(entry => entry.date === todayString);
        
        if (existingEntry >= 0) {
          updatedCompletionHistory[existingEntry].completed = todayCompleted;
        } else {
          updatedCompletionHistory.push({
            date: todayString,
            completed: todayCompleted,
            total: updatedExercises.length,
          });
        }
      }
      
      // Save state to AsyncStorage
      get().saveState();
      
      return { 
        exercises: updatedExercises, 
        streak: updatedStreak,
        lastCompletionDate: updatedLastCompletionDate,
        completionHistory: updatedCompletionHistory
      };
    });
  },
  
  resetDailyExercises: () => {
    set(state => {
      const resetExercises = state.exercises.map(ex => ({ ...ex, completed: false }));
      
      // Save state to AsyncStorage
      get().saveState();
      
      return { exercises: resetExercises };
    });
  },
  
  loadExercises: async () => {
    try {
      const storedData = await AsyncStorage.getItem('@fitness_tracker_data');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        // Reset exercises completion if it's a new day
        const todayString = getTodayString();
        const lastOpenDate = parsedData.lastOpenDate || null;
        
        let updatedExercises = [...parsedData.exercises];
        
        // If it's a new day, reset the exercises
        if (lastOpenDate !== todayString) {
          updatedExercises = updatedExercises.map(ex => ({ ...ex, completed: false }));
        }
        
        set({ 
          exercises: updatedExercises,
          streak: parsedData.streak || 0,
          lastCompletionDate: parsedData.lastCompletionDate || null,
          completionHistory: parsedData.completionHistory || [],
        });
        
        // Update last open date
        await AsyncStorage.setItem('@fitness_tracker_last_open', todayString);
      }
    } catch (e) {
      console.error('Failed to load exercises:', e);
    }
  },
  
  saveState: async () => {
    try {
      const state = get();
      const data = {
        exercises: state.exercises,
        streak: state.streak,
        lastCompletionDate: state.lastCompletionDate,
        completionHistory: state.completionHistory,
        lastOpenDate: getTodayString(),
      };
      
      await AsyncStorage.setItem('@fitness_tracker_data', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  },
}));

// Hook to load exercises on app start
export function useInitExercises() {
  const loadExercises = useExerciseStore(state => state.loadExercises);
  
  useEffect(() => {
    loadExercises();
  }, []);
}