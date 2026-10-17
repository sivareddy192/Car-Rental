import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Crown, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { setCredentials } from '../../store/slices/authSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { SEOHead } from '../../components/common/SEOHead';
import { motion } from 'framer-motion';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [resending, setResending] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setUnverifiedEmail(null);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        dispatch(
          setCredentials({
            user: res.data.user,
            accessToken: res.data.accessToken,
          })
        );
        toast.success(`Welcome back, ${res.data.user.name}!`);
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (err.response?.data?.isUnverified) {
        setUnverifiedEmail(err.response.data.email || email);
        toast.error('Your email is not verified yet.');
      } else {
        toast.error(err.response?.data?.message || 'Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setResending(true);
    try {
      await api.post('/auth/resend-verification', { email: unverifiedEmail });
      toast.success('A new verification email has been sent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend verification.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 pt-28 pb-16 flex items-center justify-center px-4 relative transition-colors duration-300">
      <SEOHead title="Member Login — Car Rental" description="Access your luxury vehicle reservations and member privileges." />

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-400/10 dark:bg-zinc-800/20 blur-3xl rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 relative shadow-xl dark:shadow-2xl z-10"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mx-auto mb-3 text-zinc-950 dark:text-white shadow-xs">
            <Crown className="w-6 h-6 text-zinc-950 dark:text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white tracking-wide">Member Sign In</h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Access your prestige bookings and concierge privileges
          </p>
        </div>

        {unverifiedEmail && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-200 text-xs space-y-2">
            <p className="font-semibold">Email Verification Required</p>
            <p className="text-zinc-600 dark:text-zinc-400">
              Your account for <span className="font-semibold text-zinc-950 dark:text-white">{unverifiedEmail}</span> needs email confirmation before sign-in.
            </p>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resending}
              className="mt-2 text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              {resending ? 'Sending with Resend...' : 'Resend Verification Email'}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                id="login-email-input"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                id="login-password-input"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-11 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            id="login-submit-btn"
            className="w-full py-3.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Signing In...
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Not yet a member?{' '}
          <Link to="/register" className="text-zinc-950 dark:text-white font-semibold hover:underline">
            Register Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
