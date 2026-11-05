import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import { EsportsLogo } from '../common/EsportsLogo';
import { X, User, Phone, Shield, Sparkles, CheckCircle2, LogIn, UserPlus, Mail, KeyRound } from 'lucide-react';
import { triggerConfetti } from '../../utils/helpers';
import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { FFRank, PlayerRole, DeviceType, PlayerProfile } from '../../types';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FF_RANKS: FFRank[] = ['Grandmaster', 'Master', 'Heroic', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];
const FF_ROLES: PlayerRole[] = ['Rusher', 'Sniper', 'IGL', 'Support', 'Assaulter', 'All-Rounder'];
const DEVICES: DeviceType[] = ['Mobile', 'Tablet', 'Emulator / PC'];

const CHARACTER_AVATARS = [
  { id: 'ALOK', name: 'Alok', icon: '🎧' },
  { id: 'CHRONO', name: 'Chrono', icon: '🛡️' },
  { id: 'HAYATO', name: 'Hayato', icon: '⚔️' },
  { id: 'KELLY', name: 'Kelly', icon: '⚡' },
  { id: 'ORION', name: 'Orion', icon: '🩸' },
  { id: 'TATSUYA', name: 'Tatsuya', icon: '🏃' },
  { id: 'K_CAPTAIN', name: 'Captain K', icon: '🧘' },
  { id: 'HOMER', name: 'Homer', icon: '🎯' },
];

const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbDxPZ23rZZVZ1LydS3z';

