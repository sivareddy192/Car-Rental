import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    Car as LuCar, 
    Fuel as LuFuel, 
    Gauge as LuGauge, 
    Users as LuUsers, 
    MapPin as LuMapPin, 
    DollarSign as LuDollarSign, 
    CalendarCheck as LuCalendarCheck, 
    Clock as LuClock, 
    ShieldCheck as LuShieldCheck, 
    Check as LuCheck, 
    ArrowLeft as LuArrowLeft, 
    Loader2 as LuLoader2, 
    ArrowRight as LuArrowRight, 
    Star as LuStar,
    Sparkles as LuSparkles,
    CheckCircle2 as LuCheckCircle2,
    Store as LuStore,
    Phone as LuPhone,
    Share2 as LuShare2,
    Heart as LuHeart,
    Info as LuInfo,
    Lock as LuLock,
    AlertCircle as LuAlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { isWishlisted, toggleWishlist } from '../utils/wishlistStorage';
import { getOptimizedImageUrl } from '../components/common/OptimizedImage';

const CarDetails = () => {
    const { id } = useParams();
    const user = useSelector(state => state.user);
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [pricingTab, setPricingTab] = useState("daily"); // daily, weekly, monthly
    const [isSaved, setIsSaved] = useState(() => isWishlisted(id));

    useEffect(() => {
        setIsSaved(isWishlisted(id));
        const handleWishlistUpdate = () => {
            setIsSaved(isWishlisted(id));
        };
        window.addEventListener('wishlist-updated', handleWishlistUpdate);
        return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    }, [id]);

    // Booking Modal State
    const [openBookingModal, setOpenBookingModal] = useState(false);
    const [submittingBooking, setSubmittingBooking] = useState(false);

    const [bookingForm, setBookingForm] = useState({
        pickupDate: "",
        pickupTime: "10:00 AM",
        returnDate: "",
        returnTime: "10:00 AM",
        pickupLocation: "",
        dropoffLocation: "",
        customerName: user?.name || "",
        customerEmail: user?.email || "",
        customerPhone: user?.mobile || user?.phone || "",
        customerMessage: ""
    });

    useEffect(() => {
        const fetchCar = async () => {
            try {
                setLoading(true);
                const res = await Axios({
                    ...SummaryApi.cars.getById(id)
                });
                if (res.data?.success) {
                    const carData = res.data.data;
                    setCar(carData);
                    const defaultLoc = carData.pickupInformation?.pickupAddress || "Dealership Showroom";
                    setBookingForm(prev => ({
                        ...prev,
                        pickupLocation: prev.pickupLocation || defaultLoc,
                        dropoffLocation: prev.dropoffLocation || defaultLoc
                    }));
                }
            } catch (err) {
                AxiosToastError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    useEffect(() => {
        if (user?._id) {
            setBookingForm(prev => ({
                ...prev,
                customerName: user.name || prev.customerName,
                customerEmail: user.email || prev.customerEmail,
                customerPhone: user.mobile || user.phone || prev.customerPhone
            }));
        }
    }, [user]);

    // Calculate duration & estimated amount
    const calculateEstimate = () => {
        if (!bookingForm.pickupDate || !bookingForm.returnDate || !car) return null;
        const start = new Date(bookingForm.pickupDate);
        const end = new Date(bookingForm.returnDate);
        if (end <= start) return null;

        const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        const dailyRate = car.rentalDetails?.dailyPrice || 1999;
        const total = diffDays * dailyRate;
        return { diffDays, total };
    };

    const estimate = calculateEstimate();

    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        if (isBooked) {
            toast.error("This vehicle is currently booked and unavailable.");
            return;
        }

        if (!user?._id) {
            toast.error("Please sign in to submit a booking request.");
            navigate('/login', { state: { from: `/car/${id}` } });
            return;
        }

        if (!bookingForm.pickupDate || !bookingForm.returnDate) {
            toast.error("Please select both pickup and return dates.");
            return;
        }

        const start = new Date(bookingForm.pickupDate);
        const end = new Date(bookingForm.returnDate);
        if (end <= start) {
            toast.error("Return date must be later than the pickup date.");
            return;
        }

        try {
            setSubmittingBooking(true);
            const defaultLoc = car.pickupInformation?.pickupAddress || "Dealership Showroom";
            const payload = {
                carId: car._id,
                pickupDate: bookingForm.pickupDate,
                pickupTime: bookingForm.pickupTime || "10:00 AM",
                returnDate: bookingForm.returnDate,
                returnTime: bookingForm.returnTime || "10:00 AM",
                pickupLocation: bookingForm.pickupLocation || defaultLoc,
                dropoffLocation: bookingForm.dropoffLocation || defaultLoc,
                customerName: bookingForm.customerName || user?.name || "Customer",
                customerEmail: bookingForm.customerEmail || user?.email || "customer@example.com",
                customerPhone: bookingForm.customerPhone || user?.mobile || "+919876543210",
                customerMessage: bookingForm.customerMessage || ""
            };

            const res = await Axios({
                ...SummaryApi.booking.create,
                data: payload
            });

            if (res.data?.success) {
                toast.success(res.data.message || "Booking request submitted successfully!");
                setOpenBookingModal(false);
                navigate('/my-bookings');
            } else {
                toast.error(res.data?.message || "Failed to submit booking request.");
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setSubmittingBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex items-center justify-center p-6 text-slate-800 dark:text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading vehicle details...</p>
                </div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] py-16 px-4 text-center text-slate-800 dark:text-white">
                <h2 className="text-2xl font-bold mb-2">Vehicle Not Found</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    The car you are looking for is no longer active or has been removed from the fleet.
                </p>
                <Link to="/cars" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-md">
                    Back to Fleet Catalog
                </Link>
            </div>
        );
    }

    const { vehicleDetails, rentalDetails, images, pickupInformation, rentalShop } = car;
    const isBike = car?.vehicleType === "bike";
    const isBooked = car?.availabilityStatus === "booked" || car?.isBooked || car?.currentBooking?.bookingStatus === "confirmed";
    
    // Fallback images if list is partial
    const defaultGallery = [
        images?.frontImage || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
        images?.rearImage || "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
        images?.leftSideImage || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        images?.rightSideImage || "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
        ...(images?.interiorImages || [])
    ].filter(Boolean);

    const gallery = defaultGallery.length > 0 ? defaultGallery : [
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
    ];

    const dailyPrice = rentalDetails?.dailyPrice || 1999;
    const weeklyPrice = Math.round(dailyPrice * 6.5);
    const monthlyPrice = Math.round(dailyPrice * 24);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors">
            {/* Top Bar / Breadcrumb */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur sticky top-16 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <Link
                        to={`/cars${isBike ? "?vehicleType=bike" : ""}`}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                        <LuArrowLeft className="w-4 h-4" />
                        Back to {isBike ? "Bikes" : "Cars"}
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                const added = toggleWishlist(id);
                                setIsSaved(added);
                                toast.success(added ? "Saved to your wishlist!" : "Removed from wishlist");
                            }}
                            className={`p-2 rounded-full border transition cursor-pointer ${
                                isSaved 
                                    ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900/60" 
                                    : "border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
                            }`}
                        >
                            <LuHeart className={`w-4 h-4 ${isSaved ? "fill-rose-600" : ""}`} />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied to clipboard!");
                            }}
                            className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                        >
                            <LuShare2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* 2-Column Showcase (Matches Screen 7) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Gallery & Thumbnails (7 Cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* Main Large Image */}
                        <div className="relative h-80 sm:h-[460px] w-full rounded-3xl bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                            <img
                                src={getOptimizedImageUrl(gallery[activeImage] || gallery[0], 1200)}
                                alt={vehicleDetails?.model}
                                loading="eager"
                                fetchPriority="high"
                                decoding="async"
                                className="w-full h-full object-cover transition-all duration-500"
                            />

                            {/* Floating Category Pill */}
                            <div className="absolute top-4 left-4 flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                                    {(vehicleDetails?.category === "Scooter" ? "Activa" : vehicleDetails?.category) || "SUV"}
                                </span>
                                {isBooked ? (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                        Booked / Not Available
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur shadow-sm flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        Available
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Strip (4-5 thumbnails underneath) */}
                        {gallery.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                {gallery.slice(0, 5).map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActiveImage(idx)}
                                        className={`h-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                                            activeImage === idx
                                                ? "border-blue-600 scale-[0.98] shadow-md ring-2 ring-blue-500/20"
                                                : "border-transparent opacity-75 hover:opacity-100"
                                        }`}
                                    >
                                        <img
                                            src={getOptimizedImageUrl(img, 240)}
                                            alt={`Thumb ${idx + 1}`}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Vehicle Overview & Features */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm mt-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Vehicle Overview & Features
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                {vehicleDetails?.description || `Premium ${vehicleDetails?.brand || 'DriveRent'} ${vehicleDetails?.model || 'Vehicle'} maintained to perfection. Features top-tier comfort, exceptional fuel efficiency, spacious luggage storage, and modern connectivity features ideal for both city commuting and long-distance road trips.`}
                            </p>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Key Features</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-700 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <LuCheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span>Touchscreen Infotainment</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LuCheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span>Apple CarPlay / Android Auto</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LuCheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span>Rear Parking Camera</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LuCheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span>Cruise Control</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LuCheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span>Airbags & ABS</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LuCheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span>Keyless Push Start</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rental Policies */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Rental Terms & Policies
                            </h3>
                            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                                    <span><strong>Driver Eligibility:</strong> Valid driving license required. Minimum age requirement is 21 years.</span>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                                    <span><strong>Fuel Policy:</strong> Full-to-full. Vehicle is supplied with a full tank and must be returned with a full tank.</span>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                                    <span><strong>Cancellation:</strong> 100% free cancellation up to 24 hours prior to scheduled pickup time.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Title, Specs Chips, Pricing Card, Book CTA (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                            {/* Title & Rating */}
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white ${
                                        isBike ? "bg-amber-600" : "bg-blue-600"
                                    }`}>
                                        {isBike ? "🏍️ Bike / 2-Wheeler" : "🚗 Car"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                        {vehicleDetails?.brand} {vehicleDetails?.model}
                                    </h1>
                                    <div className="flex items-center gap-1 text-sm font-semibold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900/60">
                                        <LuStar className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span>4.8</span>
                                        <span className="text-xs text-slate-400">(36 reviews)</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                    {((vehicleDetails?.category === "Scooter" ? "Activa" : vehicleDetails?.category) || (isBike ? "Cruiser" : "SUV"))} • {vehicleDetails?.manufacturingYear || 2023}
                                </p>
                            </div>

                            {/* Spec Tags / Chips (Horizontal Row with Icons - Adapted for Bike vs Car) */}
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 py-4 border-y border-slate-100 dark:border-slate-800 text-center text-xs">
                                {isBike ? (
                                    <>
                                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center justify-center gap-1">
                                            <LuGauge className="w-4 h-4 text-amber-600" />
                                            <span className="font-bold text-slate-900 dark:text-white">{vehicleDetails?.engineCapacity || "350 cc"}</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center justify-center gap-1">
                                            <LuShieldCheck className="w-4 h-4 text-emerald-600" />
                                            <span className="font-bold text-slate-900 dark:text-white">Helmets Inc.</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center justify-center gap-1">
                                            <LuFuel className="w-4 h-4 text-blue-600" />
                                            <span className="font-bold text-slate-900 dark:text-white">{vehicleDetails?.fuelType || "Petrol"}</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center justify-center gap-1">
                                            <LuClock className="w-4 h-4 text-blue-600" />
                                            <span className="font-bold text-slate-900 dark:text-white">{vehicleDetails?.transmission || "Manual"}</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center justify-center gap-1">
                                            <LuUsers className="w-4 h-4 text-blue-600" />
                                            <span className="font-bold text-slate-900 dark:text-white">2 Seats</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center justify-center gap-1">
                                            <LuUsers className="w-4 h-4 text-blue-600" />
                                            <span className="font-bold text-slate-900 dark:text-white">{vehicleDetails?.seatingCapacity || 5} Seats</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center justify-center gap-1">
                                            <LuFuel className="w-4 h-4 text-blue-600" />
                                            <span className="font-bold text-slate-900 dark:text-white">{vehicleDetails?.fuelType || "Petrol"}</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center justify-center gap-1">
                                            <LuGauge className="w-4 h-4 text-blue-600" />
                                            <span className="font-bold text-slate-900 dark:text-white">{vehicleDetails?.transmission || "Automatic"}</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center justify-center gap-1">
                                            <LuClock className="w-4 h-4 text-blue-600" />
                                            <span className="font-bold text-slate-900 dark:text-white">{vehicleDetails?.fuelEfficiency || "17 km/l"}</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center justify-center gap-1">
                                            <LuCar className="w-4 h-4 text-blue-600" />
                                            <span className="font-bold text-slate-900 dark:text-white">{vehicleDetails?.doors || 5} Doors</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Prominent Price & Book Now Button */}
                            <div className="space-y-4">
                                <div className="flex items-baseline justify-between">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                                            ₹{Number(dailyPrice).toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/day</span>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        +₹19/km extra
                                    </span>
                                </div>

                                {isBooked ? (
                                    <div className="space-y-3">
                                        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
                                            <LuAlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-sm">Vehicle Currently Booked</p>
                                                <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
                                                    This car has an active confirmed booking approved by the dealer. It is currently not available for new reservations.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            disabled
                                            className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-sm cursor-not-allowed border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
                                        >
                                            <LuLock className="w-4 h-4" />
                                            Vehicle Not Available (Booked)
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setOpenBookingModal(true)}
                                        className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                                    >
                                        <LuCalendarCheck className="w-5 h-5" />
                                        Book This Car
                                    </button>
                                )}
                            </div>

                            {/* Rental Pricing Card (Tabs & Breakdown - Screen 7) */}
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Rental Pricing
                                    </h4>
                                    <div className="flex items-center gap-1 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => setPricingTab("daily")}
                                            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                                                pricingTab === "daily"
                                                    ? "bg-blue-600 text-white shadow-xs"
                                                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                            }`}
                                        >
                                            Daily
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPricingTab("weekly")}
                                            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                                                pricingTab === "weekly"
                                                    ? "bg-blue-600 text-white shadow-xs"
                                                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                            }`}
                                        >
                                            Weekly
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPricingTab("monthly")}
                                            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                                                pricingTab === "monthly"
                                                    ? "bg-blue-600 text-white shadow-xs"
                                                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                            }`}
                                        >
                                            Monthly
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2.5 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 dark:text-slate-400 capitalize">{pricingTab} Rate</span>
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                                            ₹{pricingTab === "daily" 
                                                ? Number(dailyPrice).toLocaleString('en-IN') 
                                                : pricingTab === "weekly" 
                                                    ? Number(weeklyPrice).toLocaleString('en-IN') 
                                                    : Number(monthlyPrice).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 dark:text-slate-400">Security Deposit</span>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            ₹{Number(rentalDetails?.securityDeposit || 5000).toLocaleString('en-IN')}{" "}
                                            <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400">(Refundable)</span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 dark:text-slate-400">Extra Kilometre Charge</span>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            ₹19 per km
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Dealership Attribution Card */}
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold">
                                            <LuStore className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {rentalShop?.name || "DriveHub Rentals"}
                                                </h4>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-semibold">
                                                    Verified
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                <LuMapPin className="w-3 h-3 text-blue-500" />
                                                <span>{pickupInformation?.city || "Bangalore"} • 2.5 km away</span>
                                            </p>
                                        </div>
                                    </div>

                                    {rentalShop?.shopId && (
                                        <Link
                                            to={`/shop/${rentalShop.shopId}`}
                                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            View Hub
                                        </Link>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>

            {/* BOOKING MODAL */}
            {openBookingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
                        
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Booking Request</span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {vehicleDetails?.brand} {vehicleDetails?.model}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpenBookingModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                            
                            {/* Dates Row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Pickup Date *</label>
                                    <input
                                        type="date"
                                        value={bookingForm.pickupDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setBookingForm(p => ({ ...p, pickupDate: e.target.value }))}
                                        required
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Pickup Time *</label>
                                    <input
                                        type="text"
                                        value={bookingForm.pickupTime}
                                        onChange={(e) => setBookingForm(p => ({ ...p, pickupTime: e.target.value }))}
                                        required
                                        placeholder="10:00 AM"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Return Date *</label>
                                    <input
                                        type="date"
                                        value={bookingForm.returnDate}
                                        min={bookingForm.pickupDate || new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setBookingForm(p => ({ ...p, returnDate: e.target.value }))}
                                        required
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Return Time *</label>
                                    <input
                                        type="text"
                                        value={bookingForm.returnTime}
                                        onChange={(e) => setBookingForm(p => ({ ...p, returnTime: e.target.value }))}
                                        required
                                        placeholder="10:00 AM"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>

                            {/* Estimate Summary if dates chosen */}
                            {estimate && (
                                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
                                    <div>
                                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                                            {estimate.diffDays} Day{estimate.diffDays > 1 ? 's' : ''} Rental
                                        </span>
                                        <span className="block text-[11px] text-slate-500">
                                            ₹{dailyPrice} &times; {estimate.diffDays} days
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                                            ₹{estimate.total.toLocaleString('en-IN')}
                                        </span>
                                        <span className="block text-[10px] text-slate-500">+ ₹{rentalDetails?.securityDeposit || 5000} deposit</span>
                                    </div>
                                </div>
                            )}

                            {/* Contact Info Row */}
                            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div>
                                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        value={bookingForm.customerName}
                                        onChange={(e) => setBookingForm(p => ({ ...p, customerName: e.target.value }))}
                                        required
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Email *</label>
                                        <input
                                            type="email"
                                            value={bookingForm.customerEmail}
                                            onChange={(e) => setBookingForm(p => ({ ...p, customerEmail: e.target.value }))}
                                            required
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Mobile Number *</label>
                                        <input
                                            type="tel"
                                            value={bookingForm.customerPhone}
                                            onChange={(e) => setBookingForm(p => ({ ...p, customerPhone: e.target.value }))}
                                            required
                                            placeholder="+91 98765 43210"
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Message / Special Requests */}
                            <div>
                                <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Trip Details / Special Requests</label>
                                <textarea
                                    rows="2"
                                    value={bookingForm.customerMessage}
                                    onChange={(e) => setBookingForm(p => ({ ...p, customerMessage: e.target.value }))}
                                    placeholder="e.g. Flight arrival time, child seat requirement..."
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submittingBooking}
                                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {submittingBooking ? (
                                    <>
                                        <LuLoader2 className="w-4 h-4 animate-spin" />
                                        Submitting Request...
                                    </>
                                ) : (
                                    <>
                                        <LuCheck className="w-4 h-4" />
                                        Confirm & Submit Request
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarDetails;
