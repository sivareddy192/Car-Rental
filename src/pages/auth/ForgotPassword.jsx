import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, CheckCircle2, ArrowRight, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { SEOHead } from '../../components/common/SEOHead';
import { motion, AnimatePresence } from 'framer-motion';

export const ForgotPassword = () => {
  // Step 1: 'EMAIL', Step 2: 'OTP', Step 3: 'NEW_PASSWORD', Step 4: 'SUCCESS'
  const [step, setStep] = useState('EMAIL');

  // Step 1 State
  const [email, setEmail] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Step 2 State: Exactly 6 separate digits
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isShake, setIsShake] = useState(false);
  const [isOtpSuccess, setIsOtpSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(300); // 5 mins

  // Step 3 State: New password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Refs for the 6 OTP input boxes
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  // Timer countdown for Step 2
  useEffect(() => {
    let timer = null;
    if (step === 'OTP' && otpExpirySeconds > 0) {
      timer = setInterval(() => {
        setOtpExpirySeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpExpirySeconds]);

  // Focus 1st box when reaching OTP step
  useEffect(() => {
    if (step === 'OTP' && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  // Trigger shake animation helper
  const triggerShake = () => {
    setIsShake(true);
    setTimeout(() => setIsShake(false), 600);
  };

  /**
   * Step 1: Submit Email to dispatch 6-digit OTP via Resend
   */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    setIsSendingOtp(true);
    setOtpError('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        toast.success(res.data.message || 'Passcode dispatched via Resend.');
        setOtpExpirySeconds(300);
        setStep('OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch reset code.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  /**
   * Step 2: Handle individual OTP input changes
   */
  const handleOtpChange = (index, value) => {
    // Only accept numeric digits
    const cleaned = value.replace(/[^0-9]/g, '');
    if (!cleaned) {
      const updated = [...otp];
      updated[index] = '';
      setOtp(updated);
      return;
    }

    // Handle single digit
    const digit = cleaned.slice(-1);
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);
    setOtpError('');

    // Auto-focus next input box
    if (index < 5 && digit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle Backspace navigation across boxes
   */
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  /**
   * Handle Paste of 6-digit code across all boxes
   */
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pastedData.length >= 6) {
      const sixDigits = pastedData.slice(0, 6).split('');
      setOtp(sixDigits);
      setOtpError('');
      inputRefs.current[5]?.focus();
    }
  };

  /**
   * Step 2: Verify 6-digit OTP
   */
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const completeOtp = otp.join('');

    if (completeOtp.length !== 6) {
      setOtpError('Please fill all 6 passcode digits.');
      triggerShake();
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    try {
      const res = await api.post('/auth/verify-otp', {
        email,
        otp: completeOtp,
      });

      if (res.data.success) {
        setResetToken(res.data.resetToken);
        setIsOtpSuccess(true);
        toast.success('Passcode confirmed successfully.');
        setTimeout(() => {
          setStep('NEW_PASSWORD');
        }, 1200);
      }
    } catch (err) {
      triggerShake();
      const msg = err.response?.data?.message || 'Invalid or expired passcode.';
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /**
   * Step 3: Submit New Password
   */
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please enter and confirm your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setIsResetting(true);

    try {
      const res = await api.post('/auth/reset-password', {
        email,
        resetToken,
        newPassword,
        confirmPassword,
      });

      if (res.data.success) {
        toast.success('Password updated successfully! Please sign in.');
        setStep('SUCCESS');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsResetting(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 relative bg-zinc-50 dark:bg-black transition-colors">
      <SEOHead
        title="Reset Password — Car Rental"
        description="Secure multi-step password recovery with 6-digit OTP verification."
      />

      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 relative shadow-2xl z-10 transition-colors">
        <AnimatePresence mode="wait">
          {/* STEP 1: ENTER EMAIL */}
          {step === 'EMAIL' && (
            <motion.div
              key="step-email"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center mx-auto mb-3 text-zinc-950 dark:text-white">
                  <KeyRound className="w-6 h-6 text-zinc-950 dark:text-white" />
                </div>
                <h1 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white tracking-wide">
                  Forgot Password
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Enter your registered email address to receive a secure 6-digit verification code.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400 mb-1.5">
                    Account Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      id="forgot-email-input"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  id="forgot-send-otp-btn"
                  className="w-full py-3.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isSendingOtp ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                      Dispatching Code via Resend...
                    </span>
                  ) : (
                    <>
                      <span>Send 6-Digit Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-900 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </motion.div>
          )}

          {/* STEP 2: 6-DIGIT OTP INPUT */}
          {step === 'OTP' && (
            <motion.div
              key="step-otp"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center mx-auto mb-3 text-zinc-950 dark:text-white">
                  <Lock className="w-6 h-6 text-zinc-950 dark:text-white" />
                </div>
                <h1 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white tracking-wide">
                  Enter Verification Code
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  We sent a 6-digit passcode to <span className="text-zinc-950 dark:text-white font-medium">{email}</span>
                </p>
                <div className="mt-2 text-[11px] text-zinc-500">
                  Expires in:{' '}
                  <span className="text-zinc-900 dark:text-zinc-300 font-mono font-bold">
                    {Math.floor(otpExpirySeconds / 60)}:
                    {(otpExpirySeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Framer motion gentle shake wrapper */}
              <motion.div
                animate={isShake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="space-y-5"
              >
                {/* Exactly 6 separate OTP input boxes */}
                <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
                  {otp.map((digit, idx) => (
                    <motion.input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e.target)}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      id={`otp-box-${idx}`}
                      className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl border transition-all duration-200 focus:outline-none ${
                        digit
                          ? 'border-zinc-950 bg-zinc-100 text-zinc-950 dark:border-white dark:bg-zinc-800 dark:text-white'
                          : otpError
                          ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
                          : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:border-zinc-500 dark:hover:border-zinc-700 focus:border-zinc-950 dark:focus:border-white'
                      }`}
                    />
                  ))}
                </div>

                {/* Error message */}
                {otpError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-2.5 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </motion.div>
                )}

                {/* Success checkmark animation */}
                {isOtpSuccess && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-2.5 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Code verified! Directing to new password...</span>
                  </motion.div>
                )}

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!isOtpComplete || isVerifyingOtp || isOtpSuccess}
                  id="btn-verify-otp"
                  className="w-full py-3.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isVerifyingOtp ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                      Verifying Passcode...
                    </span>
                  ) : (
                    <>
                      <span>Confirm Passcode</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>

              <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-900 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <button
                  type="button"
                  onClick={() => setStep('EMAIL')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  disabled={otpExpirySeconds > 240}
                  className="text-zinc-950 dark:text-white font-semibold hover:underline disabled:opacity-50 disabled:no-underline"
                >
                  Resend Code
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === 'NEW_PASSWORD' && (
            <motion.div
              key="step-new-pass"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center mx-auto mb-3 text-zinc-950 dark:text-white">
                  <CheckCircle2 className="w-6 h-6 text-zinc-950 dark:text-white" />
                </div>
                <h1 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white tracking-wide">
                  Set New Password
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Choose a robust password with at least 6 characters.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      id="reset-new-password"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-11 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your new password"
                      id="reset-confirm-password"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResetting}
                  id="reset-submit-btn"
                  className="w-full py-3.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isResetting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                      Saving Password...
                    </span>
                  ) : (
                    <>
                      <span>Update Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'SUCCESS' && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white tracking-wide">
                Password Restored
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Your credentials have been securely updated. A formal confirmation receipt has been sent to your email via Resend.
              </p>
              <div className="pt-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 w-full justify-center py-3.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  <span>Sign In With New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
