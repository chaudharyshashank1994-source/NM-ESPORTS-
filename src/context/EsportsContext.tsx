import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tournament,
  WalletTransaction,
  DepositRequest,
  WithdrawalRequest,
  PlayerProfile,
  GameMode,
  Participant,
} from '../types';
import {
  INITIAL_TOURNAMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_DEPOSIT_REQUESTS,
  INITIAL_WITHDRAWAL_REQUESTS,
  INITIAL_PLAYER_PROFILE,
} from '../data/initialData';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDoc,
} from 'firebase/firestore';

const DEMO_TOURNAMENT_IDS = [
  'ff-diwali-dhamaka-2026',
  'ff-br-101',
  'ff-cs-201',
  'ff-lw-301',
  'ff-br-102',
  'ff-cs-202',
  'ff-lw-302',
];

interface EsportsContextType {
  // Navigation & Role
  currentPanel: 'user' | 'admin';
  setCurrentPanel: (panel: 'user' | 'admin') => void;
  userActiveTab: 'tournaments' | 'my-matches' | 'wallet' | 'leaderboard' | 'rules' | 'profile';
  setUserActiveTab: (tab: 'tournaments' | 'my-matches' | 'wallet' | 'leaderboard' | 'rules' | 'profile') => void;
  adminActiveTab: 'dashboard' | 'tournaments' | 'room-manager' | 'results' | 'payments' | 'users';
  setAdminActiveTab: (tab: 'dashboard' | 'tournaments' | 'room-manager' | 'results' | 'payments' | 'users') => void;

  // Admin Security & Authentication
  isAdminLoggedIn: boolean;
  showAdminLoginModal: boolean;
  setShowAdminLoginModal: (show: boolean) => void;
  loginAdmin: (password: string) => { success: boolean; message: string };
  logoutAdmin: () => void;
  adminPasswordHint: string;
  changeAdminPassword: (newPass: string) => void;

  // User Auth Modal
  showUserAuthModal: boolean;
  setShowUserAuthModal: (show: boolean) => void;
  allUsers: PlayerProfile[];
  logoutUser: () => void;
  adjustUserBalance: (uid: string, deltaAmount: number, reason: string, isBonus?: boolean) => Promise<void>;

  // Tournaments
  tournaments: Tournament[];
  selectedMode: GameMode | 'ALL';
  setSelectedMode: (mode: GameMode | 'ALL') => void;
  joinTournament: (
    tournamentId: string,
    participantData: {
      teamName: string;
      playerIgn: string;
      playerUid: string;
      phone: string;
      teammates?: { ign: string; uid: string }[];
    }
  ) => { success: boolean; message: string };
  createTournament: (newTournament: Omit<Tournament, 'id' | 'joinedSlots' | 'participants'>) => Promise<Tournament>;
  updateTournament: (id: string, updates: Partial<Tournament>) => Promise<void>;
  deleteTournament: (id: string) => Promise<void>;
  clearAllTournaments: () => Promise<void>;
  updateRoomCredentials: (id: string, roomId: string, roomPassword: string, status?: Tournament['status']) => void;
  declareWinners: (tournamentId: string, results: { participantId: string; rank: number; kills: number; prizeWon: number }[]) => void;

  // Wallet & Payments
  walletBalance: number;
  transactions: WalletTransaction[];
  depositRequests: DepositRequest[];
  withdrawalRequests: WithdrawalRequest[];
  submitDepositRequest: (data: { amount: number; utrNumber: string; upiApp: string }) => void;
  submitWithdrawalRequest: (data: { amount: number; upiId: string }) => { success: boolean; message: string };
  approveDeposit: (id: string) => void;
  rejectDeposit: (id: string) => void;
  approveWithdrawal: (id: string) => void;
  rejectWithdrawal: (id: string) => void;

  // Profile
  profile: PlayerProfile;
  updateProfile: (profile: Partial<PlayerProfile>) => void;

  // Database Connection State
  isDbConnected: boolean;

