import React from 'react';
import { LEADERBOARD_DATA } from '../../data/initialData';
import { formatCurrency } from '../../utils/helpers';
import { Trophy, Crown, Flame, Award, Crosshair } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Crown className="w-3.5 h-3.5" />
          <span>NM Esports Hall of Fame</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          TOP FREE FIRE CHAMPIONS
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Monthly tournament standings, total prize earnings, and KD statistics.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* 2nd place */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 text-center flex flex-col justify-between order-2 sm:order-1 sm:translate-y-4">
          <div>
            <div className="w-10 h-10 rounded-full bg-neutral-800 text-neutral-300 font-black text-sm flex items-center justify-center mx-auto mb-2 border border-neutral-700">
              #2
            </div>
            <div className="font-bold text-white text-base">{LEADERBOARD_DATA[1].ign}</div>
            <div className="text-xs text-neutral-400 font-mono">UID: {LEADERBOARD_DATA[1].uid}</div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-800 space-y-1">
            <div className="text-xs text-neutral-400">Total Winnings</div>
            <div className="text-lg font-black text-amber-400 font-mono tabular-nums">
              {formatCurrency(LEADERBOARD_DATA[1].earnings)}
            </div>
            <div className="text-[11px] text-neutral-400">
              {LEADERBOARD_DATA[1].wins} Wins · {LEADERBOARD_DATA[1].kills} Kills
            </div>
          </div>
        </div>

        {/* 1st place champion */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 to-neutral-900 border border-amber-500/50 text-center flex flex-col justify-between order-1 sm:order-2 shadow-xl shadow-amber-500/5">
          <div>
            <div className="w-12 h-12 rounded-full bg-amber-500 text-neutral-950 font-black text-base flex items-center justify-center mx-auto mb-2 shadow-lg shadow-amber-500/30">
              <Crown className="w-6 h-6" />
            </div>
            <div className="font-black text-white text-lg tracking-tight">{LEADERBOARD_DATA[0].ign}</div>
            <div className="text-xs text-amber-400/80 font-mono">UID: {LEADERBOARD_DATA[0].uid}</div>
          </div>
          <div className="mt-4 pt-4 border-t border-amber-500/20 space-y-1">
            <div className="text-xs text-neutral-300 font-medium">Champion Winnings</div>
            <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
              {formatCurrency(LEADERBOARD_DATA[0].earnings)}
            </div>
            <div className="text-xs text-neutral-300 font-medium">
              {LEADERBOARD_DATA[0].wins} Wins · {LEADERBOARD_DATA[0].kills} Kills · {LEADERBOARD_DATA[0].winRate} WR
            </div>
          </div>
        </div>

        {/* 3rd place */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 text-center flex flex-col justify-between order-3 sm:translate-y-6">
          <div>
            <div className="w-10 h-10 rounded-full bg-neutral-800 text-orange-300 font-black text-sm flex items-center justify-center mx-auto mb-2 border border-neutral-700">
              #3
            </div>
            <div className="font-bold text-white text-base">{LEADERBOARD_DATA[2].ign}</div>
            <div className="text-xs text-neutral-400 font-mono">UID: {LEADERBOARD_DATA[2].uid}</div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-800 space-y-1">
            <div className="text-xs text-neutral-400">Total Winnings</div>
            <div className="text-lg font-black text-amber-400 font-mono tabular-nums">
              {formatCurrency(LEADERBOARD_DATA[2].earnings)}
            </div>
            <div className="text-[11px] text-neutral-400">
              {LEADERBOARD_DATA[2].wins} Wins · {LEADERBOARD_DATA[2].kills} Kills
            </div>
          </div>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>All Season Standings</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Rank</th>
                <th className="pb-3">Player IGN / UID</th>
                <th className="pb-3 text-right">Booyahs</th>
                <th className="pb-3 text-right">Total Kills</th>
                <th className="pb-3 text-right">Win Rate</th>
                <th className="pb-3 pr-2 text-right">Total Cash Won</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {LEADERBOARD_DATA.map((player) => (
                <tr key={player.rank} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 pl-2 font-mono font-bold text-neutral-300">
                    #{player.rank}
                  </td>
                  <td className="py-3.5">
                    <div className="font-bold text-white text-sm">{player.ign}</div>
                    <div className="text-[11px] font-mono text-neutral-500">UID: {player.uid}</div>
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-neutral-200 tabular-nums">
                    {player.wins}
                  </td>
                  <td className="py-3.5 text-right font-mono text-neutral-300 tabular-nums">
                    {player.kills}
                  </td>
                  <td className="py-3.5 text-right font-mono text-neutral-400 tabular-nums">
                    {player.winRate}
                  </td>
                  <td className="py-3.5 pr-2 text-right font-mono font-black text-amber-400 text-sm tabular-nums">
                    {formatCurrency(player.earnings)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
