import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import { formatCurrency, triggerConfetti } from '../../utils/helpers';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const {
    walletBalance,
    transactions,
    submitDepositRequest,
    submitWithdrawalRequest,
    profile,
    setShowUserAuthModal,
  } = useEsports();

  const [activeTab, setActiveTab] = useState<'add' | 'withdraw' | 'history'>('add');

  // Add Cash form state
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('100');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('PhonePe');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [depositSubmitted, setDepositSubmitted] = useState(false);

  // Withdraw form state
  const [withdrawAmount, setWithdrawAmount] = useState<string>('100');
  const [withdrawUpiId, setWithdrawUpiId] = useState<string>('player@upi');
  const [withdrawStatus, setWithdrawStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const upiIdOfficial = 'nmesports@upi';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiIdOfficial);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSelectPreset = (amt: number) => {
    setDepositAmount(amt);
    setCustomAmount(amt.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) setDepositAmount(num);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.isLoggedIn) {
      alert('Please create or sign in to your player account before depositing funds.');
      setShowUserAuthModal(true);
      return;
    }

    if (!utrNumber.trim() || utrNumber.length < 8) {
      alert('Please enter a valid 12-digit UPI UTR / Transaction Reference number.');
      return;
    }

    submitDepositRequest({
      amount: depositAmount,
      utrNumber: utrNumber.trim(),
      upiApp: selectedUpiApp,
    });

    triggerConfetti();
    setDepositSubmitted(true);
    setTimeout(() => {
      setDepositSubmitted(false);
      setUtrNumber('');
      setActiveTab('history');
    }, 2200);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.isLoggedIn) {
      setWithdrawStatus({ type: 'error', message: 'Please sign in to withdraw funds' });
      setShowUserAuthModal(true);
      return;
    }

    const amt = parseInt(withdrawAmount, 10);
    if (isNaN(amt) || amt < 50) {
      setWithdrawStatus({ type: 'error', message: 'Minimum withdrawal amount is ₹50' });
      return;
    }
    if (!withdrawUpiId.includes('@')) {
      setWithdrawStatus({ type: 'error', message: 'Please enter a valid UPI ID (e.g., name@okhdfcbank or 9876543210@paytm)' });
      return;
    }

    const res = submitWithdrawalRequest({
      amount: amt,
      upiId: withdrawUpiId.trim(),
    });

    if (res.success) {
      setWithdrawStatus({ type: 'success', message: res.message });
      setTimeout(() => {
        setWithdrawStatus({ type: 'idle', message: '' });
        setActiveTab('history');
      }, 2000);
    } else {
      setWithdrawStatus({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Balance Hero Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-1">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>NM ESPORTS SECURE WALLET</span>
            </div>
            <div className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight tabular-nums">
              {formatCurrency(walletBalance)}
            </div>
            <div className="text-xs text-neutral-400 mt-2 flex items-center gap-2">
              <span>Account: {profile.isLoggedIn ? (profile.ign || profile.name) : 'Guest Player'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified for Instant Withdrawals
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                activeTab === 'add'
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Add Cash</span>
            </button>

            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                activeTab === 'withdraw'
                  ? 'bg-emerald-500 text-neutral-950 shadow-md'
                  : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-neutral-900 border border-neutral-800">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'add' ? 'bg-neutral-800 text-amber-400 shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Add Cash via UPI QR
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'withdraw' ? 'bg-neutral-800 text-emerald-400 shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Withdraw to UPI
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'history' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Passbook / History
        </button>
      </div>

      {/* TAB 1: Add Cash via UPI QR */}
      {activeTab === 'add' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Deposit Funds to NM Wallet</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Instant credit via standard Indian UPI (PhonePe, Google Pay, Paytm, BHIM, Cred). Zero payment gateway fees!
            </p>
          </div>

          {/* Quick preset amount chips */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">Select Amount (INR ₹)</label>
            <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-3">
              {[30, 50, 100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSelectPreset(amt)}
                  className={`py-2.5 rounded-xl font-bold font-mono text-xs sm:text-sm border transition-all ${
                    depositAmount === amt
                      ? 'bg-amber-500 border-amber-500 text-neutral-950 font-black'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold font-mono">₹</span>
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Custom Amount"
                className="w-full pl-8 pr-4 py-2.5 text-sm font-bold font-mono rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Step 1: Scan QR or Copy UPI */}
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Simulated UPI QR Canvas */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white text-neutral-950 text-center shadow-lg">
              <div className="text-[11px] font-black uppercase tracking-wider text-neutral-700 mb-2">
                NM ESPORTS OFFICIAL MERCHANT
              </div>

              {/* Dynamic QR SVG */}
              <div className="w-44 h-44 border-4 border-neutral-950 rounded-lg p-2 bg-white flex items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-neutral-950">
                  {/* Outer corner squares */}
                  <rect x="0" y="0" width="28" height="28" fill="#000" />
                  <rect x="4" y="4" width="20" height="20" fill="#fff" />
                  <rect x="8" y="8" width="12" height="12" fill="#000" />

                  <rect x="72" y="0" width="28" height="28" fill="#000" />
                  <rect x="76" y="4" width="20" height="20" fill="#fff" />
                  <rect x="80" y="8" width="12" height="12" fill="#000" />

                  <rect x="0" y="72" width="28" height="28" fill="#000" />
                  <rect x="4" y="76" width="20" height="20" fill="#fff" />
                  <rect x="8" y="80" width="12" height="12" fill="#000" />

                  {/* High density data matrix dots */}
                  <rect x="34" y="4" width="6" height="6" fill="#000" />
                  <rect x="44" y="4" width="6" height="6" fill="#000" />
                  <rect x="54" y="4" width="6" height="6" fill="#000" />
                  <rect x="62" y="4" width="6" height="6" fill="#000" />

                  <rect x="34" y="16" width="6" height="6" fill="#000" />
                  <rect x="48" y="16" width="8" height="6" fill="#000" />
                  <rect x="60" y="16" width="6" height="6" fill="#000" />

                  <rect x="4" y="34" width="6" height="6" fill="#000" />
                  <rect x="16" y="34" width="6" height="6" fill="#000" />
                  <rect x="4" y="46" width="6" height="6" fill="#000" />
                  <rect x="16" y="46" width="6" height="6" fill="#000" />

                  {/* Center branding box */}
                  <rect x="36" y="36" width="28" height="28" fill="#f59e0b" rx="4" />
                  <text x="50" y="54" fontSize="11" fontWeight="900" fill="#000" textAnchor="middle">NM</text>

                  {/* Lower data blocks */}
                  <rect x="72" y="34" width="6" height="6" fill="#000" />
                  <rect x="84" y="34" width="6" height="6" fill="#000" />
                  <rect x="72" y="46" width="6" height="6" fill="#000" />
                  <rect x="84" y="46" width="6" height="6" fill="#000" />

                  <rect x="34" y="72" width="6" height="6" fill="#000" />
                  <rect x="48" y="72" width="6" height="6" fill="#000" />
                  <rect x="60" y="72" width="6" height="6" fill="#000" />
                  <rect x="72" y="72" width="6" height="6" fill="#000" />
                  <rect x="84" y="80" width="8" height="8" fill="#000" />
                  <rect x="44" y="84" width="8" height="8" fill="#000" />
                </svg>
              </div>

              <div className="mt-2 text-xs font-bold text-neutral-900 font-mono">
                Amount: ₹{depositAmount}
              </div>
              <div className="text-[10px] text-neutral-500">Scan using PhonePe / GPay / Paytm</div>
            </div>

            {/* UPI details & Copy */}
            <div className="space-y-4">
              <div>
                <span className="text-xs text-neutral-400 block mb-1">Official UPI VPA ID</span>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="font-mono text-sm font-bold text-amber-400 flex-1 truncate">
                    {upiIdOfficial}
                  </span>
                  <button
                    onClick={handleCopyUpi}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Supported apps */}
              <div>
                <span className="text-xs text-neutral-400 block mb-1.5">Paying through:</span>
                <div className="grid grid-cols-4 gap-2">
                  {['PhonePe', 'Google Pay', 'Paytm', 'BHIM'].map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setSelectedUpiApp(app)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                        selectedUpiApp === app
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-neutral-400 space-y-1">
                <p>1. Open your UPI app & pay <strong className="text-white">₹{depositAmount}</strong>.</p>
                <p>2. Copy the 12-digit <strong className="text-white">UTR / Ref No.</strong> from receipt.</p>
                <p>3. Paste below to get instant credit in your wallet.</p>
              </div>
            </div>
          </div>

          {/* Step 2: UTR Submission Form */}
          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Enter 12-Digit UPI UTR / Transaction Reference Number <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={16}
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                placeholder="e.g. 439201948201"
                className="w-full px-4 py-3 text-sm font-mono tracking-wider rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Found on your payment success screen (UTR / Bank Ref ID / Txn ID).
              </span>
            </div>

            {depositSubmitted ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Deposit proof submitted successfully! Verification pending in Admin Panel.
                </span>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit UTR Verification (₹{depositAmount})</span>
              </button>
            )}
          </form>
        </div>
      )}

      {/* TAB 2: Withdraw Winnings */}
      {activeTab === 'withdraw' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Withdraw Money to UPI</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Cash out your tournament winnings directly to your Bank account via UPI. Instant transfer within 10-30 minutes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Available Withdrawable Balance:</span>
            <span className="font-mono font-black text-lg text-emerald-400 tabular-nums">
              {formatCurrency(walletBalance)}
            </span>
          </div>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            {withdrawStatus.type === 'error' && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{withdrawStatus.message}</span>
              </div>
            )}
            {withdrawStatus.type === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{withdrawStatus.message}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Withdrawal Amount (Min ₹50) <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold font-mono">₹</span>
                <input
                  type="number"
                  required
                  min={50}
                  max={walletBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="100"
                  className="w-full pl-8 pr-4 py-2.5 text-sm font-bold font-mono rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Your UPI ID (VPA) <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                value={withdrawUpiId}
                onChange={(e) => setWithdrawUpiId(e.target.value)}
                placeholder="e.g. 9876543210@paytm or yourname@okhdfcbank"
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Please double check your UPI ID. Payouts sent to wrong IDs cannot be reversed.
              </span>
            </div>

            <button
              type="submit"
              disabled={walletBalance < 50}
              className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-md ${
                walletBalance >= 50
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              Request Withdrawal ({formatCurrency(parseInt(withdrawAmount, 10) || 0)})
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Passbook / Transaction History */}
      {activeTab === 'history' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">Passbook Ledger</h2>
            <span className="text-xs text-neutral-400">{transactions.length} Transactions</span>
          </div>

          {transactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 rounded-xl bg-neutral-950 border border-neutral-800">
              No transactions yet. Join a tournament or add money to begin!
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-800 overflow-hidden divide-y divide-neutral-800 bg-neutral-950">
              {transactions.map((tx) => {
                const isCredit = tx.type === 'deposit' || tx.type === 'prize_winnings' || tx.type === 'refund';
                return (
                  <div key={tx.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isCredit
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">{tx.title}</div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                          <span>{tx.timestamp}</span>
                          {tx.refId && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono text-neutral-400 truncate max-w-[140px]">
                                Ref: {tx.refId}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-sm sm:text-base font-black font-mono tabular-nums ${
                          isCredit ? 'text-emerald-400' : 'text-neutral-200'
                        }`}
                      >
                        {isCredit ? '+' : '-'} {formatCurrency(tx.amount)}
                      </div>
                      <div>
                        {tx.status === 'completed' ? (
                          <span className="text-[10px] font-bold text-emerald-400">Completed</span>
                        ) : tx.status === 'pending' ? (
                          <span className="text-[10px] font-bold text-amber-400">Verification Pending</span>
                        ) : (
                          <span className="text-[10px] font-bold text-red-400">Rejected</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
