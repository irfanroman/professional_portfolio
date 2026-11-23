import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion as Motion } from "framer-motion";
import { Star, RefreshCw, AlertCircle, MessageSquare } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchCustomerReviews } from "../lib/reviewsApi";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(isoString) {
  if (!isoString) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(isoString));
  } catch {
    return "";
  }
}

const CustomerReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedStar, setSelectedStar] = useState(0);

  // Keep /customer-review hidden from search engines and set a dedicated title.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Customer Reviews | Irfan Fahrurohman";

    let robotsMeta = document.querySelector('meta[name="robots"]');
    const createdMeta = !robotsMeta;
    const previousContent = robotsMeta ? robotsMeta.getAttribute("content") : null;

    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute("content", "noindex, nofollow");

    return () => {
      document.title = previousTitle;
      if (createdMeta && robotsMeta.parentNode) {
        robotsMeta.parentNode.removeChild(robotsMeta);
      } else if (robotsMeta) {
        if (previousContent !== null) {
          robotsMeta.setAttribute("content", previousContent);
        } else {
          robotsMeta.removeAttribute("content");
        }
      }
    };
  }, []);

  const handleRefresh = useCallback(async ({ showSkeleton = false } = {}) => {
    if (showSkeleton) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setErrorMessage("");

    try {
      const data = await fetchCustomerReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMessage(
        err?.message || "Unable to load customer reviews right now."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchCustomerReviews()
      .then((data) => {
        if (!cancelled) {
          setReviews(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMessage(
            err?.message || "Unable to load customer reviews right now."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, item) => acc + Number(item.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  const availableStarFilters = useMemo(() => {
    const counts = new Map();
    for (const item of reviews) {
      const r = Number(item.rating || 0);
      if (r >= 1 && r <= 5) {
        counts.set(r, (counts.get(r) || 0) + 1);
      }
    }
    return [5, 4, 3, 2, 1].filter((star) => counts.has(star));
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (selectedStar === 0) return reviews;
    return reviews.filter((item) => Number(item.rating) === selectedStar);
  }, [reviews, selectedStar]);

  return (
    <div className="min-h-[100dvh] bg-[#050608] text-[#f3f2ef] selection:bg-white selection:text-black pt-4 sm:pt-6 pb-0 px-0 relative overflow-hidden font-sans flex flex-col justify-between">
      {/* Background Noise Texture Overlay */}
      <div className="grain-overlay" />

      {/* Atmospheric Charcoal to Black Gradient Background */}
      <div className="fixed inset-0 ethan-charcoal-bg pointer-events-none" />

      {/* Ambient Spotlight */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] portrait-rim-light rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-10 flex-1 flex flex-col mb-16">
        {/* REUSABLE NAVBAR */}
        <Navbar />

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          {/* PAGE HEADER */}
          <div className="bg-[#121316] border border-white/[0.12] p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl font-sans font-black tracking-tight uppercase text-[#f3f2ef]">
                  CUSTOMER REVIEWS
                </h1>
                <p className="text-xs sm:text-sm font-mono text-[#9a9a96] tracking-wide">
                  Direct client feedback on design, engineering, and collaboration.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleRefresh()}
                disabled={isLoading || isRefreshing}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-none text-xs font-mono uppercase tracking-wider whitespace-nowrap text-zinc-200 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.15] hover:border-white/40 transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>{isRefreshing ? "REFRESHING" : "REFRESH"}</span>
              </button>
            </div>

            {/* RATING SUMMARY & FILTER BAR */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-[#f3f2ef]">
                    {reviews.length > 0 ? averageRating.toFixed(1) : "0.0"}
                  </span>
                  <span className="text-xs font-mono text-[#9a9a96]">/ 5.0</span>
                </div>

                <div className="flex items-center gap-1" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= Math.round(averageRating);
                    return (
                      <Star
                        key={star}
                        strokeWidth={1.75}
                        className={`w-4 h-4 ${
                          filled
                            ? "text-amber-400 fill-amber-400"
                            : "text-zinc-600 fill-transparent"
                        }`}
                      />
                    );
                  })}
                </div>

                <span className="text-xs font-mono uppercase tracking-widest text-[#9a9a96]">
                  {reviews.length} {reviews.length === 1 ? "REVIEW" : "REVIEWS"}
                </span>
              </div>

              {availableStarFilters.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStar(0)}
                    className={`px-3 py-1.5 rounded-none text-[11px] font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
                      selectedStar === 0
                        ? "bg-white text-black border-white font-bold"
                        : "bg-white/[0.02] text-zinc-300 border-white/[0.12] hover:border-white/35"
                    }`}
                  >
                    ALL
                  </button>
                  {availableStarFilters.map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedStar(star)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-none text-[11px] font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
                        selectedStar === star
                          ? "bg-white text-black border-white font-bold"
                          : "bg-white/[0.02] text-zinc-300 border-white/[0.12] hover:border-white/35"
                      }`}
                    >
                      <span>{star}</span>
                      <Star
                        strokeWidth={1.75}
                        className={`w-3 h-3 ${
                          selectedStar === star
                            ? "text-black fill-black"
                            : "text-amber-400 fill-amber-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ERROR STATE */}
          {errorMessage && (
            <div className="animate-error-shake p-5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRefresh({ showSkeleton: true })}
                className="px-4 py-2 rounded-none bg-white text-black font-sans font-bold text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-zinc-200 transition-colors active:scale-95 self-start sm:self-auto"
              >
                TRY AGAIN
              </button>
            </div>
          )}

          {/* LOADING SKELETONS */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((slot) => (
                <div
                  key={slot}
                  className="bg-[#121316] border border-white/[0.1] p-6 sm:p-8 space-y-6 skeleton-shimmer"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-28 bg-white/[0.06]" />
                    <div className="h-3 w-10 bg-white/[0.06]" />
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-3.5 w-full bg-white/[0.06]" />
                    <div className="h-3.5 w-5/6 bg-white/[0.06]" />
                    <div className="h-3.5 w-2/3 bg-white/[0.06]" />
                  </div>
                  <div className="border-t border-white/[0.08] pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/[0.06]" />
                      <div className="h-3.5 w-28 bg-white/[0.06]" />
                    </div>
                    <div className="h-3 w-20 bg-white/[0.06]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && !errorMessage && filteredReviews.length === 0 && (
            <div className="bg-[#121316] border border-white/[0.12] p-10 sm:p-14 text-center space-y-4">
              <div className="w-11 h-11 mx-auto bg-white/[0.03] border border-white/[0.12] flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-lg font-display font-bold uppercase tracking-tight text-[#f3f2ef]">
                  {selectedStar > 0
                    ? `NO ${selectedStar}-STAR REVIEWS YET`
                    : "NO CUSTOMER REVIEWS YET"}
                </h2>
                <p className="text-xs sm:text-sm font-mono text-[#9a9a96] max-w-md mx-auto">
                  {selectedStar > 0
                    ? "Select another filter to view all submitted testimonials."
                    : "New client testimonials submitted through the review form will appear here automatically."}
                </p>
              </div>
            </div>
          )}

          {/* REVIEW CARDS GRID */}
          {!isLoading && !errorMessage && filteredReviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReviews.map((item, idx) => (
                <Motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(idx * 0.06, 0.36),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="bg-[#121316] border border-white/[0.12] hover:border-white/25 transition-colors p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xl"
                >
                  <div className="space-y-5">
                    {/* STAR ROW */}
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className="flex items-center gap-1"
                        aria-label={`Rated ${item.rating} out of 5 stars`}
                      >
                        {[1, 2, 3, 4, 5].map((star) => {
                          const filled = star <= Number(item.rating);
                          return (
                            <Star
                              key={star}
                              strokeWidth={1.75}
                              className={`w-4 h-4 ${
                                filled
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-zinc-700 fill-transparent"
                              }`}
                            />
                          );
                        })}
                      </div>

                      <span className="text-[11px] font-mono text-[#9a9a96] tracking-wider">
                        {Number(item.rating).toFixed(1)} / 5.0
                      </span>
                    </div>

                    {/* REVIEW BODY */}
                    <p className="text-sm sm:text-base text-[#e4e3df] leading-relaxed whitespace-pre-line font-sans">
                      &ldquo;{item.review}&rdquo;
                    </p>
                  </div>

                  {/* ATTRIBUTION FOOTER */}
                  <div className="border-t border-white/[0.08] pt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        aria-hidden="true"
                        className="w-8 h-8 shrink-0 bg-white/[0.04] border border-white/[0.14] flex items-center justify-center font-mono text-[11px] font-semibold text-[#f3f2ef]"
                      >
                        {getInitials(item.name)}
                      </div>
                      <span className="font-sans font-semibold text-sm text-[#f3f2ef] truncate">
                        {item.name}
                      </span>
                    </div>

                    {item.created_at && (
                      <time
                        dateTime={item.created_at}
                        className="text-[11px] font-mono uppercase tracking-wider text-[#9a9a96] shrink-0"
                      >
                        {formatDate(item.created_at)}
                      </time>
                    )}
                  </div>
                </Motion.article>
              ))}
            </div>
          )}
        </Motion.div>
      </div>

      {/* FULL-WIDTH BOTTOM PINNED FOOTER */}
      <Footer />
    </div>
  );
};

export default CustomerReviewPage;
