import React, { useEffect, useState } from 'react';
import { CalendarCheck as LuCalendarCheck, Car as LuCar, Search as LuSearch, User as LuUser, MapPin as LuMapPin, DollarSign as LuDollarSign, RefreshCw as LuRefreshCw, Clock as LuClock, CheckCircle2 as LuCheckCircle2, XCircle as LuXCircle } from 'lucide-react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusTab, setStatusTab] = useState("all");

    const fetchAllBookings = async () => {
        try {
            setLoading(true);
            const res = await Axios({
                ...SummaryApi.booking.adminAllBookings,
                params: {
                    ...(search && { search }),
                    ...(statusTab !== "all" && { status: statusTab })
                }
            });
            if (res.data?.success) {
                setBookings(res.data.data || []);
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, [statusTab]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAllBookings();
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        Platform Booking Governance
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading mt-2">
                        Platform-Wide Booking Requests
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Monitor all rental bookings, oversee owner approval deadlines, and resolve rental disputes.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchAllBookings}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                    <LuRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            {/* Search & Tabs */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <LuSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by Booking ID, customer name, location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500"
                    />
                </form>

                <div className="flex border-b sm:border-b-0 overflow-x-auto pb-1 gap-1 text-xs">
                    {[
                        { id: 'all', label: `All (${bookings.length})` },
                        { id: 'pending_owner_approval', label: 'Pending Owner' },
                        { id: 'confirmed', label: 'Confirmed' },
                        { id: 'rejected', label: 'Rejected' },
                        { id: 'active_rental', label: 'Active Rentals' },
                        { id: 'completed', label: 'Completed' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setStatusTab(tab.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                statusTab === tab.id
                                    ? "bg-amber-500 text-slate-950 shadow-sm"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookings List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <LuCalendarCheck className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">No Bookings Found</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Booking requests will appear here in real-time as customers request rentals.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(b => {
                        const car = b.carId;
                        const isPending = b.bookingStatus === 'pending_owner_approval';
                        const isConfirmed = b.bookingStatus === 'confirmed';

                        return (
                            <div
                                key={b._id}
                                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-amber-500">{b.bookingId}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                            isConfirmed ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                                            isPending ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse" :
                                            "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                                        }`}>
                                            {b.bookingStatus.replace(/_/g, ' ')}
                                        </span>
                                    </div>

                                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                        {car?.vehicleDetails?.brand} {car?.vehicleDetails?.model} ({car?.vehicleDetails?.registrationNumber})
                                    </h3>

                                    <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                                        <span>Customer: <strong>{b.customerDetails?.name}</strong> ({b.customerDetails?.email})</span>
                                        <span>Dealer: <strong>{b.dealerId?.name || "Partner"}</strong></span>
                                        <span>Station: {b.pickupLocation}</span>
                                    </div>
                                </div>

                                <div className="text-xs text-right space-y-1 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-3 lg:pt-0 lg:pl-6">
                                    <span className="text-slate-400 block font-medium">Rental Period</span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {new Date(b.pickupDate).toLocaleDateString()} {b.pickupTime} &rarr; {new Date(b.returnDate).toLocaleDateString()} {b.returnTime}
                                    </span>
                                    <span className="font-black text-amber-500 text-base block mt-1">
                                        ₹{Number(b.rentalAmount).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
};

export default AdminBookings;
