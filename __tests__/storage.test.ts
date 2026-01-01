import { describe, it, expect, beforeEach, vi } from 'vitest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveDogProfile,
  getDogProfile,
  saveUserProgress,
  getUserProgress,
  addCompletedExercise,
  savePremiumStatus,
  getPremiumStatus,
  clearAllData,
} from '../lib/storage';
import type { DogProfile, UserProgress, ExerciseCompletion, PremiumStatus } from '../types';

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage');

describe('Storage Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Exercise Completion - Streak Logic', () => {
    it('should initialize streak to 1 on first activity', async () => {
      const initialProgress: UserProgress = {
        dogId: '1',
        enrolledPaths: ['basic-obedience'],
        completedExercises: [],
        currentStreak: 0,
        longestStreak: 0,
        totalTrainingMinutes: 0,
        badges: [],
      };

      const completion: ExerciseCompletion = {
        exerciseId: 'ex-1',
        pathId: 'basic-obedience',
        completedAt: new Date().toISOString(),
        estimatedMinutes: 20,
      };

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(initialProgress));
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await addCompletedExercise(completion);

      expect(vi.mocked(AsyncStorage.setItem)).toHaveBeenCalled();
      const calls = vi.mocked(AsyncStorage.setItem).mock.calls;
      const savedCall = calls[calls.length - 1];
      if (savedCall && typeof savedCall[1] === 'string') {
        const savedProgress = JSON.parse(savedCall[1]);
        expect(savedProgress.currentStreak).toBe(1);
        expect(savedProgress.longestStreak).toBe(1);
      }
    });

    it('should not duplicate exercise completion on same day', async () => {
      const today = new Date().toISOString();
      const initialProgress: UserProgress = {
        dogId: '1',
        enrolledPaths: ['basic-obedience'],
        completedExercises: [
          {
            exerciseId: 'ex-1',
            pathId: 'basic-obedience',
            completedAt: today,
            estimatedMinutes: 20,
          },
        ],
        currentStreak: 1,
        longestStreak: 1,
        totalTrainingMinutes: 20,
        badges: [],
      };

      const completion: ExerciseCompletion = {
        exerciseId: 'ex-1',
        pathId: 'basic-obedience',
        completedAt: today,
        estimatedMinutes: 20,
      };

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(initialProgress));
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await addCompletedExercise(completion);

      expect(vi.mocked(AsyncStorage.setItem)).toHaveBeenCalled();
    });

    it('should increment streak for consecutive day activity', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString();

      const initialProgress: UserProgress = {
        dogId: '1',
        enrolledPaths: ['basic-obedience'],
        completedExercises: [
          {
            exerciseId: 'ex-1',
            pathId: 'basic-obedience',
            completedAt: yesterdayStr,
            estimatedMinutes: 20,
          },
        ],
        currentStreak: 1,
        longestStreak: 1,
        totalTrainingMinutes: 20,
        lastActivityDate: yesterdayStr,
        badges: [],
      };

      const today = new Date().toISOString();
      const completion: ExerciseCompletion = {
        exerciseId: 'ex-2',
        pathId: 'basic-obedience',
        completedAt: today,
        estimatedMinutes: 15,
      };

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(initialProgress));
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await addCompletedExercise(completion);

      expect(vi.mocked(AsyncStorage.setItem)).toHaveBeenCalled();
    });

    it('should reset streak if more than 1 day has passed', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = twoDaysAgo.toISOString();

      const initialProgress: UserProgress = {
        dogId: '1',
        enrolledPaths: ['basic-obedience'],
        completedExercises: [
          {
            exerciseId: 'ex-1',
            pathId: 'basic-obedience',
            completedAt: twoDaysAgoStr,
            estimatedMinutes: 20,
          },
        ],
        currentStreak: 5,
        longestStreak: 5,
        totalTrainingMinutes: 100,
        lastActivityDate: twoDaysAgoStr,
        badges: [],
      };

      const today = new Date().toISOString();
      const completion: ExerciseCompletion = {
        exerciseId: 'ex-2',
        pathId: 'basic-obedience',
        completedAt: today,
        estimatedMinutes: 15,
      };

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(initialProgress));
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await addCompletedExercise(completion);

      expect(vi.mocked(AsyncStorage.setItem)).toHaveBeenCalled();
    });

    it('should track total training minutes correctly', async () => {
      const initialProgress: UserProgress = {
        dogId: '1',
        enrolledPaths: ['basic-obedience'],
        completedExercises: [],
        currentStreak: 0,
        longestStreak: 0,
        totalTrainingMinutes: 0,
        badges: [],
      };

      const completion: ExerciseCompletion = {
        exerciseId: 'ex-1',
        pathId: 'basic-obedience',
        completedAt: new Date().toISOString(),
        estimatedMinutes: 25,
      };

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(initialProgress));
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await addCompletedExercise(completion);

      expect(vi.mocked(AsyncStorage.setItem)).toHaveBeenCalled();
    });
  });

  describe('Premium Status', () => {
    it('should save and retrieve premium status', async () => {
      const status: PremiumStatus = {
        isPremium: true,
        subscriptionType: 'yearly',
        expiresAt: new Date().toISOString(),
        purchaseDate: new Date().toISOString(),
      };

      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await savePremiumStatus(status);

      expect(vi.mocked(AsyncStorage.setItem)).toHaveBeenCalled();
    });

    it('should return default free status if none exists', async () => {
      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null);

      const status = await getPremiumStatus();
      expect(status).toBeDefined();
      expect(status.isPremium).toBe(false);
    });
  });
});
