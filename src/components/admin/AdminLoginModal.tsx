import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, Sparkles, X, Globe } from 'lucide-react';
import { triggerConfetti } from '../../utils/helpers';

interface AdminLoginModalProps {
  onClose?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose }) => {
  const { showAdminLoginModal, setShowAdminLoginModal, loginAdmin, adminPasswordHint } = useEsports();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showAdminLoginModal) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password.trim()) {
      setErrorMessage('Please enter the Admin Master Password');
      return;
    }

    setIsSubmitting(true);
    const res = loginAdmin(password);
    setIsSubmitting(false);

    if (res.success) {
      triggerConfetti();
      setPassword('');
      if (onClose) onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleClose = () => {
    setShowAdminLoginModal(false);
    if (window.location.hash.includes('admin')) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Back to User View"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Shield icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-neutral-950 mx-auto mb-4 font-black">
          <ShieldCheck className="w-7 h-7 text-neutral-950" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            NM ESPORTS ADMIN PORTAL
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
            Restricted tournament organizer access. Enter master credentials to manage tournaments, rooms, and payouts.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-xs text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Admin Access Key / Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full pl-10 pr-10 py-3 text-sm rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 font-mono tracking-wider focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Master Password Hint for the site owner */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex items-center justify-between">
            <span>Default Master Key:</span>
            <span className="font-mono font-bold text-amber-400 select-all cursor-pointer">
              {adminPasswordHint}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Unlock Admin Panel</span>
          </button>
        </form>

        {/* How to access in Chrome browser tip */}
        <div className="mt-6 pt-5 border-t border-neutral-800 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
            <Globe className="w-3.5 h-3.5 text-amber-500" />
            <span>How to open in Chrome browser:</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Type <strong className="text-white font-mono">#admin</strong> at the end of the URL:
            <br />
            <code className="text-amber-400 bg-neutral-950 px-2 py-0.5 rounded font-mono text-[10px]">
              your-domain.app/#admin
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};
