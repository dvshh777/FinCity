export type ScreenStep =
  | 1 // Splash Screen
  | 2 // Character Intro
  | 3 // Ask Name
  | 4 // Signup
  | 5 // Age & Occupation
  | 6 // Income / Pocket Money
  | 7 // Budget (Needs & Wants manual, Savings auto-calculated)
  | 8 // Savings Goal
  | 9 // User ID
  | 10 // Empty City (Dashboard)
  | 11 // First Save Prompt
  | 12 // Building Animation
  | 13 // First House Completed
  | 14; // Dashboard (After)

export type MobileTab = 'city' | 'transactions' | 'quests' | 'add' | 'squad' | 'profile';

export type DesktopNav =
  | 'home'
  | 'transactions'
  | 'goals'
  | 'quests'
  | 'squad'
  | 'reports'
  | 'settings';

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  iconName: string;
  category: string;
  color: string;
}

export interface BuildingPlot {
  id: string;
  x: number;
  y: number;
  zoneId?: number; // 1: Green Valley, 2: Riverside Market, 3: Solar Highlands, 4: Cyber Metropolis
  zoneName?: string;
  type:
    | 'empty'
    | 'cottage'
    | 'bakery'
    | 'bank'
    | 'gas_station'
    | 'police'
    | 'bookstore'
    | 'ramen_kiosk'
    | 'fastfood'
    | 'modern_loft'
    | 'modern'
    | 'villa'
    | 'solar'
    | 'townhall'
    | 'cyber';
  name: string;
  level: number;
  stage: 0 | 1 | 2 | 3; // 0: Plot, 1: Foundation, 2: Frame, 3: Completed
  unlockedAtSavings: number;
  dailyExp: number;
  xpValue: number;
  status: 'locked' | 'constructing' | 'built';
  progress?: number;
  image?: string;
  description: string;
  buildingStyle?:
    | 'cottage'
    | 'bakery'
    | 'bank'
    | 'gas_station'
    | 'police'
    | 'bookstore'
    | 'ramen_kiosk'
    | 'fastfood'
    | 'modern_loft'
    | 'modern'
    | 'villa'
    | 'solar'
    | 'townhall'
    | 'cyber';
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  rewardExp: number;
  rewardXP: number;
  progress: number;
  target: number;
  completed: boolean;
  type: 'daily' | 'milestone' | 'habit';
}

export interface SquadMember {
  id: string;
  name: string;
  tag: string;
  level: number;
  cityBuildings: number;
  savingsTotal: number;
  avatarUrl: string;
  status: 'online' | 'saving' | 'offline';
  district?: string;
  exp?: number;
  hearts?: number;
}

export type FriendMember = SquadMember;

export interface FriendInvitation {
  id: string;
  fromName: string;
  fromCityId: string;
  toCityId: string;
  toName: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined';
  type: 'incoming' | 'outgoing';
  avatarUrl?: string;
  level?: number;
  cityBuildings?: number;
  savingsTotal?: number;
  exp?: number;
  hearts?: number;
}

export interface SquadGoalMemberContribution {
  userId: string;
  userName: string;
  avatarUrl: string;
  cityId: string;
  contributedAmount: number;
  lastSavedDate?: string;
  streakDays: number;
}

export interface SquadGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  iconName?: string;
  createdAt: string;
  creatorCityId: string;
  members: SquadGoalMemberContribution[];
}

export type TransactionType = 'earn' | 'spend' | 'save' | 'deposit' | 'interest' | 'quest_reward';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  categoryType?: 'Needs' | 'Wants' | 'Savings' | 'Income' | 'Reward';
  description: string;
  date: string;
  timestamp?: number;
  paymentMethod?: 'UPI' | 'Bank Transfer' | 'Cash' | 'Card' | string;
  buildingUnlocked?: string;
  squadGoalId?: string;
  squadGoalTitle?: string;
}

export type AssistantGesture =
  | 'wave'
  | 'celebrate'
  | 'thinking'
  | 'point'
  | 'salute'
  | 'zen_bow'
  | 'glasses_adjust'
  | 'builder_flex'
  | 'cyber_scan'
  | 'shield_guard'
  | 'idle';

export interface VoiceCommand {
  id: string;
  phrase: string;
  label: string;
  gesture: AssistantGesture;
  gestureLabel: string;
  responseText: string;
  actionType?: 'deposit' | 'optimize' | 'zen' | 'quest' | 'shield' | 'greeting' | 'advice' | 'minimize' | 'switch_guide';
  depositAmount?: number;
}

export interface AssistantVoiceSettings {
  pitch: number;
  rate: number;
  lang?: string;
  gender: 'female' | 'male';
}

export interface AssistantCharacter {
  id: string;
  name: string;
  gender: 'Female' | 'Male';
  role: string;
  archetype: string;
  badge: string;
  catchphrase: string;
  bio: string;
  primaryColor: string;
  badgeColor: string;
  accentBg: string;
  signatureGesture: AssistantGesture;
  voiceSettings: AssistantVoiceSettings;
  commands: VoiceCommand[];
}

export interface UserState {
  name: string;
  tag: string;
  selectedAssistantId: string;
  age?: number;
  occupation?: 'student' | 'employee';
  pocketMoneyFrequency?: 'monthly' | 'weekly' | 'daily';
  pocketMoneyAmount?: number;
  monthlyIncome: number;
  budgetNeeds: number;
  budgetWants: number;
  budgetSavings: number;
  selectedGoalId: string;
  goals: SavingsGoal[];
  totalSavings: number;
  availableBuildFunds: number; // Funds available to build/upgrade in city
  level: number;
  exp: number;
  hearts: number; // XP
  buildingsCount: number;
  buildings: BuildingPlot[];
  districtBuildings?: Record<string, BuildingPlot[]>;
  transactions: Transaction[];
  quests: Quest[];
  squad: SquadMember[];
  squadGoals?: SquadGoal[];
  invitations?: FriendInvitation[];
}
