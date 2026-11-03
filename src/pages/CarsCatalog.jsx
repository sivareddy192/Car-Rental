import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Car,
  Bike,
  Search,
  MapPin,
  Calendar,
  Clock,
  SlidersHorizontal,
  Users,
  Fuel,
  Star,
  Heart,
  ChevronDown,
  RotateCcw,
  Building2,
  Check,
  X,
  Filter,
  Zap
} from 'lucide-react';
import Axios, { fetchWithCache } from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { getWishlist, toggleWishlist } from '../utils/wishlistStorage';
import toast from 'react-hot-toast';
import OptimizedImage from '../components/common/OptimizedImage';
import useDebounce from '../hooks/useDebounce';

export default function CarsCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters matching Screen 5 in Design
  const [vehicleType, setVehicleType] = useState(() => searchParams.get("vehicleType") || "all");
  const [location, setLocation] = useState(searchParams.get("city") || "Bangalore");
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cat = searchParams.get("category");
    return cat ? [cat.toLowerCase()] : [];
  });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceMax, setPriceMax] = useState(5000);
  const debouncedPriceMax = useDebounce(priceMax, 300);
  const [transmission, setTransmission] = useState("all");
  const [fuelType, setFuelType] = useState("all");
  const [sortBy, setSortBy] = useState("nearest");

  // Mobile Filter Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState(() => new Set(getWishlist()));

  useEffect(() => {
    const handleWishlistUpdate = () => {
      setFavorites(new Set(getWishlist()));
    };
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, []);

  const carCategoriesList = [
    { id: "hatchback", name: "Hatchback", count: 32 },
    { id: "sedan", name: "Sedan", count: 24 },
    { id: "suv", name: "SUV", count: 18 },
    { id: "luxury", name: "Luxury Cars", count: 8 },
    { id: "premium", name: "Premium Cars", count: 14 },
    { id: "electric", name: "Electric Cars", count: 10 }
  ];

  const bikeCategoriesList = [
    { id: "activa", name: "Activa", count: 28 },
    { id: "cruiser", name: "Cruiser / Bullet", count: 16 },
    { id: "sports", name: "Sports Bike", count: 20 },
    { id: "electric bike", name: "EV Bikes", count: 14 },
    { id: "commuter", name: "Commuter Bike", count: 22 },
    { id: "touring", name: "Touring / Adventure", count: 12 }
  ];

  const carBrandsList = [
    { id: "Maruti", name: "Maruti" },
    { id: "Hyundai", name: "Hyundai" },
    { id: "Kia", name: "Kia" },
    { id: "Toyota", name: "Toyota" },
    { id: "BMW", name: "BMW" },
    { id: "Mercedes", name: "Mercedes" }
  ];

  const bikeBrandsList = [
    { id: "Royal Enfield", name: "Royal Enfield" },
    { id: "Yamaha", name: "Yamaha" },
    { id: "Honda", name: "Honda" },
    { id: "KTM", name: "KTM" },
    { id: "Ather", name: "Ather" },
    { id: "TVS", name: "TVS" },
    { id: "Bajaj", name: "Bajaj" }
  ];

  const categoriesList = vehicleType === "bike"
    ? bikeCategoriesList
    : (vehicleType === "car" ? carCategoriesList : [...carCategoriesList, ...bikeCategoriesList]);

  const brandsList = vehicleType === "bike"
    ? bikeBrandsList
    : (vehicleType === "car" ? carBrandsList : [...carBrandsList, ...bikeBrandsList]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await fetchWithCache({
        ...SummaryApi.cars.getPublic,
        params: {
          ...(location && { city: location }),
          maxPrice: debouncedPriceMax,
          ...(transmission !== "all" && { transmission }),
          ...(fuelType !== "all" && { fuelType }),
          ...(vehicleType !== "all" && { vehicleType })
        }
      });
      if (res.data?.success) {
        setCars(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load cars", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [location, debouncedPriceMax, transmission, fuelType, vehicleType]);

  useEffect(() => {
    const vt = searchParams.get("vehicleType");
    if (vt && vt !== vehicleType) setVehicleType(vt);
    const cityParam = searchParams.get("city");
    if (cityParam) setLocation(cityParam);
    const cat = searchParams.get("category");
    if (cat) setSelectedCategories([cat.toLowerCase()]);
  }, [searchParams]);

  const handleVehicleTypeChange = (type) => {
    setVehicleType(type);
    setSelectedCategories([]);
    setSelectedBrands([]);
    const params = new URLSearchParams(searchParams);
    if (type === "all") {
      params.delete("vehicleType");
    } else {
      params.set("vehicleType", type);
    }
    setSearchParams(params);
  };

  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const toggleBrand = (brandName) => {
    setSelectedBrands(prev =>
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
  };

  const toggleFavorite = (id, carName) => {
    const added = toggleWishlist(id);
    setFavorites(new Set(getWishlist()));
    toast.success(added ? `Saved ${carName || 'vehicle'} to wishlist!` : `Removed ${carName || 'vehicle'} from wishlist`);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceMax(10000);
    setTransmission("all");
    setFuelType("all");
  };

  // Active filters count for mobile badge
  const activeFiltersCount = 
    (selectedCategories.length > 0 ? selectedCategories.length : 0) +
    (selectedBrands.length > 0 ? selectedBrands.length : 0) +
    (transmission !== "all" ? 1 : 0) +
    (priceMax < 10000 ? 1 : 0);

  // Fallback cars & bikes if database is initializing
  const defaultList = [
    {
      _id: "6ae5ffb4c1ab733b470462d2",
      vehicleType: "car",
      brand: "Maruti",
      model: "Swift",
      category: "Hatchback",
      year: 2022,
      seats: 5,
      fuel: "Petrol",
      transmission: "Manual",
      dailyPrice: 899,
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80",
      shopName: "DriveHub Rentals",
      shopDistance: "2.5 km",
      shopRating: 4.6,
      reviewsCount: 120
    },
    {
      _id: "6ae5ffb4c1ab733b470462d3",
      vehicleType: "car",
      brand: "Hyundai",
      model: "Creta",
      category: "SUV",
      year: 2023,
      seats: 5,
      fuel: "Petrol",
      transmission: "Automatic",
      dailyPrice: 1699,
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
      shopName: "City Wheels",
      shopDistance: "3.1 km",
      shopRating: 4.5,
      reviewsCount: 84
    },
    {
      _id: "bike_1",
      vehicleType: "bike",
      brand: "Royal Enfield",
      model: "Classic 350",
      category: "Cruiser",
      year: 2023,
      seats: 2,
      fuel: "Petrol",
      transmission: "Manual",
      engineCapacity: "349 cc",
      dailyPrice: 899,
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
      shopName: "DriveHub Rentals",
      shopDistance: "2.5 km",
      shopRating: 4.9,
      reviewsCount: 95
    },
    {
      _id: "bike_3",
      vehicleType: "bike",
      brand: "Honda",
      model: "Activa 6G",
      category: "Activa",
      year: 2024,
      seats: 2,
      fuel: "Petrol",
      transmission: "Automatic",
      engineCapacity: "109 cc",
      dailyPrice: 399,
      image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80",
      shopName: "ProDrive Rentals",
      shopDistance: "1.2 km",
      shopRating: 4.7,
      reviewsCount: 142
    }
  ];

  const processedCars = cars.length > 0
    ? cars.map(car => ({
        _id: car._id,
        vehicleType: car.vehicleType || "car",
        brand: car.vehicleDetails?.brand || car.brand,
        model: car.vehicleDetails?.model || car.carModel,
        category: ((car.vehicleDetails?.category || car.category || "") === "Scooter" ? "Activa" : (car.vehicleDetails?.category || car.category)),
        year: car.vehicleDetails?.manufacturingYear || car.year || 2023,
        seats: car.vehicleDetails?.seatingCapacity || car.seatingCapacity || (car.vehicleType === "bike" ? 2 : 5),
        fuel: car.vehicleDetails?.fuelType || car.fuelType || "Petrol",
        transmission: car.vehicleDetails?.transmission || car.transmission || "Manual",
        engineCapacity: car.vehicleDetails?.engineCapacity || car.engineCapacity || "",
        dailyPrice: car.rentalDetails?.dailyPrice || car.pricing?.perDay || 1499,
        image: car.images?.frontImage || car.images?.[0]?.url || defaultList[0].image,
        shopName: car.rentalShop?.name || "DriveHub Rentals",
        shopDistance: car.rentalShop?.distance || "2.5 km",
        shopRating: car.rentalShop?.rating || 4.8,
        reviewsCount: car.rentalShop?.reviewsCount || 120,
        availabilityStatus: car.availabilityStatus || (car.isBooked ? "booked" : "available"),
        isBooked: car.isBooked || car.availabilityStatus === "booked"
      }))
    : defaultList;

  // Filter client-side by category & brand & vehicleType
  const filteredCars = processedCars.filter(c => {
    if (vehicleType !== "all" && c.vehicleType !== vehicleType) {
      return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(c.category?.toLowerCase())) {
      return false;
    }
    if (selectedBrands.length > 0 && !selectedBrands.includes(c.brand)) {
      return false;
    }
    return true;
  });

  // Reusable Filter Content (Used in Desktop Sidebar & Mobile Drawer)
  const FilterContent = () => (
    <div className="space-y-6 text-xs">
      {/* Location Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Location
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City (e.g. Bangalore)"
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-hidden focus:border-blue-500"
          />
        </div>
      </div>

      {/* Vehicle Type Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Vehicle Type
        </label>
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
          {[
            { id: "all", label: "All" },
            { id: "car", label: "Cars" },
            { id: "bike", label: "Bikes" },
          ].map(vt => (
            <button
              key={vt.id}
              type="button"
              onClick={() => handleVehicleTypeChange(vt.id)}
              className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                vehicleType === vt.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              {vt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Category Checkboxes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Vehicle Category
        </label>
        <div className="space-y-2.5">
          {categoriesList.map(cat => {
            const checked = selectedCategories.includes(cat.id);
            return (
              <label
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-0.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                    checked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  }`}>
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-medium">{cat.name}</span>
                </div>
                <span className="text-[11px] text-slate-400">({cat.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Brand Checkboxes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Brand
        </label>
        <div className="space-y-2.5">
          {brandsList.map(brand => {
            const checked = selectedBrands.includes(brand.id);
            return (
              <label
                key={brand.id}
                onClick={() => toggleBrand(brand.id)}
                className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-0.5"
              >
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                  checked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}>
                  {checked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="font-medium">{brand.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold uppercase tracking-wider text-slate-400">Max Daily Rate</span>
          <span className="font-extrabold text-blue-600 dark:text-blue-400">₹{priceMax}/day</span>
        </div>
        <input
          type="range"
          min="500"
          max="10000"
          step="500"
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>₹500</span>
          <span>₹10,000+</span>
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Transmission
        </label>
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
          {['all', 'Manual', 'Automatic'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTransmission(t)}
              className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                transmission === t
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Results Header (Location & Dates Bar) */}
        <div className="bg-white dark:bg-[#161B26] p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900 dark:text-white capitalize">
                  {location || "All Locations"}
                </span>
                <span className="text-xs text-slate-400">• Jan 15 - Jan 18</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing {filteredCars.length} available {vehicleType === "bike" ? "bikes" : (vehicleType === "car" ? "cars" : "vehicles")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden cursor-pointer"
            >
              <option value="nearest">Nearest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* MOBILE CONTROLS BAR (Hidden on Desktop) */}
        <div className="lg:hidden flex flex-col gap-3">
          {/* Quick Category Chips for One-Tap Filtering on Mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategories([])}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategories.length === 0
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              All Types
            </button>
            {categoriesList.map(cat => {
              const isActive = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>{cat.name}</span>
                  {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              );
            })}
          </div>

          {/* Filter Trigger Button for Mobile */}
          <div className="flex items-center justify-between bg-white dark:bg-[#161B26] p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-blue-600 text-[10px] font-extrabold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Layout: Left Sidebar Filters (Desktop Only) + Right Vehicle Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* DESKTOP SIDEBAR (Strictly Hidden on Mobile/Phone) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-[#161B26] p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6 lg:sticky lg:top-24">
            
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                Filters
              </span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <FilterContent />
          </aside>

          {/* Right Column: Car Listing Cards */}
          <main className="lg:col-span-9 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-44 rounded-3xl bg-white dark:bg-[#161B26] animate-pulse border border-slate-200 dark:border-slate-800" />
                ))}
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#161B26] border border-dashed border-slate-200 dark:border-slate-800">
                <Car className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No cars match your criteria</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Try clearing filters or searching for another city.</p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredCars.map(car => {
                const isFav = favorites.has(car._id);
                return (
                  <div
                    key={car._id}
                    className="group bg-white dark:bg-[#161B26] rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5"
                  >
                    {/* Left: Car Photo */}
                    <div className="relative w-full md:w-56 h-48 md:h-40 shrink-0 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/80">
                      <OptimizedImage
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        targetWidth={600}
                        aspectRatio="h-full w-full"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Center: Vehicle Info & Specs */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white ${
                          car.vehicleType === "bike" ? "bg-amber-600" : "bg-blue-600"
                        }`}>
                          {car.vehicleType === "bike" ? "🏍️ Bike" : "🚗 Car"}
                        </span>
                        <h3 className="font-black text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {car.brand} {car.model}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {car.category} • {car.year}
                      </p>

                      {/* Specs Row */}
                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {car.vehicleType === "bike" ? (
                          <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                            <Zap className="w-3.5 h-3.5" />
                            {car.engineCapacity || "350 cc"}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {car.seats} Seats
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Fuel className="w-3.5 h-3.5 text-slate-400" />
                          {car.fuel}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                          {car.transmission}
                        </span>
                      </div>

                      {/* Rental Shop Info: DriveHub Rentals • 2.5 km • ★ 4.6 */}
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3 text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {car.shopName}
                        </span>
                        <span className="text-slate-400 text-[11px]">• {car.shopDistance}</span>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-500" />
                          {car.shopRating}
                        </span>
                      </div>
                    </div>

                    {/* Right: Badge, Heart, Pricing & Actions */}
                    <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 md:pl-4 md:border-l md:border-slate-100 md:dark:border-slate-800 gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        {car.isBooked || car.availabilityStatus === "booked" ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Booked / Not Available
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Available
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(car._id)}
                          aria-label="Add to favorites"
                          className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                          ₹{car.dailyPrice?.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">/day</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/car/${car._id}`}
                          className="py-2 px-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          View Details
                        </Link>
                        {car.isBooked || car.availabilityStatus === "booked" ? (
                          <button
                            type="button"
                            disabled
                            className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                          >
                            Booked
                          </button>
                        ) : (
                          <Link
                            to={`/car/${car._id}`}
                            className="py-2 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all active:scale-95"
                          >
                            Book Now
                          </Link>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </main>

        </div>

      </div>

      {/* MOBILE FILTER BOTTOM SHEET / DRAWER */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-slate-500 hover:text-blue-600 transition cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Filters Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <FilterContent />
            </div>

            {/* Drawer Footer CTA */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition cursor-pointer text-center"
              >
                Apply Filters (Showing {filteredCars.length} Cars)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
