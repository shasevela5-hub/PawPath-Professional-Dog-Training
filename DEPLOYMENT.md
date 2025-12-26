# PawPath - Google Play Deployment Guide

This guide will walk you through deploying the PawPath dog training app to Google Play Store.

## Prerequisites

Before you begin, ensure you have:

1. **Google Play Developer Account** ($25 one-time fee)
   - Sign up at: https://play.google.com/console/signup

2. **Development Environment**
   - Node.js 18+ installed
   - Android Studio (for testing)
   - EAS CLI installed: `npm install -g eas-cli`

3. **Expo Account** (free)
   - Sign up at: https://expo.dev/signup
   - Login: `eas login`

## Step 1: Configure App for Production

### 1.1 Update App Configuration

Edit `app.config.ts`:

```typescript
const config: ExpoConfig = {
  name: "PawPath",
  slug: "dog-training-app",
  version: "1.0.0", // Update for each release
  // ... rest of config
};
```

### 1.2 Set Up App Icons and Splash Screen

The app already has:
- App icon: `assets/images/icon.png`
- Splash screen: `assets/images/splash-icon.png`
- Android adaptive icon: `assets/images/android-icon-foreground.png`

Ensure these are high-quality PNG images meeting Google Play requirements.

## Step 2: Configure EAS Build

### 2.1 Initialize EAS

```bash
cd /path/to/dog-training-app
eas build:configure
```

This creates `eas.json` with build profiles.

### 2.2 Update eas.json

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle",
        "gradleCommand": ":app:bundleRelease"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

## Step 3: Build Android App Bundle (AAB)

### 3.1 Build for Production

```bash
eas build --platform android --profile production
```

This will:
- Create an optimized production build
- Generate a signed AAB file
- Upload to Expo servers

The build typically takes 10-20 minutes.

### 3.2 Download the AAB

Once complete, download the AAB file from the Expo dashboard or use:

```bash
eas build:download --platform android --latest
```

## Step 4: Prepare Google Play Store Listing

### 4.1 Create App in Play Console

1. Go to https://play.google.com/console
2. Click "Create app"
3. Fill in:
   - App name: **PawPath**
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free (with in-app purchases)

### 4.2 Store Listing

**App Details:**
- App name: PawPath
- Short description (80 chars):
  ```
  Personalized dog training with life stage-specific exercises and progress tracking
  ```

- Full description (4000 chars):
  ```
  PawPath is your comprehensive dog training companion, offering personalized training paths based on your dog's life stage and training goals.

  🐕 LIFE STAGE TRAINING
  • Puppy (0-6 months): Foundation training and socialization
  • Adolescent (6-18 months): Building on basics and impulse control
  • Adult (18+ months): Advanced training and specialized skills

  🎯 FREE TRAINING PATHS
  • Basic Obedience: Sit, stay, come, down
  • House Training: Potty training and crate training
  • Socialization: Meeting people, dogs, and new environments

  ⭐ PREMIUM TRAINING PATHS
  • Service Work: Assistance dog tasks
  • Herding: Directional commands and livestock work
  • Agility: Jumps, weaves, and obstacle courses
  • Protection Training: Guard dog skills
  • Therapy Dog: Emotional support preparation
  • Search & Rescue: SAR operations training

  📊 PROGRESS TRACKING
  • Track completed exercises
  • Monitor training streaks
  • View detailed statistics
  • Earn achievement badges

  💪 EXERCISE FEATURES
  • Step-by-step instructions
  • Training tips from experts
  • Required equipment lists
  • Personal notes for each session
  • Timed and counted exercises

  🎓 DESIGNED FOR SUCCESS
  Each training path is carefully structured with weekly progression, ensuring your dog learns at the right pace. Whether you're training a new puppy or teaching advanced skills to an adult dog, PawPath guides you every step of the way.

  Perfect for first-time dog owners, experienced trainers, and everyone in between!
  ```

### 4.3 Graphics Assets

Create and upload the following:

**App Icon:**
- 512 x 512 px PNG
- Already available at `assets/images/icon.png`

**Feature Graphic:**
- 1024 x 500 px PNG
- Create a banner with app name and key features

**Screenshots (minimum 2, maximum 8):**
- Phone: 1080 x 1920 px or higher
- Take screenshots of:
  1. Home screen showing progress
  2. Training paths screen
  3. Exercise detail screen
  4. Progress tracking screen
  5. Dog profile screen

**Optional:**
- Promo video (30 seconds - 2 minutes)
- TV banner, Wear OS screenshots (if applicable)

### 4.4 Categorization

- App category: **Education**
- Tags: dog training, pet care, education, lifestyle
- Content rating: Everyone

### 4.5 Contact Details