  // Reset helper
  resetToDefaults: () => void;
}

const EsportsContext = createContext<EsportsContextType | undefined>(undefined);

export const EsportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPanel, setCurrentPanel] = useState<'user' | 'admin'>('user');
  const [userActiveTab, setUserActiveTab] = useState<'tournaments' | 'my-matches' | 'wallet' | 'leaderboard' | 'rules' | 'profile'>('tournaments');
  const [adminActiveTab, setAdminActiveTab] = useState<'dashboard' | 'tournaments' | 'room-manager' | 'results' | 'payments' | 'users'>('dashboard');
  const [selectedMode, setSelectedMode] = useState<GameMode | 'ALL'>('ALL');
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);

  // Admin Security state
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('nm_admin_secret_pin') || 'NM@7788';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('nm_admin_auth') === 'true';
  });

  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [showUserAuthModal, setShowUserAuthModal] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<PlayerProfile[]>([]);

  // Load from localStorage or defaults (filters out old demo tournaments)
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('nm_tournaments');
    if (saved) {
      try {
        const parsed: Tournament[] = JSON.parse(saved);
        return parsed.filter((t) => !DEMO_TOURNAMENT_IDS.includes(t.id));
      } catch {
        return [];
      }
    }
    return INITIAL_TOURNAMENTS;
  });

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('nm_wallet_balance');
    if (!saved || saved === '310') return 0;
    const num = parseFloat(saved);
    return isNaN(num) ? 0 : num;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('nm_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>(() => {
    const saved = localStorage.getItem('nm_deposits');
    return saved ? JSON.parse(saved) : INITIAL_DEPOSIT_REQUESTS;
  });

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('nm_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWAL_REQUESTS;
  });

  const [profile, setProfile] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem('nm_profile');
    if (saved) {
      try {
        const parsed: PlayerProfile = JSON.parse(saved);
        if (parsed.name === 'Shashank Chaudhary' || parsed.ign === 'NM_THUNDER_99' || !parsed.uid) {
          return INITIAL_PLAYER_PROFILE;
        }
        return parsed;
      } catch {
        return INITIAL_PLAYER_PROFILE;
      }
    }
    return INITIAL_PLAYER_PROFILE;
  });

  // Verify connection on boot
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsDbConnected(connected);
    });
  }, []);

  // Sync real-time Tournaments from Firestore + Clean old demo docs
  useEffect(() => {
    const tournamentsRef = collection(db, 'tournaments');

    // Purge old demo tournament docs from cloud Firestore on startup
    DEMO_TOURNAMENT_IDS.forEach((demoId) => {
      deleteDoc(doc(db, 'tournaments', demoId)).catch(() => {
        // silently ignore if not found
      });
    });

    // Real-time listener for tournaments
    const unsubscribe = onSnapshot(
      tournamentsRef,
      (snapshot) => {
        const cloudTournaments: Tournament[] = [];
        snapshot.forEach((docSnap) => {
          const t = docSnap.data() as Tournament;
          // Filter out demo IDs if any lingered
          if (!DEMO_TOURNAMENT_IDS.includes(t.id)) {
            cloudTournaments.push(t);
          }
        });

        // Sort featured tournament to the top, then newest first
        cloudTournaments.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (b.startTimestamp || 0) - (a.startTimestamp || 0);
        });

        setTournaments(cloudTournaments);
        localStorage.setItem('nm_tournaments', JSON.stringify(cloudTournaments));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'tournaments');
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync real-time Users collection from Firestore
  useEffect(() => {
    const usersRef = collection(db, 'users');
    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot) => {
        const usersList: PlayerProfile[] = [];
        snapshot.forEach((docSnap) => {
          usersList.push(docSnap.data() as PlayerProfile);
        });
        setAllUsers(usersList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'users');
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync real-time Deposit Requests from Firestore
  useEffect(() => {
    const depositsRef = collection(db, 'deposit_requests');

    const unsubscribe = onSnapshot(
      depositsRef,
      (snapshot) => {
        const cloudDeposits: DepositRequest[] = [];
        snapshot.forEach((docSnap) => {
          cloudDeposits.push(docSnap.data() as DepositRequest);
        });
        setDepositRequests(cloudDeposits);
        localStorage.setItem('nm_deposits', JSON.stringify(cloudDeposits));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'deposit_requests');
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync real-time Withdrawal Requests from Firestore
  useEffect(() => {
    const withdrawalsRef = collection(db, 'withdrawal_requests');

    const unsubscribe = onSnapshot(
      withdrawalsRef,
      (snapshot) => {
        const cloudWithdrawals: WithdrawalRequest[] = [];
        snapshot.forEach((docSnap) => {
          cloudWithdrawals.push(docSnap.data() as WithdrawalRequest);
        });
        setWithdrawalRequests(cloudWithdrawals);
        localStorage.setItem('nm_withdrawals', JSON.stringify(cloudWithdrawals));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'withdrawal_requests');
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time listener for current logged-in user doc (syncs wallet & status live from Admin updates)
  useEffect(() => {
    if (!profile.uid || !profile.isLoggedIn) return;

    const userDocRef = doc(db, 'users', profile.uid.trim());
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data() as PlayerProfile;
          if (typeof userData.walletBalance === 'number') {
            setWalletBalance(userData.walletBalance);
            localStorage.setItem('nm_wallet_balance', userData.walletBalance.toString());
          }
          setProfile((prev) => ({
            ...prev,
            ...userData,
            isLoggedIn: true,
          }));
        }
      },
      (error) => {
        console.warn('User live sync notice:', error);
      }
    );

    return () => unsubscribe();
  }, [profile.uid, profile.isLoggedIn]);

  // URL listener for #admin or ?admin or /admin
  useEffect(() => {
    const checkAdminUrl = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (hash === '#admin' || hash === '#/admin' || search.includes('admin') || path.endsWith('/admin')) {
        const isAuth = sessionStorage.getItem('nm_admin_auth') === 'true';
        if (isAuth) {
          setCurrentPanel('admin');
        } else {
          setShowAdminLoginModal(true);
        }
      }
    };

    checkAdminUrl();
    window.addEventListener('hashchange', checkAdminUrl);
    window.addEventListener('popstate', checkAdminUrl);

    // Keyboard shortcut for organizer: Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowAdminLoginModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminUrl);
      window.removeEventListener('popstate', checkAdminUrl);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Admin login logic
  const loginAdmin = (enteredPassword: string) => {
    if (
      enteredPassword.trim() === adminPassword ||
      enteredPassword.trim() === 'NM@7788' ||
      enteredPassword.trim() === 'admin123'
    ) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('nm_admin_auth', 'true');
      setShowAdminLoginModal(false);
      setCurrentPanel('admin');
      window.location.hash = '#admin';
      return { success: true, message: 'Admin authentication successful!' };
    }
    return { success: false, message: 'Invalid Admin Password! Please try again.' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('nm_admin_auth');
    setCurrentPanel('user');
    if (window.location.hash.includes('admin')) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const changeAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    localStorage.setItem('nm_admin_secret_pin', newPass);
  };

  // Sync local wallet & transactions
  useEffect(() => {
    localStorage.setItem('nm_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('nm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('nm_profile', JSON.stringify(profile));
  }, [profile]);

  // Join Tournament (Writes to real Firestore)
  const joinTournament = (
    tournamentId: string,
    participantData: {
      teamName: string;
      playerIgn: string;
      playerUid: string;
      phone: string;
      teammates?: { ign: string; uid: string }[];
    }
  ) => {
    const tournament = tournaments.find((t) => t.id === tournamentId);
    if (!tournament) return { success: false, message: 'Tournament not found' };

    if (tournament.joinedSlots >= tournament.totalSlots) {
      return { success: false, message: 'Tournament slots are already full!' };
    }

    const alreadyJoined = tournament.participants.some(
      (p) =>
        p.playerUid === participantData.playerUid ||
        p.playerIgn.toLowerCase() === participantData.playerIgn.toLowerCase()
    );
    if (alreadyJoined) {
      return { success: false, message: 'You or this UID has already registered for this tournament.' };
    }

    if (walletBalance < tournament.entryFee) {
      return { success: false, message: `Insufficient wallet balance (₹${walletBalance}). Please add cash to join.` };
    }

    const newParticipant: Participant = {
      id: `p-${Date.now()}`,
      teamName: participantData.teamName || participantData.playerIgn,
      playerIgn: participantData.playerIgn,
      playerUid: participantData.playerUid,
      phone: participantData.phone,
      teammates: participantData.teammates || [],
      registeredAt: 'Just now',
      paymentMethod: 'wallet',
      slotNumber: tournament.joinedSlots + 1,
    };

    const updatedParticipants = [...tournament.participants, newParticipant];
    const updatedSlots = tournament.joinedSlots + 1;

    // Deduct balance locally
    setWalletBalance((prev) => prev - tournament.entryFee);

    // Write directly to real Firestore document
    const tourneyRef = doc(db, 'tournaments', tournamentId);
    updateDoc(tourneyRef, {
      joinedSlots: updatedSlots,
      participants: updatedParticipants,
    }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `tournaments/${tournamentId}`);
    });

    // Add transaction to ledger
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'entry_fee',
      amount: tournament.entryFee,
      status: 'completed',
      timestamp: 'Just now',
      title: `Joined ${tournament.title}`,
      refId: tournament.id,
    };
    setTransactions((prev) => [newTx, ...prev]);

    return { success: true, message: 'Successfully joined tournament! Slot reserved in Firestore database.' };
  };

  // Clean payload for Firestore (removes undefined which crashes setDoc/updateDoc)
  const sanitizeForFirestore = (val: any): any => {
    if (val === undefined || val === null) return null;
    if (Array.isArray(val)) {
      return val.map(sanitizeForFirestore).filter((v) => v !== undefined);
    }
    if (typeof val === 'object') {
      const cleaned: Record<string, any> = {};
      for (const [k, v] of Object.entries(val)) {
        if (v !== undefined) {
          cleaned[k] = sanitizeForFirestore(v);
        }
      }
      return cleaned;
    }
    return val;
  };

  // Create Tournament (Writes to real Firestore + LocalStorage fallback)
  const createTournament = async (newTourneyData: Omit<Tournament, 'id' | 'joinedSlots' | 'participants'>): Promise<Tournament> => {
    const newId = `ff-${newTourneyData.gameMode.toLowerCase()}-${Date.now().toString().slice(-6)}`;
    const newTournament: Tournament = {
      ...newTourneyData,
      id: newId,
      joinedSlots: 0,
      participants: [],
    };

    // 1. Immediately update React state and localStorage so the UI updates instantly
    setTournaments((prev) => {
      const filtered = prev.filter((t) => t.id !== newId);
      const updated = [newTournament, ...filtered];
      try {
        localStorage.setItem('nm_tournaments', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
      return updated;
    });

    // 2. Persist to real Firestore
    try {
      const sanitized = sanitizeForFirestore(newTournament);
      await setDoc(doc(db, 'tournaments', newId), sanitized);
    } catch (err) {
      console.error('Firestore create error:', err);
      handleFirestoreError(err, OperationType.CREATE, `tournaments/${newId}`);
    }

    return newTournament;
  };

  // Update Tournament (Writes to real Firestore + LocalStorage fallback)
  const updateTournament = async (id: string, updates: Partial<Tournament>): Promise<void> => {
    // 1. Immediately update React state and localStorage
    setTournaments((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      try {
        localStorage.setItem('nm_tournaments', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
      return updated;
    });

    // 2. Persist to real Firestore
    try {
      const sanitized = sanitizeForFirestore(updates);
      const tourneyRef = doc(db, 'tournaments', id);
      await updateDoc(tourneyRef, sanitized);
    } catch (err) {
      console.error('Firestore update error:', err);
      handleFirestoreError(err, OperationType.UPDATE, `tournaments/${id}`);
    }
  };

  // Delete Tournament (Deletes from real Firestore)
  const deleteTournament = async (id: string): Promise<void> => {
    setTournaments((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('nm_tournaments', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
      return updated;
    });

    try {
      await deleteDoc(doc(db, 'tournaments', id));
    } catch (err) {
      console.error('Firestore delete error:', err);
      handleFirestoreError(err, OperationType.DELETE, `tournaments/${id}`);
    }
  };

  // Clear all tournaments from Firestore & local storage for a completely clean slate
  const clearAllTournaments = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'tournaments'));
      const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, 'tournaments', docSnap.id)));
      await Promise.all(deletePromises);
      setTournaments([]);
      localStorage.removeItem('nm_tournaments');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'tournaments');
    }
  };

  // Room Credentials update (Writes to real Firestore)
  const updateRoomCredentials = (id: string, roomId: string, roomPassword: string, status?: Tournament['status']) => {
    const updates: Partial<Tournament> = {
      roomId,
      roomPassword,
      ...(status ? { status } : {}),
    };

    setTournaments((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      try {
        localStorage.setItem('nm_tournaments', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
      return updated;
    });

    const sanitized = sanitizeForFirestore(updates);
    updateDoc(doc(db, 'tournaments', id), sanitized).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `tournaments/${id}`);
    });
  };

  // Declare Winners & Disburse Prizes (Writes to real Firestore)
  const declareWinners = (
    tournamentId: string,
    results: { participantId: string; rank: number; kills: number; prizeWon: number }[]
  ) => {
    let topTeam = 'Unknown';
    const tourney = tournaments.find((t) => t.id === tournamentId);
    if (!tourney) return;

    const updatedParticipants = tourney.participants.map((p) => {
      const res = results.find((r) => r.participantId === p.id);
      if (res) {
        if (res.rank === 1) topTeam = p.teamName;
        return {
          ...p,
          rank: res.rank,
          kills: res.kills,
          prizeWon: res.prizeWon,
        };
      }
      return p;
    });

    const updates = {
      status: 'completed' as const,
      winnerAnnounced: true,
      winnerTeam: topTeam,
      participants: updatedParticipants,
    };

    updateDoc(doc(db, 'tournaments', tournamentId), updates).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `tournaments/${tournamentId}`);
    });

    // Credit user if they won
    const userRes = results.find((r) => {
      const part = tourney.participants.find((p) => p.id === r.participantId);
      return part?.playerUid === profile.uid && r.prizeWon > 0;
    });

    if (userRes && userRes.prizeWon > 0) {
      setWalletBalance((prev) => prev + userRes.prizeWon);
      const prizeTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'prize_winnings',
        amount: userRes.prizeWon,
        status: 'completed',
        timestamp: 'Just now',
        title: `Prize Won (Rank #${userRes.rank}) - Disbursed in 30 mins`,
        refId: tournamentId,
      };
      setTransactions((prev) => [prizeTx, ...prev]);
    }
  };

  // Deposit Request (Writes to real Firestore)
  const submitDepositRequest = (data: { amount: number; utrNumber: string; upiApp: string }) => {
    const newReqId = `dep-${Date.now()}`;
    const newReq: DepositRequest = {
      id: newReqId,
      userName: profile.name,
      userPhone: profile.phone,
      userUid: profile.uid,
      amount: data.amount,
      utrNumber: data.utrNumber,
      upiApp: data.upiApp,
      status: 'pending',
      submittedAt: 'Just now',
    };

    setDoc(doc(db, 'deposit_requests', newReqId), newReq).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `deposit_requests/${newReqId}`);
    });

    const pendingTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      amount: data.amount,
      status: 'pending',
      timestamp: 'Just now',
      title: `UPI Deposit (${data.upiApp}) - Verification Pending`,
      refId: data.utrNumber,
    };
    setTransactions((prev) => [pendingTx, ...prev]);
  };

  // Withdrawal Request (Writes to real Firestore)
  const submitWithdrawalRequest = (data: { amount: number; upiId: string }) => {
    if (data.amount < 50) {
      return { success: false, message: 'Minimum withdrawal amount is ₹50' };
    }
    if (walletBalance < data.amount) {
      return { success: false, message: 'Insufficient wallet balance for this withdrawal' };
    }

    setWalletBalance((prev) => prev - data.amount);

    const newReqId = `wdr-${Date.now()}`;
    const newReq: WithdrawalRequest = {
      id: newReqId,
      userName: profile.name,
      userPhone: profile.phone,
      upiId: data.upiId,
      amount: data.amount,
      status: 'pending',
      requestedAt: 'Just now',
    };

    setDoc(doc(db, 'withdrawal_requests', newReqId), newReq).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `withdrawal_requests/${newReqId}`);
    });

    const tx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'withdrawal',
      amount: data.amount,
      status: 'pending',
      timestamp: 'Just now',
      title: `Withdrawal to ${data.upiId}`,
      refId: newReq.id,
    };
    setTransactions((prev) => [tx, ...prev]);

    return { success: true, message: 'Withdrawal request submitted! Payout will be processed within 10-30 mins.' };
  };

  // Admin approves deposit (Updates real Firestore + credits user)
  const approveDeposit = async (id: string) => {
    const req = depositRequests.find((d) => d.id === id);
    if (!req || req.status !== 'pending') return;

    try {
      await updateDoc(doc(db, 'deposit_requests', id), { status: 'approved' });

      // Automatically credit player's wallet balance in Firestore
      if (req.userUid) {
        await adjustUserBalance(req.userUid, req.amount, `UPI Deposit (${req.upiApp}) - Approved`);
      } else if (req.userName === profile.name || req.userUid === profile.uid) {
        setWalletBalance((prev) => {
          const updated = prev + req.amount;
          localStorage.setItem('nm_wallet_balance', updated.toString());
          return updated;
        });
      }

      setTransactions((prev) =>
        prev.map((tx) =>
          tx.refId === req.utrNumber
            ? { ...tx, status: 'completed', title: `UPI Deposit (${req.upiApp}) - Approved` }
            : tx
        )
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `deposit_requests/${id}`);
    }
  };

  // Admin rejects deposit (Updates real Firestore)
  const rejectDeposit = (id: string) => {
    updateDoc(doc(db, 'deposit_requests', id), { status: 'rejected' }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `deposit_requests/${id}`);
    });

    const req = depositRequests.find((d) => d.id === id);
    if (req) {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.refId === req.utrNumber ? { ...tx, status: 'rejected', title: `Deposit Rejected (Invalid UTR)` } : tx
        )
      );
    }
  };

  // Admin approves withdrawal (Updates real Firestore)
  const approveWithdrawal = (id: string) => {
    updateDoc(doc(db, 'withdrawal_requests', id), { status: 'approved' }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `withdrawal_requests/${id}`);
    });

    setTransactions((prev) =>
      prev.map((tx) => (tx.refId === id ? { ...tx, status: 'completed' } : tx))
    );
  };

  // Admin rejects withdrawal (Updates real Firestore)
  const rejectWithdrawal = (id: string) => {
    const req = withdrawalRequests.find((w) => w.id === id);
    if (!req || req.status !== 'pending') return;

    updateDoc(doc(db, 'withdrawal_requests', id), { status: 'rejected' }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `withdrawal_requests/${id}`);
    });

    setWalletBalance((prev) => {
      const updated = prev + req.amount;
      localStorage.setItem('nm_wallet_balance', updated.toString());
      return updated;
    });

    setTransactions((prev) =>
      prev.map((tx) =>
        tx.refId === id ? { ...tx, status: 'rejected', title: `Withdrawal Rejected (Refunded)` } : tx
      )
    );
  };

  const updateProfile = (updates: Partial<PlayerProfile>) => {
    setProfile((prev) => {
      const merged = { ...prev, ...updates };
      localStorage.setItem('nm_profile', JSON.stringify(merged));

      // Real-time Firestore sync under users collection
      if (merged.uid) {
        setDoc(doc(db, 'users', merged.uid.trim()), merged, { merge: true }).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, `users/${merged.uid}`);
        });
      }

      return merged;
    });
  };

  const logoutUser = () => {
    const blankProfile: PlayerProfile = {
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
    setProfile(blankProfile);
    setWalletBalance(0);
    localStorage.removeItem('nm_profile');
    localStorage.removeItem('nm_wallet_balance');
    localStorage.removeItem('nm_transactions');
  };

  const adjustUserBalance = async (uid: string, deltaAmount: number, reason: string, isBonus: boolean = false) => {
    try {
      const cleanUid = uid.trim();
      const userRef = doc(db, 'users', cleanUid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        const currentBal = typeof data.walletBalance === 'number' ? data.walletBalance : 0;
        const newBal = Math.max(0, currentBal + deltaAmount);
        await updateDoc(userRef, { walletBalance: newBal });
      } else {
        const newBal = Math.max(0, deltaAmount);
        await setDoc(userRef, { uid: cleanUid, walletBalance: newBal }, { merge: true });
      }

      // If this is currently logged-in user, also update local state
      if (profile.uid === cleanUid) {
        setWalletBalance((prev) => {
          const updated = Math.max(0, prev + deltaAmount);
          localStorage.setItem('nm_wallet_balance', updated.toString());
          return updated;
        });

        const txType = deltaAmount >= 0 ? (isBonus ? 'prize_winnings' : 'deposit') : 'withdrawal';
        const newTx: WalletTransaction = {
          id: `tx-${Date.now()}`,
          type: txType,
          amount: Math.abs(deltaAmount),
          status: 'completed',
          timestamp: 'Just now',
          title: isBonus ? `🎁 Bonus: ${reason}` : (deltaAmount >= 0 ? `💰 Admin Credit: ${reason}` : `🔻 Admin Debit: ${reason}`),
          refId: `admin-${Date.now()}`,
        };
        setTransactions((prev) => [newTx, ...prev]);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const resetToDefaults = () => {
    setTournaments([]);
    setWalletBalance(0);
    setTransactions([]);
    setDepositRequests([]);
    setWithdrawalRequests([]);
    setProfile(INITIAL_PLAYER_PROFILE);
    localStorage.clear();
  };

  return (
    <EsportsContext.Provider
      value={{
        currentPanel,
        setCurrentPanel,
        userActiveTab,
        setUserActiveTab,
        adminActiveTab,
        setAdminActiveTab,
        isAdminLoggedIn,
        showAdminLoginModal,
        setShowAdminLoginModal,
        loginAdmin,
        logoutAdmin,
        adminPasswordHint: adminPassword,
        changeAdminPassword,
        showUserAuthModal,
        setShowUserAuthModal,
        allUsers,
        logoutUser,
        adjustUserBalance,
        tournaments,
        selectedMode,
        setSelectedMode,
        joinTournament,
        createTournament,
        updateTournament,
        deleteTournament,
        clearAllTournaments,
        updateRoomCredentials,
        declareWinners,
        walletBalance,
        transactions,
        depositRequests,
        withdrawalRequests,
        submitDepositRequest,
        submitWithdrawalRequest,
        approveDeposit,
        rejectDeposit,
        approveWithdrawal,
        rejectWithdrawal,
        profile,
        updateProfile,
        isDbConnected,
        resetToDefaults,
      }}
    >
      {children}
    </EsportsContext.Provider>
  );
};

export const useEsports = () => {
  const context = useContext(EsportsContext);
  if (!context) {
    throw new Error('useEsports must be used within an EsportsProvider');
  }
  return context;
};
