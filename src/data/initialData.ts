import { Tournament, WalletTransaction, DepositRequest, WithdrawalRequest, PlayerProfile } from '../types';

export const INITIAL_PLAYER_PROFILE: PlayerProfile = {
  name: '',
  ign: '',
  uid: '',
  phone: '',
  email: '',
  avatarSeed: 'ALOK',
  rank: 'Heroic',
  role: 'Rusher',
  level: 1,
  device: 'Mobile',
  bio: 'Free Fire Esports Contender',
  totalMatches: 0,
  totalWins: 0,
  totalKills: 0,
  totalEarnings: 0,
  walletBalance: 0,
  isVerified: false,
  isLoggedIn: false,
  createdAt: new Date().toISOString(),
};

// Admin requested a completely clean slate with 0 demo tournaments
// All tournaments will now be created dynamically by Admin
export const INITIAL_TOURNAMENTS: Tournament[] = [];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [];

export const INITIAL_DEPOSIT_REQUESTS: DepositRequest[] = [];

export const INITIAL_WITHDRAWAL_REQUESTS: WithdrawalRequest[] = [];

export const LEADERBOARD_DATA = [
  { rank: 1, name: 'NM_THUNDER_99', ign: 'NM_THUNDER_99', uid: '2847193021', wins: 48, kills: 342, earnings: 4250, winRate: '68%' },
  { rank: 2, name: 'VORTEX_Falcon', ign: 'VTX_Falcon', uid: '9482019384', wins: 42, kills: 310, earnings: 3800, winRate: '64%' },
  { rank: 3, name: 'GOD_Jonathan', ign: 'GOD_Jonathan', uid: '2093847192', wins: 39, kills: 388, earnings: 3600, winRate: '61%' },
  { rank: 4, name: 'SOUL_Mortal', ign: 'SOUL_Mortal', uid: '1827461942', wins: 36, kills: 275, earnings: 3100, winRate: '59%' },
  { rank: 5, name: 'Shadow_Ninja', ign: 'SHD_Ninja', uid: '6483920184', wins: 29, kills: 220, earnings: 2450, winRate: '54%' },
  { rank: 6, name: 'HeadshotKing_99', ign: 'HeadshotKing_99', uid: '8472910382', wins: 27, kills: 205, earnings: 2100, winRate: '52%' },
];

export const BANNER_PRESETS = [
  { id: 'br', name: 'Battle Royale Bermuda', url: '/src/assets/images/mode_battle_royale_1793724376096.jpg' },
  { id: 'cs', name: 'Clash Squad 4v4', url: '/src/assets/images/mode_clash_squad_1793724376584.jpg' },
  { id: 'lw', name: 'Lone Wolf Iron Cage', url: '/src/assets/images/mode_lone_wolf_1793724376557.jpg' },
  { id: 'diwali', name: 'Diwali Dhamaka FF', url: '/src/assets/images/diwali_dhamaka_ff_1793765585100.jpg' },
  { id: 'hero', name: 'Esports Championship Action', url: '/src/assets/images/hero_banner_freefire_1793724376618.jpg' },
];
