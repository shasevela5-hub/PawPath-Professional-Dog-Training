# PawPath - Dog Training App

A comprehensive mobile dog training application offering personalized training paths based on a dog's life stage (puppy to adult) and specialized training goals. Built with React Native and Expo.

## Features

### 🐕 Life Stage-Based Training
- **Puppy (0-6 months)**: Foundation training and early socialization
- **Adolescent (6-18 months)**: Building on basics and impulse control
- **Adult (18+ months)**: Advanced training and specialized skills

### 🎯 Training Paths

**Free Training:**
- Basic Obedience (sit, stay, come, down)
- House Training (potty training, crate training)
- Socialization (meeting people, dogs, environments)

**Premium Training:**
- Service Work (assistance dog tasks)
- Herding (livestock work, directional commands)
- Agility (jumps, weaves, obstacles)
- Protection Training (guard dog skills)
- Therapy Dog (emotional support preparation)
- Search & Rescue (SAR operations)

### 📊 Progress Tracking
- Exercise completion tracking
- Training streak counter
- Detailed statistics and analytics
- Achievement badges
- Personal notes for each session

### 💎 Freemium Model
- Free access to essential training paths
- Premium subscription for specialized training
- Monthly ($6.99) and Yearly ($49.99) plans
- 7-day free trial option

## Tech Stack

- **Framework**: React Native 0.81 with Expo SDK 54
- **Language**: TypeScript 5.9
- **Routing**: Expo Router 6
- **Styling**: NativeWind 4 (Tailwind CSS)
- **State Management**: React hooks + AsyncStorage
- **Animations**: React Native Reanimated 4
- **Icons**: Expo Symbols + Material Icons

## Project Structure

```
app/
  (tabs)/
    index.tsx          # Home screen
    training.tsx       # Training paths browser
    progress.tsx       # Progress tracking
    profile.tsx        # Dog profile & settings
  exercise/[id].tsx    # Exercise detail screen
  path/[id].tsx        # Training path detail
  premium.tsx          # Premium upgrade screen
components/
  ui/                  # Reusable UI components
    button.tsx
    card.tsx
    badge.tsx
    progress-bar.tsx
    icon-symbol.tsx
  screen-container.tsx # Safe area wrapper
data/
  training-paths.ts    # Training content
lib/
  storage.ts           # AsyncStorage utilities
  utils.ts             # Helper functions
types/
  index.ts             # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app (for testing on physical devices)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dog-training-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Run on your device:
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go
   - **Web**: Press `w`

## Development

### Running the App

```bash
# Start development server
pnpm dev

# Run on specific platform
pnpm ios
pnpm android

# Type checking
pnpm check

# Linting
pnpm lint
```

### Project Configuration

Key configuration files:
- `app.config.ts` - Expo app configuration
- `theme.config.js` - Theme colors and tokens
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

### Adding New Training Content

1. Open `data/training-paths.ts`
2. Add exercises to the appropriate array (e.g., `basicObedienceExercises`)
3. Each exercise should include:
   - Unique ID
   - Title and description
   - Difficulty level
   - Estimated duration
   - Step-by-step instructions
   - Training tips
   - Required equipment

Example:
```typescript
{
  id: 'basic-ob-5',
  pathId: 'basic-obedience',
  title: 'Heel Command',
  description: 'Teach your dog to walk beside you.',
  difficulty: 'intermediate',
  estimatedMinutes: 20,
  week: 3,
  steps: [
    {
      stepNumber: 1,
      instruction: 'Start with your dog on your left side.',
    },
    // ... more steps
  ],
  tips: [
    'Keep treats at your side to reward position.',
    // ... more tips
  ],
}
```

### Customizing Theme

Edit `theme.config.js` to change app colors:

```javascript
const themeColors = {
  primary: { light: '#0a7ea4', dark: '#0a7ea4' },
  background: { light: '#ffffff', dark: '#151718' },
  // ... other colors
};
```

## Data Storage

The app uses AsyncStorage for local data persistence:

- **Dog Profile**: Name, breed, age, life stage, notes
- **User Progress**: Enrolled paths, completed exercises, streaks
- **Premium Status**: Subscription type and expiration
- **App Settings**: Theme, notifications, preferences

All data is stored locally on the device. No backend server required for basic functionality.

## Premium Features Implementation

The app includes a complete premium upgrade flow with:
- Feature comparison screen
- Monthly and yearly subscription options
- Restore purchases functionality
- Premium content gating

To integrate real payments:
1. Set up Google Play Console in-app products
2. Install `expo-in-app-purchases`
3. Update `app/premium.tsx` with real purchase logic
4. Test with Google Play's test accounts

See `DEPLOYMENT.md` for detailed instructions.

## Building for Production

### Android (Google Play)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Configure EAS:
   ```bash
   eas build:configure
   ```

3. Build AAB:
   ```bash
   eas build --platform android --profile production
   ```

4. Follow the deployment guide in `DEPLOYMENT.md`

### iOS (App Store)

1. Build IPA:
   ```bash
   eas build --platform ios --profile production
   ```

2. Submit to App Store Connect
3. Complete App Store review process

## Testing

### Manual Testing Checklist

- [ ] All tabs navigate correctly
- [ ] Dog profile can be created and edited
- [ ] Training paths display for each life stage
- [ ] Exercises can be viewed and completed
- [ ] Progress tracking updates correctly
- [ ] Streak counter increments daily
- [ ] Premium paths show lock icon when not subscribed
- [ ] Premium upgrade flow works
- [ ] Notes can be added to exercises
- [ ] App works in both light and dark mode

### Testing on Physical Devices

1. Install Expo Go from app store
2. Scan QR code from development server
3. Test all features on actual device
4. Check performance and responsiveness

## Troubleshooting

### Common Issues

**App won't start:**
- Clear cache: `pnpm start --clear`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

**TypeScript errors:**
- Run type check: `pnpm check`
- Ensure all imports are correct

**Styling issues:**
- Rebuild Tailwind: restart dev server
- Check `theme.config.js` for color definitions

**Data not persisting:**
- Check AsyncStorage permissions
- Verify storage functions in `lib/storage.ts`

## Contributing

To add new features:

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit a pull request

## License

[Your License Here]

## Support

For issues or questions:
- Check the documentation
- Review `DEPLOYMENT.md` for deployment help
- Open an issue on GitHub

## Roadmap

Future enhancements:
- [ ] Video demonstrations for exercises
- [ ] Social features (share progress)
- [ ] Trainer certification programs
- [ ] Multi-dog profiles
- [ ] Cloud sync across devices
- [ ] Push notifications for reminders
- [ ] Integration with wearables

---

Built with ❤️ for dog trainers and owners worldwide.
