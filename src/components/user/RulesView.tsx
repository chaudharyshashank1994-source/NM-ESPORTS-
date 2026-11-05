import React from 'react';
import { Shield, ShieldAlert, Zap, HelpCircle, CheckCircle, MessageSquare, AlertTriangle, Video, Ban, WifiOff } from 'lucide-react';

export const RulesView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <Shield className="w-7 h-7 text-amber-500" />
          <span>Official Esports Rulebook & Fair Play</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          NM ESPORTS strictly follows the Free Fire Official Esports Championship (FFWS) competitive guidelines. All matches are monitored live by spectator referees.
        </p>
      </div>

      {/* Highlight Card: 30-Minute Prize Disbursal & Anti-Cheat */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-neutral-900 border border-amber-500/40 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Zap className="w-5 h-5" />
          <span>30-Minute Prize Disbursal Protocol</span>
        </div>
        <p className="text-xs text-neutral-200 leading-relaxed">
          Following match completion, referee admins conduct an anti-cheat verification, kill log cross-check, and screenshot audit. <strong className="text-amber-400">All prizes are credited directly to winners&apos; NM Wallet within 30 minutes</strong>. Withdrawals to UPI (PhonePe, Google Pay, Paytm) are processed within 10 to 30 minutes thereafter.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Anti-cheat & Hacking Ban */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
            <Ban className="w-5 h-5 shrink-0" />
            <span>Zero Tolerance Anti-Cheat & Hacking Policy</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Use of any third-party scripts, APK mods, auto-headshot configs, aimbots, wallhacks, antenna hacks, speed hacks, magic bullets, or memory injectors is strictly detected and punished with an <strong className="text-rose-400">immediate permanent ban, device IP block, and forfeiture of all tournament winnings and wallet balance</strong>.
          </p>
        </div>

        {/* Strict Mobile-Only / Emulator Ban */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>Strict Mobile-Only (PC & Emulator Banned)</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Only genuine Android and iOS mobile devices are permitted. Playing on BlueStacks, LDPlayer, MEmu, Nox, Gameloop, PC triggers, or mouse/keyboard keyboard mappers is strictly forbidden. The custom room spectator admin will kick and blacklist emulator users on sight.
          </p>
        </div>

        {/* Teaming & Match-Fixing */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Teaming Up & Match-Fixing Prohibited</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Teaming with opponents in Solo, Duo, or Squad matches to farm kills or placement is strictly forbidden. If two rival squads intentionally avoid fighting or cooperate against other players, both squads will be immediately disqualified with zero points.
          </p>
        </div>

        {/* Bug & Glitch Exploitation */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Bug, Texture & Glitch Exploitation</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Using Gloo Wall glitches to enter closed rocks, factory roofs without normal access, underground textures, or out-of-zone infinite medkit healing outside zone 4 will lead to team disqualification.
          </p>
        </div>

        {/* Network & Disconnection Rules */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2.5 text-blue-400 font-bold text-sm">
            <WifiOff className="w-5 h-5 shrink-0" />
            <span>Player Disconnection & Ping Issues</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Ensure high-speed stable 4G/5G/Wi-Fi connection before joining. If an individual player experiences high ping, 999+ ms, or device crash, <strong className="text-white">no rematch or restart will be provided</strong>. Rematches are ONLY organized if the official Garena Free Fire server crashes for all 48 players.
          </p>
        </div>

        {/* Mandatory POV Recording & Screenshots */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
            <Video className="w-5 h-5 shrink-0" />
            <span>POV Screen-Recording & Screenshot Proof</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            All winning players and Top 3 squads must take a clear screenshot of the end-game Booyah / kill summary screen. In case of any dispute or hack allegations, players must submit their POV screen-recording to the referee team within 15 minutes of match completion.
          </p>
        </div>
      </div>

      {/* Support & Community Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <span>Report a Hacker or Match Dispute</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-md">
            Our 24x7 referee committee is available on WhatsApp and Telegram. Submit match screenshot, opponent Free Fire UID, and video timestamp for immediate review.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <a
            href="https://whatsapp.com/channel/0029VbDxPZ23rZZVZ1LydS3z"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.96.523 1.838.796 2.791.796h.005c3.18 0 5.767-2.586 5.767-5.766.001-3.182-2.585-5.782-5.772-5.782zm0-1.84c4.195 0 7.604 3.409 7.605 7.606 0 4.197-3.41 7.607-7.605 7.607-1.282 0-2.527-.323-3.626-.935L4.05 20.003l1.402-4.227C4.78 14.65 4.425 13.38 4.425 11.938c.001-4.197 3.411-7.606 7.606-7.606z" />
            </svg>
            <span>Official WhatsApp Channel</span>
          </a>
          <a
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <span>Official Telegram</span>
          </a>
        </div>
      </div>
    </div>
  );
};
