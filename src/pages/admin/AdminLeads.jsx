import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays, Check, ChevronDown, Clock3, Mail, MessageSquare,
  Phone, Search, UserRound, Users,
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const LEAD_STATUSES = ['new', 'in_progress', 'contacted', 'resolved'];

const STATUS_STYLES = {
  new: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
  in_progress: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20',
  contacted: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
};

const DETAIL_LABELS = {
  chauffeurUniform: 'Chauffeur uniform',
  decorationTheme: 'Decoration theme',
  dropoffLocation: 'Drop-off location',
  estimatedFare: 'Estimated fare',
  flightNumber: 'Flight number',
  groupSize: 'Group size',
  passengers: 'Passengers',
  pickupCity: 'Pickup city',
  pickupDate: 'Pickup date',
  pickupLocation: 'Pickup location',
  pickupTime: 'Pickup time',
  selectedVehicle: 'Selected vehicle',
  serviceType: 'Service type',
  tourTitle: 'Tour',
  travelDate: 'Travel date',
  tripType: 'Trip type',
  vehicleClass: 'Vehicle class',
  vehiclePreference: 'Vehicle preference',
  venue: 'Venue',
};

const formatLabel = (key) => DETAIL_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());

const formatValue = (value, key = '') => {
  if (value instanceof Date) {
    return value.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const date = new Date(`${value.slice(0, 10)}T00:00:00`);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }
  if (typeof value === 'number' && /fare|price|amount/i.test(key)) {
    return `₹${value.toLocaleString('en-IN')}`;
  }
  if (Array.isArray(value)) return value.map((item) => formatValue(item)).join(', ');
  if (value && typeof value === 'object') {
    return Object.entries(value).map(([nestedKey, item]) => `${formatLabel(nestedKey)}: ${formatValue(item, nestedKey)}`).join(', ');
  }
  return String(value);
};

const getServiceDetails = (enquiry) => {
  const details = enquiry.serviceDetails && typeof enquiry.serviceDetails === 'object'
    ? Object.entries(enquiry.serviceDetails).filter(([key, value]) => key !== 'notes' && value !== '' && value !== null && value !== undefined)
    : [];
  const dates = enquiry.dates && typeof enquiry.dates === 'object'
    ? Object.entries(enquiry.dates).filter(([, value]) => value)
    : [];
  return [...details, ...dates.map(([key, value]) => [key, value])];
};

const formatStatus = (status) => status.replaceAll('_', ' ');

