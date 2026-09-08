import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Copy,
  Check,
  Palmtree,
  Laptop,
  Bike,
  GraduationCap,
  Briefcase,
  ShieldAlert,
  PlusCircle,
  Sprout,
  Zap,
  Calendar,
  Sparkles,
  Calculator,
  AlertTriangle,
  Pencil,
} from 'lucide-react';
import { SavingsGoal } from '../../types';
import { INITIAL_GOALS } from '../../data/mockData';

// Helper for top progress bar in setup steps
export const StepProgressBar: React.FC<{
  current: number;
  total: number;
  onBack?: () => void;
}> = ({ current, total, onBack }) => (
  <div className="flex items-center justify-between pt-2 mb-3">
    <div className="flex items-center gap-2 flex-1 mr-4">
      {onBack && (
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      )}
      <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-semibold text-stone-400">
        Step {current}/{total}
      </span>
      <button className="text-stone-400 hover:text-stone-200">
        <HelpCircle className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// =========================================================================
// SCREEN 5: AGE & OCCUPATION SCREEN
// =========================================================================
interface AgeOccupationScreenProps {
  age: number;
  occupation: 'student' | 'employee';
  onChangeAge: (val: number) => void;
  onChangeOccupation: (val: 'student' | 'employee') => void;
  onBack: () => void;
  onContinue: () => void;
}

export const AgeOccupationScreen: React.FC<AgeOccupationScreenProps> = ({
  age,
  occupation,
  onChangeAge,
  onChangeOccupation,
  onBack,
  onContinue,
}) => {
  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-900 text-white p-5 overflow-y-auto">
      {/* Top Step Progress Bar (Step 1 of 4 in Financial Profile) */}
      <StepProgressBar current={1} total={4} onBack={onBack} />

      {/* Main Content */}
      <div className="my-auto flex flex-col w-full max-w-[325px] mx-auto">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold font-['Outfit',sans-serif] text-stone-100 mb-1">
            Tell us about you
          </h2>
          <p className="text-xs text-stone-400">
            Customize your financial journey to your life stage.
          </p>
        </div>

        {/* Section 1: Age Input */}
        <div className="mb-5 bg-stone-800/60 border border-stone-700/70 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-stone-300">Your Age</label>
            <span className="text-[11px] text-emerald-400 font-semibold">
              {age ? `${age} years old` : 'Enter age'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onChangeAge(Math.max(10, age - 1))}
              className="w-10 h-10 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-200 font-bold text-lg flex items-center justify-center transition-colors"
            >
              -
            </button>
            <input
              type="number"
              min={10}
              max={99}
              value={age || ''}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onChangeAge(isNaN(val) ? 0 : Math.min(99, Math.max(1, val)));
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-stone-900 border border-stone-700 text-center text-xl font-extrabold text-white focus:border-emerald-400 focus:outline-none"
              placeholder="21"
            />
            <button
              onClick={() => onChangeAge(Math.min(99, (age || 17) + 1))}
              className="w-10 h-10 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-200 font-bold text-lg flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>

          {/* Quick Age Presets */}
          <div className="flex gap-1.5 mt-3 justify-between">
            {[18, 20, 22, 25, 30].map((preset) => (
              <button
                key={preset}
                onClick={() => onChangeAge(preset)}
                className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                  age === preset
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-stone-800 border-stone-700/60 text-stone-400 hover:text-stone-300'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Occupation Selector */}
        <div className="space-y-2.5 mb-2">
          <label className="text-xs font-bold text-stone-300 block">
            What is your occupation?
          </label>

          {/* Student Card */}
          <button
            onClick={() => onChangeOccupation('student')}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
              occupation === 'student'
                ? 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-400/25'
                : 'bg-stone-800/70 border-stone-700/70 hover:border-stone-600'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                occupation === 'student'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-stone-900 text-stone-400'
              }`}
            >
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Student</span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    occupation === 'student'
                      ? 'border-emerald-400 bg-emerald-500'
                      : 'border-stone-600'
                  }`}
                >
                  {occupation === 'student' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />
                  )}
                </div>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-tight">
                School or college. Receives pocket money or allowance.
              </p>
            </div>
          </button>

          {/* Employee Card */}
          <button
            onClick={() => onChangeOccupation('employee')}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
              occupation === 'employee'
                ? 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-400/25'
                : 'bg-stone-800/70 border-stone-700/70 hover:border-stone-600'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                occupation === 'employee'
                  ? 'bg-teal-500/20 text-teal-300'
                  : 'bg-stone-900 text-stone-400'
              }`}
            >
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Employee</span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    occupation === 'employee'
                      ? 'border-emerald-400 bg-emerald-500'
                      : 'border-stone-600'
                  }`}
                >
                  {occupation === 'employee' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />
                  )}
                </div>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-tight">
                Working professional or salaried. Earns monthly income.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-3 pb-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          disabled={!age || age < 10}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all text-sm cursor-pointer disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

