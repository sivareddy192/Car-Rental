import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car as LuCar, Bike as LuBike, Zap as LuZap, Plus as LuPlus, Trash2 as LuTrash2, Clock as LuClock, CheckCircle2 as LuCheckCircle2, XCircle as LuXCircle, AlertCircle as LuAlertCircle, Search as LuSearch, RefreshCw as LuRefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import OptimizedImage from '../components/common/OptimizedImage';

const DealerFleet = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all");

    const fetchFleet = async () => {
        try {
            setLoading(true);
            const res = await Axios({ ...SummaryApi.cars.myFleet });
            if (res.data?.success) {
                setCars(res.data.data || []);
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFleet();
    }, []);

    const handleToggleAvailability = async (carId, currentStatus) => {
        const nextStatus = currentStatus === "available" ? "maintenance" : "available";
        try {
            const res = await Axios({
                ...SummaryApi.cars.toggleAvailability(carId),
                data: { status: nextStatus }
            });
            if (res.data?.success) {
                toast.success(`Vehicle status changed to ${nextStatus}.`);
                fetchFleet();
            }
        } catch (err) {
            AxiosToastError(err);
        }
    };

    const handleDeleteCar = async (carId, vehicleName) => {
        if (!window.confirm(`Are you sure you want to permanently delete "${vehicleName || 'this vehicle'}"? Active bookings will prevent deletion.`)) return;

        const previousFleet = [...cars];
        // Optimistic UI update
        setCars(prev => prev.filter(c => c._id !== carId));
        setDeletingId(carId);

        try {
            const res = await Axios({
                ...SummaryApi.cars.delete(carId)
            });
            if (res.data?.success) {
                toast.success("Vehicle and cloud media deleted successfully.");
            } else {
                setCars(previousFleet);
                toast.error(res.data?.message || "Failed to delete vehicle.");
            }
        } catch (err) {
            setCars(previousFleet);
            AxiosToastError(err);
        } finally {
            setDeletingId(null);
        }
    };

    const filteredCars = cars.filter(c => {
        const matchesSearch =
            c.vehicleDetails?.brand?.toLowerCase().includes(search.toLowerCase()) ||
            c.vehicleDetails?.model?.toLowerCase().includes(search.toLowerCase()) ||
            c.vehicleDetails?.registrationNumber?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ? true :
            c.approvalStatus === statusFilter || c.availabilityStatus === statusFilter;

        const matchesType =
            vehicleTypeFilter === "all" ? true :
            (c.vehicleType || "car") === vehicleTypeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="space-y-6 text-slate-800 dark:text-slate-100">
            {/* Top Banner & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
                                Fleet Management
                            </span>
                            <span className="text-xs text-slate-400 font-medium">({cars.length} Vehicles)</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading mt-1">
                            My Rental Vehicles
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage vehicle details, daily rental pricing, and view administrator review approvals.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/dealer/dashboard"
                            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            Dealer Hub
                        </Link>
                        <Link
                            to="/dealer/cars/add"
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                        >
                            <LuPlus className="w-4 h-4" /> Add Vehicle
                        </Link>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="relative w-full md:w-72">
                        <LuSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by brand, model, registration..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500"
                        />
                    </div>

                    {/* Vehicle Type Filter Pills */}
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
                            All ({cars.length})
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
                            <span>Cars ({cars.filter(c => (c.vehicleType || "car") === "car").length})</span>
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
                            <span>Bikes ({cars.filter(c => c.vehicleType === "bike").length})</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold outline-none"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending_approval">Pending Admin Approval</option>
                            <option value="approved">Approved & Live</option>
                            <option value="rejected">Rejected</option>
                            <option value="available">Available</option>
                            <option value="maintenance">Maintenance</option>
                        </select>

                        <button
                            type="button"
                            onClick={fetchFleet}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        >
                            <LuRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Vehicle Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-72 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        ))}
                    </div>
                ) : filteredCars.length === 0 ? (
                    <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <LuCar className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Vehicles Listed</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            You have not added any vehicles to your rental fleet yet. Click "Add Car" to submit your first vehicle.
                        </p>
                        <Link
                            to="/dealer/cars/add"
                            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                        >
                            <LuPlus className="w-4 h-4" /> Add New Car
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCars.map(car => {
                            const { vehicleDetails, rentalDetails, images, pickupInformation } = car;
                            const isApproved = car.approvalStatus === "approved";
                            const isPending = car.approvalStatus === "pending_approval";
                            const isAvailable = car.availabilityStatus === "available";

                            return (
                                <div
                                    key={car._id}
                                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Image */}
                                        <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                            {images?.frontImage ? (
                                                <OptimizedImage
                                                    src={images.frontImage}
                                                    alt={vehicleDetails?.model}
                                                    targetWidth={500}
                                                    aspectRatio="h-48 w-full"
                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <LuCar className="w-10 h-10" />
                                                </div>
                                            )}

                                            {/* Approval Badge */}
                                            <div className="absolute top-3 left-3">
                                                {isApproved ? (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-md flex items-center gap-1">
                                                        <LuCheckCircle2 className="w-3 h-3" /> Live & Approved
                                                    </span>
                                                ) : isPending ? (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md flex items-center gap-1">
                                                        <LuClock className="w-3 h-3" /> Pending Admin Review
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white shadow-md flex items-center gap-1">
                                                        <LuXCircle className="w-3 h-3" /> Rejected
                                                    </span>
                                                )}
                                            </div>

                                            {/* Category Tag */}
                                            <div className="absolute top-3 right-3">
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-md">
                                                    {vehicleDetails?.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="p-5 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-white ${
                                                            car.vehicleType === 'bike' ? 'bg-amber-600' : 'bg-blue-600'
                                                        }`}>
                                                            {car.vehicleType === 'bike' ? '🏍️ Bike' : '🚗 Car'}
                                                        </span>
                                                        <span className="text-[11px] font-semibold text-slate-400">
                                                            {vehicleDetails?.category}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                                                        {vehicleDetails?.brand} {vehicleDetails?.model}
                                                    </h3>
                                                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                                                        {vehicleDetails?.registrationNumber} &bull; {vehicleDetails?.manufacturingYear}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-black text-amber-500 text-lg">
                                                        ₹{Number(rentalDetails?.dailyPrice).toLocaleString('en-IN')}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 block font-semibold">/ day</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                                                {car.vehicleType === 'bike' && vehicleDetails?.engineCapacity && (
                                                    <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 font-bold">
                                                        ⚡ {vehicleDetails.engineCapacity}
                                                    </span>
                                                )}
                                                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                                                    {vehicleDetails?.fuelType}
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                                                    {vehicleDetails?.transmission}
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                                                    {car.vehicleType === 'bike' ? '2 Seats' : `${vehicleDetails?.seatingCapacity || 5} Seats`}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                📍 {pickupInformation?.city}, {pickupInformation?.state}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/20">
                                        {isApproved ? (
                                            <button
                                                type="button"
                                                onClick={() => handleToggleAvailability(car._id, car.availabilityStatus)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                                                    car.availabilityStatus === "booked"
                                                        ? "text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800"
                                                        : isAvailable
                                                            ? "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                                                            : "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
                                                }`}
                                            >
                                                {car.availabilityStatus === "booked"
                                                    ? "● Booked (On Rental)"
                                                    : isAvailable
                                                        ? "● Available for Booking"
                                                        : "● In Maintenance"}
                                            </button>
                                        ) : (
                                            <span className="text-[11px] text-slate-400 italic">
                                                Awaiting admin approval
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            disabled={deletingId === car._id}
                                            onClick={() => handleDeleteCar(car._id, `${vehicleDetails?.brand || ''} ${vehicleDetails?.model || ''}`)}
                                            className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer disabled:opacity-40"
                                            title="Delete vehicle listing"
                                        >
                                            {deletingId === car._id ? (
                                                <LuRefreshCw className="w-4 h-4 animate-spin text-rose-500" />
                                            ) : (
                                                <LuTrash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

        </div>
    );
};

export default DealerFleet;
