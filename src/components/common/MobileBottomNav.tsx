import React from 'react';
import { useEsports } from '../../context/EsportsContext';
import { Trophy, Swords, Wallet, Flame, User } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export const MobileBottomNav: React.FC = () => {
  const { userActiveTab, setUserActiveTab, walletBalance, currentPanel, profile, setShowUserAuthModal } = useEsports();

  if (currentPanel === 'admin') return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-1.5 flex items-center justify-around safe-area-bottom shadow-2xl">
      <button
        onClick={() => setUserActiveTab('tournaments')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
          userActiveTab === 'tournaments'
            ? 'text-amber-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Trophy className={`w-4 h-4 ${userActiveTab === 'tournaments' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] leading-none">Matches</span>
      </button>

      <button
        onClick={() => {
          if (!profile.isLoggedIn) {
            setShowUserAuthModal(true);
          } else {
            setUserActiveTab('my-matches');
          }
        }}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
          userActiveTab === 'my-matches'
            ? 'text-amber-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Swords className={`w-4 h-4 ${userActiveTab === 'my-matches' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] leading-none">My Matches</span>
      </button>

      {/* Center Highlighted Wallet Button */}
      <button
        onClick={() => {
          if (!profile.isLoggedIn) {
            setShowUserAuthModal(true);
          } else {
            setUserActiveTab('wallet');
          }
        }}
        className={`relative -top-2 flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-neutral-950 shadow-lg shadow-amber-500/25 border-2 border-neutral-950 transition-transform active:scale-95`}
      >
        <Wallet className="w-5 h-5 stroke-[2.5]" />
        <span className="text-[8px] font-black tracking-tight">{formatCurrency(walletBalance)}</span>
      </button>

      <button
        onClick={() => setUserActiveTab('leaderboard')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
          userActiveTab === 'leaderboard'
            ? 'text-amber-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Flame className={`w-4 h-4 ${userActiveTab === 'leaderboard' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] leading-none">Ranking</span>
      </button>

      <button
        onClick={() => {
          if (!profile.isLoggedIn) {
            setShowUserAuthModal(true);
          } else {
            setUserActiveTab('profile');
          }
        }}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
          userActiveTab === 'profile'
            ? 'text-amber-400 font-bold'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <User className={`w-4 h-4 ${userActiveTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] leading-none truncate max-w-[50px]">
          {profile.isLoggedIn ? (profile.ign || 'Pass') : 'Login'}
        </span>
      </button>
    </nav>
  );
};
