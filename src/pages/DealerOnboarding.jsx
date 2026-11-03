import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Building2 as LuBuilding2, User as LuUser, FileText as LuFileText, Image as LuImage, MapPin as LuMapPin, Upload as LuUpload, Check as LuCheck, ArrowRight as LuArrowRight, Loader2 as LuLoader2, AlertCircle as LuAlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const DealerOnboarding = () => {
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'business', 'documents', 'payout'
    const [submitting, setSubmitting] = useState(false);

    // Form state matching Section 5 requirements
    const [formData, setFormData] = useState({
        personalDetails: {
            fullName: user?.name || "",
            email: user?.email || "",
            mobileNumber: user?.mobile || user?.phone || "",
            residentialAddress: "",
            profilePhoto: user?.avatar || ""
        },
        businessDetails: {
            rentalBusinessName: "",
            businessOwnerName: user?.name || "",
            businessEmail: user?.email || "",
            businessContactNumber: user?.mobile || user?.phone || "",
            businessAddress: "",
            city: "",
            state: "",
            pinCode: "",
            businessDescription: "",
            vehiclesOwned: 1,
            operatingHours: "9:00 AM - 9:00 PM"
        },
        verificationDocuments: {
            aadhaarCardUrl: "",
            panCardUrl: "",
            businessRegistrationUrl: "",
            gstCertificateUrl: "",
            drivingLicenceUrl: "",
            otherDocsUrl: ""
        },
        businessInformation: {
            shopOfficePhotos: [],
            businessLogo: "",
            googleMapsLocation: "",
            bankAccountDetails: {
                accountNumber: "",
                ifscCode: "",
                bankName: "",
                accountHolderName: user?.name || ""
            }
        }
    });

    useEffect(() => {
        // Check if application already exists
        const checkExisting = async () => {
            try {
                const res = await Axios({ ...SummaryApi.onboarding.dealerStatus });
                if (res.data?.success && res.data?.hasApplication) {
                    const app = res.data.data;
                    if (app.verificationStatus === "approved") {
                        navigate('/dealer/dashboard');
                    } else if (app.verificationStatus === "pending") {
                        navigate('/dealer/status');
                    } else {
                        // Resubmission mode
                        setFormData({
                            personalDetails: { ...app.personalDetails },
                            businessDetails: { ...app.businessDetails },
                            verificationDocuments: { ...app.verificationDocuments },
                            businessInformation: { ...app.businessInformation }
                        });
                    }
                }
            } catch {
                // proceed with new form
            }
        };
        checkExisting();
    }, [navigate]);

    // File upload handler to Cloudinary endpoint
    const handleFileUpload = async (e, fieldPath) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const uploadForm = new FormData();
            uploadForm.append('image', file);

            const res = await Axios({
                url: '/api/file/upload',
                method: 'post',
                data: uploadForm,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data?.data?.url) {
                const uploadedUrl = res.data.data.url;
                setFormData(prev => {
                    const updated = { ...prev };
                    if (fieldPath.length === 2) {
                        updated[fieldPath[0]][fieldPath[1]] = uploadedUrl;
                    } else if (fieldPath.length === 3) {
                        updated[fieldPath[0]][fieldPath[1]][fieldPath[2]] = uploadedUrl;
                    }
                    return updated;
                });
                toast.success("Document uploaded successfully.");
            }
        } catch {
            toast.error("Failed to upload document. Please try again.");
        }
    };

    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleBankChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            businessInformation: {
                ...prev.businessInformation,
                bankAccountDetails: {
                    ...prev.businessInformation.bankAccountDetails,
                    [field]: value
                }
            }
        }));
    };

    const handleSubmitApplication = async (e) => {
        e.preventDefault();

        // Validation
        const { personalDetails, businessDetails, verificationDocuments } = formData;
        if (!personalDetails.fullName || !personalDetails.mobileNumber || !personalDetails.residentialAddress) {
            setActiveTab('personal');
            toast.error("Please fill in all required personal information.");
            return;
        }

        if (!businessDetails.rentalBusinessName || !businessDetails.businessAddress || !businessDetails.city || !businessDetails.state || !businessDetails.pinCode) {
            setActiveTab('business');
            toast.error("Please fill in all required business details.");
            return;
        }

        if (!verificationDocuments.aadhaarCardUrl && !verificationDocuments.panCardUrl) {
            setActiveTab('documents');
            toast.error("Please upload at least Aadhaar or PAN card proof.");
            return;
        }

        try {
            setSubmitting(true);
            const res = await Axios({
                ...SummaryApi.onboarding.submitDealer,
                data: formData
            });

            if (res.data?.success) {
                toast.success(res.data.message || "Application submitted successfully!");
                // Refresh user state
                const userRes = await fetchUserDetails();
                if (userRes?.success) dispatch(setUserDetails(userRes.data));
                navigate('/dealer/status');
            } else {
                toast.error(res.data?.message || "Failed to submit application.");
            }
        } catch (err) {
            AxiosToastError(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Dealer Partner Onboarding
                    </span>
                    <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading">
                        Register Your Car Rental Fleet
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                        Complete your business verification to list luxury vehicles, receive booking requests, and manage rental operations.
                    </p>
                </div>

                {/* Progress Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto pb-2">
                    {[
                        { id: 'personal', label: '1. Personal Details', icon: LuUser },
                        { id: 'business', label: '2. Business Info', icon: LuBuilding2 },
                        { id: 'documents', label: '3. Verification Docs', icon: LuFileText },
                        { id: 'payout', label: '4. Location & Payouts', icon: LuMapPin }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
                                    isActive
                                        ? "border-amber-500 text-amber-600 dark:text-amber-400"
                                        : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-9 transition-colors">
                    <form onSubmit={handleSubmitApplication} className="space-y-6">

                        {/* SECTION A: Personal Details */}
                        {activeTab === 'personal' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <LuUser className="w-5 h-5 text-amber-500" /> Personal Information
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.personalDetails.fullName}
                                            onChange={(e) => handleNestedChange('personalDetails', 'fullName', e.target.value)}
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.personalDetails.email}
                                            readOnly
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 text-sm outline-none cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Mobile / Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.personalDetails.mobileNumber}
                                            onChange={(e) => handleNestedChange('personalDetails', 'mobileNumber', e.target.value)}
                                            required
                                            placeholder="+91 98765 43210"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Residential Address *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.personalDetails.residentialAddress}
                                            onChange={(e) => handleNestedChange('personalDetails', 'residentialAddress', e.target.value)}
                                            required
                                            placeholder="House No, Street, Landmark"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('business')}
                                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer"
                                    >
                                        Next: Business Details <LuArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SECTION B: Rental Business Details */}
                        {activeTab === 'business' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <LuBuilding2 className="w-5 h-5 text-amber-500" /> Rental Business Details
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Rental Business / Agency Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.businessDetails.rentalBusinessName}
                                            onChange={(e) => handleNestedChange('businessDetails', 'rentalBusinessName', e.target.value)}
                                            required
                                            placeholder="e.g. Apex Luxury Car Rentals"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Business Owner Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.businessDetails.businessOwnerName}
                                            onChange={(e) => handleNestedChange('businessDetails', 'businessOwnerName', e.target.value)}
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Business Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.businessDetails.businessEmail}
                                            onChange={(e) => handleNestedChange('businessDetails', 'businessEmail', e.target.value)}
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Business Contact Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.businessDetails.businessContactNumber}
                                            onChange={(e) => handleNestedChange('businessDetails', 'businessContactNumber', e.target.value)}
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Business Physical Address *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.businessDetails.businessAddress}
                                            onChange={(e) => handleNestedChange('businessDetails', 'businessAddress', e.target.value)}
                                            required
                                            placeholder="Office / Showroom address"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.businessDetails.city}
                                            onChange={(e) => handleNestedChange('businessDetails', 'city', e.target.value)}
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.businessDetails.state}
                                            onChange={(e) => handleNestedChange('businessDetails', 'state', e.target.value)}
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            PIN Code *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.businessDetails.pinCode}
                                            onChange={(e) => handleNestedChange('businessDetails', 'pinCode', e.target.value)}
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Approximate Fleet Size (Vehicles Owned)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.businessDetails.vehiclesOwned}
                                            onChange={(e) => handleNestedChange('businessDetails', 'vehiclesOwned', Number(e.target.value))}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('personal')}
                                        className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold cursor-pointer"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('documents')}
                                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer"
                                    >
                                        Next: Verification Documents <LuArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SECTION C: Verification Documents */}
                        {activeTab === 'documents' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <LuFileText className="w-5 h-5 text-amber-500" /> Government & Business Verification Documents
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Upload clear copies in JPG, PNG, or PDF format.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    
                                    {/* Aadhaar Card */}
                                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                            Aadhaar Card / Government Identity *
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileUpload(e, ['verificationDocuments', 'aadhaarCardUrl'])}
                                            className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                                        />
                                        {formData.verificationDocuments.aadhaarCardUrl && (
                                            <p className="mt-2 text-xs text-emerald-500 flex items-center gap-1 font-semibold">
                                                <LuCheck className="w-4 h-4" /> Document uploaded
                                            </p>
                                        )}
                                    </div>

                                    {/* PAN Card */}
                                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                            PAN Card *
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileUpload(e, ['verificationDocuments', 'panCardUrl'])}
                                            className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                                        />
                                        {formData.verificationDocuments.panCardUrl && (
                                            <p className="mt-2 text-xs text-emerald-500 flex items-center gap-1 font-semibold">
                                                <LuCheck className="w-4 h-4" /> Document uploaded
                                            </p>
                                        )}
                                    </div>

                                    {/* Business Registration Certificate */}
                                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                            Business Registration Certificate
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileUpload(e, ['verificationDocuments', 'businessRegistrationUrl'])}
                                            className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                                        />
                                        {formData.verificationDocuments.businessRegistrationUrl && (
                                            <p className="mt-2 text-xs text-emerald-500 flex items-center gap-1 font-semibold">
                                                <LuCheck className="w-4 h-4" /> Document uploaded
                                            </p>
                                        )}
                                    </div>

                                    {/* GST Certificate */}
                                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                            GST Certificate (Optional)
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileUpload(e, ['verificationDocuments', 'gstCertificateUrl'])}
                                            className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                                        />
                                        {formData.verificationDocuments.gstCertificateUrl && (
                                            <p className="mt-2 text-xs text-emerald-500 flex items-center gap-1 font-semibold">
                                                <LuCheck className="w-4 h-4" /> Document uploaded
                                            </p>
                                        )}
                                    </div>

                                </div>

                                <div className="flex justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('business')}
                                        className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold cursor-pointer"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('payout')}
                                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer"
                                    >
                                        Next: Location & Payouts <LuArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SECTION D: Location & Payout Details */}
                        {activeTab === 'payout' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <LuMapPin className="w-5 h-5 text-amber-500" /> Business Location & Rental Payout Account
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Google Maps Business Location (URL or Coordinates)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.businessInformation.googleMapsLocation}
                                            onChange={(e) => handleNestedChange('businessInformation', 'googleMapsLocation', e.target.value)}
                                            placeholder="https://maps.google.com/?q=..."
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Bank Account Number *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.businessInformation.bankAccountDetails.accountNumber}
                                            onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                                            required
                                            placeholder="Account Number"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            IFSC Code *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.businessInformation.bankAccountDetails.ifscCode}
                                            onChange={(e) => handleBankChange('ifscCode', e.target.value.toUpperCase())}
                                            required
                                            placeholder="e.g. HDFC0001234"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Bank Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.businessInformation.bankAccountDetails.bankName}
                                            onChange={(e) => handleBankChange('bankName', e.target.value)}
                                            required
                                            placeholder="e.g. HDFC Bank"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                            Account Holder Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.businessInformation.bankAccountDetails.accountHolderName}
                                            onChange={(e) => handleBankChange('accountHolderName', e.target.value)}
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 mt-4">
                                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed flex items-start gap-2">
                                        <LuAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        By submitting this application, you confirm that all provided business credentials, vehicle ownership proofs, and identification documents are authentic and compliant with motor vehicle rental regulations.
                                    </p>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('documents')}
                                        className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold cursor-pointer"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-70"
                                    >
                                        {submitting ? (
                                            <>
                                                <LuLoader2 className="w-5 h-5 animate-spin" /> Submitting...
                                            </>
                                        ) : (
                                            <>
                                                SUBMIT APPLICATION FOR APPROVAL <LuCheck className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                    </form>
                </div>

            </div>
        </div>
    );
};

export default DealerOnboarding;
