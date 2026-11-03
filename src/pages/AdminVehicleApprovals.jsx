import React, { useEffect, useState, useCallback } from 'react';
import { Car as LuCar, Bike as LuBike, Check as LuCheck, X as LuX, Clock as LuClock, CheckCircle2 as LuCheckCircle2, XCircle as LuXCircle, ExternalLink as LuExternalLink, RefreshCw as LuRefreshCw, MapPin as LuMapPin, DollarSign as LuDollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';

const AdminVehicleApprovals = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending_approval');
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
    const [processingId, setProcessingId] = useState(null);

    const fetchApprovals = useCallback(async () => {
        try {
            setLoading(true);
            const res = await Axios({
                ...SummaryApi.cars.adminApprovals,
                params: {
                    ...(statusFilter !== 'all' && { status: statusFilter })
                }
            });
            if (res.data?.success) {
                setVehicles(res.data.data || []);
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchApprovals();
    }, [fetchApprovals]);

    const handleReview = async (carId, action) => {
        let remarks = "";
        if (action === "reject") {
            const reason = window.prompt("Enter reason for rejecting this vehicle listing:");
            if (reason === null) return;
            remarks = reason;
        }

        try {
            setProcessingId(carId);
            const res = await Axios({
                ...SummaryApi.cars.adminReview(carId),
                data: { action, remarks }
            });

            if (res.data?.success) {
                toast.success(res.data.message || `Vehicle ${action}ed!`);
                fetchApprovals();
            } else {
                toast.error(res.data?.message || "Failed to update approval.");
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setProcessingId(null);
        }
    };

    const displayedVehicles = vehicles.filter(v => {
        if (vehicleTypeFilter === 'all') return true;
        return (v.vehicleType || 'car') === vehicleTypeFilter;
    });

    const pendingCount = vehicles.filter(v => v.approvalStatus === 'pending_approval').length;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        Fleet Compliance &bull; {pendingCount} Pending
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading mt-2">
                        Vehicle Listing Approvals
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Inspect vehicle documents, verify photos, and approve cars &amp; bikes into the public rental catalog.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Vehicle Type Tabs */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80">
                        <button
                            type="button"
                            onClick={() => setVehicleTypeFilter("all")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                vehicleTypeFilter === "all"
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                                    : "text-slate-600 dark:text-slate-300"
                            }`}
                        >
                            All ({vehicles.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setVehicleTypeFilter("car")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                vehicleTypeFilter === "car"
                                    ? "bg-blue-600 text-white shadow-xs"
                                    : "text-slate-600 dark:text-slate-300"
                            }`}
                        >
                            <LuCar className="w-3.5 h-3.5" />
                            <span>Cars ({vehicles.filter(v => (v.vehicleType || "car") === "car").length})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setVehicleTypeFilter("bike")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                vehicleTypeFilter === "bike"
                                    ? "bg-amber-600 text-white shadow-xs"
                                    : "text-slate-600 dark:text-slate-300"
                            }`}
                        >
                            <LuBike className="w-3.5 h-3.5" />
                            <span>Bikes ({vehicles.filter(v => v.vehicleType === "bike").length})</span>
                        </button>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold outline-none"
                    >
                        <option value="pending_approval">Pending Review Only</option>
                        <option value="approved">Approved Vehicles</option>
                        <option value="rejected">Rejected Vehicles</option>
                        <option value="all">All Vehicles</option>
                    </select>

                    <button
                        type="button"
                        onClick={fetchApprovals}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                        <LuRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Vehicle List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-44 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : displayedVehicles.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <LuCar className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">No Vehicles In This Category</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Vehicles submitted by dealers will appear here for review.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedVehicles.map(car => {
                        const { vehicleDetails, rentalDetails, images, documents, pickupInformation, dealerId } = car;
                        const isPending = car.approvalStatus === 'pending_approval';
                        const isApproved = car.approvalStatus === 'approved';

                        return (
                            <div
                                key={car._id}
                                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-24 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                                        {images?.frontImage ? (
                                            <img src={images.frontImage} alt="Vehicle" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400"><LuCar /></div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-white ${
                                                car.vehicleType === 'bike' ? 'bg-amber-600' : 'bg-blue-600'
                                            }`}>
                                                {car.vehicleType === 'bike' ? '🏍️ Bike' : '🚗 Car'}
                                            </span>
                                            <span className="font-mono text-xs font-bold text-slate-400">
                                                {vehicleDetails?.registrationNumber}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                isApproved ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                                                isPending ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse" :
                                                "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                            }`}>
                                                {car.approvalStatus.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                            {vehicleDetails?.brand} {vehicleDetails?.model} ({vehicleDetails?.manufacturingYear})
                                        </h3>

                                        <p className="text-xs text-slate-500">
                                            Dealer: <strong>{dealerId?.name || car.ownerName}</strong> &bull; {dealerId?.email || car.ownerEmail} &bull; 📞 {car.ownerPhone}
                                        </p>

                                        <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
                                            <span>Category: <strong>{vehicleDetails?.category}</strong></span>
                                            <span>&bull;</span>
                                            <span>Daily Price: <strong className="text-amber-500">₹{rentalDetails?.dailyPrice}</strong></span>
                                            <span>&bull;</span>
                                            <span>Station: {pickupInformation?.city}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Documents Verification */}
                                <div className="text-xs space-y-1.5 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-3 lg:pt-0 lg:pl-6">
                                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Vehicle Documents</span>
                                    <div className="flex flex-wrap gap-2">
                                        {documents?.registrationCertificateUrl && (
                                            <a
                                                href={documents.registrationCertificateUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-amber-600 flex items-center gap-1 hover:underline"
                                            >
                                                RC Proof <LuExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                        {documents?.insuranceCertificateUrl && (
                                            <a
                                                href={documents.insuranceCertificateUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-amber-600 flex items-center gap-1 hover:underline"
                                            >
                                                Insurance <LuExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                                    {isPending ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => handleReview(car._id, 'approve')}
                                                disabled={processingId === car._id}
                                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                                            >
                                                <LuCheck className="w-4 h-4" /> Approve Listing
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleReview(car._id, 'reject')}
                                                disabled={processingId === car._id}
                                                className="px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                            >
                                                <LuX className="w-4 h-4" /> Reject
                                            </button>
                                        </>
                                    ) : isApproved ? (
                                        <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                                            <LuCheckCircle2 className="w-4 h-4" /> Publicly Available
                                        </span>
                                    ) : (
                                        <span className="text-xs text-rose-500 font-bold flex items-center gap-1">
                                            <LuXCircle className="w-4 h-4" /> Listing Rejected
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
};

export default AdminVehicleApprovals;
