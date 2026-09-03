import React, { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";

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

// Ellipse radii for the ring. X is wide and Z (depth) is deep enough that CSS
// perspective produces the size falloff on its own — no hand-authored scale.
const RADIUS_X = 430;
const RADIUS_Z = 340;

// Vertical radius — the camera looking slightly DOWN on the ring. This is what
// makes the orbit trace a visible oval instead of a straight line: near cards
// ride low, far cards ride high, and the path curves between them.
//
// It is symmetric (driven by cos), which is what separates it from a diagonal
// tilt: a `sin` term would drop one side and lift the other, reading as a
// slanted strip. This one reads as a ring.
const RADIUS_Y = 80;

/**
 * Computes a card's transform for a given angle on the ring.
 *
 * The card is TANGENT to the ring rather than always facing the camera: rotateY
 * tracks the orbit angle, so a card goes edge-on at the sides and turns its back
 * to the viewer behind the portrait. Because backface-visibility stays visible,
 * that back face renders the artwork mirrored — the "flipped as it passes
 * behind" look from the reference.
 *
 * Pure function so both layers (front/back) derive identical numbers from the
 * same angle — no drift, no cross-fade.
 */
function computeCardStage(angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);

  const isFront = cos >= 0;

  const x = sin * RADIUS_X;
  const y = cos * RADIUS_Y; // symmetric arc — the ring seen from slightly above
  const z = cos * RADIUS_Z;

  // Facing outward from the ring centre. At 0deg it faces the camera, at 90deg
  // it is edge-on, at 180deg we see its mirrored reverse.
  const rotateY = angleDeg;
  const rotateZ = 0; // cards stay level; no roll

  return { isFront, x, y, z, rotateY, rotateZ };
}

// Magnetic hover tuning. Kept restrained on purpose — the Premium archetype
// reads as "controlled", so the pull is a hint of attraction, not a grab.
const MAGNET_RADIUS = 200; // px from the cursor at which attraction starts
const MAGNET_STRENGTH = 0.22; // fraction of the gap the card closes at full pull
const MAGNET_EASING = 0.12; // per-frame lerp — smooths the cursor into the motion

const HeroFilmStrip = ({ items = DEFAULT_PROJECT_ITEMS, angleRef, layerGroup = "all" }) => {
  const totalItems = items.length;
  const cardRefs = useRef([]);
  const stageRef = useRef(null);
  const pointerRef = useRef(null);
  const stageRectRef = useRef(null);
  // Per-card smoothed magnetic offset, so cards ease toward the cursor and
  // ease back on their own rather than snapping between frames.
  const magnetRef = useRef([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduced = prefersReducedMotion();

    const measure = () => {
      stageRectRef.current = stage.getBoundingClientRect();
    };
    measure();

    const applyLayout = () => {
      const baseAngle = angleRef.current;
      const rect = stageRectRef.current;
      const pointer = pointerRef.current;

      for (let index = 0; index < totalItems; index += 1) {
        const el = cardRefs.current[index];
        if (!el) continue;

        const itemAngleDeg = (baseAngle + (360 / totalItems) * index) % 360;
        const { isFront, x, y, z, rotateY, rotateZ } = computeCardStage(itemAngleDeg);

        // Hard cut, no cross-fade: each layer only ever paints its own half of the loop.
        const belongsToLayer =
          layerGroup === "all" || (layerGroup === "front" ? isFront : !isFront);

        if (!belongsToLayer) {
          el.style.display = "none";
          continue;
        }

        // Magnetic attraction toward the cursor, layered on top of the orbit.
        let targetMagX = 0;
        let targetMagY = 0;
        if (pointer && rect) {
          // Card coordinates are relative to the stage centre, so put the
          // pointer in that same space before measuring the gap.
          const pointerX = pointer.x - (rect.left + rect.width / 2);
          const pointerY = pointer.y - (rect.top + rect.height / 2);
          const gapX = pointerX - x;
          const gapY = pointerY - y;
          const distance = Math.hypot(gapX, gapY);

          if (distance < MAGNET_RADIUS) {
            const pull = (1 - distance / MAGNET_RADIUS) * MAGNET_STRENGTH;
            targetMagX = gapX * pull;
            targetMagY = gapY * pull;
          }
        }

        const current = magnetRef.current[index] || (magnetRef.current[index] = { x: 0, y: 0 });
        current.x += (targetMagX - current.x) * MAGNET_EASING;
        current.y += (targetMagY - current.y) * MAGNET_EASING;

        el.style.display = "block";
        // Real depth on the Z axis: the container's `perspective` derives the
        // size falloff, so there is no hand-tuned scale term to pop at the
        // front/back boundary.
        el.style.transform =
          `translate3d(${x + current.x}px, ${y + current.y}px, ${z}px) ` +
          `rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
      }
    };

    window.addEventListener("resize", measure);

    // Reduced motion: lay the ribbon out once, statically, and never animate it.
    // A continuously orbiting carousel is exactly the kind of ambient motion this
    // preference exists to suppress.
    if (reduced) {
      applyLayout();
      return () => window.removeEventListener("resize", measure);
    }

    const handlePointerMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };
    const handlePointerLeave = () => {
      pointerRef.current = null;
    };

    // Coarse pointers (touch) get no magnetic effect — there is no hover state
    // to express, and tracking taps would just make cards jump under the finger.
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (isFinePointer) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      document.addEventListener("pointerleave", handlePointerLeave);
    }

    gsap.ticker.add(applyLayout);

    return () => {
      gsap.ticker.remove(applyLayout);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [angleRef, layerGroup, totalItems]);

  return (
    <div
      ref={stageRef}
      className="relative w-full max-w-7xl h-72 sm:h-96 flex items-center justify-center pointer-events-none perspective-3d"
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={(el) => (cardRefs.current[index] = el)}
          className="absolute pointer-events-auto"
          style={{ willChange: "transform" }}
        >
          {/* Full Horizontal Cinema Card (16:9 Aspect Ratio & Larger Scale) */}
          <div className="group relative w-38 sm:w-46 md:w-56 aspect-[16/9] rounded-none bg-zinc-950 border border-white/30 overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:border-white hover:z-[70] cursor-pointer">
            {/* High Contrast Editorial B&W Photo — returns to full colour on hover */}
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
