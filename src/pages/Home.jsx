import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Car,
  Compass,
  Star,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { VehicleCard } from '../components/common/VehicleCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SEOHead } from '../components/common/SEOHead';
import { getWhatsAppUrl } from '../components/layout/WhatsAppButton';
import api from '../services/api';
import { motion } from 'framer-motion';

export const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [isLoadingFleet, setIsLoadingFleet] = useState(true);

  // Search Widget State
  const [serviceType, setServiceType] = useState('Self Drive');
  const [pickupLocation, setPickupLocation] = useState('Jubilee Hills Hub, Hyderabad');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/vehicles?sort=featured&limit=6');
        if (res.data.success) {
          setFeaturedVehicles(res.data.vehicles);
        }
      } catch (err) {
        console.error('Failed to load featured fleet:', err);
      } finally {
        setIsLoadingFleet(false);
      }
    };
    fetchFeatured();

    // Default dates (tomorrow + 3 days)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const returnD = new Date();
    returnD.setDate(returnD.getDate() + 4);

    setPickupDate(tomorrow.toISOString().split('T')[0]);
    setReturnDate(returnD.toISOString().split('T')[0]);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (serviceType === 'Taxi Service') {
      navigate('/taxi');
    } else if (serviceType === 'Tour Packages') {
      navigate('/tours');
    } else if (serviceType === 'NRI Solutions') {
      navigate('/nri-solutions');
    } else if (serviceType === 'Wedding Cars') {
      navigate('/wedding-cars');
    } else {
      navigate(`/self-drive?startDate=${pickupDate}&endDate=${returnDate}&location=${encodeURIComponent(pickupLocation)}`);
    }
  };

  const serviceCategories = [
    {
      title: 'Self Drive Exotics',
      desc: 'Command the road in precision supercars and luxury German cruisers with generous daily mileage.',
      link: '/self-drive',
      icon: Car,
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'VIP Chauffeur Taxi',
      desc: 'Point-to-point, airport meet-and-greets, and outstation trips in whisper-quiet hybrid and executive limousines.',
      link: '/taxi',
      icon: Clock,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Royal Wedding Cars',
      desc: 'Rolls-Royce Ghost, Maybach, and vintage convertibles with red carpet chauffeur protocol and floral styling.',
      link: '/wedding-cars',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Curated Tour Packages',
      desc: 'Experience the Golden Triangle, Kerala backwaters, or Goa villas with private driver escort and palace stays.',
      link: '/tours',
      icon: Compass,
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const faqs = [
    {
      q: 'What credentials are required to rent a self-drive exotic vehicle?',
      a: 'Self-drive clients must provide a valid domestic or International Driving Permit (IDP), government photo identification (Passport or Aadhaar), and a standard security verification hold. All contracts are delivered via automated instant digital dispatch.',
    },
    {
      q: 'How does Car Rental prevent double bookings?',
      a: 'Our booking engine uses atomic database locks and date-range overlap verification. Once you initiate a confirmed reservation, the fleet vehicle is instantly blocked from all other calendars and a Resend confirmation voucher is dispatched.',
    },
    {
      q: 'Are your chauffeur drivers professionally trained?',
      a: 'Yes. All Car Rental chauffeurs undergo intensive executive etiquette training, speak multiple languages, have verified background clearances, and operate under strict NDAs for celebrity and corporate VIP travel.',
    },
    {
      q: 'Can the vehicle be delivered directly to my private villa or airport terminal?',
      a: 'Absolutely. We provide white-glove door-to-door delivery throughout Hyderabad, Shamshabad International Airport VIP terminal, and private jet aviation gates.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <SEOHead
        title="Car Rental"
        description="Experience the finest luxury car rentals, chauffeur-driven VIP services, wedding cars, self-drive exotics, and bespoke tour packages with Car Rental."
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 overflow-hidden bg-zinc-50 dark:bg-black text-zinc-950 dark:text-white transition-colors">
        {/* Background Image with Light / Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury Automotive"
            className="w-full h-full object-cover opacity-20 dark:opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white dark:from-black/80 dark:via-black/60 dark:to-black/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-white/10 border border-zinc-200 dark:border-white/20 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-800 dark:text-zinc-200 mb-6 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
            <span>The Premier Automotive Fleet</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-950 dark:text-white tracking-tight uppercase leading-[1.1] max-w-5xl mx-auto"
          >
            Bespoke Luxury. <br />
            <span className="luxury-gradient-text">Unrivaled Mobility.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            Curated supercars, chauffeur-driven palace limousines, and bespoke travel solutions.
            Delivered directly to your residence, luxury resort, or private air terminal.
          </motion.p>

          {/* SEARCH & BOOKING ENGINE WIDGET */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 max-w-5xl mx-auto bg-white/95 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl text-left"
          >
            {/* Service Type Tab Selector */}
            <div className="flex flex-wrap gap-2 pb-5 mb-5 border-b border-zinc-200 dark:border-zinc-800">
              {['Self Drive', 'Taxi Service', 'Wedding Cars', 'Tour Packages', 'NRI Solutions'].map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setServiceType(tab)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                      serviceType === tab
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-md'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Filter Inputs Grid */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Pickup Location */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Pickup Hub
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                  >
                    <option value="Jubilee Hills Hub, Hyderabad">Jubilee Hills Concierge</option>
                    <option value="Shamshabad Airport VIP Terminal">Shamshabad Airport (HYD)</option>
                    <option value="HITEC City Financial District">HITEC City Lounge</option>
                    <option value="Banjara Hills Fleet Suites">Banjara Hills Fleet Suites</option>
                  </select>
                </div>
              </div>

              {/* Pickup Date */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Commencement Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Return Date */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Return Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Search Submit CTA */}
              <div className="flex items-end">
                <button
                  type="submit"
                  id="home-search-fleet-btn"
                  className="w-full py-2.5 px-4 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Search Fleet</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FEATURED FLEET SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 block mb-2">
              Automotive Masterpieces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight">
              Featured Fleet
            </h2>
          </div>
          <Link
            to="/self-drive"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <span>Explore All 20+ Vehicles</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoadingFleet ? (
          <LoadingSpinner text="Summoning luxury fleet..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* MOBILITY CATEGORIES SHOWCASE */}
      <section className="py-20 bg-zinc-50/80 dark:bg-zinc-950/60 border-y border-zinc-200 dark:border-zinc-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 block mb-2">
              End-To-End Hospitality
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight">
              Curated Services
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-3">
              Crafted for corporate executives, wedding celebrations, visiting NRIs, and leisure voyagers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.title}
                  to={cat.link}
                  className="group relative bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-500 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="aspect-[16/11] overflow-hidden bg-zinc-100 dark:bg-zinc-950 relative">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent dark:from-zinc-900/90" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white mb-4 group-hover:bg-zinc-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-white mb-2">{cat.title}</h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{cat.desc}</p>
                    </div>

                    <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-white group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE Car Rental */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 block mb-2">
              Unrivaled Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight">
              Why Discerning Clients Choose Car Rental
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">
              We operate exclusively in the luxury tier. Every vehicle in our fleet is company-owned,
              immaculately serviced, and accompanied by 24/7 dedicated fleet support and Resend digital booking confirmation.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  title: 'Guaranteed Vehicle Model',
                  desc: 'You receive the exact vehicle and registration booked — never a downgraded substitution.',
                },
                {
                  title: 'Zero Hidden Charges',
                  desc: 'Comprehensive insurance, transparent daily tariffs, and refundable deposits.',
                },
                {
                  title: 'VVIP Chauffeur Etiquette',
                  desc: 'Suited, background-verified chauffeurs with discrete non-disclosure protocol.',
                },
                {
                  title: 'Doorstep Handover',
                  desc: 'Complimentary delivery to Shamshabad Airport, luxury hotels, and private residences.',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-950 dark:text-white shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"
                alt="Mercedes-Maybach Interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-2xl backdrop-blur-md hidden sm:block">
              <div className="text-2xl font-serif font-extrabold text-zinc-950 dark:text-white">4.9 / 5.0</div>
              <div className="flex items-center gap-1 text-amber-400 my-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                ))}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Over 1,200 Verified VIP Reservations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-20 bg-zinc-50/80 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 block mb-2">
              Clarity & Transparency
            </span>
            <h2 className="font-serif text-3xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="border border-zinc-200 dark:border-zinc-850 rounded-xl bg-white dark:bg-zinc-900/50 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between text-sm font-semibold text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="py-20 relative overflow-hidden bg-white dark:bg-black transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-gradient-to-r from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 text-zinc-950 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 sm:p-16 shadow-xl transition-all">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight">
              Ready to Command the Fleet?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mt-4 leading-relaxed">
              Contact our 24/7 mobility concierge desk or explore our self-drive showroom now.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/self-drive"
                className="px-6 py-3.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md"
              >
                View Available Fleet
              </Link>
              <a
                href={getWhatsAppUrl('Hello Car Rental Concierge, I would like to discuss a luxury mobility booking.')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 text-zinc-900 dark:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                Contact Concierge
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
