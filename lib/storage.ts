/**
 * AsyncStorage utility functions for data persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  DogProfile,
  UserProgress,
  PremiumStatus,
  AppSettings,
  ExerciseCompletion,
} from '@/types';

// Storage keys
const KEYS = {
  DOG_PROFILE: '@pawpath:dog_profile',
  USER_PROGRESS: '@pawpath:user_progress',
  PREMIUM_STATUS: '@pawpath:premium_status',
  APP_SETTINGS: '@pawpath:app_settings',
  ONBOARDING_COMPLETE: '@pawpath:onboarding_complete',
} as const;

// Dog Profile
export async function saveDogProfile(profile: DogProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.DOG_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving dog profile:', error);
    throw error;
  }
}

export async function getDogProfile(): Promise<DogProfile | null> {
  try {
    const data = await AsyncStorage.getItem(KEYS.DOG_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading dog profile:', error);
    return null;
  }
}

// User Progress
export async function saveUserProgress(progress: UserProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
    throw error;
  }
}

export async function getUserProgress(): Promise<UserProgress | null> {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_PROGRESS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading user progress:', error);
    return null;
  }
}

export async function addCompletedExercise(
  completion: ExerciseCompletion
): Promise<void> {
  try {
    const progress = await getUserProgress();
    if (!progress) {
      throw new Error('No user progress found');
    }

    // Check if exercise already completed today
    const today = new Date().toISOString().split('T')[0];
    const alreadyCompletedToday = progress.completedExercises.some(
      c => c.exerciseId === completion.exerciseId && 
           c.completedAt.split('T')[0] === today
    );

    if (!alreadyCompletedToday) {
      progress.completedExercises.push(completion);
    }

    // Update last activity date
    const previousLastActivity = progress.lastActivityDate?.split('T')[0];
    progress.lastActivityDate = completion.completedAt;

    // Update streak
    if (!previousLastActivity) {
      // First activity ever
      progress.currentStreak = 1;
      progress.longestStreak = 1;
    } else if (previousLastActivity === today) {
      // Same day, streak continues (no change)
    } else {
      // Different day
      const lastDate = new Date(previousLastActivity + 'T00:00:00Z');
      const todayDate = new Date(today + 'T00:00:00Z');
      const diffDays = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        // Consecutive day - increment streak
        progress.currentStreak += 1;
        progress.longestStreak = Math.max(
          progress.longestStreak,
          progress.currentStreak
        );
      } else if (diffDays > 1) {
        // Streak broken - reset to 1
        progress.currentStreak = 1;
      }
    }

    // Update total training minutes
    if (completion.estimatedMinutes) {
      progress.totalTrainingMinutes += completion.estimatedMinutes;
    }

    await saveUserProgress(progress);
  } catch (error) {
    console.error('Error adding completed exercise:', error);
    throw error;
  }
}

// Premium Status
export async function savePremiumStatus(status: PremiumStatus): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.PREMIUM_STATUS, JSON.stringify(status));
  } catch (error) {
    console.error('Error saving premium status:', error);
    throw error;
  }
}

export async function getPremiumStatus(): Promise<PremiumStatus> {
  try {
    const data = await AsyncStorage.getItem(KEYS.PREMIUM_STATUS);
    if (data) {
      const status: PremiumStatus = JSON.parse(data);
      // Check if premium has expired
      if (status.expiresAt && new Date(status.expiresAt) < new Date()) {
        status.isPremium = false;
        await savePremiumStatus(status);
      }
      return status;
    }
    return { isPremium: false };
  } catch (error) {
    console.error('Error loading premium status:', error);
    return { isPremium: false };
  }
}

// App Settings
export async function saveAppSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving app settings:', error);
    throw error;
  }
}

export async function getAppSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(KEYS.APP_SETTINGS);
    if (data) {
      return JSON.parse(data);
    }
    // Default settings
    return {
      theme: 'auto',
      notificationsEnabled: true,
      hapticFeedbackEnabled: true,
    };
  } catch (error) {
    console.error('Error loading app settings:', error);
    return {
      theme: 'auto',
      notificationsEnabled: true,
      hapticFeedbackEnabled: true,
    };
  }
}

// Onboarding
export async function setOnboardingComplete(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETE, 'true');
  } catch (error) {
    console.error('Error setting onboarding complete:', error);
  }
}

export async function isOnboardingComplete(): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETE);
    return data === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

// Initialize default data for new users
export async function initializeDefaultData(dogProfile: DogProfile): Promise<void> {
  try {
    // Save dog profile
    await saveDogProfile(dogProfile);

    // Initialize user progress
    const progress: UserProgress = {
      dogId: dogProfile.id,
      enrolledPaths: ['basic-obedience'], // Start with basic training
      completedExercises: [],
      currentStreak: 0,
      longestStreak: 0,
      totalTrainingMinutes: 0,
      badges: [],
    };
    await saveUserProgress(progress);

    // Initialize premium status (free by default)
    await savePremiumStatus({ isPremium: false });

    // Initialize app settings
    await saveAppSettings({
      theme: 'auto',
      notificationsEnabled: true,
      hapticFeedbackEnabled: true,
    });

    await setOnboardingComplete();
  } catch (error) {
    console.error('Error initializing default data:', error);
    throw error;
  }
}

// Clear all data (for testing or reset)
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}
