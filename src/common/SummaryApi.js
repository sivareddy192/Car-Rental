const rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:8088";

export const baseURL = rawBaseURL ? rawBaseURL.trim().replace(/\/+$/, "") : "";

const SummaryApi = {
    // User Authentication & Profile
    register: {
        url: '/api/user/register',
        method: 'post'
    },
    login: {
        url: '/api/user/login',
        method: 'post'
    },
    verifyEmail: {
        url: '/api/user/verify-email',
        method: 'post'
    },
    forgot_password: {
        url: '/api/user/forgot-password',
        method: 'put'
    },
    forgot_password_otp_verification: {
        url: '/api/user/verify-forgot-password-otp',
        method: 'put'
    },
    resetPassword: {
        url: '/api/user/reset-password',
        method: 'put'
    },
    refreshToken: {
        url: '/api/user/refresh-token',
        method: 'post'
    },
    userDetails: {
        url: '/api/user/details',
        method: 'get'
    },
    logout: {
        url: '/api/user/logout',
        method: 'post'
    },
    uploadAvatar: {
        url: '/api/user/upload-avatar',
        method: 'put'
    },
    updateUserDetails: {
        url: '/api/user/update-user',
        method: 'put'
    },
    all_users: {
        url: '/api/user/all-users',
        method: 'get'
    },
    update_user_role: {
        url: '/api/user/update-role',
        method: 'put'
    },
    update_account_status: {
        url: '/api/user/update-account-status',
        method: 'put'
    },
    delete_user: {
        url: '/api/user/delete-user',
        method: 'delete'
    },
    request_delete: {
        url: '/api/user/request-delete',
        method: 'put'
    },

    // File Uploads & Storage Management
    uploadImage: {
        url: '/api/file/upload',
        method: 'post'
    },
    uploadVideo: {
        url: '/api/file/upload-video',
        method: 'post'
    },
    deleteFile: {
        url: '/api/file/delete',
        method: 'delete'
    },

    // In-App Notifications
    notification: {
        get: {
            url: '/api/notification/get',
            method: 'get'
        },
        unreadCount: {
            url: '/api/notification/unread-count',
            method: 'get'
        },
        markRead: {
            url: '/api/notification/mark-read',
            method: 'put'
        },
        markAllRead: {
            url: '/api/notification/mark-all-read',
            method: 'put'
        },
        delete: {
            url: '/api/notification/delete',
            method: 'delete'
        }
    },

    // Premium Car & Bike Rental Fleet Endpoints
    getPublicCars: { url: '/api/cars/public', method: 'get' },
    cars: {
        getPublic: { url: '/api/cars/public', method: 'get' },
        publicCars: { url: '/api/cars/public', method: 'get' },
        getById: (id) => ({ url: `/api/cars/public/${id}`, method: 'get' }),
        add: { url: '/api/cars/add', method: 'post' },
        myFleet: { url: '/api/cars/my-fleet', method: 'get' },
        update: (id) => ({ url: `/api/cars/update/${id}`, method: 'put' }),
        toggleAvailability: (id) => ({ url: `/api/cars/toggle-availability/${id}`, method: 'put' }),
        delete: (id) => ({ url: `/api/cars/delete/${id}`, method: 'delete' }),
        adminApprovals: { url: '/api/cars/admin/approvals', method: 'get' },
        adminReview: (id) => ({ url: `/api/cars/admin/review/${id}`, method: 'put' })
    },

    // Dealer & Agent Onboarding
    onboarding: {
        submitDealer: { url: '/api/onboarding/dealer/submit', method: 'post' },
        dealerStatus: { url: '/api/onboarding/dealer/status', method: 'get' },
        submitAgent: { url: '/api/onboarding/agent/submit', method: 'post' },
        agentStatus: { url: '/api/onboarding/agent/status', method: 'get' },
        adminApplications: { url: '/api/onboarding/admin/applications', method: 'get' },
        adminReviewDealer: { url: '/api/onboarding/admin/review-dealer', method: 'put' },
        adminReviewAgent: { url: '/api/onboarding/admin/review-agent', method: 'put' }
    },

    // Vehicle Booking Lifecycle Endpoints
    booking: {
        create: { url: '/api/booking/create', method: 'post' },
        myBookings: { url: '/api/booking/my-bookings', method: 'get' },
        dealerBookings: { url: '/api/booking/dealer', method: 'get' },
        agentBookings: { url: '/api/booking/agent', method: 'get' },
        adminAllBookings: { url: '/api/booking/admin/all', method: 'get' },
        getById: (id) => ({ url: `/api/booking/${id}`, method: 'get' }),
        approve: (id) => ({ url: `/api/booking/approve/${id}`, method: 'put' }),
        reject: (id) => ({ url: `/api/booking/reject/${id}`, method: 'put' }),
        dealerDecision: (id) => ({ url: `/api/booking/approve/${id}`, method: 'put' }),
        cancel: (id) => ({ url: `/api/booking/cancel/${id}`, method: 'put' }),
        handover: (id) => ({ url: `/api/booking/handover/${id}`, method: 'put' }),
        completeReturn: (id) => ({ url: `/api/booking/return/${id}`, method: 'put' })
    },

    // Verified Rental Shops & Hubs
    rentalShops: {
        getAll: { url: '/api/onboarding/public/shops', method: 'get' },
        getById: Object.assign((id) => ({ url: `/api/onboarding/public/shops/${id}`, method: 'get' }), {
            url: '/api/onboarding/public/shops',
            method: 'get'
        })
    },

    // Admin Governance & User Management
    adminPlatform: {
        overviewStats: { url: '/api/admin/overview-stats', method: 'get' },
        securityLogs: { url: '/api/admin/security-logs', method: 'get' },
        allUsers: { url: '/api/user/all-users', method: 'get' },
        updateAccountStatus: { url: '/api/user/update-account-status', method: 'put' },
        updateRole: { url: '/api/user/update-role', method: 'put' },
        deleteUser: { url: '/api/user/delete-user', method: 'delete' }
    },

    // Legal & Privacy Management System
    legal: {
        getPolicy: (slug) => ({ url: `/api/legal/${slug}`, method: 'get' }),
        getAll: { url: '/api/legal', method: 'get' },
        adminAll: { url: '/api/legal/admin/all', method: 'get' },
        adminUpdate: (slug) => ({ url: `/api/legal/admin/update/${slug}`, method: 'put' })
    },

    // Global Cookie Consent Management
    cookieConsent: {
        record: { url: '/api/cookie-consent', method: 'post' },
        getPreferences: { url: '/api/cookie-consent/preferences', method: 'get' },
        updatePreferences: { url: '/api/cookie-consent/preferences', method: 'patch' },
        withdraw: { url: '/api/cookie-consent/withdraw', method: 'post' },
        adminLogs: { url: '/api/cookie-consent/admin/logs', method: 'get' },
        adminStats: { url: '/api/cookie-consent/admin/statistics', method: 'get' }
    }
};

export default SummaryApi;
