import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/screen-container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

import { getDogProfile, getPremiumStatus } from '@/lib/storage';
import { trainingPaths, getPathsByLifeStage } from '@/data/training-paths';
import type { DogProfile, PremiumStatus, LifeStage, TrainingPath } from '@/types';

export default function TrainingScreen() {
  const router = useRouter();
  const colors = useColors();
  const [dogProfile, setDogProfile] = useState<DogProfile | null>(null);
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({ isPremium: false });
  const [selectedLifeStage, setSelectedLifeStage] = useState<LifeStage>('puppy');
  const [filteredPaths, setFilteredPaths] = useState<TrainingPath[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filter paths by selected life stage
    const paths = getPathsByLifeStage(selectedLifeStage);
    setFilteredPaths(paths);
  }, [selectedLifeStage]);

  async function loadData() {
    try {
      const profile = await getDogProfile();
      const premium = await getPremiumStatus();
      
      if (profile) {
        setDogProfile(profile);
        setSelectedLifeStage(profile.lifeStage);
      }
      setPremiumStatus(premium);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  function handlePathPress(path: TrainingPath) {
    if (path.isPremium && !premiumStatus.isPremium) {
      // Navigate to premium upgrade screen
      router.push('/premium');
    } else {
      // Navigate to path detail
      router.push(`/path/${path.id}`);
    }
  }

  const lifeStages: { value: LifeStage; label: string }[] = [
    { value: 'puppy', label: 'Puppy' },
    { value: 'adolescent', label: 'Adolescent' },
    { value: 'adult', label: 'Adult' },
  ];

  const freePaths = filteredPaths.filter(p => !p.isPremium);
  const premiumPaths = filteredPaths.filter(p => p.isPremium);

  return (
    <ScreenContainer className="p-6">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">Training Paths</Text>
            <Text className="text-base text-muted">
              Choose training programs tailored to your dog's life stage and goals.
            </Text>
          </View>

          {/* Life Stage Selector */}
          <View className="gap-3">
            <Text className="text-sm font-medium text-foreground">Life Stage</Text>
            <View className="flex-row gap-2">
              {lifeStages.map((stage) => (
                <TouchableOpacity
                  key={stage.value}
                  onPress={() => setSelectedLifeStage(stage.value)}
                  activeOpacity={0.7}
                  className="flex-1"
                >
                  <View
                    className={`py-3 px-4 rounded-full border ${
                      selectedLifeStage === stage.value
                        ? 'bg-primary border-primary'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        selectedLifeStage === stage.value
                          ? 'text-white'
                          : 'text-foreground'
                      }`}
                    >
                      {stage.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Free Training Paths */}
          {freePaths.length > 0 && (
            <View className="gap-4">
              <View className="flex-row items-center gap-2">
                <Text className="text-2xl font-bold text-foreground">Free Training</Text>
                <Badge variant="success" size="sm">
                  Included
                </Badge>
              </View>
              {freePaths.map((path) => (
                <TouchableOpacity
                  key={path.id}
                  onPress={() => handlePathPress(path)}
                  activeOpacity={0.7}
                >
                  <Card className="gap-3">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 gap-2">
                        <View className="flex-row items-center gap-2">
                          <IconSymbol 
                            name={path.icon as any} 
                            size={24} 
                            color={colors.primary} 
                          />
                          <Text className="text-xl font-semibold text-foreground">
                            {path.title}
                          </Text>
                        </View>
                        <Text className="text-sm text-muted">
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
                          <Text className="text-xs text-muted">
                            {path.estimatedWeeks} weeks
                          </Text>
                          <Text className="text-xs text-muted">
                            {path.exercises.length} exercises
                          </Text>
                        </View>
                      </View>
                      <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Premium Training Paths */}
          {premiumPaths.length > 0 && (
            <View className="gap-4">
              <View className="flex-row items-center gap-2">
                <Text className="text-2xl font-bold text-foreground">
                  Specialized Training
                </Text>
                <Badge variant="premium" size="sm">
                  Premium
                </Badge>
              </View>
              {premiumPaths.map((path) => (
                <TouchableOpacity
                  key={path.id}
                  onPress={() => handlePathPress(path)}
                  activeOpacity={0.7}
                >
                  <Card className="gap-3 relative">
                    {!premiumStatus.isPremium && (
                      <View className="absolute top-3 right-3 z-10">
                        <View className="bg-premium/20 rounded-full p-2">
                          <IconSymbol name="lock.fill" size={16} color={colors.warning} />
                        </View>
                      </View>
                    )}
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 gap-2 pr-10">
                        <View className="flex-row items-center gap-2">
                          <IconSymbol 
                            name={path.icon as any} 
                            size={24} 
                            color={colors.warning} 
                          />
                          <Text className="text-xl font-semibold text-foreground">
                            {path.title}
                          </Text>
                        </View>
                        <Text className="text-sm text-muted">
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
                          <Text className="text-xs text-muted">
                            {path.estimatedWeeks} weeks
                          </Text>
                          {path.exercises.length > 0 && (
                            <Text className="text-xs text-muted">
                              {path.exercises.length} exercises
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Upgrade CTA */}
          {!premiumStatus.isPremium && premiumPaths.length > 0 && (
            <Card className="bg-gradient-to-r from-primary/10 to-warning/10 border-primary/20">
              <View className="gap-3">
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="star.fill" size={24} color={colors.warning} />
                  <Text className="text-xl font-bold text-foreground">
                    Unlock Premium
                  </Text>
                </View>
                <Text className="text-sm text-muted">
                  Get access to all specialized training paths including Service Work, Herding, Agility, and more!
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/premium')}
                  activeOpacity={0.7}
                  className="bg-premium py-3 px-6 rounded-full items-center"
                >
                  <Text className="text-white font-semibold">
                    Upgrade Now
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
