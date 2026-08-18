import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ExternalLink, 
  MapPin,
  Clock,
  Briefcase,
  GraduationCap,
  Star
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import irfanImg from "../img/Irfan.png";
import verifiedImg from "../img/verified.png";
import data from "../data.json";

// Read testimonials directly from data.json for easy editing
const TESTIMONIALS = data.testimonials || [];

const STARRED_PROJECTS = [
  {
    id: "starred-1",
    title: "AISBA School Platform",
    category: "Fullstack Platform",
    image: "https://aisba.sch.id/frontend/assets/image/hero_bg.png",
    link: "https://aisba.sch.id",
  },
  {
    id: "starred-2",
    title: "RWID Design System",
    category: "UI/UX Framework",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600",
    link: "#",
  },
  {
    id: "starred-3",
    title: "Travel App Exploration",
    category: "UI/UX Design",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600",
    link: "https://dribbble.com/nouudesign",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#050608] text-[#f3f2ef] selection:bg-white selection:text-black pt-4 sm:pt-6 pb-0 px-0 relative overflow-hidden font-sans flex flex-col justify-between">
      {/* Background Noise Texture Overlay */}
      <div className="grain-overlay" />

      {/* Atmospheric Charcoal to Black Gradient Background */}
      <div className="fixed inset-0 ethan-charcoal-bg pointer-events-none" />

      {/* Ambient Spotlight */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] portrait-rim-light rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-8 flex-1 flex flex-col justify-between mb-10">
        
        {/* REUSABLE NAVBAR */}
        <Navbar />

        {/* MAIN PROFILE CARD CONTAINER (SHARP 90° CORNERS) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#121316] rounded-none border border-white/[0.12] shadow-2xl overflow-hidden my-auto"
        >
          {/* Header Dark Banner */}
          <div className="h-36 sm:h-44 w-full relative bg-gradient-to-r from-zinc-800/90 via-zinc-900 to-black overflow-hidden border-b border-white/[0.08]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/[0.06] via-transparent to-transparent" />
            <div className="grain-overlay opacity-20" />
          </div>

          {/* Card Body Area */}
          <div className="px-6 sm:px-10 pb-10 relative">
            
            {/* Avatar & Header Action Button Row */}
            <div className="flex items-end justify-between gap-4 -mt-10 sm:-mt-12 mb-6">
              
              {/* Circular Avatar Photo with Pure WHITE Background & Full Color Photo (ROUNDED-FULL) */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white shrink-0">
                  <img
                    src={irfanImg}
                    alt="Muhammad Irfan Fahrurohman"
                    className="w-full h-full object-cover object-top filter grayscale-0 select-none"
                  />
                </div>
              </div>

              {/* View Profile / CV Action Button */}
              <a
                href="https://www.linkedin.com/in/irfanfahrurohmann/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-none text-xs font-mono uppercase tracking-widest text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.15] hover:border-white/40 transition-all active:scale-95 shadow-sm"
              >
                <span>VIEW LINKEDIN PROFILE</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            </div>

            {/* Name, Verified Badge Image & Email */}
            <div className="space-y-1 mb-8">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-[#f3f2ef]">
                  Muhammad Irfan Fahrurohman
                </h1>
                <img 
                  src={verifiedImg} 
                  alt="Verified" 
                  className="w-5 h-5 object-contain inline-block shrink-0" 
                />
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#9a9a96]">
                contact@pann.my.id
              </p>
            </div>

            {/* 4-COLUMN STATS ROW (SHARP HERO EDITORIAL) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-none bg-white/[0.02] border border-white/[0.08] mb-8">
              
              {/* Stat 1: Current Status */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#5c5c5a]">
                  <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[10.5px] font-mono uppercase tracking-wider block">
                    Current Status
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#f3f2ef] block">
                  Undergraduate Student
                </span>
              </div>

              {/* Stat 2: Location / Domisili */}
              <div className="space-y-1 md:border-l border-white/[0.08] md:pl-4">
                <div className="flex items-center gap-1.5 text-[#5c5c5a]">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[10.5px] font-mono uppercase tracking-wider block">
                    Location/Domisili
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#f3f2ef] block">
                  Kuta, Bali
                </span>
              </div>

              {/* Stat 3: Availability */}
              <div className="space-y-1 md:border-l border-white/[0.08] md:pl-4">
                <div className="flex items-center gap-1.5 text-[#5c5c5a]">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[10.5px] font-mono uppercase tracking-wider block">
                    Availability
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>

              {/* Stat 4: Specialization */}
              <div className="space-y-1 md:border-l border-white/[0.08] md:pl-4">
                <div className="flex items-center gap-1.5 text-[#5c5c5a]">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[10.5px] font-mono uppercase tracking-wider block">
                    Specialization
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#f3f2ef] block leading-tight">
                  UI/UX Designer & Linux System Admin
                </span>
              </div>
            </div>

            {/* SECTIONS DIVIDER STACK (GENEROUS PADDING & BREATHING ROOM) */}
            <div className="divide-y divide-white/[0.08]">
              
              {/* SECTION 1: ABOUT ME & SOCIAL CONNECT LINKS */}
              <div className="py-6 sm:py-7 space-y-3">
                <div className="space-y-1">
                  <h2 className="text-sm sm:text-base font-bold font-sans tracking-tight text-[#f3f2ef]">
                    About Me
                  </h2>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#5c5c5a]">
                    A short introduction
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-none bg-white/[0.02] border border-white/[0.08]">
                  <p className="text-xs sm:text-sm text-[#9a9a96] leading-relaxed font-sans font-light">
                    Specialized in UI/UX Designer and passionate about DevOps engineering, focusing on building clean, user-centered interfaces alongside reliable and scalable systems.
                  </p>
                </div>

                {/* Social & Connect Links Row */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <a
                    href="https://www.linkedin.com/in/irfanfahrurohmann/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-[11px] font-mono uppercase tracking-wider text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/30 transition-all active:scale-95 shadow-sm"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>

                  <a
                    href="https://github.com/irfanroman"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-[11px] font-mono uppercase tracking-wider text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/30 transition-all active:scale-95 shadow-sm"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>

                  <a
                    href="https://dribbble.com/nouudesign"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-[11px] font-mono uppercase tracking-wider text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/30 transition-all active:scale-95 shadow-sm"
                  >
                    <span>Dribbble</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>

                  <a
                    href="https://medium.com/@pann.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-[11px] font-mono uppercase tracking-wider text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/30 transition-all active:scale-95 shadow-sm"
                  >
                    <span>Medium</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>
                </div>
              </div>

              {/* SECTION 2: SUPPORT AVAILABILITY (SPACIOUS PADDING & AIRY GAP) */}
              <div className="py-7 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 space-y-1.5">
                  <h2 className="text-sm sm:text-base font-bold font-sans tracking-tight text-[#f3f2ef]">
                    Support Availability
                  </h2>
                  <p className="text-xs text-[#9a9a96] leading-relaxed font-light">
                    Currently online and open for quick questions or collaboration inquiries.
                  </p>
                </div>

                {/* Non-interactive permanent active toggle with generous gap */}
                <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-4 sm:gap-5">
                  <span className="flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-wider text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE
                  </span>

                  <div 
                    aria-label="Support Availability Active"
                    className="relative inline-flex h-7 w-12 shrink-0 cursor-default rounded-full bg-emerald-500 p-0.5 shadow-sm select-none"
                  >
                    <span className="inline-block h-6 w-6 transform rounded-full bg-[#07080a] shadow-md translate-x-5 transition-transform duration-200" />
                  </div>
                </div>
              </div>

              {/* SECTION 3: WORDS FROM CLIENTS / TESTIMONIALS */}
              <div className="py-7 sm:py-8 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-sm sm:text-base font-bold font-sans tracking-tight text-[#f3f2ef]">
                    Words from Clients
                  </h2>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#5c5c5a]">
                    Endorsements & Collaboration Reviews
                  </p>
                </div>

                {/* Testimonial Cards Stack */}
                <div className="space-y-3.5 pt-1">
                  {TESTIMONIALS.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-none bg-white/[0.02] border border-white/[0.08] hover:border-white/25 transition-colors space-y-2.5"
                    >
                      {/* Top Header: Name, Role & 5-Star Rating */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <h3 className="text-xs sm:text-sm font-bold text-white font-sans tracking-tight">
                            {item.name}
                          </h3>
                          {item.role && (
                            <span className="text-[10px] font-mono text-zinc-500 block">
                              {item.role}
                            </span>
                          )}
                        </div>

                        {/* 5-Star Rating Right Aligned */}
                        <div className="flex items-center gap-1 text-amber-400 shrink-0">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Testimonial Quote Content */}
                      <p className="text-xs sm:text-sm text-[#9a9a96] font-sans font-light leading-relaxed">
                        "{item.content}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: STARRED PROJECTS */}
              <div className="pt-7 sm:pt-8 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-sm sm:text-base font-bold font-sans tracking-tight text-[#f3f2ef]">
                    Starred Projects
                  </h2>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#5c5c5a]">
                    A few favorites from recent work
                  </p>
                </div>

                {/* 3-Column Horizontal Sharp Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {STARRED_PROJECTS.map((project) => (
                    <a
                      key={project.id}
                      href={project.link}
                      target={project.link.startsWith("http") ? "_blank" : undefined}
                      rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group relative aspect-[16/10] rounded-none bg-zinc-950 border border-white/20 overflow-hidden shadow-lg hover:border-white/50 transition-all duration-300 block"
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                      
                      <div className="absolute bottom-2 left-2.5 right-2.5 text-left space-y-0.5">
                        <span className="text-[11px] font-sans font-bold tracking-tight text-white block truncate">
                          {project.title}
                        </span>
                        <span className="text-[8.5px] font-mono uppercase tracking-widest text-zinc-400 block truncate">
                          {project.category}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Center-aligned View More Link */}
                <div className="pt-4 text-center">
                  <Link
                    to="/projects"
                    className="bracket-cta text-xs inline-block"
                  >
                    [ View More Projects → ]
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </motion.div>

      </div>

      {/* FULL-WIDTH BOTTOM PINNED FOOTER */}
      <Footer />
    </div>
  );
};

export default AboutPage;
