import React from "react";

const Footer = () => {
  return (
    <footer className="w-full px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zinc-400 gap-3 relative z-30 bg-[#050608]/90 backdrop-blur-md mt-auto shrink-0">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span>TURNING COMPLEXITY INTO CLARITY · UI/UX & DEVOPS</span>
      </div>

      <div className="flex items-center gap-4 text-zinc-500">
        <span>MUHAMMAD IRFAN FAHRUROHMAN</span>
        <span>·</span>
        <span>PORTFOLIO 2026</span>
      </div>
    </footer>
  );
};

export default Footer;
