import { ScrollView, Text, View, TextInput, Alert, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

import { getTrainingPathById } from '@/data/training-paths';
import { getUserProgress, addCompletedExercise, saveUserProgress } from '@/lib/storage';
import type { Exercise, ExerciseCompletion } from '@/types';

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const { id, pathId } = useLocalSearchParams<{ id: string; pathId: string }>();
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const [showTips, setShowTips] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExercise();
  }, [id, pathId]);

  async function loadExercise() {
    try {
      if (!id || !pathId) return;
      
      const path = getTrainingPathById(pathId);
      if (!path) return;
      
      const foundExercise = path.exercises.find(e => e.id === id);
      if (foundExercise) {
        setExercise(foundExercise);
        
        // Check if already completed
        const progress = await getUserProgress();
        if (progress) {
          const completed = progress.completedExercises.some(
            c => c.exerciseId === id
          );
          setIsCompleted(completed);
        }
      }
    } catch (error) {
      console.error('Error loading exercise:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkComplete() {
    if (!exercise) return;
    
    try {
      const completion: ExerciseCompletion = {
        exerciseId: exercise.id,
        pathId: exercise.pathId,
        completedAt: new Date().toISOString(),
        notes: notes.trim() || undefined,
        estimatedMinutes: exercise.estimatedMinutes,
      };
      
      await addCompletedExercise(completion);
      setIsCompleted(true);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert(
        'Great Job! 🎉',
        `Exercise completed! You've trained for ${exercise.estimatedMinutes} minutes.`,
        [
          {
            text: 'Continue Training',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error marking complete:', error);
      console.error('Full error:', JSON.stringify(error));
      Alert.alert('Error', 'Failed to save completion. Please try again.');
    }
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

  if (!exercise) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-muted">Exercise not found</Text>
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

  return (
    <ScreenContainer className="p-6">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onPress={() => router.back()}
                className="px-0"
              >
                ← Back
              </Button>
            </View>
            <Text className="text-3xl font-bold text-foreground">
              {exercise.title}
            </Text>
            <Text className="text-base text-muted">
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
              <Badge variant="default" size="sm">
                {exercise.estimatedMinutes} min
              </Badge>
              {exercise.week && (
                <Badge variant="default" size="sm">
                  Week {exercise.week}
                </Badge>
              )}
              {isCompleted && (
                <Badge variant="success" size="sm">
                  ✓ Completed
                </Badge>
              )}
            </View>
          </View>

          {/* Required Equipment */}
          {exercise.requiredEquipment && exercise.requiredEquipment.length > 0 && (
            <Card className="gap-3">
              <Text className="text-lg font-semibold text-foreground">
                Required Equipment
              </Text>
              <View className="gap-2">
                {exercise.requiredEquipment.map((item, index) => (
                  <View key={index} className="flex-row items-center gap-2">
                    <IconSymbol name="checkmark.circle.fill" size={16} color={colors.primary} />
                    <Text className="text-sm text-foreground">{item}</Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {/* Steps */}
          <Card className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              Step-by-Step Instructions
            </Text>
            {exercise.steps.map((step) => (
              <View key={step.stepNumber} className="gap-2">
                <View className="flex-row items-start gap-3">
                  <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                    <Text className="text-white font-bold">{step.stepNumber}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base text-foreground leading-relaxed">
                      {step.instruction}
                    </Text>
                    {step.duration && (
                      <Text className="text-sm text-muted mt-1">
                        ⏱ Duration: {step.duration} seconds
                      </Text>
                    )}
                    {step.repetitions && (
                      <Text className="text-sm text-muted mt-1">
                        🔄 Repetitions: {step.repetitions}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </Card>

          {/* Tips Section */}
          {exercise.tips && exercise.tips.length > 0 && (
            <Card className="gap-3">
              <View 
                className="flex-row items-center justify-between"
                onTouchEnd={() => setShowTips(!showTips)}
              >
                <Text className="text-lg font-semibold text-foreground">
                  Training Tips
                </Text>
                <IconSymbol 
                  name="chevron.right" 
                  size={20} 
                  color={colors.muted}
                  style={{ transform: [{ rotate: showTips ? '90deg' : '0deg' }] }}
                />
              </View>
              {showTips && (
                <View className="gap-3 pt-2">
                  {exercise.tips.map((tip, index) => (
                    <View key={index} className="flex-row items-start gap-2">
                      <Text className="text-base text-primary">💡</Text>
                      <Text className="flex-1 text-sm text-muted leading-relaxed">
                        {tip}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          )}

          {/* Notes Section */}
          <Card className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Your Notes
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              className="text-sm text-foreground bg-background p-3 rounded-lg border border-border"
              placeholder="Add notes about your training session, your dog's response, or things to remember..."
              textAlignVertical="top"
              editable={!isCompleted}
            />
          </Card>

          {/* Mark Complete Button */}
          {!isCompleted && (
            <Button
              variant="primary"
              size="lg"
              onPress={handleMarkComplete}
              className="mt-4"
            >
              Mark as Complete
            </Button>
          )}

          {isCompleted && (
            <Card className="bg-success/10 border-success/20">
              <View className="flex-row items-center gap-3">
                <IconSymbol name="checkmark.circle.fill" size={32} color={colors.success} />
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">
                    Exercise Completed!
                  </Text>
                  <Text className="text-sm text-muted">
                    Great job! Keep up the good work.
                  </Text>
                </View>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
