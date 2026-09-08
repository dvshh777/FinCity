import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Users,
  UserPlus,
  Mail,
  Copy,
  Check,
  CheckCircle2,
  X,
  Sparkles,
  Search,
  Building,
  Heart,
  TrendingUp,
  Shield,
  ArrowRight,
  Send,
  AlertCircle,
  ExternalLink,
  Zap,
  Trophy,
  Crown,
  Medal,
  Flame,
  Swords,
  ChevronRight,
  Plus,
  Target,
  PiggyBank,
  UserCheck,
  Award,
  Palmtree,
  Ticket,
  Laptop,
} from 'lucide-react';
import { UserState, SquadMember, FriendInvitation } from '../types';
import { KNOWN_CITIZENS, CitizenProfile } from '../data/mockData';

interface FriendsViewProps {
  user: UserState;
  onAddFriend: (cityId: string) => { success: boolean; message: string; invitation?: FriendInvitation };
  onAcceptInvitation: (invitationId: string) => void;
  onDeclineInvitation: (invitationId: string) => void;
  onSimulateFriendAccept: (invitationId: string) => void;
  onCreateSquadGoal?: (
    title: string,
    targetAmount: number,
    category: string,
    initialMembers: { name: string; cityId: string; avatarUrl?: string }[]
  ) => void;
  onInviteToSquadGoal?: (squadGoalId: string, friendCityId: string, friendName?: string) => void;
  onAddTransaction?: (transaction: any) => void;
  isDesktop?: boolean;
}

export type FriendsSubTab = 'rankings' | 'friends' | 'add' | 'invitations';
export type RankSortBy = 'overall' | 'exp' | 'buildings' | 'savings';

export interface LeaderboardEntry {
  id: string;
  name: string;
  tag: string;
  level: number;
  cityBuildings: number;
  savingsTotal: number;
  avatarUrl: string;
  status: 'online' | 'saving' | 'offline';
  district?: string;
  exp: number;
  hearts: number;
  isUser?: boolean;
  prestigeScore: number;
}

