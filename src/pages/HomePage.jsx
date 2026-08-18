import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroFilmStrip from "../components/HeroFilmStrip";
import irfanImg from "../img/Irfan.png";

const HomePage = () => {
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 max-w-5xl mx-auto z-10 w-full"
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-black tracking-tighter uppercase leading-[0.95] text-zinc-100">
              MUHAMMAD IRFAN <br />
              <span className="font-serif italic font-normal text-zinc-400">FAHRUROHMAN.</span>
            </h1>

            {/* Modular Bracket Navbar with active detection */}
            <Navbar />
          </motion.div>

          {/* CENTER STAGE PORTRAIT & EXPLICIT 3-LAYER STACKING (TOUCHING FOOTER) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl flex items-end justify-center mt-auto"
          >
            {/* LAYER 1 (GRUP B): BACK THUMBNAILS - Z-INDEX 10 (BELOW PHOTO) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 mb-12 sm:mb-16">
              <HeroFilmStrip layerGroup="back" />
            </div>

            {/* LAYER 2: ENLARGED SOLID PORTRAIT PHOTO - Z-INDEX 20 (TOUCHING FOOTER LINE) */}
            <div className="relative z-20 w-80 sm:w-[460px] md:w-[560px] lg:w-[680px] flex items-end justify-center pointer-events-none -mb-1">
              <img
                src={irfanImg}
                alt="Muhammad Irfan Fahrurohman"
                className="w-full h-auto object-cover object-top filter grayscale contrast-125 select-none"
              />
            </div>

            {/* LAYER 3 (GRUP A): FRONT THUMBNAILS - Z-INDEX 30 (ABOVE PHOTO) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 mb-12 sm:mb-16">
              <HeroFilmStrip layerGroup="front" />
            </div>
          </motion.div>

        </main>

      </div>

      {/* FULL-WIDTH BOTTOM PINNED FOOTER */}
      <Footer />
    </div>
  );
};

export default HomePage;
