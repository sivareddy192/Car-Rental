import React, { useState, useEffect, useRef } from 'react';
import { Bell as LuBell, Check as LuCheck, CheckCheck as LuCheckCheck } from 'lucide-react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            if (!localStorage.getItem('accessToken')) return;
            const res = await Axios({
                url: '/api/notification/get',
                method: 'get'
            });
            if (res.data?.success) {
                setNotifications(res.data.data || []);
                setUnreadCount(res.data.unreadCount || 0);
            }
        } catch {
            // silent fail on notification polling
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await Axios({
                url: `/api/notification/mark-read/${id}`,
                method: 'put'
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {
            toast.error("Failed to mark as read");
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            setLoading(true);
            await Axios({
                url: '/api/notification/mark-all-read',
                method: 'put'
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
            setUnreadCount(0);
            toast.success("All notifications marked as read");
        } catch {
            toast.error("Failed to mark all as read");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                aria-label={`Notifications, ${unreadCount} unread`}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
                <LuBell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-black text-black ring-2 ring-white dark:ring-slate-900 animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                disabled={loading}
                                className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                                <LuCheckCheck className="w-4 h-4" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 my-2">
                        {notifications.length === 0 ? (
                            <div className="py-8 text-center text-slate-400 text-sm">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map(item => {
                                const isUnread = !item.isRead && !item.read;
                                return (
                                    <div
                                        key={item._id}
                                        className={`p-3 rounded-xl transition-colors ${
                                            isUnread 
                                                ? 'bg-amber-50/70 dark:bg-amber-950/20' 
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                                    {isUnread && <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />}
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                                    {item.message}
                                                </p>
                                                <span className="text-[10px] text-slate-400 mt-1 block">
                                                    {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {isUnread && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleMarkAsRead(item._id, e)}
                                                    title="Mark read"
                                                    className="p-1 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    <LuCheck className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
