import { UserState, Transaction, TransactionType } from '../types';

export interface FinancialSummary {
  startingIncome: number;
  totalEarned: number;
  totalSpent: number;
  totalSaved: number;
  currentBalance: number;
  needsSpent: number;
  wantsSpent: number;
  needsBudget: number;
  wantsBudget: number;
  savingsBudget: number;
  savingsRate: number; // percentage of income saved
}

/**
 * Calculates complete financial balance and breakdowns for the user.
 * Base balance starts from the initial income set by the user,
 * plus any extra earnings, minus expenditures and savings deposits.
 */
export function calculateFinancialSummary(user: UserState): FinancialSummary {
  const startingIncome = user.monthlyIncome || 0;
  const transactions = user.transactions || [];

  let totalEarned = 0;
  let totalSpent = 0;
  let totalSaved = 0;
  let needsSpent = 0;
  let wantsSpent = 0;

  for (const tx of transactions) {
    const amount = Number(tx.amount) || 0;
    if (tx.type === 'earn') {
      totalEarned += amount;
    } else if (tx.type === 'spend') {
      totalSpent += amount;
      if (tx.categoryType === 'Needs' || isNeedsCategory(tx.category)) {
        needsSpent += amount;
      } else {
        wantsSpent += amount;
      }
    } else if (tx.type === 'save') {
      totalSaved += amount;
    }
  }

  // Live Wallet / Checking Balance:
  // Income + Earned - Spent - Saved
  const currentBalance = startingIncome + totalEarned - totalSpent - totalSaved;

  const totalInflow = startingIncome + totalEarned;
  const savingsRate = totalInflow > 0 ? Math.round((totalSaved / totalInflow) * 100) : 0;

  return {
    startingIncome,
    totalEarned,
    totalSpent,
    totalSaved,
    currentBalance,
    needsSpent,
    wantsSpent,
    needsBudget: user.budgetNeeds || 0,
    wantsBudget: user.budgetWants || 0,
    savingsBudget: user.budgetSavings || 0,
    savingsRate,
  };
}

export function isNeedsCategory(category: string): boolean {
  const needsKeywords = [
    'groceries',
    'rent',
    'housing',
    'bills',
    'utilities',
    'transit',
    'transport',
    'fuel',
    'medical',
    'health',
    'education',
    'fees',
    'needs',
    'essentials',
  ];
  const catLower = category.toLowerCase();
  return needsKeywords.some((k) => catLower.includes(k));
}

export interface CategoryOption {
  id: string;
  name: string;
  icon: string;
  categoryType?: 'Needs' | 'Wants' | 'Savings' | 'Income';
}

export const SPEND_CATEGORIES: CategoryOption[] = [
  // Needs
  { id: 'groceries', name: 'Groceries & Food', icon: '🛒', categoryType: 'Needs' },
  { id: 'rent', name: 'Rent & Housing', icon: '🏠', categoryType: 'Needs' },
  { id: 'utilities', name: 'Bills & Utilities', icon: '💡', categoryType: 'Needs' },
  { id: 'transport', name: 'Metro & Transport', icon: '🚗', categoryType: 'Needs' },
  { id: 'health', name: 'Health & Medical', icon: '💊', categoryType: 'Needs' },
  { id: 'education', name: 'Tuition & Books', icon: '📚', categoryType: 'Needs' },

  // Wants
  { id: 'dining', name: 'Dining Out & Cafe', icon: '🍔', categoryType: 'Wants' },
  { id: 'shopping', name: 'Shopping & Clothes', icon: '🛍️', categoryType: 'Wants' },
  { id: 'entertainment', name: 'Movies & Outing', icon: '🎬', categoryType: 'Wants' },
  { id: 'gadgets', name: 'Tech & Gadgets', icon: '🎧', categoryType: 'Wants' },
  { id: 'subscriptions', name: 'Subscriptions', icon: '📱', categoryType: 'Wants' },
  { id: 'other_spend', name: 'Other Expenses', icon: '📦', categoryType: 'Wants' },
];

export const EARN_CATEGORIES: CategoryOption[] = [
  { id: 'salary', name: 'Salary / Stipend', icon: '💼', categoryType: 'Income' },
  { id: 'freelance', name: 'Freelance & Gigs', icon: '💻', categoryType: 'Income' },
  { id: 'allowance', name: 'Pocket Money / Allowance', icon: '🎁', categoryType: 'Income' },
  { id: 'dividends', name: 'Investments & Returns', icon: '📈', categoryType: 'Income' },
  { id: 'rewards', name: 'Cashback & Rewards', icon: '🏷️', categoryType: 'Income' },
  { id: 'bonus', name: 'Gift & Bonus', icon: '🎉', categoryType: 'Income' },
  { id: 'other_income', name: 'Other Income', icon: '💵', categoryType: 'Income' },
];

export const SAVE_CATEGORIES: CategoryOption[] = [
  { id: 'fincity_vault', name: 'FinCity Growth Vault', icon: '🏙️', categoryType: 'Savings' },
  { id: 'emergency_shield', name: 'Emergency Shield Fund', icon: '🛡️', categoryType: 'Savings' },
  { id: 'dream_goal', name: 'Milestone Goal Vault', icon: '🎯', categoryType: 'Savings' },
  { id: 'sip_invest', name: 'Mutual Fund SIP', icon: '📊', categoryType: 'Savings' },
  { id: 'fixed_deposit', name: 'Fixed Deposit / Gold', icon: '🪙', categoryType: 'Savings' },
];

export const PAYMENT_METHODS = [
  { id: 'UPI', name: 'UPI / GPay', icon: '⚡' },
  { id: 'Bank Transfer', name: 'Bank Transfer', icon: '🏦' },
  { id: 'Cash', name: 'Cash', icon: '💵' },
  { id: 'Card', name: 'Card', icon: '💳' },
] as const;
