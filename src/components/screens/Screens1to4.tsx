import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sprout,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { NovaGuide } from '../NovaGuide';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

// =========================================================================
// SCREEN 1: SPLASH SCREEN (CLEAN CARTOON MONEY THEME)
// =========================================================================
interface SplashScreenProps {
  onGetStarted: () => void;
}

// Cartoon Wavy Banknote SVG based on user reference illustration
const CartoonWavyDollar: React.FC<{
  className?: string;
  width?: number;
  height?: number;
  rotate?: number;
  flip?: boolean;
}> = ({ className = '', width = 90, height = 55, rotate = 0, flip = false }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 75"
      className={`drop-shadow-lg ${className}`}
      style={{
        transform: `rotate(${rotate}deg) ${flip ? 'scaleX(-1)' : ''}`,
        transformOrigin: 'center center',
      }}
    >
      <defs>
        {/* Cartoon Bill Gradient */}
        <linearGradient id="billGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>

      {/* Main S-Curve Wavy Bill Path */}
      <path
        d="M 12 18 C 35 6, 65 30, 108 14 C 114 26, 110 52, 102 64 C 65 80, 35 54, 8 68 C 2 54, 5 30, 12 18 Z"
        fill="#86efac"
      />
      <path
        d="M 16 21 C 37 11, 65 33, 104 18 C 109 28, 106 48, 99 59 C 65 74, 37 49, 13 63 C 8 51, 10 31, 16 21 Z"
        fill="url(#billGreenGrad)"
        stroke="#14532d"
        strokeWidth="1.5"
      />

      {/* Inner White/Mint Border Filigree */}
      <path
        d="M 21 24 C 40 16, 65 35, 99 22 C 103 30, 101 44, 95 53 C 65 67, 40 45, 18 57 C 14 47, 16 32, 21 24 Z"
        fill="none"
        stroke="#bbf7d0"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Center Oval with Dollar Sign */}
      <ellipse cx="58" cy="38" rx="16" ry="14" fill="#bbf7d0" />
      <ellipse cx="58" cy="38" rx="14" ry="12" fill="#dcfce7" />
      <text
        x="58"
        y="44"
        fontSize="17"
        fontWeight="900"
        fill="#15803d"
        fontFamily="sans-serif"
        textAnchor="middle"
        style={{ fontStyle: 'italic' }}
      >
        $
      </text>

      {/* Corner / Margin Decorative Dots */}
      <circle cx="28" cy="32" r="3" fill="#bbf7d0" />
      <circle cx="25" cy="50" r="2.5" fill="#bbf7d0" />
      <circle cx="88" cy="27" r="2.5" fill="#bbf7d0" />
      <circle cx="86" cy="46" r="3" fill="#bbf7d0" />
    </svg>
  );
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-gradient-to-b from-stone-950 via-emerald-950 to-stone-950 text-white p-6 overflow-hidden select-none">
      {/* Background Animated Radial Sunburst */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Emerald Radial Aura */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/25 via-emerald-900/15 to-transparent" />

        {/* Rotating Sunbeam Rays */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 55, ease: 'linear' }}
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-20 bg-[repeating-conic-gradient(from_0deg,_#10b981_0deg_15deg,_transparent_15deg_30deg)]"
        />
      </div>

      {/* Floating Cartoon Money Bills Shower / Drift Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {/* Top Left Floating Bill */}
        <motion.div
          animate={{
            y: [-8, 12, -8],
            x: [-4, 6, -4],
            rotate: [-14, -6, -14],
          }}
          transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
          className="absolute top-8 left-2"
        >
          <CartoonWavyDollar width={95} height={60} rotate={-10} />
        </motion.div>

        {/* Top Right Floating Bill */}
        <motion.div
          animate={{
            y: [10, -10, 10],
            x: [6, -6, 6],
            rotate: [20, 28, 20],
          }}
          transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 0.4 }}
          className="absolute top-12 -right-3"
        >
          <CartoonWavyDollar width={105} height={66} rotate={24} flip />
        </motion.div>

        {/* Top Center-Right Small Bill */}
        <motion.div
          animate={{
            y: [-12, 8, -12],
            rotate: [8, -4, 8],
          }}
          transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 0.8 }}
          className="absolute top-28 right-16 opacity-75"
        >
          <CartoonWavyDollar width={70} height={44} rotate={6} />
        </motion.div>

        {/* Mid-Left Drifting Bill */}
        <motion.div
          animate={{
            y: [12, -14, 12],
            x: [-6, 8, -6],
            rotate: [-28, -18, -28],
          }}
          transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 0.2 }}
          className="absolute top-[42%] -left-4"
        >
          <CartoonWavyDollar width={115} height={72} rotate={-24} />
        </motion.div>

        {/* Mid-Right Drifting Bill */}
        <motion.div
          animate={{
            y: [-10, 14, -10],
            x: [5, -7, 5],
            rotate: [32, 22, 32],
          }}
          transition={{ repeat: Infinity, duration: 4.6, ease: 'easeInOut', delay: 0.6 }}
          className="absolute top-[46%] -right-5"
        >
          <CartoonWavyDollar width={110} height={68} rotate={28} />
        </motion.div>

        {/* Bottom Left Small Bill */}
        <motion.div
          animate={{
            y: [-8, 10, -8],
            rotate: [-8, 4, -8],
          }}
          transition={{ repeat: Infinity, duration: 3.9, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-32 left-4 opacity-80"
        >
          <CartoonWavyDollar width={78} height={48} rotate={-6} flip />
        </motion.div>

        {/* Bottom Right Drifting Bill */}
        <motion.div
          animate={{
            y: [10, -12, 10],
            x: [-4, 6, -4],
            rotate: [18, 10, 18],
          }}
          transition={{ repeat: Infinity, duration: 4.4, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-28 right-3"
        >
          <CartoonWavyDollar width={90} height={56} rotate={14} />
        </motion.div>
      </div>

      {/* Main Content Area (Centered FinCity Title & Subtitle framed by floating notes) */}
      <div className="relative z-20 my-auto flex flex-col items-center justify-center text-center px-4 py-8">
        {/* App Title & Pure Subtitle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center gap-2"
        >
          <h1 className="text-5xl font-black tracking-tight font-['Outfit',sans-serif] bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(16,185,129,0.3)]">
            FinCity
          </h1>
          <p className="text-sm font-medium tracking-wide text-emerald-300/90 max-w-[280px]">
            a gamified money saving app
          </p>
        </motion.div>
      </div>

      {/* Bottom Center "Get Started" CTA */}
      <div className="relative z-20 flex justify-center pb-4">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onGetStarted}
          className="relative w-full max-w-[280px] py-4 px-8 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all text-base tracking-wide overflow-hidden group"
        >
          {/* Shimmer Light Sweep */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: 'linear' }}
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 pointer-events-none"
          />

          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
};

// =========================================================================
// SCREEN 2: CHARACTER INTRO
// =========================================================================
interface CharacterIntroScreenProps {
  onLetsGo: () => void;
  onSkip: () => void;
}

export const CharacterIntroScreen: React.FC<CharacterIntroScreenProps> = ({
  onLetsGo,
  onSkip,
}) => {
  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-900 text-white p-6 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Speech Bubble Dialog */}
      <div className="relative z-10 pt-6 flex flex-col items-center">
        <motion.div
          initial={{ y: -10, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          className="relative bg-white text-stone-900 rounded-3xl p-5 shadow-2xl border border-stone-200 w-full max-w-[300px] text-center"
        >
          <p className="text-sm text-stone-600 font-medium leading-relaxed">
            Hey there! <br />
            I&apos;m <span className="text-emerald-600 font-bold text-base">Nova 🧭</span> <br />
            Let&apos;s build your city together!
          </p>
          {/* Bubble pointer */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
        </motion.div>
      </div>

      {/* Center Character Guide Illustration */}
      <div className="relative z-10 flex flex-col items-center my-auto">
        <NovaGuide size="xl" expression="wave" />
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 flex flex-col items-center gap-3 pb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLetsGo}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all text-base"
        >
          Let&apos;s go!
          <ArrowRight className="w-5 h-5" />
        </motion.button>
        <button
          onClick={onSkip}
          className="text-xs text-stone-400 hover:text-stone-200 transition-colors font-semibold"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SCREEN 3: ASK NAME
// =========================================================================
interface AskNameScreenProps {
  name: string;
  onChangeName: (val: string) => void;
  onContinue: () => void;
  assistantId?: string;
}

export const AskNameScreen: React.FC<AskNameScreenProps> = ({
  name,
  onChangeName,
  onContinue,
  assistantId = 'nova',
}) => {
  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-900 text-white p-6 overflow-hidden">
      {/* Top Assistant Avatar */}
      <div className="pt-10 flex flex-col items-center">
        <NovaGuide characterId={assistantId} size="lg" expression="happy" />
      </div>

      {/* Center Input Form */}
      <div className="my-auto flex flex-col items-center w-full max-w-[300px] mx-auto text-center">
        <h2 className="text-2xl font-bold font-['Outfit',sans-serif] text-stone-100 mb-6">
          What should <br /> we call you?
        </h2>

        <div className="w-full relative">
          <input
            type="text"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="Enter your name"
            maxLength={15}
            className="w-full py-3.5 px-4 rounded-xl bg-stone-800/90 border border-stone-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white font-semibold text-lg text-center outline-none transition-all placeholder:text-stone-500"
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          disabled={!name.trim()}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all text-base"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

// =========================================================================
// SCREEN 4: SIGNUP / SIGNIN SCREEN
// =========================================================================
interface SignupScreenProps {
  initialName?: string;
  onChangeName?: (name: string) => void;
  onBack: () => void;
  onContinueAuth: () => void;
}

interface AuthErrorInfo {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
  initialName = '',
  onChangeName,
  onBack,
  onContinueAuth,
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(initialName);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<AuthErrorInfo | null>(null);

  const saveLocalProfileAndProceed = () => {
    const finalName = name.trim() || initialName || email.split('@')[0] || 'Citizen';
    try {
      localStorage.setItem('fincity_user_email', email.trim());
      localStorage.setItem('fincity_user_name', finalName);
    } catch {
      // Ignore storage errors in private browsing
    }
    if (onChangeName) {
      onChangeName(finalName);
    }
    onContinueAuth();
  };

  const formatError = (err: any): AuthErrorInfo => {
    const code = err?.code || '';
    const message = err?.message || '';

    if (code === 'auth/weak-password') {
      return {
        title: 'Password Too Weak',
        description: 'Please use at least 6 characters with letters and numbers.',
      };
    }
    if (code === 'auth/invalid-email') {
      return {
        title: 'Invalid Email Address',
        description: 'Please enter a valid email format (e.g. name@example.com).',
      };
    }
    if (
      code === 'auth/user-not-found' ||
      code === 'auth/wrong-password' ||
      code === 'auth/invalid-credential'
    ) {
      return {
        title: 'Incorrect Credentials',
        description: 'The email or password does not match our records.',
        actionText: 'Continue Anyway',
        onAction: () => saveLocalProfileAndProceed(),
      };
    }
    if (code === 'auth/popup-closed-by-user') {
      return {
        title: 'Sign In Dismissed',
        description: 'The Google authentication window was closed before completing.',
      };
    }
    if (code === 'auth/popup-blocked') {
      return {
        title: 'Popup Blocked by Browser',
        description: 'Please enable popups for this site or use email sign-in.',
      };
    }
    if (code === 'auth/network-request-failed') {
      return {
        title: 'Network Timeout',
        description: 'Unable to reach authentication servers. Check your connection.',
        actionText: 'Continue Offline',
        onAction: () => saveLocalProfileAndProceed(),
      };
    }

    return {
      title: 'Authentication Notice',
      description:
        message.replace('Firebase: ', '') ||
        'Unable to complete cloud authentication.',
      actionText: 'Continue as Guest',
      onAction: () => saveLocalProfileAndProceed(),
    };
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !password.trim()) {
      setAuthError({
        title: 'Required Fields Missing',
        description: 'Please provide both your email address and password.',
      });
      return;
    }

    if (tab === 'signup' && password.length < 6) {
      setAuthError({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (tab === 'signup') {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password
          );
          // Persist initial user profile safely
          try {
            await setDoc(doc(db, 'users', userCredential.user.uid), {
              email: email.trim(),
              username: name.trim() || initialName || email.split('@')[0] || 'Citizen',
              createdAt: new Date().toISOString(),
            });
          } catch (dbErr) {
            console.warn('Initial user profile write deferred:', dbErr);
          }
          saveLocalProfileAndProceed();
          return;
        } catch (signupErr: any) {
          const code = signupErr?.code;
          // If email is already registered, try signing in directly with provided credentials
          if (code === 'auth/email-already-in-use') {
            try {
              await signInWithEmailAndPassword(auth, email.trim(), password);
              saveLocalProfileAndProceed();
              return;
            } catch (signInErr: any) {
              if (
                signInErr?.code === 'auth/operation-not-allowed' ||
                signInErr?.code === 'auth/admin-restricted-operation'
              ) {
                // Operation not allowed on backend, proceed seamlessly with local session
                saveLocalProfileAndProceed();
                return;
              }
              // If wrong password, throw original signup error or formatted error
              throw signupErr;
            }
          }
          // If email auth provider is disabled in Firebase console, seamlessly fallback to local session
          if (
            code === 'auth/operation-not-allowed' ||
            code === 'auth/admin-restricted-operation'
          ) {
            saveLocalProfileAndProceed();
            return;
          }
          throw signupErr;
        }
      } else {
        // Sign In tab
        try {
          await signInWithEmailAndPassword(auth, email.trim(), password);
          saveLocalProfileAndProceed();
          return;
        } catch (loginErr: any) {
          const code = loginErr?.code;
          if (
            code === 'auth/operation-not-allowed' ||
            code === 'auth/admin-restricted-operation'
          ) {
            saveLocalProfileAndProceed();
            return;
          }
          throw loginErr;
        }
      }
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      setAuthError(formatError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const additionalInfo = getAdditionalUserInfo(result);

      if (additionalInfo?.isNewUser) {
        try {
          await setDoc(doc(db, 'users', result.user.uid), {
            email: result.user.email,
            username: result.user.displayName || 'Citizen',
            createdAt: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn('Google initial profile write deferred:', dbErr);
        }
      }
      onContinueAuth();
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setAuthError(formatError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white p-5 overflow-y-auto overflow-x-hidden scrollbar-none select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer"
          title="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-[11px] font-semibold text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secure Sign-In</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="my-auto py-2 flex flex-col w-full max-w-[320px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold font-['Outfit',sans-serif] tracking-tight text-white">
            {tab === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {tab === 'signup'
              ? 'Start building your financial city today'
              : 'Sign in to access your saved city progress'}
          </p>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="relative p-1 rounded-xl bg-stone-900 border border-stone-800 flex items-center mb-4">
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setAuthError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
              tab === 'signup'
                ? 'bg-stone-800 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setAuthError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
              tab === 'signin'
                ? 'bg-stone-800 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Error Notification Banner */}
        <AnimatePresence>
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs mb-3 text-left"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-rose-300">{authError.title}</p>
                  <p className="text-[11px] text-rose-200/90 mt-0.5 leading-relaxed">
                    {authError.description}
                  </p>
                  {authError.actionText && authError.onAction && (
                    <button
                      type="button"
                      onClick={authError.onAction}
                      className="mt-2 text-[11px] font-bold text-emerald-300 hover:text-emerald-200 underline block cursor-pointer"
                    >
                      {authError.actionText} →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google One-Click CTA */}
        <button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          type="button"
          className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700/80 font-semibold text-stone-200 text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm disabled:opacity-50 cursor-pointer mb-3"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-2">
          <div className="flex-1 border-t border-stone-800" />
          <span className="px-2.5 text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
            or with email
          </span>
          <div className="flex-1 border-t border-stone-800" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-2.5">
          {tab === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                Your Name
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full py-2.5 pl-9 pr-3 rounded-xl bg-stone-900 border border-stone-800 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-stone-100 text-xs outline-none transition-all placeholder:text-stone-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full py-2.5 pl-9 pr-3 rounded-xl bg-stone-900 border border-stone-800 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-stone-100 text-xs outline-none transition-all placeholder:text-stone-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full py-2.5 pl-9 pr-9 rounded-xl bg-stone-900 border border-stone-800 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-stone-100 text-xs outline-none transition-all placeholder:text-stone-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-stone-500 hover:text-stone-300 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 text-stone-950 font-bold rounded-xl shadow-md shadow-emerald-500/15 transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
            ) : (
              <>
                <span>{tab === 'signup' ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </div>

      {/* Bottom Guest Option & Terms */}
      <div className="pt-2 text-center flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={onContinueAuth}
          className="text-xs text-stone-400 hover:text-stone-200 font-medium transition-colors cursor-pointer py-1"
        >
          Skip &amp; Explore as Guest →
        </button>
        <p className="text-[10px] text-stone-600 leading-tight">
          By signing in, you agree to FinCity Terms &amp; Privacy Policy
        </p>
      </div>
    </div>
  );
};
