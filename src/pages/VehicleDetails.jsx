import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Calendar,
  MapPin,
  Users,
  Fuel,
  Gauge,
  Briefcase,
  Star,
  CheckCircle,
  Heart,
  Shield,
  ArrowRight,
  MessageCircle,
  Share2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { CloudinaryImage } from '../components/common/CloudinaryImage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SEOHead } from '../components/common/SEOHead';
import { WhatsAppButton, getWhatsAppUrl } from '../components/layout/WhatsAppButton';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const VehicleDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');

  // Date Selection & Price Calculator
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Jubilee Hills Concierge, Hyderabad');
  const [dropoffLocation, setDropoffLocation] = useState('Shamshabad Airport VIP Terminal');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnTime, setReturnTime] = useState('18:00');
  const [rentalDuration, setRentalDuration] = useState('full-day');
  const [isScheduleStepOpen, setIsScheduleStepOpen] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null); // true | false | null

  // Booking Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLiked = vehicle && wishlistItems.some((item) => item._id === vehicle._id);
  const isTaxi = vehicle?.category === 'Taxi';
  const isSelfDrive = vehicle?.category === 'Self Drive';
  const isHalfDay = isSelfDrive && rentalDuration === 'half-day';
  const scheduleRequired = ['Self Drive', 'Wedding', 'Tour', 'Tour Package'].includes(vehicle?.category);
  const selectedTaxiService = searchParams.get('service') || vehicle?.taxiServices?.[0] || 'Airport Transfer';

  // Set default dates: Tomorrow and 3 days later
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const returnD = new Date();
    returnD.setDate(returnD.getDate() + 4);

    setStartDate(tomorrow.toISOString().split('T')[0]);
    setEndDate(returnD.toISOString().split('T')[0]);
  }, []);

  // Fetch Vehicle
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/vehicles/${id}`);
        if (res.data.success) {
          setVehicle(res.data.vehicle);
          setReviews(res.data.reviews || []);
          setSelectedImage(res.data.vehicle.mainImage);
        }
      } catch (err) {
        toast.error('Could not load vehicle details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicleDetails();
  }, [id]);

  // Pre-fill user contact info if logged in
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerEmail(user.email || '');
      setCustomerPhone(user.phone || '');
    }
  }, [user]);

  const availabilityEndDate = (() => {
    if (!isHalfDay || !startDate) return endDate;
    const [year, month, day] = startDate.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().split('T')[0];
  })();

  // Check Availability whenever dates or rental duration change
  useEffect(() => {
    if (!startDate || !availabilityEndDate || !id) return;

    const checkAvail = async () => {
      setIsCheckingAvailability(true);
      setAvailabilityStatus(null);
      try {
        const res = await api.get(`/vehicles/${id}/availability?startDate=${startDate}&endDate=${availabilityEndDate}`);
        setAvailabilityStatus(res.data.isAvailable);
      } catch (err) {
        setAvailabilityStatus(null);
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    checkAvail();
  }, [id, startDate, availabilityEndDate]);

  // Calculation
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const diff = new Date(endDate) - new Date(startDate);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const totalDays = calculateDays();
  const dailyRate = vehicle?.pricePerDay || 0;
  const halfDayRate = Number(vehicle?.halfDayPrice) > 0
    ? Number(vehicle.halfDayPrice)
    : Math.ceil(dailyRate / 2);
  const rentalTotal = isHalfDay ? halfDayRate : totalDays * dailyRate;
  const refundableDeposit = Math.round(rentalTotal * 0.2);
  const grandTotal = rentalTotal + refundableDeposit;

  const handleOpenBooking = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in or register to complete your reservation.');
      navigate('/login', { state: { from: { pathname: `/vehicles/${id}` } } });
      return;
    }

    if (availabilityStatus === false) {
      toast.error('This vehicle is unavailable for the selected dates. Please adjust your calendar.');
      return;
    }

    if (isTaxi && passengerCount > vehicle.seatingCapacity) {
      toast.error(`This vehicle accommodates up to ${vehicle.seatingCapacity} passengers.`);
      return;
    }

    setIsBookingModalOpen(true);
  };

  const handleWhatsAppReservation = () => {
    if (scheduleRequired && !isScheduleStepOpen) {
      setIsScheduleStepOpen(true);
      return;
    }

    if (scheduleRequired && (!startDate || (!isHalfDay && !endDate) || !pickupTime || !returnTime)) {
      toast.error('Please select pickup and return dates and times.');
      return;
    }

    if (isTaxi && (!pickupLocation.trim() || !dropoffLocation.trim())) {
      toast.error('Please enter both pickup and drop-off locations.');
      return;
    }

    if (availabilityStatus === false) {
      toast.error('This vehicle is unavailable for the selected dates. Please adjust your calendar.');
      return;
    }

    const message = [
      `Hello Car Rental Concierge, I would like to reserve the ${vehicle.brand} ${vehicle.name}.`,
      ...(isTaxi ? [`Service: ${selectedTaxiService}`] : []),
      ...(scheduleRequired ? [`Rental duration: ${isHalfDay ? 'Half Day' : `Full Day (${totalDays} day${totalDays === 1 ? '' : 's'})`}`] : []),
      `Pickup date: ${startDate || 'To be confirmed'}`,
      `Pickup time: ${pickupTime || 'To be confirmed'}`,
      ...(scheduleRequired ? [
        `Return date: ${isHalfDay ? startDate : endDate || 'To be confirmed'}`,
        `Return time: ${returnTime || 'To be confirmed'}`,
      ] : []),
      ...(isTaxi ? [
        `Pickup location: ${pickupLocation || 'To be confirmed'}`,
        `Drop-off location: ${dropoffLocation || 'To be confirmed'}`,
      ] : []),
      ...(isTaxi ? [`Passengers: ${passengerCount}`] : []),
      ...(scheduleRequired ? [
        `Rental amount: ₹${rentalTotal.toLocaleString('en-IN')}`,
        `Refundable security deposit (20%): ₹${refundableDeposit.toLocaleString('en-IN')}`,
        `Estimated total: ₹${grandTotal.toLocaleString('en-IN')}`,
      ] : []),
    ].join('\n');

    window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setIsSubmittingBooking(true);

    try {
      const res = await api.post('/bookings', {
        vehicleId: vehicle._id,
        serviceType: 'Self Drive',
        ...(isTaxi ? { serviceType: 'Taxi Service', pickupTime, passengerCount } : {}),
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        customerName,
        customerEmail,
        customerPhone,
        specialRequests,
      });

      if (res.data.success) {
        toast.success(`Reservation Confirmed! Reference: ${res.data.booking.bookingReference}`);
        setIsBookingModalOpen(false);
        navigate('/dashboard/bookings');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking reservation could not be completed.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to submit a review.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        vehicleId: vehicle._id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res.data.success) {
        toast.success('Thank you! Your review has been added.');
        setReviews([res.data.review, ...reviews]);
        setReviewComment('');
        setReviewTitle('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-32 transition-colors">
        <LoadingSpinner text="Summoning luxury automotive specifications..." />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-32 text-center text-zinc-900 dark:text-white transition-colors">
        <p className="font-serif text-2xl">Vehicle not found.</p>
        <Link to="/self-drive" className="text-xs uppercase text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white mt-4 inline-block font-semibold">
          Return to fleet showroom
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 pt-28 pb-20 transition-colors duration-300">
      <SEOHead
        title={`${vehicle.brand} ${vehicle.name} — Luxury Rental | Car Rental`}
        description={vehicle.description}
        ogImage={vehicle.mainImage}
      />

      <WhatsAppButton vehicleName={`${vehicle.brand} ${vehicle.name}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-6">
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/self-drive" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Self Drive Fleet
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-white font-medium">{vehicle.brand} {vehicle.name}</span>
        </div>

        {/* Top Header: Title, Wishlist, Category */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-900 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                {vehicle.brand}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-[10px] font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                {vehicle.category}
              </span>
              {vehicle.registrationNumber && (
                <span className="inline-flex items-stretch rounded overflow-hidden border-2 border-zinc-800 dark:border-zinc-200 shadow-sm" style={{fontFamily: 'monospace'}}>
                  <span className="bg-blue-700 text-white text-[9px] font-black flex items-center px-1 py-0.5 tracking-tight leading-none" style={{writingMode:'horizontal-tb'}}>IND</span>
                  <span className="bg-yellow-300 text-zinc-900 text-[11px] font-black px-2 py-0.5 tracking-widest leading-none flex items-center border-l-2 border-zinc-800 dark:border-zinc-200">
                    {vehicle.registrationNumber}
                  </span>
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white mt-1 uppercase tracking-tight">
              {vehicle.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => dispatch(toggleWishlist(vehicle))}
              className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-white shadow-sm"
            >
              <Heart
                className={`w-4 h-4 ${
                  isLiked ? 'fill-rose-500 text-rose-500 stroke-rose-500' : 'text-zinc-500 dark:text-zinc-300'
                }`}
              />
              <span>{isLiked ? 'Saved' : 'Wishlist'}</span>
            </button>
          </div>
        </div>

        {/* Gallery & Booking Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
          {/* LEFT 2 COLUMNS: HIGH-RES GALLERY & SPECS */}
          <div className="lg:col-span-2 space-y-8">
            {/* Primary Main Image */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 shadow-lg dark:shadow-2xl">
              <CloudinaryImage
                src={selectedImage}
                alt={vehicle.name}
                className="w-full h-full object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                loading="eager"
              />
            </div>

            {/* Thumbnails Row */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img ? 'border-zinc-950 dark:border-white scale-105 shadow-md' : 'border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <CloudinaryImage
                      src={img}
                      alt={`${vehicle.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      sizes="96px"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Core Specifications Grid */}
            <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-white mb-4 uppercase tracking-wide">
                Engineering Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
                  <Users className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mb-1.5" />
                  <span className="text-zinc-500 dark:text-zinc-400 block text-[10px] uppercase font-semibold">Seating</span>
                  <span className="font-bold text-zinc-950 dark:text-white text-sm">{vehicle.seatingCapacity} Passengers</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
                  <Gauge className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mb-1.5" />
                  <span className="text-zinc-500 dark:text-zinc-400 block text-[10px] uppercase font-semibold">Transmission</span>
                  <span className="font-bold text-zinc-950 dark:text-white text-sm">{vehicle.transmission}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
                  <Fuel className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mb-1.5" />
                  <span className="text-zinc-500 dark:text-zinc-400 block text-[10px] uppercase font-semibold">Powertrain</span>
                  <span className="font-bold text-zinc-950 dark:text-white text-sm">{vehicle.fuelType}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
                  <Briefcase className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mb-1.5" />
                  <span className="text-zinc-500 dark:text-zinc-400 block text-[10px] uppercase font-semibold">Luggage</span>
                  <span className="font-bold text-zinc-950 dark:text-white text-sm">{vehicle.luggageCapacity || 3} Cases</span>
                </div>
              </div>
            </div>

            {isTaxi && (
              <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wide">
                    {selectedTaxiService}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Chauffeur service
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {vehicle.vehicleOverview || vehicle.description}
                </p>
              </div>
            )}

            {/* Description & Overview */}
            <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-white mb-3 uppercase tracking-wide">
                Vehicle Overview
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {vehicle.vehicleOverview || vehicle.description}
              </p>
            </div>

            {vehicle.engineeringSpecifications?.length > 0 && (
              <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-white mb-4 uppercase tracking-wide">
                  Engineering Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.engineeringSpecifications.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Luxury Features Pills */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-white mb-4 uppercase tracking-wide">
                  Equipped Appointments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: BOOKING & PRICE CALCULATOR CARD */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-xl dark:shadow-2xl sticky top-28">
              <div className="pb-4 border-b border-zinc-200 dark:border-zinc-850 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Daily Rental Tariff
                  </span>
                  <div className="text-3xl font-serif font-black text-zinc-950 dark:text-white">
                    ₹{Number(vehicle.pricePerDay).toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400"> /day</span>
                  </div>
                  {isSelfDrive && (
                    <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                      Half day:{' '}
                      <span className="font-semibold text-zinc-900 dark:text-white">
                        ₹{halfDayRate.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-amber-500 dark:text-amber-300 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 stroke-none" />
                  <span>{vehicle.rating || '5.0'}</span>
                </div>
              </div>

              {/* Date Selection Fields */}
              <div className="mt-5 space-y-4">
                {isTaxi && (
                  <>
                    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-850 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Selected service
                      </span>
                      <span className="text-xs font-bold text-zinc-950 dark:text-white">{selectedTaxiService}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                          Pickup Location
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                          Drop-off Location
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={dropoffLocation}
                            onChange={(e) => setDropoffLocation(e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                          Pickup Time
                        </label>
                        <input
                          type="time"
                          required
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                          Passengers (max {vehicle.seatingCapacity})
                        </label>
                        <select
                          value={passengerCount}
                          onChange={(e) => setPassengerCount(Number(e.target.value))}
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                        >
                          {Array.from({ length: vehicle.seatingCapacity }, (_, index) => index + 1).map((count) => (
                            <option key={count} value={count}>
                              {count} {count === 1 ? 'Passenger' : 'Passengers'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}
                {isSelfDrive && isScheduleStepOpen && (
                  <fieldset className="space-y-2">
                    <legend className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                      Rental duration
                    </legend>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'half-day', label: 'Half Day', price: halfDayRate },
                        { value: 'full-day', label: 'Full Day', price: dailyRate },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-xs transition-colors ${
                            rentalDuration === option.value
                              ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-900'
                              : 'border-zinc-200 dark:border-zinc-800'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="rentalDuration"
                              value={option.value}
                              checked={rentalDuration === option.value}
                              onChange={() => setRentalDuration(option.value)}
                              className="accent-zinc-900 dark:accent-white"
                            />
                            <span className="font-semibold text-zinc-900 dark:text-white">{option.label}</span>
                          </span>
                          <span className="font-mono text-zinc-600 dark:text-zinc-300">
                            ₹{option.price.toLocaleString('en-IN')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
                {(isTaxi || (scheduleRequired && isScheduleStepOpen)) && <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                    Pickup Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>}

                {scheduleRequired && isScheduleStepOpen && !isHalfDay && <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                    Dropoff Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>}

                {scheduleRequired && isScheduleStepOpen && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                      Pickup Time
                    </label>
                    <input
                      type="time"
                      required
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                      Return Time
                    </label>
                    <input
                      type="time"
                      required
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                    />
                  </div>
                </div>}

                {/* Live Availability Status Indicator */}
                {(isTaxi || (scheduleRequired && isScheduleStepOpen)) && <div className="pt-2">
                  {isCheckingAvailability ? (
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying fleet calendar...</span>
                    </div>
                  ) : availabilityStatus === true ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900/60 font-medium">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Available for Selected Dates</span>
                    </div>
                  ) : availabilityStatus === false ? (
                    <div className="flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/60 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Reserved for these dates. Choose different dates.</span>
                    </div>
                  ) : null}
                </div>}

                {/* Price Breakdown */}
                {(isTaxi || (scheduleRequired && isScheduleStepOpen)) && <div className="pt-4 border-t border-zinc-200 dark:border-zinc-850 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>
                      {isHalfDay
                        ? 'Half-day rental'
                        : `₹${Number(vehicle.pricePerDay).toLocaleString('en-IN')} × ${totalDays} Day(s)`}
                    </span>
                    <span className="font-mono text-zinc-950 dark:text-white font-semibold">
                      ₹{rentalTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Refundable Security Deposit (20%)</span>
                    <span className="font-mono text-zinc-950 dark:text-white font-semibold">
                      ₹{refundableDeposit.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {!isTaxi && vehicle.mileageLimit && <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400 pt-1">
                    <span>Included Mileage</span>
                    <span className="text-zinc-900 dark:text-zinc-200 font-medium">{vehicle.mileageLimit}</span>
                  </div>}

                  <div className="pt-3 border-t border-zinc-200 dark:border-zinc-850 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                      Estimated Total
                    </span>
                    <span className="text-xl font-serif font-black text-zinc-950 dark:text-white">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>}

                {/* Booking CTA Button */}
                <button
                  type="button"
                  onClick={handleWhatsAppReservation}
                  disabled={availabilityStatus === false}
                  id="btn-reserve-vehicle"
                  className="w-full mt-4 py-3.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-black font-extrabold text-xs tracking-wider uppercase hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>
                    {availabilityStatus === false
                      ? 'Unavailable for Dates'
                      : scheduleRequired && !isScheduleStepOpen
                        ? 'Select Dates to Reserve'
                        : 'Reserve Vehicle'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Security guarantees */}
              <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-900 space-y-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>Instant email booking confirmation voucher</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>Free cancellation up to 48 hours before pickup</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VERIFIED REVIEWS SECTION */}
        <section className="mt-16 pt-12 border-t border-zinc-200 dark:border-zinc-900">
          <div className="max-w-4xl">
            <h3 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white uppercase tracking-wide mb-6">
              Verified Client Feedback
            </h3>

            {/* List Reviews */}
            <div className="space-y-4 mb-10">
              {reviews.length === 0 ? (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">No reviews yet. Be the first to share your driving impression.</p>
              ) : (
                reviews.map((r, i) => (
                  <div key={i} className="p-5 rounded-xl bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-900 dark:text-white">
                          {r.userId?.name ? r.userId.name.charAt(0) : 'C'}
                        </div>
                        <span className="text-xs font-semibold text-zinc-950 dark:text-white">
                          {r.userId?.name || 'Verified Member'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(r.rating)].map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-amber-400 stroke-none" />
                        ))}
                      </div>
                    </div>
                    {r.title && <h4 className="text-xs font-bold text-zinc-950 dark:text-white mb-1">{r.title}</h4>}
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{r.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="p-6 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 space-y-4">
                <h4 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                  Leave a Verified Review
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'fill-amber-400 stroke-none' : 'text-zinc-300 dark:text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Review Headline (e.g. Flawless wedding entry)"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                />

                <textarea
                  rows={3}
                  required
                  placeholder="Share details of your experience with this vehicle..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                />

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                <Link to="/login" className="text-zinc-950 dark:text-white font-semibold hover:underline">
                  Sign in
                </Link>{' '}
                to leave a review for this vehicle.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* RESERVATION CONFIRMATION MODAL */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Confirm Luxury Reservation"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleConfirmBooking} className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">Reserved Vehicle</span>
              <span className="text-sm font-bold text-zinc-950 dark:text-white">{vehicle.brand} {vehicle.name}</span>
            </div>

          {isTaxi && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Pickup Time</label>
                <input
                  type="time"
                  required
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Passengers</label>
                <select
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(Number(e.target.value))}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                >
                  {Array.from({ length: vehicle.seatingCapacity }, (_, index) => index + 1).map((count) => (
                    <option key={count} value={count}>{count} {count === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">Total ({totalDays} Days)</span>
              <span className="text-sm font-mono font-bold text-zinc-950 dark:text-white">₹{rentalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {isTaxi && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Pickup Location</label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Dropoff Location</label>
                <input
                  type="text"
                  required
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Customer Full Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-white"
              />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Mobile / WhatsApp Number</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-white"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Special Concierge Requests (Optional)</label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="E.g. Child seat, champagne on arrival, flight number..."
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-white"
            />
          </div>

          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            By confirming, our automated system will lock the dates and dispatch an official booking voucher through Resend.
          </p>

          <button
            type="submit"
            disabled={isSubmittingBooking}
            className="w-full py-3.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-xl"
          >
            {isSubmittingBooking ? (
              <span>Securing Reservation & Dispatching Email...</span>
            ) : (
              <span>Confirm & Lock Reservation</span>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};
