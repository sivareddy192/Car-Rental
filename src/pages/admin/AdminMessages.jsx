import React, { useEffect, useState } from 'react';
import { FileText, Mail, Search, ChevronDown } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/contact')
      .then((res) => {
        if (res.data.success) setMessages(res.data.messages || []);
      })
      .catch(() => toast.error('Failed to load messages.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    return (
      !q ||
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner text="Loading message inbox..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-white/[0.08] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Direct Communications
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-serif">
            Contact Messages
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total {messages.length} inquiries received via contact forms
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search sender, email, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0f121d] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:outline-none focus:bg-white dark:focus:bg-[#181c2c] focus:border-amber-500"
          />
        </div>
      </div>

      {/* Messages Accordion List */}
      <div className="space-y-3">
        {filtered.map((m) => {
          const isExpanded = expanded === m._id;
          return (
            <div
              key={m._id}
              className={`rounded-2xl border bg-white dark:bg-[#141724] overflow-hidden transition-all shadow-xs ${
                isExpanded
                  ? 'border-slate-300 dark:border-amber-500/30 shadow-md ring-1 ring-slate-200 dark:ring-amber-500/20'
                  : 'border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16]'
              }`}
            >
              {/* Message Header Button */}
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : m._id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50/60 dark:hover:bg-[#181c2c]/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-sm text-slate-950 shrink-0 shadow-xs">
                  {m.name?.charAt(0)?.toUpperCase() || 'M'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{m.name}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {m.email}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 truncate">
                    {m.subject || 'Inquiry regarding luxury fleet service'}
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-3">
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    {new Date(m.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Expanded Message Content */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/40 dark:bg-[#0f121d]/60">
                  <div className="pt-4 space-y-3">
                    <div className="rounded-xl bg-white dark:bg-[#181c2c] border border-slate-200/90 dark:border-white/[0.08] p-4 text-xs text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs">
                      {m.message}
                    </div>
                    <div className="flex justify-end">
                      <a
                        href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Car Rental Concierge')}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 active:scale-[0.98]"
                      >
                        <Mail className="w-3.5 h-3.5" /> Reply to Sender
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141724] py-16 text-center shadow-xs">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">No messages in inbox.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
