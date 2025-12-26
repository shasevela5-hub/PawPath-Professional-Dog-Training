import type { TrainingPath, Exercise } from '@/types';

/**
 * Sample training paths and exercises for PawPath
 * This data will be used to populate the app with training content
 */

// Basic Obedience Exercises (FREE)
const basicObedienceExercises: Exercise[] = [
  {
    id: 'basic-ob-1',
    pathId: 'basic-obedience',
    title: 'Sit Command',
    description: 'Teach your dog to sit on command, the foundation of all obedience training.',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    week: 1,
    day: 1,
    steps: [
      {
        stepNumber: 1,
        instruction: 'Hold a treat close to your dog\'s nose.',
      },
      {
        stepNumber: 2,
        instruction: 'Move your hand up, allowing their head to follow the treat and causing their bottom to lower.',
      },
      {
        stepNumber: 3,
        instruction: 'Once they\'re in sitting position, say "Sit," give them the treat, and share affection.',
      },
      {
        stepNumber: 4,
        instruction: 'Repeat this sequence a few times every day until your dog has mastered it.',
        repetitions: 5,
      },
    ],
    tips: [
      'Keep training sessions short (5-10 minutes) to maintain your dog\'s attention.',
      'Always use the same word for the command to avoid confusion.',
      'Be patient - some dogs learn faster than others.',
      'Practice in a quiet environment first, then gradually add distractions.',
    ],
    requiredEquipment: ['Small training treats', 'Quiet space'],
  },
  {
    id: 'basic-ob-2',
    pathId: 'basic-obedience',
    title: 'Stay Command',
    description: 'Train your dog to stay in place until released, building impulse control.',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    week: 1,
    day: 3,
    steps: [
      {
        stepNumber: 1,
        instruction: 'Ask your dog to sit.',
      },
      {
        stepNumber: 2,
        instruction: 'Open your palm in front of you and say "Stay."',
      },
      {
        stepNumber: 3,
        instruction: 'Take a few steps back. Reward them with a treat and affection if they stay.',
        duration: 5,
      },
      {
        stepNumber: 4,
        instruction: 'Gradually increase the distance and duration before giving the treat.',
      },
      {
        stepNumber: 5,
        instruction: 'Always reward your dog for staying, even if it\'s just for a few seconds.',
      },
    ],
    tips: [
      'Start with very short stays (just a few seconds) and gradually build up.',
      'If your dog breaks the stay, calmly return them to position and try again.',
      'Use a release word like "Okay" or "Free" to let them know when they can move.',
      'Practice in different locations to generalize the behavior.',
    ],
    requiredEquipment: ['Training treats', 'Leash (optional for beginners)'],
  },
  {
    id: 'basic-ob-3',
    pathId: 'basic-obedience',
    title: 'Come Command (Recall)',
    description: 'Teach reliable recall for safety and off-leash freedom.',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    week: 2,
    day: 1,
    steps: [
      {
        stepNumber: 1,
        instruction: 'Put a leash and collar on your dog.',
      },
      {
        stepNumber: 2,
        instruction: 'Go down to their level and say "Come" while gently pulling on the leash.',
      },
      {
        stepNumber: 3,
        instruction: 'When they get to you, reward them with affection and a treat.',
      },
      {
        stepNumber: 4,
        instruction: 'Practice in a safe, enclosed area without the leash.',
      },
      {
        stepNumber: 5,
        instruction: 'Gradually increase distance and add distractions.',
        repetitions: 10,
      },
    ],
    tips: [
      'Never call your dog to come for something unpleasant (like ending playtime).',
      'Always make coming to you rewarding and positive.',
      'Practice recall during walks and play sessions.',
      'Use a happy, excited tone when calling your dog.',
    ],
    requiredEquipment: ['Long training leash', 'High-value treats', 'Enclosed area'],
  },
  {
    id: 'basic-ob-4',
    pathId: 'basic-obedience',
    title: 'Down Command',
    description: 'Train your dog to lie down on command for calm behavior.',
    difficulty: 'beginner',
    estimatedMinutes: 12,
    week: 2,
    day: 4,
    steps: [
      {
        stepNumber: 1,
        instruction: 'Hold a treat in your closed hand.',
      },
      {
        stepNumber: 2,
        instruction: 'Hold your hand up to your dog\'s snout. When they sniff it, move your hand to the floor.',
      },
      {
        stepNumber: 3,
        instruction: 'Slide your hand along the ground to encourage their body to follow their head.',
      },
      {
        stepNumber: 4,
        instruction: 'Once they\'re in the down position, say "Down," give them the treat, and share affection.',
      },
      {
        stepNumber: 5,
        instruction: 'Repeat daily until mastered.',
        repetitions: 5,
      },
    ],
    tips: [
      'Some dogs resist lying down - be patient and don\'t force them.',
      'You can also lure them under a low obstacle to encourage the down position.',
      'Practice on different surfaces so they\'re comfortable anywhere.',
      'Combine with "Stay" for longer duration downs.',
    ],
    requiredEquipment: ['Training treats'],
  },
];

