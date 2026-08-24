import React, { useEffect, useRef } from "react";
import gsap from "gsap";

// 9 Modular Project Items for perfectly balanced ribbon spacing
const DEFAULT_PROJECT_ITEMS = [
  {
    id: "proj-1",
    title: "Aurel Vance",
    category: "Identity System",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=70&w=480&auto=format&fit=crop",
  },
  {
    id: "proj-2",
    title: "Peter Marvin",
    category: "Architect Portfolio",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=70&w=480&auto=format&fit=crop",
  },
  {
    id: "proj-3",
    title: "Stonehaven",
    category: "Creative Direction",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=70&w=480&auto=format&fit=crop",
  },
  {
    id: "proj-4",
    title: "Monolith UI",
    category: "Digital Platform",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=70&w=480&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=70&w=480&auto=format&fit=crop",
  },
  {
    id: "proj-7",
    title: "Maxime Perrolle",
    category: "Editorial Campaign",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=70&w=480&auto=format&fit=crop",
  },
  {
    id: "proj-8",
    title: "Gravipoint",
    category: "DevOps Architecture",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=70&w=480&auto=format&fit=crop",
  },
  {
    id: "proj-9",
    title: "Travel App",
    category: "Mobile Exploration",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=70&w=480&auto=format&fit=crop",
  },
];

// Balanced Ellipse radiuses for wide cinematic horizontal spread
const RADIUS_X = 430;
const RADIUS_Y = 32;

/**
 * Computes a card's staged transform for a given angle (deg).
 * Pure function so both layers (front/back) derive identical numbers from the same angle —
 * no drift, no cross-fade: a card simply changes which DOM layer is allowed to paint it.
 */
function computeCardStage(angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  const isFront = Math.cos(rad) >= 0;

  const x = Math.sin(rad) * RADIUS_X;
  const y = Math.cos(rad) * RADIUS_Y + Math.sin(rad) * 22;

  const depthFactor = (Math.cos(rad) + 1) / 2; // 0 -> 1
  const scale = isFront ? 0.92 + depthFactor * 0.28 : 0.68;

  const rotateY = -Math.sin(rad) * 20;
  const rotateZ = Math.cos(rad) * 6 - 3;

  return { isFront, x, y, scale, rotateY, rotateZ };
}

const HeroFilmStrip = ({ items = DEFAULT_PROJECT_ITEMS, angleRef, layerGroup = "all" }) => {
  const totalItems = items.length;
  const cardRefs = useRef([]);

  useEffect(() => {
    const tick = () => {
      const baseAngle = angleRef.current;
      for (let index = 0; index < totalItems; index += 1) {
        const el = cardRefs.current[index];
        if (!el) continue;

        const itemAngleDeg = (baseAngle + (360 / totalItems) * index) % 360;
        const { isFront, x, y, scale, rotateY, rotateZ } = computeCardStage(itemAngleDeg);

        // Hard cut, no cross-fade: each layer only ever paints its own half of the loop.
        const belongsToLayer =
          layerGroup === "all" || (layerGroup === "front" ? isFront : !isFront);

        if (!belongsToLayer) {
          el.style.display = "none";
          continue;
        }

        el.style.display = "block";
        el.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [angleRef, layerGroup, totalItems]);

  return (
    <div className="relative w-full max-w-7xl h-72 sm:h-96 flex items-center justify-center pointer-events-none perspective-3d">
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={(el) => (cardRefs.current[index] = el)}
          className="absolute pointer-events-auto"
        >
          {/* Full Horizontal Cinema Card (16:9 Aspect Ratio & Larger Scale) */}
          <div className="group relative w-38 sm:w-46 md:w-56 aspect-[16/9] rounded-none bg-zinc-950 border border-white/30 overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:border-white hover:z-[70] cursor-pointer">
            {/* High Contrast Editorial B&W Photo */}
            <img
              src={item.image}
              alt={item.title}
              decoding="async"
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
      ))}
    </div>
  );
};

export default HeroFilmStrip;
