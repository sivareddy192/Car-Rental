import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail as LuMail, Lock as LuLock, Eye as LuEye, EyeOff as LuEyeOff, ArrowRight as LuArrowRight, Loader2 as LuLoader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { setUserDetails } from '../store/userSlice';
import AuthLayout from '../components/AuthLayout';
import { useTheme } from '../provider/ThemeProvider';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: true
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isDark } = useTheme();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Please enter both email and password.");
            return;
        }

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.login,
                data: {
                    email: formData.email,
                    password: formData.password
                }
            });

            if (response.data.error) {
                toast.error(response.data.message);
                return;
            }

            if (response.data.success) {
                toast.success(response.data.message || "Welcome back!");
                const { accessToken, refreshToken, user } = response.data.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                if (formData.rememberMe) {
                    localStorage.setItem('remember_email', formData.email);
                } else {
                    localStorage.removeItem('remember_email');
                }

                dispatch(setUserDetails(user));

                // Determine redirect path from backend role and onboarding status
                const redirectPath = user.redirectPath || "/";
                const intendedRedirect = location.state?.from?.pathname;

                if (intendedRedirect && !intendedRedirect.includes("/login")) {
                    navigate(intendedRedirect, { replace: true });
                } else {
                    navigate(redirectPath, { replace: true });
                }
            }

        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Login to your account"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Address */}
                <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                    }`}>
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <LuMail className="w-5 h-5" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all border ${
                                isDark
                                    ? "bg-slate-800/80 text-white border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    : "bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            }`}
                        />
                    </div>
                </div>

                {/* Password & Forgot Password Link */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className={`block text-xs font-bold uppercase tracking-wider ${
                            isDark ? "text-slate-300" : "text-slate-700"
                        }`}>
                            Password
                        </label>
                        <Link
                            to="/forgot-password"
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <LuLock className="w-5 h-5" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className={`w-full pl-11 pr-11 py-3 rounded-2xl text-sm font-medium outline-none transition-all border ${
                                isDark
                                    ? "bg-slate-800/80 text-white border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    : "bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className={`text-xs font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                            Remember Me
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
                >
                    {loading ? (
                        <>
                            <LuLoader2 className="w-5 h-5 animate-spin" />
                            Signing In...
                        </>
                    ) : (
                        <>
                            Login
                            <LuArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                {/* Registration Link */}
                <div className="text-center pt-4 border-t border-slate-200/60 dark:border-slate-800/80">
                    <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                        >
                            Register
                        </Link>
                    </p>
                </div>

            </form>
        </AuthLayout>
    );
};

export default Login;