// House Training Exercises (FREE)
const houseTrainingExercises: Exercise[] = [
  {
    id: 'house-1',
    pathId: 'house-training',
    title: 'Establish a Routine',
    description: 'Create a consistent schedule for potty breaks.',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    week: 1,
    day: 1,
    steps: [
      {
        stepNumber: 1,
        instruction: 'Take your puppy outside first thing in the morning.',
      },
      {
        stepNumber: 2,
        instruction: 'Take them out after every meal, nap, and play session.',
      },
      {
        stepNumber: 3,
        instruction: 'Take them to the same spot each time to establish the habit.',
      },
      {
        stepNumber: 4,
        instruction: 'Wait with them until they eliminate, then immediately praise and reward.',
      },
      {
        stepNumber: 5,
        instruction: 'Keep a log of successful potty breaks to identify patterns.',
      },
    ],
    tips: [
      'Puppies can typically hold it for one hour per month of age.',
      'Watch for signs like sniffing, circling, or whining.',
      'Be patient - accidents will happen during the learning process.',
      'Never punish accidents; simply clean up and continue training.',
    ],
    requiredEquipment: ['Leash', 'Training treats', 'Notebook for tracking'],
  },
  {
    id: 'house-2',
    pathId: 'house-training',
    title: 'Crate Training Basics',
    description: 'Use a crate to aid in house training and provide a safe space.',
    difficulty: 'beginner',
    estimatedMinutes: 20,
    week: 1,
    day: 2,
    steps: [
      {
        stepNumber: 1,
        instruction: 'Choose an appropriately sized crate - just big enough for your dog to stand, turn, and lie down.',
      },
      {
        stepNumber: 2,
        instruction: 'Make the crate comfortable with bedding and a safe toy.',
      },
      {
        stepNumber: 3,
        instruction: 'Encourage your dog to enter with treats, but don\'t force them.',
      },
      {
        stepNumber: 4,
        instruction: 'Start with short periods (5-10 minutes) and gradually increase.',
        duration: 600,
      },
      {
        stepNumber: 5,
        instruction: 'Always take your dog out immediately after crate time.',
      },
    ],
    tips: [
      'Never use the crate as punishment.',
      'Dogs naturally avoid soiling their sleeping area.',
      'Feed meals in the crate to create positive associations.',
      'Cover the crate with a blanket for a den-like feel.',
    ],
    requiredEquipment: ['Appropriately sized crate', 'Comfortable bedding', 'Chew-safe toys'],
  },
];

// Socialization Exercises (FREE)
const socializationExercises: Exercise[] = [
  {
    id: 'social-1',
    pathId: 'socialization',
    title: 'Meeting New People',
    description: 'Help your dog become comfortable with strangers.',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    week: 1,
    day: 1,
    steps: [
      {
        stepNumber: 1,
        instruction: 'Start in a calm environment with one friendly person.',
      },
      {
        stepNumber: 2,
        instruction: 'Have the person approach slowly and calmly, avoiding direct eye contact.',
      },
      {
        stepNumber: 3,
        instruction: 'Let your dog approach at their own pace - never force interaction.',
      },
      {
        stepNumber: 4,
        instruction: 'Reward calm, friendly behavior with treats and praise.',
      },
      {
        stepNumber: 5,
        instruction: 'Gradually introduce different types of people (children, elderly, people in hats, etc.).',
      },
    ],
    tips: [
      'The critical socialization period is 3-14 weeks for puppies.',
      'Positive experiences during this time shape lifelong behavior.',
      'Never force your dog to interact if they seem fearful.',
      'Keep sessions short and always end on a positive note.',
    ],
    requiredEquipment: ['High-value treats', 'Leash', 'Willing volunteers'],
  },
];

