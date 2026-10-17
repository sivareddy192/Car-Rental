import React, { useEffect, useState } from 'react';
import {
  Calendar, Search, Filter, ChevronDown, CheckCircle,
  XCircle, Clock, IndianRupee, User, Car
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const statusBadgeStyles = {
  confirmed: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/20',
  completed: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200/80 dark:border-sky-500/20',
  cancelled: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/80 dark:border-rose-500/20',
  pending: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-500/20',
};

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    api.get('/bookings?limit=100')
      .then((res) => {
        if (res.data.success) setBookings(res.data.bookings || []);
      })
      .catch(() => toast.error('Failed to load bookings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const res = await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Booking status changed to ${newStatus}.`);
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.bookingReference?.toLowerCase().includes(q) ||
      b.customerName?.toLowerCase().includes(q) ||
      b.vehicleId?.name?.toLowerCase().includes(q) ||
      b.customerPhone?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner text="Loading bookings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header card */}
      <div className="bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-white/[0.08] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Fleet Reservations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-serif">
            Bookings Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total {bookings.length} reservations recorded across all channels
          </p>
        </div>

        {/* Quick metrics in header */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-50 dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.08] rounded-xl text-center">
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Gross Volume</div>
            <div className="text-sm font-black text-slate-900 dark:text-white">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="px-4 py-2 bg-slate-50 dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.08] rounded-xl text-center">
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Total Bookings</div>
            <div className="text-sm font-black text-slate-900 dark:text-white">{bookings.length}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-white/[0.08] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search ref, customer, car..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:outline-none focus:bg-white dark:focus:bg-[#181c2c] focus:border-amber-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => {
            const isSelected = statusFilter === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-[#0f121d] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#181c2c]'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-white/[0.08] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0f121d] border-b border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5 font-bold">Booking Reference</th>
                <th className="px-5 py-3.5 font-bold">Client Details</th>
                <th className="px-5 py-3.5 font-bold">Reserved Vehicle</th>
                <th className="px-5 py-3.5 font-bold hidden md:table-cell">Duration</th>
                <th className="px-5 py-3.5 font-bold">Amount</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {filtered.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors">
                  {/* Reference */}
                  <td className="px-5 py-4">
                    <div className="font-mono font-bold text-slate-900 dark:text-white text-xs">{b.bookingReference}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      {new Date(b.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">{b.customerName || 'Direct Guest'}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{b.customerPhone}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{b.customerEmail}</div>
                  </td>

                  {/* Vehicle */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {b.vehicleId?.brand} {b.vehicleId?.name}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{b.vehicleId?.category}</div>
                  </td>

                  {/* Dates */}
                  <td className="px-5 py-4 hidden md:table-cell text-slate-600 dark:text-slate-400">
                    <div>{new Date(b.startDate).toLocaleDateString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">to {new Date(b.endDate).toLocaleDateString('en-IN')}</div>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        statusBadgeStyles[b.status] || statusBadgeStyles.pending
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  {/* Action dropdown */}
                  <td className="px-5 py-4 text-right">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusUpdate(b._id, e.target.value)}
                      className="text-xs font-semibold bg-white dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.08] rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 transition-all focus:outline-none focus:border-amber-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">No bookings found matching filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
