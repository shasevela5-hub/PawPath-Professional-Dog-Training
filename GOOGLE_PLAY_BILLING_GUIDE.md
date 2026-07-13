# Google Play Billing Integration Guide for PawPath

This guide walks you through integrating Google Play Billing to enable real in-app purchases for premium training paths in PawPath.

## Overview

Google Play Billing allows users to purchase premium training paths (Service Work, Herding, Agility, etc.) directly from the app. The integration uses the `react-native-iap` library which handles communication with Google Play's billing system.

## Prerequisites

Before starting, ensure you have:

1. **Google Play Developer Account** ($25 one-time fee)
   - Sign up at https://play.google.com/console
   - Complete your developer profile

2. **App Published on Google Play** (at least in internal testing)
   - Build and upload your APK/AAB to Google Play Console
   - Create the app listing (can be in draft/internal testing status)

3. **Keystore File** for signing APKs
   - Generate if you don't have one: `keytool -genkey -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias`

## Step 1: Set Up Google Play Console

### 1.1 Create Your App

1. Go to https://play.google.com/console
2. Click **Create app**
3. Enter app name: "PawPath"
4. Select **Apps** as app type
5. Complete the required fields
6. Click **Create app**

### 1.2 Set Up In-App Products

1. In Google Play Console, go to your app
2. Navigate to **Monetize** → **In-app products**
3. Click **Create product**
4. Create the following products:

**Product 1: Premium Subscription (Annual)**
- Product ID: `pawpath_premium_annual`
- Product name: "PawPath Premium - Annual"
- Product type: Subscription
- Billing period: 1 year
- Price: $9.99/year (adjust as needed)
- Description: "Unlock all premium training paths including Service Work, Herding, Agility, Protection, Therapy Dog, and Search & Rescue training."

**Product 2: Premium Subscription (Monthly)**
- Product ID: `pawpath_premium_monthly`
- Product name: "PawPath Premium - Monthly"
- Product type: Subscription
- Billing period: 1 month
- Price: $0.99/month (adjust as needed)
- Description: "Unlock all premium training paths with monthly billing."

### 1.3 Set Up Billing Account

1. Go to **Setup** → **Billing profile**
2. Add your bank account and tax information
3. Verify your identity
4. This is required to receive payments

## Step 2: Install and Configure Dependencies

### 2.1 Install react-native-iap

```bash
cd /path/to/PawPath-Professional-Dog-Training
npm install react-native-iap
# or
pnpm add react-native-iap
```

### 2.2 Update app.json

Add the following to your `app.json` (or `app.config.ts`):

```json
{
  "plugins": [
    [
      "react-native-iap",
      {
        "androidVersion": "7.0.0"
      }
    ]
  ]
}
```

### 2.3 Rebuild the App

```bash
expo prebuild --clean
```

## Step 3: Implement Billing in PawPath

### 3.1 Create a Billing Service

Create a new file `lib/billing-service.ts`:

```typescript
import {
  initConnection,
  endConnection,
  getSubscriptions,
  requestSubscription,
  purchaseUpdatedListener,
  purchaseErrorListener,
  PurchaseError,
  Purchase,
} from 'react-native-iap';
import { Platform } from 'react-native';

const SUBSCRIPTION_SKUS = Platform.select({
  ios: ['pawpath_premium_monthly', 'pawpath_premium_annual'],
  android: ['pawpath_premium_monthly', 'pawpath_premium_annual'],
});

class BillingService {
  private purchaseUpdateSubscription: any;
  private purchaseErrorSubscription: any;

  async initialize() {
    try {
      await initConnection();
      console.log('Billing connection initialized');
      
      // Set up listeners
      this.purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: Purchase) => {
          console.log('Purchase updated:', purchase);
          // Handle successful purchase
          await this.handlePurchaseSuccess(purchase);
        }
      );

      this.purchaseErrorSubscription = purchaseErrorListener(
        (error: PurchaseError) => {
          console.error('Purchase error:', error);
          // Handle purchase error
        }
      );
    } catch (error) {
      console.error('Failed to initialize billing:', error);
    }
  }

  async getAvailableSubscriptions() {
    try {
      const subscriptions = await getSubscriptions({
        skus: SUBSCRIPTION_SKUS,
      });
      return subscriptions;
    } catch (error) {
      console.error('Failed to get subscriptions:', error);
      return [];
    }
  }

  async purchaseSubscription(sku: string) {
    try {
      await requestSubscription({
        sku: sku,
        andDangerouslyFinishTransactionAutomaticallyIOS: true,
      });
    } catch (error) {
      console.error('Failed to purchase subscription:', error);
      throw error;
    }
  }

  private async handlePurchaseSuccess(purchase: Purchase) {
    // Save purchase to AsyncStorage
    const purchaseData = {
      productId: purchase.productId,
      transactionId: purchase.transactionId,
      purchaseTime: purchase.purchaseTime,
      purchaseToken: purchase.purchaseToken,
    };

    // Store in AsyncStorage
    await AsyncStorage.setItem(
      'premium_purchase',
      JSON.stringify(purchaseData)
    );

    // Mark user as premium
    await AsyncStorage.setItem('is_premium', 'true');
  }

  async isPremium(): Promise<boolean> {
    const isPremium = await AsyncStorage.getItem('is_premium');
    return isPremium === 'true';
  }

  async cleanup() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
    }
    await endConnection();
  }
}

export const billingService = new BillingService();
```

