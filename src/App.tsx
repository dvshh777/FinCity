/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  BookOpen,
  Sprout,
} from 'lucide-react';
import { ScreenStep, MobileTab, UserState, BuildingPlot, FriendInvitation, SquadMember } from './types';
import { INITIAL_USER_STATE, INITIAL_BUILDINGS, getOrCreateUniqueCityId, KNOWN_CITIZENS } from './data/mockData';
import { getNextStageCost, getCompletionRewardExp, getBuildingConfig, BuildingStyle } from './utils/buildingPricing';
import { MobileSimulator } from './components/MobileSimulator';
import { DesktopDashboard } from './components/DesktopDashboard';
import { DesignPatternsModal } from './components/DesignPatternsModal';
import { FloatingAssistantPopup } from './components/FloatingAssistantPopup';

export default function App() {
  // Primary View Mode: 'mobile' (14-step flow simulator) or 'desktop' (full responsive web app)
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  // Mobile Flow Step (1 to 14)
  const [mobileStep, setMobileStep] = useState<ScreenStep>(1);
  const [mobileTab, setMobileTab] = useState<MobileTab>('city');

  // In-app Architecture & Design Patterns Explainer Modal
  const [showPatternsModal, setShowPatternsModal] = useState(false);

  // Core Synchronized User State - Unique City ID is created automatically at the start and is permanent
  const [user, setUser] = useState<UserState>(() => {
    const uniqueCityId = getOrCreateUniqueCityId();
    return {
      ...INITIAL_USER_STATE,
      name: 'Abhi',
      tag: uniqueCityId,
      age: 21,
      occupation: 'student',
      pocketMoneyFrequency: 'monthly',
      pocketMoneyAmount: 5000,
      monthlyIncome: 5000,
      budgetNeeds: 2500,
      budgetWants: 1500,
      budgetSavings: 1000,
      totalSavings: 0,
      availableBuildFunds: 0,
      buildingsCount: 0,
      exp: 10,
      hearts: 100,
    };
  });

  // Handler: Change Name (City ID is permanent, unique, and cannot be changed)
  const handleChangeName = (newName: string) => {
    setUser((prev) => ({ ...prev, name: newName }));
  };

  // Handler: Update Full Profile (Username, Monthly Income, Budget Split — City ID is permanent)
  const handleUpdateProfile = (updates: {
    name: string;
    tag?: string;
    monthlyIncome: number;
    budgetNeeds: number;
    budgetWants: number;
    budgetSavings: number;
  }) => {
    setUser((prev) => ({
      ...prev,
      name: updates.name,
      // City ID is permanent and cannot be changed
      tag: prev.tag,
      monthlyIncome: updates.monthlyIncome,
      budgetNeeds: updates.budgetNeeds,
      budgetWants: updates.budgetWants,
      budgetSavings: updates.budgetSavings,
    }));
  };

  // Handler: Change Age
  const handleChangeAge = (newAge: number) => {
    setUser((prev) => ({ ...prev, age: newAge }));
  };

  // Handler: Change Occupation (Student / Employee)
  const handleChangeOccupation = (newOccupation: 'student' | 'employee') => {
    setUser((prev) => {
      if (newOccupation === 'student') {
        const pocketAmt = prev.pocketMoneyAmount || 5000;
        const freq = prev.pocketMoneyFrequency || 'monthly';
        let monthly = pocketAmt;
        if (freq === 'daily') monthly = pocketAmt * 30;
        else if (freq === 'weekly') monthly = Math.round(pocketAmt * 4.33);

        const needs = Math.round(monthly * 0.5);
        const wants = Math.round(monthly * 0.3);
        const savings = monthly - needs - wants;

        return {
          ...prev,
          occupation: newOccupation,
          pocketMoneyFrequency: freq,
          pocketMoneyAmount: pocketAmt,
          monthlyIncome: monthly,
          budgetNeeds: needs,
          budgetWants: wants,
          budgetSavings: savings,
        };
      } else {
        const salary = prev.monthlyIncome >= 15000 ? prev.monthlyIncome : 25000;
        const needs = Math.round(salary * 0.5);
        const wants = Math.round(salary * 0.3);
        const savings = salary - needs - wants;

        return {
          ...prev,
          occupation: newOccupation,
          monthlyIncome: salary,
          budgetNeeds: needs,
          budgetWants: wants,
          budgetSavings: savings,
        };
      }
    });
  };

  // Handler: Change Pocket Money (Frequency & Amount) for Students
  const handleChangePocketMoney = (
    frequency: 'monthly' | 'weekly' | 'daily',
    amount: number
  ) => {
    let monthlyEquiv = amount;
    if (frequency === 'daily') monthlyEquiv = amount * 30;
    else if (frequency === 'weekly') monthlyEquiv = Math.round(amount * 4.33);

    const needs = Math.round(monthlyEquiv * 0.5);
    const wants = Math.round(monthlyEquiv * 0.3);
    const savings = monthlyEquiv - needs - wants;

    setUser((prev) => ({
      ...prev,
      pocketMoneyFrequency: frequency,
      pocketMoneyAmount: amount,
      monthlyIncome: monthlyEquiv,
      budgetNeeds: needs,
      budgetWants: wants,
      budgetSavings: savings,
    }));
  };

  // Handler: Change Monthly Income (for Employees)
  const handleChangeIncome = (newIncome: number) => {
    const needs = Math.round(newIncome * 0.5);
    const wants = Math.round(newIncome * 0.3);
    const savings = newIncome - needs - wants;
    setUser((prev) => ({
      ...prev,
      monthlyIncome: newIncome,
      budgetNeeds: needs,
      budgetWants: wants,
      budgetSavings: savings,
    }));
  };

  // Handler: Change Budget Split (Needs & Wants manual, Savings calculated automatically)
  const handleChangeBudget = (needs: number, wants: number, savings: number) => {
    setUser((prev) => ({
      ...prev,
      budgetNeeds: needs,
      budgetWants: wants,
      budgetSavings: savings,
    }));
  };

  // Handler: Select Savings Goal
  const handleSelectGoal = (goalId: string) => {
    setUser((prev) => ({ ...prev, selectedGoalId: goalId }));
  };

  // Handler: Update Goal Target Amount
  const handleUpdateGoalAmount = (goalId: string, amount: number) => {
    setUser((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, targetAmount: amount } : g
      ),
    }));
  };

  // Handler: Update Goal Name (especially for custom goal)
  const handleUpdateGoalName = (goalId: string, name: string) => {
    setUser((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, name } : g
      ),
    }));
  };

  // Handler: Select Assistant Guide (6 types)
  const handleSelectAssistant = (assistantId: string) => {
    setUser((prev) => ({ ...prev, selectedAssistantId: assistantId }));
  };

  // Handler: Add Transaction (Spend, Earn, or Save)
  const handleAddTransaction = (newTxData: {
    type: 'earn' | 'spend' | 'save';
    amount: number;
    category: string;
    categoryType?: 'Needs' | 'Wants' | 'Savings' | 'Income';
    description: string;
    paymentMethod?: string;
    date?: string;
    squadGoalId?: string;
    squadGoalTitle?: string;
  }) => {
    setUser((prev) => {
      const isFirstSave = prev.totalSavings === 0 && newTxData.type === 'save';
      const txAmount = Number(newTxData.amount) || 0;

      const newTx = {
        id: `tx-${Date.now()}`,
        amount: txAmount,
        type: newTxData.type,
        category: newTxData.category,
        categoryType: newTxData.categoryType,
        description: newTxData.description || `${newTxData.type.toUpperCase()} Entry`,
        date: newTxData.date || 'Just now',
        timestamp: Date.now(),
        paymentMethod: newTxData.paymentMethod || 'UPI',
        squadGoalId: newTxData.squadGoalId,
        squadGoalTitle: newTxData.squadGoalTitle,
      };

      let newSavings = prev.totalSavings;
      let newAvailable = prev.availableBuildFunds;
      let newHearts = prev.hearts;
      let newExp = prev.exp;
      let updatedBuildings = prev.buildings;
      let newBuildingsCount = prev.buildingsCount;

      let newStreakDays = prev.savingStreakDays || 0;
      let newTreesCount = prev.treesCount ?? 2;
      let newStreetLightsCount = prev.streetLightsCount ?? 0;

      if (newTxData.type === 'save') {
        newSavings += txAmount;
        newAvailable += txAmount;
        newHearts = 100;
        newExp += isFirstSave ? 50 : 25;

        // Streak & Growth Logic (Personal City)
        newStreakDays += 1;
        if (newStreakDays >= 3) {
          if (newTreesCount < 5) {
            newTreesCount += 1;
          } else if (newStreetLightsCount < 5) {
            newStreetLightsCount += 1;
          }
        }

        if (isFirstSave) {
          updatedBuildings = prev.buildings.map((b) => {
            if (b.id === 'plot-1') {
              return {
                ...b,
                stage: 3,
                status: 'built' as const,
                name: 'Cozy Twilight Cottage',
                buildingStyle: 'cottage' as const,
              };
            }
            return b;
          });
          newBuildingsCount = 1;
        }
      } else if (newTxData.type === 'earn') {
        newExp += 15;
      } else if (newTxData.type === 'spend') {
        newExp += 5;

        // Overspending / Money Wasting Penalty (Personal City Degradation)
        if (newTreesCount > 0) {
          newTreesCount -= 1;
        } else if (newStreetLightsCount > 0) {
          newStreetLightsCount -= 1;
        } else {
          // Remove top layer of a constructed building (stage 3 -> 2 -> 1 -> 0)
          let degraded = false;
          updatedBuildings = prev.buildings.map((b) => {
            if (!degraded && b.stage > 0) {
              degraded = true;
              const nextStage = (b.stage - 1) as 0 | 1 | 2 | 3;
              return {
                ...b,
                stage: nextStage,
                status: nextStage === 0 ? ('locked' as const) : ('constructing' as const),
              };
            }
            return b;
          });
        }
      }

      // If squad goal ID is specified, update squad goal member contribution, group streak, trees, and degradation
      let updatedSquadGoals = prev.squadGoals || [];
      if (newTxData.squadGoalId) {
        updatedSquadGoals = updatedSquadGoals.map((sg) => {
          if (sg.id === newTxData.squadGoalId) {
            const hasUser = sg.members.some((m) => m.userId === 'you' || m.cityId === prev.tag);
            let updatedMembers = sg.members;
            let groupStreak = (sg.groupStreakDays || 0);
            let groupTrees = sg.treesCount ?? 2;
            let groupLights = sg.streetLightsCount ?? 0;
            let groupFunds = (sg.availableBuildFunds || 0);
            let groupBuildings = sg.buildings || INITIAL_BUILDINGS.map((b) => ({ ...b, id: `group_${sg.id}_${b.id}` }));

            if (newTxData.type === 'save') {
              groupStreak += 1;
              groupFunds += txAmount;
              if (groupStreak >= 3) {
                if (groupTrees < 5) groupTrees += 1;
                else if (groupLights < 5) groupLights += 1;
              }
            } else if (newTxData.type === 'spend') {
              if (groupTrees > 0) groupTrees -= 1;
              else if (groupLights > 0) groupLights -= 1;
              else {
                let deg = false;
                groupBuildings = groupBuildings.map((gb) => {
                  if (!deg && gb.stage > 0) {
                    deg = true;
                    const ns = (gb.stage - 1) as 0 | 1 | 2 | 3;
                    return { ...gb, stage: ns, status: ns === 0 ? ('locked' as const) : ('constructing' as const) };
                  }
                  return gb;
                });
              }
            }

            if (hasUser) {
              updatedMembers = sg.members.map((m) => {
                if (m.userId === 'you' || m.cityId === prev.tag) {
                  return {
                    ...m,
                    contributedAmount: m.contributedAmount + txAmount,
                    lastSavedDate: 'Just now',
                    streakDays: m.streakDays + 1,
                  };
                }
                return m;
              });
            } else {
              updatedMembers = [
                ...sg.members,
                {
                  userId: 'you',
                  userName: `${prev.name} (You)`,
                  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                  cityId: prev.tag,
                  contributedAmount: txAmount,
                  lastSavedDate: 'Just now',
                  streakDays: 1,
                },
              ];
            }

            return {
              ...sg,
              currentAmount: sg.currentAmount + txAmount,
              availableBuildFunds: groupFunds,
              groupStreakDays: groupStreak,
              treesCount: groupTrees,
              streetLightsCount: groupLights,
              buildings: groupBuildings,
              members: updatedMembers,
            };
          }
          return sg;
        });
      }

      return {
        ...prev,
        totalSavings: newSavings,
        availableBuildFunds: newAvailable,
        savingStreakDays: newStreakDays,
        treesCount: newTreesCount,
        streetLightsCount: newStreetLightsCount,
        hearts: newHearts,
        exp: newExp,
        buildings: updatedBuildings,
        buildingsCount: newBuildingsCount,
        transactions: [newTx, ...prev.transactions],
        squadGoals: updatedSquadGoals,
      };
    });
  };

  // Handler: Create Squad Collab Goal
  const handleCreateSquadGoal = (
    title: string,
    targetAmount: number,
    category: string,
    initialMembers: { name: string; cityId: string; avatarUrl?: string }[] = []
  ) => {
    setUser((prev) => {
      const newGoalId = `squad-goal-${Date.now()}`;
      const defaultUserMember = {
        userId: 'you',
        userName: `${prev.name} (You)`,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        cityId: prev.tag,
        contributedAmount: 0,
        lastSavedDate: 'Just now',
        streakDays: 1,
      };

      const invitedMembers = initialMembers.map((m, idx) => ({
        userId: `mem-${Date.now()}-${idx}`,
        userName: m.name,
        avatarUrl: m.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        cityId: m.cityId,
        contributedAmount: 0,
        lastSavedDate: 'Never',
        streakDays: 0,
      }));

      const newGoal = {
        id: newGoalId,
        title,
        targetAmount,
        currentAmount: 0,
        category: category || 'Collab Group Goal',
        createdAt: new Date().toISOString().split('T')[0],
        creatorCityId: prev.tag,
        members: [defaultUserMember, ...invitedMembers],
      };

      return {
        ...prev,
        squadGoals: [newGoal, ...(prev.squadGoals || [])],
        exp: prev.exp + 20,
      };
    });
  };

  // Handler: Invite Friend to Squad Goal
  const handleInviteToSquadGoal = (squadGoalId: string, friendCityId: string, friendName?: string) => {
    setUser((prev) => {
      const targetFriend = prev.squad.find((f) => f.tag === friendCityId || f.name.toLowerCase() === friendCityId.toLowerCase());
      const nameToAdd = friendName || targetFriend?.name || friendCityId;
      const avatarToAdd = targetFriend?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

      const updatedGoals = (prev.squadGoals || []).map((sg) => {
        if (sg.id === squadGoalId) {
          const alreadyIn = sg.members.some((m) => m.cityId === friendCityId || m.userName === nameToAdd);
          if (alreadyIn) return sg;
          return {
            ...sg,
            members: [
              ...sg.members,
              {
                userId: `mem-${Date.now()}`,
                userName: nameToAdd,
                avatarUrl: avatarToAdd,
                cityId: friendCityId,
                contributedAmount: 0,
                lastSavedDate: 'Just invited',
                streakDays: 0,
              },
            ],
          };
        }
        return sg;
      });

      return {
        ...prev,
        squadGoals: updatedGoals,
      };
    });
  };

  // Handler: Add Savings / Deposit (Wrapper for backward compatibility)
  const handleAddSavings = (amount: number, desc: string) => {
    handleAddTransaction({
      type: 'save',
      amount,
      category: 'FinCity Growth Vault',
      categoryType: 'Savings',
      description: desc || 'City Expansion Deposit',
      paymentMethod: 'UPI',
      date: 'Just now',
    });
  };

  // Handler: Miss a Savings Day (Streak Broken)
  const handleMissDay = () => {
    setUser((prev) => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 10),
    }));
  };

  // Handler: Upgrade/Build Plot with Custom Name & Style with Tiered Stage Pricing
  const handleUpgradePlot = (
    plotId: string,
    cost?: number,
    customName?: string,
    buildingStyle?: BuildingStyle,
    districtId?: string,
    squadGoalId?: string
  ) => {
    const targetDistrict = districtId || 'orientation_park';
    setUser((prev) => {
      // If upgrading inside a Group Squad Goal City
      if (squadGoalId) {
        const targetGoal = (prev.squadGoals || []).find((g) => g.id === squadGoalId);
        if (!targetGoal) return prev;

        const groupPlots = targetGoal.buildings || INITIAL_BUILDINGS.map((b) => ({ ...b, id: `group_${squadGoalId}_${b.id}` }));
        const targetPlot = groupPlots.find((b) => b.id === plotId || b.id.endsWith(plotId));
        if (!targetPlot || (targetPlot.stage || 0) >= 3) return prev;

        const chosenStyle = buildingStyle || targetPlot.buildingStyle || 'cottage';
        const actualCost = typeof cost === 'number' && cost > 0
          ? cost
          : getNextStageCost(targetPlot, chosenStyle);

        const availableGroupFunds = targetGoal.availableBuildFunds ?? 0;
        if (availableGroupFunds < actualCost) return prev; // Not enough group funds

        const config = getBuildingConfig(chosenStyle);
        const updatedGroupPlots = groupPlots.map((b) => {
          if (b.id === targetPlot.id) {
            const nextStage = Math.min((b.stage || 0) + 1, 3) as 0 | 1 | 2 | 3;
            const chosenName =
              customName && customName.trim().length > 0
                ? customName.trim()
                : b.name.startsWith('Available Plot')
                ? `${config.name}`
                : b.name;

            return {
              ...b,
              stage: nextStage,
              status: nextStage > 0 ? ('built' as const) : b.status,
              name: chosenName,
              buildingStyle: chosenStyle,
              dailyExp: config.dailyExp,
              xpValue: config.xpValue,
            };
          }
          return b;
        });

        const updatedSquadGoals = (prev.squadGoals || []).map((sg) => {
          if (sg.id === squadGoalId) {
            return {
              ...sg,
              availableBuildFunds: availableGroupFunds - actualCost,
              buildings: updatedGroupPlots,
            };
          }
          return sg;
        });

        return {
          ...prev,
          squadGoals: updatedSquadGoals,
        };
      }

      // Otherwise upgrading in Personal Savings City
      const districtPlots = prev.districtBuildings?.[targetDistrict] || prev.buildings || INITIAL_BUILDINGS;
      const targetPlot = districtPlots.find((b) => b.id === plotId);
      if (!targetPlot || (targetPlot.stage || 0) >= 3) return prev;

      const chosenStyle = buildingStyle || targetPlot.buildingStyle || 'cottage';
      const actualCost = typeof cost === 'number' && cost > 0
        ? cost
        : getNextStageCost(targetPlot, chosenStyle);

      if (prev.availableBuildFunds < actualCost) return prev; // Not enough personal funds

      let isFinished = false;
      const config = getBuildingConfig(chosenStyle);
      const completionExpReward = getCompletionRewardExp(targetPlot, chosenStyle);

      const updatedDistrictPlots = districtPlots.map((b) => {
        if (b.id === plotId) {
          const nextStage = Math.min((b.stage || 0) + 1, 3) as 0 | 1 | 2 | 3;
          if (nextStage === 3 && b.stage !== 3) {
            isFinished = true;
          }
          const chosenName =
            customName && customName.trim().length > 0
              ? customName.trim()
              : b.name.startsWith('Available Plot')
              ? `${config.name}`
              : b.name;

          return {
            ...b,
            stage: nextStage,
            status: nextStage > 0 ? ('built' as const) : b.status,
            name: chosenName,
            buildingStyle: chosenStyle,
            dailyExp: config.dailyExp,
            xpValue: config.xpValue,
          };
        }
        return b;
      });

      const updatedDistrictBuildings = {
        ...(prev.districtBuildings || {}),
        [targetDistrict]: updatedDistrictPlots,
      };

      return {
        ...prev,
        availableBuildFunds: prev.availableBuildFunds - actualCost,
        districtBuildings: updatedDistrictBuildings,
        buildings: updatedDistrictPlots,
        exp: isFinished ? prev.exp + completionExpReward : prev.exp, // Reward tier EXP when completed
        buildingsCount: isFinished ? prev.buildingsCount + 1 : prev.buildingsCount,
      };
    });
  };

  // Handler: Rename Plot / Building
  const handleRenamePlot = (plotId: string, newName: string, districtId?: string) => {
    if (!newName || !newName.trim()) return;
    const targetDistrict = districtId || 'orientation_park';
    setUser((prev) => {
      const districtPlots = prev.districtBuildings?.[targetDistrict] || prev.buildings || INITIAL_BUILDINGS;
      const updatedDistrictPlots = districtPlots.map((b) =>
        b.id === plotId ? { ...b, name: newName.trim() } : b
      );
      return {
        ...prev,
        districtBuildings: {
          ...(prev.districtBuildings || {}),
          [targetDistrict]: updatedDistrictPlots,
        },
        buildings: updatedDistrictPlots,
      };
    });
  };

  // Handler: Complete Quest
  const handleCompleteQuest = (questId: string) => {
    setUser((prev) => {
      const targetQuest = prev.quests.find((q) => q.id === questId);
      if (!targetQuest || targetQuest.completed) return prev;

      const updatedQuests = prev.quests.map((q) =>
        q.id === questId ? { ...q, completed: true, progress: q.target } : q
      );

      return {
        ...prev,
        exp: prev.exp + targetQuest.rewardExp,
        // Hearts are no longer awarded on quests, they are strictly a streak mechanic
        quests: updatedQuests,
      };
    });
  };

  // Handler: Reset Tour
  const handleResetTour = () => {
    setMobileStep(1);
    setMobileTab('city');
    setUser((prev) => ({
      ...prev,
      totalSavings: 0,
      buildingsCount: 0,
      exp: 10,
      hearts: 100, // Reset to 100
    }));
  };

  // Handler: Add Friend by City ID
  const handleAddFriend = (friendCityId: string) => {
    const raw = friendCityId.trim().toUpperCase();
    const targetCityId = raw.startsWith('CTY-')
      ? raw
      : /^\d+$/.test(raw)
      ? `CTY-${raw}`
      : raw;

    // Check: Cannot add own City ID
    if (targetCityId === user.tag.toUpperCase()) {
      return {
        success: false,
        message: `You cannot add your own City ID (${user.tag})!`,
      };
    }

    // Check: Already in squad / friends list
    const alreadyFriend = user.squad.find(
      (m) => m.tag.toUpperCase() === targetCityId
    );
    if (alreadyFriend) {
      return {
        success: false,
        message: `${alreadyFriend.name} (${alreadyFriend.tag}) is already in your Friends list!`,
      };
    }

    // Check: Already invited
    const alreadyInvited = (user.invitations || []).find(
      (inv) => inv.toCityId.toUpperCase() === targetCityId && inv.status === 'pending'
    );
    if (alreadyInvited) {
      return {
        success: false,
        message: `An invitation to ${targetCityId} is already pending!`,
      };
    }

    // Match known citizen or create one
    const known = KNOWN_CITIZENS.find(
      (c) => c.cityId.toUpperCase() === targetCityId
    );
    const friendName = known ? known.name : `Citizen ${targetCityId}`;
    const avatar = known
      ? known.avatarUrl
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    const newInvitation: FriendInvitation = {
      id: `inv-out-${Date.now()}`,
      fromName: user.name,
      fromCityId: user.tag,
      toCityId: targetCityId,
      toName: friendName,
      date: 'Just now',
      status: 'pending',
      type: 'outgoing',
      avatarUrl: avatar,
      level: known ? known.level : 2,
      cityBuildings: known ? known.cityBuildings : 3,
      savingsTotal: known ? known.savingsTotal : 8500,
    };

    setUser((prev) => ({
      ...prev,
      invitations: [newInvitation, ...(prev.invitations || [])],
    }));

    return {
      success: true,
      message: `Invitation sent to ${friendName} (${targetCityId})! Check the Invitations tab.`,
      invitation: newInvitation,
    };
  };

  // Handler: Accept Incoming Invitation
  const handleAcceptInvitation = (invitationId: string) => {
    setUser((prev) => {
      const inv = (prev.invitations || []).find((i) => i.id === invitationId);
      if (!inv) return prev;

      const newFriend: SquadMember = {
        id: `friend-${Date.now()}`,
        name: inv.fromName,
        tag: inv.fromCityId,
        level: inv.level || 2,
        cityBuildings: inv.cityBuildings || 3,
        savingsTotal: inv.savingsTotal || 9000,
        avatarUrl:
          inv.avatarUrl ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        status: 'online',
      };

      const updatedSquad = [...prev.squad, newFriend];
      const updatedInvitations = (prev.invitations || []).map((i) =>
        i.id === invitationId ? { ...i, status: 'accepted' as const } : i
      );

      return {
        ...prev,
        exp: prev.exp + 10,
        squad: updatedSquad,
        invitations: updatedInvitations,
      };
    });
  };

  // Handler: Decline Invitation
  const handleDeclineInvitation = (invitationId: string) => {
    setUser((prev) => ({
      ...prev,
      invitations: (prev.invitations || []).map((i) =>
        i.id === invitationId ? { ...i, status: 'declined' as const } : i
      ),
    }));
  };

  // Handler: Simulate Friend Accepting Sent Invitation
  const handleSimulateFriendAccept = (invitationId: string) => {
    setUser((prev) => {
      const inv = (prev.invitations || []).find((i) => i.id === invitationId);
      if (!inv) return prev;

      const newFriend: SquadMember = {
        id: `friend-${Date.now()}`,
        name: inv.toName,
        tag: inv.toCityId,
        level: inv.level || 3,
        cityBuildings: inv.cityBuildings || 4,
        savingsTotal: inv.savingsTotal || 16000,
        avatarUrl:
          inv.avatarUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'online',
      };

      const updatedSquad = [...prev.squad, newFriend];
      const updatedInvitations = (prev.invitations || []).map((i) =>
        i.id === invitationId ? { ...i, status: 'accepted' as const } : i
      );

      return {
        ...prev,
        exp: prev.exp + 15,
        squad: updatedSquad,
        invitations: updatedInvitations,
      };
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ================================================================= */}
      {/* TOP GLOBAL BAR: Brand, Mode Switcher, and Design Heuristics      */}
      {/* ================================================================= */}
      <header className="h-14 px-4 sm:px-6 bg-stone-900/90 backdrop-blur-xl border-b border-stone-800 flex items-center justify-between z-30 sticky top-0">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <Sprout className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-base font-extrabold font-['Outfit',sans-serif] tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              FinCity
            </h1>
            <span className="hidden sm:inline-block text-[11px] text-stone-400 font-medium">
              Save Today. Build Tomorrow. 🍃
            </span>
          </div>
        </div>

        {/* Center Mode Switcher Tabs */}
        <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-emerald-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">📱 Mobile Flow (14 Screens)</span>
            <span className="sm:hidden">Mobile</span>
          </button>

          <button
            onClick={() => {
              // Ensure city has at least 1 building to display rich desktop view
              if (user.buildingsCount === 0) {
                setUser((prev) => ({
                  ...prev,
                  totalSavings: Math.max(prev.totalSavings, 10),
                  buildingsCount: 1,
                  hearts: Math.max(prev.hearts, 50),
                }));
              }
              setViewMode('desktop');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'desktop'
                ? 'bg-emerald-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">💻 Web View (Responsive)</span>
            <span className="sm:hidden">Web View</span>
          </button>
        </div>

        {/* Right Info & Design Patterns Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowPatternsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs font-bold text-emerald-400 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Design Patterns & Heuristics</span>
            <span className="md:hidden">Patterns</span>
          </button>
        </div>
      </header>

      {/* ================================================================= */}
      {/* MAIN VIEWPORT: Mobile Prototype Flow OR Responsive Web View       */}
      {/* ================================================================= */}
      <div className="flex-1 w-full relative flex flex-col">
        {viewMode === 'mobile' ? (
          <MobileSimulator
            currentStep={mobileStep}
            onChangeStep={setMobileStep}
            mobileTab={mobileTab}
            onChangeMobileTab={setMobileTab}
            user={user}
            onChangeName={handleChangeName}
            onChangeAge={handleChangeAge}
            onChangeOccupation={handleChangeOccupation}
            onChangePocketMoney={handleChangePocketMoney}
            onChangeIncome={handleChangeIncome}
            onChangeBudget={handleChangeBudget}
            onUpdateProfile={handleUpdateProfile}
            onSelectGoal={handleSelectGoal}
            onSelectAssistant={handleSelectAssistant}
            onUpdateGoalAmount={handleUpdateGoalAmount}
            onUpdateGoalName={handleUpdateGoalName}
            onAddSavings={handleAddSavings}
            onAddTransaction={handleAddTransaction}
            onUpgradePlot={handleUpgradePlot}
            onRenamePlot={handleRenamePlot}
            onCompleteQuest={handleCompleteQuest}
            onResetTour={handleResetTour}
            onAddFriend={handleAddFriend}
            onAcceptInvitation={handleAcceptInvitation}
            onDeclineInvitation={handleDeclineInvitation}
            onSimulateFriendAccept={handleSimulateFriendAccept}
          />
        ) : (
          <DesktopDashboard
            user={user}
            onAddSavings={handleAddSavings}
            onAddTransaction={handleAddTransaction}
            onUpgradePlot={handleUpgradePlot}
            onRenamePlot={handleRenamePlot}
            onSelectPlot={(plot: BuildingPlot) => {
              console.log('Selected Plot:', plot);
            }}
            onCompleteQuest={handleCompleteQuest}
            onSwitchToMobile={() => setViewMode('mobile')}
            onAddFriend={handleAddFriend}
            onAcceptInvitation={handleAcceptInvitation}
            onDeclineInvitation={handleDeclineInvitation}
            onSimulateFriendAccept={handleSimulateFriendAccept}
            onMissDay={handleMissDay}
          />
        )}

        {/* Global Floating Companion in Desktop View */}
        {viewMode === 'desktop' && (
          <FloatingAssistantPopup
            assistantId={user.selectedAssistantId}
            currentStep={14}
            onSelectAssistant={handleSelectAssistant}
            onAddSavings={handleAddSavings}
            onChangeBudget={handleChangeBudget}
            positionMode="fixed-desktop"
          />
        )}
      </div>

      {/* Design Patterns & Heuristics Explainer Drawer / Modal */}
      <DesignPatternsModal
        isOpen={showPatternsModal}
        onClose={() => setShowPatternsModal(false)}
      />
    </div>
  );
}
