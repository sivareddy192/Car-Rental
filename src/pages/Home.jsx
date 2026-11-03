import React, { useEffect, useState, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Axios, { fetchWithCache } from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"
import OptimizedImage from "../components/common/OptimizedImage"

const LocationPickerModal = React.lazy(() => import("../components/LocationPickerModal"))
import {
  Car,
  Bike,
  MapPin,
  Calendar,
  Clock,
  Search,
  ShieldCheck,
  CheckCircle2,
  Users,
  Fuel,
  ArrowRight,
  Star,
  Sparkles,
  Lock,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  Building2
} from "lucide-react"

export default function Home() {
  const navigate = useNavigate()

  const carVideoRef = useRef(null)
  const bikeVideoRef = useRef(null)
  const heroSectionRef = useRef(null)

  const [carVideoError, setCarVideoError] = useState(false)
  const [bikeVideoError, setBikeVideoError] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const [hasSwitchedToBike, setHasSwitchedToBike] = useState(false)

  const [featuredCars, setFeaturedCars] = useState([])
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("car") // "car" or "bike"
  const [categoryTypeTab, setCategoryTypeTab] = useState("car") // "car" or "bike"
  const [fleetTab, setFleetTab] = useState("all") // "all", "car", "bike"

  // Floating Search Bar States matching Screen 1 & 2
  const [searchLocation, setSearchLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("2025-01-15")
  const [pickupTime, setPickupTime] = useState("10:00 AM")
  const [returnDate, setReturnDate] = useState("2025-01-18")
  const [returnTime, setReturnTime] = useState("10:00 AM")

  // Detect prefers-reduced-motion for accessibility & low-resource devices
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handler = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener?.("change", handler)
    return () => mediaQuery.removeEventListener?.("change", handler)
  }, [])

  // Automatically pause videos whenever user scrolls away from the hero, and resume when in view
  useEffect(() => {
    const heroElement = heroSectionRef.current
    if (!heroElement) return

    const handleScrollOrIntersect = () => {
      const rect = heroElement.getBoundingClientRect()
      // Hero is considered visible if top is within viewport and bottom is not scrolled past top
      const isVisible = rect.bottom > 120 && rect.top < window.innerHeight - 80
      setIsHeroVisible(isVisible)

      if (!isVisible) {
        carVideoRef.current?.pause()
        bikeVideoRef.current?.pause()
      } else if (!reducedMotion) {
        if (vehicleTypeFilter === "car") {
          if (carVideoRef.current?.paused) {
            carVideoRef.current?.play().catch(() => {})
          }
        } else {
          if (bikeVideoRef.current?.paused) {
            bikeVideoRef.current?.play().catch(() => {})
          }
        }
      }
    }

    window.addEventListener("scroll", handleScrollOrIntersect, { passive: true })

    let observer
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            setIsHeroVisible(false)
            carVideoRef.current?.pause()
            bikeVideoRef.current?.pause()
          } else {
            handleScrollOrIntersect()
          }
        },
        { threshold: [0, 0.1, 0.25] }
      )
      observer.observe(heroElement)
    }

    return () => {
      window.removeEventListener("scroll", handleScrollOrIntersect)
      observer?.disconnect()
    }
  }, [vehicleTypeFilter, reducedMotion])

  // Synchronize video playback with category switching (Rent Car vs Rent Bike)
  useEffect(() => {
    if (reducedMotion || !isHeroVisible) return

    if (vehicleTypeFilter === "car") {
      if (carVideoRef.current) {
        carVideoRef.current.play().catch(() => {})
      }
      const timer = setTimeout(() => {
        if (vehicleTypeFilter === "car") {
          bikeVideoRef.current?.pause()
        }
      }, 750)
      return () => clearTimeout(timer)
    } else if (vehicleTypeFilter === "bike") {
      if (bikeVideoRef.current) {
        bikeVideoRef.current.play().catch(() => {})
      }
      const timer = setTimeout(() => {
        if (vehicleTypeFilter === "bike") {
          carVideoRef.current?.pause()
        }
      }, 750)
      return () => clearTimeout(timer)
    }
  }, [vehicleTypeFilter, reducedMotion, isHeroVisible])

  useEffect(() => {
    let isMounted = true
    const fetchFeaturedCars = async () => {
      try {
        const response = await fetchWithCache({
          ...SummaryApi.cars.getPublic,
          params: { limit: 12 }
        })
        if (response.data?.success && isMounted) {
          const list = Array.isArray(response.data.data)
            ? response.data.data
            : (response.data.data?.cars || [])
          setFeaturedCars(list)
        }
      } catch (err) {
        console.error("Failed to fetch featured cars:", err)
      }
    }
    fetchFeaturedCars()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (vehicleTypeFilter && vehicleTypeFilter !== "all") params.set("vehicleType", vehicleTypeFilter)
    if (searchLocation.trim()) params.set("city", searchLocation.trim())
    if (pickupDate) params.set("pickupDate", pickupDate)
    if (pickupTime) params.set("pickupTime", pickupTime)
    if (returnDate) params.set("returnDate", returnDate)
    if (returnTime) params.set("returnTime", returnTime)
    navigate(`/cars?${params.toString()}`)
  }

  // Popular Car Categories
  const popularCarCategories = [
    {
      id: "hatchback",
      name: "Hatchback",
      price: "From ₹800/day",
      img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=240&q=75",
      type: "car"
    },
    {
      id: "sedan",
      name: "Sedan",
      price: "From ₹1,200/day",
      img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=240&q=75",
      type: "car"
    },
    {
      id: "suv",
      name: "SUV",
      price: "From ₹1,800/day",
      img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=240&q=75",
      type: "car"
    },
    {
      id: "luxury",
      name: "Luxury Cars",
      price: "From ₹3,500/day",
      img: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=240&q=75",
      type: "car"
    },
    {
      id: "premium",
      name: "Premium Cars",
      price: "From ₹2,500/day",
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=240&q=75",
      type: "car"
    },
    {
      id: "electric",
      name: "Electric Cars",
      price: "From ₹1,800/day",
      img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=240&q=75",
      type: "car"
    },
    {
      id: "family",
      name: "Family Cars",
      price: "From ₹1,500/day",
      img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=240&q=75",
      type: "car"
    },
    {
      id: "convertible",
      name: "Convertible",
      price: "From ₹4,000/day",
      img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=240&q=75",
      type: "car"
    }
  ]

  // Popular Bike Categories
  const popularBikeCategories = [
    {
      id: "activa",
      name: "Activa",
      price: "From ₹399/day",
      img: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=240&q=75",
      type: "bike"
    },
    {
      id: "cruiser",
      name: "Cruiser / Bullet",
      price: "From ₹899/day",
      img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=240&q=75",
      type: "bike"
    },
    {
      id: "sports",
      name: "Sports Bikes",
      price: "From ₹799/day",
      img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=240&q=75",
      type: "bike"
    },
    {
      id: "electric bike",
      name: "EV Bikes",
      price: "From ₹549/day",
      img: "https://images.unsplash.com/photo-1591871937573-74dbba515c4c?auto=format&fit=crop&w=240&q=75",
      type: "bike"
    },
    {
      id: "commuter",
      name: "Commuter Bikes",
      price: "From ₹449/day",
      img: "https://images.unsplash.com/photo-1571188654248-7a89213915f7?auto=format&fit=crop&w=240&q=75",
      type: "bike"
    },
    {
      id: "touring",
      name: "Adventure / Off-Road",
      price: "From ₹1,199/day",
      img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=240&q=75",
      type: "bike"
    }
  ]

  // Fallback mock inventory matching Screen 1 & 2
  const defaultDisplayCars = [
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
      badge: "Popular Car",
      badgeColor: "bg-rose-700",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=480&q=75",
      shopName: "DriveHub Rentals",
      shopDistance: "2.5 km",
      shopRating: 4.8
    },
    {
      _id: "6ae5ffb4c1ab733b470462d3",
      vehicleType: "car",
      brand: "Hyundai",
      model: "Verna",
      category: "Sedan",
      year: 2023,
      seats: 5,
      fuel: "Petrol",
      transmission: "Manual",
      dailyPrice: 1499,
      badge: "Executive",
      badgeColor: "bg-blue-700",
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=480&q=75",
      shopName: "City Wheels",
      shopDistance: "4.1 km",
      shopRating: 4.6
    },
    {
      _id: "6ae5ffb4c1ab733b470462d4",
      vehicleType: "car",
      brand: "Kia",
      model: "Seltos",
      category: "SUV",
      year: 2023,
      seats: 5,
      fuel: "Petrol",
      transmission: "Manual",
      dailyPrice: 1999,
      badge: "SUV",
      badgeColor: "bg-purple-700",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=480&q=75",
      shopName: "ProDrive Rentals",
      shopDistance: "3.2 km",
      shopRating: 4.9
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
      badge: "Top Bike",
      badgeColor: "bg-amber-700",
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=480&q=75",
      shopName: "DriveHub Rentals",
      shopDistance: "2.5 km",
      shopRating: 4.9
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
      badge: "Best Economy",
      badgeColor: "bg-emerald-700",
      image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=480&q=75",
      shopName: "ProDrive Rentals",
      shopDistance: "1.2 km",
      shopRating: 4.7
    }
  ]

  const displayList = (featuredCars.length > 0 ? featuredCars : defaultDisplayCars).map((car, idx) => ({
    _id: car._id,
    vehicleType: car.vehicleType || "car",
    brand: car.vehicleDetails?.brand || car.brand || "Vehicle",
    model: car.vehicleDetails?.model || car.carModel || "Model",
    category: car.vehicleDetails?.category || car.category || "Vehicle",
    year: car.vehicleDetails?.manufacturingYear || car.year || 2023,
    seats: car.vehicleDetails?.seatingCapacity || car.seatingCapacity || (car.vehicleType === "bike" ? 2 : 5),
    fuel: car.vehicleDetails?.fuelType || car.fuelType || "Petrol",
    transmission: car.vehicleDetails?.transmission || car.transmission || "Automatic",
    engineCapacity: car.vehicleDetails?.engineCapacity || car.engineCapacity || "",
    dailyPrice: car.rentalDetails?.dailyPrice || car.pricing?.perDay || 1499,
    badge: car.vehicleType === "bike" ? "🏍️ Bike" : (idx === 0 ? "Popular" : (idx === 1 ? "New" : "Available")),
    badgeColor: car.vehicleType === "bike" ? "bg-amber-700" : (idx === 0 ? "bg-rose-700" : (idx === 1 ? "bg-blue-700" : "bg-emerald-700")),
    image: car.images?.frontImage || car.images?.[0]?.url || car.images?.interiorImages?.[0] || car.image || defaultDisplayCars[idx % defaultDisplayCars.length].image,
    shopName: car.rentalShop?.name || "DriveHub Rentals",
    shopDistance: car.rentalShop?.distance || "2.5 km",
    shopRating: car.rentalShop?.rating || 4.8,
    availabilityStatus: car.availabilityStatus || (car.isBooked ? "booked" : "available"),
    isBooked: car.isBooked || car.availabilityStatus === "booked"
  }))

  const filteredFleet = displayList.filter(v => {
    if (fleetTab === "all") return true;
    return (v.vehicleType || "car") === fleetTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Location Selection Map Modal (Lazy-Loaded) */}
      {locationModalOpen && (
        <React.Suspense fallback={null}>
          <LocationPickerModal
            isOpen={locationModalOpen}
            onClose={() => setLocationModalOpen(false)}
            onSelectLocation={(loc) => setSearchLocation(loc)}
            currentLocation={searchLocation}
          />
        </React.Suspense>
      )}

      {/* 1. HERO SECTION (Screens 1, 2 & 3) */}
      <section ref={heroSectionRef} className="relative pt-6 pb-20 md:pb-28 overflow-hidden">
        {/* Dynamic Background Video with Cinematic Crossfade Animation (Car vs Bike) */}
        <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
          {/* Car Hero Video Layer */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              vehicleTypeFilter === "car" ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Modern High-Resolution WebP Poster Fallback Image for Instant LCP */}
            <picture>
              <source media="(max-width: 640px)" srcSet="/luxury-car-auth-mobile.webp" type="image/webp" />
              <source srcSet="/luxury-car-auth.webp" type="image/webp" />
              <img
                src="/luxury-car-auth-mobile.webp"
                alt="Luxury car driving on highway"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.88] dark:brightness-[0.42]"
              />
            </picture>

            {!reducedMotion && !carVideoError && (
              <video
                ref={carVideoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                onError={() => setCarVideoError(true)}
                className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.88] dark:brightness-[0.42]"
                aria-hidden="true"
              >
                <source src="/videos/car-driving.mp4" media="(min-width: 768px)" type="video/mp4" />
                <source src="/videos/car-driving-mobile.mp4" type="video/mp4" />
              </video>
            )}
          </div>

          {/* Bike Hero Video Layer (Deferred until user selects or hovers Bike) */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              vehicleTypeFilter === "bike" ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* High-Resolution WebP Poster Fallback Image */}
            {(hasSwitchedToBike || vehicleTypeFilter === "bike") && (
              <picture>
                <source media="(max-width: 640px)" srcSet="/luxury-bike-hero-mobile.webp" type="image/webp" />
                <source srcSet="/luxury-bike-hero.webp" type="image/webp" />
                <img
                  src="/luxury-bike-hero-mobile.webp"
                  alt="Motorcyclist riding on scenic road"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.88] dark:brightness-[0.42]"
                />
              </picture>
            )}

            {!reducedMotion && !bikeVideoError && (hasSwitchedToBike || vehicleTypeFilter === "bike") && (
              <video
                ref={bikeVideoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                onError={() => setBikeVideoError(true)}
                className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.88] dark:brightness-[0.42]"
                aria-hidden="true"
              >
                <source src="/videos/bike-riding.mp4" media="(min-width: 768px)" type="video/mp4" />
                <source src="/videos/bike-riding-mobile.mp4" type="video/mp4" />
              </video>
            )}
          </div>

          {/* Balanced dark gradient overlay for crystal clear text readability in both Light and Dark themes */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-slate-900/50 dark:from-[#0B0F19]/95 dark:via-[#0B0F19]/80 dark:to-[#0B0F19] pointer-events-none" />
        </div>

        {/* Hero Title & Floating Search Bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14">
          <div className="max-w-2xl text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={vehicleTypeFilter}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
              >
                {/* DriveRent Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 dark:bg-slate-800/60 backdrop-blur-md border border-white/30 dark:border-slate-700 text-white text-xs font-bold tracking-wide mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>DriveRent • Find Your Perfect Ride</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] drop-shadow-md">
                  Find the Perfect {vehicleTypeFilter === "bike" ? "Bike" : "Car"} <br />
                  for Your{" "}
                  <span className={vehicleTypeFilter === "bike" ? "text-amber-400 dark:text-amber-400 drop-shadow-sm" : "text-blue-400 dark:text-blue-400 drop-shadow-sm"}>
                    Next Journey
                  </span>
                </h1>
                <p className="mt-3 text-sm sm:text-base text-slate-100 font-medium max-w-xl drop-shadow-sm">
                  {vehicleTypeFilter === "bike"
                    ? "Explore premium motorcycles and bikes available for rent near you from verified shops."
                    : "Explore cars and bikes available for rent near you. Compare verified local shops and book with confidence."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Vehicle Type Switcher: Cars vs Bikes with Sliding Spring Pill */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-md mt-6" role="tablist" aria-label="Vehicle rental category options">
            <button
              id="hero-rent-car-btn"
              type="button"
              role="tab"
              aria-selected={vehicleTypeFilter === "car"}
              onClick={() => {
                setVehicleTypeFilter("car");
                setCategoryTypeTab("car");
              }}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-colors duration-200 cursor-pointer ${
                vehicleTypeFilter === "car"
                  ? "text-white"
                  : "text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              {vehicleTypeFilter === "car" && (
                <motion.div
                  layoutId="activeHeroVehicleTab"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-600/30 pointer-events-none"
                />
              )}
              <Car className="w-4 h-4 relative z-10 pointer-events-none" />
              <span className="relative z-10 pointer-events-none">Rent a Car</span>
            </button>

            <button
              id="hero-rent-bike-btn"
              type="button"
              role="tab"
              aria-selected={vehicleTypeFilter === "bike"}
              onMouseEnter={() => setHasSwitchedToBike(true)}
              onClick={() => {
                setVehicleTypeFilter("bike");
                setCategoryTypeTab("bike");
                setHasSwitchedToBike(true);
              }}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-colors duration-200 cursor-pointer ${
                vehicleTypeFilter === "bike"
                  ? "text-white"
                  : "text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              {vehicleTypeFilter === "bike" && (
                <motion.div
                  layoutId="activeHeroVehicleTab"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 bg-amber-600 rounded-xl shadow-md shadow-amber-600/30 pointer-events-none"
                />
              )}
              <Bike className="w-4 h-4 relative z-10 pointer-events-none" />
              <span className="relative z-10 pointer-events-none">Rent a Bike</span>
            </button>
          </div>

          {/* Floating Search Bar Card matching Screen 1, 2 & 3 */}
          <div className="mt-4 md:mt-6 bg-white/95 dark:bg-[#161B26]/95 backdrop-blur-xl p-3 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl">
            <form
              onSubmit={handleSearchSubmit}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-3.5 items-stretch"
            >
              {/* Pickup Location */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setLocationModalOpen(true); } }}
                onClick={() => setLocationModalOpen(true)}
                className="md:col-span-2 lg:col-span-4 p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1E2433] border border-slate-200 dark:border-slate-700/80 cursor-pointer hover:border-blue-500 transition-colors flex items-center gap-3"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold transition-colors ${
                  vehicleTypeFilter === "bike"
                    ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                    : "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                }`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Pickup Location
                  </span>
                  <span className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {searchLocation || "Enter city or area"}
                  </span>
                </div>
              </div>

              {/* Pickup Date & Time */}
              <div className="md:col-span-1 lg:col-span-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1E2433] border border-slate-200 dark:border-slate-700/80 flex items-center gap-3">
                <Calendar className={`w-5 h-5 shrink-0 transition-colors ${
                  vehicleTypeFilter === "bike"
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-blue-600 dark:text-blue-400"
                }`} />
                <div className="min-w-0 flex-1">
                  <label htmlFor="hero-pickup-date" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Pickup Date &amp; Time
                  </label>
                  <div className="flex items-center gap-2 mt-0.5">
                    <input
                      id="hero-pickup-date"
                      aria-label="Pickup Date"
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-hidden cursor-pointer w-28 sm:w-32"
                    />
                    <label htmlFor="hero-pickup-time" className="sr-only">Pickup Time</label>
                    <select
                      id="hero-pickup-time"
                      aria-label="Pickup Time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-hidden cursor-pointer"
                    >
                      <option value="09:00 AM" className="dark:bg-slate-900">09:00 AM</option>
                      <option value="10:00 AM" className="dark:bg-slate-900">10:00 AM</option>
                      <option value="11:00 AM" className="dark:bg-slate-900">11:00 AM</option>
                      <option value="02:00 PM" className="dark:bg-slate-900">02:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Return Date & Time */}
              <div className="md:col-span-1 lg:col-span-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1E2433] border border-slate-200 dark:border-slate-700/80 flex items-center gap-3">
                <Clock className={`w-5 h-5 shrink-0 transition-colors ${
                  vehicleTypeFilter === "bike"
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-blue-600 dark:text-blue-400"
                }`} />
                <div className="min-w-0 flex-1">
                  <label htmlFor="hero-return-date" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Return Date &amp; Time
                  </label>
                  <div className="flex items-center gap-2 mt-0.5">
                    <input
                      id="hero-return-date"
                      aria-label="Return Date"
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-hidden cursor-pointer w-28 sm:w-32"
                    />
                    <label htmlFor="hero-return-time" className="sr-only">Return Time</label>
                    <select
                      id="hero-return-time"
                      aria-label="Return Time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-hidden cursor-pointer"
                    >
                      <option value="09:00 AM" className="dark:bg-slate-900">09:00 AM</option>
                      <option value="10:00 AM" className="dark:bg-slate-900">10:00 AM</option>
                      <option value="11:00 AM" className="dark:bg-slate-900">11:00 AM</option>
                      <option value="06:00 PM" className="dark:bg-slate-900">06:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Button matching Screen 1, 2 & 3 with Animated Text Morph */}
              <div className="md:col-span-2 lg:col-span-2 flex items-stretch">
                <button
                  type="submit"
                  style={{ backgroundColor: vehicleTypeFilter === 'bike' ? '#d97706' : '#2563eb' }}
                  className={`w-full py-3.5 px-6 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all duration-300 active:scale-95 cursor-pointer ${
                    vehicleTypeFilter === "bike"
                      ? "hover:opacity-95 shadow-amber-600/30"
                      : "hover:opacity-95 shadow-blue-600/30"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={vehicleTypeFilter}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>{vehicleTypeFilter === "bike" ? "Search Bikes" : "Search Cars"}</span>
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION 4 BADGES STRIP (Screen 1 & 2) */}
      <section className="border-y border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#111622]/80 backdrop-blur-md py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center md:text-left">
          
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">Trusted Rental Shops</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified shop partners</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">Wide Fleet Selection</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">500+ Cars &amp; Bikes</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">Easy Booking Process</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant confirmation</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">Secure &amp; Reliable</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero hidden fees</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. POPULAR VEHICLE CATEGORIES SECTION (Screens 1, 2 & 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Popular {categoryTypeTab === "bike" ? "Bike" : "Car"} Categories
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select a category that matches your trip style
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setCategoryTypeTab("car")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  categoryTypeTab === "car"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-blue-600"
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Cars</span>
              </button>
              <button
                type="button"
                onClick={() => setCategoryTypeTab("bike")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  categoryTypeTab === "bike"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-amber-600"
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Bikes</span>
              </button>
            </div>

            <Link
              to={`/cars?vehicleType=${categoryTypeTab}`}
              className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 ml-2"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Round Circular Category Items */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
          {(categoryTypeTab === "bike" ? popularBikeCategories : popularCarCategories).map((cat) => (
            <Link
              key={cat.id}
              to={`/cars?vehicleType=${cat.type}&category=${encodeURIComponent(cat.id)}`}
              className="group flex flex-col items-center text-center transition-all duration-300"
            >
              {/* Circular Avatar Container */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-24 lg:h-24 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 p-1.5 flex items-center justify-center shadow-xs group-hover:border-blue-600 dark:group-hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/20 group-hover:scale-105 transition-all duration-300 overflow-hidden relative">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    width="96"
                    height="96"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Title & Starting Price */}
              <div className="mt-2.5 space-y-0.5">
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                  {cat.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* 4. FEATURED RENTAL VEHICLES SECTION (Screens 1, 2 & 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Featured Rental Vehicles
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Top rated cars, bikes &amp; from certified local rental shops
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setFleetTab("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  fleetTab === "all"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFleetTab("car")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  fleetTab === "car"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Cars</span>
              </button>
              <button
                type="button"
                onClick={() => setFleetTab("bike")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  fleetTab === "bike"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Bikes</span>
              </button>
            </div>

            <Link
              to={`/cars${fleetTab !== "all" ? `?vehicleType=${fleetTab}` : ""}`}
              className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 ml-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Featured Vehicle Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFleet.map((car) => (
            <div
              key={car._id}
              className="group rounded-3xl bg-white dark:bg-[#161B26] border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-16/10 bg-slate-100 dark:bg-slate-800/60 overflow-hidden">
                  <OptimizedImage
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    targetWidth={500}
                    aspectRatio="aspect-16/10"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top-Left Category/Popular Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-white ${car.badgeColor} shadow-xs`}>
                      {car.badge}
                    </span>
                  </div>

                  {/* Top-Right Availability Pill */}
                  <div className="absolute top-3 right-3">
                    {car.isBooked || car.availabilityStatus === "booked" ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-700 text-white flex items-center gap-1 backdrop-blur-xs shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        Booked
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-700 text-white flex items-center gap-1 backdrop-blur-xs shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      car.vehicleType === "bike" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-400" : "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-400"
                    }`}>
                      {car.vehicleType === "bike" ? "Bike" : "Car"}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {car.brand} {car.model}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                    {car.category} • {car.year}
                  </p>

                  {/* Specs Row */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    {car.vehicleType === "bike" ? (
                      <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                        <Zap className="w-3.5 h-3.5" />
                        {car.engineCapacity || "350 cc"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                        {car.seats} Seats
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      {car.fuel}
                    </span>
                    <span className="flex items-center gap-1">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      {car.transmission}
                    </span>
                  </div>

                  {/* Daily Rate */}
                  <div className="mt-4">
                    <p className="text-xl font-black text-slate-900 dark:text-white">
                      ₹{car.dailyPrice?.toLocaleString("en-IN")}
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-normal">/day</span>
                    </p>
                  </div>

                  {/* Shop Attribution matching Box 1 & 2 */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {car.shopName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                      <span>{car.shopDistance}</span>
                      <span className="flex items-center gap-0.5 font-bold text-amber-700 dark:text-amber-400">
                        <Star className="w-3 h-3 fill-amber-500" />
                        {car.shopRating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: "View Details" & "Book Now" */}
              <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2">
                <Link
                  to={`/car/${car._id}`}
                  className="py-2.5 px-3 rounded-xl text-center text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  View Details
                </Link>
                {car.isBooked || car.availabilityStatus === "booked" ? (
                  <button
                    type="button"
                    disabled
                    className="py-2.5 px-3 rounded-xl text-center text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                  >
                    Booked
                  </button>
                ) : (
                  <Link
                    to={`/car/${car._id}`}
                    className={`py-2.5 px-3 rounded-xl text-center text-xs font-bold text-white shadow-md transition-all active:scale-95 ${
                      car.vehicleType === "bike"
                        ? "bg-amber-700 hover:bg-amber-800 shadow-amber-700/20"
                        : "bg-blue-700 hover:bg-blue-800 shadow-blue-700/20"
                    }`}
                  >
                    Book Now
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
