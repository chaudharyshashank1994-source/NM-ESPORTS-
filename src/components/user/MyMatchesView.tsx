import React from 'react';
import { useEsports } from '../../context/EsportsContext';
import { Tournament } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { Trophy, Swords, Zap, Lock, MapPin, Clock, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface MyMatchesViewProps {
  onViewRoom: (t: Tournament) => void;
  onBrowseTournaments: () => void;
}

export const MyMatchesView: React.FC<MyMatchesViewProps> = ({ onViewRoom, onBrowseTournaments }) => {
  const { tournaments, profile } = useEsports();

  // Filter tournaments where the user or their profile UID is present
  const myJoinedMatches = tournaments.filter((t) =>
    t.participants.some(
      (p) => p.playerUid === profile.uid || p.playerIgn.toLowerCase() === profile.ign.toLowerCase()
    )
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500" />
            <span>My Registered Matches</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Access your Free Fire custom room IDs, passwords, assigned slots, and match schedules.
          </p>
        </div>

        <button
          onClick={onBrowseTournaments}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white hover:border-amber-500/50 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Explore More Tournaments</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {myJoinedMatches.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <div className="text-base font-bold text-white">No Tournaments Joined Yet</div>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              You haven&apos;t registered for any Free Fire scrims or matches. Browse available BR, CS, or Lone Wolf matches to claim your slot!
            </p>
          </div>
          <button
            onClick={onBrowseTournaments}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Join A Tournament
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myJoinedMatches.map((tourney) => {
            const userParticipant = tourney.participants.find(
              (p) => p.playerUid === profile.uid || p.playerIgn.toLowerCase() === profile.ign.toLowerCase()
            );

            return (
              <div
                key={tourney.id}
                className="p-5 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-neutral-800 bg-neutral-950">
                    <img
                      src={tourney.image}
                      alt={tourney.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                      <span className="text-amber-400 font-bold uppercase">{tourney.gameMode} · {tourney.format}</span>
                      <span className="text-neutral-500">·</span>
                      <span className="text-neutral-400">{tourney.map}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {tourney.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-2">
                      <span className="flex items-center gap-1 text-white">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {tourney.startTime}
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">
                        Prize: {formatCurrency(tourney.prizePool)}
                      </span>
                      {userParticipant && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
                          Your Slot #{userParticipant.slotNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  <button
                    onClick={() => onViewRoom(tourney)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-colors shadow-sm"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>View Room Credentials</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
