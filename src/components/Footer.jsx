import { ShieldCheck, Award, Clock, Phone, Mail, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCookieConsent } from '../context/CookieConsentContext';

export default function Footer() {
  const user = useSelector((state) => state?.user);
  const isLoggedIn = Boolean(user?._id || (typeof window !== 'undefined' && localStorage.getItem('accessToken')));
  const { openPreferences } = useCookieConsent();

  const benefits = [
    { icon: <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />, title: "Verified Rental Shops", detail: "RC, insurance & fitness inspected" },
    { icon: <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />, title: "Wide Vehicle Selection", detail: "Over 500+ premium & economy cars" },
    { icon: <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />, title: "Easy Booking Process", detail: "Instant confirmation & flexible dates" },
    { icon: <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />, title: "Secure & Reliable", detail: "24/7 roadside assistance & support" }
  ];

  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] text-slate-700 dark:text-slate-300 transition-colors duration-300">
      {/* Top Benefits Grid */}
      <div className="border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-8">
          {benefits.map(benefit => (
            <div key={benefit.title} className="flex items-center gap-3 border-slate-200 dark:border-slate-800 md:border-r md:px-3 last:border-r-0">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center">
                {benefit.icon}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">{benefit.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{benefit.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Links Grid: 2 Columns on Phone (Left & Right Side-by-Side), 6 Columns on Large Screens */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-8 px-4 py-12 lg:grid-cols-6">
        {/* Brand Column (Spans 2 cols on all screen sizes) */}
        <div className="col-span-2 lg:col-span-2 space-y-3 lg:pr-6">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 fill-none stroke-white stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
              Drive<span className="text-blue-600">Rent</span>
            </span>
          </Link>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            India's Leading Car &amp; Bike Rental Network
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Discover trusted rental shops, compare vehicles, and book your perfect car or bike with confidence. We connect authorized fleet dealers and premium customers with instant owner approvals and verified vehicles.
          </p>
        </div>

        {/* Quick Fleet Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
            Explore Vehicles
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><Link to="/cars" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">All Vehicles</Link></li>
            <li><Link to="/cars?vehicleType=car" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cars Fleet</Link></li>
            <li><Link to="/cars?vehicleType=bike" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Bikes Fleet</Link></li>
            <li><Link to="/cars?category=suv" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">SUVs</Link></li>
            <li><Link to="/cars?category=luxury" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Luxury Cars</Link></li>
          </ul>
        </div>

        {/* Rental Shops Column */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
            Rental Shops
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><Link to="/rental-shops" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">All Rental Shops</Link></li>
            <li><Link to="/how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How It Works</Link></li>
            <li><Link to="/cars?vehicleType=car" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Rent Cars</Link></li>
            <li><Link to="/cars?vehicleType=bike" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Rent Bikes</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
            Help &amp; Support
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            {isLoggedIn ? (
              <>
                <li><Link to="/dashboard/my-bookings" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">My Bookings</Link></li>
                <li><Link to="/dashboard/profile" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">My Profile</Link></li>
                <li><Link to="/dashboard/wishlist" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Saved Wishlist</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Create Account</Link></li>
              </>
            )}
            <li><Link to="/contact-us" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* LEGAL & POLICIES (Required Section) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
            Legal &amp; Policies
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li>
              <Link to="/terms-and-conditions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/cancellation-refund-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Cancellation &amp; Refund
              </Link>
            </li>
            <li>
              <Link to="/cookie-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Cookie Policy
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={openPreferences}
                className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Cookie Settings</span>
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Contact Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 py-4 pb-20 lg:pb-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Phone className="w-3.5 h-3.5 text-blue-600" /> +91 98765 43210
            </span>
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Mail className="w-3.5 h-3.5 text-blue-600" /> support@driverent.in
            </span>
          </div>

          <p className="text-slate-500 text-center sm:text-right">
            &copy; {new Date().getFullYear()} DriveRent Platform &bull; India DPDP Act &amp; IT Act Compliant.
          </p>
        </div>
      </div>
    </footer>
  );
}
