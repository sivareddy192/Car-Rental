import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Users,
  Check,
  X,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { CloudinaryImage } from '../components/common/CloudinaryImage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { WhatsAppButton } from '../components/layout/WhatsAppButton';
import api from '../services/api';
import toast from 'react-hot-toast';

export const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Enquiry modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [groupSize, setGroupSize] = useState(2);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await api.get(`/tours/${id}`);
        if (res.data.success) {
          setTour(res.data.tour);
        }
      } catch (err) {
        toast.error('Tour package not found.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleEnquiry = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/enquiries', {
        enquiryType: 'tour',
        name,
        email,
        phone,
        serviceDetails: {
          tourId: tour._id,
          tourTitle: tour.title,
          destination: tour.destination,
          travelDate,
          groupSize,
          notes,
        },
      });

      if (res.data.success) {
        toast.success('Your tour enquiry has been submitted. Our holiday concierge will connect with you.');
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        setNotes('');
      }
    } catch (err) {
      toast.error('Could not submit tour enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-32 transition-colors">
        <LoadingSpinner text="Summoning royal itinerary..." />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-32 text-center text-zinc-900 dark:text-white transition-colors">
        <p className="font-serif text-2xl">Tour package not found.</p>
        <Link to="/tours" className="text-xs uppercase text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white mt-4 inline-block font-semibold">
          Return to packages
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 pt-28 pb-20 transition-colors duration-300">
      <SEOHead
        title={`${tour.title} — Car Rental Curated Tour`}
        description={tour.overview}
        ogImage={tour.mainImage}
      />

      <WhatsAppButton customMessage={`Hello, I would like to book the "${tour.title}" package.`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-6">
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/tours" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Tour Packages
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-white font-medium">{tour.title}</span>
        </div>

        {/* Hero Banner */}
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-850 shadow-2xl mb-12">
          <CloudinaryImage
            src={tour.mainImage}
            alt={tour.title}
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">
                <MapPin className="w-4 h-4" />
                <span>{tour.destination}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
                {tour.title}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors shrink-0 shadow-lg"
            >
              Reserve Private Departure
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT 2 COLUMNS: ITINERARY & INCLUSIONS */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 sm:p-8 rounded-2xl shadow-sm">
              <h3 className="font-serif text-xl font-bold text-zinc-950 dark:text-white mb-3 uppercase tracking-wide">
                Expedition Overview
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {tour.overview}
              </p>
            </div>

            {/* Day-by-Day Itinerary */}
            <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-zinc-950 dark:text-white uppercase tracking-wide">
                Day-by-Day Itinerary
              </h3>

              <div className="space-y-6">
                {tour.itinerary?.map((item) => (
                  <div key={item.day} className="border-l-2 border-zinc-300 dark:border-zinc-800 pl-6 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-black text-[9px] font-bold flex items-center justify-center">
                      {item.day}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                      Day {item.day}
                    </span>
                    <h4 className="font-serif text-base font-bold text-zinc-950 dark:text-white mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                    {item.meals && (
                      <span className="inline-block mt-2 text-[10px] uppercase font-semibold text-zinc-600 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                        {item.meals}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl shadow-sm">
                <h4 className="font-serif text-base font-bold mb-4 uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Included Privileges
                </h4>
                <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  {tour.included?.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl shadow-sm">
                <h4 className="font-serif text-base font-bold text-zinc-700 dark:text-zinc-400 mb-4 uppercase tracking-wider">
                  Excluded Items
                </h4>
                <ul className="space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {tour.excluded?.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <X className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TARIFF & BOOKING SUMMARY */}
          <div>
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl shadow-xl sticky top-28 space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                  Package Pricing
                </span>
                <div className="text-3xl font-serif font-black text-zinc-950 dark:text-white mt-1">
                  ₹{Number(tour.pricePerPerson).toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400"> /person</span>
                </div>
                <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  <span>{tour.durationDays} Days / {tour.durationNights} Nights</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg"
              >
                Inquire & Customize Tour
              </button>

              <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-850 text-[11px] text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Tailored departures to fit your family calendar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-300" />
                  <span>Private vehicle & dedicated chauffeur throughout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ENQUIRY MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Custom Enquiry: ${tour.title}`}
      >
        <form onSubmit={handleEnquiry} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
              />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Phone / WhatsApp</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Target Departure Date</label>
              <input
                type="date"
                required
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
              />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Total Travelers</label>
              <input
                type="number"
                min="1"
                max="12"
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Customization Requests & Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g. Specific hotel preferences, culinary needs, extra nights..."
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg"
          >
            {isSubmitting ? 'Sending Request...' : 'Submit Tour Enquiry'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
