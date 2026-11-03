import React, { useEffect, useState, useCallback } from 'react';
import { FileCheck as LuFileCheck, Check as LuCheck, X as LuX, AlertTriangle as LuAlertTriangle, FileText as LuFileText, ExternalLink as LuExternalLink, RefreshCw as LuRefreshCw, Building2 as LuBuilding2, User as LuUser, Clock as LuClock, Eye as LuEye } from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';

const AdminApplications = () => {
    const [dealerApps, setDealerApps] = useState([]);
    const [agentApps, setAgentApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dealer'); // 'dealer' or 'agent'
    const [statusFilter, setStatusFilter] = useState('all');

    // Inspection Modal
    const [selectedApp, setSelectedApp] = useState(null);
    const [modalAction, setModalAction] = useState(null); // 'view', 'approve', 'reject', 'request_docs'
    const [actionRemarks, setActionRemarks] = useState('');
    const [submittingAction, setSubmittingAction] = useState(false);

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            const res = await Axios({
                ...SummaryApi.onboarding.adminApplications,
                params: {
                    ...(statusFilter !== 'all' && { status: statusFilter })
                }
            });
            if (res.data?.success) {
                setDealerApps(res.data.data?.dealerApplications || []);
                setAgentApps(res.data.data?.agentApplications || []);
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleExecuteAction = async () => {
        if (!selectedApp || !modalAction) return;

        const isDealer = activeTab === 'dealer';
        const endpoint = isDealer
            ? SummaryApi.onboarding.adminReviewDealer
            : SummaryApi.onboarding.adminReviewAgent;

        try {
            setSubmittingAction(true);
            const res = await Axios({
                ...endpoint,
                data: {
                    applicationId: selectedApp.applicationId,
                    action: modalAction,
                    remarks: actionRemarks,
                    rejectionReason: actionRemarks
                }
            });

            if (res.data?.success) {
                toast.success(res.data.message || `Application ${modalAction} completed! Notification and email dispatched.`);
                setSelectedApp(null);
                setModalAction(null);
                setActionRemarks('');
                fetchApplications();
            } else {
                toast.error(res.data?.message || 'Review action failed.');
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setSubmittingAction(false);
        }
    };

    const currentList = activeTab === 'dealer' ? dealerApps : agentApps;
    const pendingCount = currentList.filter(a => a.verificationStatus === 'pending').length;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        Compliance &amp; Verification &bull; {pendingCount} Pending
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading mt-2">
                        Applications & Verification Dashboard
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Inspect government identity proofs, business licenses, bank accounts, and grant verified platform privileges.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchApplications}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                    <LuRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            {/* Primary Module Tabs: Dealer vs Agent */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('dealer')}
                        className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                            activeTab === 'dealer'
                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        Dealer Applications ({dealerApps.length})
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('agent')}
                        className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                            activeTab === 'agent'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        Agent Applications ({agentApps.length})
                    </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold outline-none"
                    >
                        <option value="all">All Verification Statuses</option>
                        <option value="pending">Pending Approval</option>
                        <option value="approved">Approved</option>
                        <option value="documents_required">Documents Required</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Applications Table (Matching Section 7 Columns) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-black tracking-wider text-[10px] text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-5 py-4">App ID</th>
                                <th className="px-5 py-4">Applicant Name</th>
                                <th className="px-5 py-4">Email</th>
                                <th className="px-5 py-4">Phone</th>
                                <th className="px-5 py-4">Business / Agency</th>
                                <th className="px-5 py-4">Submitted Documents</th>
                                <th className="px-5 py-4">Submission Date</th>
                                <th className="px-5 py-4">Verification Status</th>
                                <th className="px-5 py-4 text-right">Admin Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-5 py-12 text-center text-slate-400">
                                        <LuRefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                                        Loading applications...
                                    </td>
                                </tr>
                            ) : currentList.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-5 py-12 text-center text-slate-400">
                                        No applications found in this category.
                                    </td>
                                </tr>
                            ) : (
                                currentList.map(app => {
                                    const { personalDetails, businessDetails, professionalDetails, verificationDocuments } = app;
                                    const isApproved = app.verificationStatus === 'approved';
                                    const isPending = app.verificationStatus === 'pending';
                                    const isDocsReq = app.verificationStatus === 'documents_required';

                                    const docCount = Object.values(verificationDocuments || {}).filter(Boolean).length;

                                    return (
                                        <tr key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">
                                                {app.applicationId}
                                            </td>
                                            <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                                                {personalDetails?.fullName || app.userId?.name}
                                            </td>
                                            <td className="px-5 py-4 text-slate-500 dark:text-slate-300">
                                                {personalDetails?.email || app.userId?.email}
                                            </td>
                                            <td className="px-5 py-4 text-slate-500 dark:text-slate-300">
                                                {personalDetails?.mobileNumber || app.userId?.mobile || "—"}
                                            </td>
                                            <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-200">
                                                {businessDetails?.rentalBusinessName || professionalDetails?.agencyName || professionalDetails?.agentName || "—"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                    {docCount} Uploaded
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-400 text-[11px]">
                                                {new Date(app.submittedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    isApproved ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                                                    isPending ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse" :
                                                    isDocsReq ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" :
                                                    "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                                }`}>
                                                    {app.verificationStatus.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    
                                                    {/* Inspect Full Application */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedApp(app);
                                                            setModalAction('view');
                                                        }}
                                                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <LuEye className="w-3 h-3" /> Inspect
                                                    </button>

                                                    {/* Quick Actions if pending or under review */}
                                                    {(!isApproved) && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedApp(app);
                                                                    setModalAction('approve');
                                                                }}
                                                                title="Approve Application"
                                                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                                                            >
                                                                <LuCheck className="w-3.5 h-3.5" />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedApp(app);
                                                                    setModalAction('request_documents');
                                                                }}
                                                                title="Request Additional Documents"
                                                                className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer"
                                                            >
                                                                <LuAlertTriangle className="w-3.5 h-3.5" />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedApp(app);
                                                                    setModalAction('reject');
                                                                }}
                                                                title="Reject Application"
                                                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                                                            >
                                                                <LuX className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    )}

                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* APPLICATION INSPECTION & ACTION MODAL */}
            {selectedApp && modalAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
                        
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500">
                                    Application Review
                                </span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                                    {selectedApp.applicationId} &bull; {selectedApp.personalDetails?.fullName}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setSelectedApp(null); setModalAction(null); }}
                                className="text-slate-400 hover:text-white cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Action = 'view' */}
                        {modalAction === 'view' && (
                            <div className="space-y-4 text-xs">
                                
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                                    <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider">Applicant & Contact</h4>
                                    <p><strong>Name:</strong> {selectedApp.personalDetails?.fullName}</p>
                                    <p><strong>Email:</strong> {selectedApp.personalDetails?.email}</p>
                                    <p><strong>Mobile:</strong> {selectedApp.personalDetails?.mobileNumber}</p>
                                    <p><strong>Residential Address:</strong> {selectedApp.personalDetails?.residentialAddress}</p>
                                </div>

                                {selectedApp.businessDetails && (
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider">Rental Business Credentials</h4>
                                        <p><strong>Business Name:</strong> {selectedApp.businessDetails.rentalBusinessName}</p>
                                        <p><strong>Physical Address:</strong> {selectedApp.businessDetails.businessAddress}, {selectedApp.businessDetails.city}, {selectedApp.businessDetails.state} - {selectedApp.businessDetails.pinCode}</p>
                                        <p><strong>Vehicles Owned:</strong> {selectedApp.businessDetails.vehiclesOwned}</p>
                                        <p><strong>Operating Hours:</strong> {selectedApp.businessDetails.operatingHours}</p>
                                    </div>
                                )}

                                {selectedApp.businessInformation?.bankAccountDetails && (
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider">Payout Account Details</h4>
                                        <p><strong>Account Holder:</strong> {selectedApp.businessInformation.bankAccountDetails.accountHolderName}</p>
                                        <p><strong>Bank Name:</strong> {selectedApp.businessInformation.bankAccountDetails.bankName}</p>
                                        <p><strong>Account Number:</strong> {selectedApp.businessInformation.bankAccountDetails.accountNumber}</p>
                                        <p><strong>IFSC Code:</strong> {selectedApp.businessInformation.bankAccountDetails.ifscCode}</p>
                                    </div>
                                )}

                                {/* Uploaded Verification Documents */}
                                <div className="space-y-2">
                                    <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider">Uploaded Verification Files</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {Object.entries(selectedApp.verificationDocuments || {}).map(([key, url]) => {
                                            if (!url) return null;
                                            return (
                                                <a
                                                    key={key}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200"
                                                >
                                                    <span className="truncate uppercase text-[11px]">{key.replace('Url', '')}</span>
                                                    <LuExternalLink className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-2" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setModalAction('request_docs')}
                                        className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500 hover:text-black cursor-pointer"
                                    >
                                        Request Extra Docs
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setModalAction('reject')}
                                        className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-500 font-bold hover:bg-rose-500 hover:text-white cursor-pointer"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setModalAction('approve')}
                                        className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-md cursor-pointer"
                                    >
                                        Approve Access
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Modal Action = 'approve' */}
                        {modalAction === 'approve' && (
                            <div className="space-y-4 text-xs">
                                <p className="text-sm font-bold text-emerald-500">
                                    Are you sure you want to approve this {activeTab} application?
                                </p>
                                <p className="text-slate-600 dark:text-slate-300">
                                    This will unlock the {activeTab === 'dealer' ? 'Dealer Dashboard' : 'Agent Dashboard'}, set access status to active, and send an official approval confirmation email via Resend.
                                </p>
                                <div>
                                    <label className="block font-bold uppercase mb-1">Optional Administrator Remarks</label>
                                    <input
                                        type="text"
                                        value={actionRemarks}
                                        onChange={(e) => setActionRemarks(e.target.value)}
                                        placeholder="e.g. All documents verified and in order."
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setModalAction('view')}
                                        className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleExecuteAction}
                                        disabled={submittingAction}
                                        className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase cursor-pointer"
                                    >
                                        {submittingAction ? "Approving..." : "Confirm & Unlock Dashboard"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Modal Action = 'reject' */}
                        {modalAction === 'reject' && (
                            <div className="space-y-4 text-xs">
                                <p className="text-sm font-bold text-rose-500">
                                    Reject Application
                                </p>
                                <div>
                                    <label className="block font-bold uppercase mb-1">Reason for Rejection *</label>
                                    <textarea
                                        rows={3}
                                        value={actionRemarks}
                                        onChange={(e) => setActionRemarks(e.target.value)}
                                        placeholder="Please provide explicit reason (e.g. Invalid GST certificate, blurred Aadhaar)..."
                                        required
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setModalAction('view')}
                                        className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleExecuteAction}
                                        disabled={submittingAction || !actionRemarks.trim()}
                                        className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase cursor-pointer disabled:opacity-50"
                                    >
                                        {submittingAction ? "Rejecting..." : "Confirm Rejection & Notify"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Modal Action = 'request_docs' */}
                        {modalAction === 'request_docs' && (
                            <div className="space-y-4 text-xs">
                                <p className="text-sm font-bold text-amber-500">
                                    Request Additional Documents
                                </p>
                                <div>
                                    <label className="block font-bold uppercase mb-1">Instructions for Applicant *</label>
                                    <textarea
                                        rows={3}
                                        value={actionRemarks}
                                        onChange={(e) => setActionRemarks(e.target.value)}
                                        placeholder="e.g. Please re-upload a clear, readable scan of your PAN card and shop photos..."
                                        required
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setModalAction('view')}
                                        className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleExecuteAction}
                                        disabled={submittingAction || !actionRemarks.trim()}
                                        className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase cursor-pointer disabled:opacity-50"
                                    >
                                        {submittingAction ? "Sending..." : "Send Request & Notify"}
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminApplications;
