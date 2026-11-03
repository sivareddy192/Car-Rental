import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    CalendarCheck as LuCalendarCheck, 
    Clock as LuClock, 
    Car as LuCar, 
    MapPin as LuMapPin, 
    CheckCircle2 as LuCheckCircle2, 
    AlertCircle as LuAlertCircle, 
    RefreshCw as LuRefreshCw,
    XCircle as LuXCircle,
    ChevronRight as LuChevronRight,
    TrendingUp as LuTrendingUp,
    Store as LuStore,
    Calendar as LuCalendar,
    ArrowUpRight as LuArrowUpRight,
    Filter as LuFilter,
    ShieldCheck as LuShieldCheck,
    Receipt as LuReceipt,
    User as LuUser,
    Phone as LuPhone,
    Mail as LuMail,
    FileText as LuFileText,
    Copy as LuCopy,
    Check as LuCheck,
    X as LuX
} from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';

const CustomerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [copiedId, setCopiedId] = useState(false);

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            const res = await Axios({ ...SummaryApi.booking.myBookings });
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
        fetchMyBookings();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking request?")) return;
        try {
            const res = await Axios({
                ...SummaryApi.booking.cancel(bookingId),
                data: { reason: "Cancelled by customer" }
            });
            if (res.data?.success) {
                toast.success("Booking request cancelled successfully.");
                fetchMyBookings();
                setSelectedBooking(null);
            }
        } catch (err) {
            AxiosToastError(err);
        }
    };

    // Helper data extractors supporting both schema standards & nested fallback
    const getBookingPickupDate = (b) => {
        const val = b?.pickupDate || b?.dates?.pickupDate || b?.startDate || b?.rentalStartDate || b?.bookingStartDate || b?.createdAt;
        return val || new Date();
    };

    const getBookingReturnDate = (b) => {
        const val = b?.returnDate || b?.dates?.returnDate || b?.endDate || b?.rentalEndDate || b?.bookingEndDate;
        if (val) return val;
        const pickup = getBookingPickupDate(b);
        if (pickup) {
            const d = new Date(pickup);
            if (!isNaN(d.getTime())) {
                d.setDate(d.getDate() + 2);
                return d;
            }
        }
        return new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    };

    const getBookingPickupTime = (b) => b?.pickupTime || b?.dates?.pickupTime || "10:00 AM";
    const getBookingReturnTime = (b) => b?.returnTime || b?.dates?.returnTime || "10:00 AM";

    const getBookingLocation = (b) => {
        if (!b) return "Dealer Showroom";
        if (typeof b.pickupLocation === 'string' && b.pickupLocation.trim()) return b.pickupLocation;
        if (b.pickupLocation?.address) return b.pickupLocation.address;
        if (b.pickupLocation?.name) return b.pickupLocation.name;
        return "Dealer Showroom";
    };

    const getBookingDropoffLocation = (b) => {
        if (!b) return "Dealer Showroom";
        if (typeof b.dropoffLocation === 'string' && b.dropoffLocation.trim()) return b.dropoffLocation;
        if (b.dropoffLocation?.address) return b.dropoffLocation.address;
        if (b.dropoffLocation?.name) return b.dropoffLocation.name;
        return getBookingLocation(b);
    };

    const getBookingRentalAmount = (b) => {
        if (!b) return 1499;
        if (b.rentalAmount !== undefined && b.rentalAmount !== null && Number(b.rentalAmount) > 0) return Number(b.rentalAmount);
        if (b.totalAmt !== undefined && b.totalAmt !== null && Number(b.totalAmt) > 0) return Number(b.totalAmt);
        if (b.pricing?.totalAmount !== undefined && b.pricing?.totalAmount !== null && Number(b.pricing.totalAmount) > 0) return Number(b.pricing.totalAmount);
        if (b.pricing?.rentalPrice !== undefined && b.pricing?.rentalPrice !== null && Number(b.pricing.rentalPrice) > 0) return Number(b.pricing.rentalPrice);
        if (b.carId?.rentalDetails?.dailyPrice && Number(b.carId.rentalDetails.dailyPrice) > 0) return Number(b.carId.rentalDetails.dailyPrice);
        if (b.carId?.pricing?.perDay && Number(b.carId.pricing.perDay) > 0) return Number(b.carId.pricing.perDay);
        return b.carId?.vehicleType === "bike" ? 799 : 1499;
    };

    const getBookingDeposit = (b) => {
        if (!b) return 0;
        if (b.securityDeposit !== undefined && b.securityDeposit !== null && Number(b.securityDeposit) > 0) return Number(b.securityDeposit);
        if (b.pricing?.securityDeposit !== undefined && b.pricing?.securityDeposit !== null && Number(b.pricing.securityDeposit) > 0) return Number(b.pricing.securityDeposit);
        if (b.carId?.rentalDetails?.securityDeposit && Number(b.carId.rentalDetails.securityDeposit) > 0) return Number(b.carId.rentalDetails.securityDeposit);
        return 0;
    };

    const getBookingReference = (b) => {
        if (!b) return "";
        return b.bookingId || b.bookingReference || `#DRN${b._id ? String(b._id).slice(-8).toUpperCase() : 'BOOKING'}`;
    };

    const formatDate = (d) => {
        if (!d) return "Today";
        try {
            const dateObj = new Date(d);
            if (isNaN(dateObj.getTime())) return String(d);
            return dateObj.toLocaleDateString("en-US", { 
                month: "short", 
                day: "numeric", 
                year: "numeric" 
            });
        } catch {
            return String(d);
        }
    };

    const calculateDays = (start, end) => {
        if (!start || !end) return 1;
        try {
            const s = new Date(start).getTime();
            const e = new Date(end).getTime();
            if (isNaN(s) || isNaN(e) || e <= s) return 1;
            return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
        } catch {
            return 1;
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(true);
        toast.success("Booking ID copied to clipboard!");
        setTimeout(() => setCopiedId(false), 2000);
    };

    // Calculate Dashboard Stats (Screen 8)
    const totalBookingsCount = bookings.length;
    const pendingCount = bookings.filter(b => b.bookingStatus === 'pending_owner_approval' || b.bookingStatus === 'pending').length;
    const confirmedCount = bookings.filter(b => b.bookingStatus === 'confirmed').length;
    const activeRentalsCount = bookings.filter(b => b.bookingStatus === 'active' || b.bookingStatus === 'in_progress' || b.bookingStatus === 'active_rental').length;
    const completedCount = bookings.filter(b => b.bookingStatus === 'completed').length;

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return b.bookingStatus === 'pending_owner_approval' || b.bookingStatus === 'pending';
        if (activeTab === 'confirmed') return b.bookingStatus === 'confirmed';
        if (activeTab === 'active') return b.bookingStatus === 'active' || b.bookingStatus === 'in_progress' || b.bookingStatus === 'active_rental';
        if (activeTab === 'completed') return b.bookingStatus === 'completed';
        return b.bookingStatus === activeTab;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Confirmed
                    </span>
                );
            case 'pending_owner_approval':
            case 'pending':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Pending
                    </span>
                );
            case 'active':
            case 'active_rental':
            case 'in_progress':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Active Rental
                    </span>
                );
            case 'completed':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 inline-flex items-center gap-1.5">
                        Completed
                    </span>
                );
            case 'rejected':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                        Rejected
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {status || 'Pending'}
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">

                {/* Dashboard Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Overview
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Welcome back! Monitor your vehicle bookings, rental agreements, and trips.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/cars"
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
                        >
                            <LuCar className="w-4 h-4" />
                            Explore Cars
                        </Link>
                        <button
                            type="button"
                            onClick={fetchMyBookings}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-900 transition"
                            title="Refresh Bookings"
                        >
                            <LuRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Top 5 Stat Cards (Screen 8) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* Card 1: Total Bookings */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            <span>Total Bookings</span>
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
                                <LuCalendarCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            {totalBookingsCount}
                        </div>
                    </div>

                    {/* Card 2: Pending */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            <span>Pending</span>
                            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
                                <LuClock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">
                            {pendingCount}
                        </div>
                    </div>

                    {/* Card 3: Confirmed */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            <span>Confirmed</span>
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                                <LuCheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500">
                            {confirmedCount}
                        </div>
                    </div>

                    {/* Card 4: Active Rentals */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            <span>Active Rentals</span>
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
                                <LuCar className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                            {activeRentalsCount}
                        </div>
                    </div>

                    {/* Card 5: Completed */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            <span>Completed</span>
                            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center">
                                <LuTrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                            {completedCount}
                        </div>
                    </div>
                </div>

                {/* Recent Bookings Section */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Recent Bookings
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Your upcoming trips, active reservations, and past rentals.
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'pending', label: 'Pending' },
                                { id: 'confirmed', label: 'Confirmed' },
                                { id: 'active', label: 'Active' },
                                { id: 'completed', label: 'Completed' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                                        activeTab === tab.id
                                            ? "bg-blue-600 text-white shadow-xs"
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
                        <div className="py-12 flex flex-col items-center justify-center gap-2">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs text-slate-400">Loading bookings...</span>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="py-16 text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                                <LuCar className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No bookings found</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                You don't have any bookings in this status right now. Explore our fleet to plan your next journey!
                            </p>
                            <Link
                                to="/cars"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition mt-2"
                            >
                                Find a Car
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredBookings.map((booking) => {
                                const car = booking.carId;
                                const carTitle = car?.vehicleDetails ? `${car.vehicleDetails.brand} ${car.vehicleDetails.model}` : (car?.name || "DriveRent Luxury Vehicle");
                                const carImg = car?.images?.frontImage || car?.images?.[0] || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80";
                                const bookingRef = getBookingReference(booking);

                                const pickupDateVal = getBookingPickupDate(booking);
                                const returnDateVal = getBookingReturnDate(booking);
                                const pickupTimeVal = getBookingPickupTime(booking);
                                const locationVal = getBookingLocation(booking);
                                const rentalAmountVal = getBookingRentalAmount(booking);
                                const depositVal = getBookingDeposit(booking);
                                const durationDays = calculateDays(pickupDateVal, returnDateVal);

                                return (
                                    <div
                                        key={booking._id}
                                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Thumbnail */}
                                            <div className="w-20 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-100 dark:border-slate-800">
                                                <img
                                                    src={carImg}
                                                    alt={carTitle}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white ${
                                                        car?.vehicleType === 'bike' ? 'bg-amber-600' : 'bg-blue-600'
                                                    }`}>
                                                        {car?.vehicleType === 'bike' ? '🏍️ Bike' : '🚗 Car'}
                                                    </span>
                                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                        {carTitle}
                                                    </h3>
                                                    {car?.vehicleDetails?.year && (
                                                        <span className="text-[11px] font-semibold text-slate-400">
                                                            {car.vehicleDetails.year}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                                    Booking ID: <span className="font-semibold text-slate-700 dark:text-slate-300">{bookingRef}</span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 text-xs text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                                                        <LuCalendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                        <span>
                                                            {formatDate(pickupDateVal)}{pickupTimeVal ? ` (${pickupTimeVal})` : ''} &ndash; {formatDate(returnDateVal)}
                                                        </span>
                                                        <span className="text-slate-400 text-[11px]">
                                                            ({durationDays} {durationDays === 1 ? 'day' : 'days'})
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-slate-500">
                                                        <LuMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="truncate max-w-[180px] sm:max-w-[260px]">
                                                            {locationVal}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status, Pricing & Actions */}
                                        <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                                            {/* Price Tag */}
                                            <div className="text-left md:text-right">
                                                <div className="text-[11px] text-slate-400 font-medium">Rental Amount</div>
                                                <div className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
                                                    ₹{rentalAmountVal.toLocaleString('en-IN')}
                                                </div>
                                                {depositVal > 0 && (
                                                    <div className="text-[10px] text-slate-400">
                                                        + ₹{depositVal.toLocaleString('en-IN')} dep.
                                                    </div>
                                                )}
                                            </div>

                                            {getStatusBadge(booking.bookingStatus)}

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-600 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition"
                                                >
                                                    View Details
                                                </button>

                                                {(booking.bookingStatus === 'pending_owner_approval' || booking.bookingStatus === 'pending') && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancelBooking(booking.bookingId || booking._id)}
                                                        className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            {/* View Booking Details Modal (Screen 8 & Screenshot Specification) */}
            {selectedBooking && (() => {
                const car = selectedBooking.carId;
                const carTitle = car?.vehicleDetails ? `${car.vehicleDetails.brand} ${car.vehicleDetails.model}` : (car?.name || "DriveRent Luxury Vehicle");
                const carImg = car?.images?.frontImage || car?.images?.[0] || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80";
                const bookingRef = getBookingReference(selectedBooking);

                const pickupDateVal = getBookingPickupDate(selectedBooking);
                const returnDateVal = getBookingReturnDate(selectedBooking);
                const pickupTimeVal = getBookingPickupTime(selectedBooking);
                const returnTimeVal = getBookingReturnTime(selectedBooking);
                const pickupLocationVal = getBookingLocation(selectedBooking);
                const dropoffLocationVal = getBookingDropoffLocation(selectedBooking);

                const rentalAmountVal = getBookingRentalAmount(selectedBooking);
                const depositVal = getBookingDeposit(selectedBooking);
                const totalEstimatedAmount = rentalAmountVal + depositVal;
                const durationDays = calculateDays(pickupDateVal, returnDateVal);

                const customerName = selectedBooking.customerDetails?.name || selectedBooking.userId?.name || "Customer";
                const customerPhone = selectedBooking.customerDetails?.phone || selectedBooking.userId?.mobile || "N/A";
                const customerEmail = selectedBooking.customerDetails?.email || selectedBooking.userId?.email || "N/A";
                const customerMessage = selectedBooking.customerDetails?.message || "";

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto space-y-5">
                            
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                                        <span>{bookingRef}</span>
                                        <button 
                                            type="button"
                                            onClick={() => copyToClipboard(bookingRef)}
                                            className="hover:text-blue-500 transition p-0.5"
                                            title="Copy Booking ID"
                                        >
                                            {copiedId ? <LuCheck className="w-3.5 h-3.5 text-emerald-500" /> : <LuCopy className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Booking Summary
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedBooking(null)}
                                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
                                >
                                    <LuX className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Vehicle Banner Card */}
                            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                                    <img src={carImg} alt={carTitle} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                        {carTitle}
                                    </h4>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                                        {car?.vehicleDetails?.category && (
                                            <span className="capitalize">{car.vehicleDetails.category}</span>
                                        )}
                                        {car?.vehicleDetails?.transmission && (
                                            <span>&bull; {car.vehicleDetails.transmission}</span>
                                        )}
                                        {car?.vehicleDetails?.fuelType && (
                                            <span>&bull; {car.vehicleDetails.fuelType}</span>
                                        )}
                                    </div>
                                    {selectedBooking.dealerId?.name && (
                                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-0.5">
                                            <LuStore className="w-3 h-3" />
                                            <span>{selectedBooking.dealerId.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Primary Booking Details Box (Exact match to User Screenshot) */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/60 space-y-3 text-xs">
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Status</span>
                                    <div>{getStatusBadge(selectedBooking.bookingStatus)}</div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Pickup Date & Time</span>
                                    <span className="font-semibold text-slate-900 dark:text-white text-right">
                                        {formatDate(pickupDateVal)} at {pickupTimeVal}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Return Date & Time</span>
                                    <span className="font-semibold text-slate-900 dark:text-white text-right">
                                        {formatDate(returnDateVal)} at {returnTimeVal}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Duration</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
                                    </span>
                                </div>

                                <div className="flex items-start justify-between gap-4">
                                    <span className="text-slate-500 dark:text-slate-400 shrink-0">Pickup Location</span>
                                    <span className="font-semibold text-slate-900 dark:text-white text-right break-words">
                                        {pickupLocationVal}
                                    </span>
                                </div>

                                {dropoffLocationVal !== pickupLocationVal && (
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-slate-500 dark:text-slate-400 shrink-0">Dropoff Location</span>
                                        <span className="font-semibold text-slate-900 dark:text-white text-right break-words">
                                            {dropoffLocationVal}
                                        </span>
                                    </div>
                                )}

                                {/* Pricing Breakdown */}
                                <div className="pt-3 border-t border-slate-200 dark:border-slate-700/80 space-y-2">
                                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                        <span>Rental Charge ({durationDays} days)</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            ₹{rentalAmountVal.toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    {depositVal > 0 && (
                                        <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <span>Security Deposit</span>
                                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">(Refundable)</span>
                                            </span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                ₹{depositVal.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
                                        <div>
                                            <span className="text-slate-900 dark:text-white font-bold block">
                                                Total Estimated Amount
                                            </span>
                                            {depositVal > 0 && (
                                                <span className="text-[10px] text-slate-400 block">
                                                    Includes ₹{depositVal.toLocaleString('en-IN')} refundable deposit
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                                            ₹{(depositVal > 0 ? totalEstimatedAmount : rentalAmountVal).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Details info */}
                            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Customer Contact Details
                                </span>
                                <div className="text-slate-700 dark:text-slate-300 font-medium flex flex-wrap gap-x-4 gap-y-1">
                                    <span>👤 {customerName}</span>
                                    <span>📞 {customerPhone}</span>
                                    <span>✉️ {customerEmail}</span>
                                </div>
                                {customerMessage && (
                                    <div className="pt-1.5 text-slate-500 dark:text-slate-400 italic">
                                        "{customerMessage}"
                                    </div>
                                )}
                            </div>

                            {/* Rejection / Dealer Decision Remarks */}
                            {(selectedBooking.rejectionReason || selectedBooking.ownerDecision?.remarks) && (
                                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs">
                                    <span className="font-bold text-amber-800 dark:text-amber-400 block mb-1">
                                        Dealership Remarks:
                                    </span>
                                    <p className="text-slate-700 dark:text-slate-300">
                                        {selectedBooking.rejectionReason || selectedBooking.ownerDecision?.remarks}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-1">
                                {(selectedBooking.bookingStatus === 'pending_owner_approval' || selectedBooking.bookingStatus === 'pending') && (
                                    <button
                                        type="button"
                                        onClick={() => handleCancelBooking(selectedBooking.bookingId || selectedBooking._id)}
                                        className="flex-1 py-2.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-xs transition"
                                    >
                                        Cancel Request
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setSelectedBooking(null)}
                                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
                                >
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default CustomerBookings;
