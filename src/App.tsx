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
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { Tournament, GameMode } from './types';
import { Trophy, Swords, Zap, RefreshCw, Lock } from 'lucide-react';

const EsportsMain: React.FC = () => {
  const {
    currentPanel,
    isAdminLoggedIn,
    setShowAdminLoginModal,
    userActiveTab,
    setUserActiveTab,
    tournaments,
    selectedMode,
    setSelectedMode,
    resetToDefaults,
  } = useEsports();

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentPanel === 'admin' && isAdminLoggedIn ? (
          <AdminPanel />
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
                    <Trophy className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                    <div className="text-base font-bold text-white">No Tournaments Found</div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Try selecting a different mode or status filter.
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
          </>
        )}
      </main>

      {/* Admin Password Login Modal Gate */}
      <AdminLoginModal />

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

      {/* Clean User Footer (Zero admin clutter for regular players) */}
      <footer className="mt-auto border-t border-neutral-900 bg-neutral-950/80 py-8 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">NM ESPORTS</span>
            <span aria-hidden="true">·</span>
            <span>Premier Free Fire Tournament Platform</span>
            <span aria-hidden="true">·</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-4">
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
            <button
              onClick={() => setUserActiveTab('rules')}
              className="hover:text-white transition-colors"
            >
              Terms & Fair Play
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
