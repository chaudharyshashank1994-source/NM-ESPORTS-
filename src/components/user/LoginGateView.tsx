import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import { EsportsLogo } from '../common/EsportsLogo';
import { Trophy, ShieldCheck, Zap, Swords, ArrowRight, UserPlus, LogIn, Lock, CheckCircle2 } from 'lucide-react';

const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbDxPZ23rZZVZ1LydS3z';

interface LoginGateViewProps {
  onContinueAsGuest: () => void;
}

export const LoginGateView: React.FC<LoginGateViewProps> = ({ onContinueAsGuest }) => {
  const { setShowUserAuthModal, setShowAdminLoginModal, tournaments } = useEsports();

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto">
      {/* Brand Header */}
      <div className="w-full text-center space-y-3 mb-6">
        <div className="flex justify-center">
          <EsportsLogo size="lg" showText={true} />
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto">
          India's Premier Verified Free Fire Tournament Platform. Daily BR & Clash Squad Matches with Real Cash Prizes.
        </p>
      </div>

      {/* Trust & Stats Pills */}
      <div className="w-full grid grid-cols-3 gap-2 p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-center mb-6 shadow-xl">
        <div className="space-y-0.5">
          <div className="text-amber-400 font-black text-sm sm:text-base font-mono">100%</div>
          <div className="text-[10px] text-neutral-400">Anti-Cheat Safe</div>
        </div>
        <div className="space-y-0.5 border-x border-neutral-800">
          <div className="text-emerald-400 font-black text-sm sm:text-base font-mono">30 Min</div>
          <div className="text-[10px] text-neutral-400">Fast Prize Payout</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-blue-400 font-black text-sm sm:text-base font-mono">₹0</div>
          <div className="text-[10px] text-neutral-400">Clean Wallet Start</div>
        </div>
      </div>

      {/* Main Authentication Gate Actions */}
      <div className="w-full space-y-3 p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl">
        <div className="text-center pb-2">
          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
            Player Authentication
          </span>
          <h2 className="text-lg font-black text-white mt-1">Get Started in 10 Seconds</h2>
          <p className="text-xs text-neutral-400">Sign in with your Free Fire UID or Google to participate in matches</p>
        </div>

        {/* 1-Click Google Sign In */}
        <button
          onClick={() => setShowUserAuthModal(true)}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-black text-xs uppercase tracking-wide transition-all shadow-md active:scale-98"
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
          <span>Continue with Google</span>
        </button>

        {/* Create Account / Login Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setShowUserAuthModal(true)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
          <button
            onClick={() => setShowUserAuthModal(true)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In (UID/PIN)</span>
          </button>
        </div>

        {/* WhatsApp Channel Alert Banner */}
        <a
          href={WHATSAPP_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all text-left group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#25D366] text-black flex items-center justify-center font-black shrink-0">
              <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.96.523 1.838.796 2.791.796h.005c3.18 0 5.767-2.586 5.767-5.766.001-3.182-2.585-5.782-5.772-5.782zm0-1.84c4.195 0 7.604 3.409 7.605 7.606 0 4.197-3.41 7.607-7.605 7.607-1.282 0-2.527-.323-3.626-.935L4.05 20.003l1.402-4.227C4.78 14.65 4.425 13.38 4.425 11.938c.001-4.197 3.411-7.606 7.606-7.606z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-[#25D366] transition-colors">
                NM Official WhatsApp Channel
              </div>
              <div className="text-[10px] text-neutral-400">Get match updates & custom room pass</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#25D366] group-hover:translate-x-1 transition-transform" />
        </a>

        {/* Guest Preview Link */}
        <div className="text-center pt-2">
          <button
            onClick={onContinueAsGuest}
            className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 transition-colors"
          >
            Or Browse Tournaments as Guest (Preview Mode)
          </button>
        </div>
      </div>

      {/* Discreet Admin Lock */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          onClick={() => setShowAdminLoginModal(true)}
          className="text-[11px] text-neutral-600 hover:text-neutral-400 flex items-center gap-1 transition-colors"
        >
          <Lock className="w-3 h-3" />
          <span>Organizer Access</span>
        </button>
      </div>
    </div>
  );
};
