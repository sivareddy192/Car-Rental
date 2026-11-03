import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock as LuClock, CheckCircle2 as LuCheckCircle2, XCircle as LuXCircle, AlertTriangle as LuAlertTriangle, FileText as LuFileText, ArrowRight as LuArrowRight, RefreshCw as LuRefreshCw } from 'lucide-react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const DealerStatus = () => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const res = await Axios({ ...SummaryApi.onboarding.dealerStatus });
            if (res.data?.success && res.data?.hasApplication) {
                const app = res.data.data;
                setApplication(app);
                if (app.verificationStatus === "approved") {
                    navigate('/dealer/dashboard');
                }
            } else {
                navigate('/dealer/onboarding');
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 transition-colors flex items-center justify-center">
            <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10 text-center transition-colors">

                {/* Status Icon */}
                <div className="mb-6 flex justify-center">
                    {status === "approved" ? (
                        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/20">
                            <LuCheckCircle2 className="w-10 h-10" />
                        </div>
                    ) : status === "rejected" ? (
                        <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center text-4xl shadow-lg shadow-rose-500/20">
                            <LuXCircle className="w-10 h-10" />
                        </div>
                    ) : status === "documents_required" ? (
                        <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/20 animate-bounce">
                            <LuAlertTriangle className="w-10 h-10" />
                        </div>
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/20">
                            <LuClock className="w-10 h-10 animate-spin" />
                        </div>
                    )}
                </div>

                {/* Status Title & Message */}
                {status === "pending" && (
                    <>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
                            Waiting for Admin Approval
                        </h2>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            "Your Dealer Application Has Been Submitted Successfully."
                        </p>
                        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            "Your documents and business information are currently under verification. You will receive access to your Dealer Dashboard once the admin approves your application."
                        </p>
                    </>
                )}

                {status === "documents_required" && (
                    <>
                        <h2 className="text-2xl sm:text-3xl font-black text-amber-500 font-heading">
                            Additional Documents Required
                        </h2>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Our administration team reviewed your application and requested updated or clearer documentation.
                        </p>
                    </>
                )}

                {status === "rejected" && (
                    <>
                        <h2 className="text-2xl sm:text-3xl font-black text-rose-500 font-heading">
                            Application Not Approved
                        </h2>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Your verification was not approved. You may correct the specified details and resubmit.
                        </p>
                    </>
                )}

                {/* Application Details Summary */}
                {application && (
                    <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2.5">
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Application ID:</span>
                            <span className="font-bold text-slate-900 dark:text-white font-mono">{application.applicationId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Business Name:</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{application.businessDetails?.rentalBusinessName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Submission Date:</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{new Date(application.submittedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">Current Verification Status:</span>
                            <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                                status === "approved" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                                status === "rejected" ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" :
                                status === "documents_required" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" :
                                "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            }`}>
                                {status.replace('_', ' ')}
                            </span>
                        </div>

                        {application.adminRemarks && (
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                <span className="text-amber-600 dark:text-amber-400 font-bold block mb-1">Admin Remarks:</span>
                                <p className="text-slate-700 dark:text-slate-300 italic">{application.adminRemarks}</p>
                            </div>
                        )}

                        {application.rejectionReason && (
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                <span className="text-rose-600 dark:text-rose-400 font-bold block mb-1">Rejection Reason:</span>
                                <p className="text-slate-700 dark:text-slate-300">{application.rejectionReason}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                        type="button"
                        onClick={fetchStatus}
                        disabled={loading}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                        <LuRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Status
                    </button>

                    {(status === "documents_required" || status === "rejected") && (
                        <Link
                            to="/dealer/onboarding"
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                        >
                            <LuFileText className="w-3.5 h-3.5" />
                            Update & Resubmit Documents
                        </Link>
                    )}

                    <Link
                        to="/"
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    >
                        Browse Platform
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default DealerStatus;
