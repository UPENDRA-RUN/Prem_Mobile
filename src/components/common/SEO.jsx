import React, { useEffect } from 'react';

const DEFAULT_ORIGIN = 'https://prem-mobile-kappa.vercel.app';
const DEFAULT_TITLE = 'Prem Mobile | Mobiles & Electronics Store Gwalior';
const DEFAULT_DESC = 'Prem Mobile Gwalior. Buy smartphones, earbuds, smartwatches, power banks & mobile accessories at best prices. Deal Aise Jo Deewana Bana De!';
const DEFAULT_IMAGE = `${DEFAULT_ORIGIN}/images/prem-main.jpg`;
const DEFAULT_KEYWORDS = 'Prem Mobile, Prem Mobile Gwalior, Mobile Shop Pinto Park Gwalior, Buy Smartphones Gwalior, Earbuds Gwalior, boAt Airdopes Gwalior, Smartwatch Gwalior, Mobile Accessories Gwalior';

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  keywords = DEFAULT_KEYWORDS,
  schemaJson = null,
  noindex = false
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
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);

    // 3. Robots Directive Tag
    const robotsDirective = noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    setMetaTag('meta[name="robots"]', 'name', 'robots', robotsDirective);

    // 4. Geo-Targeting Local SEO Tags (Gwalior, MP, India)
    setMetaTag('meta[name="geo.region"]', 'name', 'geo.region', 'IN-MP');
    setMetaTag('meta[name="geo.placename"]', 'name', 'geo.placename', 'Gwalior');
    setMetaTag('meta[name="geo.position"]', 'name', 'geo.position', '26.2183;78.1828');
    setMetaTag('meta[name="ICBM"]', 'name', 'ICBM', '26.2183, 78.1828');

    // 5. Update OpenGraph Tags
    const pageUrl = `${DEFAULT_ORIGIN}${path.startsWith('/') ? path : '/' + path}`;
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', image);

    // 6. Update Twitter Tags
    setMetaTag('meta[property="twitter:url"]', 'property', 'twitter:url', pageUrl);
    setMetaTag('meta[property="twitter:title"]', 'property', 'twitter:title', title);
    setMetaTag('meta[property="twitter:description"]', 'property', 'twitter:description', description);
    if (image) {
      setMetaTag('meta[property="twitter:image"]', 'property', 'twitter:image', image);
    }

    // 7. Update Canonical Link Tag
    let canonicalLink = document.getElementById('canonical-link') || document.querySelector("link[rel='canonical']");
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.id = 'canonical-link';
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', pageUrl);

    // 8. Inject Dynamic JSON-LD Structured Data Schema
    let schemaScript = document.getElementById('dynamic-json-ld');
    if (schemaJson) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'dynamic-json-ld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schemaJson);
    } else if (schemaScript) {
      schemaScript.remove();
    }

    return () => {
      // Clean up dynamic page schema when unmounting if needed
      const script = document.getElementById('dynamic-json-ld');
      if (script && schemaJson) {
        script.remove();
      }
    };
  }, [title, description, path, image, type, keywords, schemaJson, noindex]);

  return null;
}
