import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { label: "HOME", path: "/" },
    { label: "ABOUT", path: "/about" },
    { label: "EXPLORE PROJECT", path: "/projects" },
    { label: "BLOG", path: "/blog" },
    { label: "START A PROJECT", path: "/contact" },
  ];

  return (
    <header className="w-full py-4 sm:py-6 flex items-center justify-center relative z-40">
      <nav 
        aria-label="Main Navigation"
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8"
      >
        {navLinks.map((link) => {
          const isActive = 
            currentPath === link.path || 
            (link.path === "/" && (currentPath === "/hero-staging" || currentPath === "/")) ||
            (link.path === "/about" && currentPath === "/about-staging") ||
            (link.path === "/projects" && currentPath === "/projects-staging") ||
            (link.path === "/blog" && currentPath === "/blog-staging") ||
            (link.path === "/contact" && currentPath === "/contact-staging");

          return (
            <Link
              key={link.label}
              to={link.path}
              className={`bracket-cta transition-all ${
                isActive 
                  ? "text-white font-bold border-white/60 drop-shadow-sm scale-105" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              [ {link.label} ]
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;
