import React, { useCallback, useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap, EASE, DUR, prefersReducedMotion } from "../lib/motion";

const NAV_LINKS = [
  { label: "HOME", path: "/" },
  { label: "ABOUT", path: "/about" },
  { label: "EXPLORE PROJECT", path: "/projects" },
  { label: "BLOG", path: "/blog" },
  { label: "START A PROJECT", path: "/contact" },
];

// Legacy staging URLs still resolve to their production counterpart.
const STAGING_ALIASES = {
  "/hero-staging": "/",
  "/about-staging": "/about",
  "/projects-staging": "/projects",
  "/blog-staging": "/blog",
  "/contact-staging": "/contact",
};

const Navbar = () => {
  const { pathname } = useLocation();
  const activePath = STAGING_ALIASES[pathname] || pathname;

  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const linkRefs = useRef({});

  /**
   * Slides a single underline between nav items instead of letting the active
   * state pop in place — the indicator is one continuous object moving through
   * space, which is what makes the nav read as a place rather than five buttons.
   */
  const positionIndicator = useCallback(
    (animate) => {
      const nav = navRef.current;
      const indicator = indicatorRef.current;
      const activeEl = linkRefs.current[activePath];

      if (!nav || !indicator) return;

      // Unknown route (e.g. mid-redirect): hide rather than stranding the bar.
      if (!activeEl) {
        gsap.to(indicator, { opacity: 0, duration: DUR.quick, ease: EASE.exit });
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const linkRect = activeEl.getBoundingClientRect();

      // Measured per render so wrapping onto a second line on mobile still lands
      // the bar under the correct item.
      const target = {
        x: linkRect.left - navRect.left,
        y: linkRect.bottom - navRect.top + 6,
        width: linkRect.width,
        opacity: 1,
      };

      if (animate && !prefersReducedMotion()) {
        gsap.to(indicator, { ...target, duration: DUR.standard, ease: EASE.signature });
      } else {
        gsap.set(indicator, target);
      }
    },
    [activePath]
  );

  // First paint places the bar without animating; later route changes glide.
  const hasPositioned = useRef(false);
  useLayoutEffect(() => {
    positionIndicator(hasPositioned.current);
    hasPositioned.current = true;
  }, [positionIndicator]);

  // Reflow on resize and once webfonts land, since both change link widths.
  useLayoutEffect(() => {
    const reposition = () => positionIndicator(false);
    window.addEventListener("resize", reposition);
    if (document.fonts?.ready) document.fonts.ready.then(reposition);
    return () => window.removeEventListener("resize", reposition);
  }, [positionIndicator]);

  return (
    <header className="w-full py-4 sm:py-6 flex items-center justify-center relative z-40">
      <nav
        ref={navRef}
        aria-label="Main Navigation"
        className="relative flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8"
      >
        {NAV_LINKS.map((link) => {
          const isActive = activePath === link.path;

          return (
            <Link
              key={link.label}
              to={link.path}
              ref={(el) => (linkRefs.current[link.path] = el)}
              aria-current={isActive ? "page" : undefined}
              className={`bracket-cta ${
                isActive ? "text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              [ {link.label} ]
            </Link>
          );
        })}

        <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
      </nav>
    </header>
  );
};

export default Navbar;
