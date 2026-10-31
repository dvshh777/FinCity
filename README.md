FinCity 🍃 — Save Today. Build Tomorrow.
FinCity is a gamified financial savings and budgeting platform where saving money builds your vibrant 3D isometric city. Designed with a mobile-first philosophy and a companion desktop dashboard, FinCity transforms daily financial discipline into an engaging, visual world-building experience.
🌟 Key Features
1. 📱 14-Step Interactive Onboarding Flow
Screen 1 — Splash Screen: Cartoon money illustration and lively animated ambiance.
Screen 2 — Choose Your Guide: Select from 6 unique AI guides (Nova, Zephyr, Spark, Luna, Atlas, Sage).
Screen 3 — Ask Name: Personalized welcome and avatar selection.
Screen 4 — Secure Sign-In & Signup: Google one-click authentication and email/password support via Firebase.
Screen 5 — Age & Occupation: Adaptive experience for Students (pocket money) and Working Professionals (monthly salary).
Screen 6 — Income & Cash Flow: Flexible frequency support (daily, weekly, monthly).
Screen 7 — 50/30/20 Budget Planner: Needs (50%) and Wants (30%) budgeting with automatic savings calculation (20%+).
Screen 8 — Savings Goals: Target-driven saving (Emergency Fund, Tech Gadget, Dream Vacation, New Home).
Screen 9 — Permanent City Tag: Generates a unique, tamper-proof City ID.
Screen 10 — Empty City Discovery: Interactive 3D floating islands and plot grids ready for development.
Screen 11 — First Deposit Prompt: Micro-savings modal to lay the very first foundation.
Screen 12 — Construction Animation: Isometric building animation with progress stages.
Screen 13 — House Completion: Celebration modal with confetti and EXP rewards.
Screen 14 — Active Dashboard: City management, quests, ledger, and squad collaboration.
2. 🏗️ Isometric City Simulation & Districts
Multi-Stage Construction: Foundation pillars (Stage 1), framing (Stage 2), and full completion (Stage 3).
Architectural Variety: Cottages, modern villas, cyber apartments, green terraces, and landmark towers.
Floating Island 3D Map: Switch between overall island districts and focused plot grids.
Customization: Rename buildings and customize styles to match personal savings milestones.
3. 👥 Social Squad & Group Goals
Friends & City Tag Search: Add friends using their unique City IDs.
Squad Goals: Pool savings with friends towards shared community landmarks.
City Ledger: Real-time transaction history tracking every deposit, expense, and building investment.
4. 💻 Dual Viewports
Mobile Simulator: Preview all 14 screens sequentially or jump directly to any step.
Desktop Web App: Expansive, responsive dashboard layout with floating companion assistant.
🛠️ Tech Stack
Frontend Framework: React 19 + TypeScript
Styling: Tailwind CSS v4
Animations & Effects: Motion & canvas-confetti
Icons: Lucide React
Backend & Database: Firebase Auth & Cloud Firestore
Bundler: Vite
📁 Project Structure
code
Text
├── index.html                   # HTML entry point with metadata
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration
├── firebase-applet-config.json  # Firebase project configuration
├── firebase-blueprint.json      # Firestore Intermediate Representation schema
├── firestore.rules              # Hardened Zero-Trust Firestore security rules
├── public/                      # Static assets
└── src/
    ├── App.tsx                  # Root component (view mode toggler, synchronized user state)
    ├── main.tsx                 # React DOM mount point
    ├── index.css                # Global styles and Tailwind imports
    ├── types.ts                 # Core TypeScript interfaces (UserState, BuildingPlot, etc.)
    ├── components/
    │   ├── MobileSimulator.tsx  # Mobile frame with step switcher (Screens 1 to 14)
    │   ├── DesktopDashboard.tsx # Responsive desktop dashboard
    │   ├── FloatingIslandMap.tsx# 3D floating island district map
    │   ├── IsometricCity.tsx    # Isometric canvas and building plot renderer
    │   ├── FloatingAssistantPopup.tsx # Interactive guide companion
    │   ├── FriendsView.tsx      # Social squad and friend invitations
    │   ├── TransactionHistoryView.tsx # Ledger and expense tracking
    │   └── screens/             # Step-by-step mobile screens
    │       ├── Screens1to4.tsx  # Splash, Guide, Name, Auth
    │       ├── Screens5to8.tsx  # Age, Income, Budget, Goals
    │       └── Screens9to13.tsx # City Tag, Empty City, First Save, Celebration
    ├── data/
    │   └── mockData.ts          # Initial seed data, guides, and quests
    ├── lib/
    │   └── firebase.ts          # Firebase SDK initialization and error handling
    └── utils/
        └── buildingPricing.ts   # Construction pricing and reward formulas
🚀 Getting Started
1. Install Dependencies
code
Bash
npm install
2. Start Development Server
code
Bash
npm run dev
The application will run locally on http://localhost:3000.
3. Build for Production
code
Bash
npm run build
4. Run Type & Lint Checks
code
Bash
npm run lint
🔒 Security & Data Rules
The database is configured with Firestore Zero-Trust Attribute-Based Access Control (firestore.rules):
All unauthorized reads/writes are denied by default (match /{document=**} { allow read, write: if false; }).
Authenticated users can only read and write their own documents (users/{userId} and userState/{userId}).
Key structures and payload boundaries are strictly enforced to prevent parameter injection.