// Agility Training Exercises (PREMIUM)
const agilityExercises: Exercise[] = [
  {
    id: 'agility-1',
    pathId: 'agility',
    title: 'Jump Introduction',
    description: 'Teach your dog to jump over obstacles safely.',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    week: 1,
    day: 1,
    steps: [
      {
        stepNumber: 1,
        instruction: 'Set up a low jump (start with a bar on the ground).',
      },
      {
        stepNumber: 2,
        instruction: 'Lead your dog over the bar with a treat, saying "Jump."',
      },
      {
        stepNumber: 3,
        instruction: 'Reward immediately after they step over.',
      },
      {
        stepNumber: 4,
        instruction: 'Gradually raise the bar height over multiple sessions.',
      },
      {
        stepNumber: 5,
        instruction: 'Practice from both directions and add distance.',
        repetitions: 10,
      },
    ],
    tips: [
      'Never jump puppies whose growth plates haven\'t closed (typically under 12-18 months).',
      'Start low to build confidence and proper form.',
      'Always warm up before jumping exercises.',
      'Watch for signs of fatigue or discomfort.',
    ],
    requiredEquipment: ['Adjustable jump bar', 'Training treats', 'Safe training area'],
  },
];

// Service Work Exercises (PREMIUM)
const serviceWorkExercises: Exercise[] = [
  {
    id: 'service-1',
    pathId: 'service-work',
    title: 'Item Retrieval',
    description: 'Train your dog to fetch and deliver specific items.',
    difficulty: 'advanced',
    estimatedMinutes: 25,
    week: 1,
    day: 1,
    steps: [
      {
        stepNumber: 1,
        instruction: 'Choose a specific item (like a phone or keys) and give it a name.',
      },
      {
        stepNumber: 2,
        instruction: 'Encourage your dog to touch the item with their nose, then reward.',
      },
      {
        stepNumber: 3,
        instruction: 'Progress to having them pick up the item in their mouth.',
      },
      {
        stepNumber: 4,
        instruction: 'Teach them to bring the item to you and release it into your hand.',
      },
      {
        stepNumber: 5,
        instruction: 'Add the verbal cue and practice from increasing distances.',
        repetitions: 15,
      },
    ],
    tips: [
      'Service dog training requires patience and consistency.',
      'Break complex tasks into small, achievable steps.',
      'Some tasks may take weeks or months to master.',
      'Consider working with a professional service dog trainer.',
    ],
    requiredEquipment: ['Target item', 'High-value treats', 'Clicker (optional)'],
  },
];

// Herding Exercises (PREMIUM)
const herdingExercises: Exercise[] = [
  {
    id: 'herding-1',
    pathId: 'herding',
    title: 'Directional Commands',
    description: 'Teach your dog to move in specific directions on command.',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    week: 1,
    day: 1,
    steps: [
      {
        stepNumber: 1,
        instruction: 'Start with basic "Come by" (clockwise) and "Away" (counter-clockwise) commands.',
      },
      {
        stepNumber: 2,
        instruction: 'Use hand signals along with verbal cues.',
      },
      {
        stepNumber: 3,
        instruction: 'Practice with a single target object before introducing livestock.',
      },
      {
        stepNumber: 4,
        instruction: 'Reward correct directional movement immediately.',
      },
      {
        stepNumber: 5,
        instruction: 'Gradually increase distance and complexity.',
        repetitions: 20,
      },
    ],
    tips: [
      'Herding training is breed-specific and works best with herding breeds.',
      'Always prioritize safety of both dog and livestock.',
      'Work with experienced herding trainers when introducing livestock.',
      'Build strong obedience foundation before herding work.',
    ],
    requiredEquipment: ['Long line', 'Whistle', 'Safe training area', 'Target objects or livestock'],
  },
];

