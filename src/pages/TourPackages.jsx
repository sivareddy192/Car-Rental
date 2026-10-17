import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Calendar, Users, MapPin, ArrowRight, Star, Clock } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { CloudinaryImage } from '../components/common/CloudinaryImage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { WhatsAppButton } from '../components/layout/WhatsAppButton';
import api from '../services/api';

export const TourPackages = () => {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await api.get('/tours');
        if (res.data.success) {
          setTours(res.data.tours);
        }
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 pt-28 pb-20 transition-colors duration-300">
      <SEOHead
        title="Royal Tour Packages & Chauffeur Journeys — Car Rental"
        description="Experience luxury India with private chauffeur escort, 5-star palace suites, and curated itineraries across Delhi, Agra, Jaipur, Kerala, and Goa."
      />

      <WhatsAppButton customMessage="Hello, I would like to enquire about your curated royal tour packages." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase tracking-widest text-zinc-800 dark:text-zinc-300 mb-3 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
            <span>Curated Expeditions</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight">
            Royal Tour Packages
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
            Unwind in palace suites and traverse breathtaking scenery in private luxury Mercedes and Defender vehicles accompanied by veteran chauffeurs and private concierges.
          </p>
        </div>

        {/* Tour Packages Cards Grid */}
        {isLoading ? (
          <LoadingSpinner text="Retrieving curated itineraries..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div
                key={tour._id}
                className="group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <CloudinaryImage
                      src={tour.mainImage}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-bold text-white border border-zinc-700">
                      {tour.durationDays} Days / {tour.durationNights} Nights
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
                      <span>{tour.destination}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors mb-2">
                      {tour.title}
                    </h3>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                      {tour.overview}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1.5 border-t border-zinc-100 dark:border-zinc-900 pt-3">
                      {tour.highlights?.slice(0, 2).map((h, i) => (
                        <div key={i} className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-start gap-1.5">
                          <span className="text-zinc-900 dark:text-zinc-200 font-bold">&bull;</span>
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-6 pt-0 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">From</span>
                    <div className="text-base font-extrabold text-zinc-950 dark:text-white">
                      ₹{Number(tour.pricePerPerson).toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400"> /person</span>
                    </div>
                  </div>

                  <Link
                    to={`/tours/${tour._id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
                  >
                    <span>Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
