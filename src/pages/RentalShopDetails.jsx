import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { 
    MapPin, 
    Phone, 
    Mail, 
    Star, 
    ShieldCheck, 
    Clock, 
    Car as CarIcon, 
    Navigation, 
    MessageSquare, 
    CheckCircle, 
    ChevronLeft,
    Calendar,
    Fuel,
    Gauge,
    Users,
    Sparkles,
    Camera
} from "lucide-react";
import toast from "react-hot-toast";

const SAMPLE_REVIEWS = [
    {
        id: 1,
        author: "Rahul Sharma",
        rating: 5,
        date: "2 days ago",
        comment: "Excellent service! Car was completely clean, fully fueled, and delivered right on time. Highly recommended rental shop in HSR Layout."
    },
    {
        id: 2,
        author: "Priya Patel",
        rating: 4.5,
        date: "1 week ago",
        comment: "Seamless pickup and return experience. The staff was professional and transparent with the security deposit refund."
    },
    {
        id: 3,
        author: "Anil Verma",
        rating: 5,
        date: "2 weeks ago",
        comment: "Booked a Kia Seltos for a weekend getaway to Coorg. Vehicle condition was brand new. Will definitely book again!"
    }
];

const DEFAULT_SHOP_PHOTOS = [
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80"
];