// =========================================================================
// SCREEN 6: INCOME / POCKET MONEY SCREEN
// =========================================================================
interface IncomeScreenProps {
  occupation: 'student' | 'employee';
  pocketMoneyFrequency: 'monthly' | 'weekly' | 'daily';
  pocketMoneyAmount: number;
  monthlyIncome: number;
  onChangePocketMoney: (
    frequency: 'monthly' | 'weekly' | 'daily',
    amount: number
  ) => void;
  onChangeIncome: (val: number) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const IncomeScreen: React.FC<IncomeScreenProps> = ({
  occupation,
  pocketMoneyFrequency,
  pocketMoneyAmount,
  monthlyIncome,
  onChangePocketMoney,
  onChangeIncome,
  onBack,
  onContinue,
}) => {
  // If student, calculate normalized monthly income for display
  const isStudent = occupation === 'student';

  const calculateMonthlyFromPocket = (
    freq: 'monthly' | 'weekly' | 'daily',
    amt: number
  ) => {
    if (freq === 'daily') return amt * 30;
    if (freq === 'weekly') return Math.round(amt * 4.33);
    return amt;
  };

  const studentMonthlyEquivalent = calculateMonthlyFromPocket(
    pocketMoneyFrequency,
    pocketMoneyAmount
  );

  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-900 text-white p-5 overflow-y-auto">
      {/* Top Step Progress Bar (Step 2 of 4) */}
      <StepProgressBar current={2} total={4} onBack={onBack} />

      {/* Center Content */}
      <div className="my-auto flex flex-col items-center w-full max-w-[325px] mx-auto text-center">
        {isStudent ? (
          <>
            {/* Student Pocket Money View */}
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 mx-auto">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold font-['Outfit',sans-serif] text-stone-100 mb-1">
              Your Pocket Money
            </h2>
            <p className="text-xs text-stone-400 mb-4">
              How often do you receive your allowance?
            </p>

            {/* Frequency Selector Pills: Monthly, Weekly, Daily */}
            <div className="w-full flex bg-stone-800 p-1 rounded-xl border border-stone-700/80 mb-4">
              {(['monthly', 'weekly', 'daily'] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => {
                    const defaultForFreq =
                      freq === 'daily' ? 100 : freq === 'weekly' ? 1000 : 5000;
                    onChangePocketMoney(freq, defaultForFreq);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                    pocketMoneyFrequency === freq
                      ? 'bg-emerald-500 text-stone-950 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>

            {/* Amount Input */}
            <div className="w-full relative mb-3">
              <div className="relative flex items-center justify-center">
                <span className="absolute left-5 text-2xl font-bold text-stone-400 select-none">
                  ₹
                </span>
                <input
                  type="text"
                  value={pocketMoneyAmount ? pocketMoneyAmount.toLocaleString('en-IN') : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    onChangePocketMoney(pocketMoneyFrequency, Number(raw) || 0);
                  }}
                  placeholder="0"
                  className="w-full py-3.5 pl-12 pr-5 rounded-2xl bg-stone-800 border border-stone-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white font-bold text-2xl text-center outline-none transition-all"
                />
              </div>
            </div>

            {/* Quick Presets matching chosen frequency */}
            <div className="flex gap-2 flex-wrap justify-center mb-4 w-full">
              {(pocketMoneyFrequency === 'daily'
                ? [50, 100, 200, 500]
                : pocketMoneyFrequency === 'weekly'
                ? [500, 1000, 2000, 3000]
                : [2000, 5000, 8000, 12000]
              ).map((preset) => (
                <button
                  key={preset}
                  onClick={() => onChangePocketMoney(pocketMoneyFrequency, preset)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    pocketMoneyAmount === preset
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:border-stone-600'
                  }`}
                >
                  ₹{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            {/* Monthly Equivalent Banner */}
            <div className="w-full p-3 rounded-xl bg-stone-800/80 border border-emerald-500/30 text-left flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-stone-300 leading-snug">
                <span className="font-bold text-emerald-400">
                  ≈ ₹{studentMonthlyEquivalent.toLocaleString('en-IN')} / month
                </span>{' '}
                budgeted for city development & savings goals.
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Employee Monthly Salary View */}
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center mb-2 mx-auto">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold font-['Outfit',sans-serif] text-stone-100 mb-1">
              Monthly Salary
            </h2>
            <p className="text-xs text-stone-400 mb-5">
              Enter your regular take-home monthly salary.
            </p>

            {/* Currency Input */}
            <div className="w-full relative mb-4">
              <div className="relative flex items-center justify-center">
                <span className="absolute left-6 text-2xl font-bold text-stone-400 select-none">
                  ₹
                </span>
                <input
                  type="text"
                  value={monthlyIncome ? monthlyIncome.toLocaleString('en-IN') : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    onChangeIncome(Number(raw) || 0);
                  }}
                  placeholder="25,000"
                  className="w-full py-4 pl-14 pr-6 rounded-2xl bg-stone-800 border border-stone-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white font-bold text-2xl text-center outline-none transition-all"
                />
              </div>
            </div>

            {/* Quick Presets for Employees */}
            <div className="flex gap-2 flex-wrap justify-center mb-4">
              {[25000, 50000, 75000, 100000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => onChangeIncome(preset)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    monthlyIncome === preset
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:border-stone-600'
                  }`}
                >
                  ₹{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className="w-full p-3 rounded-xl bg-stone-800/80 border border-stone-700 text-left flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <div className="text-[11px] text-stone-300 leading-snug">
                This funds your 50/30/20 budget and fuels urban city construction.
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="pt-3 pb-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          disabled={isStudent ? pocketMoneyAmount <= 0 : monthlyIncome <= 0}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all text-sm cursor-pointer disabled:cursor-not-allowed"
        >
          Continue to Budget
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

// =========================================================================
// SCREEN 7 (6TH PAGE OF ONBOARDING SETUP): BUDGET SCREEN
// Needs & Wants entered manually, Savings bar calculated automatically!
// =========================================================================
interface BudgetScreenProps {
  income: number;
  needs: number;
  wants: number;
  savings: number;
  onChangeBudget: (needs: number, wants: number, savings: number) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const BudgetScreen: React.FC<BudgetScreenProps> = ({
  income,
  needs,
  wants,
  savings,
  onChangeBudget,
  onBack,
  onContinue,
}) => {
  // SVG Donut calculation
  const total = income || 1;
  const safeNeeds = Math.max(0, needs);
  const safeWants = Math.max(0, wants);
  const safeSavings = Math.max(0, savings);

  const needsPct = Math.min(100, Math.round((safeNeeds / total) * 100));
  const wantsPct = Math.min(100, Math.round((safeWants / total) * 100));
  const savingsPct = Math.max(0, Math.min(100, Math.round((safeSavings / total) * 100)));

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const needsStroke = (needsPct / 100) * circumference;
  const wantsStroke = (wantsPct / 100) * circumference;
  const savingsStroke = (savingsPct / 100) * circumference;

  const isOverBudget = needs + wants > total;
  const overBudgetAmount = (needs + wants) - total;

  // Handlers for manual entry of Needs and Wants
  const handleNeedsChange = (val: number) => {
    const newNeeds = Math.max(0, val);
    const newSavings = total - newNeeds - wants;
    onChangeBudget(newNeeds, wants, newSavings);
  };

  const handleWantsChange = (val: number) => {
    const newWants = Math.max(0, val);
    const newSavings = total - needs - newWants;
    onChangeBudget(needs, newWants, newSavings);
  };

  const handleApply503020 = () => {
    const defNeeds = Math.round(total * 0.5);
    const defWants = Math.round(total * 0.3);
    const defSavings = total - defNeeds - defWants;
    onChangeBudget(defNeeds, defWants, defSavings);
  };

  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-900 text-white p-5 overflow-y-auto">
      {/* Top Step Progress Bar (Step 3 of 4) */}
      <StepProgressBar current={3} total={4} onBack={onBack} />

      {/* Main Content */}
      <div className="my-auto flex flex-col w-full max-w-[330px] mx-auto">
        <div className="text-center mb-3">
          <h2 className="text-2xl font-bold font-['Outfit',sans-serif] text-stone-100 mb-0.5">
            Set your budget
          </h2>
          <p className="text-xs text-stone-400">
            Total Monthly Pool:{' '}
            <span className="text-white font-bold">
              ₹{income.toLocaleString('en-IN')}
            </span>
          </p>
        </div>

        {/* Donut Chart & Reset Button */}
        <div className="flex items-center justify-between px-2 py-1 mb-3">
          <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#292524"
                strokeWidth="10"
              />
              {/* Needs Arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="10"
                strokeDasharray={`${needsStroke} ${circumference}`}
                strokeDashoffset={0}
              />
              {/* Wants Arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#f59e0b"
                strokeWidth="10"
                strokeDasharray={`${wantsStroke} ${circumference}`}
                strokeDashoffset={-needsStroke}
              />
              {/* Savings Arc */}
              {!isOverBudget && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="10"
                  strokeDasharray={`${savingsStroke} ${circumference}`}
                  strokeDashoffset={-(needsStroke + wantsStroke)}
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold text-white leading-none">
                ₹{income.toLocaleString('en-IN')}
              </span>
              <span className="text-[8px] text-stone-400">Total</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={handleApply503020}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-[11px] font-semibold text-emerald-400 transition-colors"
            >
              Reset 50 / 30 / 20
            </button>
            <span className="text-[10px] text-stone-400 text-right">
              Savings updates automatically as you type Needs & Wants
            </span>
          </div>
        </div>

        {/* Form Inputs & Visual Bars */}
        <div className="space-y-2.5 mb-2">
          {/* 1. NEEDS BAR (MANUAL ENTRY) */}
          <div className="p-3 rounded-xl bg-stone-800/90 border border-stone-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-xs font-bold text-stone-200">
                  Needs (Manual)
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  Food, Rent, Bills
                </span>
              </div>
              <span className="text-xs font-black text-red-400 font-mono">
                {needsPct}%
              </span>
            </div>

            {/* Editable Amount Input */}
            <div className="relative flex items-center mb-2">
              <span className="absolute left-3 text-sm font-bold text-stone-400">
                ₹
              </span>
              <input
                type="text"
                value={needs ? needs.toLocaleString('en-IN') : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  handleNeedsChange(Number(raw) || 0);
                }}
                placeholder="0"
                className="w-full py-1.5 pl-8 pr-3 bg-stone-900 border border-stone-700 rounded-lg text-sm font-bold text-white text-right focus:border-red-400 outline-none"
              />
            </div>

            {/* Visual Bar */}
            <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-200"
                style={{ width: `${Math.min(100, needsPct)}%` }}
              />
            </div>
          </div>

          {/* 2. WANTS BAR (MANUAL ENTRY) */}
          <div className="p-3 rounded-xl bg-stone-800/90 border border-stone-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-stone-200">
                  Wants (Manual)
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  Dining, Outings, Fun
                </span>
              </div>
              <span className="text-xs font-black text-amber-400 font-mono">
                {wantsPct}%
              </span>
            </div>

            {/* Editable Amount Input */}
            <div className="relative flex items-center mb-2">
              <span className="absolute left-3 text-sm font-bold text-stone-400">
                ₹
              </span>
              <input
                type="text"
                value={wants ? wants.toLocaleString('en-IN') : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  handleWantsChange(Number(raw) || 0);
                }}
                placeholder="0"
                className="w-full py-1.5 pl-8 pr-3 bg-stone-900 border border-stone-700 rounded-lg text-sm font-bold text-white text-right focus:border-amber-400 outline-none"
              />
            </div>

            {/* Visual Bar */}
            <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-200"
                style={{ width: `${Math.min(100, wantsPct)}%` }}
              />
            </div>
          </div>

          {/* 3. SAVINGS BAR (CALCULATED AUTOMATICALLY) */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              isOverBudget
                ? 'bg-red-500/10 border-red-500/50'
                : 'bg-emerald-500/10 border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOverBudget ? 'bg-red-400' : 'bg-emerald-400'
                  }`}
                />
                <span className="text-xs font-bold text-stone-100 flex items-center gap-1">
                  Savings
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-800 text-emerald-400 font-semibold border border-emerald-500/30">
                    Auto-Calculated
                  </span>
                </span>
              </div>
              <span
                className={`text-xs font-black font-mono ${
                  isOverBudget ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {isOverBudget ? '0%' : `${savingsPct}%`}
              </span>
            </div>

            {/* Auto-Calculated Read-Only Display */}
            <div className="flex items-center justify-between py-1.5 px-3 bg-stone-900/90 rounded-lg border border-stone-700/60 mb-2">
              <span className="text-[11px] text-stone-400 flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                Income - Needs - Wants:
              </span>
              <span
                className={`text-sm font-extrabold ${
                  isOverBudget ? 'text-red-400 line-through' : 'text-emerald-400'
                }`}
              >
                ₹ {savings.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  isOverBudget ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, savingsPct))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Warning if over-budget */}
        {isOverBudget && (
          <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/40 flex items-start gap-2 text-left mb-1">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-red-300 leading-snug">
              Needs + Wants exceed your income by ₹{overBudgetAmount.toLocaleString('en-IN')}.
              Please lower Needs or Wants to leave savings for your city!
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="pt-2 pb-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          disabled={isOverBudget || savings < 0}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all text-sm cursor-pointer disabled:cursor-not-allowed"
        >
          {isOverBudget ? 'Fix Budget to Continue' : 'Continue to Goal'}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

// =========================================================================
// SCREEN 8: SAVINGS GOAL SCREEN
// =========================================================================
interface SavingsGoalScreenProps {
  goals: SavingsGoal[];
  selectedGoalId: string;
  onSelectGoal: (id: string) => void;
  onUpdateGoalAmount: (id: string, amount: number) => void;
  onUpdateGoalName: (id: string, name: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const SavingsGoalScreen: React.FC<SavingsGoalScreenProps> = ({
  goals,
  selectedGoalId,
  onSelectGoal,
  onUpdateGoalAmount,
  onUpdateGoalName,
  onBack,
  onContinue,
}) => {
  const goalList = goals && goals.length > 0 ? goals : INITIAL_GOALS;
  const selectedGoal =
    goalList.find((g) => g.id === selectedGoalId) || goalList[0];

  const iconMap: Record<string, React.ReactNode> = {
    Palmtree: <Palmtree className="w-5 h-5 text-sky-400" />,
    Laptop: <Laptop className="w-5 h-5 text-indigo-400" />,
    Bike: <Bike className="w-5 h-5 text-amber-400" />,
    GraduationCap: <GraduationCap className="w-5 h-5 text-pink-400" />,
    ShieldAlert: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
    PlusCircle: <PlusCircle className="w-5 h-5 text-stone-400" />,
  };

  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-900 text-white p-5 overflow-y-auto">
      {/* Top Step Progress Bar (Step 4 of 4) */}
      <StepProgressBar current={4} total={4} onBack={onBack} />

      {/* Center Content */}
      <div className="my-auto flex flex-col w-full max-w-[325px] mx-auto text-center">
        <h2 className="text-2xl font-bold font-['Outfit',sans-serif] text-stone-100 mb-1">
          What are you <br /> saving for?
        </h2>
        <p className="text-xs text-stone-400 mb-4">
          Choose a goal, enter its target amount, or customize your own.
        </p>

        {/* 2-Column Grid of Goals */}
        <div className="grid grid-cols-2 gap-2.5 mb-1">
          {goalList.map((goal) => {
            const isSelected = selectedGoalId === goal.id;
            const isCustom = goal.id === 'goal-custom';

            return (
              <div
                key={goal.id}
                onClick={() => onSelectGoal(goal.id)}
                className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-400/20 shadow-md'
                    : 'bg-stone-800/80 border-stone-700/60 hover:border-stone-600'
                }`}
              >
                {/* Top Row: Icon + Radio Indicator */}
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-stone-900/90 border border-stone-700/60 flex items-center justify-center flex-shrink-0">
                    {iconMap[goal.iconName] || (
                      <Sprout className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500'
                        : 'border-stone-600'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />
                    )}
                  </div>
                </div>

                {/* Name Row: Fixed name for standard categories, Editable input for Custom Goal */}
                <div className="mb-2">
                  {isCustom ? (
                    <div
                      className="flex items-center gap-1 bg-stone-900/90 border border-stone-700/80 rounded-lg px-2 py-1 focus-within:border-emerald-400"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={goal.name}
                        placeholder="Custom Goal"
                        onClick={() => onSelectGoal(goal.id)}
                        onChange={(e) =>
                          onUpdateGoalName(goal.id, e.target.value)
                        }
                        className="w-full bg-transparent text-xs font-bold text-white outline-none placeholder:text-stone-500"
                      />
                      <Pencil className="w-3 h-3 text-emerald-400/80 flex-shrink-0" />
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-stone-100 truncate px-0.5 py-0.5">
                      {goal.name}
                    </div>
                  )}
                </div>

                {/* Amount Row: Editable target amount for ALL categories */}
                <div className="mt-auto">
                  <span className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold block mb-0.5 px-0.5">
                    Target
                  </span>
                  <div
                    className="flex items-center bg-stone-900/90 border border-stone-700/80 rounded-lg px-2 py-1 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400/25"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs font-bold text-emerald-400 mr-1 select-none">
                      ₹
                    </span>
                    <input
                      type="text"
                      value={
                        goal.targetAmount
                          ? goal.targetAmount.toLocaleString('en-IN')
                          : ''
                      }
                      placeholder="0"
                      onClick={() => onSelectGoal(goal.id)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        onUpdateGoalAmount(goal.id, Number(raw) || 0);
                      }}
                      className="w-full bg-transparent text-xs font-extrabold text-white outline-none placeholder:text-stone-600"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Milestone Active Feedback Card */}
        {selectedGoal && (
          <div className="mt-2 p-2.5 rounded-xl bg-stone-800/80 border border-emerald-500/30 flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                {iconMap[selectedGoal.iconName] || (
                  <Sprout className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate max-w-[140px]">
                    {selectedGoal.name || 'Custom Goal'}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold flex-shrink-0">
                    Active
                  </span>
                </div>
                <div className="text-[10px] text-stone-400">
                  Target:{' '}
                  <span className="text-emerald-400 font-bold">
                    ₹
                    {selectedGoal.targetAmount
                      ? selectedGoal.targetAmount.toLocaleString('en-IN')
                      : '0'}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[10px] text-stone-400 font-medium text-right leading-tight">
              Tap amount <br /> to edit
            </span>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="pt-2 pb-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          disabled={
            !selectedGoal ||
            selectedGoal.targetAmount <= 0 ||
            (selectedGoal.id === 'goal-custom' && !selectedGoal.name.trim())
          }
          className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all text-sm cursor-pointer disabled:cursor-not-allowed"
        >
          {!selectedGoal || selectedGoal.targetAmount <= 0
            ? 'Enter Target Amount'
            : selectedGoal.id === 'goal-custom' && !selectedGoal.name.trim()
            ? 'Enter Goal Name'
            : 'Continue'}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

// =========================================================================
// SCREEN 9: USER ID (CITY IDENTITY) SCREEN
// =========================================================================
interface UserIdScreenProps {
  userTag: string;
  onEnterCity: () => void;
}

export const UserIdScreen: React.FC<UserIdScreenProps> = ({
  userTag,
  onEnterCity,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(userTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-900 text-white p-5 overflow-y-auto">
      {/* Top Sprout Icon */}
      <div className="pt-4 flex flex-col items-center">
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-lg">
          <Sprout className="w-6 h-6" />
        </div>
      </div>

      {/* Center ID Presentation */}
      <div className="my-auto flex flex-col items-center w-full max-w-[320px] mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-2">
          Your City ID is
        </p>

        {/* Copyable Tag Badge */}
        <button
          onClick={handleCopy}
          className="group relative flex items-center gap-3 px-6 py-3 bg-stone-800/90 border border-stone-700 hover:border-emerald-400 rounded-2xl mb-3 transition-all cursor-pointer shadow-lg"
        >
          <span className="text-2xl font-black font-['Outfit',sans-serif] tracking-wider text-emerald-300">
            {userTag}
          </span>
          <div className="p-1.5 rounded-lg bg-stone-700/60 group-hover:bg-emerald-500/20 text-stone-300 group-hover:text-emerald-300 transition-colors">
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </div>
        </button>

        <p className="text-xs text-stone-400 mb-5 leading-relaxed">
          Share this ID to connect <br /> with friends and build together!
        </p>

        {/* Holographic Citizen Pass Card */}
        <div className="w-full max-w-[260px] p-4 rounded-2xl bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 border border-emerald-500/30 shadow-xl text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Sprout className="w-4 h-4" />
              <span className="text-[11px] font-bold tracking-tight">
                FinCity Citizen Pass
              </span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
              Lv. 1 Founder
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-stone-900 font-black text-sm">
              {userTag.slice(0, 2)}
            </div>
            <div>
              <div className="text-xs font-bold text-white">{userTag}</div>
              <div className="text-[10px] text-emerald-300/80">Plots Claimed: 1</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-3 pb-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEnterCity}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all text-sm cursor-pointer"
        >
          Enter Your City
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
