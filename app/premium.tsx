import { ScrollView, Text, View, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/screen-container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

import { getPremiumStatus, savePremiumStatus } from '@/lib/storage';
import type { PremiumStatus } from '@/types';

export default function PremiumUpgradeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({ isPremium: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const status = await getPremiumStatus();
      setPremiumStatus(status);
    } catch (error) {
      console.error('Error loading premium status:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(type: 'monthly' | 'yearly') {
    // TODO: Implement actual in-app purchase flow
    // This is a placeholder for demonstration
    
    Alert.alert(
      'Purchase Premium',
      `You selected the ${type} plan. In a production app, this would trigger the payment flow.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Simulate Purchase',
          onPress: async () => {
            try {
              // Simulate successful purchase
              const expiresAt = new Date();
              if (type === 'monthly') {
                expiresAt.setMonth(expiresAt.getMonth() + 1);
              } else {
                expiresAt.setFullYear(expiresAt.getFullYear() + 1);
              }
              
              const newStatus: PremiumStatus = {
                isPremium: true,
                subscriptionType: type,
                expiresAt: expiresAt.toISOString(),
                purchaseDate: new Date().toISOString(),
              };
              
              await savePremiumStatus(newStatus);
              setPremiumStatus(newStatus);
              
              Alert.alert(
                'Success! 🎉',
                'Premium features unlocked! You now have access to all specialized training paths.',
                [
                  {
                    text: 'Start Training',
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch (error) {
              console.error('Error simulating purchase:', error);
              Alert.alert('Error', 'Failed to process purchase.');
            }
          },
        },
      ]
    );
  }

  async function handleRestorePurchases() {
    // TODO: Implement restore purchases
    Alert.alert(
      'Restore Purchases',
      'In a production app, this would restore previous purchases from the app store.'
    );
  }

  const freeFeatures = [
    'Basic Obedience Training',
    'House Training Program',
    'Socialization Exercises',
    'Progress Tracking',
    'Exercise Completion History',
  ];

  const premiumFeatures = [
    'All Free Features',
    'Service Work Training',
    'Herding Training',
    'Agility Training',
    'Protection Training',
    'Therapy Dog Training',
    'Search & Rescue Training',
    'Advanced Exercises',
    'Priority Support',
  ];

  if (loading) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-muted">Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (premiumStatus.isPremium) {
    return (
      <ScreenContainer className="p-6">
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 gap-6">
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.back()}
              className="px-0 self-start"
            >
              ← Back
            </Button>

            <View className="items-center gap-4 py-8">
              <View className="w-24 h-24 rounded-full bg-premium/20 items-center justify-center">
                <IconSymbol name="star.fill" size={48} color={colors.warning} />
              </View>
              <Text className="text-3xl font-bold text-foreground text-center">
                You're Premium! 🎉
              </Text>
              <Text className="text-base text-muted text-center">
                You have access to all specialized training paths and premium features.
              </Text>
            </View>

            <Card className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-foreground">
                  Subscription Status
                </Text>
                <Badge variant="premium" size="md">
                  Active
                </Badge>
              </View>
              {premiumStatus.subscriptionType && (
                <Text className="text-sm text-muted">
                  Plan: {premiumStatus.subscriptionType === 'monthly' ? 'Monthly' : 'Yearly'}
                </Text>
              )}
              {premiumStatus.expiresAt && (
                <Text className="text-sm text-muted">
                  Renews: {new Date(premiumStatus.expiresAt).toLocaleDateString()}
                </Text>
              )}
            </Card>

            <Card className="gap-4">
              <Text className="text-lg font-semibold text-foreground">
                Premium Features
              </Text>
              {premiumFeatures.map((feature, index) => (
                <View key={index} className="flex-row items-center gap-3">
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                  <Text className="flex-1 text-sm text-foreground">{feature}</Text>
                </View>
              ))}
            </Card>

            <Button
              variant="primary"
              size="lg"
              onPress={() => router.back()}
            >
              Start Training
            </Button>
          </View>
        </ScrollView>
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
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.back()}
            className="px-0 self-start"
          >
            ← Back
          </Button>

          {/* Header */}
          <View className="items-center gap-4 py-4">
            <View className="w-20 h-20 rounded-full bg-premium/20 items-center justify-center">
              <IconSymbol name="star.fill" size={40} color={colors.warning} />
            </View>
            <Text className="text-4xl font-bold text-foreground text-center">
              Upgrade to Premium
            </Text>
            <Text className="text-base text-muted text-center">
              Unlock all specialized training paths and take your dog's training to the next level.
            </Text>
          </View>

          {/* Pricing Cards */}
          <View className="gap-4">
            {/* Yearly Plan */}
            <Card className="gap-4 border-2 border-premium">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Badge variant="premium" size="sm" className="self-start mb-2">
                    Best Value
                  </Badge>
                  <Text className="text-2xl font-bold text-foreground">Yearly</Text>
                  <Text className="text-sm text-muted">Save 40% compared to monthly</Text>
                </View>
                <View className="items-end">
                  <Text className="text-3xl font-bold text-foreground">$49.99</Text>
                  <Text className="text-sm text-muted">/year</Text>
                </View>
              </View>
              <Button
                variant="primary"
                size="lg"
                onPress={() => handlePurchase('yearly')}
              >
                Subscribe Yearly
              </Button>
            </Card>

            {/* Monthly Plan */}
            <Card className="gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-foreground">Monthly</Text>
                  <Text className="text-sm text-muted">Flexible monthly billing</Text>
                </View>
                <View className="items-end">
                  <Text className="text-3xl font-bold text-foreground">$6.99</Text>
                  <Text className="text-sm text-muted">/month</Text>
                </View>
              </View>
              <Button
                variant="outline"
                size="lg"
                onPress={() => handlePurchase('monthly')}
              >
                Subscribe Monthly
              </Button>
            </Card>
          </View>

          {/* Feature Comparison */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-foreground">What's Included</Text>
            
            {/* Free Features */}
            <Card className="gap-3">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-semibold text-foreground">Free Plan</Text>
                <Badge variant="success" size="sm">
                  Current
                </Badge>
              </View>
              {freeFeatures.map((feature, index) => (
                <View key={index} className="flex-row items-center gap-3">
                  <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                  <Text className="flex-1 text-sm text-foreground">{feature}</Text>
                </View>
              ))}
            </Card>

            {/* Premium Features */}
            <Card className="gap-3 bg-premium/5 border-premium/20">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="star.fill" size={20} color={colors.warning} />
                <Text className="text-lg font-semibold text-foreground">Premium Plan</Text>
              </View>
              {premiumFeatures.map((feature, index) => (
                <View key={index} className="flex-row items-center gap-3">
                  <IconSymbol name="checkmark.circle.fill" size={16} color={colors.warning} />
                  <Text className="flex-1 text-sm text-foreground">{feature}</Text>
                </View>
              ))}
            </Card>
          </View>

          {/* Restore Purchases */}
          <Button
            variant="ghost"
            size="md"
            onPress={handleRestorePurchases}
          >
            Restore Purchases
          </Button>

          {/* Terms */}
          <Text className="text-xs text-muted text-center">
            Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
