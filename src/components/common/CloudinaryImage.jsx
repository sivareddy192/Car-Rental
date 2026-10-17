import React from 'react';

const RESPONSIVE_WIDTHS = [320, 640, 960, 1280, 1600];

export const getCloudinaryImageUrl = (src, width) => {
  if (typeof src !== 'string' || !src.includes('res.cloudinary.com/')) return src;

  const uploadMarker = '/image/upload/';
  const uploadIndex = src.indexOf(uploadMarker);
  if (uploadIndex < 0) return src;

  const transform = `f_auto,q_auto:best,c_limit${width ? `,w_${width}` : ''}`;
  return `${src.slice(0, uploadIndex + uploadMarker.length)}${transform}/${src.slice(uploadIndex + uploadMarker.length)}`;
};

export const CloudinaryImage = ({
  src,
  alt,
  sizes = '100vw',
  responsive = true,
  ...imageProps
}) => {
  const isCloudinaryImage = typeof src === 'string' && src.includes('res.cloudinary.com/');
  const srcSet = isCloudinaryImage && responsive
    ? RESPONSIVE_WIDTHS
      .map((width) => `${getCloudinaryImageUrl(src, width)} ${width}w`)
      .join(', ')
    : undefined;

  return (
    <img
      {...imageProps}
      src={getCloudinaryImageUrl(src)}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      decoding="async"
      fetchpriority={imageProps.loading === 'eager' ? 'high' : 'auto'}
    />
  );
};
