import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle, useTheme } from '../provider/ThemeProvider';
import carBg from '../assets/luxury-car-auth.jpg';

const AuthLayout = ({ children, title, subtitle }) => {
    const { isDark } = useTheme();

    return (
        <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-x-hidden transition-colors duration-500 py-10 px-4">
            {/* Background Luxury Car Photograph */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out scale-100"
                style={{
                    backgroundImage: `url(${carBg})`,
                    backgroundPosition: 'center 35%'
                }}
            />

            {/* Theme-Adaptive Translucent Luxury Overlay */}
            <div
                className={`fixed inset-0 z-10 transition-colors duration-500 ${
                    isDark
                        ? "bg-gradient-to-b from-[#0B0F19]/90 via-[#0B0F19]/80 to-[#0B0F19]/95 backdrop-blur-[4px]"
                        : "bg-gradient-to-b from-white/85 via-slate-50/75 to-slate-100/90 backdrop-blur-[3px]"
                }`}
            />

            {/* Subtle Top-Right Floating Theme Toggle (Sun/Moon) */}
            <div className="fixed top-5 right-5 z-30">
                <ThemeToggle className="shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700" />
            </div>

            {/* Main Auth Card Container */}
            <main className="relative z-20 w-full flex items-center justify-center">
                <div className={`w-full max-w-md rounded-3xl p-6 sm:p-9 border shadow-2xl transition-all duration-300 ${
                    isDark
                        ? "bg-[#0B0F19]/92 text-white border-slate-800/90 shadow-black/60 backdrop-blur-xl"
                        : "bg-white/95 text-slate-900 border-white/80 shadow-slate-900/10 backdrop-blur-xl"
                }`}>
                    {/* Centered Brand Emblem inside Card */}
                    <div className="text-center mb-6">
                        <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
                            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                                <svg className="w-6 h-6 fill-none stroke-white stroke-2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
                                </svg>
                            </div>
                            <span className={`font-extrabold text-2xl tracking-tight leading-none ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}>
                                Drive<span className="text-blue-600">Rent</span>
                            </span>
                        </Link>

                        {title && (
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className={`mt-1.5 text-xs sm:text-sm font-medium ${
                                isDark ? "text-slate-400" : "text-slate-500"
                            }`}>
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-20 w-full py-4 text-center text-xs mt-6">
                <p className={isDark ? "text-slate-500" : "text-slate-600"}>
                    &copy; {new Date().getFullYear()} DriveRent Car Rental Platform. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default AuthLayout;
