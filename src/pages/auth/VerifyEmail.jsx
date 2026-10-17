import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { setCredentials } from '../../store/slices/authSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { SEOHead } from '../../components/common/SEOHead';
import { motion } from 'framer-motion';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !email) {
      setStatus('error');
      setErrorMessage('Missing verification credentials in the link.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await api.get(`/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`);
        if (res.data.success) {
          setStatus('success');
          dispatch(
            setCredentials({
              user: res.data.user,
              accessToken: res.data.accessToken,
            })
          );
          toast.success('Email successfully verified! Welcome to Car Rental.');
          // Redirect after 2.5 seconds
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2500);
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage(
          err.response?.data?.message ||
            'The verification link has expired (15-min limit) or has already been used.'
        );
      }
    };

    verifyToken();
  }, [token, email, dispatch, navigate]);

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 relative bg-zinc-50 dark:bg-black transition-colors">
      <SEOHead title="Confirming Email — Car Rental" description="Verification processing." />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center shadow-2xl relative transition-colors"
      >
        {status === 'verifying' && (
          <div className="py-8 space-y-4">
            <Loader2 className="w-12 h-12 text-zinc-950 dark:text-white animate-spin mx-auto" />
            <h1 className="font-serif text-xl font-bold text-zinc-950 dark:text-white tracking-wide">
              Validating Security Token...
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Please wait while we confirm your email credentials with our security cluster.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white tracking-wide">
              Email Verified!
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Your member account is now fully active. You are automatically signed in and being redirected to your dashboard...
            </p>
            <div className="pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md"
              >
                <span>Enter Dashboard Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/50 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
              <XCircle className="w-9 h-9" />
            </div>
            <h1 className="font-serif text-xl font-bold text-zinc-950 dark:text-white tracking-wide">
              Verification Failed
            </h1>
            <p className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-200 dark:border-rose-900/50">
              {errorMessage}
            </p>
            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                className="block w-full py-3 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md"
              >
                Return to Sign In
              </Link>
              <Link
                to="/register"
                className="block text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors pt-1"
              >
                Register a New Account
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
