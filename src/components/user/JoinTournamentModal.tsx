import React, { useState } from 'react';
import { Tournament } from '../../types';
import { useEsports } from '../../context/EsportsContext';
import { formatCurrency, triggerConfetti } from '../../utils/helpers';
import { X, ShieldCheck, Wallet, AlertCircle, Users, CheckCircle2 } from 'lucide-react';

interface JoinTournamentModalProps {
  tournament: Tournament | null;
  onClose: () => void;
  onOpenWallet: () => void;
  onSuccessJoined: () => void;
}

export const JoinTournamentModal: React.FC<JoinTournamentModalProps> = ({
  tournament,
  onClose,
  onOpenWallet,
  onSuccessJoined,
}) => {
  const { walletBalance, profile, joinTournament } = useEsports();

  const [playerIgn, setPlayerIgn] = useState(profile.ign);
  const [playerUid, setPlayerUid] = useState(profile.uid);
  const [phone, setPhone] = useState(profile.phone);
  const [teamName, setTeamName] = useState(
    tournament?.format === 'Solo' || tournament?.format === '1v1' ? '' : `${profile.ign}'s Squad`
  );

  // Teammates state for Squad / Duo / 4v4
  const requiresTeammates = tournament?.format !== 'Solo' && tournament?.format !== '1v1';
  const teammateCount =
    tournament?.format === 'Duo' || tournament?.format === '2v2' ? 1 : tournament?.format === 'Squad' || tournament?.format === '4v4' ? 3 : 0;

  const [teammates, setTeammates] = useState<Array<{ ign: string; uid: string }>>(() => {
    return Array.from({ length: teammateCount }, (_, i) => ({
      ign: `Teammate_${i + 2}`,
      uid: `29481900${i + 2}`,
    }));
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!tournament) return null;

  const hasEnoughFunds = walletBalance >= tournament.entryFee;

  const handleTeammateChange = (index: number, field: 'ign' | 'uid', value: string) => {
    setTeammates((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!playerIgn.trim()) {
      setErrorMsg('Please enter your Free Fire In-Game Name (IGN).');
      return;
    }
    if (!playerUid.trim() || playerUid.length < 6) {
      setErrorMsg('Please enter a valid Free Fire numeric UID (min 6 digits).');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please provide a mobile number for room notification alerts.');
      return;
    }

    if (!hasEnoughFunds) {
      setErrorMsg(`Insufficient wallet balance. You need ₹${tournament.entryFee - walletBalance} more to join.`);
      return;
    }

    setIsSubmitting(true);

    const result = joinTournament(tournament.id, {
      teamName: teamName.trim() || playerIgn.trim(),
      playerIgn: playerIgn.trim(),
      playerUid: playerUid.trim(),
      phone: phone.trim(),
      teammates: requiresTeammates ? teammates : undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      triggerConfetti();
      onSuccessJoined();
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/70">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Tournament Registration
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{tournament.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-xs text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tournament Quick Specs */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center text-xs">
            <div>
              <span className="text-neutral-400">Format</span>
              <div className="font-bold text-white">{tournament.format} ({tournament.map})</div>
            </div>
            <div>
              <span className="text-neutral-400">Prize Pool</span>
              <div className="font-bold text-amber-400 font-mono tabular-nums">
                {formatCurrency(tournament.prizePool)}
              </div>
            </div>
            <div>
              <span className="text-neutral-400">Entry Fee</span>
              <div className="font-bold text-emerald-400 font-mono tabular-nums">
                {formatCurrency(tournament.entryFee)}
              </div>
            </div>
          </div>

          {/* Player details */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  In-Game Name (IGN) <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={playerIgn}
                  onChange={(e) => setPlayerIgn(e.target.value)}
                  placeholder="e.g. NM_THUNDER"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Free Fire UID (Digits) <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={playerUid}
                  onChange={(e) => setPlayerUid(e.target.value)}
                  placeholder="e.g. 2847193021"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                WhatsApp Mobile Number (for Room ID SMS & ping) <span className="text-amber-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {requiresTeammates && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Team / Clan Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. VORTEX ELITE"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Teammates fields if Squad/Duo */}
          {requiresTeammates && teammates.length > 0 && (
            <div className="pt-2 border-t border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 mb-2">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Teammates Information ({teammates.length} Players)</span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {teammates.map((tm, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                    <div>
                      <input
                        type="text"
                        value={tm.ign}
                        onChange={(e) => handleTeammateChange(idx, 'ign', e.target.value)}
                        placeholder={`Player ${idx + 2} IGN`}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={tm.uid}
                        onChange={(e) => handleTeammateChange(idx, 'uid', e.target.value)}
                        placeholder={`Player ${idx + 2} UID`}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 font-mono focus:border-amber-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment & Wallet summary */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                Your Wallet Balance
              </span>
              <span className="font-mono font-bold text-white tabular-nums">
                {formatCurrency(walletBalance)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Match Entry Fee</span>
              <span className="font-mono font-bold text-amber-400 tabular-nums">
                - {formatCurrency(tournament.entryFee)}
              </span>
            </div>

            {!hasEnoughFunds && (
              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                <span className="text-red-400 font-medium">Insufficient balance</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWallet();
                  }}
                  className="px-2.5 py-1 rounded bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 transition-colors"
                >
                  + Add Cash via UPI
                </button>
              </div>
            )}
          </div>

          {/* Fair Play Notice */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Strict Mobile-Only Policy. Emulators / PC will be banned without refund.</span>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={!hasEnoughFunds || isSubmitting}
            className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md ${
              hasEnoughFunds
                ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              'Confirming Slot...'
            ) : hasEnoughFunds ? (
              `Pay ${formatCurrency(tournament.entryFee)} & Confirm Slot`
            ) : (
              'Add Cash to Join Match'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
