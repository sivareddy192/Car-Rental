import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Trash2, ShieldCheck, Cookie, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { useCookieConsent } from '../context/CookieConsentContext';

const AccountPrivacy = () => {
    const [loading, setLoading] = useState(false);
    const { openPreferenceModal, preferences } = useCookieConsent();

    const handleRequestDelete = async () => {
        if (!window.confirm("Are you sure you want to submit an account deletion request? This action is irreversible.")) {
            return;
        }

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.request_delete
            });

            if (response.data.success) {
                toast.success(response.data.message || "Account deletion request submitted successfully");
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#161B26] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs"
        >
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-2">
                        <ShieldCheck className="w-4 h-4" />
                        Data Privacy & Security
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
                        Account Privacy & Legal Controls
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        DriveRent is committed to safeguarding your personal data in strict compliance with the Digital Personal Data Protection (DPDP) Act, 2023, and Information Technology Act rules.
                    </p>
                </div>

                {/* Cookie Consent Card */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <Cookie className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">Cookie & Tracking Preferences</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Current status: Essential (Always Active) • Analytics ({preferences?.analytics ? 'Active' : 'Disabled'}) • Functional ({preferences?.functional ? 'Active' : 'Disabled'})
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={openPreferenceModal}
                            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-colors cursor-pointer"
                        >
                            Configure
                        </button>
                    </div>
                </div>

                {/* Legal Documentation Quick Links */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                        Official Legal Policies
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <Link 
                            to="/terms-and-conditions"
                            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Terms & Conditions</span>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </Link>
                        <Link 
                            to="/privacy-policy"
                            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Privacy Policy (DPDP Act)</span>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </Link>
                        <Link 
                            to="/cancellation-refund-policy"
                            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Cancellation & Refund Policy</span>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </Link>
                        <Link 
                            to="/cookie-policy"
                            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Cookie Policy</span>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </Link>
                    </div>
                </div>

                {/* Account Deletion Request */}
                <div className="pt-4">
                    <button 
                        onClick={handleRequestDelete}
                        disabled={loading}
                        className="w-full bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-5 flex items-center justify-between hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all group active:scale-[0.99] disabled:opacity-50 cursor-pointer text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/40 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-rose-600 dark:text-rose-400 text-base">Request Account Deletion</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {loading ? "Submitting request..." : "Permanently erase your personal data & close your DriveRent account"}
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default AccountPrivacy;