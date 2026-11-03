import React, { useEffect, useState } from 'react';
import { CalendarCheck as LuCalendarCheck, Check as LuCheck, X as LuX, Clock as LuClock, Car as LuCar, User as LuUser, MapPin as LuMapPin, DollarSign as LuDollarSign, RefreshCw as LuRefreshCw, AlertCircle as LuAlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';

const DealerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterTab, setFilterTab] = useState('pending_owner_approval');
    const [processingId, setProcessingId] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await Axios({ ...SummaryApi.booking.dealerBookings });
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
        fetchBookings();
    }, []);

    // Owner / Dealer Approves Booking
    const handleApprove = async (bookingId) => {
        try {
            setProcessingId(bookingId);
            const res = await Axios({
                ...SummaryApi.booking.approve(bookingId)
            });

            if (res.data?.success) {
                toast.success("Booking approved and confirmed atomically! Customer notified.");
                fetchBookings();
            } else {
                toast.error(res.data?.message || "Failed to approve booking.");
            }
        } catch (err) {
            if (err.response?.status === 409) {
                toast.error(err.response.data.message || "Double booking conflict! Conflicting confirmed booking exists.");
            } else {
                AxiosToastError(err);
            }
        } finally {
            setProcessingId(null);
        }
    };

    // Owner / Dealer Rejects Booking
    const handleReject = async (bookingId) => {
        const reason = window.prompt("Please enter rejection reason (e.g., Vehicle undergoing routine maintenance):");
        if (reason === null) return; // cancelled prompt

        try {
            setProcessingId(bookingId);
            const res = await Axios({
                ...SummaryApi.booking.reject(bookingId),
                data: { rejectionReason: reason || "Vehicle unavailable for the requested schedule." }
            });

            if (res.data?.success) {
                toast.success("Booking request rejected.");
                fetchBookings();
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setProcessingId(null);
        }
    };

    // Dealer records vehicle handover (Status becomes active_rental)
    const handleHandover = async (bookingId) => {
        const odo = window.prompt("Enter vehicle starting odometer reading (km) or leave blank:");
        if (odo === null) return;
        try {
            setProcessingId(bookingId);
            const res = await Axios({
                ...SummaryApi.booking.handover(bookingId),
                data: { odometerReading: Number(odo) || 0, notes: "Customer verified and vehicle handed over." }
            });
            if (res.data?.success) {
                toast.success("Vehicle handed over successfully! Rental is now Active.");
                fetchBookings();
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setProcessingId(null);
        }
    };

    // Dealer records vehicle return & completion
    const handleReturn = async (bookingId) => {
        const odo = window.prompt("Enter vehicle return odometer reading (km):");
        if (odo === null) return;
        const extra = window.prompt("Enter any additional charges (late fee / fuel / damages in ₹) or 0:", "0");
        if (extra === null) return;
        try {
            setProcessingId(bookingId);
            const res = await Axios({
                ...SummaryApi.booking.completeReturn(bookingId),
                data: {
                    odometerReading: Number(odo) || 0,
                    additionalCharges: Number(extra) || 0,
                    notes: "Vehicle returned, inspected and verified."
                }
            });
            if (res.data?.success) {
                toast.success("Vehicle returned and inspection completed! Vehicle availability restored.");
                fetchBookings();
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setProcessingId(null);
        }
    };

    const filteredList = bookings.filter(b => {
        if (filterTab === 'all') return true;
        return b.bookingStatus === filterTab;
    });

    const pendingCount = bookings.filter(b => b.bookingStatus === 'pending_owner_approval').length;
    const confirmedCount = bookings.filter(b => b.bookingStatus === 'confirmed').length;

    return (
        <div className="space-y-6 text-slate-800 dark:text-slate-100">
            {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
                                Owner Approvals
                            </span>
                            {pendingCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-black animate-pulse">
                                    {pendingCount} Pending Approval
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading mt-1">
                            Booking Requests & Approvals
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            As the vehicle owner/dealer, verify schedules and approve or reject customer rental requests.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fetchBookings}
                        className="self-start sm:self-center px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                    >
                        <LuRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 gap-2">
                    {[
                        { id: 'pending_owner_approval', label: `Pending Approval (${pendingCount})` },
                        { id: 'confirmed', label: `Confirmed (${confirmedCount})` },
                        { id: 'active_rental', label: 'Active Rentals' },
                        { id: 'completed', label: 'Completed' },
                        { id: 'rejected', label: 'Rejected' },
                        { id: 'all', label: `All Requests (${bookings.length})` }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setFilterTab(tab.id)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                                filterTab === tab.id
                                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Booking Requests List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        ))}
                    </div>
                ) : filteredList.length === 0 ? (
                    <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <LuCalendarCheck className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Bookings In This Category</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Booking requests for your fleet vehicles will appear here in real-time.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredList.map(booking => {
                            const car = booking.carId;
                            const isPending = booking.bookingStatus === 'pending_owner_approval';
                            const isConfirmed = booking.bookingStatus === 'confirmed';
                            const isProcessing = processingId === booking.bookingId;

                            return (
                                <div
                                    key={booking._id}
                                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                                >
                                    {/* Left: Car & Customer Info */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                                            {car?.images?.frontImage ? (
                                                <img src={car.images.frontImage} alt="Car" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400"><LuCar /></div>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-amber-500">{booking.bookingId}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    isConfirmed ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                                                    isPending ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" :
                                                    "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                                                }`}>
                                                    {booking.bookingStatus.replace(/_/g, ' ')}
                                                </span>
                                            </div>

                                            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
                                                {car?.vehicleDetails?.brand} {car?.vehicleDetails?.model}
                                                <span className="text-xs text-slate-400 font-normal ml-2">({car?.vehicleDetails?.registrationNumber})</span>
                                            </h3>

                                            <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                                                <span>👤 <strong>{booking.customerDetails?.name}</strong></span>
                                                <span>📞 {booking.customerDetails?.phone}</span>
                                                <span>✉️ {booking.customerDetails?.email}</span>
                                            </div>

                                            {booking.customerDetails?.message && (
                                                <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                                                    "{booking.customerDetails.message}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Middle: Rental Schedule & Amount */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6 text-xs">
                                        <div>
                                            <span className="text-slate-400 block font-medium">Pickup</span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {new Date(booking.pickupDate).toLocaleDateString()}
                                            </span>
                                            <span className="text-slate-500 block">{booking.pickupTime}</span>
                                        </div>

                                        <div>
                                            <span className="text-slate-400 block font-medium">Return</span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {new Date(booking.returnDate).toLocaleDateString()}
                                            </span>
                                            <span className="text-slate-500 block">{booking.returnTime}</span>
                                        </div>

                                        <div className="col-span-2 sm:col-span-1">
                                            <span className="text-slate-400 block font-medium">Total Amount</span>
                                            <span className="font-black text-amber-500 text-base">
                                                ₹{Number(booking.rentalAmount).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Owner Actions */}
                                    {isPending && (
                                        <div className="flex sm:flex-col gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                                            <button
                                                type="button"
                                                onClick={() => handleApprove(booking.bookingId)}
                                                disabled={isProcessing}
                                                className="flex-1 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-70"
                                            >
                                                <LuCheck className="w-4 h-4" />
                                                APPROVE BOOKING
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleReject(booking.bookingId)}
                                                disabled={isProcessing}
                                                className="flex-1 px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer disabled:opacity-70"
                                            >
                                                <LuX className="w-4 h-4" />
                                                REJECT
                                            </button>
                                        </div>
                                    )}

                                    {isConfirmed && (
                                        <div className="flex flex-col sm:items-end gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                                <LuCheck className="w-4 h-4" /> Confirmed
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleHandover(booking.bookingId)}
                                                disabled={isProcessing}
                                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-70"
                                            >
                                                <LuCar className="w-3.5 h-3.5" />
                                                HANDOVER VEHICLE
                                            </button>
                                        </div>
                                    )}

                                    {(booking.bookingStatus === 'active_rental' || booking.bookingStatus === 'active') && (
                                        <div className="flex flex-col sm:items-end gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                                            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 animate-pulse">
                                                <LuCar className="w-4 h-4" /> On Road • Active Rental
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleReturn(booking.bookingId)}
                                                disabled={isProcessing}
                                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-70"
                                            >
                                                <LuCheck className="w-3.5 h-3.5" />
                                                COMPLETE RETURN
                                            </button>
                                        </div>
                                    )}

                                    {booking.bookingStatus === 'completed' && (
                                        <div className="shrink-0 text-right">
                                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 justify-end">
                                                <LuCheck className="w-4 h-4" /> Rental Completed
                                            </span>
                                            <span className="text-[10px] text-slate-400 block">
                                                Vehicle returned & available
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

        </div>
    );
};

export default DealerBookings;
