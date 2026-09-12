import React, { useEffect } from 'react';

const DEFAULT_ORIGIN = 'https://prem-mobile-kappa.vercel.app';
const DEFAULT_TITLE = 'Prem Mobile | Mobiles & Electronics Store Gwalior';
const DEFAULT_DESC = 'Prem Mobile Gwalior. Buy smartphones, earbuds, smartwatches, power banks & mobile accessories at best prices. Deal Aise Jo Deewana Bana De!';
const DEFAULT_IMAGE = `${DEFAULT_ORIGIN}/images/prem-main.jpg`;

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website'
}) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper function to set or create meta tag
    const setMetaTag = (selector, attrName, attrValue, contentValue) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // 2. Update Primary Meta Tags
    setMetaTag('meta[name="title"]', 'name', 'title', title);
    setMetaTag('meta[name="description"]', 'name', 'description', description);

    // 3. Update OpenGraph Tags
    const pageUrl = `${DEFAULT_ORIGIN}${path.startsWith('/') ? path : '/' + path}`;
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', image);

    // 4. Update Twitter Tags
    setMetaTag('meta[property="twitter:url"]', 'property', 'twitter:url', pageUrl);
    setMetaTag('meta[property="twitter:title"]', 'property', 'twitter:title', title);
    setMetaTag('meta[property="twitter:description"]', 'property', 'twitter:description', description);
    if (image) {
      setMetaTag('meta[property="twitter:image"]', 'property', 'twitter:image', image);
    }

    // 5. Update Canonical Link Tag
    let canonicalLink = document.getElementById('canonical-link') || document.querySelector("link[rel='canonical']");
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.id = 'canonical-link';
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', pageUrl);
  }, [title, description, path, image, type]);

  return null;
}
