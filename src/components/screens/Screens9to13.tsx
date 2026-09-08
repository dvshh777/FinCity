import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Zap,
  Heart,
  Home,
  CheckSquare,
  Receipt,
  Plus,
  Users,
  User,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Building,
  Target,
  Pencil,
} from 'lucide-react';
import { IsometricCity } from '../IsometricCity';
import { FloatingIslandMap } from '../FloatingIslandMap';
import { NovaGuide } from '../NovaGuide';
import { EditProfileModal } from '../EditProfileModal';
import { MobileTab, UserState, BuildingPlot } from '../../types';
import { INITIAL_BUILDINGS } from '../../data/mockData';
import {
  getNextStageCost,
  getNextStageDetails,
  getBuildingConfig,
  BUILDING_TIER_CONFIGS,
  BuildingStyle,
} from '../../utils/buildingPricing';

// Top Status Bar for Mobile Dashboard
export const MobileStatusBar: React.FC<{
  name: string;
  tag: string;
  level: number;
  exp: number;
  hearts: number;
  animatingRewards?: boolean;
  user?: UserState;
  onUpdateProfile?: (updates: { name: string; tag: string; monthlyIncome: number; budgetNeeds: number; budgetWants: number; budgetSavings: number; }) => void;
  onUpgradePlot?: (plotId: string, cost: number) => void;
}> = ({
  name,
  tag,
  level,
  exp,
  hearts,
  animatingRewards = false,
  user,
  onUpdateProfile,
  onUpgradePlot,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const currentUser: UserState = user || {
    name: name || 'Citizen',
    tag: tag || '@ABHI2037',
    selectedAssistantId: 'nova',
    monthlyIncome: 25000,
    budgetNeeds: 12500,
    budgetWants: 7500,
    budgetSavings: 5000,
    selectedGoalId: 'house',
    goals: [],
    totalSavings: 0,
    level: level || 1,
    exp: exp || 10,
    hearts: hearts || 0,
    buildingsCount: 0,
    buildings: [],
    transactions: [],
    quests: [],
    squad: [],
  };

  const handleSaveProfile = (updates: {
    name: string;
    tag: string;
    monthlyIncome: number;
    budgetNeeds: number;
    budgetWants: number;
    budgetSavings: number;
  }) => {
    if (onUpdateProfile) {
      onUpdateProfile(updates);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-white z-20">
        {/* User info & Profile Bar Edit Trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 text-left group p-1 -m-1 rounded-xl hover:bg-stone-800/90 active:bg-stone-800 transition-all cursor-pointer select-none"
            title="Edit Username, Monthly Income & Budget Split"
            aria-label="Edit Username, Monthly Income and Budget Split"
          >
            <div className="relative w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-stone-900 font-black text-xs shadow-sm overflow-hidden group-hover:ring-2 group-hover:ring-emerald-400 transition-all flex-shrink-0">
              <NovaGuide size="sm" expression="happy" />
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Pencil className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-stone-100 group-hover:text-emerald-300 transition-colors leading-none truncate max-w-[120px]">
                  {name || 'Citizen'}
                </span>
                <span className="p-0.5 rounded bg-stone-800 text-stone-400 group-hover:text-emerald-300 group-hover:bg-emerald-950/60 border border-stone-700 transition-all">
                  <Pencil className="w-2.5 h-2.5" />
                </span>
              </div>
              <div className="text-[10px] text-stone-400 font-medium flex items-center gap-1 leading-tight mt-0.5">
                <span className="text-emerald-400 font-mono font-semibold">{tag}</span>
                <span className="text-stone-600">•</span>
                <span>Level {level}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Stats Counters */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>{exp}</span>
            {animatingRewards && (
              <motion.span
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: -15, opacity: 1 }}
                className="text-[10px] text-amber-400 absolute font-extrabold"
              >
                +10
              </motion.span>
            )}
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>{hearts}</span>
            {animatingRewards && (
              <motion.span
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: -15, opacity: 1 }}
                className="text-[10px] text-rose-400 absolute font-extrabold"
              >
                +50
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile & Budget Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={currentUser}
        onSave={handleSaveProfile}
      />
    </>
  );
};

// Bottom Navigation Bar for Mobile Dashboard
export const MobileBottomNav: React.FC<{
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  onAddClick?: () => void;
}> = ({ activeTab, onChangeTab, onAddClick }) => {
  return (
    <div className="flex items-center justify-around py-2 px-3 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 text-stone-400 z-20">
      <button
        onClick={() => onChangeTab('city')}
        className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
          activeTab === 'city' ? 'text-emerald-400 font-bold' : 'hover:text-stone-300'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">City</span>
      </button>

      <button
        onClick={() => onChangeTab('transactions')}
        className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
          activeTab === 'transactions' || activeTab === 'quests' ? 'text-emerald-400 font-bold' : 'hover:text-stone-300'
        }`}
      >
        <Receipt className="w-5 h-5" />
        <span className="text-[10px]">Ledger</span>
      </button>

      {/* Floating Plus Action Button */}
      <button
        onClick={onAddClick || (() => onChangeTab('add'))}
        className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-stone-900 transition-transform active:scale-95"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      <button
        onClick={() => onChangeTab('squad')}
        className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
          activeTab === 'squad' ? 'text-emerald-400 font-bold' : 'hover:text-stone-300'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px]">Friends</span>
      </button>

      <button
        onClick={() => onChangeTab('profile')}
        className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
          activeTab === 'profile' ? 'text-emerald-400 font-bold' : 'hover:text-stone-300'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Profile</span>
      </button>
    </div>
  );
};

// =========================================================================
// SCREEN 9: EMPTY CITY (DASHBOARD BEFORE FIRST SAVE)
// =========================================================================
interface EmptyCityScreenProps {
  user: UserState;
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  onPromptFirstSave: () => void;
  onUpdateProfile?: (updates: { name: string; tag: string; monthlyIncome: number; budgetNeeds: number; budgetWants: number; budgetSavings: number; }) => void;
  onUpgradePlot?: (plotId: string, cost: number, customName?: string, buildingStyle?: BuildingStyle, districtId?: string, squadGoalId?: string) => void;
  onRenamePlot?: (plotId: string, newName: string, districtId?: string) => void;
}

export const EmptyCityScreen: React.FC<EmptyCityScreenProps> = ({
  user,
  activeTab,
  onChangeTab,
  onPromptFirstSave,
  onUpdateProfile,
  onUpgradePlot,
  onRenamePlot,
}) => {
  const [activeDistrictForGrid, setActiveDistrictForGrid] = useState<any | null>(null);
  const [activeDistrictCityMode, setActiveDistrictCityMode] = useState<'personal' | 'group'>('personal');
  const [activeDistrictSquadGoalId, setActiveDistrictSquadGoalId] = useState<string | undefined>(undefined);
  const [selectedPlot, setSelectedPlot] = useState<BuildingPlot | null>(null);
  const [customBuildingName, setCustomBuildingName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<BuildingStyle>('cottage');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  const [showDragTip, setShowDragTip] = useState(true);

  const activeGroupGoal = user.squadGoals?.find((g) => g.id === activeDistrictSquadGoalId);
  const isGroupModeGrid = activeDistrictCityMode === 'group' && !!activeGroupGoal;
  const availableFundsForBuild = isGroupModeGrid
    ? (activeGroupGoal?.availableBuildFunds ?? 0)
    : user.availableBuildFunds;

  // Show drag tip popup once for 4 seconds on initial load, then disappear
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDragTip(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Synchronize input fields when selected plot changes
  const handleSelectPlot = (plot: BuildingPlot) => {
    setSelectedPlot(plot);
    setIsRenaming(false);
    if (plot.stage === 0) {
      setCustomBuildingName('');
      setSelectedStyle(plot.buildingStyle || 'cottage');
    } else {
      setRenameInput(plot.name);
      setSelectedStyle(plot.buildingStyle || 'cottage');
    }
  };

  const activeConfig = getBuildingConfig(selectedStyle || selectedPlot?.buildingStyle || selectedPlot);
  const currentStageCost = selectedPlot ? getNextStageCost(selectedPlot, selectedStyle) : 50;
  const currentStageDetails = selectedPlot ? getNextStageDetails(selectedPlot, selectedStyle) : activeConfig.stages[0];

  const handleUpgrade = (cost: number) => {
    if (selectedPlot && onUpgradePlot && activeDistrictForGrid) {
      const finalName = customBuildingName.trim() || (selectedPlot.name.startsWith('Available Plot') ? activeConfig.name : selectedPlot.name);
      onUpgradePlot(
        selectedPlot.id,
        cost,
        finalName,
        selectedStyle,
        activeDistrictForGrid.id,
        isGroupModeGrid ? activeDistrictSquadGoalId : undefined
      );
      
      const isFinished = selectedPlot.stage === 2;
      confetti({
        particleCount: isFinished ? 150 : 60,
        spread: isFinished ? 100 : 60,
        origin: { y: 0.6 },
        colors: isFinished ? ['#10b981', '#34d399', '#fcd34d', '#38bdf8'] : ['#f59e0b', '#d97706', '#fbbf24']
      });

      setSelectedPlot(null);
    }
  };

  const handleSaveRename = () => {
    if (selectedPlot && onRenamePlot && renameInput.trim() && activeDistrictForGrid) {
      onRenamePlot(selectedPlot.id, renameInput.trim(), activeDistrictForGrid.id);
      setIsRenaming(false);
      setSelectedPlot({ ...selectedPlot, name: renameInput.trim() });
    }
  };

  const buildingStyleOptions = (Object.keys(BUILDING_TIER_CONFIGS) as BuildingStyle[]).map((key) => {
    const cfg = BUILDING_TIER_CONFIGS[key];
    return {
      id: cfg.id,
      name: cfg.name,
      icon: cfg.icon,
      tag: cfg.tag,
      baseCost: cfg.stages[0].cost,
      totalCost: cfg.totalCost,
      rewardExp: cfg.completionExp,
      desc: cfg.description,
      accent: cfg.accent,
    };
  });

  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-950 overflow-hidden">
      {/* Top Status Bar */}
      <MobileStatusBar
        name={user.name}
        tag={user.tag}
        level={user.level || 1}
        exp={user.exp || 120}
        hearts={user.hearts || 0}
        user={user}
        onUpdateProfile={onUpdateProfile}
      />

      {/* Main gamified canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {!activeDistrictForGrid ? (
          <FloatingIslandMap
            user={user}
            isMobile={true}
            onUpgradePlot={onUpgradePlot}
            onAddSavings={(amt, desc) => {
              if (onPromptFirstSave) onPromptFirstSave();
            }}
            onEnterDistrict={(district, mode, squadGoalId) => {
              setActiveDistrictForGrid(district);
              setActiveDistrictCityMode(mode || 'personal');
              setActiveDistrictSquadGoalId(squadGoalId);
            }}
          />
        ) : (
          <div className="flex-1 w-full h-full relative flex flex-col">
            {/* District Plot Grid Header Bar */}
            <div className="absolute top-3 left-3 z-30 flex items-center gap-2 bg-stone-900/90 backdrop-blur-md py-1.5 px-3 rounded-2xl border border-stone-700 shadow-xl">
              <button
                onClick={() => setActiveDistrictForGrid(null)}
                className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-bold transition-all cursor-pointer"
              >
                ← Back to 3D World
              </button>
              <span className="text-[11px] font-bold text-emerald-400 truncate max-w-[120px]">
                🏗️ {activeDistrictForGrid.name} ({isGroupModeGrid ? `Group: ${activeGroupGoal?.title}` : 'Personal'})
              </span>
            </div>

            <div className="absolute top-3 right-3 bg-stone-900/90 px-3.5 py-1.5 rounded-2xl border border-stone-700 shadow-xl backdrop-blur-md z-30 flex flex-col items-center">
              <span className="text-[9px] text-stone-400 font-bold tracking-wider">FUNDS</span>
              <span className="text-base text-emerald-400 font-extrabold tracking-tight">₹{availableFundsForBuild.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex-1 w-full h-full pt-14">
              <IsometricCity 
                mode="interactive" 
                districtId={activeDistrictForGrid.id}
                buildings={
                  isGroupModeGrid && activeGroupGoal
                    ? (activeGroupGoal.buildings || INITIAL_BUILDINGS.map((b) => ({ ...b, id: `group_${activeGroupGoal.id}_${b.id}` })))
                    : (user.districtBuildings?.[activeDistrictForGrid.id] || user.buildings || INITIAL_BUILDINGS)
                }
                selectedPlotId={selectedPlot?.id}
                onSelectPlot={handleSelectPlot}
              />
            </div>
          </div>
        )}

        {/* Build & Customization Drawer */}
        <AnimatePresence>
          {selectedPlot && (
            <motion.div
              initial={{ y: 260, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 260, opacity: 0 }}
              className="absolute bottom-6 left-4 right-4 z-20"
            >
              <div className="p-4 rounded-3xl bg-stone-900/95 backdrop-blur-xl text-stone-100 shadow-2xl border border-stone-700 max-h-[72vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-3 border-b border-stone-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {selectedPlot.stage === 0 ? '🏗️' : selectedPlot.stage === 3 ? '⭐' : '🔨'}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-base text-white font-['Outfit',sans-serif]">
                        {selectedPlot.stage === 0 ? 'Available Plot (Ready to Build)' : selectedPlot.name}
                      </h3>
                      <p className="text-[11px] text-stone-400">
                        {selectedPlot.stage === 0
                          ? 'Choose a custom name & architectural style'
                          : `Stage ${selectedPlot.stage} of 3 • ${selectedPlot.stage === 3 ? 'Completed' : 'Under Construction'}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPlot(null)}
                    className="w-7 h-7 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white"
                  >
                    &times;
                  </button>
                </div>

                {/* STAGE 0: Name & Architectural Style Selector */}
                {selectedPlot.stage === 0 && (
                  <div className="space-y-3 mb-4">
                    {/* Custom Name Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1">
                        1. Name Your Building
                      </label>
                      <input
                        type="text"
                        value={customBuildingName}
                        onChange={(e) => setCustomBuildingName(e.target.value)}
                        placeholder="e.g., Midnight Haven, Cozy Cafe, Grand Villa..."
                        className="w-full px-3.5 py-2.5 bg-stone-800/90 border border-stone-700 rounded-xl text-xs font-semibold text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                      />
                      {/* Quick Name Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {[
                          'Grand Bank',
                          'Corner Books',
                          'Infinity Villa',
                          'EV Solar Plaza',
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
                            className="px-2 py-0.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-[10px] font-medium text-stone-300 border border-stone-700/60"
                          >
                            + {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Building Style Selector Cards */}
                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1.5">
                        2. Choose Architectural Style & Tier
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {buildingStyleOptions.map((st) => {
                          const isPicked = selectedStyle === st.id;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => setSelectedStyle(st.id)}
                              className={`p-2.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                                isPicked
                                  ? `${st.accent} ring-2 ring-emerald-400/50 shadow-lg`
                                  : 'border-stone-800 bg-stone-800/40 hover:bg-stone-800/80 text-stone-300'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xl">{st.icon}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-stone-900/80 font-mono font-bold text-emerald-400 border border-emerald-500/20">
                                  Base: ₹{st.baseCost}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-white leading-tight mb-0.5">
                                {st.name}
                              </span>
                              <div className="flex items-center justify-between text-[9px] text-stone-400 mt-0.5">
                                <span className="text-stone-300 font-semibold">{st.tag}</span>
                                <span className="text-amber-300 font-bold">+{st.rewardExp} EXP</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGES 1, 2, 3: Inspector / Renaming */}
                {selectedPlot.stage > 0 && (
                  <div className="space-y-3 mb-4">
                    {isRenaming ? (
                      <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700">
                        <label className="block text-[10px] font-bold text-stone-400 mb-1">
                          Rename Building
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white"
                          />
                          <button
                            onClick={handleSaveRename}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsRenaming(false)}
                            className="px-2 py-1.5 text-stone-400 hover:text-white text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-stone-800/60 rounded-2xl border border-stone-800">
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            {selectedPlot.name}
                          </div>
                          <div className="text-[10px] text-emerald-400 font-semibold">
                            +{activeConfig.dailyExp} EXP/day generated • {activeConfig.tag}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setRenameInput(selectedPlot.name);
                            setIsRenaming(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 text-[10px] font-semibold"
                        >
                          ✏️ Rename
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 3-STAGE CONSTRUCTION ROADMAP & PRICING BREAKDOWN */}
                <div className="mb-3.5 p-2.5 bg-stone-950/80 rounded-2xl border border-stone-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold px-1">
                    <span>CONSTRUCTION STAGES</span>
                    <span className="text-stone-300 font-mono">
                      Total: ₹{activeConfig.totalCost}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {activeConfig.stages.map((stg) => {
                      const isDone = (selectedPlot.stage || 0) >= stg.stage;
                      const isCurrent = (selectedPlot.stage || 0) === stg.stage - 1;
                      return (
                        <div
                          key={stg.stage}
                          className={`p-1.5 rounded-xl border text-center transition-all ${
                            isDone
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                              : isCurrent
                              ? 'bg-amber-500/15 border-amber-400/50 text-amber-200 shadow-sm'
                              : 'bg-stone-900/60 border-stone-800 text-stone-500'
                          }`}
                        >
                          <div className="text-[9px] font-extrabold truncate">
                            {isDone ? '✓ ' : ''}{stg.shortName}
                          </div>
                          <div className={`text-[10px] font-black font-mono mt-0.5 ${isCurrent ? 'text-amber-300' : isDone ? 'text-emerald-400' : 'text-stone-400'}`}>
                            ₹{stg.cost}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedPlot.stage < 3 ? (
                  <div>
                    <button
                      onClick={() => handleUpgrade(currentStageCost)}
                      disabled={user.availableBuildFunds < currentStageCost}
                      className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold rounded-2xl flex items-center justify-between disabled:opacity-40 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      <span className="flex items-center gap-1.5 text-xs truncate max-w-[210px]">
                        🔨 {selectedPlot.stage === 0
                          ? `Start ${currentStageDetails.shortName}`
                          : selectedPlot.stage === 1
                          ? `Build ${currentStageDetails.shortName}`
                          : `Finish ${currentStageDetails.shortName} (+${activeConfig.completionExp} EXP)`}
                      </span>
                      <span className="bg-emerald-900 text-white px-2.5 py-1 rounded-xl text-xs font-bold font-mono">
                        ₹{currentStageCost}
                      </span>
                    </button>
                    {user.availableBuildFunds < currentStageCost && (
                      <p className="text-[10px] text-rose-400 text-center mt-2 font-semibold">
                        Need ₹{currentStageCost - user.availableBuildFunds} more build funds. Tap &apos;Add Savings&apos; to deposit!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center">
                    <p className="text-xs font-bold text-emerald-300">
                      🎉 {selectedPlot.name} is fully constructed & yielding +{activeConfig.dailyExp} EXP/day!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Default message if no plot selected - shown once on load then disappears */}
        <AnimatePresence>
          {!selectedPlot && showDragTip && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-6 left-6 right-6 z-10 cursor-pointer"
              onClick={() => setShowDragTip(false)}
            >
              <div className="p-3.5 rounded-2xl bg-stone-900/95 text-stone-100 shadow-xl border border-stone-700 text-center">
                <p className="text-xs font-bold text-stone-200 leading-snug">
                  Drag to explore island! <br />
                  <span className="text-emerald-400 font-semibold">
                    Tap any plot to name & pick your building style.
                  </span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onChangeTab={onChangeTab}
        onAddClick={onPromptFirstSave}
      />
    </div>
  );
};

// =========================================================================
// SCREEN 10: FIRST SAVE PROMPT MODAL / SHEET
// =========================================================================
interface FirstSavePromptScreenProps {
  user: UserState;
  saveAmount: number;
  onChangeSaveAmount: (val: number) => void;
  onSaveNow: () => void;
  onMaybeLater: () => void;
}

export const FirstSavePromptScreen: React.FC<FirstSavePromptScreenProps> = ({
  user,
  saveAmount,
  onChangeSaveAmount,
  onSaveNow,
  onMaybeLater,
}) => {
  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-950 overflow-hidden">
      {/* Top Status Bar */}
      <MobileStatusBar
        name={user.name}
        tag={user.tag}
        level={1}
        exp={user.exp || 10}
        hearts={0}
      />

      {/* Dimmed City in background */}
      <div className="relative flex-1 w-full h-full opacity-30">
        <IsometricCity mode={user.totalSavings > 0 ? "interactive" : "empty"} buildings={user.buildings} />
      </div>

      {/* Bottom Sheet / Modal Overlay */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute bottom-0 inset-x-0 bg-stone-900 border-t border-stone-800 rounded-t-3xl p-6 shadow-2xl z-30 flex flex-col items-center text-center"
      >
        {/* Grab indicator */}
        <div className="w-10 h-1 rounded-full bg-stone-700 mb-4" />

        {/* Dialog with Nova */}
        <div className="flex items-center gap-3 mb-4 text-left">
          <NovaGuide size="md" expression="wave" />
          <div className="bg-stone-800 p-3 rounded-2xl border border-stone-700">
            <p className="text-xs text-stone-200 leading-relaxed">
              {user.totalSavings === 0 ? (
                <>
                  <span className="font-bold text-white">Let&apos;s build your first house!</span> <br />
                  Try saving a small amount to get started. Even ₹5 makes a difference!
                </>
              ) : (
                <>
                  <span className="font-bold text-white">Keep up the great work!</span> <br />
                  Deposit savings to earn Build Funds and expand your city.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Currency Input & Presets */}
        <div className="w-full max-w-[260px] my-3">
          <div className="relative flex items-center justify-center">
            <span className="absolute left-6 text-2xl font-bold text-stone-400 select-none">
              ₹
            </span>
            <input
              type="text"
              value={saveAmount}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, '');
                onChangeSaveAmount(Number(raw) || 0);
              }}
              className="w-full py-3.5 pl-14 pr-6 rounded-2xl bg-stone-800 border border-stone-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white font-bold text-2xl text-center outline-none"
            />
          </div>

          <div className="flex gap-2 justify-center mt-2">
            {[5, 10, 50, 100].map((amt) => (
              <button
                key={amt}
                onClick={() => onChangeSaveAmount(amt)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  saveAmount === amt
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-stone-800 border-stone-700 text-stone-400'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSaveNow}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all text-base mt-2"
        >
          Save Now
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <button
          onClick={onMaybeLater}
          className="mt-3 text-xs text-stone-400 hover:text-stone-200 transition-colors font-semibold"
        >
          Maybe later
        </button>
      </motion.div>
    </div>
  );
};

// =========================================================================
// SCREEN 11: BUILDING ANIMATION SCREEN
// =========================================================================
interface BuildingAnimationScreenProps {
  user: UserState;
  onAnimationComplete: () => void;
}

export const BuildingAnimationScreen: React.FC<BuildingAnimationScreenProps> = ({
  user,
  onAnimationComplete,
}) => {
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onAnimationComplete(), 600);
          return 100;
        }
        return prev + 15;
      });
    }, 450);

    return () => clearInterval(timer);
  }, [onAnimationComplete]);

  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-950 overflow-hidden">
      {/* Top Status Bar with Animating Rewards */}
      <MobileStatusBar
        name={user.name}
        tag={user.tag}
        level={1}
        exp={user.exp || 10}
        hearts={50}
        animatingRewards={true}
      />

      {/* Main Isometric Canvas with active construction scaffolding */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <IsometricCity mode="constructing" buildings={user.buildings} constructionProgress={progress} />

        {/* Building Progress HUD Banner */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="p-4 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-800 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                Building your first house...
              </span>
              <span className="text-xs font-extrabold text-emerald-400">
                {progress}%
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SCREEN 12: FIRST HOUSE COMPLETED CELEBRATION MODAL
// =========================================================================
interface HouseCompletedModalProps {
  user: UserState;
  onAwesome: () => void;
}

export const HouseCompletedModal: React.FC<HouseCompletedModalProps> = ({
  user,
  onAwesome,
}) => {
  useEffect(() => {
    // Fire festive confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#38bdf8', '#facc15', '#f43f5e'],
    });
  }, []);

  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-950 overflow-hidden">
      {/* Top Status Bar */}
      <MobileStatusBar
        name={user.name}
        tag={user.tag}
        level={1}
        exp={user.exp || 10}
        hearts={50}
      />

      {/* Built Single Cottage Canvas */}
      <div className="relative flex-1 w-full h-full">
        <IsometricCity mode="built-single" buildings={user.buildings} />
      </div>

      {/* Celebratory Completion Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="absolute bottom-6 left-6 right-6 bg-stone-900/95 backdrop-blur-md rounded-3xl p-5 border border-emerald-500/30 shadow-2xl text-center z-30"
      >
        <div className="text-2xl mb-1">🎉</div>
        <h3 className="text-xl font-black font-['Outfit',sans-serif] text-stone-100 mb-1">
          House Built!
        </h3>
        <p className="text-xs text-stone-300 mb-5 leading-relaxed">
          Your city is growing. <br />
          Keep saving to unlock more!
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAwesome}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all text-base"
        >
          Awesome!
        </motion.button>
      </motion.div>
    </div>
  );
};

// =========================================================================
// SCREEN 13: DASHBOARD (AFTER FIRST HOUSE BUILT)
// =========================================================================
interface DashboardAfterScreenProps {
  user: UserState;
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  onAddClick: () => void;
  onUpdateProfile?: (updates: { name: string; tag: string; monthlyIncome: number; budgetNeeds: number; budgetWants: number; budgetSavings: number; }) => void;
  onUpgradePlot?: (plotId: string, cost: number) => void;
}

export const DashboardAfterScreen: React.FC<DashboardAfterScreenProps> = ({
  user,
  activeTab,
  onChangeTab,
  onAddClick,
  onUpdateProfile,
  onUpgradePlot,
}) => {
  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-950 overflow-hidden">
      {/* Top Status Bar */}
      <MobileStatusBar
        name={user.name}
        tag={user.tag}
        level={1}
        exp={user.exp || 10}
        hearts={user.hearts || 50}
        user={user}
        onUpdateProfile={onUpdateProfile}
      />

      {/* Main City View with built house */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <IsometricCity mode="interactive" buildings={user.buildings} />

        {/* Bottom Metrics Pill Card (Exact match to Screen 13) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-4 left-4 right-4 z-10"
        >
          <div className="p-3.5 rounded-2xl bg-white text-stone-900 shadow-2xl border border-stone-200 flex items-center justify-around divide-x divide-stone-200">
            {/* Total Savings */}
            <div className="flex flex-col items-center px-2">
              <span className="text-base font-extrabold text-stone-900 font-['Outfit',sans-serif]">
                ₹ {user.totalSavings || 10}
              </span>
              <span className="text-[10px] text-stone-500 font-semibold">
                Total Savings
              </span>
            </div>

            {/* Buildings */}
            <div className="flex flex-col items-center px-4">
              <span className="text-base font-extrabold text-stone-900 font-['Outfit',sans-serif]">
                {user.buildingsCount || 1}
              </span>
              <span className="text-[10px] text-stone-500 font-semibold">
                Building
              </span>
            </div>

            {/* Goal Progress */}
            <div className="flex flex-col items-center px-2">
              <span className="text-base font-extrabold text-emerald-600 font-['Outfit',sans-serif]">
                0%
              </span>
              <span className="text-[10px] text-stone-500 font-semibold">
                Goal Progress
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onChangeTab={onChangeTab}
        onAddClick={onAddClick}
      />
    </div>
  );
};
