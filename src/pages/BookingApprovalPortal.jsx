import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Check as LuCheck, X as LuX, Car as LuCar, CalendarCheck as LuCalendarCheck, Clock as LuClock, User as LuUser, Phone as LuPhone, Mail as LuMail, MapPin as LuMapPin, DollarSign as LuDollarSign, AlertCircle as LuAlertCircle, Loader2 as LuLoader2, ShieldCheck as LuShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';

const BookingApprovalPortal = () => {
    const { bookingId } = useParams();
    const user = useSelector(state => state.user);
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [conflictError, setConflictError] = useState("");

    const fetchBooking = async () => {
        try {
            setLoading(true);
            const res = await Axios({
                ...SummaryApi.booking.getById(bookingId)
            });
            if (res.data?.success) {
                setBooking(res.data.data);
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login', { state: { from: `/booking-approval/${bookingId}` } });
            return;
        }
        fetchBooking();
    }, [bookingId]);

    const handleApprove = async () => {
        try {
            setProcessing(true);
            setConflictError("");

            const res = await Axios({
                ...SummaryApi.booking.approve(bookingId)
            });

            if (res.data?.success) {
                toast.success("Booking approved and confirmed atomically!");
                fetchBooking();
            } else {
                toast.error(res.data?.message || "Failed to approve booking.");
            }
        } catch (err) {
            if (err.response?.status === 409) {
                setConflictError(err.response.data.message || "Double booking conflict! Conflicting confirmed booking exists for this vehicle.");
                toast.error("Double-booking conflict detected!");
            } else {
                AxiosToastError(err);
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        const reason = window.prompt("Please enter reason for rejecting this booking request:");
        if (reason === null) return;

        try {
            setProcessing(true);
            const res = await Axios({
                ...SummaryApi.booking.reject(bookingId),
                data: { rejectionReason: reason || "Vehicle unavailable for requested schedule." }
            });

            if (res.data?.success) {
                toast.success("Booking request rejected.");
                fetchBooking();
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 flex items-center justify-center">
                <LuLoader2 className="w-10 h-10 animate-spin text-amber-500" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 text-center">
                <h2 className="text-2xl font-bold">Booking Request Not Found</h2>
                <Link to="/" className="mt-4 inline-block text-amber-500 underline">Home</Link>
            </div>
        );
    }

    const car = booking.carId;
    const isOwner = car?.ownerId?.toString() === user?._id?.toString();
    const isDealer = booking?.dealerId?._id?.toString() === user?._id?.toString() || booking?.dealerId?.toString() === user?._id?.toString();
    const isAdmin = (user?.role || "").toLowerCase() === "admin";
    const canManage = isOwner || isDealer || isAdmin;

    const isPending = booking.bookingStatus === 'pending_owner_approval';
    const isConfirmed = booking.bookingStatus === 'confirmed';
    const isRejected = booking.bookingStatus === 'rejected';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 transition-colors flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                        <span className="text-xs font-black uppercase tracking-widest text-amber-500">
                            Authenticated Owner Approval Portal
                        </span>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white font-heading mt-1">
                            Booking Review: {booking.bookingId}
                        </h1>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isConfirmed ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                        isPending ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse" :
                        isRejected ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" :
                        "bg-slate-100 text-slate-700"
                    }`}>
                        {booking.bookingStatus.replace(/_/g, ' ')}
                    </span>
                </div>

                {/* Double-booking conflict alert banner */}
                {conflictError && (
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900 flex items-start gap-3">
                        <LuAlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-xs text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                                Double-Booking Conflict Detected
                            </h4>
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                                {conflictError} This vehicle already has another confirmed booking for the overlapping dates.
                            </p>
                        </div>
                    </div>
                )}

                {/* Vehicle & Customer Card */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-14 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                            {car?.images?.frontImage && (
                                <img src={car.images.frontImage} alt="Car" className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-black text-base text-slate-900 dark:text-white">
                                {car?.vehicleDetails?.brand} {car?.vehicleDetails?.model}
                            </h3>
                            <p className="text-xs text-slate-400 font-mono">
                                Reg: {car?.vehicleDetails?.registrationNumber} &bull; {car?.vehicleDetails?.colour}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div>
                            <span className="text-slate-400 block font-medium">Customer Name</span>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{booking.customerDetails?.name}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Contact Phone</span>
                            <span className="font-bold text-slate-900 dark:text-white">{booking.customerDetails?.phone}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Customer Email</span>
                            <span className="font-bold text-slate-900 dark:text-white">{booking.customerDetails?.email}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Pickup Station</span>
                            <span className="font-bold text-slate-900 dark:text-white">{booking.pickupLocation}</span>
                        </div>
                    </div>

                    {booking.customerDetails?.message && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                            <span className="text-slate-400 block font-medium">Customer Note:</span>
                            <p className="italic text-slate-700 dark:text-slate-300 mt-0.5">"{booking.customerDetails.message}"</p>
                        </div>
                    )}
                </div>

                {/* Rental Timing & Amount */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <div>
                        <span className="text-slate-400 block">Pickup Schedule</span>
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                            {new Date(booking.pickupDate).toLocaleDateString()}
                        </span>
                        <span className="text-slate-500 block">{booking.pickupTime}</span>
                    </div>

                    <div>
                        <span className="text-slate-400 block">Return Schedule</span>
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                            {new Date(booking.returnDate).toLocaleDateString()}
                        </span>
                        <span className="text-slate-500 block">{booking.returnTime}</span>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-400 block">Total Rental Fee</span>
                        <span className="font-black text-amber-500 text-xl font-heading">
                            ₹{Number(booking.rentalAmount).toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>

                {/* Action Buttons (Only for Verified Owner / Dealer / Admin) */}
                {canManage ? (
                    isPending ? (
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleApprove}
                                disabled={processing}
                                className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-70"
                            >
                                {processing ? <LuLoader2 className="w-4 h-4 animate-spin" /> : <LuCheck className="w-4 h-4" />}
                                APPROVE & CONFIRM BOOKING
                            </button>

                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={processing}
                                className="flex-1 py-3.5 px-6 rounded-2xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                            >
                                <LuX className="w-4 h-4" />
                                REJECT REQUEST
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-3">
                            <p className="text-xs text-slate-400">
                                This booking is already <strong>{booking.bookingStatus}</strong>.
                            </p>
                        </div>
                    )
                ) : (
                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center text-xs text-slate-500">
                        You are viewing this booking as a signed-in user. Only the verified car owner, dealer, or administrator can approve or reject this booking.
                    </div>
                )}

            </div>
        </div>
    );
};

export default BookingApprovalPortal;
