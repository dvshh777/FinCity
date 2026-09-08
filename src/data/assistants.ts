import { AssistantCharacter } from '../types';

export const ASSISTANTS: AssistantCharacter[] = [
  {
    id: 'nova',
    name: 'Nova',
    gender: 'Female',
    role: 'The Explorer',
    archetype: 'Adventurer',
    badge: '🧭 Explorer',
    catchphrase: "Let's build your city together from the ground up!",
    bio: 'Curious, energetic, and eager to uncover hidden micro-savings on your journey.',
    primaryColor: '#10B981',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    accentBg: 'from-emerald-500/20 via-teal-500/10 to-stone-900/50',
    signatureGesture: 'point',
    voiceSettings: {
      pitch: 1.25,
      rate: 1.05,
      gender: 'female',
    },
    commands: [
      {
        id: 'nova-explore',
        phrase: 'Hey Nova, explore savings',
        label: '🧭 Explore Micro-Savings',
        gesture: 'point',
        gestureLabel: '🧭 Compass Scouting Point',
        responseText:
          "Scouting the horizon! I uncovered ₹25 in daily coffee change that can build your city's next park!",
        actionType: 'deposit',
        depositAmount: 25,
      },
      {
        id: 'nova-scout-quests',
        phrase: 'Hey Nova, scout quests',
        label: '🗺️ Scout Quests',
        gesture: 'salute',
        gestureLabel: '🫡 Explorer Salute',
        responseText:
          'Quest map active! Daily streak bonus and first deposit challenge are waiting for you!',
        actionType: 'quest',
      },
      {
        id: 'nova-first-brick',
        phrase: 'Lay the first brick',
        label: '🧱 Lay First Brick',
        gesture: 'celebrate',
        gestureLabel: '🎉 Victory Jump',
        responseText:
          "Foundation laid! ₹10 invested directly into your starter cottage. Let's grow!",
        actionType: 'deposit',
        depositAmount: 10,
      },
      {
        id: 'nova-greet',
        phrase: 'Hello Nova',
        label: '👋 Say Hello',
        gesture: 'wave',
        gestureLabel: '👋 Warm Adventure Wave',
        responseText:
          "Hey mayor! Ready to scout more savings and construct our dream skyline?",
        actionType: 'greeting',
      },
    ],
  },
  {
    id: 'aarav',
    name: 'Aarav',
    gender: 'Male',
    role: 'The Strategist',
    archetype: 'Optimizer',
    badge: '⚡ Strategist',
    catchphrase: 'Every rupee saved is an investment in your future empire.',
    bio: 'Analytical and tech-savvy. Loves maximizing compounding interest and balancing 50/30/20.',
    primaryColor: '#06B6D4',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    accentBg: 'from-cyan-500/20 via-blue-500/10 to-stone-900/50',
    signatureGesture: 'glasses_adjust',
    voiceSettings: {
      pitch: 0.95,
      rate: 1.1,
      gender: 'male',
    },
    commands: [
      {
        id: 'aarav-optimize',
        phrase: 'Hey Aarav, optimize budget',
        label: '📊 Optimize 50/30/20',
        gesture: 'glasses_adjust',
        gestureLabel: '👓 Smart Glasses Calibration',
        responseText:
          'Running optimization algorithms. Calibrated: 50% Needs, 30% Wants, and 20% Compound Savings. High fiscal efficiency!',
        actionType: 'optimize',
      },
      {
        id: 'aarav-compound',
        phrase: 'Calculate compounding return',
        label: '📈 Compound Analytics',
        gesture: 'thinking',
        gestureLabel: '🤔 Strategic Analysis',
        responseText:
          'Compounding projection: Adding ₹100 weekly yields exponential returns by year five. Depositing ₹50 into reserves!',
        actionType: 'deposit',
        depositAmount: 50,
      },
      {
        id: 'aarav-treasury',
        phrase: 'Audit my treasury',
        label: '⚡ Treasury Audit',
        gesture: 'salute',
        gestureLabel: '🫡 Executive Nod',
        responseText:
          'Audit complete: All vaults are secure, interest is accumulating, and liquidity is optimal.',
        actionType: 'advice',
      },
      {
        id: 'aarav-greet',
        phrase: 'Hello Aarav',
        label: '👋 Greet Strategist',
        gesture: 'wave',
        gestureLabel: '👋 Precise Executive Wave',
        responseText:
          'Greetings, Mayor. Strategic parameters are nominal. What financial objective shall we solve?',
        actionType: 'greeting',
      },
    ],
  },
  {
    id: 'maya',
    name: 'Maya',
    gender: 'Female',
    role: 'The Zen Saver',
    archetype: 'Mindful Guide',
    badge: '🌸 Zen Guide',
    catchphrase: 'Peaceful mind, prosperous city. Save mindfully without stress.',
    bio: 'Empathetic and calming. Specializes in worry-free budgeting, emergency funds, and joyful habits.',
    primaryColor: '#EC4899',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    accentBg: 'from-pink-500/20 via-rose-500/10 to-stone-900/50',
    signatureGesture: 'zen_bow',
    voiceSettings: {
      pitch: 1.05,
      rate: 0.92,
      gender: 'female',
    },
    commands: [
      {
        id: 'maya-zen',
        phrase: 'Hey Maya, find my zen',
        label: '🌸 Mindful Breathing Check',
        gesture: 'zen_bow',
        gestureLabel: '🧘 Serene Zen Bow',
        responseText:
          'Take a gentle deep breath. Money is an energy of freedom, not stress. You are doing wonderfully on your path.',
        actionType: 'zen',
      },
      {
        id: 'maya-peace-deposit',
        phrase: 'Bless my peace fund',
        label: '💖 Peace Fund Deposit',
        gesture: 'celebrate',
        gestureLabel: '🌸 Lotus Petal Aura',
        responseText:
          'Adding ₹50 to your Peace of Mind reserve. Each small contribution brings deep tranquility.',
        actionType: 'deposit',
        depositAmount: 50,
      },
      {
        id: 'maya-impulse-calm',
        phrase: 'Pause impulse spending',
        label: '🍃 24-Hour Impulse Pause',
        gesture: 'thinking',
        gestureLabel: '🤔 Reflective Meditation',
        responseText:
          'Practicing the 24-hour mindful pause. Ask yourself: does this purchase bring lasting joy to your city?',
        actionType: 'advice',
      },
      {
        id: 'maya-greet',
        phrase: 'Namaste Maya',
        label: '🙏 Namaste Maya',
        gesture: 'zen_bow',
        gestureLabel: '🙏 Mindful Namaste',
        responseText:
          'Namaste! Welcome back to your tranquil city garden. May your financial journey be joyful and light.',
        actionType: 'greeting',
      },
    ],
  },
  {
    id: 'leo',
    name: 'Leo',
    gender: 'Male',
    role: 'The Bold Builder',
    archetype: 'Go-Getter',
    badge: '🦁 Builder',
    catchphrase: "Big ambitions build towering skylines! Let's smash your targets.",
    bio: 'High-energy motivator who pushes you to achieve ambitious milestone goals and rapid growth.',
    primaryColor: '#F59E0B',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    accentBg: 'from-amber-500/20 via-orange-500/10 to-stone-900/50',
    signatureGesture: 'builder_flex',
    voiceSettings: {
      pitch: 1.1,
      rate: 1.15,
      gender: 'male',
    },
    commands: [
      {
        id: 'leo-smash',
        phrase: 'Hey Leo, smash my goal',
        label: '💥 Power Deposit ₹100',
        gesture: 'builder_flex',
        gestureLabel: '💪 Builder Power Flex',
        responseText:
          "BOOM! Power deposit of ₹100 executed! Scaffolding is rising faster than ever. That's champion energy!",
        actionType: 'deposit',
        depositAmount: 100,
      },
      {
        id: 'leo-speed-build',
        phrase: 'Speed build the skyline',
        label: '🏗️ Speed Construction',
        gesture: 'point',
        gestureLabel: '👉 High-Octane Direct',
        responseText:
          "Full throttle ahead! Look at that crane spinning. You're unstoppable, mayor!",
        actionType: 'quest',
      },
      {
        id: 'leo-hyped',
        phrase: 'Pump me up Leo',
        label: '🦁 Hype Motivation',
        gesture: 'celebrate',
        gestureLabel: '🔥 Roaring Victory Fist',
        responseText:
          "You're not just saving pocket change, you are building an iconic empire from scratch! Let's get it!",
        actionType: 'advice',
      },
      {
        id: 'leo-greet',
        phrase: 'Hey Leo',
        label: '👊 High-Five Leo',
        gesture: 'wave',
        gestureLabel: '👊 High-Five Wave',
        responseText:
          "What's up, boss! Put on your hard hat, we've got skyscrapers to assemble today!",
        actionType: 'greeting',
      },
    ],
  },
  {
    id: 'zara',
    name: 'Zara',
    gender: 'Female',
    role: 'The Tech Pioneer',
    archetype: 'Visionary',
    badge: '🚀 Pioneer',
    catchphrase: 'Upgrade your financial algorithms and level up your modern wealth.',
    bio: 'Forward-thinking and modern. Turns financial discipline into an exciting, gamified quest.',
    primaryColor: '#A855F7',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    accentBg: 'from-purple-500/20 via-indigo-500/10 to-stone-900/50',
    signatureGesture: 'cyber_scan',
    voiceSettings: {
      pitch: 1.3,
      rate: 1.12,
      gender: 'female',
    },
    commands: [
      {
        id: 'zara-cyber-quest',
        phrase: 'Hey Zara, activate cyber quest',
        label: '⚡ Activate Cyber Quest',
        gesture: 'cyber_scan',
        gestureLabel: '🌐 Holographic Interface Pulse',
        responseText:
          'Cyber protocol initiated! Quest rewards boosted by 1.5x XP. Depositing ₹40 quantum micro-credits!',
        actionType: 'deposit',
        depositAmount: 40,
      },
      {
        id: 'zara-firewall',
        phrase: 'Firewall impulse spending',
        label: '🛡️ Impulse Firewall',
        gesture: 'point',
        gestureLabel: '👉 Cyber Targeting Lock',
        responseText:
          'Firewall engaged: Retail marketing trackers blocked. Your funds are protected in the digital vault.',
        actionType: 'shield',
      },
      {
        id: 'zara-diagnostics',
        phrase: 'Run financial telemetry',
        label: '📡 Run Telemetry Scan',
        gesture: 'thinking',
        gestureLabel: '🧠 Quantum Telemetry Thinking',
        responseText:
          'Telemetry scan: Savings velocity +24%, city grid operating at 99.8% resource efficiency!',
        actionType: 'advice',
      },
      {
        id: 'zara-greet',
        phrase: 'Hello Zara',
        label: '👋 Neural Ping Zara',
        gesture: 'wave',
        gestureLabel: '✨ Neon Wave Pulse',
        responseText:
          'Neural sync complete! Good to see you, Mayor. Ready to push the boundaries of digital wealth?',
        actionType: 'greeting',
      },
    ],
  },
  {
    id: 'kabir',
    name: 'Kabir',
    gender: 'Male',
    role: 'The Guardian',
    archetype: 'Protector',
    badge: '🛡️ Guardian',
    catchphrase: 'Solid foundations weather any storm. Security is real wealth.',
    bio: 'Steadfast, trustworthy, and protective. Focused on shielding your savings with unbreakable reserves.',
    primaryColor: '#14B8A6',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    accentBg: 'from-teal-500/20 via-emerald-500/10 to-stone-900/50',
    signatureGesture: 'shield_guard',
    voiceSettings: {
      pitch: 0.84,
      rate: 0.96,
      gender: 'male',
    },
    commands: [
      {
        id: 'kabir-vault',
        phrase: 'Hey Kabir, secure my vault',
        label: '🛡️ Fortify Vault Reserve',
        gesture: 'shield_guard',
        gestureLabel: '🛡️ Guardian Aegis Stance',
        responseText:
          'Vault reinforced with 256-bit discipline! Depositing ₹75 to fortify your emergency moat against any storms.',
        actionType: 'deposit',
        depositAmount: 75,
      },
      {
        id: 'kabir-safety-audit',
        phrase: 'Run safety perimeter audit',
        label: '🔍 Safety Perimeter Audit',
        gesture: 'thinking',
        gestureLabel: '🤔 Careful Inspection',
        responseText:
          'Perimeter secure: You have buffer funds for contingencies. Always maintain at least 3 months of basic expenses.',
        actionType: 'advice',
      },
      {
        id: 'kabir-shield-deposit',
        phrase: 'Lock rainy day fund',
        label: '🌧️ Rainy Day Deposit',
        gesture: 'salute',
        gestureLabel: '🫡 Guardian Salute',
        responseText:
          'Rainy day reserve locked. Peace of mind is the greatest dividend money can buy.',
        actionType: 'deposit',
        depositAmount: 50,
      },
      {
        id: 'kabir-greet',
        phrase: 'Greetings Kabir',
        label: '🤝 Respectful Greet',
        gesture: 'wave',
        gestureLabel: '🤝 Warm Firm Wave',
        responseText:
          'Greetings, Mayor. The city gates are guarded and your treasury is secure under my watch.',
        actionType: 'greeting',
      },
    ],
  },
];

