import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { WhatsAppButton } from '../components/layout/WhatsAppButton';
import api from '../services/api';
import toast from 'react-hot-toast';

export const NRISolutions = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [flightNumber, setFlightNumber] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [vehiclePreference, setVehiclePreference] = useState('Mercedes S-Class or Maybach');
  const [serviceType, setServiceType] = useState('Chauffeur Dedicated (Full Stay)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error('Please complete mandatory contact fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/enquiries', {
        enquiryType: 'nri',
        name,
        email,
        phone,
        serviceDetails: {
          country,
          flightNumber,
          pickupLocation,
          dropoffLocation,
          vehiclePreference,
          serviceType,
          notes,
        },
        dates: {
          startDate: arrivalDate,
          endDate: departureDate,
        },
      });

      if (res.data.success) {
        toast.success('Your NRI mobility request has been assigned to our senior concierge.');
        setName('');
        setEmail('');
        setPhone('');
        setFlightNumber('');
        setPickupLocation('');
        setDropoffLocation('');
        setNotes('');
      }
    } catch (err) {
      toast.error('Could not submit enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 pt-28 pb-20 transition-colors duration-300">
      <SEOHead
        title="NRI Car Solutions & Airport VIP Concierge — Car Rental"
        description="Exclusive mobility for visiting NRIs, overseas dignitaries, and international families. Chauffeur-driven monthly rentals, airport tarmac pickup, and luxury fleets in Hyderabad."
      />

      <WhatsAppButton
        customMessage={[
          'Hello, I am an NRI visiting India and interested in bespoke car & chauffeur solutions.',
          `Pickup location: ${pickupLocation || 'To be confirmed'}`,
          `Drop-off location: ${dropoffLocation || 'To be confirmed'}`,
        ].join('\n')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase tracking-widest text-zinc-800 dark:text-zinc-300 mb-3 shadow-xs">
            <Globe className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
            <span>International Homecoming Mobility</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight">
            NRI Car Solutions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
            Returning home for a holiday, family wedding, or corporate assignment? We provide continuous dedicated chauffeur mobility, international payment options, and tarmac greetings.
          </p>
        </div>

        {/* NRI Service Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-16 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          {[
            {
              title: 'Airport & Home Delivery',
              desc: 'Your car is waiting at arrivals, or delivered straight to your door.',
            },
            {
              title: 'Monthly Rentals',
              desc: 'Flexible long-term plans for extended stays, billed once.',
            },
            {
              title: 'Luxury & Family Fleet',
              desc: 'From wedding cars to spacious 7-seaters for the whole family.',
            },
            {
              title: 'Document Verification',
              desc: 'Passport, visa, and license uploaded and verified before you arrive.',
            },
            {
              title: 'International Payments',
              desc: 'Pay from abroad in your currency, no local bank account needed.',
            },
            {
              title: '24×7 Concierge',
              desc: 'Priority support and WhatsApp assistance for the length of your trip.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="min-h-[158px] bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 p-8 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0 lg:border-r lg:[&:nth-child(3n)]:border-r-0"
            >
              <div className="flex items-start gap-6">
                <span
                  className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-zinc-950 dark:bg-white"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-zinc-950 dark:text-white">{item.title}</h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* NRI Booking Enquiry Form */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-8 sm:p-12 shadow-xl max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white uppercase tracking-wide">
              Submit Your Travel Itinerary
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Our International Concierge Team will customize your fleet and provide fixed international rates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mr. Rajesh Reddy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Resident Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                >
                  <option value="United States">United States (USA)</option>
                  <option value="United Kingdom">United Kingdom (UK)</option>
                  <option value="United Arab Emirates">United Arab Emirates (UAE / Dubai)</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Other">Other Overseas Country</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="rajesh@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  WhatsApp Number (with Country Code)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Arrival Flight Number
                </label>
                <input
                  type="text"
                  placeholder="E.g. BA 277 / EK 526"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Arrival Date in Hyderabad
                </label>
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Departure Date
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Pickup Location
                </label>
                <input
                  type="text"
                  placeholder="Airport, hotel, or pickup address"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Drop-off Location
                </label>
                <input
                  type="text"
                  placeholder="Hotel, home, or destination"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Vehicle Preference
                </label>
                <select
                  value={vehiclePreference}
                  onChange={(e) => setVehiclePreference(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                >
                  <option value="Mercedes S-Class or Maybach">Mercedes S-Class / Maybach</option>
                  <option value="Range Rover Autobiography">Range Rover Autobiography LWB</option>
                  <option value="Toyota Fortuner Legender">Toyota Fortuner Legender 4x4</option>
                  <option value="Innova HyCross Hybrid Ottoman">Toyota Innova HyCross Hybrid (7 Seater)</option>
                  <option value="Rolls-Royce Ghost">Rolls-Royce Ghost Series II</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Service Category
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                >
                  <option value="Chauffeur Dedicated (Full Stay)">Chauffeur Dedicated (Entire Stay)</option>
                  <option value="Self Drive Long Duration">Self-Drive Monthly Rental</option>
                  <option value="Airport Pickup + Wedding Motorcade">Airport Pickup + Event Motorcade</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                Specific Instructions or Family Requirements
              </label>
              <textarea
                rows={3}
                placeholder="Mention multiple stops, outstation trips, child car seats, or airport meeting details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg"
            >
              {isSubmitting ? 'Transmitting Schedule...' : 'Request NRI Mobility Package'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
