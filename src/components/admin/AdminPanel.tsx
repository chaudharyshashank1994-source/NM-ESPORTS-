import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import { formatCurrency, triggerConfetti } from '../../utils/helpers';
import { compressImageFile } from '../../utils/imageUpload';
import { BANNER_PRESETS } from '../../data/initialData';
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
  Upload,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Minus,
  RefreshCw,
  Gift,
} from 'lucide-react';
import { Tournament, GameMode, MatchFormat, PrizeTier, PlayerProfile } from '../../types';

export const AdminPanel: React.FC = () => {
  const {
    adminActiveTab,
    setAdminActiveTab,
    tournaments,
    createTournament,
    updateTournament,
    deleteTournament,
    clearAllTournaments,
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
    allUsers,
    adjustUserBalance,
  } = useEsports();

  // User search query for players tab
  const [userSearch, setUserSearch] = useState('');

  // Player Balance / Bonus Management Modal State
  const [selectedUserForWallet, setSelectedUserForWallet] = useState<PlayerProfile | null>(null);
  const [walletAdjustType, setWalletAdjustType] = useState<'credit' | 'debit' | 'bonus'>('credit');
  const [walletAdjustAmount, setWalletAdjustAmount] = useState<number>(50);
  const [walletAdjustReason, setWalletAdjustReason] = useState<string>('Tournament Prize / Top-up');
  const [isAdjustingWallet, setIsAdjustingWallet] = useState<boolean>(false);

  // Admin Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [updatedPass, setUpdatedPass] = useState('');
  const [passSaveSuccess, setPassSaveSuccess] = useState(false);

  // Clear Slate Confirmation Modal
  const [showClearModal, setShowClearModal] = useState(false);

  // Full Create / Edit Tournament Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields with 100% Customizability
  const [fTitle, setFTitle] = useState('');
  const [fSubtitle, setFSubtitle] = useState('');
  const [fDescription, setFDescription] = useState('');
  const [fGameMode, setFGameMode] = useState<GameMode>('BR');
  const [fFormat, setFFormat] = useState<MatchFormat>('Squad');
  const [fMap, setFMap] = useState('Bermuda');
  const [fImage, setFImage] = useState('/src/assets/images/mode_battle_royale_1793724376096.jpg');
  const [fStartTime, setFStartTime] = useState('7 Nov, 02:00 PM IST');
  const [fTotalSlots, setFTotalSlots] = useState<number>(48);
  const [fTotalSlotsLabel, setFTotalSlotsLabel] = useState('Slots Filled');
  const [fEntryFee, setFEntryFee] = useState<number>(40);
  const [fEntryFeeLabel, setFEntryFeeLabel] = useState('Entry Fee');
  const [fPrizePool, setFPrizePool] = useState<number>(1200);
  const [fPrizePoolLabel, setFPrizePoolLabel] = useState('Total Prize Pool');
  const [fShowPerKill, setFShowPerKill] = useState<boolean>(true);
  const [fPerKill, setFPerKill] = useState<number>(1);
  const [fPerKillLabel, setFPerKillLabel] = useState('Per Kill');
  const [fSpecialBadge, setFSpecialBadge] = useState('🪔 DIWALI SPECIAL');
  const [fIsFeatured, setFIsFeatured] = useState<boolean>(true);
  const [fVersion, setFVersion] = useState('Mobile Only · Strict Anti-Cheat');
  const [fStatus, setFStatus] = useState<Tournament['status']>('upcoming');
  const [fRoomId, setFRoomId] = useState('');
  const [fRoomPassword, setFRoomPassword] = useState('');

  // Dynamic Prizes list
  const [fPrizes, setFPrizes] = useState<PrizeTier[]>([
    { rank: '1st (Champion)', amount: 650 },
    { rank: '2nd Place (Runner Up)', amount: 350 },
    { rank: '3rd Place Squad', amount: 120 },
    { rank: 'Tournament MVP Kill Leader', amount: 80 },
  ]);

  // Dynamic Rules list
  const [fRules, setFRules] = useState<string[]>([
    'Stage 1: 2 Battle Royale matches played by all squads. Booyah = 20 pts, 2nd = 10 pts, 3rd = 5 pts, 1 kill = 1 pt.',
    'Stage 2: Top 4 squads with highest points qualify for Clash Squad (CS) Playoffs: SF1 (1v3) & SF2 (2v4).',
    'Grand Finale: Winning squads face off in 4v4 Clash Squad match for the Championship & Trophy.',
    'Strict Zero-Tolerance Anti-Cheat: No emulators, no aimbot, no auto-headshot script, no config files.',
    'Strict 30-Minute Prize Disbursal: Prizes are credited to winners\' NM Wallet within 30 minutes of final match completion.',
  ]);

  // Image Upload status
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Tournament save status & feedback
  const [isSavingTournament, setIsSavingTournament] = useState(false);
  const [tournamentFormError, setTournamentFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Participant Drawer & Winner Declaration States
  const [viewingParticipantsTourney, setViewingParticipantsTourney] = useState<Tournament | null>(null);
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>(tournaments[0]?.id || '');
  const [winnerRanks, setWinnerRanks] = useState<Record<string, { rank: number; kills: number; prize: number }>>({});

  // Inline Room credentials
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

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setFTitle('Diwali Dhamaka Free Fire Mega Cup 🪔');
    setFSubtitle('2 BR Qualifier Matches + CS Playoffs Knockout');
    setFDescription('Pehle 2 BR matches honge jisme sabhi 12 squads (48 players) khelenge. Booyah = 20 pts, 2nd = 10 pts, 3rd = 5 pts, 1 kill = 1 pt. Iske baad top 4 squads CS semifinal me qualify karengi: SF1 (1 vs 3) aur SF2 (2 vs 4). Winner squads ke bich Grand Final match hoga!');
    setFGameMode('BR');
    setFFormat('Squad');
    setFMap('Bermuda & Purgatory');
    setFImage('/src/assets/images/diwali_dhamaka_ff_1793765585100.jpg');
    setFStartTime('7 Nov, 02:00 PM IST');
    setFTotalSlots(48);
    setFTotalSlotsLabel('Slots Filled');
    setFEntryFee(40);
    setFEntryFeeLabel('Entry Fee');
    setFPrizePool(1200);
    setFPrizePoolLabel('Total Prize Pool');
    setFShowPerKill(true);
    setFPerKill(1);
    setFPerKillLabel('1 Kill = 1 Pt');
    setFSpecialBadge('🪔 DIWALI SPECIAL');
    setFIsFeatured(true);
    setFVersion('Mobile Only · Official Tournament');
    setFStatus('upcoming');
    setFRoomId('');
    setFRoomPassword('');
    setFPrizes([
      { rank: '1st (Champion)', amount: 650 },
      { rank: '2nd Place (Runner Up)', amount: 350 },
      { rank: '3rd Place Squad', amount: 120 },
      { rank: 'Tournament MVP Kill Leader', amount: 80 },
    ]);
    setFRules([
      'Stage 1: 2 Battle Royale matches played by all squads. Booyah = 20 pts, 2nd = 10 pts, 3rd = 5 pts, 1 kill = 1 pt.',
      'Stage 2: Top 4 squads with highest points qualify for Clash Squad (CS) Playoffs: SF1 (1v3) & SF2 (2v4).',
      'Grand Finale: Winning squads face off in 4v4 Clash Squad match for the Championship & Trophy.',
      'Strict Zero-Tolerance Anti-Cheat: No emulators, no aimbot, no auto-headshot script, no config files.',
      'Strict 30-Minute Prize Disbursal: Prizes are credited to winners\' NM Wallet within 30 minutes of final match completion.',
    ]);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (t: Tournament) => {
    setModalMode('edit');
    setEditingId(t.id);
    setFTitle(t.title);
    setFSubtitle(t.subtitle || '');
    setFDescription(t.description || '');
    setFGameMode(t.gameMode);
    setFFormat(t.format);
    setFMap(t.map);
    setFImage(t.image);
    setFStartTime(t.startTime);
    setFTotalSlots(t.totalSlots);
    setFTotalSlotsLabel(t.totalSlotsLabel || 'Slots Filled');
    setFEntryFee(t.entryFee);
    setFEntryFeeLabel(t.entryFeeLabel || 'Entry Fee');
    setFPrizePool(t.prizePool);
    setFPrizePoolLabel(t.prizePoolLabel || 'Total Prize Pool');
    setFShowPerKill(t.showPerKill !== false);
    setFPerKill(t.perKill || 0);
    setFPerKillLabel(t.perKillLabel || 'Per Kill');
    setFSpecialBadge(t.specialBadge || '');
    setFIsFeatured(t.isFeatured || false);
    setFVersion(t.version || 'Mobile Only');
    setFStatus(t.status);
    setFRoomId(t.roomId || '');
    setFRoomPassword(t.roomPassword || '');
    setFPrizes(t.prizes || []);
    setFRules(t.rules || []);
    setIsModalOpen(true);
  };

  // Handle Image Upload from PC/Phone
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const base64Data = await compressImageFile(file, 1200, 675, 0.75);
      setFImage(base64Data);
    } catch (err) {
      alert('Failed to process image file. Please try another image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Save Tournament (Create or Update)
  const handleSaveTournament = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTournamentFormError(null);

    const trimmedTitle = fTitle.trim();
    if (!trimmedTitle) {
      setTournamentFormError('Tournament Title / Name is required! (टूर्नामेंट का नाम आवश्यक है)');
      alert('Tournament Title is required! Please enter a name for the tournament.');
      return;
    }

    try {
      setIsSavingTournament(true);

      const defaultFallbackImage = '/src/assets/images/mode_battle_royale_1793724376096.jpg';
      const cleanImage = fImage && fImage.trim() ? fImage.trim() : defaultFallbackImage;

      const tourneyPayload = {
        title: trimmedTitle,
        subtitle: fSubtitle.trim() || undefined,
        description: fDescription.trim() || undefined,
        gameMode: fGameMode,
        format: fFormat,
        map: fMap.trim() || 'Bermuda',
        image: cleanImage,
        entryFee: Math.max(0, Number(fEntryFee) || 0),
        entryFeeLabel: fEntryFeeLabel.trim() || 'Entry Fee',
        prizePool: Math.max(0, Number(fPrizePool) || 0),
        prizePoolLabel: fPrizePoolLabel.trim() || 'Total Prize Pool',
        perKill: fShowPerKill ? Math.max(0, Number(fPerKill) || 0) : 0,
        perKillLabel: fShowPerKill ? fPerKillLabel.trim() || 'Per Kill' : undefined,
        showPerKill: Boolean(fShowPerKill),
        totalSlots: Math.max(2, Number(fTotalSlots) || 48),
        totalSlotsLabel: fTotalSlotsLabel.trim() || 'Slots Filled',
        startTime: fStartTime.trim() || 'Upcoming',
        startTimestamp: Date.now() + 1000 * 60 * 60,
        status: fStatus || 'upcoming',
        version: fVersion.trim() || 'Mobile Only · Strict Anti-Cheat',
        roomId: fRoomId.trim() || undefined,
        roomPassword: fRoomPassword.trim() || undefined,
        specialBadge: fSpecialBadge.trim() || undefined,
        isFeatured: Boolean(fIsFeatured),
        prizes: fPrizes.filter((p) => p.rank && p.rank.trim().length > 0),
        rules: fRules.filter((r) => r && r.trim().length > 0),
      };

      if (modalMode === 'create') {
        await createTournament(tourneyPayload);
        setToastMessage(`✅ Tournament "${trimmedTitle}" created & published successfully!`);
      } else if (modalMode === 'edit' && editingId) {
        await updateTournament(editingId, tourneyPayload);
        setToastMessage(`✅ Tournament "${trimmedTitle}" updated successfully!`);
      }

      triggerConfetti();
      setIsModalOpen(false);
      setAdminActiveTab('tournaments');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: any) {
      console.error('Error saving tournament:', err);
      const msg = err?.message || 'Failed to save tournament. Please try again.';
      setTournamentFormError(msg);
      alert('Error saving tournament: ' + msg);
    } finally {
      setIsSavingTournament(false);
    }
  };

  // Prize Tiers helpers
  const handleAddPrizeTier = () => {
    setFPrizes([...fPrizes, { rank: `${fPrizes.length + 1}th Place`, amount: 50 }]);
  };

  const handleUpdatePrizeTier = (index: number, field: 'rank' | 'amount', value: string | number) => {
    const updated = [...fPrizes];
    if (field === 'rank') updated[index].rank = String(value);
    if (field === 'amount') updated[index].amount = Number(value) || 0;
    setFPrizes(updated);
  };

  const handleRemovePrizeTier = (index: number) => {
    setFPrizes(fPrizes.filter((_, i) => i !== index));
  };

  // Rules helpers
  const handleAddRule = () => {
    setFRules([...fRules, '']);
  };

  const handleUpdateRule = (index: number, value: string) => {
    const updated = [...fRules];
    updated[index] = value;
    setFRules(updated);
  };

  const handleRemoveRule = (index: number) => {
    setFRules(fRules.filter((_, i) => i !== index));
  };

  // Inline Room Credentials Save
  const handleSaveRoom = (tId: string) => {
    updateRoomCredentials(tId, tempRoomId, tempRoomPass, tempStatus);
    setEditingRoomId(null);
    triggerConfetti();
  };

  // Declare Winners & Payout
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
    alert('Winners declared and prize money credited automatically to player accounts!');
  };

  // Remove Participant / Disqualify
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

  // Clean Slate Wiping
  const handleExecuteClearSlate = async () => {
    await clearAllTournaments();
    setShowClearModal(false);
    triggerConfetti();
    alert('All tournaments cleared! Fresh slate ready for adding tournaments.');
  };

  // Player Balance / Bonus Execution
  const handleExecuteWalletAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForWallet?.uid) return;
    if (walletAdjustAmount <= 0) {
      alert('Please enter a valid amount greater than ₹0');
      return;
    }
    setIsAdjustingWallet(true);
    try {
      const delta = walletAdjustType === 'debit' ? -Math.abs(walletAdjustAmount) : Math.abs(walletAdjustAmount);
      const isBonus = walletAdjustType === 'bonus';
      await adjustUserBalance(selectedUserForWallet.uid, delta, walletAdjustReason || 'Admin Manual Adjustment', isBonus);
      setToastMessage(`Successfully ${walletAdjustType === 'debit' ? 'deducted' : (isBonus ? 'gifted bonus' : 'credited')} ₹${walletAdjustAmount} for ${selectedUserForWallet.ign}!`);
      triggerConfetti();
      setSelectedUserForWallet(null);
    } catch (err) {
      alert('Failed to update balance. Please retry.');
    } finally {
      setIsAdjustingWallet(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md p-4 rounded-2xl bg-amber-500 text-neutral-950 font-black shadow-2xl shadow-amber-500/30 flex items-center justify-between gap-3 border border-amber-400">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-xs leading-snug">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 rounded-lg hover:bg-amber-600 text-neutral-950 transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner & Stats Overview */}
      <div className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-xs font-black uppercase bg-red-600 text-white flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Organizer Control Desk
                </span>
                <span className="text-xs text-neutral-400">Firebase Live Database Sync</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                NM ESPORTS <span className="text-amber-500">ADMIN PANEL</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                You have 100% control to create tournaments, edit every word/line/image/label, manage slots, and approve payments.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Wipe / Clean Slate Button */}
              <button
                onClick={() => setShowClearModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
                title="Wipe demo tournaments for fresh slate"
              >
                <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                <span>Clean Slate</span>
              </button>

              {/* Master Password Setting */}
              <button
                onClick={() => {
                  setUpdatedPass('');
                  setPassSaveSuccess(false);
                  setShowPasswordModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Key: ••••••••</span>
              </button>

              {/* ➕ Create Tournament Button */}
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Tournament</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-xs font-medium">Tournaments</span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono tabular-nums">
                {tournaments.length}
              </div>
              <span className="text-[11px] text-neutral-400">
                {tournaments.filter((t) => t.status === 'upcoming').length} Upcoming · {tournaments.filter((t) => t.status === 'live').length} Live
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-xs font-medium">Total Registrations</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono tabular-nums">
                {totalRegisteredPlayers}
              </div>
              <span className="text-[11px] text-neutral-400">
                {allUsers.length} Player Accounts in Firebase
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-xs font-medium">Prize Distributed</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
                {formatCurrency(totalPrizeDistributed)}
              </div>
              <span className="text-[11px] text-neutral-400">30-min Auto Payout</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-xs font-medium">Pending Payments</span>
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                {pendingDeposits.length + pendingWithdrawals.length}
              </div>
              <span className="text-[11px] text-neutral-400">
                {pendingDeposits.length} UTR Deposits · {pendingWithdrawals.length} Payouts
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'tournaments', label: `Tournaments (${tournaments.length})` },
              { id: 'room-manager', label: 'Room Credentials' },
              { id: 'results', label: 'Winner Declaration' },
              { id: 'payments', label: `Payments & UTR (${pendingDeposits.length})` },
              { id: 'users', label: `Players & Accounts (${allUsers.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAdminActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  adminActiveTab === tab.id
                    ? 'bg-amber-500 text-neutral-950 shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* TAB 1: DASHBOARD / TOURNAMENTS LIST */}
        {(adminActiveTab === 'dashboard' || adminActiveTab === 'tournaments') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">Active Tournaments Manager</h2>
                <p className="text-xs text-neutral-400">
                  Click 'Edit' on any tournament to change every word, label, prize, description, or image.
                </p>
              </div>
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Tournament</span>
              </button>
            </div>

            {tournaments.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Trophy className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">No Tournaments Created Yet</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto mb-5">
                  Clean slate ready! Click the button below to create your first Free Fire tournament with custom rules, match flow, prize pool, and image.
                </p>
                <button
                  onClick={handleOpenCreate}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
                >
                  ➕ Create First Tournament
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((t) => (
                  <div
                    key={t.id}
                    className={`rounded-2xl overflow-hidden bg-neutral-900 border ${
                      t.isFeatured ? 'border-amber-500/80 shadow-lg shadow-amber-500/10' : 'border-neutral-800'
                    } flex flex-col justify-between`}
                  >
                    <div>
                      {/* Banner Image Preview */}
                      <div className="relative h-40 w-full overflow-hidden bg-neutral-950">
                        <img
                          src={t.image}
                          alt={t.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />

                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-neutral-950/80 text-amber-400 border border-neutral-700 backdrop-blur-sm">
                            {t.gameMode} · {t.format}
                          </span>
                          {t.specialBadge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-neutral-950 shadow-sm">
                              {t.specialBadge}
                            </span>
                          )}
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              t.status === 'live'
                                ? 'bg-red-600 text-white animate-pulse'
                                : t.status === 'completed'
                                ? 'bg-neutral-800 text-neutral-400'
                                : 'bg-emerald-500 text-neutral-950'
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                      </div>

                      {/* Card Info */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="text-base font-bold text-white line-clamp-1">{t.title}</h3>
                          {t.subtitle && <p className="text-xs text-amber-300 line-clamp-1">{t.subtitle}</p>}
                        </div>

                        {/* Custom Labels Display */}
                        <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-xl bg-neutral-950 border border-neutral-800/80">
                          <div>
                            <div className="text-[10px] text-neutral-400 line-clamp-1">{t.prizePoolLabel || 'Prize Pool'}</div>
                            <div className="text-xs font-black text-amber-400 font-mono">
                              {formatCurrency(t.prizePool)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-neutral-400 line-clamp-1">{t.entryFeeLabel || 'Entry Fee'}</div>
                            <div className="text-xs font-black text-emerald-400 font-mono">
                              {formatCurrency(t.entryFee)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-neutral-400 line-clamp-1">{t.perKillLabel || 'Per Kill'}</div>
                            <div className="text-xs font-bold text-neutral-200 font-mono">
                              {t.showPerKill !== false && t.perKill > 0 ? formatCurrency(t.perKill) : 'Off'}
                            </div>
                          </div>
                        </div>

                        {/* Room Credentials status */}
                        <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs">
                          <div className="flex items-center justify-between text-neutral-400 mb-1">
                            <span>Room ID: <strong className="text-white font-mono">{t.roomId || 'Not set'}</strong></span>
                            <span>Pass: <strong className="text-white font-mono">{t.roomPassword || 'Not set'}</strong></span>
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            Time: <strong className="text-neutral-200">{t.startTime}</strong> · Map: <strong className="text-neutral-200">{t.map}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-4 pt-0 border-t border-neutral-800/80 mt-3 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setViewingParticipantsTourney(t)}
                        className="flex-1 py-2 text-xs font-bold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span>Roster ({t.joinedSlots}/{t.totalSlots})</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
                        title="Edit all tournament details and text"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete tournament "${t.title}"?`)) {
                            deleteTournament(t.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800/60 transition-colors"
                        title="Delete tournament"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ROOM CREDENTIALS MANAGER */}
        {adminActiveTab === 'room-manager' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Custom Room ID & Password Manager</h2>
              <p className="text-xs text-neutral-400">
                Release room credentials 15 minutes before match time. Registered players will see them automatically.
              </p>
            </div>

            <div className="space-y-4">
              {tournaments.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-neutral-950 text-amber-400 border border-neutral-700">
                        {t.gameMode} · {t.format}
                      </span>
                      <span className="text-xs text-neutral-400">{t.startTime}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{t.title}</h3>
                    <p className="text-xs text-neutral-400">
                      Slots: {t.joinedSlots} / {t.totalSlots} registered players
                    </p>
                  </div>

                  {editingRoomId === t.id ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="text"
                        placeholder="Room ID"
                        value={tempRoomId}
                        onChange={(e) => setTempRoomId(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-sm font-mono text-white w-32"
                      />
                      <input
                        type="text"
                        placeholder="Room Password"
                        value={tempRoomPass}
                        onChange={(e) => setTempRoomPass(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-sm font-mono text-white w-32"
                      />
                      <select
                        value={tempStatus}
                        onChange={(e) => setTempStatus(e.target.value as any)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-white"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="live">Live Now</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        onClick={() => handleSaveRoom(t.id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold"
                      >
                        Save & Sync
                      </button>
                      <button
                        onClick={() => setEditingRoomId(null)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-400 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-neutral-400">Room ID: <strong className="text-white font-mono">{t.roomId || 'None'}</strong></div>
                        <div className="text-xs text-neutral-400">Password: <strong className="text-white font-mono">{t.roomPassword || 'None'}</strong></div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingRoomId(t.id);
                          setTempRoomId(t.roomId || '');
                          setTempRoomPass(t.roomPassword || '');
                          setTempStatus(t.status);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold"
                      >
                        Update Room
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WINNER DECLARATION */}
        {adminActiveTab === 'results' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Declare Match Winners & Disburse Prizes</h2>
              <p className="text-xs text-neutral-400">
                Prizes are credited to winners' wallets instantly.
              </p>
            </div>

            {tournaments.length === 0 ? (
              <div className="p-8 text-center bg-neutral-900 rounded-2xl border border-neutral-800">
                No tournaments available.
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Select Tournament
                  </label>
                  <select
                    value={selectedTourneyId}
                    onChange={(e) => setSelectedTourneyId(e.target.value)}
                    className="w-full max-w-md px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                  >
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.status.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const tourney = tournaments.find((t) => t.id === selectedTourneyId) || tournaments[0];
                  if (!tourney) return null;

                  return (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">{tourney.title}</h4>
                          <span className="text-xs text-amber-400">
                            Total Prize Pool: {formatCurrency(tourney.prizePool)}
                          </span>
                        </div>
                        <span className="text-xs text-neutral-400">
                          {tourney.participants.length} Squads in match
                        </span>
                      </div>

                      {tourney.participants.length === 0 ? (
                        <div className="p-6 text-center text-xs text-neutral-500">
                          No players have registered for this tournament yet.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {tourney.participants.map((p) => {
                            const cur = winnerRanks[p.id] || { rank: 1, kills: 0, prize: 0 };
                            return (
                              <div
                                key={p.id}
                                className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                              >
                                <div>
                                  <span className="font-bold text-white text-sm">{p.teamName}</span>
                                  <div className="text-neutral-400 text-[11px]">
                                    Leader: {p.playerIgn} (UID: {p.playerUid})
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div>
                                    <span className="block text-[10px] text-neutral-400 mb-0.5">Rank</span>
                                    <input
                                      type="number"
                                      min={1}
                                      value={cur.rank}
                                      onChange={(e) =>
                                        setWinnerRanks({
                                          ...winnerRanks,
                                          [p.id]: { ...cur, rank: Number(e.target.value) },
                                        })
                                      }
                                      className="w-16 px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-center text-white"
                                    />
                                  </div>

                                  <div>
                                    <span className="block text-[10px] text-neutral-400 mb-0.5">Kills</span>
                                    <input
                                      type="number"
                                      min={0}
                                      value={cur.kills}
                                      onChange={(e) =>
                                        setWinnerRanks({
                                          ...winnerRanks,
                                          [p.id]: { ...cur, kills: Number(e.target.value) },
                                        })
                                      }
                                      className="w-16 px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-center text-white"
                                    />
                                  </div>

                                  <div>
                                    <span className="block text-[10px] text-neutral-400 mb-0.5">Prize (₹)</span>
                                    <input
                                      type="number"
                                      min={0}
                                      value={cur.prize}
                                      onChange={(e) =>
                                        setWinnerRanks({
                                          ...winnerRanks,
                                          [p.id]: { ...cur, prize: Number(e.target.value) },
                                        })
                                      }
                                      className="w-24 px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-center text-amber-400 font-bold"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          <button
                            onClick={() => handleDeclareSubmit(tourney.id)}
                            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors shadow-md mt-4"
                          >
                            Declare Winners & Credit Wallets
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PAYMENTS & UTR VERIFICATION */}
        {adminActiveTab === 'payments' && (
          <div className="space-y-8">
            {/* Deposits */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Player UPI Deposits (UTR Verification)</h3>
                  <p className="text-xs text-neutral-400">Match 12-digit UTR with your bank app before approving.</p>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {pendingDeposits.length} Pending
                </span>
              </div>

              {pendingDeposits.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
                  No pending deposit requests.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingDeposits.map((dep) => (
                    <div
                      key={dep.id}
                      className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
                    >
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{dep.userName}</span>
                          <span className="text-base font-black text-emerald-400 font-mono">
                            {formatCurrency(dep.amount)}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400 space-y-1">
                          <div>App: <strong className="text-white">{dep.upiApp}</strong></div>
                          <div>12-digit UTR: <strong className="text-amber-400 font-mono tracking-wider">{dep.utrNumber}</strong></div>
                          <div>Phone: {dep.userPhone} · UID: {dep.userUid}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-neutral-800">
                        <button
                          onClick={() => approveDeposit(dep.id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors"
                        >
                          Approve (Credit ₹{dep.amount})
                        </button>
                        <button
                          onClick={() => rejectDeposit(dep.id)}
                          className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Withdrawals */}
            <div className="space-y-4 pt-6 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Withdrawal Requests (Payouts)</h3>
                  <p className="text-xs text-neutral-400">Send money to player UPI ID and mark as paid.</p>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {pendingWithdrawals.length} Pending
                </span>
              </div>

              {pendingWithdrawals.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
                  No pending withdrawal requests.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingWithdrawals.map((wdr) => (
                    <div
                      key={wdr.id}
                      className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
                    >
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{wdr.userName}</span>
                          <span className="text-base font-black text-rose-400 font-mono">
                            {formatCurrency(wdr.amount)}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400 space-y-1">
                          <div>UPI ID: <strong className="text-amber-400 font-mono">{wdr.upiId}</strong></div>
                          <div>Phone: {wdr.userPhone}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-neutral-800">
                        <button
                          onClick={() => approveWithdrawal(wdr.id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors"
                        >
                          Mark as Paid
                        </button>
                        <button
                          onClick={() => rejectWithdrawal(wdr.id)}
                          className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs transition-colors"
                        >
                          Reject & Refund
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PLAYERS & FIREBASE ACCOUNTS */}
        {adminActiveTab === 'users' && (() => {
          const filteredUsers = allUsers.filter((u) => {
            if (!userSearch.trim()) return true;
            const q = userSearch.toLowerCase();
            return (
              u.ign.toLowerCase().includes(q) ||
              u.uid.toLowerCase().includes(q) ||
              (u.phone && u.phone.includes(q)) ||
              (u.name && u.name.toLowerCase().includes(q))
            );
          });

          return (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight">Registered Player Accounts</h2>
                  <p className="text-xs text-neutral-400">
                    Real-time synced accounts stored in Firebase Firestore collection <code className="text-amber-400 font-mono">/users</code>.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by IGN, UID, or Phone..."
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs w-full sm:w-64 focus:outline-none focus:border-amber-500"
                  />
                  <span className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-amber-400 shrink-0">
                    {filteredUsers.length} Players
                  </span>
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs space-y-2">
                  <Users className="w-8 h-8 text-neutral-600 mx-auto mb-1" />
                  <div className="font-bold text-white text-sm">
                    {allUsers.length === 0 ? 'No user accounts in Firebase yet' : 'No matching players found'}
                  </div>
                  <p className="text-neutral-500 max-w-sm mx-auto">
                    {allUsers.length === 0
                      ? 'When players sign up or join tournaments from the user portal, their Free Fire UID, IGN, WhatsApp phone, and gameplay stats are saved automatically to Firebase Firestore.'
                      : 'Try clearing your search query to see all players.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                      <tr>
                        <th className="p-3.5">Player IGN & Name</th>
                        <th className="p-3.5">Free Fire UID</th>
                        <th className="p-3.5">Wallet Balance</th>
                        <th className="p-3.5">WhatsApp Contact</th>
                        <th className="p-3.5">Rank & Role</th>
                        <th className="p-3.5">Device</th>
                        <th className="p-3.5">Registered</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-neutral-300">
                      {filteredUsers.map((u, i) => {
                        const cleanPhone = u.phone ? u.phone.replace(/\D/g, '') : '';
                        const waLink = cleanPhone
                          ? `https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(u.ign)}%2C%20NM%20ESPORTS%20Admin%20here%20regarding%20your%20Free%20Fire%20tournament%20matches.`
                          : null;

                        return (
                          <tr key={u.uid || i} className="hover:bg-neutral-800/50 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                                  {u.avatarSeed ? u.avatarSeed.slice(0, 2).toUpperCase() : 'FF'}
                                </div>
                                <div>
                                  <div className="font-bold text-white font-mono">{u.ign}</div>
                                  <div className="text-[11px] text-neutral-400">{u.name || 'Contender'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono text-amber-400 font-bold">
                              {u.uid}
                            </td>
                            <td className="p-3.5 font-mono text-emerald-400 font-black tabular-nums">
                              {formatCurrency(u.walletBalance || 0)}
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono">{u.phone || 'N/A'}</span>
                                {waLink && (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded bg-[#25D366]/20 hover:bg-[#25D366]/40 text-[#25D366] transition-colors"
                                    title="Open WhatsApp chat with this player"
                                  >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.96.523 1.838.796 2.791.796h.005c3.18 0 5.767-2.586 5.767-5.766.001-3.182-2.585-5.782-5.772-5.782zm0-1.84c4.195 0 7.604 3.409 7.605 7.606 0 4.197-3.41 7.607-7.605 7.607-1.282 0-2.527-.323-3.626-.935L4.05 20.003l1.402-4.227C4.78 14.65 4.425 13.38 4.425 11.938c.001-4.197 3.411-7.606 7.606-7.606z" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                  {u.rank || 'Heroic'}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-300">
                                  {u.role || 'Rusher'}
                                </span>
                              </div>
                            </td>
                            <td className="p-3.5 text-neutral-400">
                              {u.device || 'Mobile'}
                            </td>
                            <td className="p-3.5 text-neutral-500">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {waLink && (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-[11px] font-bold transition-colors flex items-center gap-1"
                                  >
                                    <span>WhatsApp</span>
                                  </a>
                                )}
                                <button
                                  onClick={() => {
                                    setSelectedUserForWallet(u);
                                    setWalletAdjustAmount(50);
                                    setWalletAdjustType('credit');
                                    setWalletAdjustReason('Admin Cash Top-Up');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-[11px] font-black transition-colors flex items-center gap-1 shadow-sm"
                                  title="Add Cash, Deduct Funds or Gift Bonus"
                                >
                                  <Wallet className="w-3.5 h-3.5" />
                                  <span>Manage Wallet / Bonus</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* MODAL: 100% CUSTOMIZABLE TOURNAMENT CREATE / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-700 rounded-3xl shadow-2xl overflow-hidden my-8 p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-neutral-950">
                  {modalMode === 'create' ? 'CREATE NEW' : 'EDIT EVERY WORD'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  {modalMode === 'create' ? 'Create Free Fire Tournament' : 'Edit Tournament Details'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTournament} noValidate className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
              {/* Section 1: Tournament Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Tournament Title / Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fTitle}
                    onChange={(e) => setFTitle(e.target.value)}
                    placeholder="e.g. Diwali Dhamaka Free Fire Mega Cup 🪔"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Subtitle / Tagline (Optional)
                  </label>
                  <input
                    type="text"
                    value={fSubtitle}
                    onChange={(e) => setFSubtitle(e.target.value)}
                    placeholder="e.g. 2 BR Matches + CS Playoffs"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Section 2: Banner Image Upload & Preset Selector */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Tournament Banner Image</span>
                  </label>
                  <span className="text-[11px] text-neutral-400">Upload or Pick Preset</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Current Preview */}
                  <div className="w-full sm:w-48 h-28 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700 shrink-0">
                    <img
                      src={fImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold cursor-pointer transition-colors border border-neutral-700">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>{isUploadingImage ? 'Uploading & Compressing...' : 'Upload Image from Phone/PC'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageFileChange}
                          disabled={isUploadingImage}
                        />
                      </label>
                    </div>

                    <div>
                      <span className="text-[11px] text-neutral-400 block mb-1">Or paste custom image URL / asset path:</span>
                      <input
                        type="text"
                        value={fImage}
                        onChange={(e) => setFImage(e.target.value)}
                        placeholder="https://... or /src/assets/images/..."
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white font-mono"
                      />
                    </div>

                    {/* Presets */}
                    <div>
                      <span className="text-[11px] text-neutral-400 block mb-1.5">Or choose presets:</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {BANNER_PRESETS.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setFImage(p.url)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Match Flow & Detailed Description (Admin can type the exact rules) */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Match Flow & How Tournament Works (Rich Description)</span>
                  </label>
                  <span className="text-[11px] text-amber-400 font-medium">Displayed prominently to users</span>
                </div>
                <textarea
                  rows={4}
                  value={fDescription}
                  onChange={(e) => setFDescription(e.target.value)}
                  placeholder="Explain exactly how the matches will happen (e.g. Pehle 2 BR matches honge... top 4 squads CS ke liye qualify karengi... SF1 aur SF2 hoga... fir Grand Final hoga...)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs leading-relaxed focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              {/* Section 4: Game Mode, Format, Map & Schedule */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">Game Mode</label>
                  <select
                    value={fGameMode}
                    onChange={(e) => setFGameMode(e.target.value as GameMode)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-semibold"
                  >
                    <option value="BR">Battle Royale (BR)</option>
                    <option value="CS">Clash Squad (CS)</option>
                    <option value="LONE_WOLF">Lone Wolf</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">Format</label>
                  <select
                    value={fFormat}
                    onChange={(e) => setFFormat(e.target.value as MatchFormat)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-semibold"
                  >
                    <option value="Squad">Squad (4 Players)</option>
                    <option value="Duo">Duo (2 Players)</option>
                    <option value="Solo">Solo (1 Player)</option>
                    <option value="4v4">4v4 Clash Squad</option>
                    <option value="1v1">1v1 Duel</option>
                    <option value="2v2">2v2 Duo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">Map Name</label>
                  <input
                    type="text"
                    value={fMap}
                    onChange={(e) => setFMap(e.target.value)}
                    placeholder="e.g. Bermuda & Purgatory"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">Start Time / Date</label>
                  <input
                    type="text"
                    value={fStartTime}
                    onChange={(e) => setFStartTime(e.target.value)}
                    placeholder="e.g. 7 Nov, 02:00 PM IST"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  />
                </div>
              </div>

              {/* Section 5: Dynamic Labels for Prize Pool, Entry Fee & Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                {/* Prize Pool */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-amber-400">Prize Pool</label>
                  <input
                    type="number"
                    min={0}
                    value={fPrizePool}
                    onChange={(e) => setFPrizePool(Number(e.target.value))}
                    placeholder="Prize Amount (₹)"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400 font-mono font-bold text-sm"
                  />
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-0.5">Custom Label</span>
                    <input
                      type="text"
                      value={fPrizePoolLabel}
                      onChange={(e) => setFPrizePoolLabel(e.target.value)}
                      placeholder="e.g. Total Prize Pool"
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Entry Fee */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-emerald-400">Entry Fee</label>
                  <input
                    type="number"
                    min={0}
                    value={fEntryFee}
                    onChange={(e) => setFEntryFee(Number(e.target.value))}
                    placeholder="Entry Fee (₹)"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 font-mono font-bold text-sm"
                  />
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-0.5">Custom Label</span>
                    <input
                      type="text"
                      value={fEntryFeeLabel}
                      onChange={(e) => setFEntryFeeLabel(e.target.value)}
                      placeholder="e.g. Entry Fee or Per Squad"
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Slots */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-blue-400">Total Slots</label>
                  <input
                    type="number"
                    min={1}
                    value={fTotalSlots}
                    onChange={(e) => setFTotalSlots(Number(e.target.value))}
                    placeholder="Slots (e.g. 48)"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono font-bold text-sm"
                  />
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-0.5">Custom Label</span>
                    <input
                      type="text"
                      value={fTotalSlotsLabel}
                      onChange={(e) => setFTotalSlotsLabel(e.target.value)}
                      placeholder="e.g. Slots Filled"
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Per Kill Section (Can be toggled ON or OFF with custom label) */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fShowPerKill}
                      onChange={(e) => setFShowPerKill(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-xs font-bold text-white">Enable Per-Kill Reward / Points?</span>
                  </label>
                  <span className="text-[11px] text-neutral-400">Turn OFF if no kill bounty</span>
                </div>

                {fShowPerKill && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-[10px] text-neutral-400 block mb-1">Per Kill Amount (₹) or Points</span>
                      <input
                        type="number"
                        min={0}
                        value={fPerKill}
                        onChange={(e) => setFPerKill(Number(e.target.value))}
                        placeholder="1"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block mb-1">Custom Per-Kill Label</span>
                      <input
                        type="text"
                        value={fPerKillLabel}
                        onChange={(e) => setFPerKillLabel(e.target.value)}
                        placeholder="e.g. 1 Kill = 1 Pt or Per Kill"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 7: Dynamic Prize Tiers Breakdown (1st, 2nd, 3rd, MVP...) */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">
                    Prize Distribution Breakdown (1st, 2nd, 3rd...)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPrizeTier}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Tier</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {fPrizes.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={p.rank}
                        onChange={(e) => handleUpdatePrizeTier(idx, 'rank', e.target.value)}
                        placeholder="e.g. 1st Place (Champion)"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                      />
                      <input
                        type="number"
                        value={p.amount}
                        onChange={(e) => handleUpdatePrizeTier(idx, 'amount', e.target.value)}
                        placeholder="₹ Amount"
                        className="w-28 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-amber-400 font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePrizeTier(idx)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 8: Dynamic Rules List */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">
                    Tournament Rules & Anti-Cheat Guidelines
                  </label>
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Rule Line</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {fRules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-neutral-500 text-xs w-5 font-mono">{idx + 1}.</span>
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => handleUpdateRule(idx, e.target.value)}
                        placeholder="Rule line..."
                        className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 9: Highlights, Ribbon, Status & Room Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Top Ribbon / Special Badge
                    </label>
                    <input
                      type="text"
                      value={fSpecialBadge}
                      onChange={(e) => setFSpecialBadge(e.target.value)}
                      placeholder="e.g. 🪔 DIWALI SPECIAL or 🔥 MEGA EVENT"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-semibold"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={fIsFeatured}
                      onChange={(e) => setFIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-xs font-bold text-amber-400">Pin to Top as Featured with Golden Glow</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">Match Status</label>
                    <select
                      value={fStatus}
                      onChange={(e) => setFStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-semibold"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live Now</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-neutral-400 block mb-0.5">Room ID</span>
                      <input
                        type="text"
                        value={fRoomId}
                        onChange={(e) => setFRoomId(e.target.value)}
                        placeholder="e.g. 7788441"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block mb-0.5">Room Password</span>
                      <input
                        type="text"
                        value={fRoomPassword}
                        onChange={(e) => setFRoomPassword(e.target.value)}
                        placeholder="e.g. diwali"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Error Banner */}
              {tournamentFormError && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="font-semibold">{tournamentFormError}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="submit"
                  disabled={isSavingTournament || isUploadingImage}
                  onClick={(e) => handleSaveTournament(e)}
                  className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSavingTournament && <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />}
                  <span>
                    {isSavingTournament
                      ? 'Publishing & Syncing...'
                      : modalMode === 'create'
                      ? 'Save & Publish Tournament'
                      : 'Update & Save Changes'}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={isSavingTournament}
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-neutral-300 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW & MANAGE REGISTERED PARTICIPANTS */}
      {viewingParticipantsTourney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <div>
                <h3 className="text-xl font-black text-white">{viewingParticipantsTourney.title}</h3>
                <p className="text-xs text-neutral-400">
                  Registered Squads: {viewingParticipantsTourney.joinedSlots} / {viewingParticipantsTourney.totalSlots}
                </p>
              </div>
              <button
                onClick={() => setViewingParticipantsTourney(null)}
                className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {viewingParticipantsTourney.participants.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 text-xs">
                No teams registered yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {viewingParticipantsTourney.participants.map((p, index) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-neutral-500">#{index + 1}</span>
                        <strong className="text-white text-sm">{p.teamName}</strong>
                      </div>
                      <div className="text-neutral-400 space-y-0.5">
                        <div>Leader: <span className="text-white font-mono">{p.playerIgn}</span> (UID: {p.playerUid})</div>
                        <div>WhatsApp / Phone: <span className="text-amber-400 font-mono">{p.phone}</span></div>
                        {p.teammates && p.teammates.length > 0 && (
                          <div className="text-[11px] text-neutral-500">
                            Teammates: {p.teammates.map((t) => `${t.ign} (${t.uid})`).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveParticipant(viewingParticipantsTourney.id, p.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 font-bold text-xs shrink-0"
                    >
                      Remove / Kick
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CLEAN SLATE CONFIRMATION */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-950/80 text-red-400 border border-red-800 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Reset to Clean Slate?</h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              This will permanently delete all tournaments from Firebase and local state so you can organize your fresh tournaments from scratch.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExecuteClearSlate}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
              >
                Yes, Clear All
              </button>
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN PASSWORD CHANGE */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6">
            <h3 className="text-base font-bold text-white mb-3">Change Admin Master Password</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Current default key is <code className="text-amber-400 font-mono font-bold">NM@7788</code>. Enter a new key to protect your admin access.
            </p>

            {passSaveSuccess ? (
              <div className="p-3 mb-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Admin Password updated successfully!</span>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={updatedPass}
                  onChange={(e) => setUpdatedPass(e.target.value)}
                  placeholder="New Admin Password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm font-mono"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (updatedPass.trim().length >= 4) {
                        changeAdminPassword(updatedPass.trim());
                        setPassSaveSuccess(true);
                        setTimeout(() => setShowPasswordModal(false), 1200);
                      } else {
                        alert('Password must be at least 4 characters long.');
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase"
                  >
                    Save New Password
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: PLAYER WALLET MANAGEMENT (CREDIT / DEBIT / BONUS) */}
      {selectedUserForWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden p-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <div>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-500 text-neutral-950">
                  Player Wallet Desk
                </span>
                <h3 className="text-base font-black text-white mt-1">
                  Manage Funds: {selectedUserForWallet.ign}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUserForWallet(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteWalletAdjustment} className="space-y-4">
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <div className="text-neutral-400">Free Fire UID</div>
                  <div className="font-mono font-bold text-white">{selectedUserForWallet.uid}</div>
                </div>
                <div className="text-right">
                  <div className="text-neutral-400">Current Balance</div>
                  <div className="font-mono font-black text-amber-400 text-base tabular-nums">
                    {formatCurrency(selectedUserForWallet.walletBalance || 0)}
                  </div>
                </div>
              </div>

              {/* Action Type Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">Action Type</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setWalletAdjustType('credit');
                      setWalletAdjustReason('Admin Cash Top-Up');
                    }}
                    className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      walletAdjustType === 'credit'
                        ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>+ Add Cash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWalletAdjustType('bonus');
                      setWalletAdjustReason('Diwali / Match Bonus');
                    }}
                    className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      walletAdjustType === 'bonus'
                        ? 'bg-amber-500 text-neutral-950 shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>🎁 Bonus</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWalletAdjustType('debit');
                      setWalletAdjustReason('Admin Balance Deduction');
                    }}
                    className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      walletAdjustType === 'debit'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>- Deduct</span>
                  </button>
                </div>
              </div>

              {/* Amount Input & Presets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-300">Amount (₹)</label>
                  <div className="flex items-center gap-1">
                    {[20, 50, 100, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setWalletAdjustAmount(amt)}
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300"
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  min={1}
                  required
                  value={walletAdjustAmount}
                  onChange={(e) => setWalletAdjustAmount(Number(e.target.value))}
                  placeholder="50"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono font-black text-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Reason / Note */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Reason / Note for Player
                </label>
                <input
                  type="text"
                  required
                  value={walletAdjustReason}
                  onChange={(e) => setWalletAdjustReason(e.target.value)}
                  placeholder="e.g. Diwali Dhamaka Special Bonus or UPI payment"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isAdjustingWallet}
                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg mt-2 ${
                  walletAdjustType === 'debit'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : walletAdjustType === 'bonus'
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                }`}
              >
                {isAdjustingWallet
                  ? 'Updating Firebase...'
                  : `Execute ${walletAdjustType === 'debit' ? 'Deduction' : walletAdjustType === 'bonus' ? 'Bonus Award' : 'Cash Deposit'} (₹${walletAdjustAmount})`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