export const FriendsView: React.FC<FriendsViewProps> = ({
  user,
  onAddFriend,
  onAcceptInvitation,
  onDeclineInvitation,
  onSimulateFriendAccept,
  onCreateSquadGoal,
  onInviteToSquadGoal,
  onAddTransaction,
  isDesktop = false,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<FriendsSubTab>('rankings');
  const [rankSortBy, setRankSortBy] = useState<RankSortBy>('exp');
  const [inputCityId, setInputCityId] = useState('');
  const [copiedCityId, setCopiedCityId] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [cheeredFriendId, setCheeredFriendId] = useState<string | null>(null);
  const [visitedCitizen, setVisitedCitizen] = useState<LeaderboardEntry | SquadMember | null>(null);
  const [compareTarget, setCompareTarget] = useState<LeaderboardEntry | null>(null);

  // Squad Collab Goal Modals State
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('Goa Trip Collab Savings 🏖️');
  const [newGoalTarget, setNewGoalTarget] = useState(20000);
  const [newGoalCategory, setNewGoalCategory] = useState('Travel');
  const [selectedInviteFriendIds, setSelectedInviteFriendIds] = useState<string[]>([]);
  const [customInviteCityId, setCustomInviteCityId] = useState('');

  const [inviteModalGoalId, setInviteModalGoalId] = useState<string | null>(null);
  const [inviteFriendInput, setInviteFriendInput] = useState('');

  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState(500);

  // Invitations calculation
  const invitations = user.invitations || [];
  const incomingPending = invitations.filter((inv) => inv.type === 'incoming' && inv.status === 'pending');
  const outgoingPending = invitations.filter((inv) => inv.type === 'outgoing' && inv.status === 'pending');
  const totalPending = incomingPending.length + outgoingPending.length;

  const userCompletedBuildings = user.buildings.filter((b) => b.stage === 3).length || user.buildingsCount || 0;

  // Build unified leaderboard pool: User + Squad members + Known Citizens
  const userEntry: LeaderboardEntry = {
    id: 'current-user',
    name: user.name || 'Abhi',
    tag: user.tag,
    level: user.level,
    cityBuildings: userCompletedBuildings,
    savingsTotal: user.totalSavings,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    district: 'Capital Island',
    exp: user.exp,
    hearts: user.hearts,
    isUser: true,
    prestigeScore: user.exp * 2 + userCompletedBuildings * 60 + Math.round(user.totalSavings / 100),
  };

  const squadEntries: LeaderboardEntry[] = (user.squad || []).map((m) => ({
    id: m.id,
    name: m.name,
    tag: m.tag,
    level: m.level,
    cityBuildings: m.cityBuildings,
    savingsTotal: m.savingsTotal,
    avatarUrl: m.avatarUrl,
    status: m.status,
    district: m.district,
    exp: m.exp || 100,
    hearts: m.hearts || 80,
    isUser: false,
    prestigeScore: (m.exp || 100) * 2 + m.cityBuildings * 60 + Math.round(m.savingsTotal / 100),
  }));

  // Add citizens from known list if not already in squad
  const knownEntries: LeaderboardEntry[] = KNOWN_CITIZENS
    .filter((cit) => !squadEntries.some((sq) => sq.tag.toUpperCase() === cit.cityId.toUpperCase()))
    .map((cit) => ({
      id: cit.id,
      name: cit.name,
      tag: cit.cityId,
      level: cit.level,
      cityBuildings: cit.cityBuildings,
      savingsTotal: cit.savingsTotal,
      avatarUrl: cit.avatarUrl,
      status: cit.status,
      district: cit.district,
      exp: cit.exp || 120,
      hearts: cit.hearts || 75,
      isUser: false,
      prestigeScore: (cit.exp || 120) * 2 + cit.cityBuildings * 60 + Math.round(cit.savingsTotal / 100),
    }));

  const allEntries: LeaderboardEntry[] = [userEntry, ...squadEntries, ...knownEntries];

  // Sort based on selected metric
  const sortedLeaderboard = [...allEntries].sort((a, b) => {
    if (rankSortBy === 'exp') {
      if (b.exp !== a.exp) return b.exp - a.exp;
      return b.cityBuildings - a.cityBuildings;
    }
    if (rankSortBy === 'buildings') {
      if (b.cityBuildings !== a.cityBuildings) return b.cityBuildings - a.cityBuildings;
      return b.exp - a.exp;
    }
    if (rankSortBy === 'savings') {
      return b.savingsTotal - a.savingsTotal;
    }
    // Overall Prestige
    return b.prestigeScore - a.prestigeScore;
  });

  const userRankIndex = sortedLeaderboard.findIndex((e) => e.isUser);
  const userRankNumber = userRankIndex + 1;
  const aheadCitizen = userRankIndex > 0 ? sortedLeaderboard[userRankIndex - 1] : null;
  const behindCitizen = userRankIndex < sortedLeaderboard.length - 1 ? sortedLeaderboard[userRankIndex + 1] : null;

  const top1 = sortedLeaderboard[0];
  const top2 = sortedLeaderboard[1];
  const top3 = sortedLeaderboard[2];

  const handleCopyOwnId = () => {
    navigator.clipboard.writeText(user.tag);
    setCopiedCityId(true);
    setTimeout(() => setCopiedCityId(false), 2000);
  };

  const handleSendInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);
    const cleanId = inputCityId.trim();
    if (!cleanId) {
      setFormFeedback({ type: 'error', message: 'Please enter a valid City ID (e.g. CTY-4019)' });
      return;
    }

    const result = onAddFriend(cleanId);
    if (result.success) {
      setFormFeedback({ type: 'success', message: result.message });
      setInputCityId('');
    } else {
      setFormFeedback({ type: 'error', message: result.message });
    }
  };

  const handleQuickInvite = (citizen: CitizenProfile | LeaderboardEntry) => {
    setFormFeedback(null);
    const targetTag = 'cityId' in citizen ? citizen.cityId : citizen.tag;
    const result = onAddFriend(targetTag);
    if (result.success) {
      setFormFeedback({ type: 'success', message: result.message });
      setActiveSubTab('invitations');
    } else {
      setFormFeedback({ type: 'error', message: result.message });
    }
  };

  const handleCheer = (friendId: string) => {
    setCheeredFriendId(friendId);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b'],
    });
    setTimeout(() => setCheeredFriendId(null), 2000);
  };

  return (
    <div className={`space-y-4 w-full ${isDesktop ? 'max-w-4xl mx-auto' : ''}`}>
      {/* 1. Header (Leaderboard & Squad Title) */}
      <div className="pb-2 border-b border-stone-800/80 space-y-1">
        <div className="flex items-center gap-2">
          <h3 className={`${isDesktop ? 'text-2xl' : 'text-xl'} font-bold font-['Outfit',sans-serif] text-stone-100 flex items-center gap-2`}>
            <Trophy className="w-6 h-6 text-amber-400" />
            Leaderboard &amp; Squad
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
            Rank #{userRankNumber}
          </span>
        </div>
        <p className="text-xs text-stone-400">
          Compare city progress, rankings, and connected friends in your financial empire.
        </p>
      </div>

      {/* 2. Sub-Navigation (SEPARATE ROW BELOW THE LEADERBOARD HEADER) */}
      <div className="p-1.5 bg-stone-900/90 rounded-2xl border border-stone-800 flex items-center gap-2 overflow-x-auto shadow-inner">
        <button
          type="button"
          onClick={() => {
            setActiveSubTab('rankings');
            setFormFeedback(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'rankings'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 shadow-md shadow-amber-500/20 font-black'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Rankings</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('friends');
            setFormFeedback(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'friends'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-stone-950 shadow-md shadow-emerald-500/20 font-black'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Squad &amp; Collab Goals ({user.squad.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('add');
            setFormFeedback(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'add'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/20 font-black'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Friend / City ID</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('invitations');
            setFormFeedback(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${
            activeSubTab === 'invitations'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-400 text-white shadow-md shadow-purple-500/20 font-black'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Invites</span>
          {totalPending > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
              {totalPending}
            </span>
          )}
        </button>
      </div>

      {/* ================================================================= */}
      {/* SUB-TAB 0: COMPETITIVE RANKINGS & LEADERBOARD                     */}
      {/* ================================================================= */}
      {activeSubTab === 'rankings' && (
        <div className="space-y-4">
          {/* USER RANK STATUS CARD */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                #{userRankNumber}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-100">
                    {userRankNumber === 1 ? '1st Place' : `Rank #${userRankNumber} of ${sortedLeaderboard.length}`}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-stone-800 px-1.5 py-0.5 rounded border border-stone-700">
                    {user.tag}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {userRankNumber === 1 ? 'Top rank in FinCity' : aheadCitizen ? `${aheadCitizen.exp - user.exp} EXP behind #${userRankNumber - 1} (${aheadCitizen.name})` : 'Keep earning EXP to rank up'}
                </p>
              </div>
            </div>

            {/* Compact Stats */}
            <div className="flex items-center gap-3 text-xs">
              <div className="px-2.5 py-1 rounded-lg bg-stone-850 border border-stone-800 text-center">
                <span className="text-[10px] text-stone-400 block font-medium">EXP</span>
                <span className="font-bold text-amber-400">{user.exp}</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-stone-850 border border-stone-800 text-center">
                <span className="text-[10px] text-stone-400 block font-medium">Buildings</span>
                <span className="font-bold text-emerald-400">{userCompletedBuildings}</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-stone-850 border border-stone-800 text-center">
                <span className="text-[10px] text-stone-400 block font-medium">Savings</span>
                <span className="font-bold text-stone-200">₹{user.totalSavings.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* CATEGORY FILTER TABS */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-stone-400">Sort By</span>
            <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setRankSortBy('exp')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  rankSortBy === 'exp'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                EXP
              </button>

              <button
                type="button"
                onClick={() => setRankSortBy('buildings')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  rankSortBy === 'buildings'
                    ? 'bg-emerald-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Buildings
              </button>

              <button
                type="button"
                onClick={() => setRankSortBy('savings')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  rankSortBy === 'savings'
                    ? 'bg-teal-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Savings
              </button>

              <button
                type="button"
                onClick={() => setRankSortBy('overall')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  rankSortBy === 'overall'
                    ? 'bg-indigo-500 text-white font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Prestige
              </button>
            </div>
          </div>

          {/* TOP 3 PODIUM DISPLAY */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 pb-1 items-end">
            {/* 2nd Place */}
            {top2 && (
              <div className={`p-3 rounded-2xl text-center flex flex-col items-center justify-between border ${
                top2.isUser ? 'bg-stone-900 border-slate-400' : 'bg-stone-900/90 border-stone-800'
              }`}>
                <span className="text-xs font-bold text-slate-400 mb-1">#2</span>
                <img src={top2.avatarUrl} alt={top2.name} className="w-11 h-11 rounded-full object-cover border border-slate-400 shadow-sm mb-1" />
                <div className="text-xs font-bold text-stone-100 truncate max-w-full">{top2.name}</div>
                <div className="text-[10px] text-stone-400 font-mono">{top2.tag}</div>
                <div className="mt-1 text-[11px] font-bold text-amber-400">{top2.exp} EXP</div>
              </div>
            )}

            {/* 1st Place */}
            {top1 && (
              <div className={`p-3.5 rounded-2xl text-center flex flex-col items-center justify-between border relative shadow-lg ${
                top1.isUser ? 'bg-stone-900 border-amber-400 ring-1 ring-amber-400/50' : 'bg-stone-900 border-amber-500/50'
              }`}>
                <span className="text-xs font-extrabold text-amber-400 mb-1 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 fill-amber-400" /> #1
                </span>
                <img src={top1.avatarUrl} alt={top1.name} className="w-13 h-13 rounded-full object-cover border-2 border-amber-400 shadow-md mb-1" />
                <div className="text-xs font-bold text-stone-100 truncate max-w-full">{top1.name}</div>
                <div className="text-[10px] text-stone-400 font-mono">{top1.tag}</div>
                <div className="mt-1 text-xs font-extrabold text-amber-400">{top1.exp} EXP</div>
              </div>
            )}

            {/* 3rd Place */}
            {top3 && (
              <div className={`p-3 rounded-2xl text-center flex flex-col items-center justify-between border ${
                top3.isUser ? 'bg-stone-900 border-amber-700' : 'bg-stone-900/90 border-stone-800'
              }`}>
                <span className="text-xs font-bold text-amber-600 mb-1">#3</span>
                <img src={top3.avatarUrl} alt={top3.name} className="w-11 h-11 rounded-full object-cover border border-amber-700 shadow-sm mb-1" />
                <div className="text-xs font-bold text-stone-100 truncate max-w-full">{top3.name}</div>
                <div className="text-[10px] text-stone-400 font-mono">{top3.tag}</div>
                <div className="mt-1 text-[11px] font-bold text-amber-400">{top3.exp} EXP</div>
              </div>
            )}
          </div>

          {/* FULL LEADERBOARD RANK LIST */}
          <div className="space-y-1.5 pt-1">
            <div className="text-xs font-bold text-stone-400 px-1">
              Full Standings ({sortedLeaderboard.length})
            </div>

            {sortedLeaderboard.map((member, idx) => {
              const rank = idx + 1;
              const isCurrentUser = member.isUser;

              return (
                <div
                  key={member.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isCurrentUser
                      ? 'bg-stone-900 border-emerald-500/60 shadow-sm'
                      : 'bg-stone-900/80 hover:bg-stone-850 border-stone-800'
                  }`}
                >
                  {/* Left: Rank, Avatar, Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center text-xs font-bold text-stone-400 font-mono">
                      #{rank}
                    </span>

                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover border border-stone-700 flex-shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-100 flex items-center gap-1.5">
                        <span className="truncate">{member.name}</span>
                        {isCurrentUser && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                            YOU
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-stone-400">
                          {member.tag}
                        </span>
                      </div>
                      <div className="text-[10px] text-stone-400 flex items-center gap-2 mt-0.5">
                        <span>Lv.{member.level}</span>
                        <span>•</span>
                        <span>{member.cityBuildings} Bldgs</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Metric & Quick Action */}
                  <div className="flex items-center gap-3 flex-shrink-0 text-right">
                    <div>
                      <div className="text-xs font-bold text-amber-400">
                        {member.exp} EXP
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        ₹{member.savingsTotal.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {!isCurrentUser && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setCompareTarget(member)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition-colors"
                          title="Compare stats"
                        >
                          <Swords className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCheer(member.id)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors"
                          title="Cheer"
                        >
                          <Heart className={`w-3.5 h-3.5 ${cheeredFriendId === member.id ? 'fill-rose-400 text-rose-400' : 'text-stone-400'}`} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 1: MY FRIENDS SQUAD LIST & COLLAB SAVINGS GOALS            */}
      {/* ================================================================= */}
      {activeSubTab === 'friends' && (
        <div className="space-y-6">
          {/* A. SQUAD GROUP SAVING & COLLAB GOALS SECTION */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900/90 to-amber-950/20 border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold font-['Outfit',sans-serif] text-stone-100 flex items-center gap-2">
                    Squad Group Savings &amp; Collab Goals
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
                      {(user.squadGoals || []).length} Active
                    </span>
                  </h4>
                  <p className="text-xs text-stone-400">
                    Save together for trips, concerts &amp; shared dreams with your squad friends!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateGoalModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Create Squad Goal
              </button>
            </div>

            {/* List of Squad Goals */}
            <div className="space-y-4">
              {(user.squadGoals || []).length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
                  <p className="text-xs text-stone-400">No active squad collab goals yet!</p>
                  <button
                    type="button"
                    onClick={() => setShowCreateGoalModal(true)}
                    className="text-xs text-amber-400 font-bold hover:underline"
                  >
                    + Create a Goa Trip or Concert Savings Goal with Friends
                  </button>
                </div>
              ) : (
                (user.squadGoals || []).map((goal) => {
                  const progressPct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

                  // Determine Titles / Badges: Master Saver & Consistent Saver
                  let maxContribution = 0;
                  let masterSaverUserId = '';
                  let maxStreak = 0;
                  let consistentSaverUserId = '';

                  goal.members.forEach((m) => {
                    if (m.contributedAmount > maxContribution) {
                      maxContribution = m.contributedAmount;
                      masterSaverUserId = m.userId;
                    }
                    if (m.streakDays > maxStreak) {
                      maxStreak = m.streakDays;
                      consistentSaverUserId = m.userId;
                    }
                  });

                  return (
                    <div
                      key={goal.id}
                      className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/40 transition-all space-y-3.5 shadow-lg"
                    >
                      {/* Top bar of goal card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">
                            {goal.title.includes('🏖️') ? '🏖️' : goal.title.includes('🎟️') ? '🎟️' : goal.title.includes('💻') ? '💻' : '🎯'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                                {goal.title}
                              </h5>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-medium border border-stone-700">
                                {goal.category}
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                              <span>Created by {goal.creatorCityId === user.tag ? 'You' : goal.creatorCityId}</span>
                              <span>•</span>
                              <span>{goal.members.length} Squad Members</span>
                            </div>
                          </div>
                        </div>

                        {/* Financial metric & Quick Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="text-left sm:text-right">
                            <div className="text-xs text-stone-400 font-medium">Goal Pool</div>
                            <div className="text-sm font-black font-mono text-emerald-400">
                              ₹{goal.currentAmount.toLocaleString('en-IN')}{' '}
                              <span className="text-xs text-stone-400 font-normal">
                                / ₹{goal.targetAmount.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setDepositGoalId(goal.id);
                                setDepositAmount(500);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Save Money
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setInviteModalGoalId(goal.id);
                                setInviteFriendInput('');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs border border-stone-700 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <UserPlus className="w-3.5 h-3.5 text-amber-400" /> Invite
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-stone-400 font-semibold">
                          <span>Group Collab Progress</span>
                          <span className="text-amber-400 font-mono font-bold">{progressPct}% Achieved</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-stone-900 border border-stone-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-teal-400 transition-all duration-500 rounded-full"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Members list with special Badges: Master Saver & Consistent Saver */}
                      <div className="pt-2 border-t border-stone-900 space-y-2">
                        <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                          Squad Contributors &amp; Titles:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {goal.members.map((mem) => {
                            const isMasterSaver = maxContribution > 0 && mem.userId === masterSaverUserId;
                            const isConsistentSaver = mem.streakDays >= 3 || (maxStreak > 0 && mem.userId === consistentSaverUserId);

                            return (
                              <div
                                key={mem.userId}
                                className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800/80 flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <img
                                    src={mem.avatarUrl}
                                    alt={mem.userName}
                                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-stone-700"
                                  />
                                  <div className="overflow-hidden leading-tight">
                                    <div className="text-xs font-bold text-stone-200 truncate flex items-center gap-1">
                                      <span>{mem.userName}</span>
                                    </div>
                                    <div className="text-[10px] text-stone-400 font-mono">
                                      {mem.cityId}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="text-xs font-bold font-mono text-emerald-300">
                                    +₹{mem.contributedAmount.toLocaleString('en-IN')}
                                  </div>
                                  
                                  {/* Special Title Badges */}
                                  <div className="flex flex-col items-end gap-0.5 mt-0.5">
                                    {isMasterSaver && (
                                      <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[9px] border border-amber-500/40 flex items-center gap-0.5 shadow-sm">
                                        <Crown className="w-2.5 h-2.5 text-amber-400" /> Master Saver
                                      </span>
                                    )}
                                    {isConsistentSaver && (
                                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-extrabold text-[9px] border border-rose-500/40 flex items-center gap-0.5 shadow-sm">
                                        <Flame className="w-2.5 h-2.5 text-rose-400" /> Consistent Saver
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* B. CONNECTED FRIENDS SQUAD LIST */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-['Outfit',sans-serif] text-stone-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Connected Squad Members ({user.squad.length})
            </h4>

            {/* Your City ID Summary Bar */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-stone-900 to-teal-950/30 border border-emerald-500/25 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 font-medium">
                    Your Unique City ID (Share with friends)
                  </div>
                  <div className="text-sm font-black font-mono text-emerald-300">
                    {user.tag}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyOwnId}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedCityId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSubTab('add')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add by City ID</span>
                </button>
              </div>
            </div>

            {/* Friends List Cards */}
            <div className="space-y-2.5">
              {user.squad.length === 0 ? (
                <div className="p-8 text-center rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-stone-800 flex items-center justify-center text-stone-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-200">No Friends Connected Yet</h4>
                  <p className="text-xs text-stone-400 max-w-xs mx-auto">
                    Add friends using their unique City ID or accept pending invitations to start building together!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('add')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-stone-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
                  >
                    Enter Friend's City ID
                  </button>
                </div>
              ) : (
                user.squad.map((member, idx) => (
                  <div
                    key={member.id}
                    className="p-3.5 rounded-2xl bg-stone-900/90 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Friend identity */}
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center text-xs font-black text-stone-500">
                        #{idx + 1}
                      </span>
                      <div className="relative">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400/40 shadow-sm"
                        />
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-stone-900 ${
                          member.status === 'online'
                            ? 'bg-emerald-400'
                            : member.status === 'saving'
                            ? 'bg-amber-400'
                            : 'bg-stone-500'
                        }`} />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-stone-200 flex items-center gap-2">
                          <span>{member.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-emerald-400 font-mono font-bold border border-stone-700">
                            {member.tag}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-400 flex items-center gap-2 mt-0.5">
                          <span>Lv.{member.level} Citizen</span>
                          <span className="text-stone-600">•</span>
                          <span className="flex items-center gap-1 text-stone-300">
                            <Building className="w-3 h-3 text-emerald-400" />
                            {member.cityBuildings} Buildings
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" />
                          {member.exp?.toLocaleString('en-US') || 0} EXP
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCheer(member.id)}
                        className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 text-xs font-bold cursor-pointer"
                        title="Cheer friend"
                      >
                        <Heart className={`w-3.5 h-3.5 ${cheeredFriendId === member.id ? 'fill-rose-400 text-rose-400' : 'text-stone-400'}`} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 2: ADD FRIEND BY CITY ID                                  */}
      {/* ================================================================= */}
      {activeSubTab === 'add' && (
        <div className="space-y-4">
          {/* Card 1: Your Unique City ID */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950/40 border border-emerald-500/30 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Your Unique City ID
                </span>
                <h4 className="text-xl font-black font-mono text-white mt-0.5">
                  {user.tag}
                </h4>
                <p className="text-xs text-stone-400 mt-1 max-w-sm">
                  Automatically assigned to your urban plot. Friends can enter this ID below to send you a connection invite!
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyOwnId}
                className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex-shrink-0"
              >
                {copiedCityId ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>City ID Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Your City ID</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Input Box to Add Friend by City ID */}
          <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Enter Friend's City ID
              </h4>
            </div>
            <p className="text-xs text-stone-400">
              Enter your friend's unique City ID (e.g. <span className="text-emerald-300 font-mono">CTY-4019</span> or <span className="text-emerald-300 font-mono">CTY-3390</span>) to send them an invitation.
            </p>

            <form onSubmit={handleSendInviteSubmit} className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inputCityId}
                    onChange={(e) => setInputCityId(e.target.value.toUpperCase())}
                    placeholder="e.g. CTY-4019 or CTY-3390"
                    maxLength={15}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700 text-xs font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-500 uppercase transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20 flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Invitation</span>
                </button>
              </div>

              {/* Feedback alert */}
              {formFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    formFeedback.type === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {formFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  )}
                  <div className="flex-1">{formFeedback.message}</div>
                  {formFeedback.type === 'success' && (
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('invitations')}
                      className="text-[11px] font-bold underline hover:text-white"
                    >
                      View Invitations
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Card 3: Quick Add / Active Citizens Directory */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Active City Builders (Quick Invite)</span>
              </h5>
              <span className="text-[11px] text-stone-500">Tap to send invitation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {KNOWN_CITIZENS.map((cit) => {
                const isAlreadyFriend = user.squad.some((m) => m.tag.toUpperCase() === cit.cityId.toUpperCase());
                const isInvited = invitations.some(
                  (inv) => inv.toCityId.toUpperCase() === cit.cityId.toUpperCase() && inv.status === 'pending'
                );

                return (
                  <div
                    key={cit.id}
                    className="p-3 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-2.5 hover:border-stone-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={cit.avatarUrl}
                        alt={cit.name}
                        className="w-9 h-9 rounded-full object-cover border border-emerald-400/40 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{cit.name}</div>
                        <div className="text-[10px] font-mono font-semibold text-emerald-400">
                          {cit.cityId}
                        </div>
                        <div className="text-[9px] text-stone-400">
                          Lv.{cit.level} • {cit.cityBuildings} Buildings
                        </div>
                      </div>
                    </div>

                    <div>
                      {isAlreadyFriend ? (
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                          Connected
                        </span>
                      ) : isInvited ? (
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                          Pending
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuickInvite(cit)}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-emerald-500 hover:text-stone-950 text-stone-200 border border-stone-700 hover:border-emerald-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 flex-shrink-0"
                        >
                          <Send className="w-3 h-3" />
                          <span>Invite</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 3: INVITATIONS (ACCEPT / DECLINE & SIMULATE ACCEPTANCE)     */}
      {/* ================================================================= */}
      {activeSubTab === 'invitations' && (
        <div className="space-y-5">
          {/* SECTION A: INCOMING INVITATIONS (FROM FRIENDS TO YOU) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Incoming Invitations ({incomingPending.length})</span>
              </h4>
              <span className="text-[11px] text-stone-400">
                Citizens who want to connect with your city
              </span>
            </div>

            {incomingPending.length === 0 ? (
              <div className="p-4 text-center rounded-2xl bg-stone-900/60 border border-stone-800/80 text-xs text-stone-400">
                No pending incoming invitations right now.
              </div>
            ) : (
              <div className="space-y-2">
                {incomingPending.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={inv.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={inv.fromName}
                        className="w-10 h-10 rounded-full object-cover border border-emerald-400/40"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{inv.fromName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-emerald-400 font-mono">
                            {inv.fromCityId}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Lv.{inv.level || 2} • {inv.cityBuildings || 3} Buildings • {inv.date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => onDeclineInvitation(inv.id)}
                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-400 hover:text-white text-xs font-semibold border border-stone-700 transition-all cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => onAcceptInvitation(inv.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Invitation</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION B: SENT INVITATIONS (WHERE FRIEND ACCEPTS INVITATION) */}
          <div className="space-y-3 pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sent Invitations ({outgoingPending.length})</span>
                </h4>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Friends accept your request here to complete the connection!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('add')}
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>+ Invite Another</span>
              </button>
            </div>

            {outgoingPending.length === 0 ? (
              <div className="p-4 text-center rounded-2xl bg-stone-900/60 border border-stone-800/80 text-xs text-stone-400 space-y-1">
                <div>No pending sent invitations.</div>
                <div className="text-[11px] text-stone-500">
                  Go to "Add Friend" and enter a friend's City ID to test the invite & accept workflow.
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {outgoingPending.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-2xl bg-stone-900 border border-amber-500/20 bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 font-black text-xs font-mono">
                        {inv.toCityId.slice(0, 4)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{inv.toName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-amber-300 font-mono font-bold">
                            {inv.toCityId}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          <span className="text-amber-300/90 font-medium">Awaiting Friend's Acceptance</span>
                          <span className="text-stone-600">•</span>
                          <span>Sent {inv.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive "Friend Accepts Invitation" Trigger */}
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => onSimulateFriendAccept(inv.id)}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                        title="Simulate the friend accepting this invitation from their City ID"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Invitation (Friend View)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* HEAD-TO-HEAD COMPARISON MODAL */}
      <AnimatePresence>
        {compareTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-amber-400" />
                  <h4 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                    Head-to-Head City Rivalry
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setCompareTarget(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rivalry Comparison Header */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-850 rounded-2xl border border-stone-750 text-center">
                {/* User */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={userEntry.avatarUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-md mb-1"
                    />
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-emerald-500 text-stone-950 text-[9px] font-black px-1.5 rounded-full">
                      YOU
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate max-w-full">{user.name}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">{user.tag}</div>
                </div>

                {/* Friend Target */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={compareTarget.avatarUrl}
                      alt={compareTarget.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md mb-1"
                    />
                  </div>
                  <div className="text-xs font-bold text-white truncate max-w-full">{compareTarget.name}</div>
                  <div className="text-[10px] text-amber-400 font-mono">{compareTarget.tag}</div>
                </div>
              </div>

              {/* Stats Comparison Bars */}
              <div className="space-y-2.5 text-xs">
                {/* EXP Metric */}
                <div className="p-2.5 bg-stone-800/80 rounded-xl">
                  <div className="flex justify-between font-bold text-stone-300 mb-1">
                    <span className={user.exp >= compareTarget.exp ? 'text-emerald-400' : 'text-stone-400'}>
                      {user.exp} EXP
                    </span>
                    <span className="text-[10px] uppercase text-stone-400">⚡ Total EXP</span>
                    <span className={compareTarget.exp >= user.exp ? 'text-amber-400' : 'text-stone-400'}>
                      {compareTarget.exp} EXP
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-700 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{
                        width: `${Math.max(10, Math.min(90, (user.exp / (user.exp + compareTarget.exp || 1)) * 100))}%`,
                      }}
                    />
                    <div
                      className="bg-amber-500 h-full"
                      style={{
                        width: `${Math.max(10, Math.min(90, (compareTarget.exp / (user.exp + compareTarget.exp || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Buildings Metric */}
                <div className="p-2.5 bg-stone-800/80 rounded-xl">
                  <div className="flex justify-between font-bold text-stone-300 mb-1">
                    <span className={userCompletedBuildings >= compareTarget.cityBuildings ? 'text-emerald-400' : 'text-stone-400'}>
                      {userCompletedBuildings} Buildings
                    </span>
                    <span className="text-[10px] uppercase text-stone-400">🏙️ Buildings</span>
                    <span className={compareTarget.cityBuildings >= userCompletedBuildings ? 'text-amber-400' : 'text-stone-400'}>
                      {compareTarget.cityBuildings} Buildings
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-700 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{
                        width: `${Math.max(10, Math.min(90, ((userCompletedBuildings || 1) / ((userCompletedBuildings || 1) + (compareTarget.cityBuildings || 1))) * 100))}%`,
                      }}
                    />
                    <div
                      className="bg-amber-500 h-full"
                      style={{
                        width: `${Math.max(10, Math.min(90, ((compareTarget.cityBuildings || 1) / ((userCompletedBuildings || 1) + (compareTarget.cityBuildings || 1))) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Savings Metric */}
                <div className="p-2.5 bg-stone-800/80 rounded-xl">
                  <div className="flex justify-between font-bold text-stone-300 mb-1">
                    <span className={user.totalSavings >= compareTarget.savingsTotal ? 'text-emerald-400' : 'text-stone-400'}>
                      ₹{user.totalSavings.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] uppercase text-stone-400">💰 Savings</span>
                    <span className={compareTarget.savingsTotal >= user.totalSavings ? 'text-amber-400' : 'text-stone-400'}>
                      ₹{compareTarget.savingsTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Motivational Advice */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                {user.exp > compareTarget.exp ? (
                  <span>🏆 <strong>You lead in EXP!</strong> Save more to increase your lead and maintain #1 ranking.</span>
                ) : (
                  <span>
                    ⚔️ <strong>Target to surpass {compareTarget.name}:</strong> Earn <strong>{compareTarget.exp - user.exp + 1} more EXP</strong> by completing building stages or depositing savings!
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setCompareTarget(null)}
                className="w-full py-2.5 rounded-xl bg-stone-800 text-stone-200 text-xs font-bold hover:bg-stone-750 transition-colors"
              >
                Close Comparison
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Visited Citizen Skyline Modal */}
      <AnimatePresence>
        {visitedCitizen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-stone-900 border border-stone-700 rounded-3xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={visitedCitizen.avatarUrl}
                    alt={visitedCitizen.name}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{visitedCitizen.name}'s City</h4>
                    <div className="text-xs font-mono text-emerald-400">{visitedCitizen.tag}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setVisitedCitizen(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* City Stats */}
              <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-stone-800/80">
                <div>
                  <div className="text-[10px] text-stone-400">Level</div>
                  <div className="text-sm font-bold text-white">{visitedCitizen.level}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400">Buildings</div>
                  <div className="text-sm font-bold text-emerald-400">{visitedCitizen.cityBuildings}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400">EXP</div>
                  <div className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3" />
                    {visitedCitizen.exp?.toLocaleString('en-US') || 0}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400">Hearts</div>
                  <div className="text-xs font-bold text-rose-400 flex items-center justify-center gap-1">
                    <Heart className="w-3 h-3 fill-rose-400" />
                    {visitedCitizen.hearts?.toLocaleString('en-US') || 0}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 text-center">
                ✨ Connected District: Cooperative savings boost unlocked!
              </div>

              <button
                type="button"
                onClick={() => setVisitedCitizen(null)}
                className="w-full py-2.5 rounded-xl bg-stone-800 text-stone-200 text-xs font-bold hover:bg-stone-750 transition-colors"
              >
                Close City View
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Squad Collab Goal Modal */}
      <AnimatePresence>
        {showCreateGoalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-stone-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Target className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-bold text-white">Create Squad Collab Goal</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateGoalModal(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newGoalTitle.trim() || newGoalTarget <= 0) return;

                  const invitedMembers = user.squad
                    .filter((m) => selectedInviteFriendIds.includes(m.id))
                    .map((m) => ({ name: m.name, cityId: m.tag, avatarUrl: m.avatarUrl }));

                  if (customInviteCityId.trim()) {
                    invitedMembers.push({
                      name: customInviteCityId.trim(),
                      cityId: customInviteCityId.trim().toUpperCase(),
                    });
                  }

                  if (onCreateSquadGoal) {
                    onCreateSquadGoal(
                      newGoalTitle.trim(),
                      newGoalTarget,
                      newGoalCategory,
                      invitedMembers
                    );
                  }

                  confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.7 },
                    colors: ['#f59e0b', '#10b981', '#38bdf8'],
                  });

                  setShowCreateGoalModal(false);
                  setNewGoalTitle('Goa Trip Collab Savings 🏖️');
                  setNewGoalTarget(20000);
                  setSelectedInviteFriendIds([]);
                  setCustomInviteCityId('');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Goal Name / Purpose
                  </label>
                  <input
                    type="text"
                    required
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder="e.g. Goa Trip Savings 🏖️, Concert 🎟️, Gaming Rig 💻"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white outline-none focus:border-amber-400 placeholder:text-stone-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">
                      Target Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={newGoalTarget}
                      onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                      className="w-full py-2.5 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white font-mono outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">
                      Category
                    </label>
                    <select
                      value={newGoalCategory}
                      onChange={(e) => setNewGoalCategory(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="Travel">🏖️ Travel &amp; Trips</option>
                      <option value="Entertainment">🎟️ Concerts &amp; Outings</option>
                      <option value="Electronics">💻 Gadgets &amp; Tech</option>
                      <option value="General">🛡️ Group Contingency</option>
                    </select>
                  </div>
                </div>

                {/* Invite Friends Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-300">
                    Invite Squad Friends to Collab:
                  </label>
                  {user.squad.length === 0 ? (
                    <p className="text-[11px] text-stone-500 italic">No connected friends yet. You can invite via City ID below!</p>
                  ) : (
                    <div className="max-h-32 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-stone-950 border border-stone-800">
                      {user.squad.map((friend) => {
                        const isChecked = selectedInviteFriendIds.includes(friend.id);
                        return (
                          <label
                            key={friend.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-stone-900 hover:bg-stone-850 cursor-pointer text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <img src={friend.avatarUrl} alt={friend.name} className="w-6 h-6 rounded-full object-cover" />
                              <span className="font-bold text-white">{friend.name}</span>
                              <span className="text-[10px] text-emerald-400 font-mono">{friend.tag}</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedInviteFriendIds((prev) => prev.filter((id) => id !== friend.id));
                                } else {
                                  setSelectedInviteFriendIds((prev) => [...prev, friend.id]);
                                }
                              }}
                              className="accent-amber-400 w-4 h-4 cursor-pointer"
                            />
                          </label>
                        );
                      })}
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      value={customInviteCityId}
                      onChange={(e) => setCustomInviteCityId(e.target.value)}
                      placeholder="Or enter Friend City ID (e.g. CTY-8820)"
                      className="w-full py-2 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300 outline-none focus:border-amber-400 placeholder:text-stone-600 mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateGoalModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 text-xs font-black transition-colors shadow-md shadow-amber-500/20"
                  >
                    Start Collab Goal 🚀
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invite Friend to Existing Squad Goal Modal */}
      <AnimatePresence>
        {inviteModalGoalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-stone-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-amber-400" /> Invite Friend to Squad Goal
                </h4>
                <button
                  type="button"
                  onClick={() => setInviteModalGoalId(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Select Friend from Squad List
                  </label>
                  <select
                    value={inviteFriendInput}
                    onChange={(e) => setInviteFriendInput(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="">-- Choose Friend or type ID --</option>
                    {user.squad.map((f) => (
                      <option key={f.id} value={f.tag} className="bg-stone-900 text-white">
                        {f.name} ({f.tag})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Or Enter City ID directly:
                  </label>
                  <input
                    type="text"
                    value={inviteFriendInput}
                    onChange={(e) => setInviteFriendInput(e.target.value)}
                    placeholder="e.g. CTY-8820"
                    className="w-full py-2 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white outline-none focus:border-amber-400 placeholder:text-stone-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!inviteFriendInput.trim()) return;
                    if (onInviteToSquadGoal && inviteModalGoalId) {
                      onInviteToSquadGoal(inviteModalGoalId, inviteFriendInput.trim().toUpperCase());
                    }
                    setInviteModalGoalId(null);
                    setInviteFriendInput('');
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 text-xs font-black transition-colors"
                >
                  Send Squad Goal Invite 📩
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Deposit to Squad Goal Modal */}
      <AnimatePresence>
        {depositGoalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-stone-900 border border-emerald-500/40 rounded-3xl p-5 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <PiggyBank className="w-4 h-4 text-emerald-400" /> Save Money to Squad Goal
                </h4>
                <button
                  type="button"
                  onClick={() => setDepositGoalId(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Contribution Amount (₹)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full py-2.5 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-emerald-300 font-mono font-bold outline-none focus:border-emerald-400"
                  />
                  <div className="flex gap-1.5 mt-2">
                    {[100, 250, 500, 1000, 2000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setDepositAmount(preset)}
                        className="py-1 px-2 rounded-lg bg-stone-800 text-[10px] font-bold text-stone-300 hover:text-white border border-stone-700"
                      >
                        +₹{preset}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (depositAmount <= 0) return;
                    const targetGoal = user.squadGoals?.find((sg) => sg.id === depositGoalId);
                    if (onAddTransaction) {
                      onAddTransaction({
                        type: 'save',
                        amount: depositAmount,
                        category: `Squad: ${targetGoal?.title || 'Collab Goal'}`,
                        categoryType: 'Savings',
                        description: `Deposit into ${targetGoal?.title || 'Squad Goal'}`,
                        paymentMethod: 'UPI',
                        date: 'Just now',
                        squadGoalId: depositGoalId,
                        squadGoalTitle: targetGoal?.title,
                      });
                    }
                    confetti({
                      particleCount: 50,
                      spread: 60,
                      origin: { y: 0.7 },
                      colors: ['#10b981', '#fbbf24'],
                    });
                    setDepositGoalId(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-stone-950 text-xs font-black transition-colors"
                >
                  Deposit &amp; Earn EXP 🚀
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

