import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  Zap,
  Heart,
  Users,
  Share2,
  TrendingUp,
  Award,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Plus,
  Pencil,
} from 'lucide-react';
import { UserState, MobileTab, FriendInvitation } from '../../types';
import { MobileStatusBar, MobileBottomNav } from './Screens9to13';
import { NovaGuide } from '../NovaGuide';
import { EditProfileModal } from '../EditProfileModal';
import { FriendsView } from '../FriendsView';
import { TransactionModal } from '../TransactionModal';
import { TransactionHistoryView } from '../TransactionHistoryView';

interface MobileTabViewProps {
  tab: MobileTab;
  user: UserState;
  onChangeTab: (tab: MobileTab) => void;
  onAddSavings: (amount: number, desc: string) => void;
  onAddTransaction: (transaction: {
    type: 'earn' | 'spend' | 'save';
    amount: number;
    category: string;
    categoryType?: 'Needs' | 'Wants' | 'Savings' | 'Income';
    description: string;
    paymentMethod?: string;
    date?: string;
  }) => void;
  onCompleteQuest: (questId: string) => void;
  onUpdateProfile?: (updates: {
    name: string;
    tag: string;
    monthlyIncome: number;
    budgetNeeds: number;
    budgetWants: number;
    budgetSavings: number;
  }) => void;
  onAddFriend?: (cityId: string) => { success: boolean; message: string; invitation?: FriendInvitation };
  onAcceptInvitation?: (invitationId: string) => void;
  onDeclineInvitation?: (invitationId: string) => void;
  onSimulateFriendAccept?: (invitationId: string) => void;
}

export const MobileTabViews: React.FC<MobileTabViewProps> = ({
  tab,
  user,
  onChangeTab,
  onAddSavings,
  onAddTransaction,
  onCompleteQuest,
  onUpdateProfile,
  onAddFriend,
  onAcceptInvitation,
  onDeclineInvitation,
  onSimulateFriendAccept,
}) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);

  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-950 text-white overflow-hidden">
      {/* Status Bar */}
      <MobileStatusBar
        name={user.name}
        tag={user.tag}
        level={user.level}
        exp={user.exp}
        hearts={user.hearts}
        user={user}
        onUpdateProfile={onUpdateProfile}
      />

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TRANSACTIONS TAB */}
        {(tab === 'transactions' || tab === 'quests') && (
          <TransactionHistoryView
            user={user}
            onAddTransaction={onAddTransaction}
            isDesktop={false}
          />
        )}

        {/* FRIENDS TAB (FORMERLY SQUAD) */}
        {tab === 'squad' && (
          <FriendsView
            user={user}
            onAddFriend={onAddFriend || (() => ({ success: false, message: 'Not available' }))}
            onAcceptInvitation={onAcceptInvitation || (() => {})}
            onDeclineInvitation={onDeclineInvitation || (() => {})}
            onSimulateFriendAccept={onSimulateFriendAccept || (() => {})}
            isDesktop={false}
          />
        )}

        {/* ADD TAB (COMPLETE TRANSACTION LOGGER) */}
        {tab === 'add' && (
          <div className="space-y-3 py-1">
            <div className="text-center">
              <h3 className="text-lg font-bold font-['Outfit',sans-serif] text-stone-100">
                Log New Transaction
              </h3>
              <p className="text-[11px] text-stone-400">
                Record spend, earn, or city savings to calculate your balance!
              </p>
            </div>

            <TransactionModal
              user={user}
              onAddTransaction={(tx) => {
                onAddTransaction(tx);
                onChangeTab('city');
              }}
              isInline={true}
            />
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-3xl bg-stone-900 border border-stone-800">
              <div className="flex items-center gap-3">
                <NovaGuide size="lg" expression="happy" />
                <div>
                  <h4 className="text-base font-bold text-white">{user.name}</h4>
                  <div className="text-xs text-emerald-400 font-mono">{user.tag}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    Citizen Level {user.level} • Founder
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 transition-all cursor-pointer"
                title="Edit Username, Income & Budget"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* Financial Overview */}
            <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Monthly Financial Plan
                </h5>
                <span className="text-xs font-extrabold text-emerald-400 font-mono">
                  ₹{user.monthlyIncome.toLocaleString('en-IN')}/mo
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Needs (Essentials)</span>
                  <span className="font-bold text-rose-300">
                    ₹{user.budgetNeeds.toLocaleString('en-IN')} ({Math.round((user.budgetNeeds / Math.max(1, user.monthlyIncome)) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Wants (Lifestyle)</span>
                  <span className="font-bold text-amber-300">
                    ₹{user.budgetWants.toLocaleString('en-IN')} ({Math.round((user.budgetWants / Math.max(1, user.monthlyIncome)) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Savings (City & Wealth)</span>
                  <span className="font-bold text-emerald-400">
                    ₹{user.budgetSavings.toLocaleString('en-IN')} ({Math.round((user.budgetSavings / Math.max(1, user.monthlyIncome)) * 100)}%)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="w-full mt-2 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-emerald-400" />
                <span>Modify Budget Split & Income</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile & Budget Modal for Profile Tab */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={(updates) => {
          if (onUpdateProfile) onUpdateProfile(updates);
        }}
      />

      {/* Bottom Nav */}
      <MobileBottomNav
        activeTab={tab}
        onChangeTab={onChangeTab}
      />
    </div>
  );
};
