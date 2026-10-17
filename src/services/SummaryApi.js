export const baseURL = import.meta.env.BASE_URL || (import.meta.env.API_URL ? import.meta.env.API_URL.replace(/\/api\/?$/, '') : 'http://localhost:2000');
// export const baseURL = "http://localhost:8080"
// export const baseURL = "http://localhost:8000"

const SummaryApi = {
  // ─── User & Authentication ───────────────────────────────────────────────────
  register: {
    url: 'api/user/register',
    method: 'post',
  },
  login: {
    url: 'api/user/login',
    method: 'post',
  },
  verifyEmail: {
    url: 'api/user/verify-email',
    method: 'post',
  },
  forgot_password: {
    url: 'api/user/forgot-password',
    method: 'put',
  },
  forgot_password_otp_verification: {
    url: 'api/user/verify-forgot-password-otp',
    method: 'put',
  },
  resetPassword: {
    url: '/api/user/reset-password',
    method: 'put',
  },
  refreshToken: {
    url: 'api/user/refresh-token',
    method: 'post',
  },
  userDetails: {
    url: '/api/user/details',
    method: 'get',
  },
  logout: {
    url: '/api/user/logout',
    method: 'post',
  },
  uploadAvatar: {
    url: '/api/user/upload-avatar',
    method: 'put',
  },
  updateUserDetails: {
    url: '/api/user/update-user',
    method: 'put',
  },

  // ─── Categories & Subcategories ──────────────────────────────────────────────
  uploadcategory: {
    url: '/api/category/upload-category',
    method: 'post',
  },
  uploadImage: {
    url: '/api/file/upload',
    method: 'post',
  },
  uploadVideo: {
    url: '/api/file/upload-video',
    method: 'post',
  },
  getCategory: {
    url: '/api/category/get',
    method: 'get',
  },
  updateCategory: {
    url: '/api/category/update',
    method: 'put',
  },
  deleteCategory: {
    url: '/api/category/delete',
    method: 'delete',
  },
  createSubCategory: {
    url: '/api/subcategory/create',
    method: 'post',
  },
  getSubCategory: {
    url: '/api/subcategory/get',
    method: 'post',
  },
  updateSubCategory: {
    url: '/api/subcategory/update',
    method: 'put',
  },
  deleteSubCategory: {
    url: '/api/subcategory/delete',
    method: 'delete',
  },

  // ─── Products & Fleet Vehicles ───────────────────────────────────────────────
  createProduct: {
    url: '/api/product/create',
    method: 'post',
  },
  getProduct: {
    url: '/api/product/get',
    method: 'post',
  },
  getProductByCategory: {
    url: '/api/product/get-product-by-category',
    method: 'post',
  },
  getProductByCategoryAndSubCategory: {
    url: '/api/product/get-product-by-category-and-subcategory',
    method: 'post',
  },
  getProductDetails: {
    url: '/api/product/get-product-details',
    method: 'post',
  },
  updateProductDetails: {
    url: '/api/product/update-product-details',
    method: 'put',
  },
  deleteProduct: {
    url: '/api/product/delete-product',
    method: 'delete',
  },
  searchProduct: {
    url: '/api/product/search-product',
    method: 'post',
  },
  product_offers: {
    url: '/api/product/get-offers',
    method: 'get',
  },

  // ─── Cart & Address ─────────────────────────────────────────────────────────
  addTocart: {
    url: '/api/cart/create',
    method: 'post',
  },
  getCartItem: {
    url: '/api/cart/get',
    method: 'get',
  },
  updateCartItemQty: {
    url: '/api/cart/update-qty',
    method: 'put',
  },
  deleteCartItem: {
    url: '/api/cart/delete-cart-item',
    method: 'delete',
  },
  createAddress: {
    url: '/api/address/create',
    method: 'post',
  },
  getAddress: {
    url: '/api/address/get',
    method: 'get',
  },
  updateAddress: {
    url: '/api/address/update',
    method: 'put',
  },
  disableAddress: {
    url: '/api/address/disable',
    method: 'delete',
  },

  // ─── Orders & Payments ──────────────────────────────────────────────────────
  CashOnDeliveryOrder: {
    url: '/api/order/cash-on-delivery',
    method: 'post',
  },
  payment_url: {
    url: '/api/order/checkout',
    method: 'post',
  },
  verify_payment: {
    url: '/api/order/verify-payment',
    method: 'post',
  },

  cart: {
    reorder: {
      url: '/api/order/reorder',
      method: 'post',
    },
  },

  order: {
    cod: {
      url: '/api/order/cod',
      method: 'post',
    },
    reorder: {
      url: '/api/order/reorder',
      method: 'post',
    },
    getOrders: {
      url: '/api/order/my-orders',
      method: 'get',
    },
    cancelOrder: {
      url: '/api/order/cancel/:orderId',
      method: 'put',
    },
    deleteOrder: {
      url: '/api/order/delete/:id',
      method: 'delete',
    },
    assignOrder: {
      url: '/api/order/assign',
      method: 'post',
    },
    scanAssignOrder: {
      url: '/api/order/scan-assign',
      method: 'post',
    },
    getOrderItems: {
      url: '/api/order/order-items',
      method: 'get',
    },
  },

  // ─── Delivery Boy ───────────────────────────────────────────────────────────
  deliveryBoy: {
    getDeliveryBoys: {
      url: '/api/delivery-boy/get-delivery-boys',
      method: 'get',
    },
    sendOtp: {
      url: '/api/delivery-boy/send-otp',
      method: 'post',
    },
    verifyOtp: {
      url: '/api/delivery-boy/verify-otp',
      method: 'post',
    },
  },

  // ─── Admin Management ───────────────────────────────────────────────────────
  admin: {
    getOrders: {
      url: '/api/admin/orders',
      method: 'get',
    },
    updateOrderStatus: {
      url: '/api/admin/orders',
      method: 'put',
    },
    getStats: {
      url: '/api/admin/stats',
      method: 'get',
    },
    analytics: {
      url: '/api/admin/analytics',
      method: 'get',
    },
    getCustomers: {
      url: '/api/admin/customers',
      method: 'get',
    },
    updateCustomerRole: (id) => ({
      url: `/api/admin/customers/${id}/role`,
      method: 'patch',
    }),
    getAuditLogs: {
      url: '/api/admin/audit-logs',
      method: 'get',
    },
  },

  // ─── Coupons & Promotions ───────────────────────────────────────────────────
  coupon_list: {
    url: '/api/coupon/all',
    method: 'get',
  },
  coupon_create: {
    url: '/api/coupon/create',
    method: 'post',
  },
  coupon_update: (id) => ({
    url: `/api/coupon/update/${id}`,
    method: 'put',
  }),
  coupon_delete: (id) => ({
    url: `/api/coupon/delete/${id}`,
    method: 'delete',
  }),
  coupon_send_email: {
    url: '/api/coupon/send-offer-email',
    method: 'post',
  },
  coupon_apply: {
    url: '/api/coupon/apply',
    method: 'post',
  },

  // ─── Banners ────────────────────────────────────────────────────────────────
  addBanner: {
    url: '/api/banner/add-banner',
    method: 'post',
  },
  getBanner: {
    url: '/api/banner/get',
    method: 'get',
  },
  updateBanner: {
    url: '/api/banner/update-banner',
    method: 'put',
  },
  deleteBanner: {
    url: '/api/banner/delete-banner',
    method: 'delete',
  },

  // ─── Users (Admin Operations) ───────────────────────────────────────────────
  all_users: {
    url: '/api/user/all-users',
    method: 'get',
  },
  update_user_role: {
    url: '/api/user/update-role',
    method: 'put',
  },
  admin_update_user: {
    url: '/api/user/admin-update-user',
    method: 'put',
  },
  delete_user: {
    url: '/api/user/delete-user',
    method: 'delete',
  },
  request_delete: {
    url: '/api/user/request-delete',
    method: 'put',
  },

  // ─── Reviews ────────────────────────────────────────────────────────────────
  review_add: {
    url: '/api/review/add',
    method: 'post',
  },
  review_get: (productId) => ({
    url: `/api/review/get/${productId}`,
    method: 'get',
  }),
  review_get_all: {
    url: '/api/review/get-all',
    method: 'get',
  },
  review_update: {
    url: '/api/review/update',
    method: 'put',
  },
  review_delete: {
    url: '/api/review/delete',
    method: 'delete',
  },

  // ─── AI Chat ────────────────────────────────────────────────────────────────
  ai_chat: {
    url: '/api/ai/chat',
    method: 'post',
  },

  // ─── Notifications ──────────────────────────────────────────────────────────
  notification: {
    get: {
      url: '/api/notification/get',
      method: 'get',
    },
    markRead: {
      url: '/api/notification/mark-read',
      method: 'put',
    },
    markAllRead: {
      url: '/api/notification/mark-all-read',
      method: 'put',
    },
    delete: {
      url: '/api/notification/delete',
      method: 'delete',
    },
  },

  // ─── Festival Offers ────────────────────────────────────────────────────────
  festivalOffer: {
    add: {
      url: '/api/festival-offer/add',
      method: 'post',
    },
    get: {
      url: '/api/festival-offer/get',
      method: 'get',
    },
    update: {
      url: '/api/festival-offer/update',
      method: 'put',
    },
    delete: {
      url: '/api/festival-offer/delete',
      method: 'delete',
    },
    sendBlast: {
      url: '/api/festival-offer/send-blast',
      method: 'post',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ─── Car Rental DOMAIN MODULES (Fleet, Bookings, Tours, Concierge) ────────
  // ═══════════════════════════════════════════════════════════════════════════

  // Health
  health: {
    url: '/api/health',
    method: 'get',
  },

  // Auth & Session
  auth: {
    register: { url: '/api/auth/register', method: 'post' },
    login: { url: '/api/auth/login', method: 'post' },
    logout: { url: '/api/auth/logout', method: 'post' },
    refresh: { url: '/api/auth/refresh', method: 'post' },
    verifyEmail: { url: '/api/auth/verify-email', method: 'get' },
    resendVerification: { url: '/api/auth/resend-verification', method: 'post' },
    forgotPassword: { url: '/api/auth/forgot-password', method: 'post' },
    verifyOtp: { url: '/api/auth/verify-otp', method: 'post' },
    resetPassword: { url: '/api/auth/reset-password', method: 'post' },
    getMe: { url: '/api/auth/me', method: 'get' },
    updateProfile: { url: '/api/auth/profile', method: 'put' },
    changePassword: { url: '/api/auth/change-password', method: 'put' },
  },

  // Luxury Fleet Vehicles
  vehicles: {
    list: { url: '/api/vehicles', method: 'get' },
    getById: (id) => ({ url: `/api/vehicles/${id}`, method: 'get' }),
    checkAvailability: (id) => ({ url: `/api/vehicles/${id}/availability`, method: 'get' }),
    create: { url: '/api/vehicles', method: 'post' },
    update: (id) => ({ url: `/api/vehicles/${id}`, method: 'put' }),
    delete: (id) => ({ url: `/api/vehicles/${id}`, method: 'delete' }),
    blockDates: { url: '/api/vehicles/block-dates', method: 'post' },
  },

  // Bookings & Reservations
  bookings: {
    create: { url: '/api/bookings', method: 'post' },
    getAll: { url: '/api/bookings', method: 'get' },
    getMyBookings: { url: '/api/bookings/my-bookings', method: 'get' },
    getById: (id) => ({ url: `/api/bookings/${id}`, method: 'get' }),
    cancel: (id) => ({ url: `/api/bookings/${id}/cancel`, method: 'patch' }),
    updateStatus: (id) => ({ url: `/api/bookings/${id}/status`, method: 'patch' }),
  },

  // Wishlist
  wishlist: {
    get: { url: '/api/wishlist', method: 'get' },
    add: (vehicleId) => ({ url: `/api/wishlist/${vehicleId}`, method: 'post' }),
    remove: (vehicleId) => ({ url: `/api/wishlist/${vehicleId}`, method: 'delete' }),
  },

  // Tour Packages
  tours: {
    list: { url: '/api/tours', method: 'get' },
    getById: (id) => ({ url: `/api/tours/${id}`, method: 'get' }),
    create: { url: '/api/tours', method: 'post' },
    update: (id) => ({ url: `/api/tours/${id}`, method: 'put' }),
    delete: (id) => ({ url: `/api/tours/${id}`, method: 'delete' }),
  },

  // Concierge & NRI Enquiries
  enquiries: {
    create: { url: '/api/enquiries', method: 'post' },
    getAll: { url: '/api/enquiries', method: 'get' },
    updateStatus: (id) => ({ url: `/api/enquiries/${id}`, method: 'patch' }),
  },

  // Contact Messages
  contact: {
    submit: { url: '/api/contact', method: 'post' },
    getAll: { url: '/api/contact', method: 'get' },
    markRead: (id) => ({ url: `/api/contact/${id}/read`, method: 'patch' }),
  },

  // Reviews
  reviews: {
    getByVehicle: (vehicleId) => ({ url: `/api/reviews/vehicle/${vehicleId}`, method: 'get' }),
    submit: { url: '/api/reviews', method: 'post' },
  },
};

export default SummaryApi;
