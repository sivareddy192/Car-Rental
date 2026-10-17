import React, { useEffect, useState } from 'react';
import { Users, Search, Shield, UserCheck, UserX, Mail, Phone } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    api.get('/admin/customers')
      .then((res) => {
        if (res.data.success) setCustomers(res.data.users || []);
      })
      .catch(() => toast.error('Failed to load customers.'))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await api.patch(`/admin/customers/${userId}/role`, { role: newRole });
      if (res.data.success) {
        toast.success(`Role updated to ${newRole}.`);
        setCustomers((prev) =>
          prev.map((c) => (c._id === userId ? { ...c, role: newRole } : c))
        );
      }
    } catch {
      toast.error('Could not adjust user role.');
    }
  };

  const filtered = customers.filter((c) => {
    const matchRole = roleFilter === 'all' || c.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner text="Loading customers..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-white/[0.08] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Account Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-serif">
            Members & Customers
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total {customers.length} registered member accounts on platform
          </p>
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5">
          {['all', 'user', 'admin'].map((r) => {
            const isSelected = roleFilter === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-[#0f121d] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#181c2c]'
                }`}
              >
                {r === 'all' ? 'All Accounts' : `${r}s`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Registered', count: customers.length, color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-[#0f121d]', icon: Users },
          { label: 'Active Customers', count: customers.filter((c) => c.role === 'user').length, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: UserCheck },
          { label: 'Admin Executives', count: customers.filter((c) => c.role === 'admin').length, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', icon: Shield },
        ].map(({ label, count, color, bg, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141724] p-5 flex items-center gap-4 shadow-xs"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} shrink-0 shadow-xs`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div className={`text-2xl font-black ${color}`}>{count}</div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-white/[0.08] rounded-2xl p-4 shadow-xs">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:outline-none focus:bg-white dark:focus:bg-[#181c2c] focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-white/[0.08] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0f121d] border-b border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5 font-bold">User Identity</th>
                <th className="px-5 py-3.5 font-bold">Contact Email</th>
                <th className="px-5 py-3.5 font-bold hidden sm:table-cell">Phone</th>
                <th className="px-5 py-3.5 font-bold">Role</th>
                <th className="px-5 py-3.5 font-bold hidden md:table-cell">Registered On</th>
                <th className="px-5 py-3.5 font-bold text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {filtered.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors">
                  {/* Avatar & Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-black text-xs text-slate-950 shrink-0 shadow-xs">
                        {c.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-200">{c.name || 'Anonymous User'}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">ID: {c._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4 text-slate-700 dark:text-slate-300 font-medium">{c.email}</td>

                  {/* Phone */}
                  <td className="px-5 py-4 hidden sm:table-cell text-slate-500 dark:text-slate-400">
                    {c.phone || '—'}
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        c.role === 'admin'
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/20'
                          : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.06]'
                      }`}
                    >
                      {c.role === 'admin' && <Shield className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />}
                      {c.role}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 hidden md:table-cell text-slate-500 dark:text-slate-400">
                    {new Date(c.createdAt || Date.now()).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleRoleToggle(c._id, c.role)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border shadow-xs ${
                        c.role === 'admin'
                          ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20'
                          : 'bg-slate-50 dark:bg-[#0f121d] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-[#181c2c]'
                      }`}
                    >
                      {c.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">No customers found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
