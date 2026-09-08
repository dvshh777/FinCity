import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'motion/react';
import {
  ChevronDown,
  Sparkles,
  RefreshCw,
  MessageCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Zap,
  CheckCircle2,
  Command,
  Move,
  RotateCcw,
} from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatar';
import { getAssistant, getStepAdvice, ASSISTANTS } from '../data/assistants';
import { AssistantCharacter, AssistantGesture, VoiceCommand } from '../types';
import {
  soundFX,
  speakAssistantVoice,
  stopSpeaking,
  matchSpokenIntent,
  isSpeechRecognitionAvailable,
} from '../utils/voiceAssistant';

interface FloatingAssistantPopupProps {
  assistantId?: string;
  currentStep?: number;
  onSelectAssistant?: (id: string) => void;
  onAddSavings?: (amount: number, desc: string) => void;
  onChangeBudget?: (needs: number, wants: number, savings: number) => void;
  positionMode?: 'relative-mobile' | 'fixed-desktop';
  className?: string;
}

interface ActiveTextPopup {
  id: string;
  query?: string;
  response: string;
  gestureTag: string;
  actionNote?: string;
  timestamp: number;
}

export const FloatingAssistantPopup: React.FC<FloatingAssistantPopupProps> = ({
  assistantId = 'nova',
  currentStep = 3,
  onSelectAssistant,
  onAddSavings,
  onChangeBudget,
  positionMode = 'relative-mobile',
  className = '',
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showSwitchMenu, setShowSwitchMenu] = useState<boolean>(false);
  const [showCommandsDrawer, setShowCommandsDrawer] = useState<boolean>(false);
  
  // Voice & Gesture States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeGesture, setActiveGesture] = useState<AssistantGesture>('idle');
  const [activeGestureLabel, setActiveGestureLabel] = useState<string>('');
  const [activePopup, setActivePopup] = useState<ActiveTextPopup | null>(null);
  const [micStatusNotice, setMicStatusNotice] = useState<string | null>(null);

  // Draggable position coordinates for the minimized round icon
  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const isDraggingRef = useRef<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasMovedFromHome, setHasMovedFromHome] = useState<boolean>(false);

  const assistant: AssistantCharacter = getAssistant(assistantId);
  const defaultAdvice = getStepAdvice(currentStep, assistant);

  const gestureTimerRef = useRef<NodeJS.Timeout | null>(null);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Smoothly reset coordinates back to initial corner position
  const handleResetPosition = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    animate(posX, 0, { type: 'spring', damping: 24, stiffness: 300 });
    animate(posY, 0, { type: 'spring', damping: 24, stiffness: 300 });
    setHasMovedFromHome(false);
  };

  // Clean up speech synthesis and recognition on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (gestureTimerRef.current) clearTimeout(gestureTimerRef.current);
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, []);

  // Set transient gesture and reset back to idle after duration
  const triggerGesture = (gesture: AssistantGesture, label: string, durationMs = 4500) => {
    setActiveGesture(gesture);
    setActiveGestureLabel(label);

    if (gestureTimerRef.current) clearTimeout(gestureTimerRef.current);
    gestureTimerRef.current = setTimeout(() => {
      setActiveGesture('idle');
      setActiveGestureLabel('');
    }, durationMs);
  };

  // Trigger Voice Command Execution (from click or speech)
  const executeCommand = (
    query: string,
    response: string,
    gesture: AssistantGesture,
    gestureLabel: string,
    actionType?: string,
    depositAmount?: number,
    targetAssistantId?: string
  ) => {
    // 1. Animate character gesture
    triggerGesture(gesture, gestureLabel);

    // 2. Play sound feedback
    soundFX.playChime('recognized');

    // 3. Prepare action feedback
    let actionNote: string | undefined = undefined;
    if (actionType === 'deposit' && depositAmount) {
      onAddSavings?.(depositAmount, `${assistant.name} Voice: +₹${depositAmount}`);
      actionNote = `+₹${depositAmount} added to your city treasury!`;
    } else if (actionType === 'optimize') {
      onChangeBudget?.(50, 30, 20);
      actionNote = `Calibrated to 50% Needs, 30% Wants, 20% Savings!`;
    } else if (actionType === 'zen') {
      actionNote = `Mindful peace pulse applied. Anxiety cleared!`;
    } else if (actionType === 'quest') {
      actionNote = `Quests active! Check your streak in City Hall!`;
    } else if (actionType === 'shield') {
      actionNote = `Emergency vault shield reinforced!`;
    } else if (actionType === 'switch_guide' && targetAssistantId) {
      onSelectAssistant?.(targetAssistantId);
      actionNote = `Companion switched to ${getAssistant(targetAssistantId).name}!`;
    } else if (actionType === 'minimize') {
      setIsMinimized(true);
    }

    // 4. Show Animated Comic Text Popup
    setActivePopup({
      id: Math.random().toString(),
      query,
      response,
      gestureTag: gestureLabel,
      actionNote,
      timestamp: Date.now(),
    });

    // Auto-dismiss popup after 7 seconds
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popupTimerRef.current = setTimeout(() => {
      setActivePopup(null);
    }, 7000);

    // 5. Speak out loud in assistant's voice (if unmuted)
    if (!isMuted) {
      setIsSpeaking(true);
      speakAssistantVoice(response, assistant.voiceSettings, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  // Start Real Speech Recognition
  const handleToggleMic = (e?: React.MouseEvent) => {
    e?.stopPropagation();

    // If currently listening, stop
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      setMicStatusNotice(null);
      return;
    }

    // Check browser support
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setMicStatusNotice(
        'Voice mic not supported by this browser. Tap any command below to speak!'
      );
      setShowCommandsDrawer(true);
      return;
    }

    try {
      soundFX.playChime('listen');
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);
      setMicStatusNotice(`Listening... Say "${assistant.commands[0]?.phrase}" or "Deposit 100"!`);

      recognition.onresult = (event: any) => {
        setIsListening(false);
        setMicStatusNotice(null);
        const transcript = event.results[0][0].transcript;
        const match = matchSpokenIntent(transcript, assistant, ASSISTANTS);

        executeCommand(
          match.spokenQuery,
          match.responseText,
          match.gesture,
          match.gestureLabel,
          match.actionType,
          match.depositAmount,
          match.targetAssistantId
        );
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicStatusNotice('Microphone access restricted. Tap any instant command below!');
          setShowCommandsDrawer(true);
        } else {
          setMicStatusNotice('Could not catch that. Tap any command button below!');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setMicStatusNotice('Tap any command below to trigger voice response!');
      setShowCommandsDrawer(true);
    }
  };

  const handleCommandClick = (cmd: VoiceCommand) => {
    executeCommand(
      cmd.phrase,
      cmd.responseText,
      cmd.gesture,
      cmd.gestureLabel,
      cmd.actionType,
      cmd.depositAmount
    );
  };

  const containerClasses =
    positionMode === 'fixed-desktop'
      ? 'fixed bottom-6 right-6 z-50'
      : 'absolute bottom-16 right-3 z-40';

  return (
    <div
      className={`${containerClasses} select-none pointer-events-auto flex flex-col items-end ${className}`}
    >
      {/* ========================================================== */}
      {/* COMIC / GAME TEXT POPUP (Flies above assistant)            */}
      {/* ========================================================== */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            key={activePopup.id}
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', damping: 22, stiffness: 350 }}
            className="mb-3 w-[290px] max-w-[calc(100vw-36px)] rounded-2xl bg-stone-950/95 border-2 shadow-2xl p-3.5 backdrop-blur-xl text-white relative z-50 overflow-hidden"
            style={{
              x: isMinimized ? posX : 0,
              y: isMinimized ? posY : 0,
              borderColor: assistant.primaryColor,
              boxShadow: `0 14px 34px -4px ${assistant.primaryColor}55`,
            }}
          >
            {/* Top Header inside Popup */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  {assistant.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-stone-800 border border-stone-700 text-amber-300">
                  {activePopup.gestureTag}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Speaking Waveform animation */}
                {isSpeaking && (
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500/20 rounded-md">
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                )}
                <button
                  onClick={() => setActivePopup(null)}
                  className="w-5 h-5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                  title="Close popup"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Spoken query heard */}
            {activePopup.query && (
              <div className="pt-2 text-[10px] text-stone-400 italic flex items-center gap-1">
                <Mic className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                <span className="truncate">&quot;{activePopup.query}&quot;</span>
              </div>
            )}

            {/* Assistant Voice Response Text */}
            <div className="py-2.5 text-xs leading-relaxed font-medium text-stone-100">
              {activePopup.response}
            </div>

            {/* Action Feedback Note if deposit or optimize happened */}
            {activePopup.actionNote && (
              <div className="mt-1 flex items-center gap-1.5 p-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                <span>{activePopup.actionNote}</span>
              </div>
            )}

            {/* Speech Bubble Arrow pointing toward assistant */}
            <div
              className="absolute -bottom-2 right-8 w-4 h-4 bg-stone-950 border-r-2 border-b-2 rotate-45"
              style={{ borderColor: assistant.primaryColor }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* ======================================================== */
          /* MINIMIZED ROUND ASSISTANT PROFILE ICON (Movable Anywhere)*/
          /* ======================================================== */
          <motion.div
            key="minimized-round-avatar"
            style={{ x: posX, y: posY }}
            drag
            dragMomentum={false}
            dragElastic={0.08}
            dragConstraints={
              positionMode === 'relative-mobile'
                ? { left: -310, right: 10, top: -680, bottom: 40 }
                : {
                    left: typeof window !== 'undefined' ? -(window.innerWidth - 80) : -1200,
                    right: 10,
                    top: typeof window !== 'undefined' ? -(window.innerHeight - 80) : -900,
                    bottom: 20,
                  }
            }
            onDragStart={() => {
              isDraggingRef.current = true;
              setIsDragging(true);
            }}
            onDragEnd={() => {
              setTimeout(() => {
                isDraggingRef.current = false;
                setIsDragging(false);
              }, 140);
              const currentX = Math.abs(posX.get());
              const currentY = Math.abs(posY.get());
              setHasMovedFromHome(currentX > 20 || currentY > 20);
            }}
            initial={{ scale: 0.6, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: 12 }}
            whileHover={{ scale: 1.08 }}
            whileDrag={{ scale: 1.15 }}
            onClick={(e) => {
              if (isDraggingRef.current) {
                e.stopPropagation();
                return;
              }
              setIsMinimized(false);
            }}
            onDoubleClick={handleResetPosition}
            className="relative group select-none pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
          >
            {/* Desktop Hover / Drag Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-xl bg-stone-900/95 border border-stone-700/80 text-[11px] font-bold text-white whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-2 z-50">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: assistant.primaryColor }}
              />
              <span>{assistant.name}</span>
              <span className="text-[10px] text-stone-400 font-normal">
                {isDragging ? '• Release to place' : '• Drag anywhere • Tap to open'}
              </span>
            </div>

            {/* Drag Handle Cue Badge on top */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-stone-300 bg-stone-900/95 px-1.5 py-0.5 rounded-full border border-stone-700 text-[8px] font-semibold flex items-center gap-1 shadow-md whitespace-nowrap z-20">
              <Move className="w-2.5 h-2.5 text-cyan-400" />
              <span>Move</span>
            </div>

            {/* Reset to corner button when moved from initial position */}
            {hasMovedFromHome && !isDragging && (
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleResetPosition}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-600 flex items-center justify-center text-[9px] shadow-lg transition-all z-20 cursor-pointer"
                title="Reset position to corner"
                aria-label="Reset position to corner"
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>
            )}

            {/* Round Assistant Profile Visual */}
            <div
              className="relative rounded-full flex items-center justify-center transition-transform"
              style={{
                filter: isDragging
                  ? `drop-shadow(0 14px 28px ${assistant.primaryColor}88)`
                  : `drop-shadow(0 8px 20px ${assistant.primaryColor}66)`,
              }}
              title={`Drag anywhere or tap to expand ${assistant.name}`}
              aria-label={`Open ${assistant.name}`}
            >
              {/* Circular Avatar Profile */}
              <CharacterAvatar
                characterId={assistant.id}
                size="md"
                gesture={activeGesture !== 'idle' ? activeGesture : 'wave'}
              />

              {/* Listening Ripple Ring */}
              {isListening && (
                <span className="absolute inset-0 rounded-full border-2 border-rose-500 animate-ping opacity-80 pointer-events-none" />
              )}

              {/* Speaking Voice Wave Glow */}
              {isSpeaking && !isListening && (
                <span
                  className="absolute inset-0 rounded-full border-2 animate-pulse opacity-75 pointer-events-none"
                  style={{ borderColor: assistant.primaryColor }}
                />
              )}
            </div>

            {/* Quick Mic Voice Trigger Badge (compact corner round button) */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleMic(e);
              }}
              className={`absolute -bottom-0.5 -left-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-stone-800 transition-all cursor-pointer z-20 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-400'
                  : 'bg-stone-900/95 hover:bg-stone-800 text-stone-300 hover:text-white backdrop-blur-sm'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Voice command mic'}
              aria-label="Toggle voice mic"
            >
              <Mic className="w-3 h-3" />
            </button>
          </motion.div>
        ) : (
          /* ======================================================== */
          /* EXPANDED POPUP COMPANION CARD                            */
          /* ======================================================== */
          <motion.div
            key="expanded-popup"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative w-[285px] max-w-[calc(100vw-32px)] rounded-3xl bg-stone-900/95 border border-stone-700/80 shadow-2xl backdrop-blur-xl p-3 text-white overflow-hidden"
            style={{
              boxShadow: `0 12px 32px -6px ${assistant.primaryColor}40`,
            }}
          >
            {/* Subtle ambient character glow */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-20"
              style={{ backgroundColor: assistant.primaryColor }}
            />

            {/* Card Header */}
            <div className="relative z-10 flex items-center justify-between pb-2 border-b border-stone-800/80 mb-2">
              <div className="flex items-center gap-2">
                <CharacterAvatar
                  characterId={assistant.id}
                  size="sm"
                  gesture={activeGesture !== 'idle' ? activeGesture : 'wave'}
                  gestureTag={activeGestureLabel || undefined}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">
                      {assistant.name}
                    </span>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full border ${assistant.badgeColor}`}
                    >
                      {assistant.badge}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 block leading-tight">
                    {assistant.gender} • {assistant.archetype}
                  </span>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1">
                {/* Mute/Unmute Audio Speech */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-6 h-6 rounded-full bg-stone-800/80 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute voice voice' : 'Mute voice audio'}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </button>

                {/* Minimize Button */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="w-6 h-6 rounded-full bg-stone-800/80 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
                  title="Minimize assistant"
                  aria-label="Minimize assistant"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Speech Advice or Default Guide */}
            <div className="relative z-10 bg-stone-950/70 border border-stone-800 rounded-2xl p-2.5 mb-2.5 shadow-inner">
              <div className="flex items-start gap-1.5">
                <MessageCircle
                  className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                  style={{ color: assistant.primaryColor }}
                />
                <p className="text-[11px] text-stone-200 leading-relaxed font-normal">
                  {defaultAdvice}
                </p>
              </div>
            </div>

            {/* ======================================================== */}
            {/* VOICE COMMAND MIC BAR & REAL-TIME LISTENING              */}
            {/* ======================================================== */}
            <div className="relative z-10 mb-2 p-2 rounded-2xl bg-stone-950/80 border border-stone-800">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handleToggleMic}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-bold transition-all shadow-md ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/50'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 animate-spin" />
                      <span>Listening... (Tap to stop)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Speak Voice Command</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowCommandsDrawer(!showCommandsDrawer)}
                  className={`p-1.5 rounded-xl border transition-colors ${
                    showCommandsDrawer
                      ? 'bg-stone-800 border-amber-500/50 text-amber-300'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                  }`}
                  title="Show unique commands list"
                >
                  <Command className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Real-time mic notice or listening hint */}
              {micStatusNotice && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-[10px] text-amber-300 pt-1.5 px-0.5 text-center font-medium"
                >
                  {micStatusNotice}
                </motion.div>
              )}
            </div>

            {/* ======================================================== */}
            {/* UNIQUE VOICE COMMANDS QUICK CHIPS TRAY                   */}
            {/* ======================================================== */}
            <div className="relative z-10 mb-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 px-1">
                <span>{assistant.name}&apos;s Voice Commands:</span>
                <span className="text-[9px] text-stone-500 lowercase">tap to trigger</span>
              </div>

              <div className="grid grid-cols-1 gap-1">
                {assistant.commands.slice(0, 3).map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleCommandClick(cmd)}
                    className="group flex items-center justify-between p-1.5 px-2 rounded-xl bg-stone-950/60 hover:bg-stone-800/90 border border-stone-800/80 hover:border-stone-700 text-left transition-all"
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="text-xs">{cmd.label.split(' ')[0]}</span>
                      <div className="truncate">
                        <div className="text-[10px] font-bold text-stone-200 group-hover:text-white truncate">
                          &quot;{cmd.phrase}&quot;
                        </div>
                        <div className="text-[9px] text-stone-400 truncate">
                          Gesture: {cmd.gestureLabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-[10px] font-semibold text-emerald-400 group-hover:scale-105 transition-transform ml-1">
                      <Zap className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Switch Assistant Row if requested */}
            {showSwitchMenu ? (
              <div className="relative z-10 pt-1 pb-1">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 px-0.5 flex justify-between items-center">
                  <span>Switch Guide:</span>
                  <button
                    onClick={() => setShowSwitchMenu(false)}
                    className="text-stone-400 hover:text-stone-200 text-[10px] underline"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {ASSISTANTS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        onSelectAssistant?.(a.id);
                        setShowSwitchMenu(false);
                      }}
                      className={`flex flex-col items-center p-1 rounded-xl border text-[10px] transition-all ${
                        a.id === assistant.id
                          ? 'bg-stone-800 border-emerald-500 font-bold'
                          : 'bg-stone-900/80 border-stone-800 hover:bg-stone-800/60 text-stone-300'
                      }`}
                    >
                      <CharacterAvatar characterId={a.id} size="xs" />
                      <span className="truncate w-full text-center mt-0.5">
                        {a.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Footer Controls */
              <div className="relative z-10 flex items-center justify-between gap-1.5 pt-0.5 border-t border-stone-800/80 mt-1">
                {onSelectAssistant && (
                  <button
                    onClick={() => setShowSwitchMenu(true)}
                    className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-200 font-medium py-1 px-2 rounded-lg bg-stone-800/60 hover:bg-stone-800 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 text-stone-400" />
                    <span>Change Guide</span>
                  </button>
                )}

                <button
                  onClick={() => setIsMinimized(true)}
                  className="flex items-center gap-1 ml-auto text-[10px] font-semibold py-1 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                >
                  <ChevronDown className="w-3 h-3" />
                  <span>Minimize</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
