import { AssistantCharacter, AssistantGesture, AssistantVoiceSettings, VoiceCommand } from '../types';

// Web Audio API Synthesizer for subtle chime feedback
class SoundFX {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playChime(type: 'listen' | 'recognized' | 'speak' | 'success' | 'tap') {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'listen') {
        // High crisp double ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'recognized') {
        // Cheerful triad chord
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'success') {
        // Fanfare flourish
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        // Soft click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {
      // Audio autoplay restrictions or errors handled silently
    }
  }
}

export const soundFX = new SoundFX();

// Browser Speech Synthesis (Text-to-Speech)
export function speakAssistantVoice(
  text: string,
  settings: AssistantVoiceSettings,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onEnd?.();
    return () => {};
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = settings.pitch || 1.0;
    utterance.rate = settings.rate || 1.0;
    utterance.volume = 1.0;

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      let chosenVoice = null;
      if (settings.gender === 'female') {
        chosenVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Female') ||
              v.name.includes('Samantha') ||
              v.name.includes('Victoria') ||
              v.name.includes('Zira') ||
              v.name.includes('Google UK English Female') ||
              v.name.includes('Karen') ||
              v.name.includes('Moira'))
        );
      } else {
        chosenVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Male') ||
              v.name.includes('Alex') ||
              v.name.includes('Daniel') ||
              v.name.includes('David') ||
              v.name.includes('Google UK English Male') ||
              v.name.includes('Rishi') ||
              v.name.includes('George'))
        );
      }

      if (!chosenVoice) {
        chosenVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
      }
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
    }

    utterance.onstart = () => {
      soundFX.playChime('speak');
      options?.onStart?.();
    };

    utterance.onend = () => {
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      options?.onError?.(e);
      options?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  } catch (err) {
    options?.onError?.(err);
    options?.onEnd?.();
    return () => {};
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Check Speech Recognition capability
export function isSpeechRecognitionAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export interface VoiceCommandMatchResult {
  command?: VoiceCommand;
  isMatched: boolean;
  gesture: AssistantGesture;
  gestureLabel: string;
  spokenQuery: string;
  responseText: string;
  actionType?: 'deposit' | 'optimize' | 'zen' | 'quest' | 'shield' | 'greeting' | 'advice' | 'minimize' | 'switch_guide';
  depositAmount?: number;
  targetAssistantId?: string;
}

// Intelligent Matcher for Spoken Phrases
export function matchSpokenIntent(
  rawTranscript: string,
  assistant: AssistantCharacter,
  allAssistants: AssistantCharacter[]
): VoiceCommandMatchResult {
  const query = rawTranscript.trim().toLowerCase();

  // 1. Direct match with current assistant's specific commands
  for (const cmd of assistant.commands) {
    const phrase = cmd.phrase.toLowerCase();
    const label = cmd.label.toLowerCase();
    if (
      query.includes(phrase) ||
      phrase.includes(query) ||
      query.includes(cmd.id) ||
      (cmd.actionType === 'deposit' && query.includes('deposit') && query.includes(assistant.name.toLowerCase()))
    ) {
      return {
        command: cmd,
        isMatched: true,
        gesture: cmd.gesture,
        gestureLabel: cmd.gestureLabel,
        spokenQuery: rawTranscript,
        responseText: cmd.responseText,
        actionType: cmd.actionType,
        depositAmount: cmd.depositAmount,
      };
    }
  }

  // 2. Switching to another assistant by name (e.g. "switch to Maya", "talk to Aarav", "call Leo")
  for (const a of allAssistants) {
    const aName = a.name.toLowerCase();
    if (
      (query.includes('switch') || query.includes('change') || query.includes('call') || query.includes('choose')) &&
      query.includes(aName)
    ) {
      return {
        isMatched: true,
        gesture: 'wave',
        gestureLabel: '👋 Companion Handoff',
        spokenQuery: rawTranscript,
        responseText: `Switching to ${a.name}! ${a.catchphrase}`,
        actionType: 'switch_guide',
        targetAssistantId: a.id,
      };
    }
  }

  // 3. Deposit parsing (e.g. "deposit 100", "save 50", "add 25", "invest 200")
  const depositMatch = query.match(/(?:deposit|save|add|invest)\s*(?:₹|rupees|rs)?\s*(\d+)/i);
  if (depositMatch && depositMatch[1]) {
    const amt = parseInt(depositMatch[1], 10);
    if (!isNaN(amt) && amt > 0) {
      return {
        isMatched: true,
        gesture: assistant.signatureGesture,
        gestureLabel: `${assistant.name}'s Signature Gesture`,
        spokenQuery: rawTranscript,
        responseText: `Executing voice deposit of ₹${amt}! Added to your city treasury.`,
        actionType: 'deposit',
        depositAmount: amt,
      };
    }
  }

  // 4. Minimize / Hide command
  if (query.includes('minimize') || query.includes('hide') || query.includes('close assistant') || query.includes('collapse')) {
    return {
      isMatched: true,
      gesture: 'wave',
      gestureLabel: '👋 Minimize Goodbye',
      spokenQuery: rawTranscript,
      responseText: "I'll be right here in the corner whenever you need me!",
      actionType: 'minimize',
    };
  }

  // 5. Quests or Challenges
  if (query.includes('quest') || query.includes('challenge') || query.includes('task') || query.includes('mission')) {
    return {
      isMatched: true,
      gesture: 'celebrate',
      gestureLabel: '🎉 Quest Alert',
      spokenQuery: rawTranscript,
      responseText: `Checking active quests! Keep your streak alive to unlock bonus city rewards!`,
      actionType: 'quest',
    };
  }

  // 6. Greetings ("hello", "hey", "hi", "good morning")
  if (query.includes('hello') || query.includes('hey') || query.includes('hi') || query.includes('namaste')) {
    return {
      isMatched: true,
      gesture: 'wave',
      gestureLabel: '👋 Friendly Greeting',
      spokenQuery: rawTranscript,
      responseText: `Hello, Mayor! I'm ${assistant.name}. ${assistant.catchphrase}`,
      actionType: 'greeting',
    };
  }

  // 7. General Advice or "what should I do?"
  if (query.includes('advice') || query.includes('tip') || query.includes('help') || query.includes('what should i do')) {
    return {
      isMatched: true,
      gesture: 'thinking',
      gestureLabel: '🤔 Strategic Consideration',
      spokenQuery: rawTranscript,
      responseText: `${assistant.name}'s advice: Consistent micro-deposits compound into impressive skylines. Never skip a day!`,
      actionType: 'advice',
    };
  }

  // 8. Fallback fallback response tailored to assistant's personality
  return {
    isMatched: true,
    gesture: assistant.signatureGesture,
    gestureLabel: `${assistant.name}'s Response`,
    spokenQuery: rawTranscript,
    responseText: `Understood: "${rawTranscript}". ${assistant.catchphrase}`,
    actionType: 'advice',
  };
}
