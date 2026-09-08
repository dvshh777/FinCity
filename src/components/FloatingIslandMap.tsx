import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Lock,
  Sparkles,
  BookOpen,
  Target,
  Zap,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Shield,
  Coins,
  ChevronRight,
  X,
  Building,
  Award,
  PlusCircle,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Globe2,
  Trophy,
  Scroll,
  Circle,
  Heart,
} from 'lucide-react';
import { UserState, BuildingPlot } from '../types';
import { BuildingStyle } from '../utils/buildingPricing';
import { NovaGuide } from './NovaGuide';

// Generated Isometric Floating Island Assets
const DESKTOP_MAP_IMG = '/src/assets/images/fincity_island_map_1788827616963.jpg';
const MOBILE_MAP_IMG = '/src/assets/images/fincity_mobile_map_1788827631160.jpg';

export interface DistrictInfo {
  id: string;
  number: number;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  unlocked: boolean;
  requiredLevel: number;
  xPercent: number; // percentage coordinate on map (0-100)
  yPercent: number; // percentage coordinate on map (0-100)
  description: string;
  perks: string[];
  tasks: { id: string; title: string; rewardXp: number; completed: boolean }[];
  accentColor: string;
}

interface FloatingIslandMapProps {
  user: UserState;
  onAddSavings?: (amount: number, desc: string) => void;
  onUpgradePlot?: (plotId: string, cost: number, customName?: string, buildingStyle?: BuildingStyle, districtId?: string, squadGoalId?: string) => void;
  onCompleteQuest?: (questId: string) => void;
  onEnterDistrict?: (district: DistrictInfo, cityMode?: 'personal' | 'group', squadGoalId?: string) => void;
  isMobile?: boolean;
  className?: string;
}

