import React from 'react';
import { useEsports } from '../context/EsportsContext';
import { Wallet, Flame, LogOut } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

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
  } = useEsports();

  const pendingDepositsCount = depositRequests.filter((d) => d.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand wordmark (single element) */}
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
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-neutral-950 font-black">
              <Flame className="w-5 h-5 text-neutral-950 fill-neutral-950" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-white flex items-center gap-1.5">
                NM <span className="text-amber-500">ESPORTS</span>
              </span>
            </div>
          </button>

          {currentPanel === 'admin' && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/80 uppercase">
              Admin Portal
            </span>
          )}
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {currentPanel === 'user' ? (
            <>
              <button
                onClick={() => setUserActiveTab('tournaments')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  userActiveTab === 'tournaments' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Tournaments
              </button>
              <button
                onClick={() => setUserActiveTab('my-matches')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  userActiveTab === 'my-matches' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                My Matches
              </button>
              <button
                onClick={() => setUserActiveTab('wallet')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  userActiveTab === 'wallet' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Wallet & Add Cash
              </button>
              <button
                onClick={() => setUserActiveTab('leaderboard')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  userActiveTab === 'leaderboard' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setUserActiveTab('rules')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  userActiveTab === 'rules' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Rules & Support
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setAdminActiveTab('dashboard')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  adminActiveTab === 'dashboard' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setAdminActiveTab('tournaments')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  adminActiveTab === 'tournaments' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Tournaments Manager
              </button>
              <button
                onClick={() => setAdminActiveTab('room-manager')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  adminActiveTab === 'room-manager' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Room Credentials
              </button>
              <button
                onClick={() => setAdminActiveTab('results')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  adminActiveTab === 'results' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Winner Declaration
              </button>
              <button
                onClick={() => setAdminActiveTab('payments')}
                className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                  adminActiveTab === 'payments' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Payments & UTR
                {pendingDepositsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">
                    {pendingDepositsCount}
                  </span>
                )}
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {currentPanel === 'user' ? (
            /* User only sees their personal wallet */
            <button
              onClick={() => setUserActiveTab('wallet')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700/80 hover:border-amber-500/60 transition-colors text-xs sm:text-sm text-neutral-200"
              title="Open Wallet"
            >
              <Wallet className="w-4 h-4 text-amber-400" />
              <span className="font-mono font-semibold tabular-nums text-white">
                {formatCurrency(walletBalance)}
              </span>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                + Add
              </span>
            </button>
          ) : (
            /* Admin sees Logout & Lock button */
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 transition-colors"
              title="Exit and lock admin portal"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Lock & Exit Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-800/80 px-2 py-2 bg-neutral-950 text-xs">
        {currentPanel === 'user' ? (
          <>
            <button
              onClick={() => setUserActiveTab('tournaments')}
              className={`px-2 py-1 rounded ${userActiveTab === 'tournaments' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'}`}
            >
              Matches
            </button>
            <button
              onClick={() => setUserActiveTab('my-matches')}
              className={`px-2 py-1 rounded ${userActiveTab === 'my-matches' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'}`}
            >
              My Matches
            </button>
            <button
              onClick={() => setUserActiveTab('wallet')}
              className={`px-2 py-1 rounded ${userActiveTab === 'wallet' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'}`}
            >
              Wallet
            </button>
            <button
              onClick={() => setUserActiveTab('leaderboard')}
              className={`px-2 py-1 rounded ${userActiveTab === 'leaderboard' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'}`}
            >
              Ranks
            </button>
            <button
              onClick={() => setUserActiveTab('rules')}
              className={`px-2 py-1 rounded ${userActiveTab === 'rules' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'}`}
            >
              Rules
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setAdminActiveTab('dashboard')}
              className={`px-2 py-1 rounded ${adminActiveTab === 'dashboard' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setAdminActiveTab('tournaments')}
              className={`px-2 py-1 rounded ${adminActiveTab === 'tournaments' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'}`}
            >
              Tourneys
            </button>
            <button
              onClick={() => setAdminActiveTab('room-manager')}
              className={`px-2 py-1 rounded ${adminActiveTab === 'room-manager' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'}`}
            >
              Rooms
            </button>
            <button
              onClick={() => setAdminActiveTab('results')}
              className={`px-2 py-1 rounded ${adminActiveTab === 'results' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'}`}
            >
              Winners
            </button>
            <button
              onClick={() => setAdminActiveTab('payments')}
              className={`px-2 py-1 rounded ${adminActiveTab === 'payments' ? 'text-amber-400 font-bold bg-neutral-900' : 'text-neutral-400'}`}
            >
              Payments
            </button>
          </>
        )}
      </div>
    </header>
  );
};
