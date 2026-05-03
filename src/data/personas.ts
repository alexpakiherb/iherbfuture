// ── Persona Definitions ───────────────────────────────────────────────────
// Two personas demonstrate how the iHerb experience adapts to who you are.
// Judy is at the start of her wellness journey; Daniel is an advanced
// optimizer with a deep stack and connected data sources.

export type PersonaId = 'maya' | 'daniel';

export type WellnessGoal =
  | 'sleep'
  | 'energy'
  | 'immune'
  | 'stress'
  | 'longevity'
  | 'cognitive'
  | 'athletic'
  | 'gut'
  | 'skin';

export interface ConnectedApp {
  name: string;
  status: 'connected' | 'available';
  icon: string; // emoji for now
  lastSync?: string;
}

export interface StackItem {
  productId: string;
  name: string;
  brand: string;
  imageUrl: string;
  dose: string;
  timeOfDay: 'morning' | 'midday' | 'evening' | 'pre-workout' | 'post-workout';
  reasonShort: string; // "For sleep"
  category: string;
  adherence30d: number; // % of doses taken in last 30 days
  nextDelivery?: string;
  autoship?: boolean;
  autoshipNote?: string;
}

export interface AgentAction {
  id: string;
  type: 'taken' | 'pending' | 'paused';
  title: string;
  detail: string;
  timestamp: string;
  category: 'subscription' | 'bundle' | 'protocol' | 'inventory' | 'price';
  savings?: string;
  approvalDeadline?: string;
  productImage?: string;
}

export interface AchievementBadge {
  id: string;
  label: string;
  emoji: string;
  earned: string;
}

export interface Persona {
  id: PersonaId;
  firstName: string;
  initials: string;
  avatarColor: string; // CSS color
  age: number;
  city: string;
  state: string;
  archetype: string;
  archetypeShort: string; // e.g. "Wellness Beginner"
  tagline: string;
  primaryGoals: WellnessGoal[];
  goalLabels: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  stackSize: number;
  connectedApps: ConnectedApp[];
  routine: {
    morningTime: string;
    eveningTime: string;
    workoutDays?: string;
  };
  greetingByTime: { morning: string; afternoon: string; evening: string };
  contextHints: string[]; // Used as "Based on..." pills throughout the UI
  stack: StackItem[];
  agentActions: AgentAction[];
  achievements: AchievementBadge[];
  streakDays: number;
  spentThisYear: number;
  rewardCredits: number;
  cartItemCount: number;
}

// ── Judy — Wellness Beginner ──────────────────────────────────────────────

export const maya: Persona = {
  id: 'maya',
  firstName: 'Judy',
  initials: 'JR',
  avatarColor: '#D14800',
  age: 28,
  city: 'Austin',
  state: 'TX',
  archetype: 'Wellness Beginner — building her first routine',
  archetypeShort: 'Wellness Beginner',
  tagline: 'New to supplements. Building her first daily routine.',
  primaryGoals: ['sleep', 'energy', 'immune'],
  goalLabels: ['Better sleep', 'Steady energy', 'Immune support'],
  experience: 'beginner',
  stackSize: 3,
  connectedApps: [
    { name: 'Apple Health', status: 'connected', icon: '❤️', lastSync: '12 min ago' },
    { name: 'Whoop', status: 'available', icon: '⌚' },
    { name: 'Oura', status: 'available', icon: '💍' },
    { name: 'MyFitnessPal', status: 'available', icon: '🥗' },
  ],
  routine: {
    morningTime: '7:30 AM',
    eveningTime: '10:30 PM',
    workoutDays: 'Tue · Thu · Sat',
  },
  greetingByTime: {
    morning: 'Good morning, Judy',
    afternoon: 'Hey Judy',
    evening: 'Winding down, Judy?',
  },
  contextHints: [
    'Based on your sleep goal',
    'For your morning routine',
    'New to supplements — recommended starter',
    'Beginner-friendly form',
  ],
  stack: [
    {
      productId: 'cgn-vit-d3',
      name: 'Vitamin D3 5,000 IU',
      brand: 'California Gold Nutrition',
      imageUrl:
        'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn01066/u/159.jpg',
      dose: '1 softgel',
      timeOfDay: 'morning',
      reasonShort: 'For your immune goal',
      category: 'Vitamins',
      adherence30d: 78,
      nextDelivery: 'May 18',
      autoship: true,
      autoshipNote: 'Next delivery in 17 days',
    },
    {
      productId: 'now-mag-glycinate',
      name: 'Magnesium Glycinate 200mg',
      brand: 'NOW Foods',
      imageUrl:
        'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01289/u/62.jpg',
      dose: '2 capsules',
      timeOfDay: 'evening',
      reasonShort: 'For sleep — gentlest form',
      category: 'Minerals',
      adherence30d: 92,
      nextDelivery: 'May 22',
      autoship: true,
      autoshipNote: 'AI moved your delivery 3 days later — you had stock',
    },
    {
      productId: 'cgn-vit-c',
      name: 'Vitamin C 1,000mg',
      brand: 'California Gold Nutrition',
      imageUrl:
        'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn00932/u/298.jpg',
      dose: '1 capsule',
      timeOfDay: 'morning',
      reasonShort: 'Daily immune support',
      category: 'Vitamins',
      adherence30d: 71,
    },
  ],
  agentActions: [
    {
      id: 'act-m-1',
      type: 'pending',
      title: 'Add Zinc 15mg to your immune protocol',
      detail:
        'Pollen counts in Austin are climbing. Zinc pairs well with your existing Vitamin C and supports immune resilience this season.',
      timestamp: '2 hours ago',
      category: 'protocol',
      approvalDeadline: 'Decide within 3 days',
      productImage:
        'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr21002/u/37.jpg',
    },
    {
      id: 'act-m-2',
      type: 'taken',
      title: 'Moved your magnesium delivery 3 days later',
      detail:
        "You still had 17 days of stock when delivery was scheduled. Saved you a duplicate bottle.",
      timestamp: 'Yesterday',
      category: 'subscription',
      savings: '$18.99',
    },
    {
      id: 'act-m-3',
      type: 'taken',
      title: 'Locked in lower price on Vitamin D3',
      detail:
        'Caught a 20% promo before it ended. Applied to your next autoship.',
      timestamp: '3 days ago',
      category: 'price',
      savings: '$4.40',
    },
    {
      id: 'act-m-4',
      type: 'pending',
      title: 'Bundle your morning stack — save 15%',
      detail:
        'Vitamin D3 + Vitamin C + a new Zinc 15mg qualifies for our Immune Foundations bundle.',
      timestamp: 'Today',
      category: 'bundle',
      savings: '$8.75 / month',
      approvalDeadline: 'Decide anytime',
    },
  ],
  achievements: [
    { id: 'a1', label: 'First week complete', emoji: '🌱', earned: 'Apr 18' },
    { id: 'a2', label: '14-day streak', emoji: '🔥', earned: 'Apr 25' },
    { id: 'a3', label: 'Sleep score up 12%', emoji: '😴', earned: 'Apr 28' },
  ],
  streakDays: 14,
  spentThisYear: 142,
  rewardCredits: 8,
  cartItemCount: 2,
};

