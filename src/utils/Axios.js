import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

// In-memory response cache and in-flight request deduplication map
const apiCache = new Map();
const inFlightRequests = new Map();

const DEFAULT_CACHE_TTL = 15 * 1000; // 15 seconds

export const clearApiCache = () => {
    apiCache.clear();
};

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 15000 // 15 second request timeout
});

// Request Interceptor
Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
Axios.interceptors.response.use(
    (response) => {
        // On successful mutation (POST, PUT, DELETE, PATCH), invalidate cached GET responses
        const method = (response.config.method || 'get').toLowerCase();
        if (['post', 'put', 'delete', 'patch'].includes(method)) {
            clearApiCache();
        }
        return response;
    },
    async (error) => {
        const originRequest = error.config;

        if (error?.response?.status === 401 && !originRequest?.retry) {
            if (error.response.data?.forceLogout) {
                localStorage.clear();
                clearApiCache();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            originRequest.retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken);

                if (newAccessToken) {
                    originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return Axios(originRequest);
                }
            } else {
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios({
            ...SummaryApi.refreshToken,
            baseURL: baseURL,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        });

        const accessToken = response.data.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        return accessToken;
    } catch (error) {
        console.error("Token refresh failed:", error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return null;
    }
};

/**
 * Cached and Deduplicated API fetch wrapper.
 * For GET requests:
 *  - Returns cached response if within TTL.
 *  - Deduplicates identical in-flight requests.
 */
export const fetchWithCache = async (config, customTtl = DEFAULT_CACHE_TTL) => {
    const method = (config.method || 'get').toLowerCase();

    // Only cache GET requests
    if (method !== 'get' || config.skipCache) {
        return Axios(config);
    }

    const url = config.url || '';
    const paramsStr = JSON.stringify(config.params || {});
    const cacheKey = `${url}?${paramsStr}`;

    // 1. Check in-memory cache
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < customTtl) {
        return cached.data;
    }

    // 2. Check if an identical request is currently in-flight
    if (inFlightRequests.has(cacheKey)) {
        return inFlightRequests.get(cacheKey);
    }

    // 3. Fire new request & track in-flight promise
    const requestPromise = Axios(config)
        .then((response) => {
            apiCache.set(cacheKey, {
                timestamp: Date.now(),
                data: response
            });
            return response;
        })
        .finally(() => {
            inFlightRequests.delete(cacheKey);
        });

    inFlightRequests.set(cacheKey, requestPromise);
    return requestPromise;
};

export default Axios;
