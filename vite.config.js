import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        // Split rarely-changing vendor code from app code so browsers can cache
        // it across deploys instead of re-downloading React/animation libs on every release.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/react(-dom|-router-dom)?/.test(id)) return "react-vendor";
          // Kept separate: HomePage only needs gsap, not the much heavier framer-motion
          // (used by the other, lazy-loaded pages) — bundling them together would
          // force the landing page to pay for both.
          if (id.includes("framer-motion")) return "framer-motion-vendor";
          if (id.includes("gsap")) return "gsap-vendor";
        },
      },
    },
  },
})
