import React, { useState } from 'react';
import { EsportsProvider, useEsports } from './context/EsportsContext';
import { Navbar } from './components/Navbar';
import { UserHero } from './components/user/UserHero';
import { TournamentCard } from './components/user/TournamentCard';
import { JoinTournamentModal } from './components/user/JoinTournamentModal';
import { RoomCredentialsModal } from './components/user/RoomCredentialsModal';
import { TournamentDetailsModal } from './components/user/TournamentDetailsModal';
import { WalletView } from './components/user/WalletView';
import { MyMatchesView } from './components/user/MyMatchesView';
import { LeaderboardView } from './components/user/LeaderboardView';
import { RulesView } from './components/user/RulesView';
import { ProfileView } from './components/user/ProfileView';
import { EsportsLogo } from './components/common/EsportsLogo';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { UserAuthModal } from './components/user/UserAuthModal';
import { LoginGateView } from './components/user/LoginGateView';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Tournament, GameMode } from './types';
import { Trophy, Swords, Zap, RefreshCw, Lock } from 'lucide-react';

const EsportsMain: React.FC = () => {
  const {
    currentPanel,
    isAdminLoggedIn,
    setShowAdminLoginModal,
    showUserAuthModal,
    setShowUserAuthModal,
    userActiveTab,
    setUserActiveTab,
    tournaments,
    selectedMode,
    setSelectedMode,
    resetToDefaults,
    profile,
  } = useEsports();

  const [guestMode, setGuestMode] = useState<boolean>(() => {
    return sessionStorage.getItem('nm_guest_mode') === 'true';
  });

  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');

  // Modal states
  const [selectedForJoin, setSelectedForJoin] = useState<Tournament | null>(null);
  const [selectedForRoom, setSelectedForRoom] = useState<Tournament | null>(null);
  const [selectedForDetails, setSelectedForDetails] = useState<Tournament | null>(null);

  // Filter tournaments (keeps Diwali Dhamaka visible in both BR & CS modes)
  const filteredTournaments = tournaments.filter((t) => {
    if (selectedMode !== 'ALL') {
      if (t.diwaliFormat && (selectedMode === 'BR' || selectedMode === 'CS')) {
        // Included in both modes
      } else if (t.gameMode !== selectedMode) {
        return false;
      }
    }
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-24 lg:pb-8">
        {currentPanel === 'admin' && isAdminLoggedIn ? (
          <AdminPanel />
        ) : !profile.isLoggedIn && !guestMode ? (
          <LoginGateView
            onContinueAsGuest={() => {
              setGuestMode(true);
              sessionStorage.setItem('nm_guest_mode', 'true');
            }}
          />
        ) : (
          <>
            {userActiveTab === 'tournaments' && (
              <div className="space-y-6">
                {/* Hero Banner */}
                <UserHero
                  onSelectMode={(mode) => setSelectedMode(mode)}
                  selectedMode={selectedMode}
                  onOpenWallet={() => setUserActiveTab('wallet')}
                />

                {/* Filter and Mode Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
                  {/* Mode tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                    <button
                      onClick={() => setSelectedMode('ALL')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        selectedMode === 'ALL'
                          ? 'bg-amber-500 text-neutral-950'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      All Modes
                    </button>
                    <button
                      onClick={() => setSelectedMode('BR')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                        selectedMode === 'BR'
                          ? 'bg-amber-500 text-neutral-950'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Trophy className="w-3 h-3" />
                      <span>Battle Royale (BR)</span>
                    </button>
                    <button
                      onClick={() => setSelectedMode('CS')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                        selectedMode === 'CS'
                          ? 'bg-amber-500 text-neutral-950'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Swords className="w-3 h-3" />
                      <span>Clash Squad (CS)</span>
                    </button>
                    <button
                      onClick={() => setSelectedMode('LONE_WOLF')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                        selectedMode === 'LONE_WOLF'
                          ? 'bg-amber-500 text-neutral-950'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      <span>Lone Wolf</span>
                    </button>
                  </div>

                  {/* Status filter tabs */}
                  <div className="flex items-center gap-1 text-xs">
                    {(['all', 'upcoming', 'live', 'completed'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-md capitalize transition-colors font-medium ${
                          statusFilter === st
                            ? 'bg-neutral-800 text-white font-bold'
                            : 'text-neutral-400 hover:text-neutral-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tournaments Grid */}
                {filteredTournaments.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-neutral-900 border border-neutral-800">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                      <Trophy className="w-7 h-7" />
                    </div>
                    <div className="text-base font-bold text-white mb-1">
                      {tournaments.length === 0 ? 'No Matches Live Right Now' : 'No Tournaments Found'}
                    </div>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto">
                      {tournaments.length === 0
                        ? 'Organizer (NM ESPORTS) will publish upcoming Free Fire matches shortly. Check back soon or stay tuned!'
                        : 'Try selecting a different game mode or status filter.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTournaments.map((tournament) => (
                      <TournamentCard
                        key={tournament.id}
                        tournament={tournament}
                        onJoinClick={(t) => setSelectedForJoin(t)}
                        onViewRoomClick={(t) => setSelectedForRoom(t)}
                        onViewDetailsClick={(t) => setSelectedForDetails(t)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {userActiveTab === 'my-matches' && (
              <MyMatchesView
                onViewRoom={(t) => setSelectedForRoom(t)}
                onBrowseTournaments={() => setUserActiveTab('tournaments')}
              />
            )}

            {userActiveTab === 'wallet' && <WalletView />}

            {userActiveTab === 'leaderboard' && <LeaderboardView />}

            {userActiveTab === 'rules' && <RulesView />}

            {userActiveTab === 'profile' && <ProfileView />}
          </>
        )}
      </main>

      {/* Admin Password Login Modal Gate */}
      <AdminLoginModal />

      {/* Player Account Auth Modal */}
      <UserAuthModal
        isOpen={showUserAuthModal}
        onClose={() => setShowUserAuthModal(false)}
      />

      {/* User Modals */}
      {selectedForJoin && (
        <JoinTournamentModal
          tournament={selectedForJoin}
          onClose={() => setSelectedForJoin(null)}
          onOpenWallet={() => setUserActiveTab('wallet')}
          onSuccessJoined={() => {
            const joinedTourney = selectedForJoin;
            setSelectedForJoin(null);
            setSelectedForRoom(joinedTourney);
          }}
        />
      )}

      {selectedForRoom && (
        <RoomCredentialsModal
          tournament={selectedForRoom}
          onClose={() => setSelectedForRoom(null)}
        />
      )}

      {selectedForDetails && (
        <TournamentDetailsModal
          tournament={selectedForDetails}
          onClose={() => setSelectedForDetails(null)}
          onJoinClick={(t) => setSelectedForJoin(t)}
          onViewRoomClick={(t) => setSelectedForRoom(t)}
        />
      )}

      {/* Mobile Fixed Bottom Navigation */}
      <MobileBottomNav />

      {/* Clean User Footer (Zero admin clutter for regular players) */}
      <footer className="mt-auto border-t border-neutral-900 bg-neutral-950/90 py-8 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <EsportsLogo size="xs" showText={false} />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-bold text-white tracking-wide">NM ESPORTS</span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span className="text-neutral-400">Premier Free Fire Tournament Platform</span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span className="text-neutral-500">&copy; {new Date().getFullYear()}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://whatsapp.com/channel/0029VbDxPZ23rZZVZ1LydS3z"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline font-bold flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.96.523 1.838.796 2.791.796h.005c3.18 0 5.767-2.586 5.767-5.766.001-3.182-2.585-5.782-5.772-5.782zm0-1.84c4.195 0 7.604 3.409 7.605 7.606 0 4.197-3.41 7.607-7.605 7.607-1.282 0-2.527-.323-3.626-.935L4.05 20.003l1.402-4.227C4.78 14.65 4.425 13.38 4.425 11.938c.001-4.197 3.411-7.606 7.606-7.606z" />
              </svg>
              <span>WhatsApp Channel</span>
            </a>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setUserActiveTab('profile')}
              className="hover:text-white transition-colors"
            >
              My ID Pass
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setUserActiveTab('rules')}
              className="hover:text-white transition-colors"
            >
              Terms & Fair Play
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                if (confirm('Reset sample tournaments, wallet funds, and test data to default?')) {
                  resetToDefaults();
                }
              }}
              className="text-[11px] text-neutral-500 hover:text-neutral-300 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
            <span aria-hidden="true">·</span>
            {/* Discreet Organizer Lock trigger */}
            <button
              onClick={() => setShowAdminLoginModal(true)}
              className="text-neutral-600 hover:text-neutral-400 transition-colors p-1"
              title="Organizer Access (URL: #admin)"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <EsportsProvider>
      <EsportsMain />
    </EsportsProvider>
  );
}
