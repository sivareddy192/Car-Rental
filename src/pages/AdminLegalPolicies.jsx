import React, { useEffect, useState, useCallback } from 'react';
import { 
    FileText, 
    Cookie, 
    ShieldCheck, 
    CheckCircle2, 
    RefreshCw, 
    Edit3, 
    Save, 
    Eye, 
    Lock, 
    SlidersHorizontal,
    TrendingUp,
    Users,
    Check,
    X,
    AlertCircle
} from 'lucide-react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const AdminLegalPolicies = () => {
    const [activeTab, setActiveTab] = useState('policies'); // 'policies' or 'consents'

    // Policy State
    const [policies, setPolicies] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState('terms-and-conditions');
    const [loadingPolicies, setLoadingPolicies] = useState(true);
    const [savingPolicy, setSavingPolicy] = useState(false);
    const [editForm, setEditForm] = useState({
        title: '',
        version: '',
        status: 'published',
        summary: '',
        sections: []
    });

    // Consent Stats State
    const [consentStats, setConsentStats] = useState(null);
    const [consentLogs, setConsentLogs] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);

    // Fetch policies
    const fetchPolicies = useCallback(async () => {
        try {
            setLoadingPolicies(true);
            const res = await Axios({ ...SummaryApi.legal.adminAll });
            if (res.data?.success && res.data.data) {
                setPolicies(res.data.data);
                const current = res.data.data.find(p => p.slug === selectedSlug) || res.data.data[0];
                if (current) {
                    setEditForm({
                        title: current.title || '',
                        version: current.version || '1.0.0',
                        status: current.status || 'published',
                        summary: current.summary || '',
                        sections: current.sections || []
                    });
                }
            }
        } catch (err) {
            console.error("Failed to load policies:", err);
        } finally {
            setLoadingPolicies(false);
        }
    }, [selectedSlug]);

    // Fetch consent statistics & logs
    const fetchConsentData = useCallback(async () => {
        try {
            setLoadingStats(true);
            const [statsRes, logsRes] = await Promise.allSettled([
                Axios({ ...SummaryApi.cookieConsent.adminStats }),
                Axios({ ...SummaryApi.cookieConsent.adminLogs })
            ]);

            if (statsRes.status === "fulfilled" && statsRes.value.data?.success) {
                setConsentStats(statsRes.value.data.data);
            }
            if (logsRes.status === "fulfilled" && logsRes.value.data?.success) {
                setConsentLogs(logsRes.value.data.data.records || []);
            }
        } catch (err) {
            console.error("Failed to load consent stats:", err);
        } finally {
            setLoadingStats(false);
        }
    }, []);

    useEffect(() => {
        fetchPolicies();
        fetchConsentData();
    }, [fetchPolicies, fetchConsentData]);

    // When selected slug changes, populate edit form
    const handleSelectPolicy = (slug) => {
        setSelectedSlug(slug);
        const policy = policies.find(p => p.slug === slug);
        if (policy) {
            setEditForm({
                title: policy.title || '',
                version: policy.version || '1.0.0',
                status: policy.status || 'published',
                summary: policy.summary || '',
                sections: policy.sections || []
            });
        }
    };

    // Save policy updates
    const handleSavePolicy = async (e) => {
        e.preventDefault();
        try {
            setSavingPolicy(true);
            const res = await Axios({
                ...SummaryApi.legal.adminUpdate(selectedSlug),
                data: editForm
            });
            if (res.data?.success) {
                toast.success(res.data.message || "Policy updated successfully!");
                fetchPolicies();
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setSavingPolicy(false);
        }
    };

    const handleSectionChange = (index, field, value) => {
        setEditForm(prev => {
            const nextSections = [...prev.sections];
            nextSections[index] = {
                ...nextSections[index],
                [field]: value
            };
            return { ...prev, sections: nextSections };
        });
    };

    return (
        <div className="space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
                        Legal Policies &amp; Privacy Governance
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Manage published marketplace terms, privacy statements, and review global cookie consent records
                    </p>
                </div>

                {/* Sub-Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('policies')}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            activeTab === 'policies'
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Policy Editor</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('consents')}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            activeTab === 'consents'
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Cookie className="w-3.5 h-3.5" />
                        <span>Cookie Consent Audit ({consentStats?.total || 0})</span>
                    </button>
                </div>
            </div>

            {/* TAB 1: POLICY EDITOR */}
            {activeTab === 'policies' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Policy Picker */}
                    <div className="lg:col-span-4 space-y-3">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                Select Legal Policy
                            </h3>
                            <div className="space-y-1.5">
                                {[
                                    { slug: 'terms-and-conditions', label: 'Terms & Conditions', count: 25 },
                                    { slug: 'privacy-policy', label: 'Privacy Policy', count: 21 },
                                    { slug: 'cancellation-refund-policy', label: 'Cancellation & Refund', count: 15 },
                                    { slug: 'cookie-policy', label: 'Cookie Policy', count: 15 }
                                ].map((p) => {
                                    const isSelected = selectedSlug === p.slug;
                                    return (
                                        <button
                                            key={p.slug}
                                            type="button"
                                            onClick={() => handleSelectPolicy(p.slug)}
                                            className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                                                isSelected
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <div className="min-w-0 pr-2">
                                                <span className="block truncate">{p.label}</span>
                                                <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                                                    /{p.slug} &bull; {p.count} sections
                                                </span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                                                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                            }`}>
                                                v1.2.0
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 text-xs text-blue-900 dark:text-blue-300 leading-relaxed space-y-2">
                            <div className="flex items-center gap-1.5 font-bold">
                                <ShieldCheck className="w-4 h-4 text-blue-600" />
                                <span>Statutory Compliance Notice</span>
                            </div>
                            <p>
                                Changes published here reflect immediately across all public customer endpoints. All modifications adhere to the Digital Personal Data Protection Act, 2023.
                            </p>
                        </div>
                    </div>

                    {/* Right Edit Form */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
                        {loadingPolicies ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mb-2" />
                                <span className="text-xs font-semibold">Loading policy details...</span>
                            </div>
                        ) : (
                        <form onSubmit={handleSavePolicy} className="space-y-5">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                        Editing Document
                                    </span>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {editForm.title || selectedSlug}
                                    </h2>
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={`/${selectedSlug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>View Live</span>
                                    </a>

                                    <button
                                        type="submit"
                                        disabled={savingPolicy}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                                    >
                                        <Save className="w-3.5 h-3.5" />
                                        <span>{savingPolicy ? 'Saving...' : 'Publish Policy'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Meta fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Policy Title
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-semibold text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Version
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.version}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, version: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-semibold text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Publication Status
                                    </label>
                                    <select
                                        value={editForm.status}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-semibold text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                                    >
                                        <option value="published" className="dark:bg-slate-900">Published</option>
                                        <option value="draft" className="dark:bg-slate-900">Draft (Pending Review)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Summary description */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Policy Summary / Introduction Note
                                </label>
                                <textarea
                                    rows={2}
                                    value={editForm.summary}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, summary: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                                />
                            </div>

                            {/* Structured Sections Accordion */}
                            <div className="space-y-3 pt-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                                    Document Sections ({editForm.sections?.length || 0})
                                </label>

                                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                                    {editForm.sections?.map((section, idx) => (
                                        <div
                                            key={section.id || idx}
                                            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                                                    {idx + 1}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={section.title}
                                                    onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                                                    className="flex-1 px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent focus:border-blue-500 outline-hidden"
                                                    placeholder="Section Title"
                                                />
                                            </div>
                                            <textarea
                                                rows={3}
                                                value={section.content}
                                                onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 outline-hidden focus:border-blue-500"
                                                placeholder="Section content..."
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </form>
                        )}
                    </div>

                </div>
            )}

            {/* TAB 2: COOKIE CONSENT AUDIT & STATS */}
            {activeTab === 'consents' && (
                loadingStats ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mb-2" />
                        <span className="text-xs font-semibold">Loading consent audit statistics...</span>
                    </div>
                ) : (
                <div className="space-y-6">
                    
                    {/* Stat Cards Strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Consents Recorded</span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                                {consentStats?.total || 0}
                            </span>
                            <span className="text-[10px] text-slate-400">Unique visitors &amp; accounts</span>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Accept All Rate</span>
                            <span className="text-2xl font-black text-emerald-600 mt-1 block">
                                {consentStats?.percentages?.acceptAllRate || 0}%
                            </span>
                            <span className="text-[10px] text-slate-400">{consentStats?.byAction?.acceptAll || 0} full consents</span>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Reject Optional Rate</span>
                            <span className="text-2xl font-black text-amber-600 mt-1 block">
                                {consentStats?.percentages?.rejectOptionalRate || 0}%
                            </span>
                            <span className="text-[10px] text-slate-400">{consentStats?.byAction?.rejectOptional || 0} essential only</span>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Analytics Consent</span>
                            <span className="text-2xl font-black text-blue-600 mt-1 block">
                                {consentStats?.percentages?.analyticsConsentRate || 0}%
                            </span>
                            <span className="text-[10px] text-slate-400">{consentStats?.byCategory?.analytics || 0} opted-in</span>
                        </div>
                    </div>

                    {/* Consent Audit Logs Table */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Recent Consent Actions &amp; Audit Trail
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Records created via Global Cookie Consent Banner &amp; Settings
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={fetchConsentData}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Refresh</span>
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                                        <th className="py-2.5 px-3">Consent ID</th>
                                        <th className="py-2.5 px-3">Subject</th>
                                        <th className="py-2.5 px-3">Action</th>
                                        <th className="py-2.5 px-3">Categories Allowed</th>
                                        <th className="py-2.5 px-3">Version</th>
                                        <th className="py-2.5 px-3">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {consentLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-slate-400">
                                                No consent logs recorded yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        consentLogs.map((log) => {
                                            const actionColors = {
                                                accept_all: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400',
                                                reject_optional: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
                                                customized: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-400',
                                                withdrawn: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400'
                                            };
                                            const actionBadge = actionColors[log.action] || 'bg-slate-100 text-slate-700';

                                            return (
                                                <tr key={log._id || log.consentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[130px]">
                                                        {log.consentId}
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        {log.userId?.email ? (
                                                            <div>
                                                                <span className="font-bold text-slate-900 dark:text-white block">{log.userId.name || 'User'}</span>
                                                                <span className="text-[10px] text-slate-400">{log.userId.email}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 font-mono text-[11px]">
                                                                {log.anonymousId ? `anon (${log.anonymousId.substring(0, 10)}...)` : 'Visitor'}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${actionBadge}`}>
                                                            {log.action.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-3 space-x-1">
                                                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold">
                                                            Essential
                                                        </span>
                                                        {log.preferences && (
                                                            <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-[9px] font-bold">
                                                                Prefs
                                                            </span>
                                                        )}
                                                        {log.analytics && (
                                                            <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 text-[9px] font-bold">
                                                                Analytics
                                                            </span>
                                                        )}
                                                        {log.functional && (
                                                            <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[9px] font-bold">
                                                                Functional
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-3 text-slate-500">
                                                        v{log.consentVersion || '1.0.0'}
                                                    </td>
                                                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                                                        {log.updatedAt ? new Date(log.updatedAt).toLocaleString("en-IN", { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
                )
            )}

        </div>
    );
};

export default AdminLegalPolicies;
