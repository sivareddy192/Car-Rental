import axios from 'axios';
import { baseURL } from './SummaryApi';

// ─── Axios Instance ──────────────────────────────────────────────────────────
export const Axios = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = Axios;

// ─── Request Interceptor: normalize URLs & inject JWT token ───────────────────
Axios.interceptors.request.use(
  (config) => {
    // Normalization: Ensure leading slash and /api prefix for relative URLs
    if (config.url && !config.url.startsWith('http')) {
      if (config.url.startsWith('api/')) {
        config.url = `/${config.url}`;
      } else if (!config.url.startsWith('/api')) {
        config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
      }
    }

    const token = localStorage.getItem('rd_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: token refresh on 401 ──────────────────────────────
let refreshPromise = null;

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        refreshPromise ||= axios.post(
          `${baseURL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { data } = await refreshPromise;

        if (data.accessToken) {
          localStorage.setItem('rd_access_token', data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return Axios(originalRequest);
        }
      } catch (refreshErr) {
        if (refreshErr.response?.status === 401) {
          localStorage.removeItem('rd_access_token');
          localStorage.removeItem('rd_user');
        }
        return Promise.reject(refreshErr);
      } finally {
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

// ─── Helper: Execute any SummaryApi endpoint definition ───────────────────────
// Usage:
//   await Axios({ ...SummaryApi.login, data: { email, password } })
//   await apiCall(SummaryApi.login, { email, password })
//   await apiCall(SummaryApi.vehicles.getById(id))
export const apiCall = (endpoint, data = null, config = {}) => {
  const target = typeof endpoint === 'function' ? endpoint() : endpoint;
  const { url, method } = target;
  return Axios.request({ url, method, data, ...config });
};

export default Axios;
