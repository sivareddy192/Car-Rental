import React, { useEffect, useState } from 'react';
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle,
  MessageCircle,
  ArrowRight,
  Plane,
  Sparkles,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { WhatsAppButton } from '../components/layout/WhatsAppButton';
import { VehicleCard } from '../components/common/VehicleCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import api from '../services/api';
import toast from 'react-hot-toast';

export const TaxiService = () => {
  const [tripType, setTripType] = useState('airport'); // 'airport' | 'oneway' | 'roundtrip' | 'outstation'
  const [pickupCity, setPickupCity] = useState('Hyderabad (City Center)');
  const [destination, setDestination] = useState('Rajiv Gandhi International Airport (HYD)');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [passengers, setPassengers] = useState(2);
  const [vehicleClass, setVehicleClass] = useState('executive'); // 'executive' (Innova HyCross) | 'luxury' (Mercedes S-Class) | 'suv' (Range Rover)

  // Enquiry submission
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taxiVehicles, setTaxiVehicles] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [selectedService, setSelectedService] = useState('Airport Transfer');

  useEffect(() => {
    const fetchTaxiVehicles = async () => {
      try {
        const res = await api.get(
          `/vehicles?category=Taxi&taxiService=${encodeURIComponent(selectedService)}&sort=featured&limit=12`
        );
        if (res.data.success) {
          setTaxiVehicles(res.data.vehicles || []);
        }
      } catch (error) {
        console.error('Failed to load taxi fleet:', error);
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    fetchTaxiVehicles();
  }, [selectedService]);

  // Fare Estimator
  const baseRates = {
    airport: { executive: 3500, luxury: 12000, suv: 15000 },
    oneway: { executive: 4500, luxury: 16000, suv: 18000 },
    roundtrip: { executive: 7500, luxury: 28000, suv: 32000 },
    outstation: { executive: 12000, luxury: 45000, suv: 50000 },
  };

  const estimatedFare = baseRates[tripType][vehicleClass];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error('Please provide your name, email, and mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/enquiries', {
        enquiryType: 'taxi',
        name,
        email,
        phone,
        serviceDetails: {
          tripType,
          pickupCity,
          destination,
          pickupDate,
          pickupTime,
          passengers,
          vehicleClass,
          estimatedFare,
        },
      });

      if (res.data.success) {
        toast.success('Taxi transfer reserved! Our executive concierge will verify shortly.');
        setName('');
        setEmail('');
        setPhone('');
      }
    } catch (err) {
      toast.error('Could not register transfer request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 pt-28 pb-20 transition-colors duration-300">
      <SEOHead
        title="VIP Chauffeur Taxi & Airport Transfers — Car Rental"
        description="Premium executive taxi and chauffeur services in Hyderabad. Airport transfers, one-way trips, outstation charters in Mercedes, Maybach, and Innova HyCross."
      />

      <WhatsAppButton customMessage={`Hello, I want to book a ${vehicleClass.toUpperCase()} taxi transfer from ${pickupCity} to ${destination}.`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase tracking-widest text-zinc-800 dark:text-zinc-300 mb-3 shadow-xs">
            <Plane className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
            <span>VIP Chauffeur Concierge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight">
            Executive Taxi & Transfers
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
            Punctual, discrete, and comfortable point-to-point transit. Uniformed professional drivers, flight tracking for airport pickups, and zero surge pricing.
          </p>
        </div>

        {/* Taxi Fleet */}
        <section className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Chauffeur Fleet
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight mt-1">
                Choose Your Taxi
              </h2>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm sm:text-right">
              Select from our available chauffeur vehicles and view full vehicle details.
            </p>
          </div>

          <div className="mb-6" aria-label="Refine taxi fleet by service">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-3">
              Refine Fleet
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Airport Transfer', 'Local Rides', 'Luxury Chauffeur'].map((service) => (
                <button
                  key={service}
                  type="button"
                  aria-pressed={selectedService === service}
                  onClick={() => setSelectedService(service)}
                  className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                    selectedService === service
                      ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300'
                  }`}
                >
                  <span className="block text-xs font-bold uppercase tracking-wider">{service}</span>
                  <span className="mt-1 block text-[11px] opacity-70">
                    {service === 'Airport Transfer'
                      ? 'Flight-ready pickups and drop-offs'
                      : service === 'Local Rides'
                        ? 'Comfortable city travel'
                        : 'Premium chauffeur-led journeys'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {isLoadingVehicles ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <SkeletonCard key={item} />
              ))}
            </div>
          ) : taxiVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {taxiVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} serviceType={selectedService} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-10 text-center">
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Our chauffeur fleet is being updated.
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Contact our concierge for current taxi availability.
              </p>
            </div>
          )}
        </section>

        {false && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT 2 COLUMNS: TRANSFER CONFIGURATOR */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 sm:p-8 rounded-2xl shadow-sm">
              {/* Trip Type Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                {[
                  { id: 'airport', label: 'Airport Transfer' },
                  { id: 'oneway', label: 'One-Way Transit' },
                  { id: 'roundtrip', label: 'Round Trip' },
                  { id: 'outstation', label: 'Outstation Day' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTripType(t.id)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                      tripType === t.id
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-bold shadow-md'
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Locations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider mb-1.5">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider mb-1.5">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider mb-1.5">
                    Date of Journey
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider mb-1.5">
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider mb-1.5">
                    Passengers
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vehicle Tier Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-3">
                  Select Chauffeur Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'executive',
                      title: 'Executive Hybrid',
                      model: 'Toyota Innova HyCross',
                      specs: 'Up to 6 Passengers • Captain Seats',
                    },
                    {
                      id: 'luxury',
                      title: 'Flagship Luxury',
                      model: 'Mercedes-Benz S-Class',
                      specs: 'Up to 3 Passengers • First-Class Lounge',
                    },
                    {
                      id: 'suv',
                      title: 'Prestige SUV',
                      model: 'Range Rover Autobiography',
                      specs: 'Up to 4 Passengers • Commanding Stance',
                    },
                  ].map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setVehicleClass(v.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        vehicleClass === v.id
                          ? 'bg-zinc-100 dark:bg-zinc-850 border-zinc-950 dark:border-white shadow-md'
                          : 'bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-zinc-950 dark:text-white uppercase">{v.title}</div>
                      <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 font-semibold">{v.model}</div>
                      <div className="text-[10px] text-zinc-500 mt-2">{v.specs}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FARE ESTIMATE & QUICK REQUEST */}
          <div>
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl shadow-xl sticky top-28">
              {/* Contact Lead Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">Mobile / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  {isSubmitting ? 'Registering...' : 'Request Chauffeur Transfer'}
                </button>
              </form>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-850 space-y-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>GPS Tracking & 24/7 Security Hotline</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Complimentary 45-min airport waiting time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
