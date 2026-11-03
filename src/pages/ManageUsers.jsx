import React, { useEffect, useState, useCallback } from 'react';
import { Users as LuUsers, Search as LuSearch, Shield as LuShield, ShieldAlert as LuShieldAlert, ShieldCheck as LuShieldCheck, UserCheck as LuUserCheck, UserX as LuUserX, RefreshCw as LuRefreshCw, Edit as LuEdit, Trash2 as LuTrash2, Check as LuCheck, X as LuX, AlertCircle as LuAlertCircle, History as LuHistory } from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import useDebounce from '../hooks/useDebounce';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 350);
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Modal States
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewAuditModal, setViewAuditModal] = useState(false);
    const [editRoleModal, setEditRoleModal] = useState(false);
    const [newRole, setNewRole] = useState("user");
    const [roleRemarks, setRoleRemarks] = useState("");
    const [processingAction, setProcessingAction] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await Axios({
                ...SummaryApi.all_users,
                params: {
                    ...(debouncedSearch && { search: debouncedSearch }),
                    ...(roleFilter !== "all" && { role: roleFilter }),
                    ...(statusFilter !== "all" && { status: statusFilter })
                }
            });
            if (res.data?.success) {
                setUsers(res.data.data || []);
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, roleFilter, statusFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    // Role assignment with audit history & email dispatch
    const handleAssignRole = async () => {
        if (!selectedUser) return;
        try {
            setProcessingAction(true);
            const res = await Axios({
                ...SummaryApi.update_user_role,
                data: {
                    userId: selectedUser._id,
                    role: newRole,
                    remarks: roleRemarks || `Role changed to ${newRole} by admin`
                }
            });

            if (res.data?.success) {
                toast.success(res.data.message || `Role updated to ${newRole}! Email and notification dispatched.`);
                setEditRoleModal(false);
                setSelectedUser(null);
                setRoleRemarks("");
                fetchUsers();
            } else {
                toast.error(res.data?.message || "Failed to update role.");
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setProcessingAction(false);
        }
    };

    // Account Status toggle (Activate / Suspend)
    const handleToggleAccountStatus = async (user, currentStatus) => {
        const nextStatus = currentStatus === "active" || currentStatus === "Active" ? "suspended" : "active";
        const confirmMsg = nextStatus === "suspended"
            ? `Are you sure you want to suspend ${user.name}'s account? They will not be able to log in.`
            : `Reactivate ${user.name}'s account?`;

        if (!window.confirm(confirmMsg)) return;

        try {
            const res = await Axios({
                ...SummaryApi.adminPlatform.updateAccountStatus,
                data: {
                    userId: user._id,
                    status: nextStatus
                }
            });

            if (res.data?.success) {
                toast.success(`User account is now ${nextStatus}.`);
                fetchUsers();
            }
        } catch (err) {
            AxiosToastError(err);
        }
    };

    // Delete user
    const handleDeleteUser = async (user) => {
        if (!window.confirm(`Permanently delete user ${user.name} (${user.email})? This action cannot be undone.`)) return;

        try {
            const res = await Axios({
                ...SummaryApi.delete_user,
                data: { userId: user._id }
            });
            if (res.data?.success) {
                toast.success("User deleted successfully.");
                fetchUsers();
            }
        } catch (err) {
            AxiosToastError(err);
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        Admin User Management
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading mt-2">
                        User & Role Management
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Grant or revoke Dealer and Agent privileges, inspect audit logs, and control account suspension.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={fetchUsers}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                        <LuRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
                    <LuSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500"
                    />
                </form>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold outline-none"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">User</option>
                        <option value="dealer">Dealer</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold outline-none"
                    >
                        <option value="all">All Account Statuses</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Users Table (Master Prompt Section 4 Table Columns) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-black tracking-wider text-[10px] text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-5 py-4">User ID</th>
                                <th className="px-5 py-4">Full Name</th>
                                <th className="px-5 py-4">Email</th>
                                <th className="px-5 py-4">Mobile Number</th>
                                <th className="px-5 py-4">Current Role</th>
                                <th className="px-5 py-4">Account Status</th>
                                <th className="px-5 py-4">Onboarding</th>
                                <th className="px-5 py-4">Registered Date</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-5 py-12 text-center text-slate-400">
                                        <LuRefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                                        Loading registered platform users...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-5 py-12 text-center text-slate-400">
                                        No users found matching query.
                                    </td>
                                </tr>
                            ) : (
                                users.map(u => {
                                    const role = (u.role || "user").toLowerCase();
                                    const accountStatus = (u.accountStatus || u.status || "active").toLowerCase();
                                    const isActive = accountStatus === "active";

                                    return (
                                        <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-5 py-4 font-mono text-[10px] text-slate-400">
                                                {u._id.slice(-6)}
                                            </td>
                                            <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                                                {u.name}
                                            </td>
                                            <td className="px-5 py-4 text-slate-500 dark:text-slate-300">
                                                {u.email}
                                            </td>
                                            <td className="px-5 py-4 text-slate-500 dark:text-slate-300">
                                                {u.mobile || u.phone || "—"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                    role === "admin" ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" :
                                                    role === "dealer" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" :
                                                    role === "agent" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300" :
                                                    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                }`}>
                                                    {role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    isActive
                                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                                }`}>
                                                    {accountStatus}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                                                    {u.onboardingStatus || "not_required"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-400 text-[11px]">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    
                                                    {/* Role Assignment Action */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedUser(u);
                                                            setNewRole(role);
                                                            setEditRoleModal(true);
                                                        }}
                                                        title="Assign Role"
                                                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black font-bold text-[10px] uppercase transition-colors cursor-pointer"
                                                    >
                                                        Role
                                                    </button>

                                                    {/* Audit History Action */}
                                                    {u.roleHistory?.length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedUser(u);
                                                                setViewAuditModal(true);
                                                            }}
                                                            title="View Role Audit Trail"
                                                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                                        >
                                                            <LuHistory className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Suspend / Activate Action */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleAccountStatus(u, accountStatus)}
                                                        title={isActive ? "Suspend Account" : "Activate Account"}
                                                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                                            isActive
                                                                ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                                                : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                                        }`}
                                                    >
                                                        {isActive ? <LuUserX className="w-4 h-4" /> : <LuUserCheck className="w-4 h-4" />}
                                                    </button>

                                                    {/* Delete user */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteUser(u)}
                                                        title="Delete user"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                                                    >
                                                        <LuTrash2 className="w-3.5 h-3.5" />
                                                    </button>

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

            {/* EDIT ROLE MODAL */}
            {editRoleModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 sm:p-8 space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-heading">
                                    Assign User Role
                                </h3>
                                <p className="text-xs text-slate-400">Target User: {selectedUser.name} ({selectedUser.email})</p>
                            </div>
                            <button onClick={() => setEditRoleModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Select Platform Role</label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold outline-none"
                                >
                                    <option value="user">User (Standard Customer)</option>
                                    <option value="dealer">Dealer (Fleet Partner - Onboarding Required)</option>
                                    <option value="agent">Agent (Booking Coordinator - Onboarding Required)</option>
                                    <option value="admin">Admin (Full System Governance)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Audit Remarks / Reason</label>
                                <textarea
                                    rows={3}
                                    value={roleRemarks}
                                    onChange={(e) => setRoleRemarks(e.target.value)}
                                    placeholder="e.g. Granted Dealer access following fleet partnership request..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                                />
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 rounded-xl text-amber-800 dark:text-amber-300">
                                🔔 Changing this role will automatically notify the user via email and in-app alert, create mandatory onboarding requirements if applicable, and log an audit trail entry in MongoDB.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setEditRoleModal(false)}
                                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAssignRole}
                                disabled={processingAction}
                                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-70"
                            >
                                {processingAction ? "Saving..." : "Save Role Change"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AUDIT TRAIL MODAL */}
            {viewAuditModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 sm:p-8 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-heading">
                                    Role Audit Trail
                                </h3>
                                <p className="text-xs text-slate-400">{selectedUser.name} &bull; {selectedUser.email}</p>
                            </div>
                            <button onClick={() => setViewAuditModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
                        </div>

                        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                            {selectedUser.roleHistory?.map((h, i) => (
                                <div key={i} className="py-2.5 space-y-1">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-slate-900 dark:text-white uppercase">
                                            {h.previousRole} &rarr; <span className="text-amber-500">{h.newRole}</span>
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            {new Date(h.changedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 italic">"{h.remarks}"</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 text-right">
                            <button
                                type="button"
                                onClick={() => setViewAuditModal(false)}
                                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageUsers;
