import React, { useEffect, useState } from "react";

// 9 Modular Project Items for perfectly balanced ribbon spacing
const DEFAULT_PROJECT_ITEMS = [
  {
    id: "proj-1",
    title: "Aurel Vance",
    category: "Identity System",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
  },
  {
    id: "proj-2",
    title: "Peter Marvin",
    category: "Architect Portfolio",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600",
  },
  {
    id: "proj-3",
    title: "Stonehaven",
    category: "Creative Direction",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600",
  },
  {
    id: "proj-4",
    title: "Monolith UI",
    category: "Digital Platform",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600",
  },
  {
    id: "proj-5",
    title: "AISBA School",
    category: "Fullstack Platform",
    image: "https://aisba.sch.id/frontend/assets/image/hero_bg.png",
  },
  {
    id: "proj-6",
    title: "RWID System",
    category: "UI/UX Framework",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600",
  },
  {
    id: "proj-7",
    title: "Maxime Perrolle",
    category: "Editorial Campaign",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600",
  },
  {
    id: "proj-8",
    title: "Gravipoint",
    category: "DevOps Architecture",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600",
  },
  {
    id: "proj-9",
    title: "Travel App",
    category: "Mobile Exploration",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600",
  },
];

const HeroFilmStrip = ({ items = DEFAULT_PROJECT_ITEMS, speed = 0.2, layerGroup = "all" }) => {
  const [angle, setAngle] = useState(0);

  // Smooth continuous rotation animation
  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      setAngle((prev) => (prev + speed) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [speed]);

  const totalItems = items.length;

  return (
    <div className="relative w-full max-w-7xl h-72 sm:h-96 flex items-center justify-center pointer-events-none perspective-3d">
      {items.map((item, index) => {
        // Calculate angle for this item in radians
        const itemAngleDeg = (angle + (360 / totalItems) * index) % 360;
        const itemAngleRad = (itemAngleDeg * Math.PI) / 180;

        // Binary FRONT vs BACK classification
        const isFront = Math.cos(itemAngleRad) >= 0;

        // Filter strictly by layerGroup prop:
        if (layerGroup === "front" && !isFront) return null;
        if (layerGroup === "back" && isFront) return null;

        // Balanced Ellipse radiuses for wide cinematic horizontal spread
        const radiusX = 430; // Wide horizontal spread
        const radiusY = 32;  // Shallow vertical orbit

        // Diagonal downward tilt matching reference Image 2
        const x = Math.sin(itemAngleRad) * radiusX;
        const y = Math.cos(itemAngleRad) * radiusY + Math.sin(itemAngleRad) * 22;

        const depthFactor = (Math.cos(itemAngleRad) + 1) / 2; // 0 to 1
        const scale = isFront ? 0.92 + depthFactor * 0.28 : 0.68;

        // 3D Perspective Rotation along the curved ribbon
        const rotateY = -Math.sin(itemAngleRad) * 20;
        const rotateZ = Math.cos(itemAngleRad) * 6 - 3;

        // Binary 100% full opacity
        let computedOpacity = 1.0;

        // Soft fade out only at the extreme edges
        const fadeStart = 350;
        const maxEdge = 440;
        if (Math.abs(x) > fadeStart) {
          const edgeRatio = 1 - (Math.abs(x) - fadeStart) / (maxEdge - fadeStart);
          computedOpacity = Math.max(0, edgeRatio);
        }

        return (
          <div
            key={item.id}
            className="absolute transition-transform duration-75 ease-linear pointer-events-auto"
            style={{
              transform: `translate3d(${x}px, ${y}px, 0px) scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
              opacity: computedOpacity,
              visibility: computedOpacity <= 0.01 ? "hidden" : "visible",
            }}
          >
            {/* Full Horizontal Cinema Card (16:9 Aspect Ratio & Larger Scale) */}
            <div className="group relative w-38 sm:w-46 md:w-56 aspect-[16/9] rounded-none bg-zinc-950 border border-white/30 overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:border-white hover:z-[70] cursor-pointer">
              {/* High Contrast Editorial B&W Photo */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
              />

              {/* Editorial bottom overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Sharp Typography & Label */}
              <div className="absolute bottom-2 left-2.5 right-2.5 text-left space-y-0.5">
                <span className="text-[11px] sm:text-xs md:text-[13px] font-sans font-bold tracking-tight text-white block truncate">
                  {item.title}
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-zinc-400 block truncate">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeroFilmStrip;
