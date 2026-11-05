export type GameMode = 'BR' | 'CS' | 'LONE_WOLF';

export type MatchFormat = 'Solo' | 'Duo' | 'Squad' | '1v1' | '2v2' | '4v4';

export type TournamentStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface PrizeTier {
  rank: string;
  amount: number;
}

export interface Participant {
  id: string;
  teamName: string;
  playerIgn: string; // In-Game Name
  playerUid: string; // Free Fire UID
  phone: string;
  teammates?: { ign: string; uid: string }[];
  registeredAt: string;
  paymentMethod: 'wallet' | 'upi';
  slotNumber: number;
  kills?: number;
  rank?: number;
  prizeWon?: number;
}

export interface Tournament {
  id: string;
  title: string;
  gameMode: GameMode;
  format: MatchFormat;
  map: string;
  image: string; // URL or Base64 data URL
  subtitle?: string;
  description?: string; // Rich match flow: "Pehle 2 BR matches honge... top 4 select honge CS ke liye..."
  entryFee: number; // in INR
  entryFeeLabel?: string; // Custom label: e.g. "Entry Fee", "Per Squad", etc.
  prizePool: number;
  prizePoolLabel?: string; // Custom label: e.g. "Total Prize Pool", "First: ₹100, Second: ₹50", etc.
  perKill: number;
  perKillLabel?: string; // Custom label: e.g. "Per Kill", "Kill Point", "Bounty", etc.
  showPerKill?: boolean; // Can be toggled off if tournament has no per-kill bounty
  totalSlots: number;
  totalSlotsLabel?: string; // Custom label: e.g. "Slots", "Total Squads", "Players"
  joinedSlots: number;
  startTime: string; // e.g. "7 Nov, 02:00 PM IST"
  startTimestamp: number;
  status: TournamentStatus;
  version: string;
  roomId?: string;
  roomPassword?: string;
  roomReleaseMinutesBefore?: number;
  prizes: PrizeTier[];
  rules: string[];
  participants: Participant[];
  winnerAnnounced?: boolean;
  winnerTeam?: string;
  isFeatured?: boolean;
  specialBadge?: string;
  diwaliFormat?: {
    brMatches: number;
    booyahPoints: number;
    secondPoints: number;
    thirdPoints: number;
    killPoints: number;
    csSemifinal1: string;
    csSemifinal2: string;
    csFinal: string;
  };
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'entry_fee' | 'prize_winnings' | 'withdrawal' | 'refund';
  amount: number;
  status: 'completed' | 'pending' | 'rejected';
  timestamp: string;
  title: string;
  refId?: string;
}

export interface DepositRequest {
  id: string;
  userName: string;
  userPhone: string;
  userUid: string;
  amount: number;
  utrNumber: string;
  upiApp: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userName: string;
  userPhone: string;
  upiId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

export type FFRank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Heroic' | 'Master' | 'Grandmaster';
export type PlayerRole = 'Rusher' | 'Sniper' | 'IGL' | 'Support' | 'Assaulter' | 'All-Rounder';
export type DeviceType = 'Mobile' | 'Tablet' | 'Emulator / PC';

export type UserActiveTab = 'tournaments' | 'my-matches' | 'wallet' | 'leaderboard' | 'rules' | 'profile';

export interface PlayerProfile {
  id?: string;
  name: string;
  ign: string;
  uid: string;
  phone: string;
  email: string;
  avatarSeed: string;
  avatarUrl?: string;
  rank?: FFRank;
  role?: PlayerRole;
  level?: number;
  device?: DeviceType;
  bio?: string;
  walletBalance?: number;
  totalMatches?: number;
  totalWins?: number;
  totalKills?: number;
  totalEarnings?: number;
  isVerified?: boolean;
  password?: string;
  isLoggedIn?: boolean;
  createdAt?: string;
}
