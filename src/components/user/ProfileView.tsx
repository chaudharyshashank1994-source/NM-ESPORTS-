import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import { EsportsLogo } from '../common/EsportsLogo';
import { formatCurrency, triggerConfetti } from '../../utils/helpers';
import { FFRank, PlayerRole, DeviceType } from '../../types';
import {
  User,
  Shield,
  Trophy,
  Swords,
  Crosshair,
  Wallet,
  Copy,
  Check,
  Edit3,
  ExternalLink,
  Smartphone,
  LogOut,
  Save,
  Flame,
  Award,
  Sparkles,
  Share2,
  Lock,
} from 'lucide-react';

const FF_RANKS: { rank: FFRank; color: string; badge: string }[] = [
  { rank: 'Grandmaster', color: 'from-amber-400 via-red-500 to-rose-600', badge: '👑 GM' },
  { rank: 'Master', color: 'from-purple-500 to-indigo-600', badge: '⚡ MASTER' },
  { rank: 'Heroic', color: 'from-rose-500 to-red-600', badge: '🔥 HEROIC' },
  { rank: 'Diamond', color: 'from-cyan-400 to-blue-500', badge: '💎 DIAMOND' },
  { rank: 'Platinum', color: 'from-emerald-400 to-teal-500', badge: '🛡️ PLATINUM' },
  { rank: 'Gold', color: 'from-amber-400 to-yellow-500', badge: '🪙 GOLD' },
  { rank: 'Silver', color: 'from-slate-300 to-zinc-400', badge: '⚔️ SILVER' },
  { rank: 'Bronze', color: 'from-amber-800 to-orange-900', badge: '🥉 BRONZE' },
];

const FF_ROLES: PlayerRole[] = ['Rusher', 'Sniper', 'IGL', 'Support', 'Assaulter', 'All-Rounder'];
const DEVICE_OPTIONS: DeviceType[] = ['Mobile', 'Tablet', 'Emulator / PC'];

const CHARACTER_AVATARS = [
  { id: 'ALOK', name: 'DJ Alok', icon: '🎧', quote: 'Drop The Beat' },
  { id: 'CHRONO', name: 'Chrono', icon: '🛡️', quote: 'Time Turner' },
  { id: 'HAYATO', name: 'Hayato', icon: '⚔️', quote: 'Bushido Armor Penetration' },
  { id: 'KELLY', name: 'Kelly', icon: '⚡', quote: 'Deadly Velocity Sprint' },
  { id: 'ORION', name: 'Orion', icon: '🩸', quote: 'Crimson Crush' },
  { id: 'TATSUYA', name: 'Tatsuya', icon: '🏃', quote: 'Rebel Rush' },
  { id: 'K_CAPTAIN', name: 'Captain K', icon: '🧘', quote: 'Master of All EP' },
  { id: 'HOMER', name: 'Homer', icon: '🎯', quote: 'Sensor Drone Hunter' },
];

const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbDxPZ23rZZVZ1LydS3z';

