import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScreenStep, MobileTab, UserState, FriendInvitation } from '../types';
import {
  SplashScreen,
  CharacterIntroScreen,
  AskNameScreen,
  SignupScreen,
} from './screens/Screens1to4';
import { CharacterSelectScreen } from './screens/CharacterSelectScreen';
import { FloatingAssistantPopup } from './FloatingAssistantPopup';
import {
  AgeOccupationScreen,
  IncomeScreen,
  BudgetScreen,
  SavingsGoalScreen,
  UserIdScreen,
} from './screens/Screens5to8';
import {
  EmptyCityScreen,
  FirstSavePromptScreen,
  BuildingAnimationScreen,
  HouseCompletedModal,
  DashboardAfterScreen,
} from './screens/Screens9to13';
import { MobileTabViews } from './screens/MobileTabViews';

interface MobileSimulatorProps {
  currentStep: ScreenStep;
  onChangeStep: (step: ScreenStep) => void;
  mobileTab: MobileTab;
  onChangeMobileTab: (tab: MobileTab) => void;
  user: UserState;
  onChangeName: (name: string) => void;
  onChangeAge: (age: number) => void;
  onChangeOccupation: (occ: 'student' | 'employee') => void;
  onChangePocketMoney: (
    frequency: 'monthly' | 'weekly' | 'daily',
    amount: number
  ) => void;
  onChangeIncome: (income: number) => void;
  onChangeBudget: (needs: number, wants: number, savings: number) => void;
  onUpdateProfile?: (updates: {
    name: string;
    tag: string;
    monthlyIncome: number;
    budgetNeeds: number;
    budgetWants: number;
    budgetSavings: number;
  }) => void;
  onSelectGoal: (goalId: string) => void;
  onSelectAssistant: (assistantId: string) => void;
  onUpdateGoalAmount: (goalId: string, amount: number) => void;
  onUpdateGoalName: (goalId: string, name: string) => void;
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
  onUpgradePlot: (plotId: string, cost: number, customName?: string, buildingStyle?: 'cottage' | 'bakery' | 'modern' | 'solar' | 'townhall' | 'cyber', districtId?: string, squadGoalId?: string) => void;
  onRenamePlot?: (plotId: string, newName: string) => void;
  onCompleteQuest: (questId: string) => void;
  onResetTour: () => void;
  onAddFriend?: (cityId: string) => { success: boolean; message: string; invitation?: FriendInvitation };
  onAcceptInvitation?: (invitationId: string) => void;
  onDeclineInvitation?: (invitationId: string) => void;
  onSimulateFriendAccept?: (invitationId: string) => void;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  currentStep,
  onChangeStep,
  mobileTab,
  onChangeMobileTab,
  user,
  onChangeName,
  onChangeAge,
  onChangeOccupation,
  onChangePocketMoney,
  onChangeIncome,
  onChangeBudget,
  onUpdateProfile,
  onSelectGoal,
  onSelectAssistant,
  onUpdateGoalAmount,
  onUpdateGoalName,
  onAddSavings,
  onAddTransaction,
  onUpgradePlot,
  onRenamePlot,
  onCompleteQuest,
  onResetTour,
  onAddFriend,
  onAcceptInvitation,
  onDeclineInvitation,
  onSimulateFriendAccept,
}) => {
  const [saveAmountInput, setSaveAmountInput] = React.useState<number>(10);

  const handleUpdateProfile = (updates: {
    name: string;
    tag: string;
    monthlyIncome: number;
    budgetNeeds: number;
    budgetWants: number;
    budgetSavings: number;
  }) => {
    if (onUpdateProfile) {
      onUpdateProfile(updates);
    } else {
      onChangeName(updates.name);
      onChangeIncome(updates.monthlyIncome);
      onChangeBudget(updates.budgetNeeds, updates.budgetWants, updates.budgetSavings);
    }
  };

  const stepLabels: Record<ScreenStep, string> = {
    1: '1. Splash Screen',
    2: '2. Choose Guide (6 Types)',
    3: '3. Ask Name',
    4: '4. Signup',
    5: '5. Age & Occupation',
    6: '6. Income / Pocket Money',
    7: '7. Budget (Auto Savings)',
    8: '8. Savings Goal',
    9: '9. User ID',
    10: '10. Empty City',
    11: '11. First Save Prompt',
    12: '12. Building Animation',
    13: '13. First House Completed',
    14: '14. Dashboard (After)',
  };

  return (
    <div className="flex flex-col items-center justify-start w-full h-[calc(100vh-60px)] sm:h-[820px] sm:max-h-[92vh] select-none p-0 sm:p-2">
      {/* Sleek Mobile Viewport Container */}
      <div className="relative w-full max-w-[430px] h-full flex flex-col bg-stone-950 text-white sm:rounded-2xl border-stone-800/80 sm:border shadow-2xl overflow-hidden">
        {/* Top Floating Step Selector Navigator */}
        <div className="flex items-center justify-between gap-2 bg-stone-900/95 border-b border-stone-800/80 px-3 py-1.5 shadow-md text-xs z-30 shrink-0">
          <button
            onClick={() => onChangeStep(Math.max(1, currentStep - 1) as ScreenStep)}
            disabled={currentStep === 1}
            className="p-1 rounded-lg hover:bg-stone-800 disabled:opacity-30 text-stone-300 disabled:cursor-not-allowed cursor-pointer"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Step Selector Dropdown */}
          <div className="flex items-center gap-1.5 font-bold text-stone-200 min-w-0">
            <span className="text-emerald-400 font-mono text-[11px] shrink-0">
              Step {currentStep}/14:
            </span>
            <select
              value={currentStep}
              onChange={(e) => onChangeStep(Number(e.target.value) as ScreenStep)}
              className="bg-stone-800 text-stone-200 py-0.5 px-2 rounded-lg border border-stone-700 outline-none font-medium cursor-pointer text-[11px] truncate max-w-[140px] sm:max-w-[180px]"
            >
              {Object.entries(stepLabels).map(([stepNum, label]) => (
                <option key={stepNum} value={stepNum}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onChangeStep(Math.min(14, currentStep + 1) as ScreenStep)}
              disabled={currentStep === 14}
              className="p-1 rounded-lg hover:bg-stone-800 disabled:opacity-30 text-stone-300 disabled:cursor-not-allowed cursor-pointer"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onResetTour}
              className="p-1 text-stone-400 hover:text-emerald-400 font-medium transition-colors cursor-pointer"
              title="Reset Flow to Screen 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Screen Content Wrapper */}
        <div className="relative w-full flex-1 overflow-hidden flex flex-col bg-stone-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentStep}-${mobileTab}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col overflow-hidden"
            >
              {/* Screen 1: Splash Screen */}
              {currentStep === 1 && (
                <SplashScreen onGetStarted={() => onChangeStep(2)} />
              )}

              {/* Screen 2: Choose Guide (6 Types) */}
              {currentStep === 2 && (
                <CharacterSelectScreen
                  selectedAssistantId={user.selectedAssistantId}
                  onSelectAssistant={onSelectAssistant}
                  onLetsGo={() => onChangeStep(3)}
                  onSkip={() => {
                    onSelectAssistant('nova');
                    onChangeStep(3);
                  }}
                />
              )}

              {/* Screen 3: Ask Name */}
              {currentStep === 3 && (
                <AskNameScreen
                  name={user.name}
                  onChangeName={onChangeName}
                  onContinue={() => onChangeStep(4)}
                  assistantId={user.selectedAssistantId}
                />
              )}

              {/* Screen 4: Signup */}
              {currentStep === 4 && (
                <SignupScreen
                  initialName={user.name}
                  onChangeName={onChangeName}
                  onBack={() => onChangeStep(3)}
                  onContinueAuth={() => onChangeStep(5)}
                />
              )}

              {/* Screen 5: Age & Occupation */}
              {currentStep === 5 && (
                <AgeOccupationScreen
                  age={user.age || 21}
                  occupation={user.occupation || 'student'}
                  onChangeAge={onChangeAge}
                  onChangeOccupation={onChangeOccupation}
                  onBack={() => onChangeStep(4)}
                  onContinue={() => onChangeStep(6)}
                />
              )}

              {/* Screen 6: Income / Pocket Money */}
              {currentStep === 6 && (
                <IncomeScreen
                  occupation={user.occupation || 'student'}
                  pocketMoneyFrequency={user.pocketMoneyFrequency || 'monthly'}
                  pocketMoneyAmount={user.pocketMoneyAmount || 5000}
                  monthlyIncome={user.monthlyIncome}
                  onChangePocketMoney={onChangePocketMoney}
                  onChangeIncome={onChangeIncome}
                  onBack={() => onChangeStep(5)}
                  onContinue={() => onChangeStep(7)}
                />
              )}

              {/* Screen 7: Budget Screen (Needs & Wants manual, Savings auto-calculated) */}
              {currentStep === 7 && (
                <BudgetScreen
                  income={user.monthlyIncome}
                  needs={user.budgetNeeds}
                  wants={user.budgetWants}
                  savings={user.budgetSavings}
                  onChangeBudget={onChangeBudget}
                  onBack={() => onChangeStep(6)}
                  onContinue={() => onChangeStep(8)}
                />
              )}

              {/* Screen 8: Savings Goal */}
              {currentStep === 8 && (
                <SavingsGoalScreen
                  goals={user.goals}
                  selectedGoalId={user.selectedGoalId}
                  onSelectGoal={onSelectGoal}
                  onUpdateGoalAmount={onUpdateGoalAmount}
                  onUpdateGoalName={onUpdateGoalName}
                  onBack={() => onChangeStep(7)}
                  onContinue={() => onChangeStep(9)}
                />
              )}

              {/* Screen 9: User ID (City Identity) */}
              {currentStep === 9 && (
                <UserIdScreen
                  userTag={user.tag}
                  onEnterCity={() => onChangeStep(10)}
                />
              )}

              {/* Screen 10: Empty City (Dashboard) */}
              {currentStep === 10 && (
                mobileTab === 'city' ? (
                  <EmptyCityScreen
                    user={user}
                    activeTab={mobileTab}
                    onChangeTab={onChangeMobileTab}
                    onPromptFirstSave={() => onChangeStep(11)}
                    onUpdateProfile={handleUpdateProfile}
                    onUpgradePlot={onUpgradePlot}
                    onRenamePlot={onRenamePlot}
                  />
                ) : (
                  <MobileTabViews
                    tab={mobileTab}
                    user={user}
                    onChangeTab={onChangeMobileTab}
                    onAddSavings={onAddSavings}
                    onAddTransaction={onAddTransaction}
                    onCompleteQuest={onCompleteQuest}
                    onUpdateProfile={handleUpdateProfile}
                  />
                )
              )}

              {/* Screen 11: First Save Prompt Modal */}
              {currentStep === 11 && (
                <FirstSavePromptScreen
                  user={user}
                  saveAmount={saveAmountInput}
                  onChangeSaveAmount={setSaveAmountInput}
                  onSaveNow={() => {
                    const isFirst = user.totalSavings === 0;
                    onAddSavings(saveAmountInput, isFirst ? 'First House Foundation' : 'City Expansion');
                    onChangeStep(isFirst ? 12 : 14);
                  }}
                  onMaybeLater={() => onChangeStep(user.totalSavings === 0 ? 10 : 14)}
                />
              )}

              {/* Screen 12: Building Animation */}
              {currentStep === 12 && (
                <BuildingAnimationScreen
                  user={user}
                  onAnimationComplete={() => onChangeStep(13)}
                />
              )}

              {/* Screen 13: House Completed Celebration */}
              {currentStep === 13 && (
                <HouseCompletedModal
                  user={user}
                  onAwesome={() => onChangeStep(14)}
                />
              )}

              {/* Screen 14: Dashboard (After) */}
              {currentStep === 14 && (
                mobileTab === 'city' ? (
                  <EmptyCityScreen
                    user={user}
                    activeTab={mobileTab}
                    onChangeTab={onChangeMobileTab}
                    onPromptFirstSave={() => onChangeStep(11)}
                    onUpdateProfile={handleUpdateProfile}
                    onUpgradePlot={onUpgradePlot}
                    onRenamePlot={onRenamePlot}
                  />
                ) : (
                  <MobileTabViews
                    tab={mobileTab}
                    user={user}
                    onChangeTab={onChangeMobileTab}
                    onAddSavings={onAddSavings}
                    onAddTransaction={onAddTransaction}
                    onCompleteQuest={onCompleteQuest}
                    onUpdateProfile={handleUpdateProfile}
                    onAddFriend={onAddFriend}
                    onAcceptInvitation={onAcceptInvitation}
                    onDeclineInvitation={onDeclineInvitation}
                    onSimulateFriendAccept={onSimulateFriendAccept}
                  />
                )
              )}
            </motion.div>
          </AnimatePresence>

          {/* Persistent Floating Pop-up Assistant at Bottom Right (Steps 3-14) */}
          {currentStep >= 3 && (
            <FloatingAssistantPopup
              assistantId={user.selectedAssistantId}
              currentStep={currentStep}
              onSelectAssistant={onSelectAssistant}
              onAddSavings={onAddSavings}
              onChangeBudget={onChangeBudget}
              positionMode="relative-mobile"
            />
          )}
        </div>

        {/* Home Indicator bar at bottom of phone */}
        <div className="w-32 h-1 bg-stone-600 rounded-full mx-auto my-1 z-30" />
      </div>
    </div>
  );
};
