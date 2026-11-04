import React from 'react';
import { Swords, Shield, Trophy, Zap, Wallet, Users } from 'lucide-react';
import { GameMode } from '../../types';

interface UserHeroProps {
  onSelectMode: (mode: GameMode | 'ALL') => void;
  selectedMode: GameMode | 'ALL';
  onOpenWallet: () => void;
}

export const UserHero: React.FC<UserHeroProps> = ({ onSelectMode, selectedMode, onOpenWallet }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 mb-8">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_banner_freefire_1793724376618.jpg"
          alt="NM Esports Free Fire Tournament Arena"
          className="w-full h-full object-cover object-center opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950/60" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 max-w-4xl">
        {/* Subtle kicker */}
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-3 tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>India&apos;s Trusted Free Fire Esports Arena</span>
          <span aria-hidden="true">·</span>
          <span>Daily Cash Tournaments</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
          DOMINATE THE BATTLEFIELD <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            WIN REAL CASH REWARDS
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mb-6 leading-relaxed">
          Join daily competitive Free Fire matches. Instant UPI deposits and withdrawals, verified room ID release, and strict anti-cheat fair play.
        </p>

        {/* 3 Game Modes Grid Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => onSelectMode('BR')}
            className={`group text-left p-3.5 rounded-xl border transition-all ${
              selectedMode === 'BR'
                ? 'bg-amber-500/15 border-amber-500 text-white'
                : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 text-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Battle Royale</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-bold text-white text-sm sm:text-base">BR Solo / Duo / Squad</div>
            <div className="text-xs text-neutral-400 mt-0.5">Bermuda, Purgatory · Kill Bounty</div>
          </button>

          <button
            onClick={() => onSelectMode('CS')}
            className={`group text-left p-3.5 rounded-xl border transition-all ${
              selectedMode === 'CS'
                ? 'bg-amber-500/15 border-amber-500 text-white'
                : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 text-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Clash Squad</span>
              <Swords className="w-4 h-4 text-blue-400" />
            </div>
            <div className="font-bold text-white text-sm sm:text-base">CS 4v4 Knockout</div>
            <div className="text-xs text-neutral-400 mt-0.5">Tactical 13 Rounds · No Emulators</div>
          </button>

          <button
            onClick={() => onSelectMode('LONE_WOLF')}
            className={`group text-left p-3.5 rounded-xl border transition-all ${
              selectedMode === 'LONE_WOLF'
                ? 'bg-amber-500/15 border-amber-500 text-white'
                : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 text-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Lone Wolf</span>
              <Zap className="w-4 h-4 text-rose-400" />
            </div>
            <div className="font-bold text-white text-sm sm:text-base">1v1 & 2v2 Duels</div>
            <div className="text-xs text-neutral-400 mt-0.5">Iron Cage Arena · Pure Gun Skills</div>
          </button>
        </div>

        {/* Proof & Trust badges */}
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-neutral-800 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>100% Mobile Players · Anti-Cheat Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Instant UPI Payouts (PhonePe / GPay / Paytm)</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>5,000+ Active Indian FF Players</span>
          </div>
        </div>
      </div>
    </div>
  );
};
