import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, Trash2, ArrowRight, Car } from 'lucide-react';
import { VehicleCard } from '../components/common/VehicleCard';
import { SEOHead } from '../components/common/SEOHead';
import { fetchWishlist, clearWishlist } from '../store/slices/wishlistSlice';

export const Wishlist = () => {
  const { items, isLoading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 pt-28 pb-20 transition-colors duration-300">
      <SEOHead
        title="Saved Vehicles & Wishlist — Car Rental"
        description="View your saved luxury supercars, executive sedans, and SUVs."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-900 pb-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Personal Collection</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight">
              Saved Vehicles
            </h1>
          </div>

          {items.length > 0 && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              {items.length} {items.length === 1 ? 'vehicle' : 'vehicles'} saved
            </span>
          )}
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-16 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <Heart className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto" />
            <h2 className="font-serif text-xl font-bold text-zinc-950 dark:text-white">Sign In to Save Vehicles</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Create an account or log in to sync your preferred vehicles across devices and receive private rate alerts.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
              >
                <span>Sign In Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-16 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <Car className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto" />
            <h2 className="font-serif text-xl font-bold text-zinc-950 dark:text-white">Your Wishlist is Empty</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Browse our showroom of supercars, Maybach limousines, and SUVs to favorite your preferred models.
            </p>
            <div className="pt-2">
              <Link
                to="/self-drive"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
              >
                <span>Explore Fleet Showroom</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
