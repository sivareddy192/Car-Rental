import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShieldCheck, Check, SlidersHorizontal, AlertCircle, Info, RefreshCcw } from 'lucide-react';
import { useCookieConsent } from '../../context/CookieConsentContext';

const CookiePreferenceModalContent = ({
    consent,
    closePreferences,
    acceptAll,
    rejectOptional,
    saveCustomPreferences,
    withdrawConsent
}) => {
    const [preferences, setPreferences] = useState(() => Boolean(consent?.preferences));
    const [analytics, setAnalytics] = useState(() => Boolean(consent?.analytics));
    const [functional, setFunctional] = useState(() => Boolean(consent?.functional));

    const handleSave = () => {
        saveCustomPreferences({
            preferences,
            analytics,
            functional
        });
    };

    return (
        <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
        >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
                
                {/* Modal Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/60 font-bold">
                            <SlidersHorizontal className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 id="cookie-modal-title" className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-heading">
                                Cookie Consent Preferences
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Version 1.2.0 &bull; India DPDP Act &amp; IT Act Compliant
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={closePreferences}
                        className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                        aria-label="Close preferences"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        When you visit DriveRent, we store and retrieve information on your browser, mostly in the form of cookies. You can choose which categories of optional cookies you allow. Learn more in our{' '}
                        <Link to="/cookie-policy" onClick={closePreferences} className="text-blue-600 dark:text-blue-400 underline font-semibold">
                            Cookie Policy
                        </Link>.
                    </p>

                    <div className="space-y-4">
                        {/* 1. Strictly Necessary (Locked ON) */}
                        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                            1. Strictly Necessary Cookies
                                        </h4>
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                                            Always Active &bull; Required
                                        </span>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 select-none">
                                    Mandatory
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-7">
                                Essential for core security, session state, JWT authentication tokens, CSRF protection, and physical shop pickup verification. They cannot be disabled.
                            </p>
                        </div>

                        {/* 2. Preference Cookies */}
                        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Info className="w-5 h-5 text-blue-600 shrink-0" />
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                        2. Preferences &amp; Settings Cookies
                                    </h4>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences}
                                        onChange={(e) => setPreferences(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-7">
                                Stores UI personalization options such as Dark/Light theme mode, city selection filters, and currency formatting.
                            </p>
                        </div>

                        {/* 3. Analytics & Performance Cookies */}
                        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                        3. Analytics &amp; Performance Cookies
                                    </h4>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={analytics}
                                        onChange={(e) => setAnalytics(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-7">
                                Anonymously monitors aggregated page visits, search latency, and platform usage to help us optimize vehicle discovery without identifying you personally.
                            </p>
                        </div>

                        {/* 4. Functional Cookies */}
                        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                        4. Functional &amp; Experience Cookies
                                    </h4>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={functional}
                                        onChange={(e) => setFunctional(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-7">
                                Powers interactive map pin rendering for shop discovery, recent car searches, and real-time live booking status toasts.
                            </p>
                        </div>
                    </div>

                    {/* Withdrawal notice */}
                    {consent && (
                        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                            <span>Want to reset or withdraw previously recorded consent?</span>
                            <button
                                type="button"
                                onClick={withdrawConsent}
                                className="inline-flex items-center gap-1.5 font-bold text-rose-500 hover:text-rose-600 transition cursor-pointer"
                            >
                                <RefreshCcw className="w-3.5 h-3.5" />
                                <span>Withdraw Consent</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal Footer Controls */}
                <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={rejectOptional}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-center"
                    >
                        Reject All Optional
                    </button>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-bold transition cursor-pointer text-center"
                        >
                            Save Preferences
                        </button>
                        <button
                            type="button"
                            onClick={acceptAll}
                            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition cursor-pointer text-center"
                        >
                            Accept All
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

const CookiePreferenceModal = () => {
    const context = useCookieConsent();
    if (!context.isModalOpen) return null;

    return <CookiePreferenceModalContent key="open" {...context} />;
};

export default CookiePreferenceModal;