export const getAssistant = (id?: string): AssistantCharacter => {
  if (!id) return ASSISTANTS[0];
  const found = ASSISTANTS.find((a) => a.id === id);
  return found || ASSISTANTS[0];
};

export const getStepAdvice = (
  step: number,
  assistant: AssistantCharacter
): string => {
  switch (step) {
    case 3:
      return `${assistant.name}: "Every great metropolis begins with a visionary mayor! Enter your name."`;
    case 4:
      return `${assistant.name}: "Securing your citizenship credentials. Your city's vault is encrypted."`;
    case 5:
      return `${assistant.name}: "Your age & stage guide our calculations. Customized for your reality!"`;
    case 6:
      return `${assistant.name}: "Whether pocket money or salary, every income stream powers expansion."`;
    case 7:
      return `${assistant.name}: "Balancing Needs, Wants & Savings keeps your treasury in the green."`;
    case 8:
      return `${assistant.name}: "Pick your milestone! You can customize names and amounts anytime."`;
    case 9:
      return `${assistant.name}: "Your official Citizen ID is ready! Copy and share with your squad."`;
    case 10:
      return `${assistant.name}: "An open canvas awaits! Tap Deposit to lay your first foundation."`;
    case 11:
      return `${assistant.name}: "Deposit ₹10 to start construction on your starter cottage!"`;
    case 12:
      return `${assistant.name}: "Watch the scaffolding rise! Physical proof of your financial discipline."`;
    case 13:
      return `${assistant.name}: "Incredible! Your first building is complete and generating exp."`;
    case 14:
      return `${assistant.name}: "Explore quests, check your squad, and keep expanding your skyline!"`;
    default:
      return `${assistant.name}: "${assistant.catchphrase}"`;
  }
};
