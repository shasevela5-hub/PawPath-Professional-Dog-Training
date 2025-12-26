import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/screen-container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

import { getTrainingPathById } from '@/data/training-paths';
import { getUserProgress, saveUserProgress } from '@/lib/storage';
import type { TrainingPath, UserProgress } from '@/types';

export default function PathDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [path, setPath] = useState<TrainingPath | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      if (!id) return;
      
      const foundPath = getTrainingPathById(id);
      if (foundPath) {
        setPath(foundPath);
        
        const progress = await getUserProgress();
        if (progress) {
          setUserProgress(progress);
          setIsEnrolled(progress.enrolledPaths.includes(id));
          
          // Calculate completion
          const completedCount = progress.completedExercises.filter(
            c => c.pathId === id
          ).length;
          const total = foundPath.exercises.length;
          setCompletionPercentage(total > 0 ? Math.round((completedCount / total) * 100) : 0);
        }
      }
    } catch (error) {
      console.error('Error loading path:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll() {
    if (!path || !userProgress) return;
    
    try {
      const updatedProgress: UserProgress = {
        ...userProgress,
        enrolledPaths: [...userProgress.enrolledPaths, path.id],
      };
      
      await saveUserProgress(updatedProgress);
      setUserProgress(updatedProgress);
      setIsEnrolled(true);
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  }

  function isExerciseCompleted(exerciseId: string): boolean {
    if (!userProgress) return false;
    return userProgress.completedExercises.some(c => c.exerciseId === exerciseId);
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

  if (!path) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-muted">Training path not found</Text>
          <Button
            variant="primary"
            size="md"
            className="mt-4"
            onPress={() => router.back()}
          >
            Go Back
          </Button>
        </View>
      </ScreenContainer>
    );
  }

  // Group exercises by week
  const exercisesByWeek = path.exercises.reduce((acc, exercise) => {
    const week = exercise.week || 1;
    if (!acc[week]) {
      acc[week] = [];
    }
    acc[week].push(exercise);
    return acc;
  }, {} as Record<number, typeof path.exercises>);

  const weeks = Object.keys(exercisesByWeek).map(Number).sort((a, b) => a - b);

  return (
    <ScreenContainer className="p-6">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-3">
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.back()}
              className="px-0 self-start"
            >
              ← Back
            </Button>
            <View className="flex-row items-center gap-3">
              <IconSymbol 
                name={path.icon as any} 
                size={40} 
                color={path.isPremium ? colors.warning : colors.primary} 
              />
              <View className="flex-1">
                <Text className="text-3xl font-bold text-foreground">
                  {path.title}
                </Text>
              </View>
            </View>
            <Text className="text-base text-muted">
              {path.description}
            </Text>
            <View className="flex-row items-center gap-2 flex-wrap">
              <Badge 
                variant={
                  path.difficulty === 'beginner' ? 'success' :
                  path.difficulty === 'intermediate' ? 'warning' : 'error'
                }
                size="sm"
              >
                {path.difficulty}
              </Badge>
              <Badge variant="default" size="sm">
                {path.estimatedWeeks} weeks
              </Badge>
              <Badge variant="default" size="sm">
                {path.exercises.length} exercises
              </Badge>
              {path.isPremium && (
                <Badge variant="premium" size="sm">
                  Premium
                </Badge>
              )}
            </View>
          </View>

          {/* Progress Card */}
          {isEnrolled && (
            <Card className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-foreground">
                  Your Progress
                </Text>
                <Text className="text-2xl font-bold text-primary">
                  {completionPercentage}%
                </Text>
              </View>
              <ProgressBar progress={completionPercentage} height={10} />
              <Text className="text-sm text-muted">
                {userProgress?.completedExercises.filter(c => c.pathId === path.id).length || 0} of {path.exercises.length} exercises completed
              </Text>
            </Card>
          )}

          {/* Enroll Button */}
          {!isEnrolled && (
            <Button
              variant="primary"
              size="lg"
              onPress={handleEnroll}
            >
              Start This Training Path
            </Button>
          )}

          {/* Exercises by Week */}
          {path.exercises.length > 0 ? (
            <View className="gap-6">
              <Text className="text-2xl font-bold text-foreground">
                Training Program
              </Text>
              {weeks.map((week) => (
                <View key={week} className="gap-3">
                  <Text className="text-xl font-semibold text-foreground">
                    Week {week}
                  </Text>
                  {exercisesByWeek[week].map((exercise) => {
                    const completed = isExerciseCompleted(exercise.id);
                    return (
                      <TouchableOpacity
                        key={exercise.id}
                        onPress={() => {
                          router.push(`/exercise/${exercise.id}?pathId=${path.id}`);
                        }}
                        activeOpacity={0.7}
                      >
                        <Card className="gap-3">
                          <View className="flex-row items-start justify-between">
                            <View className="flex-1 gap-2">
                              <View className="flex-row items-center gap-2">
                                {completed && (
                                  <IconSymbol 
                                    name="checkmark.circle.fill" 
                                    size={20} 
                                    color={colors.success} 
                                  />
                                )}
                                <Text className={`text-lg font-semibold ${completed ? 'text-muted line-through' : 'text-foreground'}`}>
                                  {exercise.title}
                                </Text>
                              </View>
                              <Text className="text-sm text-muted" numberOfLines={2}>
                                {exercise.description}
                              </Text>
                              <View className="flex-row items-center gap-2 flex-wrap">
                                <Badge 
                                  variant={
                                    exercise.difficulty === 'beginner' ? 'success' :
                                    exercise.difficulty === 'intermediate' ? 'warning' : 'error'
                                  }
                                  size="sm"
                                >
                                  {exercise.difficulty}
                                </Badge>
                                <Text className="text-xs text-muted">
                                  {exercise.estimatedMinutes} min
                                </Text>
                              </View>
                            </View>
                            <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                          </View>
                        </Card>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          ) : (
            <Card className="items-center py-8">
              <Text className="text-base text-muted text-center">
                Exercises for this path are coming soon!
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
