import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Check,
  Volume2,
} from 'lucide-react';
import { CharacterAvatar } from '../CharacterAvatar';
import { ASSISTANTS, getAssistant } from '../../data/assistants';
import { AssistantCharacter, AssistantGesture } from '../../types';
import {
  speakAssistantVoice,
  stopSpeaking,
} from '../../utils/voiceAssistant';

interface CharacterSelectScreenProps {
  selectedAssistantId?: string;
  onSelectAssistant: (assistantId: string) => void;
  onLetsGo: () => void;
  onSkip: () => void;
}

export const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({
  selectedAssistantId = 'nova',
  onSelectAssistant,
  onLetsGo,
  onSkip,
}) => {
  const [currentSelectedId, setCurrentSelectedId] = useState<string>(
    selectedAssistantId || 'nova'
  );
  const [activeGesture, setActiveGesture] = useState<AssistantGesture>('wave');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const selectedCharacter: AssistantCharacter = getAssistant(currentSelectedId);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleChoose = (assistant: AssistantCharacter) => {
    setCurrentSelectedId(assistant.id);
    setActiveGesture(assistant.signatureGesture);
    onSelectAssistant(assistant.id);
    stopSpeaking();
    setIsPlayingAudio(false);
  };

  const handlePreviewVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    const phrase = selectedCharacter.catchphrase;
    setActiveGesture(selectedCharacter.signatureGesture);
    setIsPlayingAudio(true);

    speakAssistantVoice(phrase, selectedCharacter.voiceSettings, {
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => {
        setIsPlayingAudio(false);
        setTimeout(() => setActiveGesture('idle'), 1500);
      },
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleConfirm = () => {
    stopSpeaking();
    onSelectAssistant(currentSelectedId);
    onLetsGo();
  };

  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white p-5 overflow-hidden select-none">
      {/* Subtle ambient character backlight */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-700 opacity-20"
        style={{ backgroundColor: selectedCharacter.primaryColor }}
      />

      {/* Header */}
      <div className="relative z-10 pt-2 flex flex-col items-center text-center">
        <h2 className="text-xl font-bold font-['Outfit',sans-serif] tracking-tight text-stone-100">
          Choose Your Companion
        </h2>
        <p className="text-xs text-stone-400 mt-1 max-w-[260px]">
          Select a guide to accompany your savings journey
        </p>
      </div>

      {/* Hero Showcase of Selected Character */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center px-4">
        {/* Animated Avatar with Gentle Breathing Motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCharacter.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="relative mb-3 cursor-pointer"
            onClick={handlePreviewVoice}
            title="Tap to preview voice"
          >
            <div
              className="p-1 rounded-full ring-2 transition-all duration-300"
              style={{
                ringColor: `${selectedCharacter.primaryColor}80`,
                boxShadow: `0 0 24px ${selectedCharacter.primaryColor}25`,
              }}
            >
              <CharacterAvatar
                characterId={selectedCharacter.id}
                size="lg"
                gesture={activeGesture}
              />
            </div>

            {/* Subtle Voice Wave Indicator */}
            {isPlayingAudio && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-stone-950 text-[10px] font-bold shadow-md flex items-center gap-1"
              >
                <Volume2 className="w-3 h-3 animate-pulse" />
                <span>Speaking</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Character Name & Role */}
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-lg font-bold text-white tracking-wide">
            {selectedCharacter.name}
          </h3>
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
            style={{
              borderColor: `${selectedCharacter.primaryColor}50`,
              color: selectedCharacter.primaryColor,
              backgroundColor: `${selectedCharacter.primaryColor}15`,
            }}
          >
            {selectedCharacter.role}
          </span>
          <button
            onClick={handlePreviewVoice}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Preview voice"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-emerald-400 animate-pulse' : ''}`} />
          </button>
        </div>

        {/* Description / Catchphrase */}
        <p className="text-xs text-stone-300 mt-2 max-w-[270px] leading-relaxed line-clamp-2">
          &ldquo;{selectedCharacter.catchphrase}&rdquo;
        </p>
      </div>

      {/* Guide Selector: 6 Minimalist Character Cards */}
      <div className="relative z-10 my-2">
        <div className="grid grid-cols-3 gap-2">
          {ASSISTANTS.map((assistant) => {
            const isSelected = assistant.id === currentSelectedId;
            return (
              <motion.button
                key={assistant.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoose(assistant)}
                className={`relative flex flex-col items-center p-2 rounded-2xl border transition-all text-center ${
                  isSelected
                    ? 'bg-stone-900/90 border-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-stone-900/40 border-stone-800/80 hover:border-stone-700 opacity-75 hover:opacity-100'
                }`}
              >
                {/* Active Indicator Check */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-400 flex items-center justify-center text-stone-950 shadow">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                <CharacterAvatar
                  characterId={assistant.id}
                  size="sm"
                  gesture="idle"
                />

                <span className="text-xs font-semibold text-stone-200 mt-1.5 leading-none">
                  {assistant.name}
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5 leading-none truncate max-w-[65px]">
                  {assistant.archetype}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 flex flex-col items-center gap-2 pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleConfirm}
          className="w-full py-3.5 px-6 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-sm text-stone-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 transition-all cursor-pointer"
        >
          <span>Continue with {selectedCharacter.name}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <button
          onClick={onSkip}
          className="text-xs text-stone-400 hover:text-stone-200 transition-colors font-medium py-1"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};
