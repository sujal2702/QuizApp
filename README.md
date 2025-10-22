<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Live Quiz Pro 🎮

A real-time interactive quiz platform with Firebase backend, AI-generated questions, and live leaderboards. Perfect for classrooms, training sessions, and interactive events!

## 🚀 Quick Start

**Prerequisites:** Node.js 16+ and npm

### Installation

```powershell
# Install dependencies
npm install

# Set up environment variables in .env.local
# API_KEY=your_google_gemini_api_key

# Run development server
npm run dev

# Build for production
npm run build
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Enable **Realtime Database** 
3. Config is set in `firebase.ts` - update if using different project
4. Set database rules for security (see FEATURES.md)

## ✨ Key Features

- **Option-Only Mode**: Students see only A/B/C/D buttons (questions projected)
- **Dual Creation**: AI-generated or manual question entry
- **Real-Time Sync**: All participants stay in sync via Firebase
- **Live Leaderboard**: Rankings update as answers come in
- **Admin Controls**: Open/Close/Reveal/Advance with timer management
- **Response Tracking**: Every answer stored with timing for analysis
- **Modern UI**: Responsive design with smooth animations

## 📖 Documentation

See [FEATURES.md](./FEATURES.md) for complete feature list, user flows, and Firebase structure.

## 🎯 Quick Usage

**Admin**: Create quiz → Share code → Control questions → View results  
**Student**: Join with code → Answer questions → See ranking

## 🏗️ Tech Stack

- React 19 + TypeScript + Vite
- Firebase Realtime Database
- Google Gemini AI
- Tailwind CSS

---

View original AI Studio app: https://ai.studio/apps/drive/1H4jFSBJipACWZerbGv7AzubW0iRr6F-C

## Firebase CLI & Admin Setup

### Prerequisites
1. Install Firebase CLI globally:
   ```powershell
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```powershell
   npm run firebase:login
   ```

### Setting Up Your First Admin User

**Step 1: Enable Firebase Authentication**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`roomtracker-8855b`)
3. Navigate to **Authentication** → **Get Started**
4. Click **Sign-in method** tab
5. Enable **Email/Password** provider

**Step 2: Create an Admin Account**
1. In Firebase Console → **Authentication** → **Users**
2. Click **Add user**
3. Enter email (e.g., `admin@example.com`) and password
4. Copy the **User UID** (you'll need this next)

**Step 3: Download Service Account Key**
1. Go to **Project Settings** → **Service Accounts**
2. Click **Generate new private key**
3. Save the JSON file as `serviceAccountKey.json` in your project root
4. ⚠️ **Never commit this file to git** (already in `.gitignore`)

**Step 4: Grant Admin Privileges**
Run the helper script with the User UID from Step 2:
```powershell
npm run set-admin <USER_UID>
```

Example:
```powershell
npm run set-admin kX9mP2nQ3rT4sU5vW6xY7z
```

You should see: `Successfully set admin claim for UID: kX9mP2nQ3rT4sU5vW6xY7z`

**Step 5: Test Admin Login**
1. Run the app: `npm run dev`
2. Click **Admin Login**
3. Enter the email and password from Step 2
4. You should be logged in and redirected to the dashboard! 🎉

### Local Development with Emulators

Start the Realtime Database emulator for local testing:
```powershell
npm run firebase:emulator
```
- Emulator UI: http://localhost:4000
- Realtime Database: http://localhost:9000

### Deploy Security Rules

Deploy your database security rules to production:
```powershell
npm run firebase:deploy
```

### Available Firebase Scripts