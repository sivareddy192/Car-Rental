import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Car, Bike, ArrowRight, Trash2, Fuel, Gauge, Users, Sparkles } from 'lucide-react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { getImageUrl } from '../utils/getImageUrl';
import { getWishlist, toggleWishlist } from '../utils/wishlistStorage';
import toast from 'react-hot-toast';

const Wishlist = () => {
    const [wishlistIds, setWishlistIds] = useState(() => getWishlist());
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all'); // 'all', 'car', 'bike'

    // Fetch vehicles
    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const res = await Axios({ ...SummaryApi.cars.publicCars });
            if (res.data?.success) {
                setVehicles(res.data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch vehicles for wishlist:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();

        const handleWishlistUpdate = () => {
            setWishlistIds(getWishlist());
        };

        window.addEventListener('wishlist-updated', handleWishlistUpdate);
        return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    }, []);

    const handleRemove = (vehicleId, name) => {
        toggleWishlist(vehicleId);
        setWishlistIds(getWishlist());
        toast.success(`Removed ${name || 'vehicle'} from wishlist`);
    };

    // Filter vehicles by wishlistIds
    const savedVehicles = vehicles.filter(v => wishlistIds.includes(String(v._id)));

    // Filter by vehicle type (car or bike)
    const displayedVehicles = savedVehicles.filter(v => {
        if (filterType === 'all') return true;
        const vType = (v.vehicleType || 'car').toLowerCase();
        return vType === filterType;
    });

    const carCount = savedVehicles.filter(v => (v.vehicleType || 'car').toLowerCase() === 'car').length;
    const bikeCount = savedVehicles.filter(v => (v.vehicleType || 'car').toLowerCase() === 'bike').length;

    return (
        <div className="space-y-6">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
                            Wishlist Cars &amp; Bikes
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Your saved vehicles for easy booking and comparison
                    </p>
                </div>

                {/* Filter Pills */}
                {savedVehicles.length > 0 && (
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setFilterType('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                filterType === 'all'
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            All ({savedVehicles.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterType('car')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                filterType === 'car'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <Car className="w-3.5 h-3.5" />
                            <span>Cars ({carCount})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterType('bike')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                filterType === 'bike'
                                    ? 'bg-amber-600 text-white'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <Bike className="w-3.5 h-3.5" />
                            <span>Bikes ({bikeCount})</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-800" />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && savedVehicles.length === 0 && (
                <div className="py-16 px-4 text-center max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900/50">
                        <Heart className="w-8 h-8 fill-rose-500/20 stroke-rose-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        Your Wishlist is Empty
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                        Explore our verified fleet of premium cars and bikes. Tap the heart icon on any vehicle to save it here for fast booking.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            to="/cars?vehicleType=car"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                        >
                            <Car className="w-4 h-4" />
                            <span>Browse Cars</span>
                        </Link>
                        <Link
                            to="/cars?vehicleType=bike"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition"
                        >
                            <Bike className="w-4 h-4" />
                            <span>Browse Bikes</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Vehicle Grid */}
            {!loading && displayedVehicles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayedVehicles.map((vehicle) => {
                        const isBike = (vehicle.vehicleType || 'car').toLowerCase() === 'bike';
                        const imageSrc = vehicle.images?.[0] ? getImageUrl(vehicle.images[0]) : null;

                        return (
                            <div
                                key={vehicle._id}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition duration-200"
                            >
                                <div>
                                    {/* Image with badges */}
                                    <div className="relative aspect-16/10 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        {imageSrc ? (
                                            <img
                                                src={imageSrc}
                                                alt={vehicle.name}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                {isBike ? <Bike className="w-12 h-12" /> : <Car className="w-12 h-12" />}
                                            </div>
                                        )}

                                        {/* Type Badge */}
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white ${
                                                isBike ? 'bg-amber-600' : 'bg-blue-600'
                                            }`}>
                                                {isBike ? 'Bike' : 'Car'}
                                            </span>
                                            {vehicle.category && (
                                                <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-xs">
                                                    {vehicle.category}
                                                </span>
                                            )}
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(vehicle._id, vehicle.name)}
                                            title="Remove from wishlist"
                                            aria-label="Remove from wishlist"
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition active:scale-90 cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Body Specs */}
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                {vehicle.brand || 'Verified Fleet'}
                                            </span>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                                                {vehicle.name}
                                            </h3>
                                        </div>

                                        {/* Spec Pills */}
                                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-semibold text-slate-600 dark:text-slate-400 py-1.5 border-y border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center justify-center gap-1">
                                                <Fuel className="w-3 h-3 text-slate-400" />
                                                <span className="truncate">{vehicle.fuelType || 'Petrol'}</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-1 border-x border-slate-100 dark:border-slate-800 px-1">
                                                <Gauge className="w-3 h-3 text-slate-400" />
                                                <span className="truncate">{vehicle.transmission || 'Manual'}</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-1">
                                                <Users className="w-3 h-3 text-slate-400" />
                                                <span>{isBike ? '2 Seater' : `${vehicle.seatingCapacity || 5} Seats`}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer & Book Button */}
                                <div className="p-4 pt-0 flex items-center justify-between gap-3">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-medium">Daily Rate</span>
                                        <span className="text-base font-black text-slate-900 dark:text-white">
                                            ₹{Number(vehicle.pricePerDay || 0).toLocaleString('en-IN')}
                                            <span className="text-[10px] font-normal text-slate-400">/day</span>
                                        </span>
                                    </div>

                                    <Link
                                        to={`/car/${vehicle._id}`}
                                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition active:scale-95 ${
                                            isBike ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                    >
                                        <span>Book Now</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Filtered empty state */}
            {!loading && savedVehicles.length > 0 && displayedVehicles.length === 0 && (
                <div className="py-12 text-center">
                    <p className="text-sm font-semibold text-slate-500">
                        No {filterType === 'car' ? 'cars' : 'bikes'} found in your wishlist.
                    </p>
                    <button
                        type="button"
                        onClick={() => setFilterType('all')}
                        className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                        View all saved vehicles
                    </button>
                </div>
            )}

        </div>
    );
};

export default Wishlist;

