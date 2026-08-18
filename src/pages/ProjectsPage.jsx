import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Heart, 
  Bookmark, 
  ArrowUpRight, 
  X, 
  Layers 
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import data from "../data.json";

// Read projects directly from data.json so adding/editing projects in data.json updates here automatically!
const ALL_PROJECTS = data.projects_staging || data.projects || [];

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  
  // Dynamically compute unique category filter tabs from data.json projects
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(ALL_PROJECTS.map((p) => p.category).filter(Boolean)));
    return ["ALL", ...uniqueCats];
  }, []);

  // Track user like states and counts per project
  const [likesState, setLikesState] = useState(() => {
    const initial = {};
    ALL_PROJECTS.forEach((p) => {
      initial[p.id] = { count: p.initialLikes || 0, isLiked: false };
    });
    return initial;
  });

  // Track user saved/bookmarked states
  const [savedState, setSavedState] = useState({});

  const handleToggleLike = (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    setLikesState((prev) => {
      const current = prev[projectId] || { count: 0, isLiked: false };
      const isLiked = !current.isLiked;
      const count = isLiked ? current.count + 1 : current.count - 1;
      return { ...prev, [projectId]: { count, isLiked } };
    });
  };

  const handleToggleSave = (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedState((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  // Filter projects based on search query and category
  const filteredProjects = useMemo(() => {
    return ALL_PROJECTS.filter((project) => {
      const matchesCategory =
        selectedCategory === "ALL" ||
        (project.category && project.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchesSearch =
        searchQuery.trim() === "" ||
        (project.title && project.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (project.category && project.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (project.tags && project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#050608] text-[#f3f2ef] selection:bg-white selection:text-black pt-4 sm:pt-6 pb-0 px-0 relative overflow-hidden font-sans flex flex-col justify-between">
      {/* Background Noise Texture Overlay */}
      <div className="grain-overlay" />

      {/* Atmospheric Charcoal to Black Gradient Background */}
      <div className="fixed inset-0 ethan-charcoal-bg pointer-events-none" />

      {/* Ambient Spotlight */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] portrait-rim-light rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-8 flex-1 flex flex-col justify-between mb-10">
        
        {/* REUSABLE NAVBAR */}
        <Navbar />

        {/* SEARCH BAR & CATEGORY FILTERS */}
        <div className="space-y-4 max-w-4xl mx-auto w-full pt-2">
          
          {/* Search Input Pill */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, tech stack, or category..."
              className="w-full pl-11 pr-10 py-3.5 bg-[#121316] border border-white/[0.12] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-all font-sans shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 p-1 text-zinc-400 hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-black font-bold border border-white shadow-md scale-105"
                      : "bg-[#121316] text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/25"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Centered Results Count Meta */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-[11px] font-mono uppercase tracking-widest text-zinc-500 pt-2 px-1">
            <span>SHOWING {filteredProjects.length} OF {ALL_PROJECTS.length} PROJECTS</span>
            {searchQuery && (
              <span className="text-zinc-400">· Filter: "{searchQuery}"</span>
            )}
          </div>
        </div>

        {/* HORIZONTAL PROJECT CARDS GRID (2-COLUMN / 1-COLUMN RESPONSIVE) */}
        <div className="w-full">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredProjects.map((project) => {
                  const likeInfo = likesState[project.id] || { count: project.initialLikes || 0, isLiked: false };
                  const isSaved = !!savedState[project.id];

                  return (
                    <motion.div
                      layout
                      key={project.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="group bg-[#121316] border border-white/[0.08] hover:border-white/30 transition-all duration-300 overflow-hidden shadow-xl flex flex-col justify-between"
                    >
                      {/* TOP: LANDSCAPE THUMBNAIL (SLEEK WIDESCREEN COMPACT HEIGHT) */}
                      <div className="relative aspect-[30/10] w-full overflow-hidden bg-zinc-950 border-b border-white/[0.06]">
                        {/* High Contrast Desaturated Image with Hover Transformation */}
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                        />

                        {/* Subtle Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-transparent to-black/40 pointer-events-none" />

                        {/* Top-Right Interactive Like & Save Badges */}
                        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                          
                          {/* Like Button */}
                          <button
                            onClick={(e) => handleToggleLike(e, project.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider backdrop-blur-md transition-all shadow-md active:scale-90 ${
                              likeInfo.isLiked
                                ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                : "bg-black/60 text-zinc-300 hover:text-white border border-white/10 hover:border-white/30"
                            }`}
                            title={likeInfo.isLiked ? "Unlike" : "Like project"}
                          >
                            <Heart 
                              className={`w-3.5 h-3.5 transition-colors ${
                                likeInfo.isLiked ? "fill-red-400 text-red-400" : "text-zinc-300"
                              }`} 
                            />
                            <span>{likeInfo.count}</span>
                          </button>

                          {/* Save/Bookmark Button */}
                          <button
                            onClick={(e) => handleToggleSave(e, project.id)}
                            className={`p-1.5 rounded-full backdrop-blur-md transition-all shadow-md active:scale-90 ${
                              isSaved
                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                                : "bg-black/60 text-zinc-300 hover:text-white border border-white/10 hover:border-white/30"
                            }`}
                            title={isSaved ? "Saved to collection" : "Save project"}
                          >
                            <Bookmark 
                              className={`w-3.5 h-3.5 transition-colors ${
                                isSaved ? "fill-cyan-400 text-cyan-400" : "text-zinc-300"
                              }`} 
                            />
                          </button>

                        </div>

                        {/* Top-Left Category Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono uppercase tracking-widest text-zinc-300 font-semibold">
                            {project.category} {project.year ? `· ${project.year}` : ""}
                          </span>
                        </div>
                      </div>

                      {/* BOTTOM: TEXT CONTENT AREA */}
                      <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                        
                        <div className="space-y-2">
                          {/* Project Title & Outbound Arrow */}
                          <a
                            href={project.link && project.link !== "#" ? project.link : undefined}
                            target={project.link && project.link.startsWith("http") ? "_blank" : undefined}
                            rel={project.link && project.link.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="group/title inline-flex items-center justify-between w-full"
                          >
                            <h3 className="text-base sm:text-lg font-sans font-bold text-white tracking-tight group-hover/title:text-zinc-300 transition-colors">
                              {project.title}
                            </h3>
                            {project.link && project.link !== "#" && (
                              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover/title:text-white group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all shrink-0 ml-2" />
                            )}
                          </a>

                          {/* 1-2 Line Caption Description */}
                          <p className="text-xs text-zinc-400 font-sans font-light leading-relaxed line-clamp-2">
                            {project.description}
                          </p>
                        </div>

                        {/* Tech Stack Pills */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-1.5">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-white/[0.03] border border-white/[0.06] text-[9.5px] font-mono uppercase tracking-wider text-zinc-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* No Search Results Empty State */
              <div className="py-16 text-center space-y-3 bg-[#121316] border border-white/[0.08] p-8">
                <Layers className="w-8 h-8 text-zinc-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No projects found</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  No projects matching "{searchQuery}". Try searching with different keywords or resetting filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                  }}
                  className="px-4 py-2 bg-white text-black text-xs font-mono uppercase tracking-wider font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* FULL-WIDTH BOTTOM PINNED FOOTER */}
      <Footer />
    </div>
  );
};

export default ProjectsPage;
