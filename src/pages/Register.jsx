import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as LuUser, Mail as LuMail, Phone as LuPhone, Lock as LuLock, Eye as LuEye, EyeOff as LuEyeOff, ArrowRight as LuArrowRight, Loader2 as LuLoader2, Check as LuCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import AuthLayout from '../components/AuthLayout';
import { useTheme } from '../provider/ThemeProvider';

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { isDark } = useTheme();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error("Please enter your full name.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            toast.error("Please provide a valid email address.");
            return false;
        }

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Password and Confirm Password do not match.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.register,
                data: {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    mobile: formData.mobile.trim(),
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                }
            });

            if (response.data.error) {
                toast.error(response.data.message);
                return;
            }

            if (response.data.success) {
                toast.success(response.data.message || "Account created successfully!");
                navigate('/login');
            }

        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create Your Account"
            subtitle="Start renting cars in minutes"
        >
            <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* 1. Full Name */}
                <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                    }`}>
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <LuUser className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm font-medium outline-none transition-all border ${
                                isDark
                                    ? "bg-slate-800/80 text-white border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    : "bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            }`}
                        />
                    </div>
                </div>

                {/* 2. Email Address */}
                <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                    }`}>
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <LuMail className="w-4 h-4" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm font-medium outline-none transition-all border ${
                                isDark
                                    ? "bg-slate-800/80 text-white border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    : "bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            }`}
                        />
                    </div>
                </div>

                {/* 3. Mobile Number */}
                <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                    }`}>
                        Mobile Number
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <LuPhone className="w-4 h-4" />
                        </div>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Enter your mobile number"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm font-medium outline-none transition-all border ${
                                isDark
                                    ? "bg-slate-800/80 text-white border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    : "bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            }`}
                        />
                    </div>
                </div>

                {/* 4. Password */}
                <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                    }`}>
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <LuLock className="w-4 h-4" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                            className={`w-full pl-10 pr-10 py-2.5 rounded-2xl text-sm font-medium outline-none transition-all border ${
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
                            {showPassword ? <LuEyeOff className="w-4 h-4" /> : <LuEye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* 5. Confirm Password */}
                <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                    }`}>
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <LuLock className="w-4 h-4" />
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            required
                            className={`w-full pl-10 pr-10 py-2.5 rounded-2xl text-sm font-medium outline-none transition-all border ${
                                isDark
                                    ? "bg-slate-800/80 text-white border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    : "bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                            {showConfirmPassword ? <LuEyeOff className="w-4 h-4" /> : <LuEye className="w-4 h-4" />}
                        </button>
                    </div>
                    {formData.confirmPassword && (
                        <p className={`mt-1 text-xs font-semibold flex items-center gap-1 ${
                            formData.password === formData.confirmPassword
                                ? "text-emerald-500"
                                : "text-rose-500"
                        }`}>
                            {formData.password === formData.confirmPassword ? (
                                <>
                                    <LuCheck className="w-3.5 h-3.5" /> Passwords match
                                </>
                            ) : (
                                "Passwords do not match"
                            )}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
                >
                    {loading ? (
                        <>
                            <LuLoader2 className="w-5 h-5 animate-spin" />
                            Creating Account...
                        </>
                    ) : (
                        <>
                            Register
                            <LuArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
                    <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

            </form>
        </AuthLayout>
    );
};

export default Register;