- Email: your-support-email@example.com
- Privacy policy URL: (create one using a generator)
- Website: (optional)

## Step 5: Content Rating

1. Go to "Content rating" section
2. Fill out the questionnaire:
   - App doesn't contain violent content
   - App doesn't contain sexual content
   - App doesn't contain language
   - App doesn't contain controlled substances
   - App doesn't contain gambling
   - App doesn't share location
3. Submit for rating

## Step 6: Set Up In-App Purchases (Premium Features)

### 6.1 Configure In-App Products

1. Go to "Monetize" → "Products" → "In-app products"
2. Create two subscription products:

**Monthly Subscription:**
- Product ID: `premium_monthly`
- Name: Premium Monthly
- Description: Monthly access to all premium training paths
- Price: $6.99/month
- Billing period: 1 month
- Free trial: 7 days (optional)

**Yearly Subscription:**
- Product ID: `premium_yearly`
- Name: Premium Yearly
- Description: Yearly access to all premium training paths (save 40%)
- Price: $49.99/year
- Billing period: 1 year
- Free trial: 7 days (optional)

### 6.2 Implement In-App Purchases in Code

Install required packages:

```bash
npm install expo-in-app-purchases
```

Update `app/premium.tsx` to use real purchases:

```typescript
import * as InAppPurchases from 'expo-in-app-purchases';

// Initialize
await InAppPurchases.connectAsync();

// Get products
const { results } = await InAppPurchases.getProductsAsync(['premium_monthly', 'premium_yearly']);

// Purchase
await InAppPurchases.purchaseItemAsync('premium_monthly');

// Restore
await InAppPurchases.getPurchaseHistoryAsync();
```

## Step 7: Privacy Policy

Create a privacy policy covering:
- What data is collected (locally stored: dog profile, progress)
- How data is used (app functionality only)
- Data sharing (none, all local)
- User rights (data can be deleted via app)

Use a generator like:
- https://www.freeprivacypolicy.com/
- https://www.privacypolicies.com/

Host it on:
- GitHub Pages (free)
- Your own website
- Google Sites (free)

## Step 8: Upload App Bundle

### 8.1 Create a Release

1. Go to "Production" → "Create new release"
2. Upload the AAB file downloaded from EAS
3. Release name: "1.0.0 - Initial Release"
4. Release notes:
   ```
   🎉 Welcome to PawPath!

   Initial release featuring:
   • Personalized training paths for puppies, adolescents, and adults
   • Free basic obedience, house training, and socialization programs
   • Premium specialized training (service work, herding, agility, and more)
   • Progress tracking with streaks and statistics
   • Step-by-step exercise instructions
   • Personal notes for each training session

   Start your dog training journey today!
   ```

### 8.2 Review and Rollout

1. Review all sections (they must have green checkmarks)
2. Choose rollout percentage:
   - Start with 20% for initial testing
   - Increase to 50%, then 100% after monitoring
3. Click "Start rollout to Production"

## Step 9: Testing Before Production

### 9.1 Internal Testing

1. Create an internal testing track
2. Add testers via email
3. They can install and test the app before public release
4. Collect feedback and fix issues

### 9.2 Closed Testing (Beta)

1. Create a closed testing track
2. Share opt-in link with beta testers
3. Gather feedback for 1-2 weeks
4. Fix critical bugs before production

## Step 10: Post-Launch

### 10.1 Monitor Performance

- Check crash reports in Play Console
- Monitor user reviews and ratings
- Track download and retention metrics
- Respond to user feedback

### 10.2 Update Process

For updates:

1. Update version in `app.config.ts`:
   ```typescript
   version: "1.1.0"
   ```

2. Build new AAB:
   ```bash
   eas build --platform android --profile production
   ```

3. Upload to Play Console
4. Add release notes describing changes
5. Roll out to production

## Troubleshooting

### Build Fails

- Check `eas build` logs for errors
- Ensure all dependencies are compatible
- Verify Android permissions in `app.config.ts`

### App Rejected

Common reasons:
- Missing privacy policy
- Incomplete store listing
- Content rating issues
- In-app purchase configuration

### In-App Purchases Not Working

- Verify product IDs match exactly
- Test with real Google Play account
- Check subscription status in Play Console
- Ensure app is signed with production key

## Additional Resources

- **Expo Documentation**: https://docs.expo.dev/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **Google Play Console Help**: https://support.google.com/googleplay/android-developer/
- **In-App Purchases**: https://docs.expo.dev/versions/latest/sdk/in-app-purchases/

## Support

For issues specific to PawPath:
1. Check the app's GitHub repository (if available)
2. Review the README.md for development setup
3. Contact the development team

---

**Congratulations!** 🎉 You're now ready to deploy PawPath to Google Play Store and help dog owners worldwide train their pets effectively!
