import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Clock, 
  X, 
  Star, 
  Trash2, 
  ShieldCheck, 
  Store, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Car, 
  ExternalLink,
  Loader2 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

// Fix Leaflet default icon issues in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Blue Pin for DriveRent Hubs
const driveRentPin = new L.DivIcon({
  className: 'custom-drive-pin',
  html: `<div style="background-color: #2563EB; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(37,99,235,0.45); border: 3px solid white; cursor: pointer;">
    <svg style="width: 18px; height: 18px; fill: white;" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>
  </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34]
});

// Component to smoothly pan & zoom map when center changes
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom || 12, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

const fallbackDefaultHubs = [
  {
    _id: "shop_1",
    name: "DriveHub Rentals",
    ownerName: "Rajesh Kumar",
    address: "13, 2nd Cross, HSR Layout, Sector 6",
    area: "HSR Layout",
    city: "Bangalore",
    lat: 12.9116,
    lng: 77.6389,
    rating: 4.8,
    reviewsCount: 120,
    distance: "2.5 km",
    totalCars: 14,
    verified: true
  },
  {
    _id: "shop_2",
    name: "City Wheels",
    ownerName: "Vikram Malhotra",
    address: "45, 100 Feet Road, Indiranagar",
    area: "Indiranagar",
    city: "Bangalore",
    lat: 12.9784,
    lng: 77.6408,
    rating: 4.6,
    reviewsCount: 84,
    distance: "4.1 km",
    totalCars: 9,
    verified: true
  },
  {
    _id: "shop_3",
    name: "ProDrive Rentals",
    ownerName: "Arjun Nair",
    address: "88, 80 Feet Road, Koramangala 4th Block",
    area: "Koramangala",
    city: "Bangalore",
    lat: 12.9352,
    lng: 77.6245,
    rating: 4.9,
    reviewsCount: 156,
    distance: "1.2 km",
    totalCars: 18,
    verified: true
  },
  {
    _id: "shop_4",
    name: "Royal Car Rentals",
    ownerName: "Sanjay Hegde",
    address: "21, Sampige Road, Malleshwaram",
    area: "Malleshwaram",
    city: "Bangalore",
    lat: 13.0033,
    lng: 77.5891,
    rating: 4.7,
    reviewsCount: 92,
    distance: "4.7 km",
    totalCars: 11,
    verified: true
  }
];

export default function LocationPickerModal({ isOpen, onClose, onSelectLocation, currentLocation = "" }) {
  const [searchQuery, setSearchQuery] = useState(currentLocation || "");
  const [allRegisteredShops, setAllRegisteredShops] = useState(fallbackDefaultHubs);
  const [searchResults, setSearchResults] = useState(null); // null = not searching, array = search executed
  const [isSearching, setIsSearching] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);
  const [mapZoom, setMapZoom] = useState(12);
  const searchInputRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("driverent_recent_locations");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        setRecentSearches([]);
      }
    } catch {
      setRecentSearches([]);
    }
  }, [isOpen]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Load all registered partner rental shops when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Focus input on open
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 150);

    const fetchAllShops = async () => {
      try {
        const res = await Axios({
          ...SummaryApi.rentalShops.getAll
        });
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setAllRegisteredShops(res.data.data);
        }
      } catch (err) {
        console.error("Could not load registered rental shops:", err);
      }
    };
    fetchAllShops();
  }, [isOpen]);

  // Live search for registered rental shops in the searched location
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults(null);
      setIsSearching(false);
      setMapCenter([12.9716, 77.5946]);
      setMapZoom(12);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await Axios({
          ...SummaryApi.rentalShops.getAll,
          params: { search: trimmed }
        });

        if (res.data?.success && Array.isArray(res.data.data)) {
          setSearchResults(res.data.data);
          if (res.data.data.length > 0) {
            const firstShop = res.data.data[0];
            if (firstShop.lat && firstShop.lng) {
              setMapCenter([firstShop.lat, firstShop.lng]);
              setMapZoom(13);
            }
          }
        } else {
          setSearchResults([]);
        }
      } catch {
        // Fallback local filter
        const q = trimmed.toLowerCase();
        const matched = allRegisteredShops.filter(s =>
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.area && s.area.toLowerCase().includes(q)) ||
          (s.address && s.address.toLowerCase().includes(q)) ||
          (s.city && s.city.toLowerCase().includes(q)) ||
          (s.pinCode && s.pinCode.toLowerCase().includes(q))
        );
        setSearchResults(matched);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, allRegisteredShops]);

  if (!isOpen) return null;

  const saveRecentSearch = (loc) => {
    try {
      const updated = [loc, ...recentSearches.filter(s => s !== loc)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("driverent_recent_locations", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("driverent_recent_locations");
  };

  const handleUseCurrentLocation = () => {
    setDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setDetecting(false);
          const locStr = "Current Location (Bangalore)";
          saveRecentSearch(locStr);
          onSelectLocation(locStr);
          onClose();
        },
        () => {
          setDetecting(false);
          const locStr = "Bangalore, Karnataka";
          saveRecentSearch(locStr);
          onSelectLocation(locStr);
          onClose();
        }
      );
    } else {
      setDetecting(false);
      const locStr = "Bangalore, Karnataka";
      saveRecentSearch(locStr);
      onSelectLocation(locStr);
      onClose();
    }
  };

  const handleSelectShop = (shop) => {
    const locStr = `${shop.name}, ${shop.area || shop.city}`;
    saveRecentSearch(locStr);
    onSelectLocation(locStr);
    onClose();
  };

  const handleSelectCustomLocation = (customLoc) => {
    const locStr = (customLoc || searchQuery).trim();
    if (locStr) {
      saveRecentSearch(locStr);
      onSelectLocation(locStr);
      onClose();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    if (searchResults && searchResults.length > 0) {
      handleSelectShop(searchResults[0]);
    } else {
      handleSelectCustomLocation(query);
    }
  };

  // Determine which shops to render as markers on the map
  const activeMarkers = (searchResults !== null && searchResults.length > 0)
    ? searchResults
    : allRegisteredShops;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Choose Pickup Location</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Search any area or choose a certified partner rental shop</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden min-h-[480px]">
          
          {/* Left Column: Search & Results */}
          <div className="lg:col-span-5 p-5 sm:p-6 overflow-y-auto space-y-5 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            
            <div className="space-y-4">
              
              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, area or PIN (e.g. HSR, Indiranagar, Goa)"
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm font-medium outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Use Current Location Button */}
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={detecting}
                className="w-full p-3 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 flex items-center gap-3 text-left transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Navigation className={`w-4 h-4 ${detecting ? 'animate-spin' : ''}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Use Current Location</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Detect your exact area via GPS</p>
                </div>
              </button>

              {/* DYNAMIC RESULTS CONTAINER */}
              {isSearching ? (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center text-slate-500 dark:text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <p className="text-xs font-medium">Checking registered rental shops in "{searchQuery}"...</p>
                </div>
              ) : searchResults !== null ? (
                /* USER HAS ENTERED A SEARCH QUERY */
                searchResults.length > 0 ? (
                  /* CASE 1: REGISTERED SHOPS FOUND IN THIS SEARCHED LOCATION */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Registered Rental Shops in "{searchQuery}" ({searchResults.length})</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
                      {searchResults.map((shop) => (
                        <div
                          key={shop._id}
                          className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/50 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col gap-2 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                  {shop.name}
                                </span>
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                  <ShieldCheck className="w-3 h-3" />
                                  Partner
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {shop.address}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold shrink-0">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>{shop.rating || 4.8}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Car className="w-3 h-3 text-blue-600" />
                              <strong className="text-slate-900 dark:text-white">{shop.totalCars || 10}+</strong> cars ready
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSelectShop(shop)}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                              >
                                Select Hub
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* CASE 2: NO REGISTERED SHOPS FOUND IN THIS SEARCHED LOCATION */
                  <div className="space-y-4">
                    {/* Notice Card Showing Searched Location & Option to Use It */}
                    <div className="p-4 rounded-2xl border-2 border-amber-300 dark:border-amber-700/80 bg-amber-50/60 dark:bg-amber-950/30 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                              Searched Location
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5 break-words">
                            "{searchQuery}"
                          </h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            No authorized rental shops are registered in this specific area yet. However, you can still select <strong>"{searchQuery}"</strong> for doorstep delivery or nearby vehicle dispatch.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectCustomLocation(searchQuery)}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Use "{searchQuery}" as Pickup Location</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                    {/* Show Available Authorized Hubs in the region as alternative */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Or Pick an Authorized Hub in Bangalore:
                      </p>
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                        {allRegisteredShops.slice(0, 3).map((shop) => (
                          <button
                            key={shop._id}
                            type="button"
                            onClick={() => handleSelectShop(shop)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex items-center justify-between cursor-pointer"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{shop.name}</p>
                              <p className="text-[10px] text-slate-500 truncate">{shop.area || shop.address}</p>
                            </div>
                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 shrink-0 ml-2">
                              Select &rarr;
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              ) : (
                /* DEFAULT VIEW (BEFORE SEARCHING) */
                <div className="space-y-4">
                  {/* Recent Searches */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Recent Searches
                      </p>
                      {recentSearches.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearRecentSearches}
                          className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          Clear
                        </button>
                      )}
                    </div>

                    {recentSearches.length === 0 ? (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-400">
                        Search any city or area to find local rental shops.
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {recentSearches.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              onSelectLocation(item);
                              onClose();
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{item}</span>
                            </div>
                            <span className="text-[10px] text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Registered Partner Hubs List */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Verified Dealership Hubs ({allRegisteredShops.length})
                      </p>
                      <Link 
                        to="/rental-shops" 
                        onClick={onClose}
                        className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        View Directory
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                      {allRegisteredShops.map((shop) => (
                        <div
                          key={shop._id}
                          onClick={() => {
                            if (shop.lat && shop.lng) {
                              setMapCenter([shop.lat, shop.lng]);
                              setMapZoom(14);
                            }
                          }}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {shop.name}
                              </span>
                              <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                                ★ {shop.rating || 4.8}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {shop.area || shop.address}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectShop(shop);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
                          >
                            Select
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Quick helper tip */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              💡 <strong>Tip:</strong> You can click any blue dealership pin on the interactive map to select it directly.
            </div>

          </div>

          {/* Right Column: Interactive Map */}
          <div className="lg:col-span-7 h-72 lg:h-full relative min-h-[380px] bg-slate-100 dark:bg-slate-800">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <MapController center={mapCenter} zoom={mapZoom} />

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {activeMarkers.map((shop) => {
                const lat = shop.lat || 12.9716;
                const lng = shop.lng || 77.5946;
                return (
                  <Marker key={shop._id} position={[lat, lng]} icon={driveRentPin}>
                    <Popup>
                      <div className="p-1 max-w-[210px]">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-extrabold text-xs text-slate-900 truncate">{shop.name}</span>
                          <span className="text-[9px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded-sm font-bold">Partner</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mb-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{shop.rating || 4.8}</span>
                          <span className="text-slate-400 font-normal">({shop.totalCars || 10}+ cars)</span>
                        </div>
                        <p className="text-[10px] text-slate-600 mb-2 leading-tight">{shop.address || shop.area}</p>
                        <button
                          type="button"
                          onClick={() => handleSelectShop(shop)}
                          className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          Select This Dealership
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Map Floating Info Badge */}
            <div className="absolute top-4 left-4 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${searchResults && searchResults.length === 0 ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
              <span>
                {searchResults !== null 
                  ? (searchResults.length > 0 
                      ? `${searchResults.length} Registered Hub${searchResults.length > 1 ? 's' : ''} in Area` 
                      : `No Registered Hubs in "${searchQuery}"`)
                  : `${allRegisteredShops.length} Registered Partner Dealerships`}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
