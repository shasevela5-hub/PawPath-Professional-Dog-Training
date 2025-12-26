import { ScrollView, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

import { getUserProgress } from '@/lib/storage';
import { getTrainingPathById } from '@/data/training-paths';
import type { UserProgress, ExerciseCompletion } from '@/types';

export default function ProgressScreen() {
  const colors = useColors();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const progress = await getUserProgress();
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculatePathProgress(pathId: string): number {
    if (!userProgress) return 0;
    
    const path = getTrainingPathById(pathId);
    if (!path || path.exercises.length === 0) return 0;
    
    const completedInPath = userProgress.completedExercises.filter(
      c => c.pathId === pathId
    ).length;
    
    return Math.round((completedInPath / path.exercises.length) * 100);
  }

  function getRecentCompletions(): ExerciseCompletion[] {
    if (!userProgress) return [];
    
    return [...userProgress.completedExercises]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 10);
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (loading) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-muted">Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!userProgress) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-lg text-muted text-center">
            No progress data yet.{'\n'}Start training to see your progress!
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const recentCompletions = getRecentCompletions();
  const totalExercises = userProgress.completedExercises.length;

  return (
    <ScreenContainer className="p-6">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">Your Progress</Text>
            <Text className="text-base text-muted">
              Track your training journey and celebrate achievements.
            </Text>
          </View>

          {/* Stats Overview */}
          <View className="flex-row gap-3">
            <Card className="flex-1 items-center py-4 gap-2">
              <IconSymbol name="checkmark.circle.fill" size={32} color={colors.success} />
              <Text className="text-2xl font-bold text-foreground">
                {totalExercises}
              </Text>
              <Text className="text-xs text-muted text-center">
                Exercises{'\n'}Completed
              </Text>
            </Card>
            <Card className="flex-1 items-center py-4 gap-2">
              <Text className="text-3xl">🔥</Text>
              <Text className="text-2xl font-bold text-foreground">
                {userProgress.currentStreak}
              </Text>
              <Text className="text-xs text-muted text-center">
                Day{'\n'}Streak
              </Text>
            </Card>
            <Card className="flex-1 items-center py-4 gap-2">
              <IconSymbol name="star.fill" size={32} color={colors.warning} />
              <Text className="text-2xl font-bold text-foreground">
                {userProgress.badges.length}
              </Text>
              <Text className="text-xs text-muted text-center">
                Badges{'\n'}Earned
              </Text>
            </Card>
          </View>

          {/* Training Time */}
          <Card className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">
                Total Training Time
              </Text>
              <Text className="text-2xl font-bold text-primary">
                {Math.round(userProgress.totalTrainingMinutes / 60)}h
              </Text>
            </View>
            <Text className="text-sm text-muted">
              {userProgress.totalTrainingMinutes} minutes across all exercises
            </Text>
          </Card>

          {/* Enrolled Paths Progress */}
          {userProgress.enrolledPaths.length > 0 && (
            <View className="gap-4">
              <Text className="text-2xl font-bold text-foreground">
                Training Paths
              </Text>
              {userProgress.enrolledPaths.map((pathId) => {
                const path = getTrainingPathById(pathId);
                if (!path) return null;
                
                const progress = calculatePathProgress(pathId);
                const completedCount = userProgress.completedExercises.filter(
                  c => c.pathId === pathId
                ).length;
                
                return (
                  <Card key={pathId} className="gap-3">
                    <View className="flex-row items-center gap-2">
                      <IconSymbol 
                        name={path.icon as any} 
                        size={24} 
                        color={colors.primary} 
                      />
                      <Text className="flex-1 text-lg font-semibold text-foreground">
                        {path.title}
                      </Text>
                      <Text className="text-sm font-bold text-primary">
                        {progress}%
                      </Text>
                    </View>
                    <ProgressBar progress={progress} height={8} />
                    <Text className="text-sm text-muted">
                      {completedCount} of {path.exercises.length} exercises completed
                    </Text>
                  </Card>
                );
              })}
            </View>
          )}

          {/* Recent Activity */}
          {recentCompletions.length > 0 && (
            <View className="gap-4">
              <Text className="text-2xl font-bold text-foreground">
                Recent Activity
              </Text>
              {recentCompletions.map((completion, index) => {
                const path = getTrainingPathById(completion.pathId);
                const exercise = path?.exercises.find(e => e.id === completion.exerciseId);
                
                if (!exercise) return null;
                
                return (
                  <Card key={`${completion.exerciseId}-${index}`} className="gap-2">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 gap-1">
                        <Text className="text-base font-semibold text-foreground">
                          {exercise.title}
                        </Text>
                        <Text className="text-sm text-muted">
                          {path?.title}
                        </Text>
                        {completion.notes && (
                          <Text className="text-sm text-muted italic mt-1">
                            "{completion.notes}"
                          </Text>
                        )}
                      </View>
                      <View className="items-end gap-1">
                        <IconSymbol 
                          name="checkmark.circle.fill" 
                          size={20} 
                          color={colors.success} 
                        />
                        <Text className="text-xs text-muted">
                          {formatDate(completion.completedAt)}
                        </Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          )}

          {/* Achievements Section */}
          {userProgress.longestStreak > 0 && (
            <Card className="gap-3">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="star.fill" size={24} color={colors.warning} />
                <Text className="text-lg font-semibold text-foreground">
                  Best Streak
                </Text>
              </View>
              <Text className="text-3xl font-bold text-foreground">
                {userProgress.longestStreak} days
              </Text>
              <Text className="text-sm text-muted">
                Your longest training streak. Keep it up!
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
