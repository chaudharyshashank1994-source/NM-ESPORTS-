import React from 'react';
import { Tournament } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { Trophy, Swords, Zap, Users, MapPin, Clock, Skull, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { useEsports } from '../../context/EsportsContext';

interface TournamentCardProps {
  tournament: Tournament;
  onJoinClick: (tournament: Tournament) => void;
  onViewRoomClick: (tournament: Tournament) => void;
  onViewDetailsClick: (tournament: Tournament) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onJoinClick,
  onViewRoomClick,
  onViewDetailsClick,
}) => {
  const { profile, setShowUserAuthModal } = useEsports();

  const isUserJoined = tournament.participants.some(
    (p) => p.playerUid === profile.uid || (profile.ign && p.playerIgn.toLowerCase() === profile.ign.toLowerCase())
  );

  const isFull = tournament.joinedSlots >= tournament.totalSlots;
  const progressPercent = Math.min(100, Math.round((tournament.joinedSlots / tournament.totalSlots) * 100));

  const getModeBadge = () => {
    switch (tournament.gameMode) {
      case 'BR':
        return (
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>BR {tournament.format}</span>
          </span>
        );
      case 'CS':
        return (
          <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
            <Swords className="w-3.5 h-3.5 text-blue-400" />
            <span>CS {tournament.format}</span>
          </span>
        );
      case 'LONE_WOLF':
        return (
          <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Lone Wolf {tournament.format}</span>
          </span>
        );
    }
  };

  return (
    <div
      className={`group relative rounded-2xl transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        tournament.isFeatured
          ? 'bg-gradient-to-b from-amber-950/40 via-neutral-900 to-neutral-900 border-2 border-amber-500/70 shadow-xl shadow-amber-500/10'
          : 'bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700'
      }`}
    >
      {/* Featured Banner Top Ribbon */}
      {tournament.specialBadge && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-neutral-950 px-4 py-1.5 text-xs font-black uppercase tracking-wider flex items-center justify-between shadow-md">
          <span className="flex items-center gap-1.5">
            <span>✨</span>
            <span>{tournament.specialBadge}</span>
          </span>
          {tournament.subtitle && (
            <span className="text-[11px] font-bold text-neutral-900 bg-white/20 px-2 py-0.5 rounded truncate max-w-[180px]">
              {tournament.subtitle}
            </span>
          )}
        </div>
      )}

      {/* Top Banner Image with status pill */}
      <div className="relative h-48 w-full overflow-hidden bg-neutral-950">
        <img
          src={tournament.image}
          alt={tournament.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

        {/* Status indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {tournament.status === 'live' ? (
            <span className="px-2.5 py-1 rounded-md text-xs font-black uppercase bg-red-600 text-white flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              LIVE MATCH
            </span>
          ) : tournament.status === 'completed' ? (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-neutral-800 text-neutral-300 border border-neutral-700">
              COMPLETED
            </span>
          ) : (
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase backdrop-blur-sm flex items-center gap-1.5 ${
                tournament.isFeatured
                  ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
                  : 'bg-neutral-900/90 text-amber-400 border border-neutral-700/80'
              }`}
            >
              <Clock className="w-3 h-3" />
              {tournament.startTime}
            </span>
          )}
        </div>

        {/* User registered badge */}
        {isUserJoined && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/90 text-neutral-950 flex items-center gap-1 shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>JOINED</span>
          </div>
        )}

        {/* Bottom meta strip on image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-neutral-300">
          <div className="flex items-center gap-2 bg-neutral-950/80 px-2.5 py-1 rounded-md backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-medium text-white">{tournament.map}</span>
          </div>
          <div className="bg-neutral-950/80 px-2.5 py-1 rounded-md backdrop-blur-sm">
            {getModeBadge()}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Subtitle */}
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-1 group-hover:text-amber-400 transition-colors line-clamp-1">
            {tournament.title}
          </h3>

          {tournament.subtitle && (
            <p className="text-xs text-amber-300 font-medium mb-2.5 line-clamp-1">
              {tournament.subtitle}
            </p>
          )}

          {/* Description snippet or version */}
          {tournament.description ? (
            <div className="p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-300 mb-4 line-clamp-2 leading-relaxed">
              ⚡ {tournament.description}
            </div>
          ) : (
            <div className="text-xs text-neutral-400 mb-4 flex items-center gap-2">
              <span>{tournament.version}</span>
              <span aria-hidden="true">·</span>
              <span>Room ID 15m prior</span>
            </div>
          )}

          {/* Key Metrics: Custom labels for Prize Pool, Per Kill, Entry Fee */}
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 mb-4 text-center">
            <div>
              <div className="text-[11px] font-medium text-neutral-400 truncate" title={tournament.prizePoolLabel || 'Prize Pool'}>
                {tournament.prizePoolLabel || 'Prize Pool'}
              </div>
              <div className="text-sm sm:text-base font-black text-amber-400 font-mono tabular-nums">
                {formatCurrency(tournament.prizePool)}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-medium text-neutral-400 truncate" title={tournament.perKillLabel || 'Per Kill'}>
                {tournament.perKillLabel || 'Per Kill'}
              </div>
              <div className="text-sm sm:text-base font-bold text-neutral-200 font-mono tabular-nums">
                {tournament.showPerKill === false ? (
                  <span className="text-neutral-500 text-xs">Off</span>
                ) : tournament.perKill > 0 ? (
                  tournament.perKill >= 5 ? formatCurrency(tournament.perKill) : `${tournament.perKill} Pt`
                ) : (
                  'N/A'
                )}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-medium text-neutral-400 truncate" title={tournament.entryFeeLabel || 'Entry Fee'}>
                {tournament.entryFeeLabel || 'Entry Fee'}
              </div>
              <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono tabular-nums">
                {tournament.entryFee === 0 ? 'FREE' : formatCurrency(tournament.entryFee)}
              </div>
            </div>
          </div>

          {/* Slot Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-neutral-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {tournament.totalSlotsLabel || 'Slots Filled'}
              </span>
              <span className="text-neutral-200 font-mono tabular-nums">
                {tournament.joinedSlots} / {tournament.totalSlots}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  progressPercent >= 90 ? 'bg-rose-500' : progressPercent >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions Row */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center gap-2">
          <button
            onClick={() => onViewDetailsClick(tournament)}
            className="px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Details
          </button>

          {isUserJoined ? (
            <button
              onClick={() => onViewRoomClick(tournament)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-500 text-neutral-950 hover:bg-emerald-400 transition-colors shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Room Credentials</span>
            </button>
          ) : tournament.status === 'completed' ? (
            <button
              onClick={() => onViewDetailsClick(tournament)}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>View Results</span>
            </button>
          ) : isFull ? (
            <button
              disabled
              className="flex-1 px-4 py-2.5 text-xs font-bold rounded-xl bg-neutral-800/70 text-neutral-500 cursor-not-allowed"
            >
              Housefull
            </button>
          ) : (
            <button
              onClick={() => {
                if (!profile.isLoggedIn) {
                  setShowUserAuthModal(true);
                } else {
                  onJoinClick(tournament);
                }
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-sm"
            >
              <span>Join Match</span>
              <span className="font-mono tabular-nums text-neutral-900 font-extrabold">
                {formatCurrency(tournament.entryFee)}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
