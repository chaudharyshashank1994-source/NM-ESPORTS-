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
  image: string;
  entryFee: number; // in INR
  prizePool: number;
  perKill: number;
  totalSlots: number;
  joinedSlots: number;
  startTime: string; // e.g. "Today, 08:30 PM"
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

export interface PlayerProfile {
  name: string;
  ign: string;
  uid: string;
  phone: string;
  email: string;
  avatarSeed: string;
}
