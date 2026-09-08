import React from 'react';
import { motion } from 'motion/react';
import { AssistantGesture } from '../types';

export interface CharacterAvatarProps {
  characterId?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  expression?: AssistantGesture | 'happy';
  gesture?: AssistantGesture;
  showSpeech?: boolean;
  speechText?: string;
  gestureTag?: string;
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId = 'nova',
  size = 'md',
  expression = 'idle',
  gesture,
  showSpeech = false,
  speechText,
  gestureTag,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-22 h-22',
    xl: 'w-32 h-32',
  };

  const id = (characterId || 'nova').toLowerCase();
  const currentGesture: AssistantGesture = gesture || (expression === 'happy' ? 'celebrate' : expression) || 'idle';

  // Floating & Gesture Animation Variants
  const animVariants =
    currentGesture === 'wave'
      ? { y: [0, -5, 0], rotate: [0, 4, -4, 0] }
      : currentGesture === 'celebrate'
      ? { y: [0, -10, 0], scale: [1, 1.12, 1] }
      : currentGesture === 'thinking'
      ? { y: [0, -2, 0], rotate: [0, 4, 0] }
      : currentGesture === 'point'
      ? { x: [0, 6, 0], y: [0, -2, 0] }
      : currentGesture === 'salute'
      ? { y: [0, -4, 0], scale: [1, 1.05, 1] }
      : currentGesture === 'zen_bow'
      ? { y: [0, 5, 0], scale: [1, 0.96, 1] }
      : currentGesture === 'glasses_adjust'
      ? { y: [0, -2, 0], rotate: [-2, 2, 0] }
      : currentGesture === 'builder_flex'
      ? { x: [-2, 2, -2, 0], y: [0, -4, 0], scale: [1, 1.08, 1] }
      : currentGesture === 'cyber_scan'
      ? { y: [0, -3, 0], scale: [1, 1.05, 1] }
      : currentGesture === 'shield_guard'
      ? { scale: [1, 1.06, 1], y: [0, -1, 0] }
      : { y: [0, -3, 0] };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Speech Bubble */}
      {showSpeech && speechText && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-white text-stone-900 px-4 py-2 rounded-2xl shadow-xl border border-stone-200 text-xs font-semibold"
        >
          {speechText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
        </motion.div>
      )}

      {/* Floating Gesture Tag Pill */}
      {gestureTag && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-stone-900/90 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40 text-[9px] font-bold shadow-lg"
        >
          {gestureTag}
        </motion.div>
      )}

      {/* Stylized Avatar Illustration */}
      <motion.div
        animate={animVariants}
        transition={{ repeat: Infinity, duration: currentGesture === 'builder_flex' || currentGesture === 'cyber_scan' ? 1.5 : 3, ease: 'easeInOut' }}
        className={`${sizeClasses[size]} relative rounded-full overflow-hidden shadow-lg border-2 flex-shrink-0`}
        style={{
          borderColor:
            id === 'aarav'
              ? '#06B6D4'
              : id === 'maya'
              ? '#EC4899'
              : id === 'leo'
              ? '#F59E0B'
              : id === 'zara'
              ? '#A855F7'
              : id === 'kabir'
              ? '#14B8A6'
              : '#10B981',
        }}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ========================================================= */}
          {/* 1. NOVA (Female / Explorer)                               */}
          {/* ========================================================= */}
          {id === 'nova' && (
            <>
              {/* Background aura */}
              <circle cx="60" cy="60" r="58" fill="#FEF3C7" />
              <circle cx="60" cy="60" r="50" fill="#D1FAE5" opacity="0.6" />

              {/* Hair back */}
              <path
                d="M30 45 C30 20, 90 20, 90 45 C94 65, 96 85, 90 105 C85 110, 35 110, 30 105 C24 85, 26 65, 30 45 Z"
                fill="#5A2E14"
              />

              {/* Explorer Jacket */}
              <path
                d="M32 95 C35 85, 45 80, 60 80 C75 80, 85 85, 88 95 L95 120 L25 120 Z"
                fill="#4F772D"
              />
              <path d="M48 80 L60 100 L72 80 Z" fill="#F8FAFC" />
              <path d="M52 75 C55 77, 65 77, 68 75 L63 88 L57 88 Z" fill="#E07A5F" />

              {/* Neck & Face */}
              <rect x="52" y="65" width="16" height="15" fill="#FCD3B8" rx="4" />
              <path
                d="M38 48 C38 32, 82 32, 82 48 C82 66, 75 76, 60 76 C45 76, 38 66, 38 48 Z"
                fill="#FED7AA"
              />
              {/* Cheeks */}
              <circle cx="47" cy="58" r="4" fill="#FCA5A5" opacity="0.6" />
              <circle cx="73" cy="58" r="4" fill="#FCA5A5" opacity="0.6" />

              {/* Eyes */}
              <circle cx="49" cy="50" r="4" fill="#3B2314" />
              <circle cx="50.5" cy="48.5" r="1.5" fill="#FFFFFF" />
              <circle cx="71" cy="50" r="4" fill="#3B2314" />
              <circle cx="72.5" cy="48.5" r="1.5" fill="#FFFFFF" />

              {/* Eyebrows */}
              <path d="M45 43 Q49 40 54 42" stroke="#5A2E14" strokeWidth="2" strokeLinecap="round" />
              <path d="M66 42 Q71 40 75 43" stroke="#5A2E14" strokeWidth="2" strokeLinecap="round" />
              <path d="M60 52 Q62 55 60 57" stroke="#E29578" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M53 62 Q60 69 67 62" stroke="#B91C1C" strokeWidth="2.2" fill="#FFFFFF" strokeLinecap="round" />

              {/* Front Bangs */}
              <path
                d="M36 40 C42 28, 55 28, 60 38 C65 28, 78 28, 84 40 C75 32, 65 33, 60 39 C55 33, 45 32, 36 40 Z"
                fill="#6E381A"
              />

              {/* Adventurer Headband + Sprout */}
              <path d="M37 36 C50 30, 70 30, 83 36" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="60" cy="31" r="3.5" fill="#10B981" />
              <path d="M60 29 C62 26, 64 27, 63 30 Z" fill="#34D399" />
            </>
          )}

          {/* ========================================================= */}
          {/* 2. AARAV (Male / Strategist)                              */}
          {/* ========================================================= */}
          {id === 'aarav' && (
            <>
              {/* Background aura */}
              <circle cx="60" cy="60" r="58" fill="#E0F2FE" />
              <circle cx="60" cy="60" r="50" fill="#BAE6FD" opacity="0.6" />

              {/* Hair back */}
              <path
                d="M36 42 C36 20, 84 20, 84 42 C86 55, 84 62, 82 70 C75 75, 45 75, 38 70 C36 62, 34 55, 36 42 Z"
                fill="#1E293B"
              />

              {/* High-tech Navy Suit */}
              <path
                d="M30 95 C35 83, 45 78, 60 78 C75 78, 85 83, 90 95 L96 120 L24 120 Z"
                fill="#0F172A"
              />
              <path d="M50 78 L60 98 L70 78 Z" fill="#E2E8F0" />
              <path d="M57 84 L60 110 L63 84 Z" fill="#0284C7" />

              {/* Neck & Face */}
              <rect x="52" y="65" width="16" height="15" fill="#FBD3B2" rx="4" />
              <path
                d="M39 46 C39 30, 81 30, 81 46 C81 65, 74 76, 60 76 C46 76, 39 65, 39 46 Z"
                fill="#F7C59F"
              />

              {/* Cheeks */}
              <circle cx="47" cy="59" r="3.5" fill="#FCA5A5" opacity="0.4" />
              <circle cx="73" cy="59" r="3.5" fill="#FCA5A5" opacity="0.4" />

              {/* Eyes */}
              <circle cx="48" cy="50" r="3.8" fill="#0F172A" />
              <circle cx="49.5" cy="48.5" r="1.5" fill="#FFFFFF" />
              <circle cx="72" cy="50" r="3.8" fill="#0F172A" />
              <circle cx="73.5" cy="48.5" r="1.5" fill="#FFFFFF" />

              {/* Glowing Cyan Smart Glasses */}
              <rect
                x="41"
                y="43"
                width="16"
                height="13"
                rx="3.5"
                fill="#06B6D4"
                fillOpacity="0.25"
                stroke="#0891B2"
                strokeWidth="2"
              />
              <rect
                x="63"
                y="43"
                width="16"
                height="13"
                rx="3.5"
                fill="#06B6D4"
                fillOpacity="0.25"
                stroke="#0891B2"
                strokeWidth="2"
              />
              <line x1="57" y1="48" x2="63" y2="48" stroke="#0891B2" strokeWidth="2" />
              <path d="M41 46 L37 45" stroke="#0891B2" strokeWidth="2" />
              <path d="M79 46 L83 45" stroke="#0891B2" strokeWidth="2" />

              {/* Eyebrows */}
              <path d="M44 38 Q48 35 55 37" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M65 37 Q72 35 76 38" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

              {/* Nose & Smile */}
              <path d="M60 52 Q62 55 60 58" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M53 64 Q60 69 67 64" stroke="#9A3412" strokeWidth="2" fill="#FFFFFF" strokeLinecap="round" />

              {/* Hair Top Crop */}
              <path
                d="M36 40 C38 22, 82 22, 84 40 C75 30, 68 28, 58 30 C48 28, 42 32, 36 40 Z"
                fill="#0F172A"
              />
            </>
          )}

          {/* ========================================================= */}
          {/* 3. MAYA (Female / Zen Saver)                              */}
          {/* ========================================================= */}
          {id === 'maya' && (
            <>
              {/* Background aura */}
              <circle cx="60" cy="60" r="58" fill="#FDF2F8" />
              <circle cx="60" cy="60" r="50" fill="#FCE7F3" opacity="0.6" />

              {/* Hair Back Updo */}
              <circle cx="60" cy="30" r="18" fill="#292524" />
              <path
                d="M28 50 C28 24, 92 24, 92 50 C96 75, 92 90, 88 105 C80 110, 40 110, 32 105 C28 90, 24 75, 28 50 Z"
                fill="#292524"
              />

              {/* Rose Cardigan */}
              <path
                d="M32 94 C35 84, 45 80, 60 80 C75 80, 85 84, 88 94 L95 120 L25 120 Z"
                fill="#E11D48"
              />
              <path d="M46 80 L60 98 L74 80 Z" fill="#FFF1F2" />
              <circle cx="60" cy="98" r="3" fill="#FB7185" />

              {/* Neck & Face */}
              <rect x="52" y="65" width="16" height="15" fill="#FCD3B8" rx="4" />
              <path
                d="M38 48 C38 32, 82 32, 82 48 C82 66, 75 76, 60 76 C45 76, 38 66, 38 48 Z"
                fill="#FED7AA"
              />

              {/* Cheeks */}
              <circle cx="46" cy="58" r="4.5" fill="#F43F5E" opacity="0.4" />
              <circle cx="74" cy="58" r="4.5" fill="#F43F5E" opacity="0.4" />

              {/* Gentle Peaceful Eyes with Eyelashes */}
              <path d="M44 50 Q49 45 54 50" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M43 48 L41 45" stroke="#292524" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M66 50 Q71 45 76 50" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M77 48 L79 45" stroke="#292524" strokeWidth="1.5" strokeLinecap="round" />

              {/* Eyebrows */}
              <path d="M44 42 Q49 39 54 41" stroke="#44403C" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M66 41 Q71 39 76 42" stroke="#44403C" strokeWidth="1.8" strokeLinecap="round" />

              {/* Smile */}
              <path d="M60 52 Q62 55 60 57" stroke="#E29578" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M53 62 Q60 68 67 62" stroke="#BE123C" strokeWidth="2" strokeLinecap="round" />

              {/* Hair Waves Front */}
              <path
                d="M36 42 C44 32, 54 34, 60 40 C66 34, 76 32, 84 42 C78 35, 68 36, 60 42 C52 36, 42 35, 36 42 Z"
                fill="#1C1917"
              />

              {/* Lotus Blossom Hair Pin */}
              <g transform="translate(80, 32)">
                <circle cx="0" cy="0" r="6" fill="#F43F5E" />
                <circle cx="-4" cy="-4" r="4" fill="#FB7185" />
                <circle cx="4" cy="-4" r="4" fill="#FB7185" />
                <circle cx="0" cy="-6" r="4.5" fill="#FDA4AF" />
                <circle cx="0" cy="0" r="2.5" fill="#FEF08A" />
              </g>
            </>
          )}

          {/* ========================================================= */}
          {/* 4. LEO (Male / Bold Builder)                              */}
          {/* ========================================================= */}
          {id === 'leo' && (
            <>
              {/* Background aura */}
              <circle cx="60" cy="60" r="58" fill="#FFFBEB" />
              <circle cx="60" cy="60" r="50" fill="#FEF3C7" opacity="0.6" />

              {/* Hair Back */}
              <path
                d="M34 40 C34 18, 86 18, 86 40 C88 56, 86 64, 82 72 C74 76, 46 76, 38 72 C34 64, 32 56, 34 40 Z"
                fill="#78350F"
              />

              {/* Builder Amber Hoodie */}
              <path
                d="M30 94 C34 82, 45 78, 60 78 C75 78, 86 82, 90 94 L96 120 L24 120 Z"
                fill="#D97706"
              />
              <path d="M48 78 L60 98 L72 78 Z" fill="#1F2937" />
              <line x1="60" y1="84" x2="60" y2="110" stroke="#FDE68A" strokeWidth="2" />

              {/* Neck & Face */}
              <rect x="52" y="65" width="16" height="15" fill="#FCD3B8" rx="4" />
              <path
                d="M39 46 C39 30, 81 30, 81 46 C81 65, 74 76, 60 76 C46 76, 39 65, 39 46 Z"
                fill="#FED7AA"
              />

              {/* Cheeks */}
              <circle cx="47" cy="58" r="4" fill="#FCA5A5" opacity="0.5" />
              <circle cx="73" cy="58" r="4" fill="#FCA5A5" opacity="0.5" />

              {/* Left Eye Sparkling, Right Eye Friendly Winking */}
              <circle cx="48" cy="50" r="4" fill="#451A03" />
              <circle cx="49.5" cy="48" r="1.6" fill="#FFFFFF" />
              <path d="M68 50 Q72 46 76 50" stroke="#451A03" strokeWidth="2.8" strokeLinecap="round" />

              {/* Eyebrows with energetic arch */}
              <path d="M43 40 Q48 36 54 39" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M66 38 Q72 36 77 40" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

              {/* Big energetic grin */}
              <path d="M51 61 Q60 71 69 61" stroke="#B45309" strokeWidth="2.5" fill="#FFFFFF" strokeLinecap="round" />

              {/* Spiky Textured Hair Front */}
              <path
                d="M36 38 L42 26 L50 32 L58 22 L66 32 L74 24 L80 34 L84 40 C75 32, 65 32, 60 38 C55 32, 45 32, 36 38 Z"
                fill="#92400E"
              />

              {/* Builder Cap / Visor */}
              <path d="M36 36 C50 30, 70 30, 84 36" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
              <path d="M38 34 C50 28, 70 28, 82 34" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}

          {/* ========================================================= */}
          {/* 5. ZARA (Female / Tech Pioneer)                           */}
          {/* ========================================================= */}
          {id === 'zara' && (
            <>
              {/* Background aura */}
              <circle cx="60" cy="60" r="58" fill="#F3E8FF" />
              <circle cx="60" cy="60" r="50" fill="#E9D5FF" opacity="0.6" />

              {/* Sharp Purple Bob Hair Back */}
              <path
                d="M30 45 C30 20, 90 20, 90 45 C92 68, 90 85, 84 95 C78 100, 42 100, 36 95 C30 85, 28 68, 30 45 Z"
                fill="#4C1D95"
              />

              {/* Cyber Suit */}
              <path
                d="M30 94 C34 82, 45 78, 60 78 C75 78, 86 82, 90 94 L96 120 L24 120 Z"
                fill="#6D28D9"
              />
              <path d="M48 78 L60 98 L72 78 Z" fill="#0F172A" />
              <circle cx="60" cy="94" r="3" fill="#22D3EE" />

              {/* Neck & Face */}
              <rect x="52" y="65" width="16" height="15" fill="#FCD3B8" rx="4" />
              <path
                d="M38 48 C38 32, 82 32, 82 48 C82 66, 75 76, 60 76 C45 76, 38 66, 38 48 Z"
                fill="#F7C59F"
              />

              {/* Cheeks */}
              <circle cx="46" cy="58" r="4" fill="#C084FC" opacity="0.4" />
              <circle cx="74" cy="58" r="4" fill="#C084FC" opacity="0.4" />

              {/* Sharp Intelligent Eyes */}
              <circle cx="48" cy="50" r="3.8" fill="#3B0764" />
              <circle cx="49.5" cy="48.5" r="1.5" fill="#22D3EE" />
              <circle cx="72" cy="50" r="3.8" fill="#3B0764" />
              <circle cx="73.5" cy="48.5" r="1.5" fill="#22D3EE" />

              {/* Eyebrows */}
              <path d="M44 42 Q49 39 54 41" stroke="#581C87" strokeWidth="2" strokeLinecap="round" />
              <path d="M66 41 Q71 39 76 42" stroke="#581C87" strokeWidth="2" strokeLinecap="round" />

              {/* Smart Confident Smile */}
              <path d="M60 52 Q62 55 60 57" stroke="#E29578" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M53 62 Q60 68 67 62" stroke="#7E22CE" strokeWidth="2.2" fill="#FFFFFF" strokeLinecap="round" />

              {/* Sharp Front Bangs with Neon Streaks */}
              <path
                d="M34 40 C42 26, 78 26, 86 40 C76 34, 66 35, 60 40 C54 35, 44 34, 34 40 Z"
                fill="#5B21B6"
              />
              <path d="M42 34 L40 48" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" />

              {/* Futuristic Neon Cyber Headset */}
              <path d="M34 38 C34 26, 86 26, 86 38" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" />
              <circle cx="34" cy="48" r="5" fill="#22D3EE" />
              <circle cx="34" cy="48" r="2.5" fill="#FFFFFF" />
              <path d="M34 51 Q38 62 48 64" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {/* ========================================================= */}
          {/* 6. KABIR (Male / Guardian)                                */}
          {/* ========================================================= */}
          {id === 'kabir' && (
            <>
              {/* Background aura */}
              <circle cx="60" cy="60" r="58" fill="#F0FDFA" />
              <circle cx="60" cy="60" r="50" fill="#CCFBF1" opacity="0.6" />

              {/* Hair Back */}
              <path
                d="M36 42 C36 20, 84 20, 84 42 C86 55, 84 62, 82 70 C75 75, 45 75, 38 70 C36 62, 34 55, 36 42 Z"
                fill="#1C1917"
              />

              {/* Charcoal Coat with Warm Teal Knitted Scarf */}
              <path
                d="M30 94 C34 82, 45 78, 60 78 C75 78, 86 82, 90 94 L96 120 L24 120 Z"
                fill="#334155"
              />
              <path
                d="M44 76 C52 74, 68 74, 76 76 C78 84, 76 96, 68 100 C60 102, 50 96, 44 88 Z"
                fill="#0D9488"
              />
              {/* Golden Shield Crest */}
              <path d="M60 84 L64 87 L64 93 L60 96 L56 93 L56 87 Z" fill="#F59E0B" />

              {/* Neck & Face */}
              <rect x="52" y="65" width="16" height="15" fill="#FCD3B8" rx="4" />
              <path
                d="M39 46 C39 30, 81 30, 81 46 C81 65, 74 76, 60 76 C46 76, 39 65, 39 46 Z"
                fill="#F7C59F"
              />

              {/* Friendly Hazel Eyes */}
              <circle cx="48" cy="49" r="3.8" fill="#451A03" />
              <circle cx="49.5" cy="47.5" r="1.5" fill="#FFFFFF" />
              <circle cx="72" cy="49" r="3.8" fill="#451A03" />
              <circle cx="73.5" cy="47.5" r="1.5" fill="#FFFFFF" />

              {/* Eyebrows */}
              <path d="M44 40 Q49 37 54 39" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M66 39 Q71 37 76 40" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />

              {/* Trimmed Beard and Mustache */}
              <path
                d="M44 58 C44 74, 76 74, 76 58 C72 65, 48 65, 44 58 Z"
                fill="#292524"
                opacity="0.85"
              />
              <path d="M52 59 Q60 62 68 59" stroke="#292524" strokeWidth="2" strokeLinecap="round" />

              {/* Smile */}
              <path d="M54 64 Q60 68 66 64" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />

              {/* Hair Front */}
              <path
                d="M36 38 C40 22, 80 22, 84 38 C76 30, 68 28, 60 30 C52 28, 44 30, 36 38 Z"
                fill="#1C1917"
              />
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
