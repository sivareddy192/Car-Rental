import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Calendar,
  MapPin,
  CheckCircle,
  Users,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Crown,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { WhatsAppButton } from '../components/layout/WhatsAppButton';
import api from '../services/api';
import toast from 'react-hot-toast';

export const WeddingCars = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [venue, setVenue] = useState('Taj Falaknuma Palace, Hyderabad');
  const [selectedVehicle, setSelectedVehicle] = useState('Rolls-Royce Ghost Series II');
  const [decorationTheme, setDecorationTheme] = useState('Classic White Orchids & Satin Ribbons');
  const [chauffeurUniform, setChauffeurUniform] = useState('Formal Tuxedo');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weddingFleet = [
    {
      name: 'Rolls-Royce Ghost Extended',
      tag: 'Flagship Imperial',
      price: '₹1,25,000 / day',
      image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80',
      desc: 'The undisputed monarch of wedding entries. Handcrafted starlight headliner, whispering V12 engine, and regal presence.',
    },
    {
      name: 'Mercedes-Maybach S 580',
      tag: 'Palace Lounge',
      price: '₹65,000 / day',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      desc: 'First-class rear executive suite with footrests, champagne flutes, and unmatched bridal gown ingress comfort.',
    },
    {
      name: 'Range Rover Autobiography LWB',
      tag: 'Royal Motorcade',
      price: '₹58,000 / day',
      image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80',
      desc: 'Commanding escort vehicle favored for groom baraat motorcades and high-profile wedding entourage security.',
    },
    {
      name: 'Porsche 911 Carrera Cabriolet',
      tag: 'Grand Bride & Groom Getaway',
      price: '₹85,000 / day',
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      desc: 'Open-top fairytale departure. Celebrate your newlywed exit under the stars with cinematic flair.',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !weddingDate) {
      toast.error('Please complete mandatory wedding event details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/enquiries', {
        enquiryType: 'wedding',
        name,
        email,
        phone,
        serviceDetails: {
          venue,
          selectedVehicle,
          decorationTheme,
          chauffeurUniform,
          notes,
        },
        dates: {
          startDate: weddingDate,
          endDate: weddingDate,
        },
      });

      if (res.data.success) {
        toast.success('Your wedding fleet enquiry was submitted. Our matrimonial specialist will call you.');
        setName('');
        setEmail('');
        setPhone('');
        setNotes('');
      }
    } catch (err) {
      toast.error('Could not submit wedding request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 pt-28 pb-20 transition-colors duration-300">
      <SEOHead
        title="Luxury Wedding Cars & Motorcades — Car Rental"
        description="Hire Rolls-Royce, Maybach, and luxury wedding motorcades in Hyderabad. Fresh orchid decoration, suited chauffeurs, and red-carpet protocol."
      />

      <WhatsAppButton customMessage={`Hello, I want to inquire about renting the ${selectedVehicle} for a wedding at ${venue}.`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase tracking-widest text-zinc-800 dark:text-zinc-300 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
            <span>Matrimonial Prestige Fleet</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight">
            Royal Wedding Cars
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
            Create an indelible grand entrance. From Rolls-Royce bridal vehicles to synchronized Maybach motorcades, decorated with artisanal florals and commanded by suited chauffeurs.
          </p>
        </div>

        {/* Wedding Fleet Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {weddingFleet.map((car) => (
            <div
              key={car.name}
              className="group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-amber-300 border border-zinc-700 uppercase tracking-wider">
                  {car.tag}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-serif text-xl font-bold text-zinc-950 dark:text-white">{car.name}</h3>
                  <span className="text-xs font-mono font-bold text-zinc-950 dark:text-white">{car.price}</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{car.desc}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVehicle(car.name);
                    document.getElementById('wedding-enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <span>Select for My Wedding</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Wedding Quote & Decoration Form */}
        <div
          id="wedding-enquiry-form"
          className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-8 sm:p-12 shadow-xl max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <Crown className="w-8 h-8 text-amber-500 dark:text-amber-300 mx-auto mb-2" />
            <h2 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white uppercase tracking-wide">
              Matrimonial Concierge Booking Request
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Select your vehicle, floral styling, venue, and uniform protocol below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Bride, Groom, or Family Representative"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Wedding Event Date
                </label>
                <input
                  type="date"
                  required
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
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
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  WhatsApp Contact Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Selected Wedding Vehicle
                </label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                >
                  <option value="Rolls-Royce Ghost Series II">Rolls-Royce Ghost Extended</option>
                  <option value="Mercedes-Maybach S 580">Mercedes-Maybach S 580 Lounge</option>
                  <option value="Range Rover Autobiography">Range Rover Autobiography LWB</option>
                  <option value="Porsche 911 Carrera Cabriolet">Porsche 911 Carrera Cabriolet</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Event Venue / Convention Centre
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Taj Falaknuma, HITEX, JRC Conventions..."
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Floral & Ribbon Decoration Theme
                </label>
                <select
                  value={decorationTheme}
                  onChange={(e) => setDecorationTheme(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                >
                  <option value="Classic White Orchids & Satin Ribbons">Classic White Orchids & Satin Ribbons</option>
                  <option value="Royal Red Roses Garland & Bonnet Crest">Royal Red Roses Garland & Bonnet Crest</option>
                  <option value="Minimalist Elegance (No Bonnet Flowers)">Minimalist Elegance (Side Ribbons Only)</option>
                  <option value="Custom Florist Direct Collaboration">Custom Florist Direct Collaboration</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                  Chauffeur Attire Protocol
                </label>
                <select
                  value={chauffeurUniform}
                  onChange={(e) => setChauffeurUniform(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                >
                  <option value="Formal Tuxedo">Formal Black Tuxedo & White Gloves</option>
                  <option value="Royal Sherwani">Royal Traditional Sherwani</option>
                  <option value="Executive Safari Suit">Executive Charcoal Safari Suit</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                Special Requests or Motorcade Coordination
              </label>
              <textarea
                rows={3}
                placeholder="Mention timings for baraat entry, vidai departure, red-carpet requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg"
            >
              {isSubmitting ? 'Reserving Royal Wedding Car...' : 'Submit Wedding Car Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
