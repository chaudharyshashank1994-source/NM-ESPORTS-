import React from 'react';
import { useEsports } from '../context/EsportsContext';
import { Wallet, LogOut, User, ExternalLink } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { EsportsLogo } from './common/EsportsLogo';

const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbDxPZ23rZZVZ1LydS3z';

export const Navbar: React.FC = () => {
  const {
    currentPanel,
    userActiveTab,
    setUserActiveTab,
    adminActiveTab,
    setAdminActiveTab,
    walletBalance,
    depositRequests,
    logoutAdmin,
    profile,
    setShowUserAuthModal,
  } = useEsports();

  const pendingDepositsCount = depositRequests.filter((d) => d.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8 px-3 sm:px-6 py-3">
        {/* Zone 1: Official Esports Brand Crest */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (currentPanel === 'admin') {
                setAdminActiveTab('dashboard');
              } else {
                setUserActiveTab('tournaments');
              }
            }}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          >
            <EsportsLogo size="sm" showText={true} />
          </button>

          {currentPanel === 'admin' && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/80 uppercase tracking-wider">
              Admin Portal
            </span>
          )}
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {currentPanel === 'user' ? (
            <>
              <button
                onClick={() => setUserActiveTab('tournaments')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  userActiveTab === 'tournaments' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Tournaments
              </button>
              <button
                onClick={() => setUserActiveTab('my-matches')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  userActiveTab === 'my-matches' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                My Matches
              </button>
              <button
                onClick={() => setUserActiveTab('wallet')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  userActiveTab === 'wallet' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Wallet & Add Cash
              </button>
              <button
                onClick={() => setUserActiveTab('leaderboard')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  userActiveTab === 'leaderboard' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setUserActiveTab('profile')}
                className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                  userActiveTab === 'profile' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Player Profile & Pass</span>
                {profile.rank && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                    {profile.rank}
                  </span>
                )}
              </button>
              <button
                onClick={() => setUserActiveTab('rules')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  userActiveTab === 'rules' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Rules & Fair Play
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setAdminActiveTab('dashboard')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  adminActiveTab === 'dashboard' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setAdminActiveTab('tournaments')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  adminActiveTab === 'tournaments' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Tournaments Manager
              </button>
              <button
                onClick={() => setAdminActiveTab('room-manager')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  adminActiveTab === 'room-manager' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Room Credentials
              </button>
              <button
                onClick={() => setAdminActiveTab('results')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  adminActiveTab === 'results' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Winner Declaration
              </button>
              <button
                onClick={() => setAdminActiveTab('payments')}
                className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                  adminActiveTab === 'payments' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Payments & UTR
                {pendingDepositsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">
                    {pendingDepositsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setAdminActiveTab('users')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  adminActiveTab === 'users' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Players & Firebase
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {currentPanel === 'user' ? (
            <>
              {/* WhatsApp Channel Direct Button */}
              <a
                href={WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold transition-all shadow-sm group"
                title="Join NM ESPORTS Official WhatsApp Channel for Room ID & Password"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
                </span>
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.96.523 1.838.796 2.791.796h.005c3.18 0 5.767-2.586 5.767-5.766.001-3.182-2.585-5.782-5.772-5.782zm0-1.84c4.195 0 7.604 3.409 7.605 7.606 0 4.197-3.41 7.607-7.605 7.607-1.282 0-2.527-.323-3.626-.935L4.05 20.003l1.402-4.227C4.78 14.65 4.425 13.38 4.425 11.938c.001-4.197 3.411-7.606 7.606-7.606z" />
                </svg>
                <span className="hidden sm:inline">WhatsApp Channel</span>
              </a>

              {/* User Account / Profile Button */}
              <button
                onClick={() => {
                  if (!profile.isLoggedIn) {
                    setShowUserAuthModal(true);
                  } else {
                    setUserActiveTab('profile');
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-colors text-xs ${
                  userActiveTab === 'profile'
                    ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                    : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                }`}
                title="View Player Profile & Esports Pass"
              >
                <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-black flex items-center justify-center text-[10px]">
                  {profile.ign ? profile.ign.slice(0, 2).toUpperCase() : 'FF'}
                </div>
                <span className="font-mono font-medium max-w-[85px] sm:max-w-[110px] truncate">
                  {profile.isLoggedIn ? profile.ign : 'Sign In'}
                </span>
              </button>

              {/* Personal Wallet Pill */}
              <button
                onClick={() => {
                  if (!profile.isLoggedIn) {
                    setShowUserAuthModal(true);
                  } else {
                    setUserActiveTab('wallet');
                  }
                }}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700/80 hover:border-amber-500/60 transition-colors text-xs sm:text-sm text-neutral-200"
                title="Open Wallet"
              >
                <Wallet className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400" />
                <span className="font-mono font-bold tabular-nums text-white text-xs sm:text-sm">
                  {formatCurrency(walletBalance)}
                </span>
                <span className="text-[10px] sm:text-[11px] font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                  + Add
                </span>
              </button>
            </>
          ) : (
            /* Admin sees Logout & Lock button */
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 transition-colors"
              title="Exit and lock admin portal"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Lock Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation row (only shown for Admin panel on mobile, user has fixed MobileBottomNav) */}
      {currentPanel === 'admin' && (
        <div className="lg:hidden flex items-center justify-around border-t border-neutral-800/80 px-2 py-2 bg-neutral-950 text-xs overflow-x-auto">
          <>
            <button
              onClick={() => setAdminActiveTab('dashboard')}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                adminActiveTab === 'dashboard' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setAdminActiveTab('tournaments')}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                adminActiveTab === 'tournaments' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'
              }`}
            >
              Tourneys
            </button>
            <button
              onClick={() => setAdminActiveTab('room-manager')}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                adminActiveTab === 'room-manager' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'
              }`}
            >
              Rooms
            </button>
            <button
              onClick={() => setAdminActiveTab('results')}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                adminActiveTab === 'results' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'
              }`}
            >
              Winners
            </button>
            <button
              onClick={() => setAdminActiveTab('payments')}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                adminActiveTab === 'payments' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setAdminActiveTab('users')}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                adminActiveTab === 'users' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'
              }`}
            >
              Players
            </button>
          </>
        </div>
      )}
    </header>
  );
};