export const UserAuthModal: React.FC<UserAuthModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, setUserActiveTab } = useEsports();
  const [tab, setTab] = useState<'register' | 'login'>('login');

  // Form states - strictly empty by default for fresh user experience
  const [name, setName] = useState(profile.isLoggedIn ? profile.name : '');
  const [ign, setIgn] = useState(profile.isLoggedIn ? profile.ign : '');
  const [uid, setUid] = useState(profile.isLoggedIn ? profile.uid : '');
  const [phone, setPhone] = useState(profile.isLoggedIn ? profile.phone : '');
  const [email, setEmail] = useState(profile.isLoggedIn ? profile.email : '');
  const [rank, setRank] = useState<FFRank>(profile.rank || 'Heroic');
  const [role, setRole] = useState<PlayerRole>(profile.role || 'Rusher');
  const [device, setDevice] = useState<DeviceType>(profile.device || 'Mobile');
  const [avatarSeed, setAvatarSeed] = useState<string>(profile.avatarSeed || 'ALOK');
  const [password, setPassword] = useState('');

  // Login specific state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Google 1-Click Sign-In (Real Firebase Auth Popup)
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const googleEmail = (user.email || '').trim().toLowerCase();
      const googleName = user.displayName || '';

      if (!googleEmail) {
        setErrorMsg('Google authentication did not return an email address.');
        setLoading(false);
        return;
      }

      // Check if user exists with this email in Firestore users collection
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', googleEmail));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const found = snap.docs[0].data() as PlayerProfile;
        updateProfile({
          ...found,
          isLoggedIn: true,
        });
        setSuccessMsg(`Welcome back, ${found.ign || googleName}! Logged in with Google.`);
        triggerConfetti();
        setTimeout(() => {
          onClose();
          setUserActiveTab('tournaments');
        }, 800);
      } else {
        // Pre-fill email and name, switch to register tab to enter Free Fire IGN & UID
        setEmail(googleEmail);
        if (googleName && !name) setName(googleName);
        setTab('register');
        setSuccessMsg('Google account verified! Please enter your Free Fire In-Game Name (IGN), UID, and WhatsApp number to finish setting up your Esports Pass.');
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Google sign-in popup was closed before completing. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('Popup was blocked by your browser. Please allow popups for Google sign-in.');
      } else {
        setErrorMsg(err?.message || 'Google sign-in could not be completed. Please use Free Fire credentials below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!ign.trim() || !uid.trim() || !phone.trim()) {
      setErrorMsg('Please provide your Free Fire IGN, UID, and WhatsApp Phone number.');
      return;
    }

    const cleanUid = uid.trim().replace(/\D/g, '');
    if (cleanUid.length < 6) {
      setErrorMsg('Free Fire UID must be at least 6 numeric digits.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    setLoading(true);

    try {
      // Starting balance is strictly ₹0
      const newUserData: PlayerProfile = {
        name: name.trim() || ign.trim(),
        ign: ign.trim(),
        uid: cleanUid,
        phone: cleanPhone,
        email: email.trim().toLowerCase(),
        rank,
        role,
        device,
        level: 1,
        avatarSeed,
        password: password.trim(),
        bio: 'Free Fire Esports Contender',
        totalMatches: 0,
        totalWins: 0,
        totalKills: 0,
        totalEarnings: 0,
        walletBalance: 0, // Zero demo money! Real balance starts at 0
        isVerified: true,
        isLoggedIn: true,
        createdAt: new Date().toISOString(),
      };

      // Save to real Firestore collection /users
      const userDocRef = doc(db, 'users', cleanUid);
      await setDoc(userDocRef, newUserData, { merge: true });

      // Update local context
      updateProfile(newUserData);

      setSuccessMsg('Player Account successfully registered! Your starting wallet balance is ₹0.');
      triggerConfetti();
      setTimeout(() => {
        onClose();
        setUserActiveTab('tournaments');
      }, 1000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${uid.trim()}`);
      setErrorMsg('Could not save account to database. Please check connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const input = loginIdentifier.trim();
    if (!input) {
      setErrorMsg('Please enter your Free Fire UID, WhatsApp Phone, or Email.');
      return;
    }

    setLoading(true);

    try {
      const cleanNumeric = input.replace(/\D/g, '');
      let foundUser: PlayerProfile | null = null;

      // 1. Direct getDoc with numeric UID
      if (cleanNumeric && cleanNumeric.length >= 6) {
        const userDocRef = doc(db, 'users', cleanNumeric);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          foundUser = snap.data() as PlayerProfile;
        }
      }

      // 2. Query by phone if not found
      if (!foundUser && cleanNumeric && cleanNumeric.length >= 10) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phone', '==', cleanNumeric));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          foundUser = querySnap.docs[0].data() as PlayerProfile;
        }
      }

      // 3. Query by email
      if (!foundUser && input.includes('@')) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          foundUser = querySnap.docs[0].data() as PlayerProfile;
        }
      }

      if (foundUser) {
        // Check password/PIN if set
        if (foundUser.password && loginPassword && foundUser.password !== loginPassword.trim()) {
          setErrorMsg('Incorrect Security PIN. Please verify and try again.');
          setLoading(false);
          return;
        }

        updateProfile({
          ...foundUser,
          isLoggedIn: true,
        });

        setSuccessMsg(`Welcome back, ${foundUser.ign}!`);
        triggerConfetti();
        setTimeout(() => {
          onClose();
          setUserActiveTab('tournaments');
        }, 800);
      } else {
        setErrorMsg('No player account found with this UID/Phone/Email. Please register a new account.');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${input}`);
      setErrorMsg('Login failed. Please check internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6 my-auto max-h-[94vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-3">
          <EsportsLogo size="sm" showText={true} />
        </div>

        {/* WhatsApp Channel Alert Banner */}
        <a
          href={WHATSAPP_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#25D366] text-black flex items-center justify-center font-black shrink-0">
              <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.96.523 1.838.796 2.791.796h.005c3.18 0 5.767-2.586 5.767-5.766.001-3.182-2.585-5.782-5.772-5.782zm0-1.84c4.195 0 7.604 3.409 7.605 7.606 0 4.197-3.41 7.607-7.605 7.607-1.282 0-2.527-.323-3.626-.935L4.05 20.003l1.402-4.227C4.78 14.65 4.425 13.38 4.425 11.938c.001-4.197 3.411-7.606 7.606-7.606z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Official NM ESPORTS WhatsApp Channel</span>
              </div>
              <p className="text-[10px] text-neutral-400">Join for Custom Room ID & Password 15m before start</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#25D366] px-2 py-0.5 rounded bg-[#25D366]/20 shrink-0">
            Join
          </span>
        </a>

        {/* 1-Click Google Sign In Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs transition-all shadow-md active:scale-98"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>Continue with Google Account</span>
          </button>
          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <span className="relative bg-neutral-900 px-3 text-[10px] uppercase font-bold text-neutral-400">
              Or use Free Fire Credentials
            </span>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-950 border border-neutral-800 mb-4">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors ${
              tab === 'login' ? 'bg-amber-500 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors ${
              tab === 'register' ? 'bg-amber-500 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Forms */}
        {tab === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-3">
            {/* Character Icon Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                Select Your Free Fire Character
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {CHARACTER_AVATARS.map((char) => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => setAvatarSeed(char.id)}
                    className={`p-1.5 rounded-xl border text-center transition-all flex flex-col items-center ${
                      avatarSeed === char.id
                        ? 'bg-amber-500/20 border-amber-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-lg">{char.icon}</span>
                    <span className="text-[8px] font-bold truncate max-w-full">{char.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Free Fire IGN (Name) <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={ign}
                  onChange={(e) => setIgn(e.target.value)}
                  placeholder="e.g. NM_RAISTAR_99"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Free Fire Numeric UID <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={uid}
                  onChange={(e) => setUid(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 2847193021"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  WhatsApp Number (10 Digits) <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-neutral-400 mb-0.5">Rank</label>
                <select
                  value={rank}
                  onChange={(e) => setRank(e.target.value as FFRank)}
                  className="w-full px-2 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  {FF_RANKS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-neutral-400 mb-0.5">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as PlayerRole)}
                  className="w-full px-2 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  {FF_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-neutral-400 mb-0.5">Device</label>
                <select
                  value={device}
                  onChange={(e) => setDevice(e.target.value as DeviceType)}
                  className="w-full px-2 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  {DEVICES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                Security Password / Secret PIN (Protects Your Winnings)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="4-6 digit secret PIN"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between">
              <span>Starting Wallet Balance:</span>
              <span className="font-mono font-bold text-amber-400">₹0.00 (Zero Demo Money)</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
            >
              {loading ? 'Creating & Connecting to Firebase...' : 'Register & Create Esports Pass'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Free Fire UID, WhatsApp Phone, or Email <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. 2847193021 or 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Security Password / PIN (if set)
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter secret PIN"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
            >
              {loading ? 'Verifying with Firebase...' : 'Login to Player Account'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-neutral-400">Don't have an account yet? </span>
              <button
                type="button"
                onClick={() => setTab('register')}
                className="text-xs font-bold text-amber-400 hover:underline"
              >
                Register Here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