const RentalShopDetails = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("cars"); // overview, cars, reviews, photos

    useEffect(() => {
        const fetchShopDetails = async () => {
            try {
                setLoading(true);
                const reqConfig = typeof SummaryApi.rentalShops?.getById === 'function'
                    ? SummaryApi.rentalShops.getById(shopId)
                    : { url: `/api/onboarding/public/shops/${shopId}`, method: 'get' };

                const res = await Axios(reqConfig);

                if (res.data?.success && res.data.data) {
                    setShop(res.data.data);
                    setCars(res.data.cars || res.data.data.availableCars || []);
                } else {
                    toast.error(res.data?.message || "Failed to load rental shop.");
                }
            } catch (err) {
                console.error("Shop fetch error:", err);
                toast.error("Could not load rental shop details.");
            } finally {
                setLoading(false);
            }
        };

        if (shopId) {
            fetchShopDetails();
        }
    }, [shopId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex items-center justify-center p-6 text-slate-800 dark:text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading rental shop profile...</p>
                </div>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex items-center justify-center p-6 text-slate-800 dark:text-white">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-2">Shop Not Found</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        The rental shop you are looking for does not exist or may have been updated.
                    </p>
                    <button
                        onClick={() => navigate("/rental-shops")}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-md"
                    >
                        Browse Rental Shops
                    </button>
                </div>
            </div>
        );
    }

    const shopPhotos = shop.photos && shop.photos.length > 0 ? shop.photos : DEFAULT_SHOP_PHOTOS;
    const bannerImage = shopPhotos[0];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors duration-200">
            {/* Top Navigation Bar / Breadcrumb */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur sticky top-16 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Shops
                    </button>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                        DriveRent Certified Dealer • ID: <span className="font-mono">{shop.applicationId || shop._id?.slice(-6)}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Storefront Header Card */}
                <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
                    {/* Storefront Hero Photo */}
                    <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-950">
                        <img
                            src={bannerImage}
                            alt={shop.name}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

                        {/* Storefront Floating Pill */}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                                {shop.operatingHours || "Open • Closes 9:00 PM"}
                            </span>
                            {shop.verified && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600/90 text-white backdrop-blur shadow-sm">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    DriveRent Certified
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Storefront Details Section */}
                    <div className="p-6 sm:p-8 relative">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                        {shop.name}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                                        <CheckCircle className="w-3.5 h-3.5 fill-blue-600 text-white dark:fill-blue-400 dark:text-slate-900" />
                                        Verified
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-1 font-semibold text-amber-500">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span>{shop.rating || 4.6}</span>
                                        <span className="text-slate-400 dark:text-slate-500 font-normal">
                                            ({shop.reviewsCount || 120} reviews)
                                        </span>
                                    </div>
                                    <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                        <Clock className="w-4 h-4 text-emerald-500" />
                                        <span>{shop.operatingHours || "Open • Closes 9:00 PM"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <a
                                    href={shop.googleMapsLocation || `https://maps.google.com/?q=${encodeURIComponent(shop.address + ", " + shop.city)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold transition flex items-center gap-2 shadow-sm"
                                >
                                    <Navigation className="w-4 h-4" />
                                    Get Directions
                                </a>
                                <a
                                    href={`tel:${shop.phone || "+919876543210"}`}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition flex items-center gap-2 shadow-md shadow-blue-500/20"
                                >
                                    <Phone className="w-4 h-4" />
                                    Contact Shop
                                </a>
                            </div>
                        </div>

                        {/* Contact & Location Strip */}
                        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <span>{shop.address}, {shop.city}, {shop.state} - {shop.pinCode}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>{shop.phone}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>{shop.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto pb-px">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-5 py-3 text-sm font-semibold transition-all relative ${
                            activeTab === "overview"
                                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("cars")}
                        className={`px-5 py-3 text-sm font-semibold transition-all relative flex items-center gap-2 ${
                            activeTab === "cars"
                                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                    >
                        <span>Available Cars</span>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">
                            {cars.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`px-5 py-3 text-sm font-semibold transition-all relative flex items-center gap-2 ${
                            activeTab === "reviews"
                                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                    >
                        <span>Reviews</span>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {shop.reviewsCount || 120}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("photos")}
                        className={`px-5 py-3 text-sm font-semibold transition-all relative flex items-center gap-2 ${
                            activeTab === "photos"
                                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                    >
                        <Camera className="w-4 h-4" />
                        <span>Photos</span>
                    </button>
                </div>

                {/* Tab: Available Cars */}
                {activeTab === "cars" && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Fleet Available at this Hub
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    Instant booking available with zero deposit options and transparent pricing.
                                </p>
                            </div>
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                Showing {cars.length} vehicles
                            </span>
                        </div>

                        {cars.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                                <CarIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No vehicles currently listed</h3>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                                    All cars at this hub are currently on active rentals or being serviced. Please check back shortly or explore neighboring hubs.
                                </p>
                                <button
                                    onClick={() => navigate("/cars")}
                                    className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-md"
                                >
                                    Explore Other Cars
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cars.map((car) => {
                                    const primaryImg = car.images?.frontImage 
                                        || (Array.isArray(car.images) ? car.images[0] : null) 
                                        || car.image 
                                        || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80";
                                    const carTitle = car.name || `${car.vehicleDetails?.brand || ''} ${car.vehicleDetails?.model || ''}`.trim() || 'Luxury Vehicle';
                                    const displayPrice = car.rentalDetails?.dailyPrice || car.pricing?.perDay || car.pricePerDay || 1499;
                                    const category = car.category || car.vehicleDetails?.category || "Sedan";
                                    const year = car.manufacturingYear || car.vehicleDetails?.year || 2024;
                                    const seats = car.specifications?.seats || car.vehicleDetails?.seatingCapacity || 5;
                                    const fuel = car.specifications?.fuelType || car.vehicleDetails?.fuelType || "Petrol";
                                    const transmission = car.specifications?.transmission || car.vehicleDetails?.transmission || "Manual";
                                    const isBooked = car.availabilityStatus === "booked" || car.isBooked;

                                    return (
                                        <div
                                            key={car._id}
                                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
                                        >
                                            <div>
                                                {/* Image & Badges */}
                                                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                    <img
                                                        src={primaryImg}
                                                        alt={carTitle}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-3 left-3 flex gap-2">
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                                                            {category}
                                                        </span>
                                                        {isBooked ? (
                                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                                                Booked
                                                            </span>
                                                        ) : (
                                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur shadow-sm flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                                Available
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                                                            {carTitle}
                                                        </h3>
                                                        <span className="text-xs font-semibold text-slate-400">
                                                            {year}
                                                        </span>
                                                    </div>

                                                    {/* Specs */}
                                                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 mb-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <Users className="w-3.5 h-3.5 text-blue-600" />
                                                            <span>{seats} Seats</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Fuel className="w-3.5 h-3.5 text-blue-600" />
                                                            <span>{fuel}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Gauge className="w-3.5 h-3.5 text-blue-600" />
                                                            <span>{transmission}</span>
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="flex items-baseline gap-1 mb-4">
                                                        <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                                                            ₹{Number(displayPrice).toLocaleString("en-IN")}
                                                        </span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">/day</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="px-5 pb-5 grid grid-cols-2 gap-2">
                                                <Link
                                                    to={`/car/${car._id}`}
                                                    className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-600 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition"
                                                >
                                                    View Details
                                                </Link>
                                                {isBooked ? (
                                                    <button
                                                        type="button"
                                                        disabled
                                                        className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 text-center text-xs font-semibold cursor-not-allowed"
                                                    >
                                                        Booked
                                                    </button>
                                                ) : (
                                                    <Link
                                                        to={`/car/${car._id}`}
                                                        className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-center text-xs font-semibold text-white transition shadow-sm"
                                                    >
                                                        Book Now
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: Overview */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                                    About {shop.name}
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    {shop.description || "DriveRent certified car rental dealership offering top-tier fleet maintenance, zero paperwork hassle, and seamless pickup and doorstep delivery services throughout the city."}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                    Rental Shop Perks & Guarantees
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Clean & Sanitized</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Every car undergoes a 30-point hygienic safety inspection before handover.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Free Cancellation</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">100% refund up to 24 hours prior to your scheduled pickup time.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">24/7 Roadside Assist</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Comprehensive mechanical roadside coverage anywhere within 150 km.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Zero Hidden Charges</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">All prices include standard insurance, GST, and maintenance.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours & Contact Card */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                                    Operating Hours
                                </h3>
                                <div className="space-y-2.5 text-xs sm:text-sm">
                                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-500 dark:text-slate-400">Monday - Friday</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">8:00 AM - 9:30 PM</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-500 dark:text-slate-400">Saturday</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">8:00 AM - 10:00 PM</span>
                                    </div>
                                    <div className="flex justify-between py-1.5">
                                        <span className="text-slate-500 dark:text-slate-400">Sunday</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">9:00 AM - 9:00 PM</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Dealer Representative</div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{shop.ownerName || "Authorized Dealer"}</div>
                                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">{shop.email}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Reviews */}
                {activeTab === "reviews" && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Customer Reviews</h3>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Verified reviews from renters who booked with this hub.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{shop.rating || 4.6}</span>
                                <div>
                                    <div className="flex items-center text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">Based on {shop.reviewsCount || 120} reviews</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {SAMPLE_REVIEWS.map((review) => (
                                <div key={review.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                                                {review.author[0]}
                                            </div>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{review.author}</span>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold">Verified Renter</span>
                                        </div>
                                        <span className="text-xs text-slate-400">{review.date}</span>
                                    </div>
                                    <div className="flex items-center text-amber-400 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab: Photos */}
                {activeTab === "photos" && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Dealership & Fleet Gallery</h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">Explore the showroom facilities, service bay, and on-site vehicle lineup.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {shopPhotos.map((photo, index) => (
                                <div key={index} className="relative h-56 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 group">
                                    <img
                                        src={photo}
                                        alt={`Shop Photo ${index + 1}`}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RentalShopDetails;

