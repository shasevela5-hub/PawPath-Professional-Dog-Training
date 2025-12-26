import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/screen-container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

import { getDogProfile, saveDogProfile, getPremiumStatus, clearAllData } from '@/lib/storage';
import type { DogProfile, PremiumStatus, LifeStage } from '@/types';

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const [dogProfile, setDogProfile] = useState<DogProfile | null>(null);
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({ isPremium: false });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<DogProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const profile = await getDogProfile();
      const premium = await getPremiumStatus();
      
      setDogProfile(profile);
      setPremiumStatus(premium);
      
      if (profile) {
        setEditedProfile({ ...profile });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    if (!editedProfile) return;
    
    try {
      // Recalculate life stage based on age
      let newLifeStage: LifeStage = 'adult';
      if (editedProfile.age < 6) {
        newLifeStage = 'puppy';
      } else if (editedProfile.age < 18) {
        newLifeStage = 'adolescent';
      }
      
      const updatedProfile: DogProfile = {
        ...editedProfile,
        lifeStage: newLifeStage,
        updatedAt: new Date().toISOString(),
      };
      
      await saveDogProfile(updatedProfile);
      setDogProfile(updatedProfile);
      setIsEditing(false);
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  }

  function handleCancelEdit() {
    if (dogProfile) {
      setEditedProfile({ ...dogProfile });
    }
    setIsEditing(false);
  }

  function getLifeStageLabel(lifeStage: LifeStage): string {
    switch (lifeStage) {
      case 'puppy':
        return 'Puppy (0-6 months)';
      case 'adolescent':
        return 'Adolescent (6-18 months)';
      case 'adult':
        return 'Adult (18+ months)';
    }
  }

  async function handleResetData() {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              setDogProfile(null);
              setEditedProfile(null);
              Alert.alert('Success', 'All data has been reset. Restart the app to begin fresh.');
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Error', 'Failed to reset data.');
            }
          },
        },
      ]
    );
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

  if (!dogProfile || !editedProfile) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-lg text-muted text-center">
            No profile found.{'\n'}Create your dog's profile to get started!
          </Text>
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
          <View className="flex-row items-center justify-between">
            <Text className="text-4xl font-bold text-foreground">Profile</Text>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)} activeOpacity={0.7}>
                <Text className="text-base font-medium text-primary">Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Dog Profile Card */}
          <Card className="gap-4">
            <View className="flex-row items-center gap-4">
              <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center">
                <IconSymbol name="pawprint.fill" size={40} color={colors.primary} />
              </View>
              <View className="flex-1 gap-1">
                {isEditing ? (
                  <TextInput
                    value={editedProfile.name}
                    onChangeText={(text) =>
                      setEditedProfile({ ...editedProfile, name: text })
                    }
                    className="text-2xl font-bold text-foreground bg-surface px-3 py-2 rounded-lg"
                    placeholder="Dog's name"
                  />
                ) : (
                  <Text className="text-2xl font-bold text-foreground">
                    {dogProfile.name}
                  </Text>
                )}
                <Badge variant="default" size="sm" className="self-start">
                  {getLifeStageLabel(dogProfile.lifeStage)}
                </Badge>
              </View>
            </View>

            {/* Dog Details */}
            <View className="gap-3 pt-2 border-t border-border">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">Breed</Text>
                {isEditing ? (
                  <TextInput
                    value={editedProfile.breed || ''}
                    onChangeText={(text) =>
                      setEditedProfile({ ...editedProfile, breed: text })
                    }
                    className="text-base text-foreground bg-surface px-3 py-1 rounded-lg flex-1 ml-4"
                    placeholder="Enter breed"
                  />
                ) : (
                  <Text className="text-base text-foreground">
                    {dogProfile.breed || 'Not specified'}
                  </Text>
                )}
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">Age</Text>
                {isEditing ? (
                  <View className="flex-row items-center gap-2">
                    <TextInput
                      value={editedProfile.age.toString()}
                      onChangeText={(text) => {
                        const age = parseInt(text) || 0;
                        setEditedProfile({ ...editedProfile, age });
                      }}
                      keyboardType="numeric"
                      className="text-base text-foreground bg-surface px-3 py-1 rounded-lg w-20 text-center"
                      placeholder="0"
                    />
                    <Text className="text-base text-foreground">months</Text>
                  </View>
                ) : (
                  <Text className="text-base text-foreground">
                    {dogProfile.age} months
                  </Text>
                )}
              </View>

              {dogProfile.birthDate && (
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted">Birthday</Text>
                  <Text className="text-base text-foreground">
                    {new Date(dogProfile.birthDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>

            {/* Edit Actions */}
            {isEditing && (
              <View className="flex-row gap-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onPress={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onPress={handleSaveProfile}
                >
                  Save
                </Button>
              </View>
            )}
          </Card>

          {/* Behavioral Notes */}
          <Card className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Behavioral Notes
            </Text>
            {isEditing ? (
              <TextInput
                value={editedProfile.behavioralNotes || ''}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, behavioralNotes: text })
                }
                multiline
                numberOfLines={4}
                className="text-sm text-foreground bg-surface p-3 rounded-lg"
                placeholder="Add notes about your dog's behavior, preferences, or training progress..."
                textAlignVertical="top"
              />
            ) : (
              <Text className="text-sm text-muted">
                {dogProfile.behavioralNotes || 'No notes added yet.'}
              </Text>
            )}
          </Card>

          {/* Premium Status */}
          <Card className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">
                Subscription Status
              </Text>
              <Badge variant={premiumStatus.isPremium ? 'premium' : 'default'} size="md">
                {premiumStatus.isPremium ? 'Premium' : 'Free'}
              </Badge>
            </View>
            {premiumStatus.isPremium ? (
              <View className="gap-2">
                <Text className="text-sm text-muted">
                  You have access to all premium training paths!
                </Text>
                {premiumStatus.expiresAt && (
                  <Text className="text-xs text-muted">
                    Expires: {new Date(premiumStatus.expiresAt).toLocaleDateString()}
                  </Text>
                )}
              </View>
            ) : (
              <View className="gap-3">
                <Text className="text-sm text-muted">
                  Upgrade to premium to unlock specialized training paths.
                </Text>
                <Button
                  variant="primary"
                  size="md"
                  onPress={() => router.push('/premium')}
                >
                  Upgrade to Premium
                </Button>
              </View>
            )}
          </Card>

          {/* Settings */}
          <View className="gap-3">
            <Text className="text-xl font-bold text-foreground">Settings</Text>
            
            <TouchableOpacity activeOpacity={0.7}>
              <Card className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <IconSymbol name="gear" size={24} color={colors.muted} />
                  <Text className="text-base text-foreground">App Settings</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.muted} />
              </Card>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={handleResetData}>
              <Card className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <IconSymbol name="gear" size={24} color={colors.error} />
                  <Text className="text-base text-error">Reset All Data</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.muted} />
              </Card>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View className="items-center gap-2 py-4">
            <Text className="text-sm text-muted">PawPath v1.0.0</Text>
            <Text className="text-xs text-muted">Made with ❤️ for dog trainers</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