export const FloatingIslandMap: React.FC<FloatingIslandMapProps> = ({
  user,
  onAddSavings,
  onUpgradePlot,
  onCompleteQuest,
  onEnterDistrict,
  isMobile = false,
  className = '',
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo | null>(null);
  const [quickSaveAmount, setQuickSaveAmount] = useState<number>(100);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showQuestOverlay, setShowQuestOverlay] = useState<boolean>(false);

  // Group Savings City & Streak State
  const [cityMode, setCityMode] = useState<'personal' | 'group'>('personal');
  const [selectedGoalId, setSelectedGoalId] = useState<string>(user.squadGoals?.[0]?.id || '');

  const activeGroupGoal = user.squadGoals?.find((g) => g.id === selectedGoalId) || user.squadGoals?.[0];

  // Derived Active Metrics based on Personal vs Group City Mode
  const isGroupMode = cityMode === 'group' && !!activeGroupGoal;
  const currentLevel = user.level || 1;
  const currentExp = user.exp || 120;
  const nextLevelExp = currentLevel * 150 + 150;
  const xpPercent = Math.min(100, Math.round((currentExp / nextLevelExp) * 100));

  const activeTreesCount = isGroupMode ? (activeGroupGoal?.treesCount ?? 3) : (user.treesCount ?? 2);
  const activeStreetLightsCount = isGroupMode ? (activeGroupGoal?.streetLightsCount ?? 1) : (user.streetLightsCount ?? 0);
  const activeStreakDays = isGroupMode ? (activeGroupGoal?.groupStreakDays ?? 5) : (user.savingStreakDays ?? 4);
  const activeBuildFunds = isGroupMode ? (activeGroupGoal?.availableBuildFunds ?? 4500) : (user.availableBuildFunds ?? 0);

  const activeQuestCount = user.quests.filter((q) => !q.completed).length;

  // Define the districts matching the user's reference visual layout
  const districts: DistrictInfo[] = [
    {
      id: 'orientation_park',
      number: 1,
      name: 'Orientation Park',
      category: 'START HERE',
      icon: Lightbulb,
      unlocked: true,
      requiredLevel: 1,
      xPercent: isMobile ? 26 : 17,
      yPercent: isMobile ? 28 : 25,
      description:
        'The welcoming gateway of FinCity. Master essential budgeting foundations, set your primary safety buffer, and establish your first architectural residence.',
      perks: ['Unlock 50/30/20 budget framework', 'Daily streak bonus multiplier', 'Foundation house plot'],
      tasks: [
        { id: 'op_1', title: 'Complete your initial profile setup', rewardXp: 50, completed: true },
        { id: 'op_2', title: 'Log your first daily savings habit', rewardXp: 75, completed: user.totalSavings > 0 },
        { id: 'op_3', title: 'Explore city districts & companion advice', rewardXp: 30, completed: true },
      ],
      accentColor: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'learn_city',
      number: 2,
      name: 'Learn City',
      category: 'FINANCIAL ACADEMY',
      icon: BookOpen,
      unlocked: true,
      requiredLevel: 1,
      xPercent: isMobile ? 48 : 41,
      yPercent: isMobile ? 32 : 28,
      description:
        'Interactive financial literacy academy. Learn compound interest formulas, emergency fund scaling, inflation hedging, and smart tax-saving frameworks.',
      perks: ['Interactive financial calculator', 'Daily knowledge quiz bonus', 'Smart budgeting lessons'],
      tasks: [
        { id: 'lc_1', title: 'Complete Compound Interest 101', rewardXp: 60, completed: false },
        { id: 'lc_2', title: 'Pass the Emergency Fund Mastery Quiz', rewardXp: 80, completed: false },
      ],
      accentColor: 'from-amber-500 to-orange-500',
    },
    {
      id: 'skill_arena',
      number: 3,
      name: 'Skill Arena',
      category: 'SAVINGS VAULT',
      icon: Zap,
      unlocked: true,
      requiredLevel: 2,
      xPercent: isMobile ? 22 : 15,
      yPercent: isMobile ? 54 : 50,
      description:
        'High-energy savings colosseum where you challenge your spending habits with 30-day no-spend sprints, round-up micro-savings, and weekly savings duels.',
      perks: ['30-day savings challenge tracker', 'Round-up savings simulator', 'Squad leaderboard rank'],
      tasks: [
        { id: 'sa_1', title: 'Deposit ₹100 into your savings colosseum', rewardXp: 50, completed: user.totalSavings >= 100 },
        { id: 'sa_2', title: 'Maintain a 3-day consecutive saving streak', rewardXp: 100, completed: false },
      ],
      accentColor: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'project_hub',
      number: 4,
      name: 'Project Hub',
      category: 'MILESTONE TOWERS',
      icon: Target,
      unlocked: true,
      requiredLevel: 2,
      xPercent: isMobile ? 52 : 44,
      yPercent: isMobile ? 58 : 56,
      description:
        'Architectural project center for tracking your real-life milestones: Dream House, Emergency Shield, Tech Gadgets, and Vacation retreats.',
      perks: ['Milestone visual progress bars', 'Automated recurring savings plans', 'Custom goal blueprints'],
      tasks: [
        { id: 'ph_1', title: 'Set your primary goal target', rewardXp: 40, completed: true },
        { id: 'ph_2', title: 'Reach 25% of your milestone target', rewardXp: 150, completed: false },
      ],
      accentColor: 'from-purple-500 to-indigo-500',
    },
    {
      id: 'internship_district',
      number: 5,
      name: 'Internship District',
      category: 'CAREER & INCOME',
      icon: Briefcase,
      unlocked: currentLevel >= 5,
      requiredLevel: 5,
      xPercent: isMobile ? 56 : 53,
      yPercent: isMobile ? 18 : 14,
      description:
        'Career accelerator and side-hustle district. Learn active income scaling, freelance budgeting, salary negotiation, and micro-business capital allocation.',
      perks: ['Income scaling calculators', 'Side-income tracking tracker', '+15% passive XP boost'],
      tasks: [{ id: 'id_1', title: 'Reach Player Level 5 to unlock', rewardXp: 200, completed: currentLevel >= 5 }],
      accentColor: 'from-stone-600 to-stone-700',
    },
    {
      id: 'industry_connect',
      number: 6,
      name: 'Industry Connect',
      category: 'INVESTMENTS & EQUITY',
      icon: TrendingUp,
      unlocked: currentLevel >= 7,
      requiredLevel: 7,
      xPercent: isMobile ? 82 : 84,
      yPercent: isMobile ? 52 : 55,
      description:
        'Modern financial district with stock market indexes, mutual fund SIP allocations, dividend trackers, and wealth compounding engines.',
      perks: ['SIP growth visualizer', 'Diversification risk matrix', 'Market intelligence updates'],
      tasks: [{ id: 'ic_1', title: 'Reach Player Level 7 to unlock', rewardXp: 300, completed: currentLevel >= 7 }],
      accentColor: 'from-stone-600 to-stone-700',
    },
    {
      id: 'placement_zone',
      number: 7,
      name: 'Placement Zone',
      category: 'FINANCIAL FREEDOM',
      icon: Trophy,
      unlocked: currentLevel >= 10,
      requiredLevel: 10,
      xPercent: isMobile ? 85 : 85,
      yPercent: isMobile ? 26 : 28,
      description:
        'The crowning skyline of FinCity! Achieve ultimate financial freedom, debt zero status, automated passive income, and sustainable generational wealth.',
      perks: ['Golden Skyline Landmark', 'VIP Maestro Badge', 'Complete Financial Independence'],
      tasks: [{ id: 'pz_1', title: 'Reach Player Level 10 to unlock', rewardXp: 500, completed: currentLevel >= 10 }],
      accentColor: 'from-stone-600 to-stone-700',
    },
    {
      id: 'global_opportunities',
      number: 8,
      name: 'Global Opportunities',
      category: 'OFFSHORE & VENTURE',
      icon: Globe2,
      unlocked: currentLevel >= 12,
      requiredLevel: 12,
      xPercent: isMobile ? 50 : 46,
      yPercent: isMobile ? 82 : 82,
      description:
        'International financial hub and global venture investments. Explore cross-border assets, forex hedging, global ETFs, and angel portfolio strategies.',
      perks: ['Global asset tracker', 'Multi-currency vault', 'Venture syndicate access'],
      tasks: [{ id: 'go_1', title: 'Reach Player Level 12 to unlock', rewardXp: 1000, completed: currentLevel >= 12 }],
      accentColor: 'from-stone-600 to-stone-700',
    },
  ];

  const handleDepositAndXp = (amount: number) => {
    if (onAddSavings) {
      onAddSavings(amount, `Deposit at ${selectedDistrict?.name || 'FinCity'}`);
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#fcd34d', '#38bdf8'],
      });
      setShowDepositModal(false);
    }
  };

  return (
    <div
      className={`relative w-full h-full min-h-[520px] bg-slate-950 overflow-hidden select-none flex flex-col justify-between ${className}`}
    >
      {/* FIXED TOP HUD / FINCITY LEVEL BAR */}
      <div className="absolute top-3 left-3 z-40 flex items-start justify-between gap-3 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2.5 sm:p-3 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-700/80 shadow-2xl text-white pointer-events-auto max-w-[250px] sm:max-w-[280px] space-y-2"
        >
          {/* Header Title & Compact Mode Switcher */}
          <div className="flex items-center justify-between gap-2 border-b border-stone-800/80 pb-1.5">
            <div>
              <h1 className="text-sm sm:text-base font-black font-['Outfit',sans-serif] tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                FinCity 3D
              </h1>
              <p className="text-[9px] text-stone-400 font-medium truncate max-w-[120px]">
                {isGroupMode ? `🏙️ ${activeGroupGoal?.title}` : '🏢 Personal Savings Empire'}
              </p>
            </div>

            {/* City Mode Switcher Pills */}
            <div className="p-0.5 rounded-lg bg-stone-950 border border-stone-800 flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setCityMode('personal')}
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                  cityMode === 'personal'
                    ? 'bg-emerald-500 text-stone-950 font-black shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Personal
              </button>

              <button
                type="button"
                onClick={() => setCityMode('group')}
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                  cityMode === 'group'
                    ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Group
              </button>
            </div>
          </div>

          {/* Group Goal Picker (If Group Mode Selected) */}
          {cityMode === 'group' && (
            <div className="space-y-0.5">
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="w-full py-1 px-2 rounded-lg bg-stone-950 border border-amber-500/40 text-[10px] text-amber-300 font-bold outline-none focus:border-amber-400 cursor-pointer"
              >
                {(user.squadGoals || []).map((goal) => (
                  <option key={goal.id} value={goal.id} className="bg-stone-900 text-white">
                    {goal.title} (₹{goal.currentAmount.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Stats Bar: Level, Funds, Streak */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
            <div className="p-1 rounded-lg bg-stone-950/60 border border-stone-800/80 flex items-center justify-between px-2">
              <span className="text-amber-300">⭐ Lv.{currentLevel}</span>
              <span className="text-amber-400">🔥 {activeStreakDays}d</span>
            </div>
            <div className="p-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between px-2 font-mono">
              <span className="text-[9px] text-stone-400 font-sans">FUNDS</span>
              <span className="text-emerald-400 font-extrabold">₹{activeBuildFunds.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Streak Greenery Indicators (Trees & Lights Badges) */}
          <div className="flex items-center justify-between gap-1 text-[9px] font-bold pt-1 border-t border-stone-800/60">
            <span className="text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              🌲 Trees: {activeTreesCount}/5
            </span>
            <span className="text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              🏮 Lights: {activeStreetLightsCount}/5
            </span>
          </div>

          {/* XP Progress Track */}
          <div className="w-full h-1 rounded-full bg-stone-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 rounded-full"
            />
          </div>
        </motion.div>

        {/* TOP RIGHT QUEST ICON BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto relative"
        >
          <button
            type="button"
            onClick={() => setShowQuestOverlay(true)}
            className="p-3.5 rounded-2xl bg-stone-900/90 hover:bg-stone-850 backdrop-blur-md border border-amber-500/40 shadow-2xl text-white flex items-center gap-2.5 transition-all cursor-pointer group active:scale-95"
            title="Open City Quests & Challenges"
          >
            <div className="relative">
              <Scroll className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              {activeQuestCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-stone-950 font-black text-[9px] flex items-center justify-center animate-bounce">
                  {activeQuestCount}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <span>Quests</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                  {user.quests.filter((q) => q.completed).length}/{user.quests.length}
                </span>
              </div>
              <p className="text-[10px] text-stone-400">Earn EXP & Rewards</p>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Edge Vignette Mask to completely hide picture endings */}
      <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_120px_50px_rgba(2,6,23,0.95)]" />

      {/* Expansive Panning World Canvas (Clash of Clans style bounded drag & explore) */}
      <motion.div 
        drag
        dragConstraints={{ left: -90, right: 90, top: -60, bottom: 60 }}
        dragElastic={0}
        className="absolute -inset-[25%] z-0 cursor-grab active:cursor-grabbing w-[150%] h-[150%]"
      >
        <img
          src={isMobile ? MOBILE_MAP_IMG : DESKTOP_MAP_IMG}
          alt="FinCity 3D World Map"
          className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.05] pointer-events-none scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Ambient Vignette & Fog Layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/40 pointer-events-none" />

        {/* Realistic Volumetric Fog / Cloud Clusters over Locked Districts (No emojis or text) */}
        {districts.map((d, idx) => {
          if (d.unlocked) return null;
          return (
            <motion.div
              key={`cloud_${d.id}`}
              initial={{ opacity: 0.88 }}
              animate={{ 
                x: [-12, 12, -12], 
                y: [-6, 6, -6],
                scale: [0.98, 1.04, 0.98]
              }}
              transition={{ duration: 10 + idx * 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                left: `${d.xPercent}%`,
                top: `${d.yPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 pointer-events-none w-56 h-48 sm:w-72 sm:h-60 flex items-center justify-center"
            >
              {/* Layered Realistic Volumetric Cloud Puffs */}
              <div className="absolute inset-0 bg-white/40 rounded-full blur-3xl transform scale-125" />
              <div className="absolute w-36 h-36 -top-4 -left-4 bg-white/60 rounded-full blur-2xl" />
              <div className="absolute w-44 h-44 -bottom-4 -right-4 bg-slate-100/70 rounded-full blur-2xl" />
              <div className="absolute w-32 h-32 top-2 right-2 bg-sky-100/50 rounded-full blur-xl" />
              <div className="absolute w-48 h-28 bg-white/75 rounded-full blur-xl shadow-inner" />

              {/* Realistic Wispy Cloud SVG Overlay */}
              <svg viewBox="0 0 200 120" className="w-full h-full opacity-75 filter blur-[2px] pointer-events-none">
                <path
                  d="M20,70 Q35,30 75,45 Q95,15 135,35 Q175,25 185,65 Q205,85 175,105 Q145,115 105,110 Q55,115 20,90 Z"
                  fill="rgba(255, 255, 255, 0.7)"
                />
                <path
                  d="M40,80 Q55,45 85,55 Q105,25 145,45 Q175,35 180,75 Z"
                  fill="rgba(241, 245, 249, 0.85)"
                />
              </svg>
            </motion.div>
          );
        })}

        {/* ISOMETRIC TREES & STREET LIGHTS LAYER (Grown from 3-day consecutive saving streak) */}
        <div className="absolute inset-0 z-25 pointer-events-none">
          {/* Preset 5 tree coordinates around island parks */}
          {[
            { x: 32, y: 36, label: 'Tree 1' },
            { x: 38, y: 44, label: 'Tree 2' },
            { x: 20, y: 32, label: 'Tree 3' },
            { x: 44, y: 38, label: 'Tree 4' },
            { x: 28, y: 48, label: 'Tree 5' },
          ].slice(0, activeTreesCount).map((tree, i) => (
            <motion.div
              key={`tree_${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{ left: `${tree.x}%`, top: `${tree.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group pointer-events-auto cursor-pointer"
            >
              <div className="relative">
                {/* 3D Pine/Lush Tree SVG */}
                <svg width="36" height="48" viewBox="0 0 36 48" className="filter drop-shadow-md">
                  {/* Shadow */}
                  <ellipse cx="18" cy="44" rx="12" ry="4" fill="#020617" opacity="0.5" />
                  {/* Trunk */}
                  <rect x="15" y="30" width="6" height="12" rx="1" fill="#78350f" />
                  {/* Foliage Layers */}
                  <polygon points="18,2 4,22 32,22" fill="#15803d" />
                  <polygon points="18,10 6,28 30,28" fill="#16a34a" />
                  <polygon points="18,18 8,34 28,34" fill="#22c55e" />
                </svg>
              </div>
              <span className="text-[9px] font-black bg-emerald-950/90 text-emerald-300 px-1.5 py-0.5 rounded-md border border-emerald-500/40 opacity-0 group-hover:opacity-100 transition-opacity">
                Streak Tree #{i + 1}
              </span>
            </motion.div>
          ))}

          {/* Preset 5 streetlight coordinates along island boulevards */}
          {[
            { x: 35, y: 28, label: 'Light 1' },
            { x: 24, y: 40, label: 'Light 2' },
            { x: 42, y: 32, label: 'Light 3' },
            { x: 18, y: 46, label: 'Light 4' },
            { x: 48, y: 42, label: 'Light 5' },
          ].slice(0, activeStreetLightsCount).map((light, i) => (
            <motion.div
              key={`light_${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{ left: `${light.x}%`, top: `${light.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group pointer-events-auto cursor-pointer"
            >
              <div className="relative">
                {/* Glowing Lantern/Streetlight SVG */}
                <svg width="24" height="40" viewBox="0 0 24 40" className="filter drop-shadow-lg">
                  {/* Glowing Aura Ring */}
                  <circle cx="12" cy="10" r="10" fill="#fef08a" opacity="0.35" className="animate-pulse" />
                  {/* Base & Post */}
                  <line x1="12" y1="36" x2="12" y2="10" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="8" y="34" width="8" height="3" rx="1" fill="#334155" />
                  {/* Lantern Head */}
                  <polygon points="12,2 6,8 18,8" fill="#f59e0b" />
                  <rect x="7" y="8" width="10" height="7" fill="#fef08a" stroke="#d97706" strokeWidth="0.8" />
                </svg>
              </div>
              <span className="text-[9px] font-black bg-amber-950/90 text-amber-300 px-1.5 py-0.5 rounded-md border border-amber-500/40 opacity-0 group-hover:opacity-100 transition-opacity">
                Street Light #{i + 1}
              </span>
            </motion.div>
          ))}
        </div>

        {/* INTERACTIVE DISTRICT PINS & LOCK BADGES LAYER (Inside Draggable Canvas) */}
        <div className="absolute inset-0 z-30">
          {districts.map((district) => {
            const isUnlocked = district.unlocked;

            return (
              <div
                key={district.id}
                style={{
                  left: `${district.xPercent}%`,
                  top: `${district.yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute pointer-events-auto"
              >
                {isUnlocked ? (
                  /* UNLOCKED DISTRICT CALLOUT (Speech-bubble / White pill like reference) */
                  <motion.button
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDistrict(district)}
                    className="group relative flex items-center gap-2 py-1.5 px-3 rounded-2xl bg-white/95 text-stone-900 font-extrabold text-xs shadow-xl shadow-black/40 border border-white/60 hover:bg-white hover:ring-2 hover:ring-emerald-400 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {/* Subtle Pulse Glow */}
                    <span className="absolute -inset-1 rounded-2xl bg-emerald-400/20 blur-sm group-hover:bg-emerald-400/40 transition-all animate-pulse" />

                    {/* Icon Indicator */}
                    <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] shrink-0 font-black">
                      {district.number}
                    </span>

                    {/* District Title */}
                    <div className="relative flex flex-col items-start leading-tight">
                      {district.category === 'START HERE' && (
                        <span className="text-[9px] font-black text-emerald-600 tracking-wider">
                          START HERE
                        </span>
                      )}
                      <span className="text-xs font-bold text-stone-900">{district.name}</span>
                    </div>

                    {/* Speech Bubble Arrow pointing down */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-stone-200/60" />
                  </motion.button>
                ) : (
                  /* LOCKED CLOUD DISTRICT BADGE (Dark Lock Pill like reference) */
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDistrict(district)}
                    className="group flex flex-col items-center p-2 rounded-2xl bg-stone-900/90 hover:bg-stone-850 backdrop-blur-md border border-stone-700 text-white shadow-xl cursor-pointer min-w-[130px] sm:min-w-[150px]"
                  >
                    {/* Lock Icon */}
                    <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 group-hover:text-amber-400 transition-colors mb-1">
                      <Lock className="w-4 h-4" />
                    </div>

                    <span className="text-[10px] font-bold text-stone-300">
                      Unlocks at Level {district.requiredLevel}
                    </span>
                    <span className="text-[11px] font-extrabold text-stone-100 mt-0.5">
                      {district.name}
                    </span>
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* BOTTOM OVERLAYS: Status Card */}
      <div className="relative z-10 p-3 sm:p-5 flex items-end justify-between gap-3 pointer-events-none">
        {/* Bottom-Left: Journey Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 sm:p-3.5 rounded-2xl bg-stone-900/85 backdrop-blur-md border border-stone-700/80 shadow-2xl text-stone-100 pointer-events-auto flex items-center gap-2.5 max-w-[200px] sm:max-w-[240px]"
        >
          <span className="text-xl sm:text-2xl">🏔️</span>
          <div>
            <p className="text-[11px] text-stone-400 font-semibold leading-none">Your Journey</p>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5 leading-tight">
              {currentLevel <= 2
                ? 'Just Began...'
                : currentLevel <= 5
                ? 'Growing Steadily'
                : 'Thriving Empire'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* DISTRICT DETAIL INSPECTION MODAL */}
      <AnimatePresence>
        {selectedDistrict && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-3xl p-5 sm:p-6 shadow-2xl text-white overflow-hidden max-h-[85vh] flex flex-col justify-between"
            >
              {/* Modal Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-stone-950 flex items-center justify-center font-black shadow-md">
                      {selectedDistrict.unlocked ? (
                        <selectedDistrict.icon className="w-5 h-5 text-stone-950" />
                      ) : (
                        <Lock className="w-5 h-5 text-stone-950" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                        {selectedDistrict.category}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold font-['Outfit',sans-serif] text-white leading-tight">
                        {selectedDistrict.number}. {selectedDistrict.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDistrict(null)}
                    className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* District Overview & Status */}
                <div className="mt-4 space-y-3">
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {selectedDistrict.description}
                  </p>

                  {/* Lock Warning if locked */}
                  {!selectedDistrict.unlocked && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-bold">District Locked</span> — Reach{' '}
                        <span className="font-extrabold text-amber-300">
                          Level {selectedDistrict.requiredLevel}
                        </span>{' '}
                        by saving and completing quests to unlock this zone!
                      </div>
                    </div>
                  )}

                  {/* Perks & Features */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                      District Advantages &amp; Perks
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedDistrict.perks.map((perk, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 rounded-xl bg-stone-800/80 border border-stone-700/60 text-xs text-stone-200"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Quests in this District */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                      District Missions
                    </h4>
                    <div className="space-y-2">
                      {selectedDistrict.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/90 border border-stone-700 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            {task.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-stone-500 shrink-0" />
                            )}
                            <span className={task.completed ? 'text-stone-400 line-through' : 'text-stone-100 font-medium'}>
                              {task.title}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                            +{task.rewardXp} XP
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDistrict(null)}
                  className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Map
                </button>

                {selectedDistrict.unlocked ? (
                  <div className="flex-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onEnterDistrict) onEnterDistrict(selectedDistrict, cityMode, cityMode === 'group' ? selectedGoalId : undefined);
                        setSelectedDistrict(null);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 text-stone-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      <Building className="w-4 h-4" />
                      <span>Enter Plots Grid</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDepositAndXp(100);
                        setSelectedDistrict(null);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Invest</span>
                    </button>
                  </div>
                ) : (
                  <button
                    disabled
                    className="flex-1 py-2.5 px-4 rounded-xl bg-stone-800 text-stone-500 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Locked until Level {selectedDistrict.requiredLevel}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUESTS OVERLAY MODAL */}
      <AnimatePresence>
        {showQuestOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto"
            onClick={() => setShowQuestOverlay(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Scroll className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-['Outfit',sans-serif] text-stone-100">
                      City Quests & Habit Tasks
                    </h3>
                    <p className="text-xs text-stone-400">Complete daily tasks to unlock EXP & Hearts</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuestOverlay(false)}
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* Progress Summary Bar */}
              <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Quest Progress</div>
                  <div className="text-xs font-extrabold text-amber-300 mt-0.5">
                    {user.quests.filter((q) => q.completed).length} of {user.quests.length} Completed
                  </div>
                </div>
                <div className="w-24 h-2 bg-stone-800 rounded-full overflow-hidden border border-stone-700">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${(user.quests.filter((q) => q.completed).length / Math.max(user.quests.length, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Quests List */}
              <div className="space-y-2.5">
                {user.quests.map((quest) => (
                  <div
                    key={quest.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      quest.completed
                        ? 'bg-emerald-950/20 border-emerald-500/30 opacity-80'
                        : 'bg-stone-850 hover:bg-stone-800 border-stone-750'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (!quest.completed && onCompleteQuest) {
                              onCompleteQuest(quest.id);
                            }
                          }}
                          className={`mt-0.5 flex-shrink-0 transition-transform ${
                            quest.completed ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
                          }`}
                        >
                          {quest.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-stone-500 hover:text-emerald-400" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <h4 className={`text-xs font-bold ${quest.completed ? 'line-through text-stone-400' : 'text-stone-100'}`}>
                            {quest.title}
                          </h4>
                          <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{quest.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="flex items-center gap-1 text-[10px] text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                          <Zap className="w-3 h-3 text-blue-400" />
                          +{quest.rewardExp}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-rose-300 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg">
                          <Heart className="w-3 h-3 text-rose-400" />
                          +{quest.rewardXP}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
