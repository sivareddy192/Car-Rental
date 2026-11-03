import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Search, 
    Calendar, 
    ShieldCheck, 
    Key, 
    Car, 
    CheckCircle2, 
    Clock, 
    Sparkles, 
    ChevronDown, 
    ChevronUp, 
    ArrowRight, 
    Phone, 
    MapPin, 
    Award,
    CreditCard
} from 'lucide-react';

const STEPS = [
    {
        step: "01",
        title: "Find Your Ideal Vehicle",
        subtitle: "Search & Compare",
        description: "Choose from 500+ inspected hatchbacks, sedans, SUVs, and luxury vehicles across certified dealer hubs in your city. Filter by category, transmission, brand, or price.",
        icon: Search,
        badge: "Step 1"
    },
    {
        step: "02",
        title: "Choose Dates & Schedule",
        subtitle: "Flexible Rental Plans",
        description: "Select your pickup and return dates with transparent daily, weekly, and monthly rates. See exact pricing breakdown including security deposit with zero hidden fees.",
        icon: Calendar,
        badge: "Step 2"
    },
    {
        step: "03",
        title: "Fast Dealer Approval",
        subtitle: "Verified & Atomic",
        description: "Your booking request goes straight to the vehicle dealer for immediate confirmation. Enjoy atomic availability locking that prevents double-booking disputes.",
        icon: ShieldCheck,
        badge: "Step 3"
    },
    {
        step: "04",
        title: "Pick Up & Hit the Road",
        subtitle: "Key Handover",
        description: "Collect your freshly sanitized, fully fueled car from the showroom or opt for doorstep delivery. Drive with peace of mind backed by 24/7 roadside assistance.",
        icon: Key,
        badge: "Step 4"
    }
];

const FAQS = [
    {
        q: "What documents do I need to rent a vehicle?",
        a: "You need an original, valid Indian or International Driving Licence (held for at least 1 year) and a government-issued photo ID proof (Aadhaar Card, Passport, or Voter ID). No lengthy paperwork required."
    },
    {
        q: "How and when is the security deposit refunded?",
        a: "Your refundable security deposit is processed automatically within 24 to 48 hours of vehicle return, subject to standard vehicle condition inspection and any applicable toll or extra km deductions."
    },
    {
        q: "What is DriveRent's fuel policy?",
        a: "We operate on a transparent Full-to-Full fuel policy. The car is handed over with a full tank of fuel, and you simply return it with a full tank."
    },
    {
        q: "Can I cancel or modify my booking?",
        a: "Yes! DriveRent offers 100% free cancellation up to 24 hours prior to your scheduled pickup time with no cancellation penalty."
    },
    {
        q: "What happens if the vehicle encounters a breakdown?",
        a: "Every DriveRent rental comes with round-the-clock 24/7 Roadside Assistance. In the rare event of mechanical trouble or a flat tyre, call our emergency hotline for immediate on-site support or a replacement vehicle."
    }
];

const HowItWorks = () => {
    const [openFaq, setOpenFaq] = useState(0);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors">
            
            {/* Hero Section */}
            <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                        <Sparkles className="w-3.5 h-3.5" />
                        Simple, Transparent, Seamless
                    </span>

                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        How <span className="text-blue-600">DriveRent</span> Works
                    </h1>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Rent verified cars from certified dealerships with instant confirmation, zero hidden costs, and comprehensive roadside protection.
                    </p>

                    <div className="pt-2 flex flex-wrap justify-center gap-3">
                        <Link
                            to="/cars"
                            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center gap-2"
                        >
                            <Car className="w-4 h-4" />
                            Explore Rental Cars
                        </Link>
                        <Link
                            to="/rental-shops"
                            className="px-6 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-blue-600 font-bold text-sm transition"
                        >
                            Browse Rental Hubs
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4 Steps Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        Your Journey in 4 Simple Steps
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                        From choosing your dream car to dropping off the keys, our process is designed for speed and convenience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STEPS.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={item.step}
                                className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <span className="text-3xl font-extrabold text-slate-200 dark:text-slate-800 font-mono">
                                            {item.step}
                                        </span>
                                    </div>

                                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                                        {item.subtitle}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                                    <span>Learn more</span>
                                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Why Choose DriveRent */}
            <section className="bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            Why Rent With DriveRent?
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                            Industry-leading standards for vehicle safety, hygiene, pricing transparency, and customer satisfaction.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center">
                                <Award className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Certified Rental Hubs</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Every dealer is verified through strict GST, commercial permits, Aadhaar, and physical location checks before listing cars.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">30-Point Inspection</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Brakes, tyres, suspension, fluid levels, and air conditioning are inspected thoroughly prior to every rental departure.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 flex items-center justify-center">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Free Cancellation</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Plans changed? Cancel with zero cancellation fee up to 24 hours before your trip begins.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 flex items-center justify-center">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Transparent Pricing</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Clear daily, weekly, and monthly rates. Know your security deposit and per-km extra charges upfront.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Comprehensive Coverage</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Vehicles come insured with comprehensive policy options and maximum liability caps to protect your journey.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 flex items-center justify-center">
                                <Phone className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">24/7 Roadside Assistance</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Rapid dispatch towing, puncture repair, and jumpstart support accessible round the clock anywhere in India.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs Accordion */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Everything you need to know about renting a car on DriveRent.
                    </p>
                </div>

                <div className="space-y-3">
                    {FAQS.map((faq, index) => {
                        const isOpen = openFaq === index;
                        return (
                            <div
                                key={index}
                                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 transition"
                                >
                                    <span>{faq.q}</span>
                                    {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                                </button>
                                {isOpen && (
                                    <div className="px-6 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Final CTA Strip */}
                <div className="mt-14 p-8 rounded-3xl bg-blue-600 text-white text-center space-y-4 shadow-xl shadow-blue-500/20">
                    <h3 className="text-2xl font-extrabold">Ready to Start Your Next Journey?</h3>
                    <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto">
                        Book verified cars from top-rated hubs in minutes with zero paperwork delays.
                    </p>
                    <div className="pt-2">
                        <Link
                            to="/cars"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-white hover:bg-slate-100 text-blue-600 font-bold text-sm shadow-md transition"
                        >
                            <Car className="w-4 h-4" />
                            Book a Car Now
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HowItWorks;