### 3.2 Update Premium Screen

Update `app/premium.tsx` to use real billing:

```typescript
import { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { Button } from '@/components/ui/button';
import { billingService } from '@/lib/billing-service';

export default function PremiumScreen() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const subs = await billingService.getAvailableSubscriptions();
      setSubscriptions(subs);
    } catch (error) {
      Alert.alert('Error', 'Failed to load subscription options');
    }
  };

  const handlePurchase = async (sku: string) => {
    setLoading(true);
    try {
      await billingService.purchaseSubscription(sku);
      Alert.alert('Success', 'Premium subscription activated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView>
        <Text className="text-3xl font-bold text-foreground mb-4">
          Unlock Premium Training
        </Text>

        {subscriptions.map((sub) => (
          <View key={sub.productId} className="mb-4 p-4 bg-surface rounded-lg border border-border">
            <Text className="text-xl font-semibold text-foreground">
              {sub.title}
            </Text>
            <Text className="text-lg text-primary font-bold my-2">
              {sub.localizedPrice}
            </Text>
            <Text className="text-sm text-muted mb-4">
              {sub.description}
            </Text>
            <Button
              onPress={() => handlePurchase(sub.productId)}
              disabled={loading}
            >
              <Text className="text-white font-semibold">Subscribe Now</Text>
            </Button>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
```

### 3.3 Initialize Billing on App Start

Update `app/_layout.tsx`:

```typescript
import { useEffect } from 'react';
import { billingService } from '@/lib/billing-service';

export default function RootLayout() {
  useEffect(() => {
    billingService.initialize();
    
    return () => {
      billingService.cleanup();
    };
  }, []);

  // ... rest of your layout
}
```

## Step 4: Build and Test

### 4.1 Build APK for Testing

```bash
eas build --platform android --profile preview
```

### 4.2 Test with Google Play Console

1. Go to Google Play Console → Your App
2. Navigate to **Testing** → **Internal testing**
3. Add test users (your email address)
4. Install the APK on a test device
5. Test purchases in sandbox mode

### 4.3 Verify Purchases

In your app, verify that:
- Subscription options display correctly
- Purchase flow completes without errors
- Premium status is saved and persists
- Premium training paths unlock after purchase

## Step 5: Deploy to Production

### 5.1 Create Release Build

```bash
eas build --platform android --profile production
```

### 5.2 Upload to Google Play Console

1. Go to **Release** → **Production**
2. Upload your AAB file
3. Fill in all required fields (screenshots, description, etc.)
4. Submit for review

### 5.3 Monitor Payments

Once live, monitor:
- **Earnings** tab for revenue
- **Orders** tab for transaction history
- **Subscriptions** tab for active subscribers

## Troubleshooting

### Common Issues

**"Product not found" error:**
- Ensure product IDs match exactly in code and Google Play Console
- Wait 24 hours after creating products before testing

**"Billing unavailable" error:**
- Verify Google Play Services is installed on test device
- Check that test user account is added to internal testing

**Purchases not persisting:**
- Ensure AsyncStorage is properly configured
- Verify purchase verification logic is correct

**App rejected by Google Play:**
- Include privacy policy URL
- Clearly disclose what premium features include
- Ensure billing flows are clear and transparent

## Best Practices

1. **Always verify receipts** on your backend server for security
2. **Handle subscription renewals** gracefully
3. **Provide clear cancellation options** in app settings
4. **Test thoroughly** before production release
5. **Monitor refund rates** and adjust pricing if needed
6. **Communicate value** of premium features clearly

## Additional Resources

- [Google Play Billing Documentation](https://developer.android.com/google/play/billing)
- [react-native-iap Documentation](https://github.com/dooboolab-community/react-native-iap)
- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)

## Support

For issues with:
- **Google Play Console**: Contact Google Play Support
- **react-native-iap**: Check GitHub issues and documentation
- **Expo Build**: Check Expo documentation and forums

---

**Next Steps:**
1. Create Google Play Developer account
2. Set up in-app products in Google Play Console
3. Implement the billing service code
4. Test with internal testing
5. Submit to production
