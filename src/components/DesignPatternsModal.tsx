import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Layers,
  Sparkles,
  Compass,
  PieChart,
  ShieldCheck,
  Zap,
  Code2,
  BookOpen,
  Users,
  Mic,
} from 'lucide-react';

interface DesignPatternsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignPatternsModal: React.FC<DesignPatternsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const patterns = [
    {
      title: '1. Gamified Behavioral Feedback Loop',
      icon: Sparkles,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      summary:
        'Converts intangible monetary restraint into immediate visual, dopamine-rich city growth.',
      details:
        'Every rupee saved immediately manifests as real estate infrastructure on an isometric grid. This eliminates present bias (the human tendency to prefer instant rewards over distant retirement goals).',
    },
    {
      title: '2. Progressive Disclosure & Life-Stage Adaptation (Screens 1–9)',
      icon: Compass,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      summary:
        'Tailors financial inquiries to user archetype (Student pocket money vs. Employee salary).',
      details:
        'Rather than a generic form, onboarding captures age and occupation first. Students specify allowance intervals (daily/weekly/monthly), while employees input take-home salary.',
    },
    {
      title: '3. Real-Time Dynamic Savings Derivation (Budget Screen)',
      icon: PieChart,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10 border-sky-500/20',
      summary:
        'Needs and Wants are entered manually, dynamically computing residual city savings.',
      details:
        'The formula (Savings = Total Pool - Needs - Wants) updates the interactive donut chart, percentage badges, and progress bar in real time, alerting users if expenses exceed total income.',
    },
    {
      title: '4. Isometric Depth & Visual Hierarchy (Neomorphic Simulation)',
      icon: Layers,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      summary:
        'Orthographic 2.5D projection creating an emotional connection of ownership.',
      details:
        'Utilizes clean geometric coordinates (x, y transformed to isometric plane), layered SVG shadows, and construction scaffolding states (Screen 11) to simulate tangible progress before unveiling the finished asset.',
    },
    {
      title: '5. Personalized Milestone Goals & Citizen Identity (Screens 8–9)',
      icon: ShieldCheck,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/20',
      summary:
        'Customizable target amounts for standard goals plus editable custom goals and unique citizen tags.',
      details:
        'Users can tailor target figures for preset categories (Goa Trip, Laptop, Bike, etc.) or create a bespoke goal with custom name and target amount, paired with a permanent citizen tag (e.g. ABHI2037).',
    },
    {
      title: '6. Dual-View Responsive Architecture (Mobile Applet & Web View)',
      icon: Code2,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      summary:
        'State-synchronized dual surface supporting both handheld touch interactions and desktop analytics.',
      details:
        'State (savings balance, quests, buildings, level, exp) remains unified whether inspected through the 14-step iPhone simulator or the full-screen desktop dashboard.',
    },
    {
      title: '7. Multi-Persona Companion & Minimizable HUD (Screen 2 & Pop-up)',
      icon: Users,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 border-pink-500/20',
      summary:
        '6 diverse assistants with distinct looks, genders, and archetypes floating at bottom-right.',
      details:
        'Users can choose their personal financial companion (Nova, Aarav, Maya, Leo, Zara, Kabir). The chosen guide persists as a floating bottom-right pop-up assistant offering contextual advice at each step, with user agency to minimize to an unobtrusive compact pill anytime.',
    },
    {
      title: '8. Unique Voice Commands, Animated Gestures & Comic Popups',
      icon: Mic,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
      summary:
        'Speech recognition & custom speech synthesis with dynamic avatar gestures and stylized dialogue popups.',
      details:
        'Each of the 6 assistants possesses unique voice commands (e.g., Nova: "Explore savings", Aarav: "Optimize budget", Maya: "Find my zen", Leo: "Smash my goal", Zara: "Activate cyber quest", Kabir: "Secure my vault"). When triggered via voice mic or instant quick-tap chips, the character animates signature gestures (smart glasses calibration, power flex, zen bow, aegis shield) accompanied by spoken speech synthesis, Web Audio acoustic chimes, and an animated comic text bubble with live soundwaves.',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-3xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl text-stone-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-['Outfit',sans-serif]">
                  FinCity Architecture & Design Patterns
                </h3>
                <p className="text-xs text-stone-400">
                  Comprehensive breakdown of UX heuristics & system design
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Patterns Grid */}
          <div className="space-y-4">
            {patterns.map((pat, idx) => {
              const Icon = pat.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${pat.bgColor} space-y-1.5`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${pat.color}`} />
                    <h4 className="text-sm font-bold text-white">{pat.title}</h4>
                  </div>
                  <p className="text-xs font-semibold text-stone-300">
                    {pat.summary}
                  </p>
                  <p className="text-[11px] text-stone-400 leading-relaxed pt-1">
                    {pat.details}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-colors"
            >
              Got it, continue testing
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
