import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, MapPin, Star, Phone, Mail, Clock, ShieldCheck, ChevronRight, Search, Loader2 } from 'lucide-react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const DEFAULT_SHOPS = [
  {
    _id: "shop_1",
    name: "DriveHub Rentals",
    rating: 4.8,
    reviewsCount: 120,
    city: "Bangalore",
    address: "12, 3rd Cross, HSR Layout, Bangalore, Karnataka 560102",
    phone: "+91 98765 43210",
    email: "drivehub@example.com",
    operatingHours: "Open • Closes 9:00 PM",
    totalCars: 14,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "shop_2",
    name: "City Wheels",
    rating: 4.6,
    reviewsCount: 84,
    city: "Bangalore",
    address: "45, 100 Feet Road, Indiranagar, Bangalore 560038",
    phone: "+91 98765 43211",
    email: "citywheels@example.com",
    operatingHours: "Open • Closes 9:30 PM",
    totalCars: 9,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "shop_3",
    name: "ProDrive Rentals",
    rating: 4.9,
    reviewsCount: 156,
    city: "Bangalore",
    address: "88, 80 Feet Road, Koramangala 4th Block, Bangalore 560034",
    phone: "+91 98765 43212",
    email: "prodrive@example.com",
    operatingHours: "Open • Closes 10:00 PM",
    totalCars: 18,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "shop_4",
    name: "Royal Car Rentals",
    rating: 4.7,
    reviewsCount: 92,
    city: "Bangalore",
    address: "21, Sampige Road, Malleshwaram, Bangalore 560003",
    phone: "+91 98765 43213",
    email: "royalrentals@example.com",
    operatingHours: "Open • Closes 8:30 PM",
    totalCars: 11,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80"
  }
];

export default function RentalShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const res = await Axios({
          ...SummaryApi.rentalShops.getAll,
          params: { ...(search.trim() && { search: search.trim() }) }
        });
        if (res.data?.success && Array.isArray(res.data.data)) {
          if (search.trim()) {
            setShops(res.data.data);
          } else {
            setShops(res.data.data.length > 0 ? res.data.data : DEFAULT_SHOPS);
          }
        } else {
          setShops(search.trim() ? [] : DEFAULT_SHOPS);
        }
      } catch {
        setShops(search.trim() ? [] : DEFAULT_SHOPS);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white">
              Authorized Network
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
              Certified Rental Shops
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Choose from verified dealership shops in your city with transparent reviews and serviced cars.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shop name, area or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-hidden focus:border-blue-500 font-medium"
            />
          </div>
        </div>

        {/* Shops Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-slate-500">Discovering verified rental hubs...</p>
          </div>
        ) : shops.length === 0 ? (
          <div className="py-16 px-6 text-center rounded-3xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                No Registered Rental Shops Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                {search.trim()
                  ? `There are currently no authorized rental partner shops registered in "${search.trim()}". Try searching another area or city like "HSR Layout", "Indiranagar", or "Bangalore".`
                  : "No rental shops available at the moment."}
              </p>
            </div>
            {search.trim() && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Clear Search & Show All Shops
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div
              key={shop._id}
              className="group rounded-3xl bg-white dark:bg-[#161B26] border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Storefront Image */}
                <div className="relative aspect-16/9 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={shop.image || shop.photos?.[0] || DEFAULT_SHOPS[0].image}
                    alt={shop.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white flex items-center gap-1 backdrop-blur-xs shadow-xs">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Shop
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {shop.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        {shop.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {shop.rating} ({shop.reviewsCount} reviews)
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      {shop.operatingHours || "Open • Closes 9:00 PM"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <Link
                  to={`/shop/${shop._id}`}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-95"
                >
                  <span>View Rental Shop</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}

      </div>
    </div>
  );
}

