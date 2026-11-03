import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock as LuClock, CheckCircle2 as LuCheckCircle2, XCircle as LuXCircle, AlertTriangle as LuAlertTriangle, RefreshCw as LuRefreshCw, ShieldCheck as LuShieldCheck } from 'lucide-react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const AgentStatus = () => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const res = await Axios({ ...SummaryApi.onboarding.agentStatus });
            if (res.data?.success && res.data?.hasApplication) {
                const app = res.data.data;
                setApplication(app);
                if (app.verificationStatus === "approved") {
                    navigate('/agent/dashboard');
                }
            } else {
                navigate('/agent/onboarding');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const status = application?.verificationStatus || "pending";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 flex items-center justify-center transition-colors">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 text-center transition-colors">
                
                <div className="mb-6 flex justify-center">
                    {status === "approved" ? (
                        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center text-3xl">
                            <LuCheckCircle2 />
                        </div>
                    ) : status === "rejected" ? (
                        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-500 flex items-center justify-center text-3xl">
                            <LuXCircle />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-500 flex items-center justify-center text-3xl">
                            <LuClock className="animate-spin" />
                        </div>
                    )}
                </div>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                    {status === "approved" ? "Agent Access Approved" :
                     status === "rejected" ? "Application Rejected" :
                     "Waiting for Admin Verification"}
                </h2>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {status === "approved"
                        ? "Your booking agent profile has been verified. You can now access your dashboard."
                        : "Your agent verification documents are under review. You will receive an email once approved."}
                </p>

                {application && (
                    <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Application ID:</span>
                            <span className="font-mono font-bold">{application.applicationId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Status:</span>
                            <span className="font-bold uppercase text-indigo-500">{application.verificationStatus}</span>
                        </div>
                        {application.adminRemarks && (
                            <p className="text-amber-500 pt-2 border-t border-slate-200 dark:border-slate-700">Remarks: {application.adminRemarks}</p>
                        )}
                    </div>
                )}

                <div className="flex gap-2 justify-center pt-2">
                    <button
                        type="button"
                        onClick={fetchStatus}
                        className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                        <LuRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <Link
                        to="/"
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold cursor-pointer"
                    >
                        Browse Fleet
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AgentStatus;
