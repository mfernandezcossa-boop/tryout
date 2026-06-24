import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    fbq: (action: string, eventName: string, params?: Record<string, unknown>) => void;
    gtag: (command: string, targetId: string | Date, config?: Record<string, unknown>) => void;
    _uxa: Array<[string, string]>;
  }
}

export const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Don't track on auth or admin pages
    if (location.pathname.startsWith('/auth') || location.pathname.startsWith('/admin')) {
      return;
    }

    // Track Meta Pixel PageView
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }

    // Track Google Analytics page_view
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      });
    }

    // Track Contentsquare pageview
    if (window._uxa && Array.isArray(window._uxa)) {
      window._uxa.push(["trackPageview", location.pathname + location.search]);
    }
  }, [location.pathname]);

  return null;
};
