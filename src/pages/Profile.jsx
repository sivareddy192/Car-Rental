import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import { User, Mail, Phone, Camera, ShieldCheck } from 'lucide-react';
import AvatarEdit from '../components/AvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';
import { getImageUrl } from '../utils/getImageUrl';

const Profile = () => {
    const user = useSelector(state => state.user)
    const [openAvatarEdit, setAvatarEdit] = useState(false)
    const [userData, setUserData] = useState({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
    })
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        setUserData({
            name: user.name || "",
            email: user.email || "",
            mobile: user.mobile || "",
        })
    }, [user])

    const handleOnChange = (e) => {
        const { name, value } = e.target 
        setUserData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: userData
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message || "Profile updated successfully")
                const fetched = await fetchUserDetails()
                dispatch(setUserDetails(fetched.data))
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='bg-white dark:bg-[#161B26] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 lg:p-10 shadow-xs'>
            
            {/* Header */}
            <div className='pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'>
                <div>
                    <h2 className='text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-heading'>
                        Personal Details
                    </h2>
                    <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1'>
                        Update your identity, email, and contact details
                    </p>
                </div>
                {user?.role && (
                    <div className='inline-flex items-center gap-1.5 self-start sm:self-auto px-2.5 sm:px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 text-[11px] sm:text-xs font-bold'>
                        <ShieldCheck className='w-3.5 h-3.5' />
                        <span className='capitalize'>{user.role} Verified</span>
                    </div>
                )}
            </div>

            <div className='flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 items-start'>
                
                {/* Avatar Section */}
                <div className='flex flex-col items-center gap-3 shrink-0 mx-auto lg:mx-0'>
                    <div className='w-24 h-24 sm:w-36 sm:h-36 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-xs relative group'>
                        {user.avatar ? (
                            <img 
                                alt={user.name || 'User'}
                                src={getImageUrl(user.avatar)}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <FaRegUserCircle size={56} className='text-slate-300 dark:text-slate-600 sm:w-16 sm:h-16' />
                        )}
                        <button
                            type='button'
                            onClick={() => setAvatarEdit(true)}
                            className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold cursor-pointer gap-1'
                        >
                            <Camera className='w-4 h-4' />
                            <span>Change</span>
                        </button>
                    </div>
                    <button 
                        type='button'
                        onClick={() => setAvatarEdit(true)} 
                        className='inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all cursor-pointer'
                    >
                        <Camera className='w-3.5 h-3.5' />
                        <span>Edit Photo</span>
                    </button>
                </div>
                
                {/* Details Form */}
                <form className='flex-1 grid gap-4 sm:gap-5 w-full' onSubmit={handleSubmit}>
                    
                    {/* Full Name */}
                    <div className='grid gap-1.5'>
                        <label htmlFor='name' className='text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5'>
                            <User className='w-3.5 h-3.5' />
                            <span>Full Name</span>
                        </label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            placeholder='Enter your full name'
                            className='w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 outline-none transition-all'
                            value={userData.name || ""}
                            onChange={handleOnChange}
                            autoComplete="name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className='grid gap-1.5'>
                        <label htmlFor='email' className='text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5'>
                            <Mail className='w-3.5 h-3.5' />
                            <span>Email Address (Primary Account)</span>
                        </label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            placeholder='Enter your email'
                            className='w-full bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none'
                            value={userData.email || ""}
                            onChange={handleOnChange}
                            readOnly
                            autoComplete="email"
                        />
                        <p className='text-[11px] text-slate-400 dark:text-slate-500'>
                            Email address is linked to your account authentication and cannot be changed directly.
                        </p>
                    </div>

                    {/* Mobile Number */}
                    <div className='grid gap-1.5'>
                        <label htmlFor='mobile' className='text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5'>
                            <Phone className='w-3.5 h-3.5' />
                            <span>Mobile Phone Number</span>
                        </label>
                        <input
                            type='tel'
                            id='mobile'
                            name='mobile'
                            placeholder='Enter your 10-digit mobile number'
                            className='w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 outline-none transition-all'
                            value={userData.mobile || ""}
                            onChange={handleOnChange}
                            required
                            inputMode='numeric'
                            pattern='[0-9]*'
                            autoComplete="tel"
                        />
                    </div>

                    {/* Submit Action */}
                    <div className='pt-2'>
                        <button 
                            type='submit'
                            disabled={loading}
                            className='w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50'
                        >
                            {loading ? "Saving Changes..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

            {openAvatarEdit && (
                <AvatarEdit close={() => setAvatarEdit(false)} />
            )}
        </div>
    )
}

export default Profile
