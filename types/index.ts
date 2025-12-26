/**
 * Core data types for PawPath dog training app
 */

export type LifeStage = 'puppy' | 'adolescent' | 'adult';

export type TrainingCategory = 
  | 'basic-obedience'
  | 'house-training'
  | 'socialization'
  | 'service-work'
  | 'herding'
  | 'agility'
  | 'protection'
  | 'therapy-dog'
  | 'search-rescue';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface DogProfile {
  id: string;
  name: string;
  breed?: string;
  birthDate?: string;
  age: number; // in months
  lifeStage: LifeStage;
  photoUri?: string;
  behavioralNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingPath {
  id: string;
  title: string;
  category: TrainingCategory;
  description: string;
  isPremium: boolean;
  lifeStages: LifeStage[]; // which life stages this path is suitable for
  difficulty: DifficultyLevel;
  estimatedWeeks: number;
  exercises: Exercise[];
  icon: string; // icon name for UI
}

export interface Exercise {
  id: string;
  pathId: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  week: number; // which week in the training path
  day?: number; // optional day within the week
  steps: ExerciseStep[];
  tips: string[];
  requiredEquipment?: string[];
  videoUrl?: string;
}

export interface ExerciseStep {
  stepNumber: number;
  instruction: string;
  duration?: number; // in seconds, for timed steps
  repetitions?: number; // for counted exercises
}

export interface ExerciseCompletion {
  exerciseId: string;
  pathId: string;
  completedAt: string;
  notes?: string;
  rating?: number; // 1-5 stars, optional user rating
}

export interface UserProgress {
  dogId: string;
  enrolledPaths: string[]; // array of training path IDs
  completedExercises: ExerciseCompletion[];
  currentStreak: number; // consecutive days with at least one exercise
  longestStreak: number;
  lastActivityDate?: string;
  totalTrainingMinutes: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface PremiumStatus {
  isPremium: boolean;
  subscriptionType?: 'monthly' | 'yearly';
  expiresAt?: string;
  purchaseDate?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notificationsEnabled: boolean;
  reminderTime?: string; // HH:MM format
  reminderDays?: number[]; // 0-6, Sunday to Saturday
  hapticFeedbackEnabled: boolean;
}

export interface TrainingSession {
  id: string;
  exerciseId: string;
  pathId: string;
  startedAt: string;
  completedAt?: string;
  duration?: number; // in seconds
  notes?: string;
}
