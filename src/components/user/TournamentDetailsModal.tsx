import React from 'react';
import { Tournament } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { X, Trophy, Swords, Zap, Shield, Users, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { useEsports } from '../../context/EsportsContext';

interface TournamentDetailsModalProps {
  tournament: Tournament | null;
  onClose: () => void;
  onJoinClick: (tournament: Tournament) => void;
  onViewRoomClick: (tournament: Tournament) => void;
}

export const TournamentDetailsModal: React.FC<TournamentDetailsModalProps> = ({
  tournament,
  onClose,
  onJoinClick,
  onViewRoomClick,
}) => {
  const { profile, setShowUserAuthModal } = useEsports();

  if (!tournament) return null;

  const isUserJoined = tournament.participants.some(
    (p) => p.playerUid === profile.uid || p.playerIgn.toLowerCase() === profile.ign.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Banner Image */}
        <div className="relative h-48 sm:h-56 w-full bg-neutral-950">
          <img
            src={tournament.image}
            alt={tournament.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-950/80 hover:bg-neutral-900 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
              <span>{tournament.gameMode} · {tournament.format}</span>
              <span aria-hidden="true">·</span>
              <span>{tournament.map}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{tournament.title}</h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Key Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block truncate" title={tournament.prizePoolLabel || 'Total Prize Pool'}>
                {tournament.prizePoolLabel || 'Total Prize Pool'}
              </span>
              <div className="text-lg font-black text-amber-400 font-mono tabular-nums">
                {formatCurrency(tournament.prizePool)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block truncate" title={tournament.entryFeeLabel || 'Entry Fee'}>
                {tournament.entryFeeLabel || 'Entry Fee'}
              </span>
              <div className="text-lg font-black text-emerald-400 font-mono tabular-nums">
                {tournament.entryFee === 0 ? 'FREE' : formatCurrency(tournament.entryFee)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block truncate" title={tournament.perKillLabel || 'Per Kill'}>
                {tournament.perKillLabel || 'Per Kill'}
              </span>
              <div className="text-lg font-black text-neutral-200 font-mono tabular-nums">
                {tournament.showPerKill === false ? (
                  <span className="text-neutral-500 text-sm">Off</span>
                ) : tournament.perKill > 0 ? (
                  tournament.perKill >= 5 ? formatCurrency(tournament.perKill) : `${tournament.perKill} Pt`
                ) : (
                  'None'
                )}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block truncate" title={tournament.totalSlotsLabel || 'Slots Filled'}>
                {tournament.totalSlotsLabel || 'Slots Filled'}
              </span>
              <div className="text-lg font-black text-neutral-200 font-mono tabular-nums">
                {tournament.joinedSlots} / {tournament.totalSlots}
              </div>
            </div>
          </div>

          {/* Match Flow & Detailed Rules Written by Admin */}
          {tournament.description && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-neutral-950 border-2 border-amber-500/60 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <div>
                    <h3 className="text-sm font-black text-white tracking-wide uppercase">
                      Match Format & Progression
                    </h3>
                    <p className="text-[11px] text-amber-300">
                      Official match instructions set by organizer
                    </p>
                  </div>
                </div>
                {tournament.specialBadge && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-neutral-950">
                    {tournament.specialBadge}
                  </span>
                )}
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-200 leading-relaxed whitespace-pre-line">
                {tournament.description}
              </div>
            </div>
          )}


          {/* Winner announcement if completed */}
          {tournament.winnerAnnounced && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-amber-400" />
                <div>
                  <div className="text-xs text-amber-400 font-bold uppercase">Champion Team / Player</div>
                  <div className="text-base font-black text-white">{tournament.winnerTeam || 'Declared'}</div>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500 text-neutral-950">
                Prize Disbursed
              </span>
            </div>
          )}

          {/* Prize Distribution */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Prize Pool Distribution</span>
            </h3>
            <div className="rounded-xl border border-neutral-800 overflow-hidden divide-y divide-neutral-800 bg-neutral-950">
              {tournament.prizes.map((pz, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-2.5 text-xs">
                  <span className="font-semibold text-neutral-300">{pz.rank}</span>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">
                    {formatCurrency(pz.amount)}
                  </span>
                </div>
              ))}
              {tournament.perKill > 0 && (
                <div className="flex items-center justify-between px-4 py-2.5 text-xs bg-neutral-900/40">
                  <span className="font-semibold text-neutral-300">Each In-Game Kill</span>
                  <span className="font-mono font-bold text-neutral-200 tabular-nums">
                    +{formatCurrency(tournament.perKill)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Rules */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Match Rules & Guidelines</span>
            </h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              {tournament.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/60">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Participants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Registered Players ({tournament.participants.length})</span>
              </h3>
            </div>
            {tournament.participants.length === 0 ? (
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-500">
                No players registered yet. Be the first to grab slot #1!
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-800 overflow-hidden divide-y divide-neutral-800 bg-neutral-950 text-xs">
                {tournament.participants.map((p, idx) => (
                  <div key={p.id} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>Slot #{p.slotNumber}</span>
                        <span className="text-neutral-400">·</span>
                        <span>{p.teamName}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Leader: <strong className="text-neutral-300">{p.playerIgn}</strong> (UID: {p.playerUid})
                      </div>
                    </div>
                    {p.prizeWon ? (
                      <span className="font-mono font-bold text-emerald-400 tabular-nums">
                        Won {formatCurrency(p.prizeWon)}
                      </span>
                    ) : (
                      <span className="text-neutral-500 text-[11px]">{p.registeredAt}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-5 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-neutral-400">Entry: </span>
            <span className="font-mono font-bold text-white tabular-nums">
              {formatCurrency(tournament.entryFee)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              Close
            </button>

            {isUserJoined ? (
              <button
                onClick={() => {
                  onClose();
                  onViewRoomClick(tournament);
                }}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-500 text-neutral-950 hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>View Room Credentials</span>
              </button>
            ) : tournament.status !== 'completed' && tournament.joinedSlots < tournament.totalSlots ? (
              <button
                onClick={() => {
                  onClose();
                  if (!profile.isLoggedIn) {
                    setShowUserAuthModal(true);
                  } else {
                    onJoinClick(tournament);
                  }
                }}
                className="px-5 py-2.5 text-xs font-black uppercase rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-sm"
              >
                Join Match Now
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
