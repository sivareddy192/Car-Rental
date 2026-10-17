import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { VehicleCard } from '../components/common/VehicleCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { SEOHead } from '../components/common/SEOHead';
import api from '../services/api';

export const SelfDrive = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [brand, setBrand] = useState('All');
  const [fuelType, setFuelType] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [seats, setSeats] = useState('All');
  const [maxPrice, setMaxPrice] = useState(150000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const brands = ['All', 'Rolls-Royce', 'Mercedes-Maybach', 'Land Rover', 'Porsche', 'BMW', 'Audi', 'Toyota'];
  const categories = ['All', 'Self Drive', 'Luxury SUV', 'Supercar', 'Executive Sedan', 'Wedding', 'Taxi'];
  const fuelTypes = ['All', 'Petrol', 'Diesel', 'Hybrid'];
  const transmissions = ['All', 'Automatic', 'Manual'];
  const seatOptions = ['All', '2', '4', '5', '7'];

  useEffect(() => {
    const fetchFilteredVehicles = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== 'All') params.append('category', category);
        if (brand !== 'All') params.append('brand', brand);
        if (fuelType !== 'All') params.append('fuelType', fuelType);
        if (transmission !== 'All') params.append('transmission', transmission);
        if (seats !== 'All') params.append('seats', seats);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (searchQuery) params.append('search', searchQuery);
        if (sortBy) params.append('sort', sortBy);

        const res = await api.get(`/vehicles?${params.toString()}`);
        if (res.data.success) {
          setVehicles(res.data.vehicles);
        }
      } catch (err) {
        console.error('Error fetching fleet:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredVehicles();
  }, [category, brand, fuelType, transmission, seats, maxPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    setCategory('All');
    setBrand('All');
    setFuelType('All');
    setTransmission('All');
    setSeats('All');
    setMaxPrice(150000);
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 pt-28 pb-20 transition-colors duration-300">
      <SEOHead
        title="Self-Drive Fleet & Luxury Car Rentals — Car Rental"
        description="Browse our collection of self-drive supercars, luxury SUVs, and executive sedans. Filter by brand, transmission, price, and seating."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-900 pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
              <span>Showroom & Fleet Collection</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight">
              Self Drive Exotics
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl">
              Command the finest precision engineering. Guaranteed models with zero substitute policies and nationwide highway authorization.
            </p>
          </div>

          {/* Quick Search & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>

            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white flex items-center gap-1.5 text-xs font-semibold"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main Layout: Filters Sidebar + Vehicles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* DESKTOP FILTERS SIDEBAR */}
          <aside className="hidden lg:block space-y-6 bg-zinc-50/70 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl h-fit shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-850">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Refine Fleet</span>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
                Body & Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      category === cat
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
                Manufacturer Brand
              </label>
              <div className="flex flex-wrap gap-1.5">
                {brands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      brand === b
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Price Range */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                <span>Max Daily Tariff</span>
                <span className="text-zinc-950 dark:text-white font-mono font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="150000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-zinc-900 dark:accent-white bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono">
                <span>₹5,000</span>
                <span>₹1,50,000</span>
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
                Transmission
              </label>
              <div className="grid grid-cols-3 gap-2">
                {transmissions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTransmission(t)}
                    className={`py-2 text-xs font-medium rounded-lg text-center transition-all ${
                      transmission === t
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Capacity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
                Min. Seating
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {seatOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeats(s)}
                    className={`py-2 text-xs font-medium rounded-lg text-center transition-all ${
                      seats === s
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {s === 'All' ? 'All' : `${s}+`}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* VEHICLES GRID */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SkeletonCard key={n} />
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-12 text-center space-y-4">
                <p className="font-serif text-lg text-zinc-950 dark:text-white">No fleet models match your filters.</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Try adjusting the maximum tariff slider or clearing category filters.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-lg bg-zinc-950 text-white dark:bg-zinc-900 dark:border dark:border-zinc-700 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 flex justify-between items-center">
                  <span>
                    Showing <strong className="text-zinc-950 dark:text-white font-bold">{vehicles.length}</strong> luxury models
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((v) => (
                    <VehicleCard key={v._id} vehicle={v} />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
