import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { User as LuUser, Briefcase as LuBriefcase, FileText as LuFileText, Upload as LuUpload, Check as LuCheck, ArrowRight as LuArrowRight, Loader2 as LuLoader2, ShieldCheck as LuShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const AgentOnboarding = () => {
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        personalDetails: {
            fullName: user?.name || "",
            email: user?.email || "",
            mobileNumber: user?.mobile || user?.phone || "",
            residentialAddress: "",
            profilePhoto: user?.avatar || ""
        },
        professionalDetails: {
            agentName: user?.name || "",
            agencyName: "",
            workAddress: "",
            experienceYears: 1,
            contactDetails: user?.mobile || user?.phone || "",
            assignedOperatingLocation: ""
        },
        verificationDocuments: {
            identityProofUrl: "",
            addressProofUrl: "",
            otherDocsUrl: ""
        }
    });

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await Axios({ ...SummaryApi.onboarding.agentStatus });
                if (res.data?.success && res.data?.hasApplication) {
                    const app = res.data.data;
                    if (app.verificationStatus === "approved") {
                        navigate('/agent/dashboard');
                    } else if (app.verificationStatus === "pending") {
                        navigate('/agent/status');
                    } else {
                        setFormData({
                            personalDetails: { ...app.personalDetails },
                            professionalDetails: { ...app.professionalDetails },
                            verificationDocuments: { ...app.verificationDocuments }
                        });
                    }
                }
            } catch (e) {
                console.error("Agent status check:", e);
            }
        };
        checkStatus();
    }, [navigate]);

    const handleFileUpload = async (e, field) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const uploadForm = new FormData();
            uploadForm.append('image', file);

            const res = await Axios({
                url: '/api/file/upload',
                method: 'post',
                data: uploadForm,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data?.data?.url) {
                setFormData(prev => ({
                    ...prev,
                    verificationDocuments: {
                        ...prev.verificationDocuments,
                        [field]: res.data.data.url
                    }
                }));
                toast.success("Document uploaded.");
            }
        } catch {
            toast.error("Upload failed.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { personalDetails, professionalDetails, verificationDocuments } = formData;
        if (!personalDetails.fullName || !personalDetails.mobileNumber || !personalDetails.residentialAddress) {
            toast.error("Please fill in personal details.");
            return;
        }

        if (!professionalDetails.agentName || !professionalDetails.workAddress || !professionalDetails.assignedOperatingLocation) {
            toast.error("Please fill in professional details.");
            return;
        }

        if (!verificationDocuments.identityProofUrl) {
            toast.error("Please upload an identity proof document.");
            return;
        }

        try {
            setSubmitting(true);
            const res = await Axios({
                ...SummaryApi.onboarding.submitAgent,
                data: formData
            });

            if (res.data?.success) {
                toast.success(res.data.message || "Agent application submitted!");
                const userRes = await fetchUserDetails();
                if (userRes?.success) dispatch(setUserDetails(userRes.data));
                navigate('/agent/status');
            } else {
                toast.error(res.data?.message || "Failed to submit.");
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 transition-colors">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        Booking Agent Onboarding
                    </span>
                    <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white font-heading">
                        Complete Agent Verification Profile
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Provide your professional agency background and ID verification to access the Agent Booking Hub.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-9 transition-colors">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <LuUser className="w-5 h-5 text-indigo-500" /> Personal Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        value={formData.personalDetails.fullName}
                                        onChange={(e) => setFormData(p => ({ ...p, personalDetails: { ...p.personalDetails, fullName: e.target.value } }))}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Mobile Contact *</label>
                                    <input
                                        type="tel"
                                        value={formData.personalDetails.mobileNumber}
                                        onChange={(e) => setFormData(p => ({ ...p, personalDetails: { ...p.personalDetails, mobileNumber: e.target.value } }))}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Residential Address *</label>
                                    <input
                                        type="text"
                                        value={formData.personalDetails.residentialAddress}
                                        onChange={(e) => setFormData(p => ({ ...p, personalDetails: { ...p.personalDetails, residentialAddress: e.target.value } }))}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <LuBriefcase className="w-5 h-5 text-indigo-500" /> Agency & Operating Location
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Agency Name (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.professionalDetails.agencyName}
                                        onChange={(e) => setFormData(p => ({ ...p, professionalDetails: { ...p.professionalDetails, agencyName: e.target.value } }))}
                                        placeholder="e.g. Royal Escort Mobility"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Operating Location / City *</label>
                                    <input
                                        type="text"
                                        value={formData.professionalDetails.assignedOperatingLocation}
                                        onChange={(e) => setFormData(p => ({ ...p, professionalDetails: { ...p.professionalDetails, assignedOperatingLocation: e.target.value } }))}
                                        required
                                        placeholder="e.g. Mumbai Airport / South Hub"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Work Office Address *</label>
                                    <input
                                        type="text"
                                        value={formData.professionalDetails.workAddress}
                                        onChange={(e) => setFormData(p => ({ ...p, professionalDetails: { ...p.professionalDetails, workAddress: e.target.value } }))}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <LuFileText className="w-5 h-5 text-indigo-500" /> Identity & Address Proof
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                                    <label className="block text-xs font-bold uppercase mb-2">Identity Proof (Aadhaar / Passport) *</label>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileUpload(e, 'identityProofUrl')}
                                        className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:bg-indigo-600 file:text-white file:border-0 cursor-pointer"
                                    />
                                    {formData.verificationDocuments.identityProofUrl && (
                                        <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1"><LuCheck /> Uploaded</p>
                                    )}
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                                    <label className="block text-xs font-bold uppercase mb-2">Address Proof</label>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileUpload(e, 'addressProofUrl')}
                                        className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:bg-indigo-600 file:text-white file:border-0 cursor-pointer"
                                    />
                                    {formData.verificationDocuments.addressProofUrl && (
                                        <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1"><LuCheck /> Uploaded</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-70"
                            >
                                {submitting ? <LuLoader2 className="w-5 h-5 animate-spin" /> : <LuCheck className="w-5 h-5" />}
                                Submit Agent Verification
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AgentOnboarding;
