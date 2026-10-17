import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { WhatsAppButton } from '../components/layout/WhatsAppButton';
import api from '../services/api';
import toast from 'react-hot-toast';

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry & Reservations',
    message: '',
    botCheck: '', // Anti-spam hidden honeypot
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        toast.success('Thank you! Your message has been received by our fleet concierge.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry & Reservations',
          message: '',
          botCheck: '',
        });
      }
    } catch (err) {
      toast.error('Could not deliver message. Please contact us via phone or WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 pt-28 pb-20 transition-colors duration-300">
      <SEOHead
        title="Contact Us & Fleet Concierge — Car Rental"
        description="Connect with Car Rental luxury mobility desk. 24/7 customer support, office locations in Jubilee Hills, Hyderabad, phone, email, and WhatsApp."
      />

      <WhatsAppButton customMessage="Hello Car Rental Concierge, I would like to get in touch regarding a luxury rental." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase tracking-widest text-zinc-800 dark:text-zinc-300 mb-3 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
            <span>24/7 Dedicated Concierge Desk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight">
            Contact Car Rental
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
            Have a specialized fleet request, wedding schedule, corporate agreement, or immediate airport transfer? Our executive mobility directors are available around the clock.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT COLUMN: CONTACT DETAILS & OPERATING HOURS */}
          <div className="space-y-6">
            <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-zinc-950 dark:text-white uppercase tracking-wide">
                Headquarters
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-zinc-950 dark:text-white block">Corporate Showroom & Fleet Hub</span>
                    <span className="text-zinc-600 dark:text-zinc-400">Road No 36, Jubilee Hills, Hyderabad 500033</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-zinc-950 dark:text-white block">24/7 VIP Hotline</span>
                    <span className="text-zinc-600 dark:text-zinc-400">+91 98765 00001 / +91 98765 43210</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-zinc-950 dark:text-white block">Official Electronic Dispatch</span>
                    <span className="text-zinc-600 dark:text-zinc-400">concierge@royaldrives.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-zinc-950 dark:text-white block">Operating Hours</span>
                    <span className="text-zinc-600 dark:text-zinc-400">24 Hours / 7 Days a Week (All 365 Days)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-850">
                <a
                  href="https://wa.me/919876543210?text=Hello%20Car Rental%20Concierge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Airport Hub Box */}
            <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300 block mb-1">
                Airport Terminal Kiosk
              </span>
              <h4 className="font-serif text-sm font-bold text-zinc-950 dark:text-white">Shamshabad International Airport (HYD)</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                VIP Arrival Tarmac Desk, Pillar 4, Outer Arrival Lane. Chauffeurs available within 15 minutes of plane touchdown.
              </p>
            </div>
          </div>

          {/* RIGHT 2 COLUMNS: VALIDATED INTERACTIVE FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-8 sm:p-10 rounded-3xl shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white uppercase tracking-wide mb-2">
                Send an Executive Dispatch
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-8">
                Fill out the transmission form below. All correspondence is encrypted and processed promptly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Anti-spam hidden honeypot (bots fill this, humans don't) */}
                <input
                  type="text"
                  name="botCheck"
                  value={formData.botCheck}
                  onChange={(e) => setFormData({ ...formData, botCheck: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex="-1"
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Lord / Lady / Mr. Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                      Mobile / Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                    >
                      <option value="General Inquiry & Reservations">General Inquiry & Reservations</option>
                      <option value="Self Drive Exotic Car Booking">Self-Drive Exotic Car Booking</option>
                      <option value="Wedding Motorcade Consultation">Wedding Motorcade Consultation</option>
                      <option value="Corporate Fleet Long-Term Contract">Corporate Fleet Long-Term Contract</option>
                      <option value="NRI Airport Greeting Service">NRI Airport Greeting Service</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
                    Message Details
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Provide details regarding dates, vehicle preferences, or custom chauffeur requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting Dispatch...' : 'Send Message to Concierge'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
