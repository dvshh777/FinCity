import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Pencil,
  Wallet,
  PieChart,
  User,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Zap,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { UserState } from '../types';
import { NovaGuide } from './NovaGuide';

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserState;
  onSave: (updates: {
    name: string;
    tag: string;
    monthlyIncome: number;
    budgetNeeds: number;
    budgetWants: number;
    budgetSavings: number;
  }) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  // Local editable state (City ID/tag is permanent and NOT changeable)
  const [name, setName] = useState<string>(user.name || '');
  const [income, setIncome] = useState<number>(user.monthlyIncome || 25000);
  const [needs, setNeeds] = useState<number>(user.budgetNeeds || 12500);
  const [wants, setWants] = useState<number>(user.budgetWants || 7500);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const cityId = user.tag || '@ABHI2037';

  // Sync state whenever modal opens or user updates
  useEffect(() => {
    if (isOpen) {
      setName(user.name || '');
      setIncome(user.monthlyIncome || 25000);
      setNeeds(user.budgetNeeds || Math.round((user.monthlyIncome || 25000) * 0.5));
      setWants(user.budgetWants || Math.round((user.monthlyIncome || 25000) * 0.3));
      setSaveSuccess(false);
    }
  }, [isOpen, user]);

  // Calculations for budget split
  const totalIncome = Math.max(1, income);
  const savings = totalIncome - needs - wants;
  const isOverBudget = savings < 0;
  const overBudgetAmount = Math.abs(savings);

  const needsPct = Math.min(100, Math.round((Math.max(0, needs) / totalIncome) * 100));
  const wantsPct = Math.min(100, Math.round((Math.max(0, wants) / totalIncome) * 100));
  const savingsPct = Math.max(0, Math.min(100, Math.round((Math.max(0, savings) / totalIncome) * 100)));

  // Preset Budget Rules
  const handleApplyPreset = (needsRatio: number, wantsRatio: number) => {
    const newNeeds = Math.round(totalIncome * needsRatio);
    const newWants = Math.round(totalIncome * wantsRatio);
    setNeeds(newNeeds);
    setWants(newWants);
  };

  // Quick Income adjustments
  const handleIncomeChange = (newInc: number) => {
    const safeInc = Math.max(1000, newInc);
    // Keep proportional ratio
    const currentNeedsRatio = needs / totalIncome || 0.5;
    const currentWantsRatio = wants / totalIncome || 0.3;
    setIncome(safeInc);
    setNeeds(Math.round(safeInc * currentNeedsRatio));
    setWants(Math.round(safeInc * currentWantsRatio));
  };

  const handleSave = () => {
    const cleanName = name.trim() || user.name || 'Citizen';
    const finalSavings = totalIncome - needs - wants;

    onSave({
      name: cleanName,
      tag: cityId, // City ID is permanent and remains unchanged
      monthlyIncome: totalIncome,
      budgetNeeds: needs,
      budgetWants: wants,
      budgetSavings: finalSavings,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-[370px] max-h-[90vh] flex flex-col bg-stone-900 border border-stone-700/80 rounded-3xl shadow-2xl overflow-hidden text-stone-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-800 bg-stone-950/60">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Pencil className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit',sans-serif] leading-tight">
                  Edit Profile & Budget
                </h3>
                <p className="text-[10px] text-stone-400">
                  Window 10 • Citizen Identity & Finances
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
            {/* Identity Preview Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-950/70 border border-stone-800/80">
              <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-stone-900 font-bold overflow-hidden flex-shrink-0 shadow-sm">
                <NovaGuide size="sm" expression="happy" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {name || 'Citizen'}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-emerald-400 font-mono font-medium truncate">
                    {cityId}
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-[9px] font-sans font-medium text-stone-400 select-none">
                    <Lock className="w-2.5 h-2.5 text-stone-400" />
                    Permanent ID
                  </span>
                </div>
                <div className="text-[9px] text-stone-400 mt-0.5">
                  Level {user.level || 1} City Builder
                </div>
              </div>
            </div>

            {/* SECTION 1: USERNAME & CITY ID */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <User className="w-3 h-3 text-emerald-400" />
                  <span>Username & City ID</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-stone-400 block mb-1">
                    Username (Editable)
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Abhishek"
                    maxLength={20}
                    className="w-full px-3 py-2 rounded-xl bg-stone-800/90 border border-stone-700 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 mb-1 flex items-center justify-between">
                    <span>City ID</span>
                    <span className="text-[9px] text-stone-500 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5 text-stone-500" />
                      Locked
                    </span>
                  </span>
                  <div
                    className="w-full px-3 py-2 rounded-xl bg-stone-900/90 border border-stone-800 text-xs font-mono font-bold text-emerald-400/90 flex items-center justify-between cursor-not-allowed select-none"
                    title="City ID is permanent and cannot be changed"
                  >
                    <span>{cityId}</span>
                    <Lock className="w-3.5 h-3.5 text-stone-500" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-stone-500 flex items-center gap-1.5 italic">
                <Lock className="w-3 h-3 text-stone-500 flex-shrink-0" />
                <span>City ID is permanent and cannot be changed.</span>
              </p>
            </div>

            {/* SECTION 2: MONTHLY INCOME */}
            <div className="space-y-2.5 pt-1 border-t border-stone-800/60">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Wallet className="w-3 h-3 text-emerald-400" />
                  <span>Monthly Income Pool</span>
                </label>
                <span className="text-[10px] text-stone-400 font-mono">
                  ₹{income.toLocaleString('en-IN')}/mo
                </span>
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-3 text-sm font-bold text-stone-400 select-none">
                  ₹
                </span>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={income}
                  onChange={(e) => handleIncomeChange(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-800/90 border border-stone-700 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Quick Income Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                {[5000, 15000, 25000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleIncomeChange(amt)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                      income === amt
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-stone-800/60 border-stone-700/80 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleIncomeChange(income + 5000)}
                  className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-stone-800/80 hover:bg-stone-750 border border-stone-700 text-stone-300 cursor-pointer"
                  title="Add ₹5,000"
                >
                  +5k
                </button>
              </div>
            </div>

            {/* SECTION 3: MONTHLY BUDGET SPLIT */}
            <div className="space-y-3 pt-1 border-t border-stone-800/60">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <PieChart className="w-3 h-3 text-emerald-400" />
                  <span>Monthly Budget Split</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(0.5, 0.3)}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>50/30/20 Rule</span>
                </button>
              </div>

              {/* Segmented Color Allocation Bar */}
              <div className="space-y-1">
                <div className="h-3 w-full bg-stone-800 rounded-full overflow-hidden flex border border-stone-700/60">
                  <div
                    style={{ width: `${Math.min(100, needsPct)}%` }}
                    className="bg-rose-500 transition-all duration-200"
                    title={`Needs: ${needsPct}%`}
                  />
                  <div
                    style={{ width: `${Math.min(100 - needsPct, wantsPct)}%` }}
                    className="bg-amber-500 transition-all duration-200"
                    title={`Wants: ${wantsPct}%`}
                  />
                  <div
                    style={{
                      width: `${Math.max(0, Math.min(100 - needsPct - wantsPct, savingsPct))}%`,
                    }}
                    className="bg-emerald-500 transition-all duration-200"
                    title={`Savings: ${savingsPct}%`}
                  />
                </div>

                {/* Percentage Pills Legend */}
                <div className="flex items-center justify-between text-[10px] px-0.5">
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Needs: {needsPct}%
                  </span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Wants: {wantsPct}%
                  </span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      isOverBudget ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                    />
                    Savings: {savingsPct}%
                  </span>
                </div>
              </div>

              {/* Needs Input & Slider */}
              <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-rose-300 flex items-center gap-1">
                    <span>Needs</span>
                    <span className="text-[9px] text-stone-500 font-normal">
                      (Rent, Food, Bills)
                    </span>
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-stone-400 text-[10px]">₹</span>
                    <input
                      type="number"
                      min={0}
                      max={totalIncome}
                      step={250}
                      value={needs}
                      onChange={(e) => setNeeds(Math.max(0, Number(e.target.value)))}
                      className="w-20 px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-white font-bold text-[11px] text-right focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={totalIncome}
                  step={250}
                  value={needs}
                  onChange={(e) => setNeeds(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Wants Input & Slider */}
              <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-amber-300 flex items-center gap-1">
                    <span>Wants</span>
                    <span className="text-[9px] text-stone-500 font-normal">
                      (Dining, Fun, Tech)
                    </span>
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-stone-400 text-[10px]">₹</span>
                    <input
                      type="number"
                      min={0}
                      max={totalIncome}
                      step={250}
                      value={wants}
                      onChange={(e) => setWants(Math.max(0, Number(e.target.value)))}
                      className="w-20 px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-white font-bold text-[11px] text-right focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={totalIncome}
                  step={250}
                  value={wants}
                  onChange={(e) => setWants(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Savings Card (Auto-Calculated Balance) */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  isOverBudget
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isOverBudget ? (
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-[11px] block">
                      {isOverBudget ? 'Over Budget' : 'Monthly Savings Balance'}
                    </span>
                    <span className="text-[9px] opacity-80 block">
                      {isOverBudget
                        ? `Exceeds income by ₹${overBudgetAmount.toLocaleString('en-IN')}`
                        : `Allocated to City Expansion & Wealth`}
                    </span>
                  </div>
                </div>
                <div className="text-right font-extrabold font-['Outfit',sans-serif]">
                  <span
                    className={`text-sm ${
                      isOverBudget ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {isOverBudget
                      ? `-₹${overBudgetAmount.toLocaleString('en-IN')}`
                      : `₹${savings.toLocaleString('en-IN')}`}
                  </span>
                  <span className="block text-[9px] opacity-70">
                    {savingsPct}% of pool
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyPreset(0.5, 0.3)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-stone-800 hover:bg-stone-750 border border-stone-700 text-[10px] font-semibold text-stone-300 hover:text-white transition-all text-center cursor-pointer"
                >
                  Balanced (50/30/20)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(0.4, 0.2)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-stone-800 hover:bg-stone-750 border border-stone-700 text-[10px] font-semibold text-stone-300 hover:text-white transition-all text-center cursor-pointer"
                >
                  Aggressive (40/20/40)
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-3.5 sm:p-4 border-t border-stone-800 bg-stone-950/80 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim() || isOverBudget}
              className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-950" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                  <span>Save & Apply</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
