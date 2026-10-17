import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { SEOHead } from '../../components/common/SEOHead';
import { motion } from 'framer-motion';

export const VerificationPending = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'your email address';
  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let timer = null;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsResending(true);
    try {
      await api.post('/auth/resend-verification', { email });
      toast.success('A fresh verification link was dispatched to your inbox via Resend.');
      setCooldown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 relative bg-zinc-50 dark:bg-black transition-colors">
      <SEOHead title="Verify Email — Car Rental" description="Email confirmation pending for Car Rental account." />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center shadow-2xl relative transition-colors"
      >
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center mx-auto mb-5 text-zinc-950 dark:text-white">
          <Mail className="w-8 h-8 text-zinc-950 dark:text-white" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white tracking-wide">
          Check Your Inbox
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
          We have dispatched a single-use verification link to:
        </p>
        <div className="my-3 px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-semibold text-zinc-900 dark:text-white truncate">
          {email}
        </div>
        <p className="text-[11px] text-zinc-500 mb-6">
          The link will expire in <strong>15 minutes</strong> for security reasons. Click the link inside the email to complete your registration.
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            className="w-full py-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-300 dark:border-zinc-700 text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            {cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Verification Email'}
          </button>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
