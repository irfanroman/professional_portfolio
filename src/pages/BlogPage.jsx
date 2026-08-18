import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  Clock, 
  BookOpen, 
  Search, 
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Helper functions for Medium RSS parsing
const stripHtml = (html) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const getReadTime = (text) => {
  if (!text) return "4 min read";
  const words = text.split(/\s+/).length;
  const minutes = Math.max(2, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const formatDateBadge = (dateString) => {
  if (!dateString) return { day: "10", month: "APR", year: "2026" };
  const d = new Date(dateString);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const day = d.getDate().toString().padStart(2, "0");
  const month = months[d.getMonth()] || "APR";
  const year = d.getFullYear().toString() || "2026";
  return { day, month, year };
};

// Curated fallback articles from Medium (@pann.tech) - 8 articles for multi-page pagination
const FALLBACK_ARTICLES = [
  {
    id: "art-1",
    title: "Building Micro-Frontend Architecture with Vite Module Federation",
    excerpt: "A deep architectural deep dive into breaking down enterprise monoliths into resilient, independently deployable micro-frontends with lightning-fast builds.",
    link: "https://medium.com/@pann.tech",
    pubDate: "2025-11-20",
    readTime: "6 min read",
  },
  {
    id: "art-2",
    title: "Zero-Downtime Multi-Cluster Deployment Using Docker & Automated Pipelines",
    excerpt: "How we eliminated deployment lag and achieved 99.99% uptime across production clusters using automated rollback strategies and Docker Swarm orchestration.",
    link: "https://medium.com/@pann.tech",
    pubDate: "2025-10-14",
    readTime: "8 min read",
  },
  {
    id: "art-3",
    title: "Atomic Design Tokens: Scaling Design Systems for High-Velocity Product Teams",
    excerpt: "Structuring tokens from primitives to semantic variables that empower designers in Figma and engineers in Tailwind without cognitive friction.",
    link: "https://medium.com/@pann.tech",
    pubDate: "2025-09-02",
    readTime: "5 min read",
  },
  {
    id: "art-4",
    title: "Server Hardening & Security Best Practices for Linux Web Servers in 2025",
    excerpt: "Essential checklists for securing production Linux environments: SSH key isolation, UFW firewall matrix, fail2ban rule configuration, and telemetry alerts.",
    link: "https://medium.com/@pann.tech",
    pubDate: "2025-08-18",
    readTime: "7 min read",
  },
  {
    id: "art-5",
    title: "Modern UI/UX Spatial Curation: Crafting Editorial Interfaces that Convert",
    excerpt: "Why high-contrast editorial typography, deliberate negative space, and monochromatic restraint outperform noisy color palettes in modern software branding.",
    link: "https://medium.com/@pann.tech",
    pubDate: "2025-07-28",
    readTime: "4 min read",
  },
  {
    id: "art-6",
    title: "Optimizing Web Performance: Achieving 100 Lighthouse Score with Next.js",
    excerpt: "Detailed breakdown of font subsetting, dynamic image optimization, bundle tree-shaking, and server-component data streaming.",
    link: "https://medium.com/@pann.tech",
    pubDate: "2025-06-12",
    readTime: "5 min read",
  },
  {
    id: "art-7",
    title: "Designing Accessible Dark Themes: Contrast Ratios and Visual Fatigue",
    excerpt: "A study on WCAG AAA compliance in dark-mode interfaces, choosing the right deep charcoal surface values instead of pure harsh pitch black.",
    link: "https://medium.com/@pann.tech",
    pubDate: "2025-05-04",
    readTime: "6 min read",
  },
  {
    id: "art-8",
    title: "DevOps for Solopreneurs: Automating Everything from CI to DNS with Cloudflare",
    excerpt: "Setting up a bulletproof self-healing web stack with Git push deployments, edge caching, and server monitoring on a budget.",
    link: "https://medium.com/@pann.tech",
    pubDate: "2025-04-10",
    readTime: "7 min read",
  },
];

const ITEMS_PER_PAGE = 5;

const ArticleListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((n) => (
      <div key={n} className="p-6 bg-[#121316] border border-white/[0.08] flex items-center justify-between gap-6 animate-pulse">
        <div className="w-16 h-16 bg-white/[0.05] shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-white/[0.08] w-3/4" />
          <div className="h-3 bg-white/[0.04] w-full" />
        </div>
        <div className="w-28 h-9 bg-white/[0.05] shrink-0" />
      </div>
    ))}
  </div>
);

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch real articles from Medium RSS feed with resilient fallback
  useEffect(() => {
    let isMounted = true;

    const fetchMediumArticles = async () => {
      try {
        const response = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@pann.tech"
        );
        const data = await response.json();

        if (isMounted) {
          if (data && data.status === "ok" && data.items && data.items.length > 0) {
            const parsed = data.items.map((item, idx) => {
              const plainText = stripHtml(item.description || item.content || "");
              return {
                id: item.guid || `feed-${idx}`,
                title: item.title || "Untitled Insight",
                link: item.link || "https://medium.com/@pann.tech",
                pubDate: item.pubDate || new Date().toISOString(),
                excerpt: plainText.slice(0, 180).trim() + "...",
                readTime: getReadTime(plainText),
              };
            });
            setArticles(parsed);
          } else {
            setArticles(FALLBACK_ARTICLES);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setArticles(FALLBACK_ARTICLES);
          setLoading(false);
        }
      }
    };

    fetchMediumArticles();
    return () => { isMounted = false; };
  }, []);

  // Filter articles based on real-time search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const query = searchQuery.toLowerCase();
    return articles.filter((art) => 
      art.title.toLowerCase().includes(query) ||
      art.excerpt.toLowerCase().includes(query)
    );
  }, [articles, searchQuery]);

  // Reset to page 1 whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Compute pagination slices (5 items per page)
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  return (
    <div className="min-h-screen bg-[#050608] text-[#f3f2ef] selection:bg-white selection:text-black pt-4 sm:pt-6 pb-0 px-0 relative overflow-hidden font-sans flex flex-col justify-between">
      {/* Background Noise Texture Overlay */}
      <div className="grain-overlay" />

      {/* Atmospheric Charcoal to Black Gradient Background */}
      <div className="fixed inset-0 ethan-charcoal-bg pointer-events-none" />

      {/* Ambient Spotlight */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] portrait-rim-light rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-8 flex-1 flex flex-col justify-between mb-12">
        
        {/* REUSABLE NAVBAR */}
        <Navbar />

        {/* SEARCH BAR (MATCHING CARD WIDTH) & MEDIUM LINK */}
        <div className="space-y-4 w-full pt-1">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-4 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title or keyword..."
              className="w-full pl-11 pr-10 py-3.5 bg-[#121316] border border-white/[0.12] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all font-sans shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Medium Profile Direct Link (Below Search, Above Shows Count) */}
          <div className="flex items-center justify-center pt-0.5">
            <a
              href="https://medium.com/@pann.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="bracket-cta text-xs inline-flex items-center gap-1.5"
            >
              <span>[ Visit Medium Profile @pann.tech ↗ ]</span>
            </a>
          </div>

          {/* Centered Results Count Meta */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-[11px] font-mono uppercase tracking-widest text-zinc-500 pt-0.5 px-1">
            <span>SHOWING {filteredArticles.length} OF {articles.length} ARTICLES · PAGE {currentPage} OF {totalPages}</span>
            {searchQuery && (
              <span className="text-zinc-400">· Filter: "{searchQuery}"</span>
            )}
          </div>
        </div>

        {/* VERTICAL LIST OF HORIZONTAL CARDS */}
        <div className="w-full space-y-6">
          {loading ? (
            <ArticleListSkeleton />
          ) : (
            <AnimatePresence mode="popLayout">
              {paginatedArticles.length > 0 ? (
                <div className="space-y-4">
                  {paginatedArticles.map((article, index) => {
                    const dateBadge = formatDateBadge(article.pubDate);

                    return (
                      <motion.article
                        key={article.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative bg-[#121316] border border-white/[0.08] hover:border-white/30 transition-all duration-300 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6"
                      >
                        {/* LEFT: SQUARE DATE BADGE (ONLY CREATED/PUBLISHED DATE) */}
                        <div className="flex sm:flex-col items-center justify-center bg-white/[0.03] border border-white/[0.08] group-hover:border-white/20 transition-colors py-2.5 px-3 sm:px-4 sm:w-20 sm:h-20 shrink-0 text-center gap-1 sm:gap-0">
                          <span className="text-base sm:text-lg font-sans font-black text-white tracking-tight leading-none block">
                            {dateBadge.day}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-300 font-bold block mt-1">
                            {dateBadge.month}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500 block">
                            {dateBadge.year}
                          </span>
                        </div>

                        {/* CENTER: ARTICLE TITLE & 2-LINE EXCERPT */}
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center gap-3 text-[10.5px] font-mono uppercase tracking-widest text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-zinc-500" />
                              {article.readTime}
                            </span>
                            <span>·</span>
                            <span className="text-zinc-500">Medium</span>
                          </div>

                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group/title"
                          >
                            <h2 className="text-base sm:text-lg font-sans font-bold text-white tracking-tight group-hover/title:text-zinc-200 transition-colors leading-snug">
                              {article.title}
                            </h2>
                          </a>

                          <p className="text-xs sm:text-sm text-zinc-400 font-sans font-light leading-relaxed line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>

                        {/* RIGHT: ACTION BUTTON (GHOST -> SOLID WHITE ON HOVER) */}
                        <div className="shrink-0 pt-2 sm:pt-0">
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-none text-xs font-mono uppercase tracking-wider text-white bg-transparent border border-white/20 hover:bg-white hover:text-black hover:border-white font-semibold transition-all duration-200 shadow-md active:scale-95 group/btn"
                          >
                            <span>Read Full on Medium</span>
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </a>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              ) : (
                /* Empty state */
                <div className="py-16 text-center space-y-3 bg-[#121316] border border-white/[0.08] p-8">
                  <BookOpen className="w-8 h-8 text-zinc-500 mx-auto" />
                  <h3 className="text-base font-bold text-white">No articles found</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    No articles matching "{searchQuery}". Try searching with different keywords.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-4 py-2 bg-white text-black text-xs font-mono uppercase tracking-wider font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </AnimatePresence>
          )}

          {/* PAGINATION CONTROLS (5 ARTICLES PER PAGE) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider bg-[#121316] border border-white/[0.12] text-zinc-300 hover:text-white hover:border-white/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>PREV</span>
              </button>
              
              {/* Page Number Buttons */}
              <div className="flex items-center gap-1.5 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 text-xs font-mono transition-all flex items-center justify-center cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-white text-black font-bold border border-white shadow-md scale-105"
                        : "bg-[#121316] text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/25"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider bg-[#121316] border border-white/[0.12] text-zinc-300 hover:text-white hover:border-white/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <span>NEXT</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* FULL-WIDTH BOTTOM PINNED FOOTER */}
      <Footer />
    </div>
  );
};

export default BlogPage;
