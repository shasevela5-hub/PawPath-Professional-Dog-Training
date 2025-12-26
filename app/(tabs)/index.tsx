import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/screen-container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

import { getDogProfile, getUserProgress, isOnboardingComplete } from '@/lib/storage';
import { getTrainingPathById } from '@/data/training-paths';
import type { DogProfile, UserProgress, Exercise } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [dogProfile, setDogProfile] = useState<DogProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [todayExercises, setTodayExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const onboardingDone = await isOnboardingComplete();
      
      if (!onboardingDone) {
        // Show onboarding for new users
        // For now, we'll create a default profile
        const defaultProfile: DogProfile = {
          id: Date.now().toString(),
          name: 'Buddy',
          age: 6,
          lifeStage: 'puppy',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const defaultProgress: UserProgress = {
          dogId: defaultProfile.id,
          enrolledPaths: ['basic-obedience'],
          completedExercises: [],
          currentStreak: 0,
          longestStreak: 0,
          totalTrainingMinutes: 0,
          badges: [],
        };

        setDogProfile(defaultProfile);
        setUserProgress(defaultProgress);
        
        // Get today's exercises
        const path = getTrainingPathById('basic-obedience');
        if (path && path.exercises.length > 0) {
          setTodayExercises(path.exercises.slice(0, 3));
        }
      } else {
        const profile = await getDogProfile();
        const progress = await getUserProgress();
        
        setDogProfile(profile);
        setUserProgress(progress);

        // Get exercises from enrolled paths
        if (progress && progress.enrolledPaths.length > 0) {
          const exercises: Exercise[] = [];
          for (const pathId of progress.enrolledPaths) {
            const path = getTrainingPathById(pathId);
            if (path) {
              // Get incomplete exercises
              const incomplete = path.exercises.filter(
                ex => !progress.completedExercises.some(c => c.exerciseId === ex.id)
              );
              exercises.push(...incomplete.slice(0, 2));
            }
          }
          setTodayExercises(exercises.slice(0, 3));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateCompletionPercentage(): number {
    if (!userProgress || userProgress.enrolledPaths.length === 0) return 0;
    
    let totalExercises = 0;
    let completedCount = userProgress.completedExercises.length;
    
    for (const pathId of userProgress.enrolledPaths) {
      const path = getTrainingPathById(pathId);
      if (path) {
        totalExercises += path.exercises.length;
      }
    }
    
    return totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;
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

  const completionPercentage = calculateCompletionPercentage();

  return (
    <ScreenContainer className="p-6">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">
              Welcome back!
            </Text>
            <Text className="text-lg text-muted">
              Training with {dogProfile?.name || 'your dog'}
            </Text>
          </View>

          {/* Progress Overview Card */}
          <Card className="gap-4">
            <View className="flex-row items-center justify-between">
              <View className="gap-1">
                <Text className="text-sm text-muted">Overall Progress</Text>
                <Text className="text-3xl font-bold text-foreground">
                  {completionPercentage}%
                </Text>
              </View>
              <View className="flex-row gap-4">
                <View className="items-center gap-1">
                  <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
                  <Text className="text-sm font-semibold text-foreground">
                    {userProgress?.completedExercises.length || 0}
                  </Text>
                  <Text className="text-xs text-muted">Done</Text>
                </View>
                <View className="items-center gap-1">
                  <Text className="text-2xl">🔥</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {userProgress?.currentStreak || 0}
                  </Text>
                  <Text className="text-xs text-muted">Streak</Text>
                </View>
              </View>
            </View>
            <ProgressBar progress={completionPercentage} height={10} />
          </Card>

          {/* Today's Exercises */}
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-foreground">
                Today's Training
              </Text>
              <TouchableOpacity onPress={() => router.push('/training')}>
                <Text className="text-sm font-medium text-primary">View All</Text>
              </TouchableOpacity>
            </View>

            {todayExercises.length === 0 ? (
              <Card className="items-center justify-center py-8">
                <Text className="text-base text-muted text-center">
                  No exercises scheduled for today.{'\n'}
                  Check the Training tab to get started!
                </Text>
                <Button
                  variant="primary"
                  size="md"
                  className="mt-4"
                  onPress={() => router.push('/training')}
                >
                  Browse Training Paths
                </Button>
              </Card>
            ) : (
              todayExercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  onPress={() => {
                    router.push(`/exercise/${exercise.id}?pathId=${exercise.pathId}`);
                  }}
                  activeOpacity={0.7}
                >
                  <Card className="gap-3">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 gap-1">
                        <Text className="text-lg font-semibold text-foreground">
                          {exercise.title}
                        </Text>
                        <Text className="text-sm text-muted" numberOfLines={2}>
                          {exercise.description}
                        </Text>
                      </View>
                      <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                    </View>
                    <View className="flex-row items-center gap-2">
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
                  </Card>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Quick Actions */}
          <View className="gap-3">
            <Text className="text-xl font-bold text-foreground">Quick Actions</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1"
                onPress={() => router.push('/training')}
                activeOpacity={0.7}
              >
                <Card className="items-center py-6 gap-2">
                  <IconSymbol name="book.fill" size={32} color={colors.primary} />
                  <Text className="text-sm font-medium text-foreground">
                    Browse Paths
                  </Text>
                </Card>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1"
                onPress={() => router.push('/progress')}
                activeOpacity={0.7}
              >
                <Card className="items-center py-6 gap-2">
                  <IconSymbol name="chart.bar.fill" size={32} color={colors.success} />
                  <Text className="text-sm font-medium text-foreground">
                    View Progress
                  </Text>
                </Card>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
