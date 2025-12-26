# PawPath - Dog Training App Design Document

## Design Philosophy
This app follows **Apple Human Interface Guidelines** to feel like a native iOS app. The design assumes **mobile portrait orientation (9:16)** and **one-handed usage** patterns. The interface is clean, intuitive, and focused on helping dog owners train their pets effectively.

## Color Scheme
- **Primary**: Deep blue (#0a7ea4) - Trust, reliability, professionalism
- **Success**: Green (#22C55E) - Progress, achievements, completed exercises
- **Warning**: Amber (#F59E0B) - Premium features, upgrade prompts
- **Background**: White (light) / Dark gray (dark mode)
- **Accent**: Warm orange for dog-related warmth and friendliness

## Screen List

### 1. Home Screen (Main Tab)
**Primary Content:**
- Welcome header with user's dog name and current training phase
- Current training path card (e.g., "Puppy Basic Training - Week 2")
- Today's recommended exercises (2-3 cards)
- Progress overview widget (completion percentage, streak counter)
- Quick action buttons: "Start Training Session", "View Progress"

**Functionality:**
- Navigate to exercise details
- Start quick training session
- View overall progress
- Access current training path

### 2. Training Paths Screen (Tab)
**Primary Content:**
- Life stage selector: Puppy (0-6 months), Adolescent (6-18 months), Adult (18+ months)
- Training type cards organized by category:
  - **Free**: Basic Obedience, House Training, Socialization
  - **Premium** (locked with crown icon): Service Work, Herding, Agility, Protection, Therapy Dog, Search & Rescue
- Each card shows: title, difficulty level, duration estimate, completion status

**Functionality:**
- Filter by life stage
- View training path details
- Start new training path
- Unlock premium paths (payment flow)

### 3. Exercise Detail Screen (Modal/Stack)
**Primary Content:**
- Exercise title and difficulty badge
- Step-by-step instructions (numbered list)
- Video demonstration placeholder or illustration
- Timer/counter for timed exercises
- Tips section (collapsible)
- Mark as complete button
- Notes section for user observations

**Functionality:**
- Follow exercise steps
- Track completion
- Add personal notes
- Set reminders

### 4. Progress Screen (Tab)
**Primary Content:**
- Overall completion percentage (circular progress indicator)
- Streak counter with calendar view
- Completed exercises list (grouped by week)
- Skills mastered badges
- Milestones timeline
- Statistics: total training time, exercises completed, current level

**Functionality:**
- View training history
- Track achievements
- Review completed exercises
- Share progress (optional)

### 5. My Dog Profile Screen (Tab)
**Primary Content:**
- Dog photo and name
- Breed, age, life stage
- Current training paths enrolled
- Behavioral notes section
- Training preferences (session length, difficulty)
- Edit profile button

**Functionality:**
- Update dog information
- Add/remove training paths
- Set training preferences
- Add behavioral notes

### 6. Premium Upgrade Screen (Modal)
**Primary Content:**
- Feature comparison: Free vs Premium
- Premium benefits list with icons:
  - All specialized training paths
  - Advanced exercises
  - Video demonstrations
  - Priority support
- Pricing options (monthly/yearly)
- Purchase button
- Restore purchases link

**Functionality:**
- Display pricing
- Process payment
- Unlock premium features
- Restore previous purchases

### 7. Settings Screen (Stack from profile)
**Primary Content:**
- Notifications preferences
- Theme selection (light/dark/auto)
- Reminder settings
- About & support
- Privacy policy
- Logout (if user accounts enabled)

**Functionality:**
- Configure app settings
- Manage notifications
- Access support resources

## Key User Flows

### Flow 1: New User Onboarding
1. Launch app → Welcome screen
2. "Create Dog Profile" → Enter dog name, breed, age, photo (optional)
3. App auto-selects life stage based on age
4. "Choose Your First Training Path" → Show free basic training options
5. Select path → Home screen with first exercises

### Flow 2: Starting a Training Session
1. Home screen → Tap "Today's Exercise" card
2. Exercise Detail screen opens
3. Read instructions → Tap "Start Exercise"
4. Follow steps with timer/counter
5. Complete → Tap "Mark as Complete"
6. Success animation → Return to home with updated progress

### Flow 3: Unlocking Premium Training
1. Training Paths screen → Tap locked premium path (e.g., "Agility Training")
2. Preview modal shows: "This is a premium feature"
3. Tap "Unlock Premium" → Premium Upgrade screen
4. Review features → Tap "Subscribe"
5. Payment sheet → Complete purchase
6. Success → Premium path unlocked, return to Training Paths

### Flow 4: Tracking Progress
1. Progress tab → View overall stats
2. Scroll to see completed exercises timeline
3. Tap on specific week → See exercises completed that week
4. Tap on exercise → View details and notes from that session

### Flow 5: Changing Life Stage
1. My Dog Profile → Tap "Edit Profile"
2. Update age → App suggests new life stage
3. Confirm change → Training paths adjust automatically
4. New recommended exercises appear on home screen

## Navigation Structure
- **Tab Bar** (bottom):
  - Home (house icon)
  - Training Paths (book icon)
  - Progress (chart icon)
  - Profile (paw icon)

- **Stack Navigation** (within tabs):
  - Exercise details
  - Training path details
  - Settings
  - Edit profile

- **Modal Presentations**:
  - Premium upgrade
  - Exercise completion celebration
  - Payment sheets

## Interaction Patterns
- **Cards**: Tap to navigate (opacity feedback)
- **Buttons**: Primary actions use scale + haptic feedback
- **Lists**: Swipe actions for quick operations (mark complete, delete notes)
- **Progress indicators**: Animated on update
- **Locked features**: Crown icon + tap shows upgrade prompt

## Data Persistence
- **Local storage** (AsyncStorage): User preferences, dog profile, progress data, completed exercises
- **No backend required** for MVP - all data stored locally
- Future: Optional cloud sync for multi-device access

## Premium Feature Gating
- Free features: Basic Obedience, House Training, Socialization (all life stages)
- Premium features (require payment):
  - Service Work training
  - Herding training
  - Agility training
  - Protection training
  - Therapy Dog training
  - Search & Rescue training
  - Advanced exercises in all categories
  - Video demonstrations

## Accessibility
- Large touch targets (minimum 44x44pt)
- High contrast text
- VoiceOver support for all interactive elements
- Dynamic type support
- Clear visual hierarchy