// ── Daniel — Advanced Optimizer ───────────────────────────────────────────

export const daniel: Persona = {
  id: 'daniel',
  firstName: 'Daniel',
  initials: 'DK',
  avatarColor: '#0A6B3C',
  age: 42,
  city: 'Seattle',
  state: 'WA',
  archetype: 'Advanced Optimizer — longevity, performance, cognition',
  archetypeShort: 'Advanced Optimizer',
  tagline: 'Tracks everything. Optimizes for longevity, performance, cognition.',
  primaryGoals: ['longevity', 'cognitive', 'athletic', 'sleep'],
  goalLabels: ['Longevity', 'Cognitive performance', 'Athletic recovery', 'Sleep quality'],
  experience: 'advanced',
  stackSize: 12,
  connectedApps: [
    { name: 'Apple Health', status: 'connected', icon: '❤️', lastSync: '4 min ago' },
    { name: 'Whoop', status: 'connected', icon: '⌚', lastSync: '8 min ago' },
    { name: 'Oura', status: 'connected', icon: '💍', lastSync: '12 min ago' },
    { name: 'Garmin', status: 'connected', icon: '🏃', lastSync: '1 hour ago' },
    { name: 'Levels CGM', status: 'connected', icon: '📈', lastSync: '2 min ago' },
  ],
  routine: {
    morningTime: '5:45 AM',
    eveningTime: '9:45 PM',
    workoutDays: 'Mon · Wed · Fri · Sat',
  },
  greetingByTime: {
    morning: "Morning, Daniel — recovery's at 84%",
    afternoon: 'Daniel — strain target on track',
    evening: 'Daniel — wind-down stack ready',
  },
  contextHints: [
    'Whoop recovery: 84%',
    'HRV trending +6 vs 30-day baseline',
    'Based on yesterday\'s 47-min Z2 cardio',
    'Oura sleep score: 79',
    'Optimized for longevity protocol',
  ],
  stack: [
    {
      productId: 'thorne-creatine',
      name: 'Creatine Monohydrate 5g',
      brand: 'Thorne',
      imageUrl:
        'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00635/u/61.jpg',
      dose: '5g',
      timeOfDay: 'morning',
      reasonShort: 'Cognitive + power output',
      category: 'Sports',
      adherence30d: 100,
      nextDelivery: 'May 12',
      autoship: true,
    },
    {
      productId: 'le-nmn',
      name: 'NMN 500mg',
      brand: 'Life Extension',
      imageUrl:
        'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex23443/u/24.jpg',
      dose: '1 capsule',
      timeOfDay: 'morning',
      reasonShort: 'NAD+ precursor — longevity',
      category: 'Longevity',
      adherence30d: 96,
      nextDelivery: 'May 14',
      autoship: true,
    },
    {
      productId: 'thorne-omega',
      name: 'Omega-3 Triglyceride EPA/DHA 2.5g',
      brand: 'Thorne',
      imageUrl:
        'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00690/u/50.jpg',
      dose: '2 softgels',
      timeOfDay: 'morning',
      reasonShort: 'Brain + cardiovascular',
      category: 'Omega',
      adherence30d: 100,
      nextDelivery: 'May 10',
      autoship: true,
    },
    {
      productId: 'thorne-magnesium-bisglycinate',
      name: 'Magnesium Bisglycinate 200mg',
      brand: 'Thorne',
      imageUrl:
        'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00644/u/96.jpg',
      dose: '2 capsules',
      timeOfDay: 'evening',
      reasonShort: 'Sleep architecture',
      category: 'Minerals',
      adherence30d: 100,
      nextDelivery: 'May 19',
      autoship: true,
    },
    {
      productId: 'le-quercetin',
      name: 'Quercetin Phytosome',
      brand: 'Life Extension',
      imageUrl:
        'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex23023/u/66.jpg',
      dose: '1 capsule',
      timeOfDay: 'morning',
      reasonShort: 'Senolytic — longevity protocol',
      category: 'Longevity',
      adherence30d: 91,
    },
    {
      productId: 'thorne-collagen',
      name: 'Collagen Plus',
      brand: 'Thorne',
      imageUrl:
        'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr01311/u/96.jpg',
      dose: '1 scoop',
      timeOfDay: 'morning',
      reasonShort: 'Joint + connective tissue',
      category: 'Protein',
      adherence30d: 93,
    },
    {
      productId: 'lmnt-electrolytes',
      name: 'Electrolyte Mix',
      brand: 'LMNT',
      imageUrl:
        'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/nuu/nuu02050/u/30.jpg',
      dose: '1 stick',
      timeOfDay: 'pre-workout',
      reasonShort: 'Hydration before Z2',
      category: 'Sports',
      adherence30d: 88,
    },
    {
      productId: 'thorne-ashwagandha',
      name: 'Ashwagandha KSM-66',
      brand: 'Thorne',
      imageUrl:
        'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr01554/u/8.jpg',
      dose: '1 capsule',
      timeOfDay: 'evening',
      reasonShort: 'Cortisol regulation',
      category: 'Adaptogens',
      adherence30d: 86,
    },
  ],
  agentActions: [
    {
      id: 'act-d-1',
      type: 'pending',
      title: 'Switch to Magnesium Threonate 2x/week (cognitive)',
      detail:
        'Your sleep score has been 75+ for 21 days — bisglycinate is doing its job. Threonate crosses the blood-brain barrier and may sharpen the cognitive lift you mentioned. Suggested protocol: alternate Tue/Fri.',
      timestamp: '6 hours ago',
      category: 'protocol',
      approvalDeadline: 'Decide within 5 days',
      productImage:
        'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex16039/u/276.jpg',
    },
    {
      id: 'act-d-2',
      type: 'taken',
      title: 'Increased creatine to 6g for the next 14 days',
      detail:
        'Whoop strain has averaged 16.2 over the last 2 weeks — above your baseline. Bumped temporarily to support recovery. Will revert automatically.',
      timestamp: '2 days ago',
      category: 'protocol',
    },
    {
      id: 'act-d-3',
      type: 'taken',
      title: 'Bundled your longevity protocol — saved 18%',
      detail:
        'Combined NMN + Quercetin + Resveratrol into the Longevity Stack bundle.',
      timestamp: '1 week ago',
      category: 'bundle',
      savings: '$31.20 / month',
    },
    {
      id: 'act-d-4',
      type: 'pending',
      title: 'Add Glycine 3g for sleep architecture',
      detail:
        "Your deep sleep has been flat at 82 min for 30+ days. Research shows glycine + magnesium pre-bed can lift it 12–15%.",
      timestamp: '1 day ago',
      category: 'protocol',
      approvalDeadline: 'Decide within 7 days',
    },
    {
      id: 'act-d-5',
      type: 'taken',
      title: 'Locked in EPA price before next month\'s increase',
      detail:
        'Thorne announced a 9% price increase on triglyceride EPA/DHA effective June 1. Locked your next 3 deliveries at current price.',
      timestamp: '4 days ago',
      category: 'price',
      savings: '$11.97',
    },
    {
      id: 'act-d-6',
      type: 'paused',
      title: 'Paused electrolytes — you stocked up at the gym',
      detail:
        "You added 4 boxes of LMNT in your last cart. Pausing autoship until inventory drops below 14 days.",
      timestamp: '5 days ago',
      category: 'inventory',
    },
  ],
  achievements: [
    { id: 'b1', label: '180-day streak', emoji: '🔥', earned: 'Apr 30' },
    { id: 'b2', label: 'Longevity protocol — locked in', emoji: '🧬', earned: 'Mar 15' },
    { id: 'b3', label: 'Sleep score 80+ for 21 days', emoji: '😴', earned: 'Apr 22' },
    { id: 'b4', label: 'HRV up 14% YoY', emoji: '📈', earned: 'Apr 1' },
  ],
  streakDays: 184,
  spentThisYear: 1247,
  rewardCredits: 87,
  cartItemCount: 4,
};

export const PERSONAS: Record<PersonaId, Persona> = { maya, daniel };

export function getPersona(id: PersonaId): Persona {
  return PERSONAS[id];
}