// Training Paths
export const trainingPaths: TrainingPath[] = [
  {
    id: 'basic-obedience',
    title: 'Basic Obedience',
    category: 'basic-obedience',
    description: 'Essential commands every dog should know: sit, stay, come, and down.',
    isPremium: false,
    lifeStages: ['puppy', 'adolescent', 'adult'],
    difficulty: 'beginner',
    estimatedWeeks: 4,
    exercises: basicObedienceExercises,
    icon: 'star.fill',
  },
  {
    id: 'house-training',
    title: 'House Training',
    category: 'house-training',
    description: 'Establish good bathroom habits and crate training fundamentals.',
    isPremium: false,
    lifeStages: ['puppy'],
    difficulty: 'beginner',
    estimatedWeeks: 8,
    exercises: houseTrainingExercises,
    icon: 'house.fill',
  },
  {
    id: 'socialization',
    title: 'Socialization',
    category: 'socialization',
    description: 'Help your dog become confident and friendly with people, dogs, and new environments.',
    isPremium: false,
    lifeStages: ['puppy', 'adolescent'],
    difficulty: 'beginner',
    estimatedWeeks: 12,
    exercises: socializationExercises,
    icon: 'pawprint.fill',
  },
  {
    id: 'agility',
    title: 'Agility Training',
    category: 'agility',
    description: 'Competitive agility skills including jumps, weaves, and tunnels.',
    isPremium: true,
    lifeStages: ['adolescent', 'adult'],
    difficulty: 'intermediate',
    estimatedWeeks: 16,
    exercises: agilityExercises,
    icon: 'bolt.fill',
  },
  {
    id: 'service-work',
    title: 'Service Work',
    category: 'service-work',
    description: 'Advanced tasks for service and assistance dogs.',
    isPremium: true,
    lifeStages: ['adolescent', 'adult'],
    difficulty: 'advanced',
    estimatedWeeks: 24,
    exercises: serviceWorkExercises,
    icon: 'heart.fill',
  },
  {
    id: 'herding',
    title: 'Herding',
    category: 'herding',
    description: 'Specialized training for herding breeds to work with livestock.',
    isPremium: true,
    lifeStages: ['adolescent', 'adult'],
    difficulty: 'advanced',
    estimatedWeeks: 20,
    exercises: herdingExercises,
    icon: 'leaf.fill',
  },
  {
    id: 'protection',
    title: 'Protection Training',
    category: 'protection',
    description: 'Professional protection and guard dog training.',
    isPremium: true,
    lifeStages: ['adult'],
    difficulty: 'advanced',
    estimatedWeeks: 24,
    exercises: [],
    icon: 'shield.fill',
  },
  {
    id: 'therapy-dog',
    title: 'Therapy Dog',
    category: 'therapy-dog',
    description: 'Prepare your dog for therapy and emotional support work.',
    isPremium: true,
    lifeStages: ['adult'],
    difficulty: 'intermediate',
    estimatedWeeks: 16,
    exercises: [],
    icon: 'heart.circle.fill',
  },
  {
    id: 'search-rescue',
    title: 'Search & Rescue',
    category: 'search-rescue',
    description: 'Train your dog for search and rescue operations.',
    isPremium: true,
    lifeStages: ['adolescent', 'adult'],
    difficulty: 'advanced',
    estimatedWeeks: 32,
    exercises: [],
    icon: 'location.fill',
  },
];

// Helper function to get training paths by life stage
export function getPathsByLifeStage(lifeStage: string): TrainingPath[] {
  return trainingPaths.filter(path => 
    path.lifeStages.includes(lifeStage as any)
  );
}

// Helper function to get free training paths
export function getFreeTrainingPaths(): TrainingPath[] {
  return trainingPaths.filter(path => !path.isPremium);
}

// Helper function to get premium training paths
export function getPremiumTrainingPaths(): TrainingPath[] {
  return trainingPaths.filter(path => path.isPremium);
}

// Helper function to get a specific training path by ID
export function getTrainingPathById(id: string): TrainingPath | undefined {
  return trainingPaths.find(path => path.id === id);
}
