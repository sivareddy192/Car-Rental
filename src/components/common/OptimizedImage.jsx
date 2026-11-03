import React, { useState } from 'react';

/**
 * Transforms Cloudinary and Unsplash URLs to request WebP/AVIF with auto quality and exact width.
 * Cloudinary: https://res.cloudinary.com/demo/image/upload/sample.jpg
 * -> https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,c_limit/sample.jpg
 * Unsplash: https://images.unsplash.com/photo-xxx?auto=format&fit=crop&w=1200&q=80
 * -> https://images.unsplash.com/photo-xxx?auto=format&fit=crop&w=480&q=75
 */
export const getOptimizedImageUrl = (url, width = 800) => {
    if (!url || typeof url !== 'string') return '';

    // Handle Unsplash image resizing & quality
    if (url.includes('images.unsplash.com')) {
        try {
            const u = new URL(url);
            u.searchParams.set('w', width.toString());
            u.searchParams.set('q', '75');
            u.searchParams.set('auto', 'format');
            return u.toString();
        } catch {
            return url.replace(/w=\d+/, `w=${width}`).replace(/q=\d+/, 'q=75');
        }
    }

    if (!url.includes('cloudinary.com') || url.includes('/f_auto,q_auto')) {
        return url;
    }

    try {
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex === -1) return url;

        const before = url.substring(0, uploadIndex + 8);
        const after = url.substring(uploadIndex + 8);

        // Inject f_auto,q_auto,w_${width},c_limit
        return `${before}f_auto,q_auto,w_${width},c_limit/${after}`;
    } catch {
        return url;
    }
};

/**
 * High-performance Optimized Image Component
 * Features:
 *  - Cloudinary auto-format (WebP/AVIF) and quality compression
 *  - Native lazy loading & async decoding
 *  - Shimmer placeholder to eliminate CLS (Cumulative Layout Shift)
 *  - Fallback icon/placeholder on image load error
 */
const OptimizedImage = ({
    src,
    alt = 'DriveRent vehicle',
    className = '',
    width,
    height,
    targetWidth = 800,
    priority = false,
    aspectRatio = 'aspect-[16/10]',
    fallbackText = 'Vehicle Photo',
    ...props
}) => {
    const [loaded, setLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const optimizedSrc = getOptimizedImageUrl(src, targetWidth);

    if (!src || hasError) {
        return (
            <div
                className={`flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 select-none ${aspectRatio} ${className}`}
                style={{ width, height }}
            >
                <svg
                    className="w-8 h-8 mb-1 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <span className="text-[10px] font-semibold tracking-wider uppercase opacity-60">
                    {fallbackText}
                </span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${aspectRatio} ${className}`} style={{ width, height }}>
            {/* Shimmer skeleton while downloading */}
            {!loaded && (
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse z-0" />
            )}

            <img
                src={optimizedSrc}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={priority ? 'high' : 'auto'}
                onLoad={() => setLoaded(true)}
                onError={() => setHasError(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                    loaded ? 'opacity-100' : 'opacity-0'
                }`}
                {...props}
            />
        </div>
    );
};

export default OptimizedImage;

