# 🏆 NM ESPORTS - Free Fire Tournament Platform

Welcome to **NM ESPORTS**, a competitive gaming and Free Fire tournament platform built with React 19, TypeScript, Tailwind CSS, and Firebase Firestore.

---

## 🌟 Key Features

- **🎮 3 Tournament Formats**:
  - **Battle Royale (BR)**: 12 Squads / 48 Players, Full Map (Bermuda, Purgatory, Kalahari, Alpine).
  - **Clash Squad (CS)**: 4v4 Tactical 7-round showdowns.
  - **Lone Wolf**: 1v1 & 2v2 Aim & Skill Duels.
- **🪔 Featured Event**:
  - **Diwali Dhamaka FF Mega Cup**: ₹40/squad entry, 2 BR qualification matches (20/10/5 pts + 1 pt/kill) ➡️ Top 4 qualify for Clash Squad Playoffs (SF1: 1v3, SF2: 2v4) ➡️ Grand Finale!
- **⚡ Real-Time Firebase Firestore**:
  - Live participant roster updates without page reload.
  - Live Room ID & Password broadcast (revealed only to registered players).
  - Live prize pool, slots counter, and status sync.
- **💰 Wallet & Payment System**:
  - UPI QR Code + Copyable UPI ID for easy deposits.
  - 12-digit UTR Verification system.
  - Instant prize credit into player wallet.
  - Withdrawal request submission with 30-minute payout policy.
- **🔒 Separated Panels**:
  - **User Panel**: Clean, distraction-free, zero admin clutter.
  - **Admin Panel**: Hidden gate accessed via `#admin` in the browser URL or the secret lock icon in the footer.
  - Admin controls every tournament detail, creates new matches, kicks cheaters, publishes room credentials, approves UTR deposits, processes withdrawals, and updates the master password.
- **📜 Esports Rules & Anti-Cheat 2.0**:
  - 30-minute guaranteed prize disbursal rule.
  - Zero-tolerance anti-cheat (aimbot, config file, script, APK mod ban).
  - Strict Mobile-only policy (Emulator / Bluestacks permanent ban).
  - Mandatory POV screen recording for winners.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ or 20+ installed
- npm or pnpm or bun

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🔑 Admin Access

- **URL Access**: Append `#admin` to the website URL (e.g., `http://localhost:3000/#admin`).
- **Footer Access**: Click the small lock icon `🔒` at the bottom footer.
- **Default Master Password**: `NM@7788` *(Changeable inside Admin Panel settings)*.

---

## 📦 Deployment to GitHub / Vercel

1. **Initialize Git & Push**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - NM ESPORTS tournament platform"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/nm-esports.git
   git push -u origin main
   ```

2. **Deploy on Vercel / Netlify**:
   - Connect your GitHub repository.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Framework Preset: `Vite`

---

## 🛡️ License & Copyright
© NM ESPORTS. All Rights Reserved. Built for Free Fire competitive players and scrims organizers.
