import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import { formatCurrency, triggerConfetti } from '../../utils/helpers';
import {
  Trophy,
  Users,
  Wallet,
  Lock,
  PlusCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Trash2,
  Edit,
  ShieldCheck,
  Flame,
  Clock,
  Swords,
  Zap,
  KeyRound,
} from 'lucide-react';
import { Tournament, GameMode, MatchFormat } from '../../types';

export const AdminPanel: React.FC = () => {
  const {
    adminActiveTab,
    setAdminActiveTab,
    tournaments,
    createTournament,
    updateTournament,
    deleteTournament,
    updateRoomCredentials,
    declareWinners,
    depositRequests,
    withdrawalRequests,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
    adminPasswordHint,
    changeAdminPassword,
    logoutAdmin,
  } = useEsports();

  // Admin Password Management State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [updatedPass, setUpdatedPass] = useState('');
  const [passSaveSuccess, setPassSaveSuccess] = useState(false);

  // Create Tournament Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMode, setNewMode] = useState<GameMode>('BR');
  const [newFormat, setNewFormat] = useState<MatchFormat>('Squad');
  const [newMap, setNewMap] = useState('Bermuda');
  const [newEntryFee, setNewEntryFee] = useState<number>(30);
  const [newPrizePool, setNewPrizePool] = useState<number>(500);
  const [newPerKill, setNewPerKill] = useState<number>(10);
  const [newTotalSlots, setNewTotalSlots] = useState<number>(48);
  const [newStartTime, setNewStartTime] = useState('Today, 09:00 PM IST');
  const [newRoomId, setNewRoomId] = useState('');
  const [newRoomPassword, setNewRoomPassword] = useState('');

  // Selected Tournament for Winner Declaration
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>(tournaments[0]?.id || '');
  const [winnerRanks, setWinnerRanks] = useState<Record<string, { rank: number; kills: number; prize: number }>>({});

  // Edit Tournament & Participant Management States
  const [editingTourney, setEditingTourney] = useState<Tournament | null>(null);
  const [viewingParticipantsTourney, setViewingParticipantsTourney] = useState<Tournament | null>(null);

  // Room Credentials inline state
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [tempRoomId, setTempRoomId] = useState('');
  const [tempRoomPass, setTempRoomPass] = useState('');
  const [tempStatus, setTempStatus] = useState<Tournament['status']>('upcoming');

  const pendingDeposits = depositRequests.filter((d) => d.status === 'pending');
  const pendingWithdrawals = withdrawalRequests.filter((w) => w.status === 'pending');
  const totalPrizeDistributed = tournaments
    .filter((t) => t.status === 'completed')
    .reduce((acc, t) => acc + t.prizePool, 0);
  const totalRegisteredPlayers = tournaments.reduce((acc, t) => acc + t.joinedSlots, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let bannerImg = '/src/assets/images/mode_battle_royale_1793724376096.jpg';
    if (newMode === 'CS') bannerImg = '/src/assets/images/mode_clash_squad_1793724376584.jpg';
    if (newMode === 'LONE_WOLF') bannerImg = '/src/assets/images/mode_lone_wolf_1793724376557.jpg';

    createTournament({
      title: newTitle.trim(),
      gameMode: newMode,
      format: newFormat,
      map: newMap,
      image: bannerImg,
      entryFee: Number(newEntryFee),
      prizePool: Number(newPrizePool),
      perKill: Number(newPerKill),
      totalSlots: Number(newTotalSlots),
      startTime: newStartTime,
      startTimestamp: Date.now() + 1000 * 60 * 60,
      status: 'upcoming',
      version: 'Mobile Only · Official Scrim',
      roomId: newRoomId || undefined,
      roomPassword: newRoomPassword || undefined,
      prizes: [
        { rank: '1st Place', amount: Math.round(newPrizePool * 0.6) },
        { rank: '2nd Place', amount: Math.round(newPrizePool * 0.4) },
      ],
      rules: [
        'Mobile players only. Strictly no emulator allowed.',
        'Gun attributes are OFF.',
        'Room ID & Password will be released 15 min prior.',
      ],
    });

    triggerConfetti();
    setShowCreateModal(false);
    setNewTitle('');
  };

  const handleSaveRoom = (tId: string) => {
    updateRoomCredentials(tId, tempRoomId, tempRoomPass, tempStatus);
    setEditingRoomId(null);
    triggerConfetti();
  };

  const handleDeclareSubmit = (tournamentId: string) => {
    const selectedTourney = tournaments.find((t) => t.id === tournamentId);
    if (!selectedTourney) return;

    const results = selectedTourney.participants.map((p) => {
      const data = winnerRanks[p.id] || { rank: 1, kills: 0, prize: 0 };
      return {
        participantId: p.id,
        rank: data.rank,
        kills: data.kills,
        prizeWon: data.prize,
      };
    });

    declareWinners(tournamentId, results);
    triggerConfetti();
    alert('Winners declared and prize money automatically credited to player wallets!');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTourney) return;
    updateTournament(editingTourney.id, {
      title: editingTourney.title,
      map: editingTourney.map,
      startTime: editingTourney.startTime,
      entryFee: Number(editingTourney.entryFee),
      prizePool: Number(editingTourney.prizePool),
      perKill: Number(editingTourney.perKill),
      totalSlots: Number(editingTourney.totalSlots),
      status: editingTourney.status,
      roomId: editingTourney.roomId,
      roomPassword: editingTourney.roomPassword,
      specialBadge: editingTourney.specialBadge || undefined,
    });
    triggerConfetti();
    setEditingTourney(null);
  };

  const handleRemoveParticipant = (tourneyId: string, participantId: string) => {
    const tourney = tournaments.find((t) => t.id === tourneyId);
    if (!tourney) return;
    const updatedParticipants = tourney.participants.filter((p) => p.id !== participantId);
    const updatedSlots = Math.max(0, tourney.joinedSlots - 1);
    updateTournament(tourneyId, {
      participants: updatedParticipants,
      joinedSlots: updatedSlots,
    });
    if (viewingParticipantsTourney && viewingParticipantsTourney.id === tourneyId) {
      setViewingParticipantsTourney({
        ...viewingParticipantsTourney,
        participants: updatedParticipants,
        joinedSlots: updatedSlots,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>NM Esports Central Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Management Console
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Publish Free Fire room credentials, manage tournaments, approve UTR payments, and disburse prize pools.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setUpdatedPass(adminPasswordHint);
              setShowPasswordModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs border border-neutral-700 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Change Master Key</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Tournament</span>
          </button>
        </div>
      </div>

      {/* Admin Tab 1: DASHBOARD STATS */}
      {adminActiveTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Total Tourneys
              </span>
              <div className="text-2xl font-black text-white font-mono tabular-nums mt-1">
                {tournaments.length}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">BR, CS & Lone Wolf</div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Registered Slots
              </span>
              <div className="text-2xl font-black text-white font-mono tabular-nums mt-1">
                {totalRegisteredPlayers}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">Across all matches</div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                Pending Deposits
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono tabular-nums mt-1">
                {pendingDeposits.length}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">Needs UTR approval</div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Prize Distributed
              </span>
              <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums mt-1">
                {formatCurrency(totalPrizeDistributed)}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">Paid to winners</div>
            </div>
          </div>

          {/* Action Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setAdminActiveTab('room-manager')}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-left transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                Publish Room ID & Password
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Broadcast custom room credentials to joined players.
              </p>
            </button>

            <button
              onClick={() => setAdminActiveTab('payments')}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-left transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <span>Review UTR Deposits</span>
                {pendingDeposits.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-black">
                    {pendingDeposits.length}
                  </span>
                )}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Approve or reject user wallet deposits with 1-click.
              </p>
            </button>

            <button
              onClick={() => setAdminActiveTab('results')}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-left transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                Declare Match Winners
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Disburse cash prizes directly into winners&apos; wallets.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Admin Tab 2: TOURNAMENTS LIST & MANAGEMENT */}
      {adminActiveTab === 'tournaments' && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">Active Tournaments ({tournaments.length})</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs uppercase"
            >
              + Add Tournament
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-2">Title</th>
                  <th className="pb-3">Mode</th>
                  <th className="pb-3">Map</th>
                  <th className="pb-3">Entry / Prize</th>
                  <th className="pb-3">Slots</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {tournaments.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="font-bold text-white text-sm">{t.title}</div>
                      <div className="text-[11px] text-neutral-400">{t.startTime}</div>
                    </td>
                    <td className="py-3 font-semibold text-neutral-300">
                      {t.gameMode} ({t.format})
                    </td>
                    <td className="py-3 text-neutral-300">{t.map}</td>
                    <td className="py-3 font-mono tabular-nums">
                      <div className="text-emerald-400 font-bold">Entry: {formatCurrency(t.entryFee)}</div>
                      <div className="text-amber-400 font-bold">Pool: {formatCurrency(t.prizePool)}</div>
                    </td>
                    <td className="py-3 font-mono tabular-nums text-neutral-300">
                      {t.joinedSlots} / {t.totalSlots}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.status === 'live'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : t.status === 'completed'
                            ? 'bg-neutral-800 text-neutral-400'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingParticipantsTourney(t)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-400 hover:bg-neutral-800 transition-colors"
                          title="View & Manage Registered Players"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingTourney({ ...t })}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors"
                          title="Edit Full Tournament Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${t.title}"?`)) {
                              deleteTournament(t.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                          title="Delete Tournament"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Tab 3: ROOM MANAGER (Credentials) */}
      {adminActiveTab === 'room-manager' && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <span>Free Fire Custom Room Manager</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Enter or update Room ID and Password. Registered players will instantly see these in their User Panel!
            </p>
          </div>

          <div className="space-y-4">
            {tournaments.map((t) => {
              const isEditing = editingRoomId === t.id;

              return (
                <div
                  key={t.id}
                  className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
                        <span className="text-amber-400 font-bold uppercase">{t.gameMode} ({t.format})</span>
                        <span>·</span>
                        <span>{t.map}</span>
                        <span>·</span>
                        <span>{t.participants.length} Players Registered</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-0.5">{t.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                          t.status === 'live'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-800">
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-400 mb-1">Room ID</label>
                        <input
                          type="text"
                          value={tempRoomId}
                          onChange={(e) => setTempRoomId(e.target.value)}
                          placeholder="e.g. 8492019"
                          className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-neutral-400 mb-1">Password</label>
                        <input
                          type="text"
                          value={tempRoomPass}
                          onChange={(e) => setTempRoomPass(e.target.value)}
                          placeholder="e.g. nm77"
                          className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-neutral-400 mb-1">Status</label>
                        <select
                          value={tempStatus}
                          onChange={(e) => setTempStatus(e.target.value as Tournament['status'])}
                          className="w-full px-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="live">Live (In Progress)</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div className="flex items-end gap-2">
                        <button
                          onClick={() => handleSaveRoom(t.id)}
                          className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 text-neutral-950 hover:bg-emerald-400"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingRoomId(null)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 text-neutral-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-neutral-800 text-xs">
                      <div className="flex items-center gap-6">
                        <div>
                          <span className="text-neutral-500 block text-[11px]">Room ID</span>
                          <span className="font-mono font-bold text-white text-sm">
                            {t.roomId || 'Not set yet'}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[11px]">Password</span>
                          <span className="font-mono font-bold text-amber-400 text-sm">
                            {t.roomPassword || 'Not set yet'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setEditingRoomId(t.id);
                          setTempRoomId(t.roomId || '');
                          setTempRoomPass(t.roomPassword || '');
                          setTempStatus(t.status);
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                      >
                        Edit Credentials / Status
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin Tab 4: WINNER DECLARATION */}
      {adminActiveTab === 'results' && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Declare Match Results & Prize Payouts</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Assign ranks, kills, and distribute prize pool directly into player wallets.
            </p>
          </div>

          {/* Select Tournament */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Select Tournament</label>
            <select
              value={selectedTourneyId}
              onChange={(e) => setSelectedTourneyId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-800 text-white"
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.gameMode}) - Pool: {formatCurrency(t.prizePool)} [{t.status}]
                </option>
              ))}
            </select>
          </div>

          {/* Participants list for scoring */}
          {(() => {
            const currentTourney = tournaments.find((t) => t.id === selectedTourneyId);
            if (!currentTourney) return null;

            if (currentTourney.participants.length === 0) {
              return (
                <div className="p-8 text-center text-xs text-neutral-500 rounded-xl bg-neutral-950 border border-neutral-800">
                  No participants registered for this tournament yet.
                </div>
              );
            }

            return (
              <div className="space-y-4">
                <div className="rounded-xl border border-neutral-800 overflow-hidden divide-y divide-neutral-800 bg-neutral-950">
                  {currentTourney.participants.map((p) => {
                    const currentData = winnerRanks[p.id] || { rank: 1, kills: 0, prize: 0 };

                    return (
                      <div key={p.id} className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center text-xs">
                        <div>
                          <div className="font-bold text-white">{p.teamName}</div>
                          <div className="text-[11px] text-neutral-400">
                            IGN: {p.playerIgn} · UID: {p.playerUid}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">Rank (#)</label>
                          <input
                            type="number"
                            min={1}
                            value={currentData.rank}
                            onChange={(e) =>
                              setWinnerRanks((prev) => ({
                                ...prev,
                                [p.id]: { ...currentData, rank: parseInt(e.target.value, 10) || 1 },
                              }))
                            }
                            className="w-full px-2.5 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">Kills</label>
                          <input
                            type="number"
                            min={0}
                            value={currentData.kills}
                            onChange={(e) =>
                              setWinnerRanks((prev) => ({
                                ...prev,
                                [p.id]: { ...currentData, kills: parseInt(e.target.value, 10) || 0 },
                              }))
                            }
                            className="w-full px-2.5 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">Prize Cash (₹)</label>
                          <input
                            type="number"
                            min={0}
                            value={currentData.prize}
                            onChange={(e) =>
                              setWinnerRanks((prev) => ({
                                ...prev,
                                [p.id]: { ...currentData, prize: parseInt(e.target.value, 10) || 0 },
                              }))
                            }
                            placeholder="e.g. 250"
                            className="w-full px-2.5 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-amber-400 font-mono font-bold"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleDeclareSubmit(currentTourney.id)}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  Confirm & Distribute Prizes to Player Wallets
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Admin Tab 5: PAYMENTS & UTR VERIFICATION */}
      {adminActiveTab === 'payments' && (
        <div className="space-y-6">
          {/* Section: Pending UPI Deposits */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <span>UPI Deposit Approvals</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Verify the user&apos;s 12-digit UTR against your UPI merchant account and credit their wallet.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                {depositRequests.length} Total Requests
              </span>
            </div>

            {depositRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-500 rounded-xl bg-neutral-950 border border-neutral-800">
                No deposit requests yet.
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-800 overflow-hidden divide-y divide-neutral-800 bg-neutral-950">
                {depositRequests.map((req) => (
                  <div key={req.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{req.userName}</span>
                        <span className="text-xs text-neutral-400 font-mono">UID: {req.userUid}</span>
                      </div>
                      <div className="text-xs text-neutral-300 mt-1 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-neutral-400">UTR:</span>
                        <span className="font-mono font-bold text-amber-400 px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                          {req.utrNumber}
                        </span>
                        <span className="text-neutral-500">·</span>
                        <span>Via {req.upiApp}</span>
                        <span className="text-neutral-500">·</span>
                        <span className="text-neutral-400">{req.submittedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-base font-black text-emerald-400 font-mono tabular-nums">
                          +{formatCurrency(req.amount)}
                        </span>
                        <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                          {req.status}
                        </div>
                      </div>

                      {req.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              approveDeposit(req.id);
                              triggerConfetti();
                            }}
                            className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-colors shadow-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectDeposit(req.id)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-neutral-300 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-bold uppercase px-2.5 py-1 rounded ${
                            req.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Withdrawal Requests */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                <span>Withdrawal Payout Requests</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Send payout to player UPI ID and confirm completion.
              </p>
            </div>

            {withdrawalRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-500 rounded-xl bg-neutral-950 border border-neutral-800">
                No withdrawal requests pending.
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-800 overflow-hidden divide-y divide-neutral-800 bg-neutral-950">
                {withdrawalRequests.map((w) => (
                  <div key={w.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-white text-sm">{w.userName}</div>
                      <div className="text-xs text-neutral-300 mt-1">
                        UPI ID: <span className="font-mono text-amber-400 font-bold">{w.upiId}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500">{w.requestedAt}</div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-base font-black text-rose-400 font-mono tabular-nums">
                          -{formatCurrency(w.amount)}
                        </span>
                        <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                          {w.status}
                        </div>
                      </div>

                      {w.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              approveWithdrawal(w.id);
                              triggerConfetti();
                            }}
                            className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-colors shadow-sm"
                          >
                            Mark Paid
                          </button>
                          <button
                            onClick={() => rejectWithdrawal(w.id)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-neutral-300 transition-colors"
                          >
                            Refund
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-bold uppercase px-2.5 py-1 rounded ${
                            w.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {w.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE TOURNAMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">Create Free Fire Tournament</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Tournament Title <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Free Fire Bermuda Rush Cup #5"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Game Mode</label>
                  <select
                    value={newMode}
                    onChange={(e) => {
                      const m = e.target.value as GameMode;
                      setNewMode(m);
                      if (m === 'CS') setNewFormat('4v4');
                      if (m === 'LONE_WOLF') setNewFormat('1v1');
                      if (m === 'BR') setNewFormat('Squad');
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    <option value="BR">Battle Royale (BR)</option>
                    <option value="CS">Clash Squad (CS)</option>
                    <option value="LONE_WOLF">Lone Wolf</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as MatchFormat)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    {newMode === 'BR' && (
                      <>
                        <option value="Solo">Solo</option>
                        <option value="Duo">Duo</option>
                        <option value="Squad">Squad</option>
                      </>
                    )}
                    {newMode === 'CS' && <option value="4v4">4v4 Squad</option>}
                    {newMode === 'LONE_WOLF' && (
                      <>
                        <option value="1v1">1v1 Duel</option>
                        <option value="2v2">2v2 Duo</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Map</label>
                  <input
                    type="text"
                    value={newMap}
                    onChange={(e) => setNewMap(e.target.value)}
                    placeholder="Bermuda / Factory"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    placeholder="Today, 09:30 PM IST"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Entry Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newEntryFee}
                    onChange={(e) => setNewEntryFee(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Prize Pool (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newPrizePool}
                    onChange={(e) => setNewPrizePool(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Per Kill (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newPerKill}
                    onChange={(e) => setNewPerKill(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Total Slots</label>
                  <input
                    type="number"
                    min={2}
                    value={newTotalSlots}
                    onChange={(e) => setNewTotalSlots(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Room ID (Opt)</label>
                  <input
                    type="text"
                    value={newRoomId}
                    onChange={(e) => setNewRoomId(e.target.value)}
                    placeholder="e.g. 9840192"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Password (Opt)</label>
                  <input
                    type="text"
                    value={newRoomPassword}
                    onChange={(e) => setNewRoomPassword(e.target.value)}
                    placeholder="e.g. nm77"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-md mt-2"
              >
                Publish Tournament
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE ADMIN PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Update Master Access Key</span>
              </h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassSaveSuccess(false);
                }}
                className="p-1 text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {passSaveSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="font-bold">Password Updated Successfully!</p>
                <p className="text-[11px] text-neutral-400">Remember this password to log in via #admin in Chrome.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!updatedPass.trim()) return;
                  changeAdminPassword(updatedPass.trim());
                  setPassSaveSuccess(true);
                  setTimeout(() => {
                    setShowPasswordModal(false);
                    setPassSaveSuccess(false);
                  }, 1800);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    New Master Password
                  </label>
                  <input
                    type="text"
                    required
                    value={updatedPass}
                    onChange={(e) => setUpdatedPass(e.target.value)}
                    placeholder="Enter new master key"
                    className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    Current Key: <strong className="text-neutral-300">{adminPasswordHint}</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs uppercase bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-md"
                >
                  Save New Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* EDIT TOURNAMENT MODAL */}
      {editingTourney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Admin Full Control
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">Edit Tournament Details</h3>
              </div>
              <button
                onClick={() => setEditingTourney(null)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Tournament Title
                </label>
                <input
                  type="text"
                  required
                  value={editingTourney.title}
                  onChange={(e) => setEditingTourney({ ...editingTourney, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Map</label>
                  <input
                    type="text"
                    value={editingTourney.map}
                    onChange={(e) => setEditingTourney({ ...editingTourney, map: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Start Time / Schedule</label>
                  <input
                    type="text"
                    value={editingTourney.startTime}
                    onChange={(e) => setEditingTourney({ ...editingTourney, startTime: e.target.value })}
                    placeholder="e.g. 7 Nov, 02:00 PM IST"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Entry Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingTourney.entryFee}
                    onChange={(e) => setEditingTourney({ ...editingTourney, entryFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Prize Pool (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingTourney.prizePool}
                    onChange={(e) => setEditingTourney({ ...editingTourney, prizePool: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Per Kill (₹/pt)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingTourney.perKill}
                    onChange={(e) => setEditingTourney({ ...editingTourney, perKill: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Total Slots</label>
                  <input
                    type="number"
                    min={2}
                    value={editingTourney.totalSlots}
                    onChange={(e) => setEditingTourney({ ...editingTourney, totalSlots: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Match Status</label>
                  <select
                    value={editingTourney.status}
                    onChange={(e) => setEditingTourney({ ...editingTourney, status: e.target.value as Tournament['status'] })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live Now</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Room ID</label>
                  <input
                    type="text"
                    value={editingTourney.roomId || ''}
                    onChange={(e) => setEditingTourney({ ...editingTourney, roomId: e.target.value })}
                    placeholder="e.g. 7788441"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Room Password</label>
                  <input
                    type="text"
                    value={editingTourney.roomPassword || ''}
                    onChange={(e) => setEditingTourney({ ...editingTourney, roomPassword: e.target.value })}
                    placeholder="e.g. diwali"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Special Ribbon / Badge (Optional)</label>
                <input
                  type="text"
                  value={editingTourney.specialBadge || ''}
                  onChange={(e) => setEditingTourney({ ...editingTourney, specialBadge: e.target.value })}
                  placeholder="e.g. MEGA DIWALI DHAMAKA"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-md mt-2"
              >
                Save All Changes to Database
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW & MANAGE PARTICIPANTS MODAL */}
      {viewingParticipantsTourney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                  Registered Roster Management
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {viewingParticipantsTourney.title} ({viewingParticipantsTourney.participants.length} Squads)
                </h3>
              </div>
              <button
                onClick={() => setViewingParticipantsTourney(null)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {viewingParticipantsTourney.participants.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500 rounded-xl bg-neutral-950 border border-neutral-800">
                  No squads or players have registered for this tournament yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {viewingParticipantsTourney.participants.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold font-mono">
                            Slot #{p.slotNumber}
                          </span>
                          <span className="font-bold text-white text-sm">{p.teamName}</span>
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">
                          Leader: <strong className="text-neutral-200">{p.playerIgn}</strong> · FF UID:{' '}
                          <span className="font-mono text-neutral-300 font-bold">{p.playerUid}</span> · Phone: {p.phone}
                        </div>
                        {p.teammates && p.teammates.length > 0 && (
                          <div className="text-[11px] text-neutral-500 mt-1">
                            Teammates: {p.teammates.map((tm) => `${tm.ign} (${tm.uid})`).join(', ')}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Disqualify & remove ${p.teamName} (IGN: ${p.playerIgn}) from this tournament? Slot will be reopened.`)) {
                            handleRemoveParticipant(viewingParticipantsTourney.id, p.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 transition-colors self-end sm:self-center"
                      >
                        Remove / Disqualify
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
