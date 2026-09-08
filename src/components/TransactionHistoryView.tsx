import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingDown,
  TrendingUp,
  Vault,
  Search,
  Filter,
  Calendar,
  Tag,
} from 'lucide-react';
import { UserState, Transaction } from '../types';
import { calculateFinancialSummary } from '../utils/financeUtils';
import { TransactionModal } from './TransactionModal';

interface TransactionHistoryViewProps {
  user: UserState;
  onAddTransaction: (transaction: {
    type: 'earn' | 'spend' | 'save';
    amount: number;
    category: string;
    categoryType?: 'Needs' | 'Wants' | 'Savings' | 'Income';
    description: string;
    paymentMethod?: string;
    date?: string;
  }) => void;
  isDesktop?: boolean;
}

export const TransactionHistoryView: React.FC<TransactionHistoryViewProps> = ({
  user,
  onAddTransaction,
  isDesktop = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'earn' | 'spend' | 'save'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);

  const summary = calculateFinancialSummary(user);
  const transactions = user.transactions || [];

  const filteredTxs = transactions.filter((tx) => {
    // Type filter
    if (filter === 'earn' && tx.type !== 'earn') return false;
    if (filter === 'spend' && tx.type !== 'spend') return false;
    if (filter === 'save' && tx.type !== 'save' && tx.type !== 'deposit') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = tx.description?.toLowerCase().includes(q);
      const matchCat = tx.category?.toLowerCase().includes(q);
      const matchType = tx.type?.toLowerCase().includes(q);
      return matchDesc || matchCat || matchType;
    }
    return true;
  });

  return (
    <div className={`space-y-5 w-full ${isDesktop ? 'max-w-4xl mx-auto' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-800">
        <div>
          <h3 className={`${isDesktop ? 'text-xl' : 'text-lg'} font-bold font-['Outfit',sans-serif] text-stone-100 flex items-center gap-2`}>
            <Receipt className="w-5 h-5 text-emerald-400" />
            Transaction History
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Real-time financial activity, balance overview, and expense tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Log Transaction
        </button>
      </div>

      {/* SHORT SUMMARY BAR: Balance Amount, Total Spent, Total Saved */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Balance Amount */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 shadow-md flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              Balance Amount
            </div>
            <div className="text-xl font-black text-white font-mono mt-1">
              ₹{summary.currentBalance.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-stone-500 font-medium mt-0.5">
              Monthly Income: ₹{summary.startingIncome.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
            ₹
          </div>
        </div>

        {/* 2. Total Spent */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 shadow-md flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              Total Spent
            </div>
            <div className="text-xl font-black text-rose-400 font-mono mt-1">
              ₹{summary.totalSpent.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-stone-500 font-medium mt-0.5">
              Needs: ₹{summary.needsSpent.toLocaleString('en-IN')} • Wants: ₹{summary.wantsSpent.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        {/* 3. Total Saved */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 shadow-md flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              Total Saved
            </div>
            <div className="text-xl font-black text-teal-300 font-mono mt-1">
              ₹{summary.totalSaved.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-stone-500 font-medium mt-0.5">
              Savings Rate: {summary.savingsRate}% of Income
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, category, or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-emerald-500 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            All ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('earn')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filter === 'earn'
                ? 'bg-emerald-500 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Earnings (+)
          </button>
          <button
            type="button"
            onClick={() => setFilter('spend')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filter === 'spend'
                ? 'bg-rose-500 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Spent (-)
          </button>
          <button
            type="button"
            onClick={() => setFilter('save')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filter === 'save'
                ? 'bg-teal-500 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Vault Saved
          </button>
        </div>
      </div>

      {/* TRANSACTION LIST */}
      <div className="bg-stone-900 rounded-2xl border border-stone-800 divide-y divide-stone-800/80 overflow-hidden shadow-lg">
        {filteredTxs.length === 0 ? (
          <div className="p-8 text-center text-stone-400 text-xs">
            {searchQuery ? 'No transactions match your search query.' : 'No transactions recorded yet.'}
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowLogModal(true)}
                className="text-emerald-400 font-bold hover:underline"
              >
                + Log your first transaction
              </button>
            </div>
          </div>
        ) : (
          filteredTxs.map((tx) => {
            const isEarn = tx.type === 'earn';
            const isSpend = tx.type === 'spend';
            const isSave = tx.type === 'save' || tx.type === 'deposit';

            return (
              <div
                key={tx.id}
                className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-stone-850/60 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold flex-shrink-0 ${
                      isEarn
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : isSpend
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                        : 'bg-teal-500/15 border-teal-500/30 text-teal-300'
                    }`}
                  >
                    {isEarn ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : isSpend ? (
                      <ArrowDownRight className="w-5 h-5" />
                    ) : (
                      <Wallet className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-stone-100 truncate">
                      {tx.description || tx.category || 'Transaction'}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                      <span className="font-medium text-stone-300">{tx.category}</span>
                      {tx.categoryType && (
                        <>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 rounded bg-stone-800 text-stone-300 font-mono">
                            {tx.categoryType}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>{tx.date ? new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Today'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-3">
                  <div
                    className={`text-sm font-black font-mono ${
                      isEarn
                        ? 'text-emerald-400'
                        : isSpend
                        ? 'text-rose-400'
                        : 'text-teal-300'
                    }`}
                  >
                    {isEarn ? '+' : isSpend ? '-' : ''}₹{Number(tx.amount).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-stone-500 capitalize font-medium mt-0.5">
                    {tx.paymentMethod || tx.type}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Log Transaction Modal */}
      {showLogModal && (
        <TransactionModal
          isOpen={showLogModal}
          onClose={() => setShowLogModal(false)}
          user={user}
          onAddTransaction={(txData) => {
            onAddTransaction(txData);
            setShowLogModal(false);
          }}
        />
      )}
    </div>
  );
};
