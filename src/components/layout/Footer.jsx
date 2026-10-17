import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-zinc-50 dark:bg-black border-t border-zinc-200 dark:border-zinc-900 text-zinc-600 dark:text-zinc-400 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white">
                <Crown className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
              </div>
              <span className="font-serif text-xl tracking-[0.2em] font-bold text-zinc-950 dark:text-white uppercase">
                Car Rental
              </span>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed max-w-sm">
              The premier luxury automotive mobility service. Curating flagship sedans, exotics,
              and executive SUVs with white-glove chauffeur delivery and self-drive privileges.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Certified 100% Verified Fleet & Instant Digital Contracts</span>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-950 dark:text-white mb-4">
              Mobility Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/self-drive" className="hover:text-black dark:hover:text-white transition-colors">
                  Self-Drive Exotics
                </Link>
              </li>
              <li>
                <Link to="/taxi" className="hover:text-black dark:hover:text-white transition-colors">
                  VIP Chauffeur Taxi
                </Link>
              </li>
              <li>
                <Link to="/wedding-cars" className="hover:text-black dark:hover:text-white transition-colors">
                  Wedding Car Fleet
                </Link>
              </li>
              <li>
                <Link to="/nri-solutions" className="hover:text-black dark:hover:text-white transition-colors">
                  NRI Concierge Solutions
                </Link>
              </li>
              <li>
                <Link to="/tours" className="hover:text-black dark:hover:text-white transition-colors">
                  Royal Tour Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-950 dark:text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-black dark:hover:text-white transition-colors">
                  Saved Vehicles
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-black dark:hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-black dark:hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-black dark:hover:text-white transition-colors">
                  Member Portal
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-black dark:hover:text-white transition-colors">
                  Register Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-950 dark:text-white mb-4">
              Concierge Desk
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-500 dark:text-zinc-300 shrink-0 mt-0.5" />
                <span>Road No 36, Jubilee Hills, Hyderabad 500033</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-zinc-500 dark:text-zinc-300 shrink-0" />
                <span>+91 98765 00001 (24/7 Hotline)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-zinc-500 dark:text-zinc-300 shrink-0" />
                <span>concierge@royaldrives.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-zinc-200 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-4">
          <p>&copy; {new Date().getFullYear()} Car Rental Luxury Fleet Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-zinc-500 dark:text-zinc-400">
            <span>Powered by Resend Transactional Delivery</span>
            <span>Privacy Policy</span>
            <span>Terms of Rental</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
