import React, { useState } from 'react';
import { Tournament } from '../../types';
import { useEsports } from '../../context/EsportsContext';
import { X, Copy, Check, Lock, AlertTriangle, ShieldCheck, Flame, ArrowRight } from 'lucide-react';

interface RoomCredentialsModalProps {
  tournament: Tournament | null;
  onClose: () => void;
}

export const RoomCredentialsModal: React.FC<RoomCredentialsModalProps> = ({ tournament, onClose }) => {
  const { profile } = useEsports();
  const [copiedField, setCopiedField] = useState<'id' | 'pass' | null>(null);

  if (!tournament) return null;

  const userParticipant = tournament.participants.find(
    (p) => p.playerUid === profile.uid || p.playerIgn.toLowerCase() === profile.ign.toLowerCase()
  );

  const copyToClipboard = (text: string, field: 'id' | 'pass') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const hasCredentials = Boolean(tournament.roomId && tournament.roomPassword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Official Room Credentials
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1">
                {tournament.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {userParticipant && (
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-neutral-400">Your Registered Slot</span>
                <div className="text-sm font-bold text-amber-400">
                  Slot #{userParticipant.slotNumber} · {userParticipant.teamName}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-neutral-400">In-Game Name (IGN)</span>
                <div className="text-xs font-mono font-bold text-neutral-200">{userParticipant.playerIgn}</div>
              </div>
            </div>
          )}

          {hasCredentials ? (
            <div className="space-y-3">
              {/* Room ID Box */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Free Fire Custom Room ID
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-wider tabular-nums">
                    {tournament.roomId}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(tournament.roomId || '', 'id')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
                >
                  {copiedField === 'id' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Room Password Box */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Room Password
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-wider">
                    {tournament.roomPassword}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(tournament.roomPassword || '', 'pass')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
                >
                  {copiedField === 'pass' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Pass</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 text-center space-y-2">
              <Lock className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
              <div className="text-sm font-bold text-white">Room Credentials Locked</div>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Room ID and Password will be posted right here 15 minutes before the match start time ({tournament.startTime}).
              </p>
            </div>
          )}

          {/* Quick joining instructions */}
          <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>How to Join in Free Fire:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-neutral-300">
              <li>Open Free Fire or Free Fire MAX on your mobile phone.</li>
              <li>Go to Mode Selection &rarr; Tap <strong className="text-white">Custom</strong> tab.</li>
              <li>Search Room ID <span className="font-mono text-amber-400 font-bold">{tournament.roomId || '---'}</span> & enter Password.</li>
              <li>Sit strictly in your assigned <strong className="text-white">Slot #{userParticipant?.slotNumber || 1}</strong>.</li>
            </ol>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Do not share room credentials with non-registered players. Spectators are strictly banned.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
