import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export function useSoundEffects() {
  const completeSoundRef = useRef<Audio.Sound | null>(null);
  const breatheSoundRef = useRef<Audio.Sound | null>(null);
  const relaxSoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    loadSounds();
    return () => {
      unloadSounds();
    };
  }, []);

  async function loadSounds() {
    if (Platform.OS === 'web') {
      try {
        const { sound: completeSound } = await Audio.Sound.createAsync(
          { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
          { volume: 0.5 }
        );
        completeSoundRef.current = completeSound;

        const { sound: breatheSound } = await Audio.Sound.createAsync(
          { uri: 'https://assets.mixkit.co/active_storage/sfx/2434/2434-preview.mp3' },
          { volume: 0.3, isLooping: true }
        );
        breatheSoundRef.current = breatheSound;

        const { sound: relaxSound } = await Audio.Sound.createAsync(
          { uri: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3' },
          { volume: 0.2, isLooping: true }
        );
        relaxSoundRef.current = relaxSound;
      } catch (error) {
        console.error('Error loading sounds:', error);
      }
    }
  }

  async function unloadSounds() {
    if (Platform.OS === 'web') {
      try {
        if (completeSoundRef.current) {
          await completeSoundRef.current.unloadAsync();
        }
        if (breatheSoundRef.current) {
          await breatheSoundRef.current.unloadAsync();
        }
        if (relaxSoundRef.current) {
          await relaxSoundRef.current.unloadAsync();
        }
      } catch (error) {
        console.error('Error unloading sounds:', error);
      }
    }
  }

  const playCompleteSound = async () => {
    if (Platform.OS === 'web' && completeSoundRef.current) {
      try {
        await completeSoundRef.current.replayAsync();
      } catch (error) {
        console.error('Error playing complete sound:', error);
      }
    }
  };

  const playBreatheSound = async () => {
    if (Platform.OS === 'web' && breatheSoundRef.current) {
      try {
        await breatheSoundRef.current.replayAsync();
      } catch (error) {
        console.error('Error playing breathe sound:', error);
      }
    }
  };

  const stopBreatheSound = async () => {
    if (Platform.OS === 'web' && breatheSoundRef.current) {
      try {
        await breatheSoundRef.current.stopAsync();
      } catch (error) {
        console.error('Error stopping breathe sound:', error);
      }
    }
  };

  const playRelaxSound = async () => {
    if (Platform.OS === 'web' && relaxSoundRef.current) {
      try {
        await relaxSoundRef.current.replayAsync();
      } catch (error) {
        console.error('Error playing relax sound:', error);
      }
    }
  };

  const stopRelaxSound = async () => {
    if (Platform.OS === 'web' && relaxSoundRef.current) {
      try {
        await relaxSoundRef.current.stopAsync();
      } catch (error) {
        console.error('Error stopping relax sound:', error);
      }
    }
  };

  return {
    playCompleteSound,
    playBreatheSound,
    stopBreatheSound,
    playRelaxSound,
    stopRelaxSound,
  };
}