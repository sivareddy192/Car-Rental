import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Car as LuCar, Bike as LuBike, Upload as LuUpload, Check as LuCheck, ArrowRight as LuArrowRight, ArrowLeft as LuArrowLeft, Loader2 as LuLoader2, DollarSign as LuDollarSign, FileText as LuFileText, MapPin as LuMapPin, User as LuUser, Zap as LuZap, ShieldCheck as LuShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';

const DealerAddCar = () => {
    const user = useSelector(state => state.user);
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('vehicle'); // 'vehicle', 'rental', 'images', 'pickup', 'owner'
    const [loading, setLoading] = useState(false);
    const [uploadingField, setUploadingField] = useState(null);

    const [formData, setFormData] = useState({
        vehicleType: "car", // "car" or "bike"

        // Owner Details
        ownerName: user?.name || "",
        ownerEmail: user?.email || "",
        ownerPhone: user?.mobile || user?.phone || "",
        alternateContact: "",

        // Vehicle Details
        vehicleDetails: {
            brand: "",
            model: "",
            manufacturingYear: new Date().getFullYear(),
            registrationNumber: "",
            category: "Luxury",
            colour: "Obsidian Black",
            fuelType: "Petrol",
            transmission: "Automatic",
            seatingCapacity: 5,
            mileage: "12 km/l",
            airConditioning: true,
            doors: 4,
            helmetProvided: true,
            engineCapacity: "2996 cc",
            description: ""
        },

        // Rental Pricing Details
        rentalDetails: {
            hourlyPrice: 800,
            dailyPrice: 8000,
            weeklyPrice: 50000,
            monthlyPrice: 180000,
            securityDeposit: 15000,
            minimumRentalDurationHours: 24,
            additionalKmCharges: 25,
            lateReturnCharges: 500,
            cancellationPolicy: "Free cancellation up to 24 hours before pickup. 50% charge if cancelled within 24 hours."
        },

        // Vehicle Documents
        documents: {
            registrationCertificateUrl: "",
            insuranceCertificateUrl: "",
            pollutionCertificateUrl: "",
            permitDocumentUrl: "",
            inspectionDetails: "150-Point Multi-check passed. Vehicle in pristine condition."
        },

        // Images
        images: {
            frontImage: "",
            rearImage: "",
            leftSideImage: "",
            rightSideImage: "",
            interiorImages: [],
            additionalImages: []
        },

        // Pickup Information
        pickupInformation: {
            pickupAddress: "",
            city: "",
            state: "",
            pinCode: "",
            googleMapsLocation: "",
            pickupInstructions: "Please arrive 15 minutes before the scheduled time with original Driving Licence and Government ID."
        }
    });

    const handleTypeSwitch = (type) => {
        setFormData(prev => ({
            ...prev,
            vehicleType: type,
            vehicleDetails: {
                ...prev.vehicleDetails,
                category: type === "bike" ? "Cruiser" : "Luxury",
                seatingCapacity: type === "bike" ? 2 : 5,
                doors: type === "bike" ? 0 : 4,
                airConditioning: type === "bike" ? false : true,
                helmetProvided: type === "bike" ? true : undefined,
                engineCapacity: type === "bike" ? "350 cc" : "2996 cc"
            },
            rentalDetails: {
                ...prev.rentalDetails,
                dailyPrice: type === "bike" ? 799 : 2500,
                hourlyPrice: type === "bike" ? 99 : 300,
                securityDeposit: type === "bike" ? 2000 : 10000
            }
        }));
    };

    const handleUpload = async (e, imageField) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side file validation
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be under 10MB.");
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload a valid image file (JPEG, PNG, WebP).");
            return;
        }

        try {
            setUploadingField(imageField);
            const uploadForm = new FormData();
            uploadForm.append('image', file);

            const res = await Axios({
                url: '/api/file/upload',
                method: 'post',
                data: uploadForm,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const uploadedUrl = typeof res.data?.data === 'string'
                ? res.data.data
                : (res.data?.data?.url || res.data?.data?.secure_url);

            if (uploadedUrl) {
                setFormData(prev => ({
                    ...prev,
                    images: {
                        ...prev.images,
                        [imageField]: uploadedUrl
                    }
                }));
                toast.success("Image uploaded & optimized successfully!");
            } else {
                toast.error("Failed to parse uploaded image URL.");
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setUploadingField(null);
        }
    };

    const handleDocUpload = async (e, docField) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 15 * 1024 * 1024) {
            toast.error("Document size must be under 15MB.");
            return;
        }

        try {
            setUploadingField(docField);
            const uploadForm = new FormData();
            uploadForm.append('image', file);

            const res = await Axios({
                url: '/api/file/upload',
                method: 'post',
                data: uploadForm,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const uploadedUrl = typeof res.data?.data === 'string'
                ? res.data.data
                : (res.data?.data?.url || res.data?.data?.secure_url);

            if (uploadedUrl) {
                setFormData(prev => ({
                    ...prev,
                    documents: {
                        ...prev.documents,
                        [docField]: uploadedUrl
                    }
                }));
                toast.success("Document uploaded successfully!");
            } else {
                toast.error("Failed to parse document URL.");
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setUploadingField(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { vehicleDetails, rentalDetails, pickupInformation, images } = formData;

        if (!vehicleDetails.brand || !vehicleDetails.model || !vehicleDetails.registrationNumber) {
            setActiveSection('vehicle');
            toast.error("Please fill in car brand, model, and registration number.");
            return;
        }

        if (!rentalDetails.dailyPrice) {
            setActiveSection('rental');
            toast.error("Please enter the daily rental price.");
            return;
        }

        if (!images.frontImage) {
            setActiveSection('images');
            toast.error("Please upload at least the Front Image of the vehicle.");
            return;
        }

        if (!pickupInformation.pickupAddress || !pickupInformation.city || !pickupInformation.state || !pickupInformation.pinCode) {
            setActiveSection('pickup');
            toast.error("Please complete the pickup location details.");
            return;
        }

        try {
            setLoading(true);
            const res = await Axios({
                ...SummaryApi.cars.add,
                data: formData
            });

            if (res.data?.success) {
                toast.success(res.data.message || "Vehicle submitted for admin approval!");
                navigate('/dealer/fleet');
            } else {
                toast.error(res.data?.message || "Failed to add car.");
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 text-slate-800 dark:text-slate-100">
            {/* Back button & Heading */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate('/dealer/fleet')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-500 mb-2 cursor-pointer"
                        >
                            <LuArrowLeft className="w-4 h-4" /> Back to Fleet
                        </button>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white font-heading">
                            Add New Luxury Vehicle
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manually enter all vehicle specifications, rental pricing, documentation, and pickup instructions.
                        </p>
                    </div>
                </div>

                {/* Navigation Pills */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto pb-2 gap-2">
                    {[
                        { id: 'vehicle', label: '1. Vehicle Details', icon: LuCar },
                        { id: 'rental', label: '2. Rental Pricing', icon: LuDollarSign },
                        { id: 'images', label: '3. Vehicle Photos', icon: LuUpload },
                        { id: 'pickup', label: '4. Pickup Location', icon: LuMapPin },
                        { id: 'owner', label: '5. Owner Info & RC', icon: LuUser }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeSection === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveSection(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                                    isActive
                                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-400"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Main Form Container */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-9 transition-colors">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* SECTION 1: Vehicle Details */}
                        {activeSection === 'vehicle' && (
                            <div className="space-y-5">
                                {/* Vehicle Type Toggle Cards */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                        Select Vehicle Type *
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleTypeSwitch("car")}
                                            className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                                                formData.vehicleType === "car"
                                                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 shadow-sm"
                                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                                            }`}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center shrink-0">
                                                <LuCar className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <span className="block font-bold text-sm">Car / 4-Wheeler</span>
                                                <span className="block text-[11px] text-slate-400">Sedan, SUV, Hatchback, Luxury</span>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleTypeSwitch("bike")}
                                            className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                                                formData.vehicleType === "bike"
                                                    ? "border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 shadow-sm"
                                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                                            }`}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center shrink-0">
                                                <LuBike className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div className="text-left">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="block font-bold text-sm">Bike / 2-Wheeler</span>
                                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-500 text-white">New</span>
                                                </div>
                                                <span className="block text-[11px] text-slate-400">Cruiser, Sports, Commuter, EV</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                                    {formData.vehicleType === "bike" ? "Bike Specifications" : "Car Specifications"}
                                </h3>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                                            {formData.vehicleType === "bike" ? "Bike Brand *" : "Car Brand *"}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.vehicleDetails.brand}
                                            onChange={(e) => setFormData(p => ({ ...p, vehicleDetails: { ...p.vehicleDetails, brand: e.target.value } }))}
                                            placeholder={formData.vehicleType === "bike" ? "e.g. Royal Enfield, Yamaha, Honda, KTM" : "e.g. Mercedes-Benz, Hyundai, Maruti"}
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                                            {formData.vehicleType === "bike" ? "Bike Model *" : "Car Model *"}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.vehicleDetails.model}
                                            onChange={(e) => setFormData(p => ({ ...p, vehicleDetails: { ...p.vehicleDetails, model: e.target.value } }))}
                                            placeholder={formData.vehicleType === "bike" ? "e.g. Classic 350, R15 V4, Activa 6G" : "e.g. Swift, Creta, Seltos, S-Class"}
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Manufacturing Year *</label>
                                        <input
                                            type="number"
                                            value={formData.vehicleDetails.manufacturingYear}
                                            onChange={(e) => setFormData(p => ({ ...p, vehicleDetails: { ...p.vehicleDetails, manufacturingYear: Number(e.target.value) } }))}
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Registration Number *</label>
                                        <input
                                            type="text"
                                            value={formData.vehicleDetails.registrationNumber}
                                            onChange={(e) => setFormData(p => ({ ...p, vehicleDetails: { ...p.vehicleDetails, registrationNumber: e.target.value.toUpperCase() } }))}
                                            placeholder="e.g. MH 01 AB 1234"
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none uppercase font-mono font-bold"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Category *</label>
                                        <select
                                            value={formData.vehicleDetails.category}
                                            onChange={(e) => setFormData(p => ({ ...p, vehicleDetails: { ...p.vehicleDetails, category: e.target.value } }))}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        >
                                            {formData.vehicleType === "bike" ? (
                                                <>
                                                    <option value="Activa">Activa / Standard</option>
                                                    <option value="Cruiser">Cruiser / Royal Enfield</option>
                                                    <option value="Sports">Sports Bike</option>
                                                    <option value="Commuter">Commuter</option>
                                                    <option value="Electric Bike">Electric Bike / EV</option>
                                                    <option value="Touring">Touring / Adventure</option>
                                                    <option value="Superbike">Superbike</option>
                                                    <option value="Off-Road">Off-Road</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="Luxury">Luxury</option>
                                                    <option value="Sedan">Sedan</option>
                                                    <option value="SUV">SUV</option>
                                                    <option value="Convertible">Convertible</option>
                                                    <option value="Coupe">Coupe</option>
                                                    <option value="Electric">Electric</option>
                                                    <option value="Hatchback">Hatchback</option>
                                                    <option value="Van">Van</option>
                                                    <option value="MUV">MUV</option>
                                                </>
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Vehicle Colour *</label>
                                        <input
                                            type="text"
                                            value={formData.vehicleDetails.colour}
                                            onChange={(e) => setFormData(p => ({ ...p, vehicleDetails: { ...p.vehicleDetails, colour: e.target.value } }))}
                                            placeholder="e.g. Metallic Black, Polar White"
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Fuel Type *</label>
                                        <select
                                            value={formData.vehicleDetails.fuelType}
                                            onChange={(e) => setFormData(p => ({ ...p, vehicleDetails: { ...p.vehicleDetails, fuelType: e.target.value } }))}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        >
                                            <option value="Petrol">Petrol</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="Electric">Electric</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Transmission *</label>
                                        <select
                                            value={formData.vehicleDetails.transmission}
                                            onChange={(e) => setFormData(p => ({ ...p, vehicleDetails: { ...p.vehicleDetails, transmission: e.target.value } }))}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        >
                                            <option value="Automatic">Automatic</option>
                                            <option value="Manual">Manual</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                                            {formData.vehicleType === "bike" ? "Engine Capacity (CC)" : "Seating Capacity"}
                                        </label>
                                        {formData.vehicleType === "bike" ? (
                                            <input
                                                type="text"
                                                value={formData.vehicleDetails.engineCapacity || "350 cc"}
                                                onChange={(e) => setFormData(p => ({ ...p, vehicleDetails: { ...p.vehicleDetails, engineCapacity: e.target.value } }))}
                                                placeholder="e.g. 349 cc, 155 cc, 390 cc"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                            />
                                        ) : (
                                            <input
                                                type="number"
                                                value={formData.vehicleDetails.seatingCapacity}
                                                onChange={(e) => setFormData(p => ({ ...p, vehicleDetails: { ...p.vehicleDetails, seatingCapacity: Number(e.target.value) } }))}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                            />
                                        )}
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Vehicle Description</label>
                                        <textarea
                                            rows={3}
                                            value={formData.vehicleDetails.description}
                                            onChange={(e) => setFormData(p => ({ ...p, vehicleDetails: { ...p.vehicleDetails, description: e.target.value } }))}
                                            placeholder={formData.vehicleType === "bike" ? "Highlight engine responsiveness, mileage, helmet inclusion, luggage rack, disc brakes..." : "Highlight luxury interior, bespoke sound system, panoramic sunroof, performance specs..."}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setActiveSection('rental')}
                                        className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase cursor-pointer"
                                    >
                                        Next: Rental Pricing →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SECTION 2: Rental Pricing */}
                        {activeSection === 'rental' && (
                            <div className="space-y-4">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Rental Pricing & Policies</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Daily Rental Price (₹) *</label>
                                        <input
                                            type="number"
                                            value={formData.rentalDetails.dailyPrice}
                                            onChange={(e) => setFormData(p => ({ ...p, rentalDetails: { ...p.rentalDetails, dailyPrice: Number(e.target.value) } }))}
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none font-bold"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Hourly Price (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.rentalDetails.hourlyPrice}
                                            onChange={(e) => setFormData(p => ({ ...p, rentalDetails: { ...p.rentalDetails, hourlyPrice: Number(e.target.value) } }))}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Security Deposit (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.rentalDetails.securityDeposit}
                                            onChange={(e) => setFormData(p => ({ ...p, rentalDetails: { ...p.rentalDetails, securityDeposit: Number(e.target.value) } }))}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Weekly Price (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.rentalDetails.weeklyPrice}
                                            onChange={(e) => setFormData(p => ({ ...p, rentalDetails: { ...p.rentalDetails, weeklyPrice: Number(e.target.value) } }))}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Monthly Price (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.rentalDetails.monthlyPrice}
                                            onChange={(e) => setFormData(p => ({ ...p, rentalDetails: { ...p.rentalDetails, monthlyPrice: Number(e.target.value) } }))}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Extra Km Charge (₹/km)</label>
                                        <input
                                            type="number"
                                            value={formData.rentalDetails.additionalKmCharges}
                                            onChange={(e) => setFormData(p => ({ ...p, rentalDetails: { ...p.rentalDetails, additionalKmCharges: Number(e.target.value) } }))}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Cancellation Policy</label>
                                        <input
                                            type="text"
                                            value={formData.rentalDetails.cancellationPolicy}
                                            onChange={(e) => setFormData(p => ({ ...p, rentalDetails: { ...p.rentalDetails, cancellationPolicy: e.target.value } }))}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button type="button" onClick={() => setActiveSection('vehicle')} className="px-5 py-2 rounded-xl border text-xs">Back</button>
                                    <button type="button" onClick={() => setActiveSection('images')} className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase">Next: Vehicle Photos →</button>
                                </div>
                            </div>
                        )}

                        {/* SECTION 3: Vehicle Photos */}
                        {activeSection === 'images' && (
                            <div className="space-y-4">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Vehicle Photography (Multiple Angles)</h3>
                                <p className="text-xs text-slate-400">High-resolution exterior and interior car photography increases booking requests.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    
                                    {/* Front Image */}
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                                        <label className="block text-xs font-bold uppercase mb-2">Front Angle Image *</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            disabled={uploadingField === 'frontImage'}
                                            onChange={(e) => handleUpload(e, 'frontImage')}
                                            className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:bg-amber-500 file:text-slate-950 file:border-0 cursor-pointer disabled:opacity-50"
                                        />
                                        {uploadingField === 'frontImage' && (
                                            <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                                                <LuLoader2 className="w-3.5 h-3.5 animate-spin" /> Uploading & optimizing...
                                            </div>
                                        )}
                                        {formData.images.frontImage && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <img src={formData.images.frontImage} alt="Front" className="w-14 h-10 object-cover rounded-lg" />
                                                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1"><LuCheck /> Uploaded</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Rear Image */}
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                                        <label className="block text-xs font-bold uppercase mb-2">Rear Angle Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            disabled={uploadingField === 'rearImage'}
                                            onChange={(e) => handleUpload(e, 'rearImage')}
                                            className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:bg-amber-500 file:text-slate-950 file:border-0 cursor-pointer disabled:opacity-50"
                                        />
                                        {uploadingField === 'rearImage' && (
                                            <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                                                <LuLoader2 className="w-3.5 h-3.5 animate-spin" /> Uploading & optimizing...
                                            </div>
                                        )}
                                        {formData.images.rearImage && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <img src={formData.images.rearImage} alt="Rear" className="w-14 h-10 object-cover rounded-lg" />
                                                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1"><LuCheck /> Uploaded</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Left Side */}
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                                        <label className="block text-xs font-bold uppercase mb-2">Left Side Profile</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            disabled={uploadingField === 'leftSideImage'}
                                            onChange={(e) => handleUpload(e, 'leftSideImage')}
                                            className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:bg-amber-500 file:text-slate-950 file:border-0 cursor-pointer disabled:opacity-50"
                                        />
                                        {uploadingField === 'leftSideImage' && (
                                            <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                                                <LuLoader2 className="w-3.5 h-3.5 animate-spin" /> Uploading & optimizing...
                                            </div>
                                        )}
                                        {formData.images.leftSideImage && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <img src={formData.images.leftSideImage} alt="Left" className="w-14 h-10 object-cover rounded-lg" />
                                                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1"><LuCheck /> Uploaded</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Side */}
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                                        <label className="block text-xs font-bold uppercase mb-2">Right Side Profile</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            disabled={uploadingField === 'rightSideImage'}
                                            onChange={(e) => handleUpload(e, 'rightSideImage')}
                                            className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:bg-amber-500 file:text-slate-950 file:border-0 cursor-pointer disabled:opacity-50"
                                        />
                                        {uploadingField === 'rightSideImage' && (
                                            <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                                                <LuLoader2 className="w-3.5 h-3.5 animate-spin" /> Uploading & optimizing...
                                            </div>
                                        )}
                                        {formData.images.rightSideImage && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <img src={formData.images.rightSideImage} alt="Right" className="w-14 h-10 object-cover rounded-lg" />
                                                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1"><LuCheck /> Uploaded</span>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <div className="flex justify-between pt-4">
                                    <button type="button" onClick={() => setActiveSection('rental')} className="px-5 py-2 rounded-xl border text-xs">Back</button>
                                    <button type="button" onClick={() => setActiveSection('pickup')} className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase">Next: Pickup Location →</button>
                                </div>
                            </div>
                        )}

                        {/* SECTION 4: Pickup Location */}
                        {activeSection === 'pickup' && (
                            <div className="space-y-4">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Vehicle Pickup & Drop-Off Station</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Pickup Station Physical Address *</label>
                                        <input
                                            type="text"
                                            value={formData.pickupInformation.pickupAddress}
                                            onChange={(e) => setFormData(p => ({ ...p, pickupInformation: { ...p.pickupInformation, pickupAddress: e.target.value } }))}
                                            placeholder="e.g. Terminal 2 Luxury Parking, Chhatrapati Shivaji Maharaj International Airport"
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">City *</label>
                                        <input
                                            type="text"
                                            value={formData.pickupInformation.city}
                                            onChange={(e) => setFormData(p => ({ ...p, pickupInformation: { ...p.pickupInformation, city: e.target.value } }))}
                                            required
                                            placeholder="e.g. Mumbai, Bangalore, Delhi"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">State *</label>
                                        <input
                                            type="text"
                                            value={formData.pickupInformation.state}
                                            onChange={(e) => setFormData(p => ({ ...p, pickupInformation: { ...p.pickupInformation, state: e.target.value } }))}
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">PIN Code *</label>
                                        <input
                                            type="text"
                                            value={formData.pickupInformation.pinCode}
                                            onChange={(e) => setFormData(p => ({ ...p, pickupInformation: { ...p.pickupInformation, pinCode: e.target.value } }))}
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Google Maps Link</label>
                                        <input
                                            type="text"
                                            value={formData.pickupInformation.googleMapsLocation}
                                            onChange={(e) => setFormData(p => ({ ...p, pickupInformation: { ...p.pickupInformation, googleMapsLocation: e.target.value } }))}
                                            placeholder="https://maps.google.com/?q=..."
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button type="button" onClick={() => setActiveSection('images')} className="px-5 py-2 rounded-xl border text-xs">Back</button>
                                    <button type="button" onClick={() => setActiveSection('owner')} className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase">Next: Owner Details & RC →</button>
                                </div>
                            </div>
                        )}

                        {/* SECTION 5: Owner Details & Registration Documents */}
                        {activeSection === 'owner' && (
                            <div className="space-y-4">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Vehicle Ownership & Legal Documentation</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Car Owner Full Name *</label>
                                        <input
                                            type="text"
                                            value={formData.ownerName}
                                            onChange={(e) => setFormData(p => ({ ...p, ownerName: e.target.value }))}
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Owner Email Address *</label>
                                        <input
                                            type="email"
                                            value={formData.ownerEmail}
                                            onChange={(e) => setFormData(p => ({ ...p, ownerEmail: e.target.value }))}
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Owner Contact Number *</label>
                                        <input
                                            type="tel"
                                            value={formData.ownerPhone}
                                            onChange={(e) => setFormData(p => ({ ...p, ownerPhone: e.target.value }))}
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Alternate Contact Number</label>
                                        <input
                                            type="tel"
                                            value={formData.alternateContact}
                                            onChange={(e) => setFormData(p => ({ ...p, alternateContact: e.target.value }))}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                                        />
                                    </div>

                                    {/* RC Document */}
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                                        <label className="block text-xs font-bold uppercase mb-2">Registration Certificate (RC)</label>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleDocUpload(e, 'registrationCertificateUrl')}
                                            className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:bg-amber-500 file:text-slate-950 file:border-0 cursor-pointer"
                                        />
                                        {formData.documents.registrationCertificateUrl && (
                                            <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1"><LuCheck /> RC Uploaded</p>
                                        )}
                                    </div>

                                    {/* Insurance Certificate */}
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                                        <label className="block text-xs font-bold uppercase mb-2">Insurance Certificate</label>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleDocUpload(e, 'insuranceCertificateUrl')}
                                            className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:bg-amber-500 file:text-slate-950 file:border-0 cursor-pointer"
                                        />
                                        {formData.documents.insuranceCertificateUrl && (
                                            <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1"><LuCheck /> Insurance Uploaded</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                                    <button type="button" onClick={() => setActiveSection('pickup')} className="px-5 py-2 rounded-xl border text-xs">Back</button>
                                    
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer disabled:opacity-70"
                                    >
                                        {loading ? <LuLoader2 className="w-4 h-4 animate-spin" /> : <LuCheck className="w-4 h-4" />}
                                        SUBMIT CAR FOR ADMIN APPROVAL
                                    </button>
                                </div>
                            </div>
                        )}

                    </form>
                </div>

        </div>
    );
};

export default DealerAddCar;
