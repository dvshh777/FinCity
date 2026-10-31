# 🍃 FinCity — Save Today. Build Tomorrow.

**FinCity** is a gamified financial savings and budgeting platform where saving money builds your very own vibrant 3D isometric city. Designed with a mobile-first philosophy and a companion desktop dashboard, FinCity transforms everyday financial discipline into an engaging visual world-building experience.

## 🌟 Key Features

### 1. 📱 14-Step Interactive Onboarding Flow

FinCity features an immersive 14-step onboarding experience:

| Screen | Feature | Description |
|---|---|---|
| 1 | Splash Screen | Cartoon money illustration with lively animated ambiance. |
| 2 | Choose Your Guide | Select from 6 unique AI guides: Nova, Zephyr, Spark, Luna, Atlas, and Sage. |
| 3 | Ask Name | Personalized welcome experience and avatar selection. |
| 4 | Secure Sign-In & Signup | Google authentication and email/password support via Firebase. |
| 5 | Age & Occupation | Adaptive experience for students and working professionals. |
| 6 | Income & Cash Flow | Flexible daily, weekly, and monthly income frequencies. |
| 7 | 50/30/20 Budget Planner | Automatically allocates income into needs, wants, and savings. |
| 8 | Savings Goals | Set targets such as Emergency Fund, Tech Gadget, Dream Vacation, and New Home. |
| 9 | Permanent City Tag | Generates a unique City ID for each user. |
| 10 | Empty City Discovery | Explore interactive floating islands and undeveloped plot grids. |
| 11 | First Deposit Prompt | Make the first micro-savings deposit to begin construction. |
| 12 | Construction Animation | Watch buildings develop through multiple construction stages. |
| 13 | House Completion | Celebrate completed buildings with confetti and EXP rewards. |
| 14 | Active Dashboard | Manage your city, quests, transactions, and squad activities. |

### 2. 🏗️ Isometric City Simulation & Districts

- **Multi-Stage Construction:** Buildings progress through three stages:
  - Stage 1: Foundation pillars.
  - Stage 2: Structural framing.
  - Stage 3: Fully completed building.
- **Architectural Variety:** Cottages, modern villas, cyber apartments, green terraces, and landmark towers.
- **Floating Island 3D Map:** Switch between overall island districts and focused plot grids.
- **Customization:** Rename buildings and customize their styles to represent personal savings milestones.

### 3. 👥 Social Squad & Group Goals

- **Friends & City Tag Search:** Discover and add friends using their unique City IDs.
- **Squad Goals:** Pool savings with friends to build shared community landmarks.
- **City Ledger:** Track deposits, expenses, and building investments through transaction history.

### 4. 💻 Dual Viewports

**Mobile Simulator**
- Preview all 14 onboarding screens sequentially.
- Jump directly to any onboarding step.
- Experience the complete mobile-first interface.

**Desktop Web App**
- Expansive and responsive dashboard layout.
- Interactive city management.
- Floating companion assistant.
- Integrated financial tracking and social features.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend Framework | React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Animations & Effects | Motion, canvas-confetti |
| Icons | Lucide React |
| Authentication | Firebase Authentication |
| Backend & Database | Cloud Firestore |
| Bundler | Vite |

## 📁 Project Structure

```text
FinCity/
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules
│
├── public/
│
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── types.ts
    │
    ├── components/
    │   ├── MobileSimulator.tsx
    │   ├── DesktopDashboard.tsx
    │   ├── FloatingIslandMap.tsx
    │   ├── IsometricCity.tsx
    │   ├── FloatingAssistantPopup.tsx
    │   ├── FriendsView.tsx
    │   ├── TransactionHistoryView.tsx
    │   │
    │   └── screens/
    │       ├── Screens1to4.tsx
    │       ├── Screens5to8.tsx
    │       └── Screens9to13.tsx
    │
    ├── data/
    │   └── mockData.ts
    │
    ├── lib/
    │   └── firebase.ts
    │
    └── utils/
        └── buildingPricing.ts
```

## 🚀 Getting Started

Follow these steps to run FinCity locally.

### Prerequisites

- Node.js (LTS version recommended).
- npm (Node Package Manager).
- Firebase project configuration.

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

### 2. Navigate to the Project Directory

```bash
cd FinCity
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will run locally at:

```text
http://localhost:3000
```

### 5. Build for Production

```bash
npm run build
```

### 6. Run Type & Lint Checks

```bash
npm run lint
```

## 🔒 Security & Data Rules

FinCity implements Firestore security rules based on a Zero-Trust approach and Attribute-Based Access Control (ABAC).

**Security Highlights:**

- **Default Deny:** Unauthorized reads and writes are denied by default.
- **User-Level Access Control:** Authenticated users can only access their own documents under `users/{userId}` and `userState/{userId}`.
- **Strict Payload Validation:** Database structures and payload boundaries are validated to prevent unauthorized modifications and parameter injection.
- **Firestore Security Rules:** Access permissions are enforced through `firestore.rules`.

Example default-deny rule:

```javascript
match /{document=**} {
  allow read, write: if false;
}
```

## 🎯 Project Vision

FinCity aims to make personal finance more engaging, accessible, and rewarding by combining financial planning with gamification.

Instead of simply tracking savings through numbers and charts, users can visualize their financial progress through a growing virtual city. Every deposit contributes to construction, every milestone unlocks rewards, and every savings goal brings the city closer to completion.

**Save consistently. Build progressively. Grow your city.**

---

<p align="center">
  🍃 <strong>FinCity — Save Today. Build Tomorrow.</strong>
  <br/>
  <em>Small savings. Big dreams. One city at a time.</em>
</p>
