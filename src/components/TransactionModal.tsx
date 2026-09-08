import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Sprout,
  CreditCard,
  Calendar,
  Tag,
  FileText,
  CheckCircle2,
  ArrowRight,
  Shield,
  Coins,
  Wallet,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { UserState, Transaction, TransactionType } from '../types';
import {
  SPEND_CATEGORIES,
  EARN_CATEGORIES,
  SAVE_CATEGORIES,
  PAYMENT_METHODS,
  calculateFinancialSummary,
  CategoryOption,
} from '../utils/financeUtils';

export interface TransactionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  user: UserState;
  onAddTransaction: (transaction: {
    type: 'earn' | 'spend' | 'save';
    amount: number;
    category: string;
    categoryType?: 'Needs' | 'Wants' | 'Savings' | 'Income';
    description: string;
    paymentMethod?: string;
    date?: string;
    squadGoalId?: string;
    squadGoalTitle?: string;
  }) => void;
  defaultType?: 'earn' | 'spend' | 'save';
  isInline?: boolean;
  className?: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen = true,
  onClose,
  user,
  onAddTransaction,
  defaultType = 'spend',
  isInline = false,
  className = '',
}) => {
  const [txType, setTxType] = useState<'spend' | 'earn' | 'save'>(defaultType);
  const [amount, setAmount] = useState<number>(100);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    defaultType === 'spend' ? 'Groceries & Food' : defaultType === 'earn' ? 'Salary / Stipend' : 'FinCity Growth Vault'
  );
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [txDate, setTxDate] = useState<string>('Today');

  // Saving Destination: Personal vs Squad Collab Goal
  const [savingDestination, setSavingDestination] = useState<'personal' | 'squad'>('personal');
  const squadGoalsList = user.squadGoals || [];
  const [selectedSquadGoalId, setSelectedSquadGoalId] = useState<string>(
    squadGoalsList[0]?.id || ''
  );

  // Compute live financial summary
  const summary = calculateFinancialSummary(user);
  const currentBalance = summary.currentBalance;

  // Calculate live projected balance
  let projectedBalance = currentBalance;
  if (txType === 'earn') {
    projectedBalance = currentBalance + amount;
  } else {
    // Both 'spend' and 'save' deduct from liquid wallet balance
    projectedBalance = currentBalance - amount;
  }

  // Categories based on transaction type
  const activeCategories: CategoryOption[] =
    txType === 'spend'
      ? SPEND_CATEGORIES
      : txType === 'earn'
      ? EARN_CATEGORIES
      : SAVE_CATEGORIES;

  // Quick chips for amounts
  const amountPresets =
    txType === 'spend'
      ? [50, 100, 250, 500, 1000, 2000]
      : txType === 'earn'
      ? [500, 1000, 2500, 5000, 10000]
      : [100, 250, 500, 1000, 2500, 5000];

  // Note suggestion chips
  const noteSuggestions =
    txType === 'spend'
      ? ['Grocery run', 'Coffee & Snack', 'Metro card recharge', 'Dinner with friends', 'Electricity bill', 'Zomato order']
      : txType === 'earn'
      ? ['Monthly Stipend', 'Freelance gig payment', 'Sold old items', 'Allowance', 'Cashback reward']
      : ['Daily Micro-Save', 'Skipped impulse purchase', 'Cooked at home saving', 'Emergency Buffer', 'Milestone Vault'];

  const handleTypeChange = (type: 'spend' | 'earn' | 'save') => {
    setTxType(type);
    if (type === 'spend') setSelectedCategory('Groceries & Food');
    else if (type === 'earn') setSelectedCategory('Salary / Stipend');
    else setSelectedCategory('FinCity Growth Vault');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    // Find category type
    const matchedCategory = activeCategories.find((c) => c.name === selectedCategory);
    const categoryType = matchedCategory?.categoryType || (txType === 'earn' ? 'Income' : txType === 'save' ? 'Savings' : 'Wants');

    const targetSquadGoal = squadGoalsList.find((sg) => sg.id === selectedSquadGoalId);
    const isSquadSave = txType === 'save' && savingDestination === 'squad' && targetSquadGoal;

    onAddTransaction({
      type: txType,
      amount,
      category: isSquadSave ? `Squad: ${targetSquadGoal.title}` : selectedCategory,
      categoryType,
      description: description.trim() || (isSquadSave ? `Deposit into ${targetSquadGoal.title}` : `${selectedCategory} (${txType.toUpperCase()})`),
      paymentMethod,
      date: txDate === 'Today' ? 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : txDate,
      squadGoalId: isSquadSave ? targetSquadGoal.id : undefined,
      squadGoalTitle: isSquadSave ? targetSquadGoal.title : undefined,
    });

    // Celebration Confetti
    confetti({
      particleCount: txType === 'save' ? 70 : 40,
      spread: 60,
      origin: { y: 0.7 },
      colors:
        txType === 'save'
          ? ['#10b981', '#34d399', '#38bdf8', '#fbbf24']
          : txType === 'earn'
          ? ['#10b981', '#4ade80', '#a7f3d0']
          : ['#f43f5e', '#fb7185', '#fda4af'],
    });

    if (onClose) onClose();
  };

  const formContent = (
    <div className={`space-y-4 text-stone-100 ${className}`}>
      {/* 1. Header: Live Balance & Starting Income Context */}
      <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-stone-400 font-semibold leading-none">Current Wallet Balance</div>
            <div className="text-base sm:text-lg font-black font-mono text-white mt-0.5">
              ₹{currentBalance.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-stone-400 font-semibold leading-none">Starting Income Base</div>
          <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
            +₹{summary.startingIncome.toLocaleString('en-IN')}/mo
          </div>
        </div>
      </div>

      {/* 2. Transaction Type Tabs (Spend / Earn / Save) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-900 rounded-2xl border border-stone-800">
        <button
          type="button"
          onClick={() => handleTypeChange('spend')}
          className={`py-2 px-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            txType === 'spend'
              ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-md shadow-rose-500/20'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Spend</span>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange('earn')}
          className={`py-2 px-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            txType === 'earn'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 shadow-md shadow-emerald-500/20 font-black'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Earn</span>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange('save')}
          className={`py-2 px-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            txType === 'save'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>Save</span>
        </button>
      </div>

      {/* SAVING DESTINATION SELECTOR (Personal vs Squad Collab Goal) */}
      {txType === 'save' && (
        <div className="p-3 bg-stone-900 border border-stone-800 rounded-2xl space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center justify-between">
            <span>Saving Target / Destination</span>
            <span className="text-[10px] text-stone-400 font-normal">Where should this deposit go?</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSavingDestination('personal')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                savingDestination === 'personal'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow'
                  : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>👤 Personal Vault</span>
            </button>
            <button
              type="button"
              onClick={() => setSavingDestination('squad')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                savingDestination === 'squad'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                  : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>👥 Squad Collab Goal</span>
            </button>
          </div>

          {savingDestination === 'squad' && (
            <div className="pt-1 space-y-1.5">
              <label className="block text-[11px] font-semibold text-stone-300">
                Select Squad Collab Goal:
              </label>
              {squadGoalsList.length === 0 ? (
                <p className="text-xs text-amber-400">No active squad goals found. You can create one in the Friends &amp; Squad tab!</p>
              ) : (
                <select
                  value={selectedSquadGoalId}
                  onChange={(e) => setSelectedSquadGoalId(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-950 border border-amber-500/40 text-xs text-amber-200 outline-none focus:border-amber-400 cursor-pointer"
                >
                  {squadGoalsList.map((sg) => (
                    <option key={sg.id} value={sg.id} className="bg-stone-900 text-white">
                      {sg.title} (Target: ₹{sg.targetAmount.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 3. Amount Input with Quick Presets */}
        <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-400">
            <span>Transaction Amount</span>
            <span
              className={`font-mono font-bold ${
                txType === 'spend'
                  ? 'text-rose-400'
                  : txType === 'earn'
                  ? 'text-emerald-400'
                  : 'text-blue-400'
              }`}
            >
              {txType === 'spend' ? 'Deducts from balance' : txType === 'earn' ? 'Adds to balance' : 'Transfers to FinCity Vault'}
            </span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-4 text-2xl font-bold text-stone-400 select-none">₹</span>
            <input
              type="text"
              value={amount || ''}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setAmount(Number(val) || 0);
              }}
              placeholder="0"
              className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-stone-950 border border-stone-700 text-white font-black text-2xl text-left outline-none focus:border-emerald-400 transition-colors font-mono"
            />
          </div>

          {/* Amount Quick Presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {amountPresets.map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setAmount(preset)}
                className={`py-1 px-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  amount === preset
                    ? txType === 'spend'
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                      : txType === 'earn'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-blue-500/20 border-blue-400 text-blue-300'
                    : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
              >
                +₹{preset}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Category Selector Grid */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
            Category &amp; Classification
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
            {activeCategories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? txType === 'spend'
                        ? 'bg-rose-950/40 border-rose-500/80 text-rose-200 ring-1 ring-rose-500/50'
                        : txType === 'earn'
                        ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 ring-1 ring-emerald-500/50'
                        : 'bg-blue-950/40 border-blue-500/80 text-blue-200 ring-1 ring-blue-500/50'
                      : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <span className="text-lg shrink-0">{cat.icon}</span>
                  <div className="overflow-hidden leading-tight">
                    <div className="text-xs font-bold truncate">{cat.name}</div>
                    {cat.categoryType && (
                      <span className="text-[10px] text-stone-400 font-medium">
                        {cat.categoryType}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Note / Merchant & Suggestion Chips */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
            Description / Note (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`e.g. ${noteSuggestions[0]}`}
            className="w-full py-2.5 px-3.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-emerald-400 placeholder:text-stone-500"
          />

          <div className="flex flex-wrap gap-1.5">
            {noteSuggestions.slice(0, 4).map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => setDescription(suggestion)}
                className="text-[11px] py-0.5 px-2 rounded-md bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700/60 cursor-pointer"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Payment Method & Date */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-stone-400 mb-1">
              Payment Mode
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 outline-none focus:border-emerald-400 cursor-pointer"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm.id} value={pm.id} className="bg-stone-900 text-white">
                  {pm.icon} {pm.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-400 mb-1">Date</label>
            <select
              value={txDate}
              onChange={(e) => setTxDate(e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 outline-none focus:border-emerald-400 cursor-pointer"
            >
              <option value="Today" className="bg-stone-900 text-white">
                Today
              </option>
              <option value="Yesterday" className="bg-stone-900 text-white">
                Yesterday
              </option>
              <option value="Earlier this week" className="bg-stone-900 text-white">
                Earlier this week
              </option>
            </select>
          </div>
        </div>

        {/* 7. Live Equation & Impact Banner */}
        <div
          className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
            txType === 'spend'
              ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
              : txType === 'earn'
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
              : 'bg-blue-950/20 border-blue-500/30 text-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">
              {txType === 'spend' ? '💸' : txType === 'earn' ? '💰' : '🏛️'}
            </span>
            <div>
              <div className="font-bold">
                {txType === 'spend'
                  ? `Deducting ₹${amount.toLocaleString('en-IN')}`
                  : txType === 'earn'
                  ? `Adding +₹${amount.toLocaleString('en-IN')}`
                  : `Saving ₹${amount.toLocaleString('en-IN')} to City`}
              </div>
              <div className="text-[11px] text-stone-400">
                Projected Balance: <span className="font-bold text-white">₹{projectedBalance.toLocaleString('en-IN')}</span>
                {txType === 'save' && ' (+City Build Funds & XP)'}
              </div>
            </div>
          </div>
        </div>

        {/* 8. Submit Button */}
        <button
          type="submit"
          disabled={amount <= 0}
          className={`w-full py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
            txType === 'spend'
              ? 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white shadow-rose-500/25'
              : txType === 'earn'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 shadow-emerald-500/25'
              : 'bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 hover:from-blue-400 hover:to-emerald-300 text-stone-950 shadow-blue-500/25'
          }`}
        >
          {txType === 'spend' && <span>Log Expense (-₹{amount})</span>}
          {txType === 'earn' && <span>Log Income (+₹{amount})</span>}
          {txType === 'save' && <span>Deposit &amp; Grow FinCity (-₹{amount})</span>}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );

  if (isInline) {
    return formContent;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-stone-950 flex items-center justify-center font-black">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Outfit',sans-serif] text-white leading-tight">
                    Log Transaction
                  </h3>
                  <p className="text-[11px] text-stone-400">Track spend, income, and city savings</p>
                </div>
              </div>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {formContent}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