export const AdminLeads = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api.get('/enquiries')
      .then((res) => {
        if (res.data.success) setEnquiries(res.data.enquiries || []);
      })
      .catch(() => toast.error('Failed to load leads.'))
      .finally(() => setLoading(false));
  }, []);

  const types = useMemo(
    () => ['all', ...new Set(enquiries.map((enquiry) => enquiry.enquiryType).filter(Boolean))],
    [enquiries]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      const status = enquiry.status || 'new';
      const detailsText = JSON.stringify(enquiry.serviceDetails || {}).toLowerCase();
      const matchesType = typeFilter === 'all' || enquiry.enquiryType === typeFilter;
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      const matchesSearch = !query || [
        enquiry.name,
        enquiry.email,
        enquiry.phone,
        enquiry.enquiryType,
        detailsText,
      ].some((value) => value?.toLowerCase().includes(query));
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [enquiries, search, statusFilter, typeFilter]);

  const updateStatus = async (enquiry, status) => {
    const previousStatus = enquiry.status || 'new';
    if (status === previousStatus) return;

    setUpdatingId(enquiry._id);
    try {
      const response = await api.patch(`/enquiries/${enquiry._id}`, {
        status,
        adminNotes: enquiry.adminNotes || '',
      });
      if (!response.data.success) throw new Error('Lead status was not updated.');

      const updatedEnquiry = response.data.enquiry;
      setEnquiries((current) => current.map((item) => (
        item._id === enquiry._id ? updatedEnquiry : item
      )));
      toast.success('Lead status updated.');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update lead status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner text="Loading sales and concierge leads..." />
      </div>
    );
  }

  const metrics = [
    { status: 'all', label: 'All leads', count: enquiries.length, icon: Users, color: 'text-slate-700 dark:text-slate-200', bg: 'bg-slate-50 dark:bg-white/[0.04]' },
    { status: 'new', label: 'New', count: enquiries.filter((item) => (item.status || 'new') === 'new').length, icon: MessageSquare, color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { status: 'in_progress', label: 'In progress', count: enquiries.filter((item) => item.status === 'in_progress').length, icon: Clock3, color: 'text-sky-700 dark:text-sky-300', bg: 'bg-sky-50 dark:bg-sky-500/10' },
    { status: 'contacted', label: 'Contacted', count: enquiries.filter((item) => item.status === 'contacted').length, icon: Phone, color: 'text-violet-700 dark:text-violet-300', bg: 'bg-violet-50 dark:bg-violet-500/10' },
    { status: 'resolved', label: 'Resolved', count: enquiries.filter((item) => item.status === 'resolved').length, icon: Check, color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#141724]">
        <div className="flex flex-col justify-between gap-5 p-5 sm:p-7 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                Lead management
              </span>
            </div>
            <h1 className="font-serif text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Sales &amp; Concierge Leads
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Review service enquiries, contact customers, and keep every lead’s progress up to date.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-[#0f121d]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-black leading-tight text-slate-900 dark:text-white">{enquiries.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total leads</div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-label="Lead status summary">
        {metrics.map(({ status, label, count, icon: Icon, color, bg }) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            aria-pressed={statusFilter === status}
            className={`rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              statusFilter === status
                ? 'border-amber-400 ring-2 ring-amber-400/20 dark:border-amber-500'
                : 'border-slate-200 dark:border-white/[0.08]'
            } ${bg}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-2xl font-black ${color}`}>{count}</span>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</div>
          </button>
        ))}
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#141724] sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Search leads"
              placeholder="Search name, email, phone, or enquiry details..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-amber-500 focus:bg-white dark:border-white/[0.08] dark:bg-[#0f121d] dark:text-slate-200 dark:focus:bg-[#181c2c]"
            />
          </div>
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="lead-type-filter">Filter by service</label>
            <div className="relative min-w-36 flex-1 lg:flex-none">
              <select
                id="lead-type-filter"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-semibold capitalize text-slate-700 outline-none focus:border-amber-500 dark:border-white/[0.08] dark:bg-[#0f121d] dark:text-slate-200"
              >
                {types.map((type) => (
                  <option key={type} value={type}>{type === 'all' ? 'All services' : type}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            {(search || typeFilter !== 'all' || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setTypeFilter('all');
                  setStatusFilter('all');
                }}
                className="rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-white/[0.06]">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Enquiries</span>
          <span className="text-slate-500 dark:text-slate-400">Showing {filtered.length} of {enquiries.length}</span>
        </div>

        <div className="space-y-3">
          {filtered.map((enquiry) => {
            const status = enquiry.status || 'new';
            const details = getServiceDetails(enquiry);
            const notes = enquiry.serviceDetails?.notes;
            const createdAt = new Date(enquiry.createdAt);
            const dateLabel = Number.isNaN(createdAt.getTime())
              ? 'Date unavailable'
              : createdAt.toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

            return (
              <article
                key={enquiry._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm dark:border-white/[0.08] dark:bg-[#10131e] dark:hover:border-white/[0.15] sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-sm font-black text-amber-800 dark:text-amber-300">
                      {enquiry.name?.trim()?.charAt(0)?.toUpperCase() || <UserRound className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-base font-bold text-slate-900 dark:text-white">
                          {enquiry.name || 'Unnamed lead'}
                        </h2>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300">
                          {enquiry.enquiryType || 'General'}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                        {enquiry.email && (
                          <a href={`mailto:${enquiry.email}`} className="inline-flex items-center gap-1.5 hover:text-amber-700 dark:hover:text-amber-300">
                            <Mail className="h-3.5 w-3.5" />{enquiry.email}
                          </a>
                        )}
                        {enquiry.phone && (
                          <a href={`tel:${enquiry.phone}`} className="inline-flex items-center gap-1.5 hover:text-amber-700 dark:hover:text-amber-300">
                            <Phone className="h-3.5 w-3.5" />{enquiry.phone}
                          </a>
                        )}
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />{dateLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <label className="relative flex w-full shrink-0 items-center lg:w-44">
                    <span className="sr-only">Update lead status for {enquiry.name || 'lead'}</span>
                    <select
                      value={status}
                      disabled={updatingId === enquiry._id}
                      onChange={(event) => updateStatus(enquiry, event.target.value)}
                      className={`w-full appearance-none rounded-xl border py-2.5 pl-3 pr-9 text-xs font-bold capitalize outline-none transition focus:ring-2 focus:ring-amber-500/30 disabled:opacity-60 ${STATUS_STYLES[status] || STATUS_STYLES.new}`}
                    >
                      {LEAD_STATUSES.map((item) => (
                        <option key={item} value={item}>{formatStatus(item)}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 opacity-60" />
                  </label>
                </div>

                {details.length > 0 && (
                  <dl className="mt-4 grid grid-cols-1 gap-2 rounded-xl bg-slate-50 p-3 dark:bg-white/[0.03] sm:grid-cols-2 xl:grid-cols-3">
                    {details.map(([key, value]) => (
                      <div key={key} className="min-w-0">
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{formatLabel(key)}</dt>
                        <dd className="mt-0.5 break-words text-xs font-medium text-slate-700 dark:text-slate-300">{formatValue(value, key)}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {notes && (
                  <div className="mt-3 rounded-xl border border-slate-200/80 px-3.5 py-3 dark:border-white/[0.07]">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Customer notes</div>
                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-700 dark:text-slate-300">{notes}</p>
                  </div>
                )}
              </article>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-14 text-center dark:border-white/[0.12]">
              <MessageSquare className="mx-auto mb-3 h-9 w-9 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {enquiries.length ? 'No leads match these filters.' : 'No leads received yet.'}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {enquiries.length ? 'Try changing your search or clearing the filters.' : 'New service enquiries will appear here.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminLeads;
