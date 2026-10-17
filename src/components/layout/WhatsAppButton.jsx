import React from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const getWhatsAppUrl = (message = 'Hello Car Rental Concierge, I would like to make an enquiry.') => {
  const rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+919876543210';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

export const WhatsAppButton = ({ customMessage, vehicleName }) => {
  const location = useLocation();

  let message = 'Hello Car Rental Concierge, I would like to make an enquiry.';

  if (customMessage) {
    message = customMessage;
  } else if (vehicleName) {
    message = `Hello, I am interested in reserving the ${vehicleName}. Please share availability and booking details.`;
  } else if (location.pathname.includes('/self-drive')) {
    message = 'Hello, I am interested in self-drive car rentals with Car Rental.';
  } else if (location.pathname.includes('/taxi')) {
    message = 'Hello, I would like to enquire about your luxury taxi service.';
  } else if (location.pathname.includes('/tours')) {
    message = 'Hello, please share your curated tour packages and pricing.';
  } else if (location.pathname.includes('/nri-solutions')) {
    message = 'Hello, I am interested in your bespoke NRI car and chauffeur solutions.';
  } else if (location.pathname.includes('/wedding-cars')) {
    message = 'Hello, I would like to enquire about luxury wedding car rentals.';
  } else if (location.pathname.includes('/contact')) {
    message = 'Hello Car Rental Team, I have an urgent enquiry.';
  }

  const whatsappUrl = getWhatsAppUrl(message);

  return (
    <motion.aside
      aria-label="Concierge WhatsApp"
      className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 lg:z-50 flex items-center gap-3 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/90 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-zinc-700 pointer-events-none shadow-xl">
        Chat with Fleet Concierge
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Concierge"
        id="btn-floating-whatsapp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 border-2 border-white/20"
      >
        <span className="absolute w-full h-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10" />
        <MessageCircle className="w-7 h-7 fill-white stroke-none" />
      </a>
    </motion.aside>
  );
};
