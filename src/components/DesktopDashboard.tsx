import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  Home,
  Receipt,
  Target,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  Zap,
  Heart,
  Building,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  Calendar,
  X,
  Palmtree,
  Laptop,
  Bike,
  GraduationCap,
  ShieldAlert,
  PlusCircle,
  ChevronRight,
} from 'lucide-react';
import { UserState, DesktopNav, BuildingPlot, Transaction, FriendInvitation } from '../types';
import {
  getNextStageCost,
  getNextStageDetails,
  getBuildingConfig,
  BUILDING_TIER_CONFIGS,
  BuildingStyle,
} from '../utils/buildingPricing';
import { IsometricCity } from './IsometricCity';
import { FloatingIslandMap, DistrictInfo } from './FloatingIslandMap';
import { INITIAL_BUILDINGS } from '../data/mockData';
import { NovaGuide } from './NovaGuide';
import { getAssistant } from '../data/assistants';
import { FriendsView } from './FriendsView';

import { TransactionModal } from './TransactionModal';
import { TransactionHistoryView } from './TransactionHistoryView';
import { calculateFinancialSummary } from '../utils/financeUtils';

interface DesktopDashboardProps {
  user: UserState;
  onAddSavings: (amount: number, desc: string) => void;
  onAddTransaction?: (transaction: {
    type: 'earn' | 'spend' | 'save';
    amount: number;
    category: string;
    categoryType?: 'Needs' | 'Wants' | 'Savings' | 'Income';
    description: string;
    paymentMethod?: string;
    date?: string;
  }) => void;
  onSelectPlot: (plot: BuildingPlot) => void;
  onUpgradePlot?: (plotId: string, cost: number, customName?: string, buildingStyle?: BuildingStyle, districtId?: string, squadGoalId?: string) => void;
  onRenamePlot?: (plotId: string, newName: string, districtId?: string) => void;
  onCompleteQuest: (questId: string) => void;
  onSwitchToMobile: () => void;
  onMissDay?: () => void;
  onAddFriend?: (cityId: string) => { success: boolean; message: string; invitation?: FriendInvitation };
  onAcceptInvitation?: (invitationId: string) => void;
  onDeclineInvitation?: (invitationId: string) => void;
  onSimulateFriendAccept?: (invitationId: string) => void;
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  user,
  onAddSavings,
  onAddTransaction,
  onSelectPlot,
  onUpgradePlot,
  onRenamePlot,
  onCompleteQuest,
  onSwitchToMobile,
  onMissDay,
  onAddFriend,
  onAcceptInvitation,
  onDeclineInvitation,
  onSimulateFriendAccept,
}) => {
  const [activeNav, setActiveNav] = useState<DesktopNav>('home');
  const [activeDistrictForGrid, setActiveDistrictForGrid] = useState<DistrictInfo | null>(null);
  const [activeDistrictCityMode, setActiveDistrictCityMode] = useState<'personal' | 'group'>('personal');
  const [activeDistrictSquadGoalId, setActiveDistrictSquadGoalId] = useState<string | undefined>(undefined);
  const [selectedPlot, setSelectedPlot] = useState<BuildingPlot | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [txFilter, setTxFilter] = useState<'all' | 'earn' | 'spend' | 'save'>('all');
  
  // Custom name and style states for desktop building
  const [customBuildingName, setCustomBuildingName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<BuildingStyle>('cottage');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameInput, setRenameInput] = useState('');

  const activeGroupGoal = user.squadGoals?.find((g) => g.id === activeDistrictSquadGoalId);
  const isGroupModeGrid = activeDistrictCityMode === 'group' && !!activeGroupGoal;
  const availableFundsForBuild = isGroupModeGrid
    ? (activeGroupGoal?.availableBuildFunds ?? 0)
    : user.availableBuildFunds;

  // Keep state in sync with selected plot
  const handlePlotSelect = (plot: BuildingPlot) => {
    setSelectedPlot(plot);
    setIsRenaming(false);
    onSelectPlot(plot);
    if (plot.stage === 0) {
      setCustomBuildingName('');
      setSelectedStyle(plot.buildingStyle || 'cottage');
    } else {
      setRenameInput(plot.name);
      setSelectedStyle(plot.buildingStyle || 'cottage');
    }
  };

  const handleUpgradeDesktop = (cost?: number) => {
    if (selectedPlot && onUpgradePlot && activeDistrictForGrid) {
      const activeCfg = getBuildingConfig(selectedStyle || selectedPlot.buildingStyle || selectedPlot);
      const stageCost = typeof cost === 'number' && cost > 0 ? cost : getNextStageCost(selectedPlot, selectedStyle);
      const finalName = customBuildingName.trim() || (selectedPlot.name.startsWith('Available Plot') ? activeCfg.name : selectedPlot.name);
      onUpgradePlot(
        selectedPlot.id,
        stageCost,
        finalName,
        selectedStyle,
        activeDistrictForGrid.id,
        isGroupModeGrid ? activeDistrictSquadGoalId : undefined
      );
      setSelectedPlot(null);
    }
  };

  const handleSaveRenameDesktop = () => {
    if (selectedPlot && onRenamePlot && renameInput.trim() && activeDistrictForGrid) {
      onRenamePlot(selectedPlot.id, renameInput.trim(), activeDistrictForGrid.id);
      setIsRenaming(false);
      setSelectedPlot({ ...selectedPlot, name: renameInput.trim() });
    }
  };

  const currentAssistant = getAssistant(user.selectedAssistantId);

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Palmtree,
    Laptop,
    Bike,
    GraduationCap,
    ShieldAlert,
    PlusCircle,
  };

  // Find user's selected goal
  const currentGoal =
    user.goals?.find((g) => g.id === user.selectedGoalId) ||
    user.goals?.[0] || {
      name: 'Goa Trip',
      targetAmount: 20000,
      currentAmount: user.totalSavings,
      iconName: 'Palmtree',
    };

  const userGoal = {
    name: currentGoal.name,
    target: currentGoal.targetAmount,
    current: user.totalSavings,
    icon: iconMap[currentGoal.iconName] || Palmtree,
  };

  const goalProgressPct = Math.min(
    100,
    Math.round((user.totalSavings / (userGoal.target || 1)) * 100)
  );



  return (
    <div className="flex h-screen w-full bg-stone-950 text-stone-100 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ================================================================= */}
      {/* 1. LEFT SIDEBAR NAVIGATION (Matching laptop view in user image)   */}
      {/* ================================================================= */}
      <aside className="w-64 flex-shrink-0 bg-stone-900/90 backdrop-blur-xl border-r border-stone-800 flex flex-col justify-between p-4 z-20">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 px-3 py-4 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-md">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black font-['Outfit',sans-serif] tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                FinCity
              </span>
              <p className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-semibold -mt-1">
                Your Money. Your City.
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'transactions', label: 'Transactions', icon: Receipt },
              { id: 'goals', label: 'Goals', icon: Target },
              { id: 'squad', label: 'Friends', icon: Users },
              { id: 'reports', label: 'Reports', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id as DesktopNav)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Selected Assistant Advisor */}
        <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800/80 flex items-center gap-3">
          <NovaGuide characterId={user.selectedAssistantId} size="sm" expression="happy" />
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-stone-200">{currentAssistant.name}&apos;s Advice</div>
            <p className="text-[11px] text-stone-400 truncate">
              {user.totalSavings < 500
                ? 'Save ₹500 to unlock Bakery!'
                : 'Great job! Your city is flourishing.'}
            </p>
          </div>
        </div>
      </aside>

      {/* ================================================================= */}
      {/* 2. MAIN CENTER STAGE & TOP BAR                                   */}
      {/* ================================================================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top App Bar */}
        <header className="h-16 px-6 bg-stone-900/80 backdrop-blur-md border-b border-stone-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold font-['Outfit',sans-serif] text-stone-100">
              {activeNav === 'home' && 'Metropolis View'}
              {activeNav === 'transactions' && 'Savings & Ledger'}
              {activeNav === 'goals' && 'Financial Goals'}
              {activeNav === 'quests' && 'Daily & Habit Quests'}
              {activeNav === 'squad' && 'Citizen Squad & Leaderboard'}
              {activeNav === 'reports' && '50/30/20 Financial Reports'}
              {activeNav === 'settings' && 'City Settings'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              Live Simulation
            </span>
          </div>

          {/* Right Header Status Badges */}
          <div className="flex items-center gap-4">
            {/* Quick Miss Day Prototype */}
            {onMissDay && (
              <button
                onClick={onMissDay}
                className="px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-bold text-stone-300 hover:text-white hover:border-rose-400 transition-all flex items-center gap-1.5"
                title="Simulate missing a savings day"
              >
                💔 Miss Day
              </button>
            )}

            {/* Quick Mobile Prototype Switcher */}
            <button
              onClick={onSwitchToMobile}
              className="px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-bold text-stone-300 hover:text-white hover:border-emerald-400 transition-all flex items-center gap-1.5"
            >
              📱 Mobile Flow Preview
            </button>

            {/* EXP Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>{user.exp}</span>
            </div>

            {/* Hearts/XP Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>{user.hearts}</span>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-stone-800">
              <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-stone-900 font-bold text-xs overflow-hidden">
                <NovaGuide characterId={user.selectedAssistantId} size="sm" expression="happy" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-stone-100 leading-none">
                  {user.name || 'Citizen'}
                </div>
                <div className="text-[10px] text-stone-400 font-medium flex items-center gap-1 mt-0.5 leading-tight">
                  <span className="text-emerald-400 font-mono font-semibold">{user.tag}</span>
                  <span className="text-stone-600">•</span>
                  <span>Level {user.level}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Center Content based on Active Nav */}
        <div className="flex-1 flex overflow-hidden relative">
          {activeNav === 'home' && (
            <div className="flex-1 relative flex flex-col h-full overflow-hidden">
              {/* Interactive Full Floating Island Map & Construction Grid */}
              <div className="flex-1 w-full h-full relative">
                {!activeDistrictForGrid ? (
                  <FloatingIslandMap
                    user={user}
                    isMobile={false}
                    onAddSavings={onAddSavings}
                    onUpgradePlot={onUpgradePlot}
                    onCompleteQuest={onCompleteQuest}
                    onEnterDistrict={(district, mode, squadGoalId) => {
                      setActiveDistrictForGrid(district);
                      setActiveDistrictCityMode(mode || 'personal');
                      setActiveDistrictSquadGoalId(squadGoalId);
                    }}
                  />
                ) : (
                  <div className="flex-1 w-full h-full relative flex flex-col">
                    {/* District Plot Grid Header Bar */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-stone-900/90 backdrop-blur-md py-2 px-4 rounded-2xl border border-stone-700 shadow-xl">
                      <button
                        onClick={() => setActiveDistrictForGrid(null)}
                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        ← Back to 3D Archipelago City
                      </button>
                      <span className="text-xs font-bold text-emerald-400">
                        🏗️ {activeDistrictForGrid.name} Plots Grid ({isGroupModeGrid ? `Group: ${activeGroupGoal?.title}` : 'Personal City'})
                      </span>
                    </div>

                    <div className="flex-1 w-full h-full pt-16">
                      <IsometricCity
                        mode="full-city"
                        districtId={activeDistrictForGrid.id}
                        buildings={
                          isGroupModeGrid && activeGroupGoal
                            ? (activeGroupGoal.buildings || INITIAL_BUILDINGS.map((b) => ({ ...b, id: `group_${activeGroupGoal.id}_${b.id}` })))
                            : (user.districtBuildings?.[activeDistrictForGrid.id] || user.buildings || INITIAL_BUILDINGS)
                        }
                        selectedPlotId={selectedPlot?.id}
                        onSelectPlot={handlePlotSelect}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TRANSACTIONS VIEW */}
          {activeNav === 'transactions' && (
            <div className="flex-1 p-8 overflow-y-auto">
              <TransactionHistoryView
                user={user}
                onAddTransaction={onAddTransaction || (() => {})}
                isDesktop={true}
              />
            </div>
          )}

          {/* GOALS VIEW */}
          {activeNav === 'goals' && (
            <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-['Outfit',sans-serif] text-stone-100">
                    Financial Milestones
                  </h3>
                  <p className="text-xs text-stone-400">
                    Track the real-life rewards powering your city
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(user.goals || []).map((goal) => {
                  const isSelected = user.selectedGoalId === goal.id;
                  const GoalIcon = iconMap[goal.iconName] || Target;
                  const progress = Math.min(
                    100,
                    Math.round(
                      (user.totalSavings / (goal.targetAmount || 1)) * 100
                    )
                  );

                  return (
                    <div
                      key={goal.id}
                      className={`p-6 rounded-3xl shadow-xl relative overflow-hidden transition-all ${
                        isSelected
                          ? 'bg-stone-900 border border-emerald-500/40'
                          : 'bg-stone-900/60 border border-stone-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-center text-emerald-400">
                            <GoalIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white truncate max-w-[160px]">
                              {goal.name}
                            </h4>
                            <span className="text-xs text-stone-400">
                              Target: ₹{goal.targetAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        {isSelected ? (
                          <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/20">
                            Active Goal
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400 px-2.5 py-1 rounded-full bg-stone-800/60">
                            Milestone
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-stone-400">
                            Saved: ₹{user.totalSavings.toLocaleString('en-IN')}
                          </span>
                          <span className="font-bold text-emerald-400">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTS VIEW */}
          {activeNav === 'quests' && (
            <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold font-['Outfit',sans-serif] text-stone-100">
                Civic Quests & Habit Builders
              </h3>
              <div className="space-y-3">
                {user.quests.map((quest) => (
                  <div
                    key={quest.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                      quest.completed
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <button
                        onClick={() => onCompleteQuest(quest.id)}
                        className="text-emerald-400 cursor-pointer"
                      >
                        <CheckSquare className="w-6 h-6" />
                      </button>
                      <div>
                        <div className={`text-sm font-bold ${quest.completed ? 'line-through text-stone-400' : 'text-white'}`}>
                          {quest.title}
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">{quest.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-blue-400" />
                        +{quest.rewardExp}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        +{quest.rewardXP}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FRIENDS & COMMUNITY VIEW */}
          {activeNav === 'squad' && (
            <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-4xl mx-auto">
              <FriendsView
                user={user}
                onAddFriend={onAddFriend || (() => ({ success: false, message: 'Not available' }))}
                onAcceptInvitation={onAcceptInvitation || (() => {})}
                onDeclineInvitation={onDeclineInvitation || (() => {})}
                onSimulateFriendAccept={onSimulateFriendAccept || (() => {})}
                isDesktop={true}
              />
            </div>
          )}

          {/* 50/30/20 REPORTS VIEW */}
          {activeNav === 'reports' && (
            <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold font-['Outfit',sans-serif] text-stone-100">
                50 / 30 / 20 Budget Health
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-stone-900 border border-red-500/30">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                    Needs (50%)
                  </div>
                  <div className="text-2xl font-black text-white">
                    ₹{user.budgetNeeds.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2">Rent, Groceries, Utilities</p>
                </div>
                <div className="p-5 rounded-2xl bg-stone-900 border border-amber-500/30">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    Wants (30%)
                  </div>
                  <div className="text-2xl font-black text-white">
                    ₹{user.budgetWants.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2">Dining out, Hobbies, Shopping</p>
                </div>
                <div className="p-5 rounded-2xl bg-stone-900 border border-emerald-500/30">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    Savings (20%)
                  </div>
                  <div className="text-2xl font-black text-emerald-300">
                    ₹{user.budgetSavings.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2">Investments & City Growth</p>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS VIEW */}
          {activeNav === 'settings' && (
            <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold font-['Outfit',sans-serif] text-stone-100">
                Account & Preferences
              </h3>
              <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-stone-800">
                  <div>
                    <div className="text-sm font-bold text-white">Citizen Name</div>
                    <div className="text-xs text-stone-400">{user.name}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-stone-800">
                  <div>
                    <div className="text-sm font-bold text-white">City ID Tag</div>
                    <div className="text-xs text-emerald-400 font-mono">{user.tag}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <div className="text-sm font-bold text-white">Currency</div>
                    <div className="text-xs text-stone-400">Indian Rupee (₹ INR)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 3. RIGHT PANEL: "YOUR PROGRESS" (Exact match to image laptop view)*/}
          {/* ================================================================= */}
          <aside className="w-80 flex-shrink-0 bg-stone-900/90 backdrop-blur-xl border-l border-stone-800 p-6 flex flex-col justify-between z-10">
            <div className="space-y-6">
              {/* Header Title */}
              <div>
                <h3 className="text-base font-bold font-['Outfit',sans-serif] text-stone-100">
                  Your Progress
                </h3>
                <p className="text-xs text-stone-400">
                  Real-time city statistics & metrics
                </p>
              </div>

              {/* Stats Cards (Exact match to mockup) */}
              <div className="space-y-3">
                {/* 1. Total Savings */}
                <div className="p-4 rounded-2xl bg-stone-950/80 border border-emerald-500/30 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold font-['Outfit',sans-serif] text-white">
                      ₹ {user.totalSavings.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-stone-400 font-semibold">
                      Total Savings
                    </div>
                  </div>
                </div>

                {/* 2. Building Count */}
                <div className="p-4 rounded-2xl bg-stone-950/80 border border-emerald-500/30 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold font-['Outfit',sans-serif] text-white">
                      {user.buildingsCount || 1}
                    </div>
                    <div className="text-xs text-stone-400 font-semibold">
                      Building
                    </div>
                  </div>
                </div>

                {/* 3. Goal Progress */}
                <div className="p-4 rounded-2xl bg-stone-950/80 border border-emerald-500/30 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold font-['Outfit',sans-serif] text-emerald-400">
                      {goalProgressPct}%
                    </div>
                    <div className="text-xs text-stone-400 font-semibold">
                      Goal Progress
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Add Savings CTA */}
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all text-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add Savings & Expand City
              </button>
            </div>

            {/* Motivational Tagline from mockup */}
            <div className="pt-6 border-t border-stone-800 text-center">
              <div className="text-xs font-bold text-stone-200">
                Build Habits. Build Your City.
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                Build a Better You. 🍃
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* ================================================================= */}
      {/* 4. PLOT INSPECTOR & BUILDER DRAWER                                */}
      {/* ================================================================= */}
      <AnimatePresence>
        {selectedPlot && (() => {
          const activeCfg = getBuildingConfig(selectedStyle || selectedPlot.buildingStyle || selectedPlot);
          const currentStageCost = getNextStageCost(selectedPlot, selectedStyle);
          const currentStageDetails = getNextStageDetails(selectedPlot, selectedStyle);

          return (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            className="fixed inset-y-0 right-0 w-96 bg-stone-900/95 backdrop-blur-2xl border-l border-stone-800 p-6 z-50 flex flex-col justify-between shadow-2xl overflow-y-auto"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {selectedPlot.stage === 0 ? '🏗️ Plot Available' : `🔨 Stage ${selectedPlot.stage} / 3 • ${activeCfg.tag}`}
                </span>
                <button
                  onClick={() => setSelectedPlot(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Status */}
              <div>
                <h3 className="text-xl font-bold font-['Outfit',sans-serif] text-white">
                  {selectedPlot.stage === 0 ? 'Build on this Plot' : selectedPlot.name}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {selectedPlot.stage === 0
                    ? 'Name your establishment, pick an architectural tier, and begin construction.'
                    : selectedPlot.description}
                </p>
              </div>

              {/* STAGE 0: Custom Name & Style Selector */}
              {selectedPlot.stage === 0 && (
                <div className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      1. Custom Building Name
                    </label>
                    <input
                      type="text"
                      value={customBuildingName}
                      onChange={(e) => setCustomBuildingName(e.target.value)}
                      placeholder="e.g. Twilight Loft, Sunset Bakery, Eco Villa..."
                      className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs font-semibold text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[
                        'Grand Reserve Bank',
                        'Corner Books & Cafe',
                        'Infinity Pool Villa',
                        'EV Solar Station',
                        'Metro Police HQ',
                        'Burger Bistro',
                        'Cyber Ramen Stall',
                        'Nordic Studio',
                        'Twilight Cottage',
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setCustomBuildingName(chip)}
                          className="px-2 py-0.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-[10px] font-medium text-stone-300 border border-stone-700"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Architecture Style Selector */}
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      2. Architectural Style & Tier Pricing
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(BUILDING_TIER_CONFIGS) as BuildingStyle[]).map((key) => {
                        const cfg = BUILDING_TIER_CONFIGS[key];
                        const isPicked = selectedStyle === cfg.id;
                        return (
                          <button
                            key={cfg.id}
                            type="button"
                            onClick={() => setSelectedStyle(cfg.id)}
                            className={`p-2.5 rounded-xl text-left border transition-all ${
                              isPicked
                                ? `${cfg.accent} ring-2 ring-emerald-400/50 shadow-md`
                                : 'border-stone-800 bg-stone-800/40 hover:bg-stone-800 text-stone-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-lg">{cfg.icon}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-900/80 font-mono font-bold text-emerald-400 border border-emerald-500/20">
                                Base: ₹{cfg.stages[0].cost}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-white leading-tight">{cfg.name}</div>
                            <div className="flex items-center justify-between text-[9px] text-stone-400 mt-1">
                              <span>{cfg.tag}</span>
                              <span className="text-amber-300 font-bold">+{cfg.completionExp} EXP</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STAGES 1, 2, 3: Details & Rename */}
              {selectedPlot.stage > 0 && (
                <div className="space-y-3">
                  {isRenaming ? (
                    <div className="p-3 bg-stone-800 rounded-xl border border-stone-700">
                      <label className="block text-[11px] font-bold text-stone-400 mb-1.5">Rename Building</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={renameInput}
                          onChange={(e) => setRenameInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white"
                        />
                        <button
                          onClick={handleSaveRenameDesktop}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-lg text-xs"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-stone-800/80 border border-stone-700/80">
                      <div>
                        <div className="text-xs text-stone-400 font-medium">Building Name</div>
                        <div className="text-sm font-bold text-white">{selectedPlot.name}</div>
                      </div>
                      <button
                        onClick={() => {
                          setRenameInput(selectedPlot.name);
                          setIsRenaming(true);
                        }}
                        className="px-2.5 py-1 bg-stone-700 hover:bg-stone-600 rounded-lg text-[11px] text-stone-200 font-semibold"
                      >
                        ✏️ Rename
                      </button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs p-3 rounded-xl bg-stone-800/60 border border-stone-800">
                      <span className="text-stone-400">Daily Coin Yield</span>
                      <span className="font-bold text-amber-300 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-blue-400" />
                        +{activeCfg.dailyExp} EXP/day
                      </span>
                    </div>
                    <div className="flex justify-between text-xs p-3 rounded-xl bg-stone-800/60 border border-stone-800">
                      <span className="text-stone-400">Total XP Value</span>
                      <span className="font-bold text-rose-300 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        +{activeCfg.xpValue} XP
                      </span>
                    </div>
                    <div className="flex justify-between text-xs p-3 rounded-xl bg-stone-800/60 border border-stone-800">
                      <span className="text-stone-400">Build Funds Available</span>
                      <span className="font-bold text-emerald-400 font-mono">₹{availableFundsForBuild.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3-STAGE CONSTRUCTION ROADMAP */}
              <div className="p-3 bg-stone-950/70 rounded-2xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-400 font-bold">
                  <span>CONSTRUCTION STAGES</span>
                  <span className="text-stone-300 font-mono">Total: ₹{activeCfg.totalCost}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {activeCfg.stages.map((stg) => {
                    const isDone = (selectedPlot.stage || 0) >= stg.stage;
                    const isCurrent = (selectedPlot.stage || 0) === stg.stage - 1;
                    return (
                      <div
                        key={stg.stage}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          isDone
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                            : isCurrent
                            ? 'bg-amber-500/15 border-amber-400/50 text-amber-200 shadow-sm'
                            : 'bg-stone-900/60 border-stone-800 text-stone-500'
                        }`}
                      >
                        <div className="text-[10px] font-extrabold truncate">
                          {isDone ? '✓ ' : ''}{stg.shortName}
                        </div>
                        <div className={`text-[11px] font-black font-mono mt-0.5 ${isCurrent ? 'text-amber-300' : isDone ? 'text-emerald-400' : 'text-stone-400'}`}>
                          ₹{stg.cost}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Upgrade / Build Button */}
            <div className="pt-4 border-t border-stone-800">
              {selectedPlot.stage < 3 ? (
                <div>
                  <button
                    onClick={() => handleUpgradeDesktop(currentStageCost)}
                    disabled={availableFundsForBuild < currentStageCost}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-stone-950 font-extrabold rounded-xl text-xs flex items-center justify-between px-4 transition-all shadow-lg cursor-pointer"
                  >
                    <span className="truncate max-w-[220px]">
                      🔨 {selectedPlot.stage === 0
                        ? `Start ${currentStageDetails.shortName}`
                        : selectedPlot.stage === 1
                        ? `Build ${currentStageDetails.shortName}`
                        : `Complete ${currentStageDetails.shortName} (+${activeCfg.completionExp} EXP)`}
                    </span>
                    <span className="bg-emerald-900 text-white px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
                      ₹{currentStageCost}
                    </span>
                  </button>
                  {availableFundsForBuild < currentStageCost && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="w-full mt-2 py-2 text-[11px] text-emerald-400 hover:underline font-semibold text-center"
                    >
                      + Deposit savings (Need ₹{currentStageCost - availableFundsForBuild} more)
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                  <span className="text-xs font-bold text-emerald-400">
                    ⭐ Fully Built Landmark Generating +{activeCfg.dailyExp} EXP/day!
                  </span>
                </div>
              )}
            </div>
          </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* 5. COMPLETE TRANSACTION MODAL                                     */}
      {/* ================================================================= */}
      <TransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        user={user}
        onAddTransaction={onAddTransaction || ((tx) => onAddSavings(tx.amount, tx.description))}
      />
    </div>
  );
};
