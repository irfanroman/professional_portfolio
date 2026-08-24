import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroFilmStrip from "../components/HeroFilmStrip";
import irfanImg from "../img/Irfan.png";
import irfanImgWebp from "../img/Irfan.webp";

const FILM_STRIP_SPEED = 0.2; // degrees per tick

const HomePage = () => {
  // Single shared rotation angle driven straight off GSAP's ticker (not React state),
  // so the back/front thumbnail layers read the exact same value every frame with
  // zero re-render overhead — that's what keeps the loop buttery instead of steppy.
  const angleRef = useRef(0);

  useEffect(() => {
    const tick = () => {
      angleRef.current = (angleRef.current + FILM_STRIP_SPEED) % 360;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div className="min-h-screen bg-[#050608] text-white selection:bg-white selection:text-black overflow-hidden relative font-sans flex flex-col justify-between pt-0 pb-0 px-0">
      {/* Background Noise Texture Overlay */}
      <div className="grain-overlay" />

      {/* Atmospheric Radial Charcoal Background */}
      <div className="fixed inset-0 ethan-charcoal-bg pointer-events-none" />

      {/* Rim Light Backdrop Spotlight */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 w-[800px] h-[800px] portrait-rim-light rounded-full pointer-events-none blur-3xl" />

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between pt-4 sm:pt-6">
        
        {/* HERO MAIN STAGE SECTION */}
        <main className="flex-1 flex flex-col items-center justify-between text-center relative pt-2 space-y-4">
          
          {/* Headline & Modular Bracket Navbar */}
          <div className="animate-fade-up-in space-y-3 max-w-5xl mx-auto z-10 w-full">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-black tracking-tighter uppercase leading-[0.95] text-zinc-100">
              MUHAMMAD IRFAN <br />
              <span className="font-serif italic font-normal text-zinc-400">FAHRUROHMAN.</span>
            </h1>

            {/* Modular Bracket Navbar with active detection */}
            <Navbar />
          </div>

          {/* CENTER STAGE PORTRAIT & EXPLICIT 3-LAYER STACKING (TOUCHING FOOTER) */}
          <div className="animate-fade-scale-in relative w-full max-w-5xl flex items-end justify-center mt-auto">
            {/* LAYER 1 (GRUP B): BACK THUMBNAILS - Z-INDEX 10 (BELOW PHOTO) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 mb-12 sm:mb-16">
              <HeroFilmStrip layerGroup="back" angleRef={angleRef} />
            </div>

            {/* LAYER 2: ENLARGED SOLID PORTRAIT PHOTO - Z-INDEX 20 (TOUCHING FOOTER LINE) */}
            <div className="relative z-20 w-80 sm:w-[460px] md:w-[560px] lg:w-[680px] flex items-end justify-center pointer-events-none -mb-1">
              <picture>
                <source srcSet={irfanImgWebp} type="image/webp" />
                <img
                  src={irfanImg}
                  alt="Muhammad Irfan Fahrurohman"
                  width={1360}
                  height={1361}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-auto object-cover object-top filter grayscale contrast-125 select-none"
                />
              </picture>
            </div>

            {/* LAYER 3 (GRUP A): FRONT THUMBNAILS - Z-INDEX 30 (ABOVE PHOTO) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 mb-12 sm:mb-16">
              <HeroFilmStrip layerGroup="front" angleRef={angleRef} />
            </div>
          </div>

        </main>

      </div>

      {/* FULL-WIDTH BOTTOM PINNED FOOTER */}
      <Footer />
    </div>
  );
};

export default HomePage;
