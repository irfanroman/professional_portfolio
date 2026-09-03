import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Route-level enter transition.
 *
 * Keyed on pathname so the CSS animation replays on every navigation. This is a
 * CSS animation rather than a framer-motion `AnimatePresence` on purpose: the
 * landing page deliberately does not ship framer-motion, and wrapping the router
 * in it would pull ~43KB gzip back into the critical path for every visitor.
 */
export const PageTransition = ({ children }) => {
  const location = useLocation();

  // React Router preserves scroll position across navigations, so leaving the
  // bottom of a long page and landing mid-way down the next one is the default.
  // Reset before the new route paints.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="route-enter">
      {children}
    </div>
  );
};

/**
 * Suspense fallback for lazily-loaded routes.
 *
 * Renders nothing for the first 180ms (see `.route-fallback` in index.css) so a
 * fast chunk load never flashes a spinner, while a genuinely slow one still gets
 * acknowledged instead of showing a blank screen.
 */
export const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#050608]">
    <div className="route-fallback flex items-center gap-2.5 text-[10.5px] font-mono uppercase tracking-widest text-zinc-500">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
      <span>Loading</span>
    </div>
  </div>
);

export default PageTransition;
