import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail as LuMail, KeyRound as LuKeyRound, Lock as LuLock, Eye as LuEye, EyeOff as LuEyeOff, ArrowRight as LuArrowRight, Loader2 as LuLoader2, Check as LuCheck, ArrowLeft as LuArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import AuthLayout from '../components/AuthLayout';
import { useTheme } from '../provider/ThemeProvider';

const ForgotPassword = () => {
    // Steps: 1 = Email, 2 = Verify OTP, 3 = New Password
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { isDark } = useTheme();

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error("Please enter your registered email address.");
            return;
        }

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: { email: email.trim() }
            });

            if (response.data.success) {
                toast.success(response.data.message || "Verification code sent to your email.");
                setStep(2);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            toast.error("Please enter the 6-digit verification code.");
            return;
        }

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: { email: email.trim(), otp: otp.trim() }
            });

            if (response.data.success) {
                toast.success(response.data.message || "Code verified successfully!");
                setStep(3);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.resetPassword,
                data: {
                    email: email.trim(),
                    otp: otp.trim(),
                    newPassword,
                    confirmPassword
                }
            });

            if (response.data.success) {
                toast.success("Password reset successfully! Please log in.");
                navigate('/login');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title={
                step === 1 ? "Forgot Password" :
                step === 2 ? "Verify Email Code" :
                "Create New Password"
            }
            subtitle={
                step === 1 ? "Enter your email to receive a secure verification code." :
                step === 2 ? `Enter the 6-digit code sent to ${email}.` :
                "Choose a strong password to secure your account."
            }
        >
            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3].map(i => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === step
                                ? "w-8 bg-amber-500"
                                : i < step
                                ? "w-4 bg-emerald-500"
                                : "w-4 bg-slate-300 dark:bg-slate-700"
                        }`}
                    />
                ))}
            </div>

            {/* Step 1: Email Form */}
            {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                            isDark ? "text-slate-300" : "text-slate-700"
                        }`}>
                            Registered Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <LuMail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all border ${
                                    isDark
                                        ? "bg-slate-800/80 text-white border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                        : "bg-slate-50 text-slate-900 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                }`}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <LuLoader2 className="w-5 h-5 animate-spin" />
                                Sending Code...
                            </>
                        ) : (
                            <>
                                Send Verification Code
                                <LuArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            )}

            {/* Step 2: OTP Form */}
            {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                            isDark ? "text-slate-300" : "text-slate-700"
                        }`}>
                            6-Digit Verification Code
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <LuKeyRound className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="123456"
                                required
                                autoFocus
                                className={`w-full pl-11 pr-4 py-3 rounded-2xl text-lg font-black tracking-widest text-center outline-none transition-all border ${
                                    isDark
                                        ? "bg-slate-800/80 text-amber-400 border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                        : "bg-slate-50 text-slate-900 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                }`}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <LuLoader2 className="w-5 h-5 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                Verify Code
                                <LuArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                        >
                            <LuArrowLeft className="w-3.5 h-3.5" /> Change Email
                        </button>
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="text-xs text-amber-500 hover:text-amber-400 font-semibold cursor-pointer"
                        >
                            Resend Code
                        </button>
                    </div>
                </form>
            )}

            {/* Step 3: New Password Form */}
            {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                            isDark ? "text-slate-300" : "text-slate-700"
                        }`}>
                            New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <LuLock className="w-5 h-5" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                required
                                className={`w-full pl-11 pr-11 py-3 rounded-2xl text-sm font-medium outline-none transition-all border ${
                                    isDark
                                        ? "bg-slate-800/80 text-white border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                        : "bg-slate-50 text-slate-900 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                            >
                                {showPassword ? <LuEyeOff className="w-5 h-5" /> : <LuEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                            isDark ? "text-slate-300" : "text-slate-700"
                        }`}>
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <LuLock className="w-5 h-5" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                required
                                className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all border ${
                                    isDark
                                        ? "bg-slate-800/80 text-white border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                        : "bg-slate-50 text-slate-900 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                }`}
                            />
                        </div>
                        {confirmPassword && (
                            <p className={`mt-1.5 text-xs font-semibold flex items-center gap-1 ${
                                newPassword === confirmPassword ? "text-emerald-500" : "text-rose-500"
                            }`}>
                                {newPassword === confirmPassword ? (
                                    <>
                                        <LuCheck className="w-3.5 h-3.5" /> Passwords match
                                    </>
                                ) : (
                                    "Passwords do not match"
                                )}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <LuLoader2 className="w-5 h-5 animate-spin" />
                                Updating Password...
                            </>
                        ) : (
                            <>
                                Reset Password
                                <LuArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            )}

            {/* Back to Login link */}
            <div className="text-center pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/80">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors"
                >
                    <LuArrowLeft className="w-3.5 h-3.5" />
                    Back to Log In
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
