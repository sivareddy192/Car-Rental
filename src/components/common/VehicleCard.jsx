import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Users, Fuel, Gauge, Star, ArrowRight } from 'lucide-react';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { motion } from 'framer-motion';
import { CloudinaryImage } from './CloudinaryImage';

export const VehicleCard = ({ vehicle, serviceType }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const isLiked = wishlistItems.some((item) => item._id === vehicle._id);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(vehicle));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl dark:shadow-lg"
    >
      {/* Vehicle Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <CloudinaryImage
          src={vehicle.mainImage}
          alt={`${vehicle.brand} ${vehicle.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 dark:from-zinc-950 via-transparent to-transparent" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider text-white border border-white/20">
          {vehicle.category}
        </div>

        {/* Animated Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleLikeClick}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          id={`wishlist-btn-${vehicle._id}`}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/90 active:scale-90 transition-all z-10"
        >
          <motion.div
            animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked ? 'fill-rose-500 stroke-rose-500 text-rose-500' : 'text-white'
              }`}
            />
          </motion.div>
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-medium text-amber-300 border border-white/20">
          <Star className="w-3 h-3 fill-amber-400 stroke-none" />
          <span>{vehicle.rating || '5.0'}</span>
          <span className="text-zinc-300 text-[10px]">({vehicle.reviewsCount || 10})</span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {vehicle.brand}
          </div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white group-hover:text-black dark:group-hover:text-zinc-200 transition-colors mt-0.5 truncate">
            {vehicle.name}
          </h3>

          {/* Specs Row */}
          <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-zinc-100 dark:border-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-300" />
              <span>{vehicle.seatingCapacity} Seats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-300" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-300" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">Daily Tariff</span>
            <div className="text-base font-extrabold text-zinc-950 dark:text-white">
              ₹{Number(vehicle.pricePerDay).toLocaleString('en-IN')}
              <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400"> /day</span>
            </div>
          </div>

          <Link
            to={`/vehicles/${vehicle._id}${serviceType ? `?service=${encodeURIComponent(serviceType)}` : ''}`}
            id={`book-vehicle-${vehicle._id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold text-xs tracking-wider uppercase active:scale-95 transition-all shadow"
          >
            <span>Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
