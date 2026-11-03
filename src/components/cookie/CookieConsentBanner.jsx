import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, SlidersHorizontal, Cookie, X } from 'lucide-react';
import { useCookieConsent } from '../../context/CookieConsentContext';

const CookieConsentBanner = () => {
    const { isBannerOpen, acceptAll, rejectOptional, openPreferences } = useCookieConsent();

    if (!isBannerOpen) return null;

    return (
        <aside 
            aria-label="Cookie consent banner"
            className="fixed bottom-20 md:bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-40 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 transition-colors">
                
                {/* Header Badge & Title */}
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/60 font-bold">
                            <Cookie className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                            Your Privacy Matters
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={rejectOptional}
                        aria-label="Dismiss and reject optional cookies"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Explanation text with legal links */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    We use cookies to improve your browsing experience, remember your preferences (like White/Dark theme), and understand how our website is used. You can manage your preferences at any time. Review our{' '}
                    <Link to="/privacy-policy" className="text-blue-600 dark:text-blue-400 underline font-semibold hover:text-blue-700">
                        Privacy Policy
                    </Link>
                    {' '}and{' '}
                    <Link to="/cookie-policy" className="text-blue-600 dark:text-blue-400 underline font-semibold hover:text-blue-700">
                        Cookie Policy
                    </Link>.
                </p>

                {/* Action Buttons: Accept All, Reject Optional, Customize */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                    <button
                        type="button"
                        onClick={openPreferences}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition order-3 sm:order-1 cursor-pointer"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Customize Preferences</span>
                    </button>

                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        <button
                            type="button"
                            onClick={rejectOptional}
                            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition active:scale-95 cursor-pointer"
                        >
                            Reject Optional
                        </button>
                        <button
                            type="button"
                            onClick={acceptAll}
                            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition active:scale-95 cursor-pointer"
                        >
                            Accept All
                        </button>
                    </div>
                </div>

            </div>
        </aside>
    );
};

export default CookieConsentBanner;