export const ProfileView: React.FC = () => {
  const {
    profile,
    updateProfile,
    logoutUser,
    walletBalance,
    setUserActiveTab,
    tournaments,
    setShowUserAuthModal,
  } = useEsports();

  const [isEditing, setIsEditing] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit form states
  const [formName, setFormName] = useState(profile.name || '');
  const [formIgn, setFormIgn] = useState(profile.ign || '');
  const [formUid, setFormUid] = useState(profile.uid || '');
  const [formPhone, setFormPhone] = useState(profile.phone || '');
  const [formEmail, setFormEmail] = useState(profile.email || '');
  const [formRank, setFormRank] = useState<FFRank>(profile.rank || 'Heroic');
  const [formRole, setFormRole] = useState<PlayerRole>(profile.role || 'Rusher');
  const [formLevel, setFormLevel] = useState<number>(profile.level || 65);
  const [formDevice, setFormDevice] = useState<DeviceType>(profile.device || 'Mobile');
  const [formAvatar, setFormAvatar] = useState<string>(profile.avatarSeed || 'ALOK');
  const [formBio, setFormBio] = useState<string>(profile.bio || 'Free Fire Esports Competitor');
  const [formPin, setFormPin] = useState<string>(profile.password || '');

  // Copy UID helper
  const handleCopyUid = () => {
    if (!profile.uid) return;
    navigator.clipboard.writeText(profile.uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formName.trim(),
      ign: formIgn.trim() || profile.ign,
      uid: formUid.trim() || profile.uid,
      phone: formPhone.trim(),
      email: formEmail.trim(),
      rank: formRank,
      role: formRole,
      level: Number(formLevel) || 60,
      device: formDevice,
      avatarSeed: formAvatar,
      bio: formBio.trim(),
      password: formPin.trim(),
      isLoggedIn: true,
    });
    setSaveSuccess(true);
    triggerConfetti();
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1200);
  };

  const handleSharePass = () => {
    const text = `🏆 NM ESPORTS Player ID Pass\nIGN: ${profile.ign}\nUID: ${profile.uid}\nRank: ${profile.rank || 'Heroic'}\nRole: ${profile.role || 'Rusher'}\nJoin our tournaments at NM ESPORTS!`;
    if (navigator.share) {
      navigator.share({
        title: `${profile.ign} - NM ESPORTS ID Pass`,
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2500);
    }
  };

  // Find tournaments player joined
  const myTournaments = tournaments.filter((t) =>
    t.participants?.some((p) => p.playerUid === profile.uid || p.phone === profile.phone)
  );

  const currentRankInfo =
    FF_RANKS.find((r) => r.rank === (profile.rank || 'Heroic')) || FF_RANKS[2];
  const selectedAvatarObj =
    CHARACTER_AVATARS.find((c) => c.id === (profile.avatarSeed || 'ALOK')) || CHARACTER_AVATARS[0];

  const totalMatches = profile.totalMatches ?? myTournaments.length;
  const totalWins = profile.totalWins ?? 0;
  const totalKills = profile.totalKills ?? 0;
  const totalEarnings = profile.totalEarnings ?? 0;
  const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;

  if (!profile.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-4 my-8 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-2xl font-black">
          FF
        </div>
        <div>
          <h3 className="text-lg font-black text-white">Player Esports Pass</h3>
          <p className="text-xs text-neutral-400 mt-1">
            You are browsing as a guest. Register or sign in with your Free Fire UID to get your verified Esports Pass, view match history, and manage your wallet.
          </p>
        </div>
        <button
          onClick={() => setShowUserAuthModal(true)}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
        >
          Create Account / Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Banner: WhatsApp Channel Notification */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/90 via-neutral-900 to-neutral-950 border border-emerald-500/40 p-4 sm:p-5 shadow-lg shadow-emerald-950/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#25D366] text-black font-black flex items-center justify-center shadow-lg shadow-[#25D366]/20 shrink-0">
              <svg className="w-6 h-6 fill-black" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.96.523 1.838.796 2.791.796h.005c3.18 0 5.767-2.586 5.767-5.766.001-3.182-2.585-5.782-5.772-5.782zm0-1.84c4.195 0 7.604 3.409 7.605 7.606 0 4.197-3.41 7.607-7.605 7.607-1.282 0-2.527-.323-3.626-.935L4.05 20.003l1.402-4.227C4.78 14.65 4.425 13.38 4.425 11.938c.001-4.197 3.411-7.606 7.606-7.606z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">Join Official WhatsApp Channel</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30">
                  Room IDs & Results
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Room ID, custom password, and prize payment screenshots are broadcasted instantly on our WhatsApp channel!
              </p>
            </div>
          </div>
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#25D366]/30 transition-all hover:scale-105 shrink-0"
          >
            <span>Follow Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Grid: Virtual Esports ID Card & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Virtual Esports ID Card (Free Fire Player Pass) */}
        <div className="lg:col-span-1">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10 p-5 flex flex-col justify-between">
            {/* Holographic metallic overlay shine */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-gradient-to-tr from-red-500/10 to-transparent rounded-full blur-xl pointer-events-none" />

            <div>
              {/* Card Top: Logo & Pass Title */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <EsportsLogo size="sm" showText={true} />
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  ESPORTS PASS
                </span>
              </div>

              {/* Player Avatar & Identity */}
              <div className="mt-5 flex flex-col items-center text-center">
                <div className="relative">
                  <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${currentRankInfo.color} p-1 shadow-xl shadow-amber-500/20`}>
                    <div className="w-full h-full rounded-xl bg-neutral-950 flex flex-col items-center justify-center text-3xl">
                      <span>{selectedAvatarObj.icon}</span>
                      <span className="text-[9px] font-bold text-neutral-400 mt-1 uppercase tracking-tight">
                        {selectedAvatarObj.name}
                      </span>
                    </div>
                  </div>
                  {/* Verified Tick */}
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center font-black text-xs shadow-md border-2 border-neutral-950">
                    ✓
                  </div>
                </div>

                <h2 className="text-xl font-black text-white mt-3 font-mono tracking-tight flex items-center gap-1.5">
                  <span>{profile.ign || 'GUEST_PLAYER'}</span>
                </h2>
                <p className="text-xs text-neutral-400">{profile.name || 'Competitive Contender'}</p>

                {/* UID pill with copy button */}
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300">
                  <span className="text-neutral-500 text-[10px]">UID:</span>
                  <span className="font-bold text-amber-400">{profile.uid || 'Not Set'}</span>
                  <button
                    onClick={handleCopyUid}
                    className="p-1 text-neutral-400 hover:text-white transition-colors"
                    title="Copy UID"
                  >
                    {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Rank & Role Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase text-white bg-gradient-to-r ${currentRankInfo.color} shadow-sm`}>
                    {currentRankInfo.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-neutral-800 text-amber-300 border border-neutral-700">
                    {profile.role || 'Rusher'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-neutral-300 bg-neutral-900 border border-neutral-800">
                    Lvl {profile.level || 65}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-xs text-neutral-400 italic mt-3 px-3">
                  "{profile.bio || selectedAvatarObj.quote}"
                </p>
              </div>

              {/* Player Details Grid */}
              <div className="mt-5 space-y-2 text-xs border-t border-neutral-800/80 pt-4">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Device</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
                    {profile.device || 'Mobile'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>WhatsApp</span>
                  <span className="text-white font-mono">{profile.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Fair Play Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Clean / Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Edit & Share */}
            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Close Edit' : 'Edit Profile'}</span>
              </button>
              <button
                onClick={handleSharePass}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
                title="Share Player Pass"
              >
                {copiedPass ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Stats, Quick Wallet, and Edit Form / Tournaments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-xs font-medium">Matches</span>
                <Swords className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{totalMatches}</div>
              <span className="text-[10px] text-neutral-400">Tournaments Joined</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-xs font-medium">Booyahs (Wins)</span>
                <Trophy className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">{totalWins}</div>
              <span className="text-[10px] text-neutral-400">{winRate}% Win Ratio</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-xs font-medium">Total Kills</span>
                <Crosshair className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{totalKills}</div>
              <span className="text-[10px] text-neutral-400">Eliminations Recorded</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-xs font-medium">Total Won</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {formatCurrency(totalEarnings)}
              </div>
              <span className="text-[10px] text-neutral-400">Prize Money Paid</span>
            </div>
          </div>

          {/* Wallet Summary Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 font-medium">Available Wallet Balance</span>
                <div className="text-2xl font-black text-white font-mono">
                  {formatCurrency(walletBalance)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setUserActiveTab('wallet')}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                + Add Cash (UPI)
              </button>
              <button
                onClick={() => setUserActiveTab('wallet')}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-neutral-700"
              >
                Withdraw
              </button>
            </div>
          </div>

          {/* EDIT PROFILE FORM or OVERVIEW */}
          {isEditing ? (
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="text-base font-bold text-white">Edit Free Fire Profile</h3>
                  <p className="text-xs text-neutral-400">
                    Changes are automatically synced with Firebase database.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Profile updated and synchronized to Firebase Firestore!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Character Avatar Picker */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    Choose Character / Avatar
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {CHARACTER_AVATARS.map((char) => (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => setFormAvatar(char.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                          formAvatar === char.id
                            ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <span className="text-xl">{char.icon}</span>
                        <span className="text-[10px] font-bold truncate max-w-full">{char.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Free Fire In-Game Name (IGN) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formIgn}
                      onChange={(e) => setFormIgn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Free Fire UID (Numeric ID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formUid}
                      onChange={(e) => setFormUid(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Full Real Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Free Fire Rank
                    </label>
                    <select
                      value={formRank}
                      onChange={(e) => setFormRank(e.target.value as FFRank)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      {FF_RANKS.map((r) => (
                        <option key={r.rank} value={r.rank}>
                          {r.rank}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Gameplay Role
                    </label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value as PlayerRole)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      {FF_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Playing Device
                    </label>
                    <select
                      value={formDevice}
                      onChange={(e) => setFormDevice(e.target.value as DeviceType)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      {DEVICE_OPTIONS.map((dev) => (
                        <option key={dev} value={dev}>
                          {dev}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Player Level (Free Fire)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={formLevel}
                      onChange={(e) => setFormLevel(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Security PIN / Password (Protects Account)
                    </label>
                    <input
                      type="password"
                      value={formPin}
                      onChange={(e) => setFormPin(e.target.value)}
                      placeholder="Enter 4-6 digit PIN"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Player Tagline / Bio Quote
                  </label>
                  <input
                    type="text"
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    placeholder="e.g. Always looking for headshots · Rush master"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Sync to Firebase</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Joined Tournaments List */
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Registered Tournaments</h3>
                  <p className="text-xs text-neutral-400">
                    Matches where you have reserved a slot.
                  </p>
                </div>
                <button
                  onClick={() => setUserActiveTab('tournaments')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300"
                >
                  Browse Matches &rarr;
                </button>
              </div>

              {myTournaments.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-neutral-950 border border-neutral-800/80">
                  <Swords className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
                  <div className="text-xs font-bold text-neutral-300">No active matches joined</div>
                  <p className="text-[11px] text-neutral-400 mt-1 max-w-sm mx-auto">
                    Register for upcoming Free Fire tournaments from the tournament lobby to get Custom Room ID and password.
                  </p>
                  <button
                    onClick={() => setUserActiveTab('tournaments')}
                    className="mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase transition-colors"
                  >
                    Join a Match
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myTournaments.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{t.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                            {t.gameMode}
                          </span>
                        </div>
                        <div className="text-neutral-400 text-[11px] mt-0.5">
                          Timing: {t.startTime} · Prize: {formatCurrency(t.prizePool)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            t.status === 'live'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                              : t.status === 'completed'
                              ? 'bg-neutral-800 text-neutral-400'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {t.status}
                        </span>
                        <button
                          onClick={() => setUserActiveTab('my-matches')}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors"
                        >
                          View Room
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Account Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs">
            <div className="flex items-center gap-2 text-neutral-400">
              <Lock className="w-4 h-4 text-amber-500" />
              <span>Firebase Cloud Auth & Data Protected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUserAuthModal(true)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium transition-colors"
              >
                Switch Account / Re-login
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to log out from this device?')) {
                    logoutUser();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 font-medium border border-red-800 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
