import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEOHead = ({
  title = 'Car Rental',
  description = 'Experience the finest luxury car rentals, chauffeur-driven VIP services, wedding cars, self-drive exotics, and bespoke tour packages with Car Rental.',
  canonicalUrl = 'https://royaldrives.com',
  ogImage = 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
