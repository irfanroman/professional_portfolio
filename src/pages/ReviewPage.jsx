import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Star,
  Check,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { submitCustomerReview } from "../lib/reviewsApi";

const RATING_LABELS = {
  1: "Needs improvement",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Exceptional",
};

const ReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    review: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Keep /review hidden from search engines and set a dedicated page title.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Submit Your Review | Irfan Fahrurohman";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSelectRating = (value) => {
    setRating(value);
    if (errorMessage) setErrorMessage("");
  };

  const handleRatingKeyDown = (e, value) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      handleSelectRating(Math.min(5, (rating || value) + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      handleSelectRating(Math.max(1, (rating || value) - 1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setErrorMessage("Please select a star rating before submitting.");
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.review.trim()) {
      setErrorMessage("Please fill out your name, email, and review.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const cleanReview = formData.review.trim();
    const starBar = `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`;

    try {
      // 1. Save review to Supabase so it appears on /customer-review immediately
      await submitCustomerReview({
        name: cleanName,
        email: cleanEmail,
        rating,
        review: cleanReview,
      });

      // 2. Also send email notification via Web3Forms (non-blocking if email relay fails)
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "57be467b-2c56-460d-a9ec-1045bc9a0451",
          subject: `[Client Review] ${rating}/5 Stars from ${cleanName}`,
          from_name: `${cleanName} (Client Review)`,
          name: cleanName,
          email: cleanEmail,
          rating: `${rating} / 5 (${starBar}) - ${RATING_LABELS[rating]}`,
          review: cleanReview,
        }),
      }).catch((err) => {
        console.warn("Web3Forms email notification failed:", err);
      });

      setIsSubmitted(true);
      setRating(0);
      setHoveredRating(0);
      setFormData({ name: "", email: "", review: "" });
      setTimeout(() => {
        setIsSubmitted(false);
      }, 7000);
    } catch (err) {
      setErrorMessage(
        err?.message ||
          "Network error. Please check your connection and try submitting again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeStarValue = hoveredRating || rating;

  return (
    <div className="min-h-[100dvh] bg-[#050608] text-[#f3f2ef] selection:bg-white selection:text-black pt-4 sm:pt-6 pb-0 px-0 relative overflow-hidden font-sans flex flex-col justify-between">
      {/* Background Noise Texture Overlay */}
      <div className="grain-overlay" />

      {/* Atmospheric Charcoal to Black Gradient Background */}
      <div className="fixed inset-0 ethan-charcoal-bg pointer-events-none" />

      {/* Ambient Spotlight */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] portrait-rim-light rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-10 flex-1 flex flex-col justify-between mb-12">
        {/* REUSABLE NAVBAR */}
        <Navbar />

        {/* MAIN REVIEW CARD CONTAINER */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#121316] border border-white/[0.12] p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8 my-auto"
        >
          {/* HEADER SECTION */}
          <div className="space-y-2 border-b border-white/[0.08] pb-6">
            <h1 className="text-2xl sm:text-4xl font-sans font-black tracking-tight uppercase text-[#f3f2ef]">
              SUBMIT YOUR REVIEW HERE
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#9a9a96] tracking-wide">
              Share your experience working together. Your testimonial helps future clients understand what we can build.
            </p>
          </div>

          {/* REVIEW FORM */}
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* ROW 1: STAR RATING SELECTOR */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  id="rating-label"
                  className="text-[10.5px] sm:text-xs font-mono uppercase tracking-widest text-[#9a9a96] block"
                >
                  YOUR RATING <span className="text-zinc-300">*</span>
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {activeStarValue > 0
                    ? `${activeStarValue} / 5 · ${RATING_LABELS[activeStarValue]}`
                    : "Select 1 to 5 stars"}
                </span>
              </div>

              <div
                role="radiogroup"
                aria-labelledby="rating-label"
                className="flex items-center gap-2 sm:gap-3 pt-1"
                onMouseLeave={() => setHoveredRating(0)}
              >
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = starValue <= activeStarValue;
                  const isSelected = rating === starValue;

                  return (
                    <button
                      key={starValue}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${starValue} ${starValue === 1 ? "star" : "stars"} - ${RATING_LABELS[starValue]}`}
                      onClick={() => handleSelectRating(starValue)}
                      onMouseEnter={() => setHoveredRating(starValue)}
                      onKeyDown={(e) => handleRatingKeyDown(e, starValue)}
                      className={`group p-2.5 sm:p-3 border transition-all cursor-pointer active:scale-95 focus:outline-none focus-visible:border-white ${
                        isFilled
                          ? "bg-amber-400/10 border-amber-400/40"
                          : "bg-white/[0.02] border-white/[0.12] hover:border-white/30"
                      }`}
                    >
                      <Star
                        strokeWidth={1.75}
                        className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-150 group-hover:scale-110 ${
                          isFilled
                            ? "text-amber-400 fill-amber-400"
                            : "text-zinc-500 fill-transparent"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ROW 2: 2 COLUMNS (NAME & EMAIL) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Field 1: Name */}
              <div className="space-y-1">
                <label
                  htmlFor="review-name"
                  className="text-[10.5px] sm:text-xs font-mono uppercase tracking-widest text-[#9a9a96] block"
                >
                  YOUR NAME <span className="text-zinc-300">*</span>
                </label>
                <input
                  id="review-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-transparent border-b border-white/[0.15] focus:border-white text-sm sm:text-base text-[#f3f2ef] placeholder-zinc-500 py-2.5 focus:outline-none transition-colors font-sans"
                />
              </div>

              {/* Field 2: Email */}
              <div className="space-y-1">
                <label
                  htmlFor="review-email"
                  className="text-[10.5px] sm:text-xs font-mono uppercase tracking-widest text-[#9a9a96] block"
                >
                  YOUR EMAIL <span className="text-zinc-300">*</span>
                </label>
                <input
                  id="review-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@company.com"
                  className="w-full bg-transparent border-b border-white/[0.15] focus:border-white text-sm sm:text-base text-[#f3f2ef] placeholder-zinc-500 py-2.5 focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>

            {/* ROW 3: FULL-WIDTH REVIEW TEXTAREA */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="review-text"
                  className="text-[10.5px] sm:text-xs font-mono uppercase tracking-widest text-[#9a9a96] block"
                >
                  YOUR REVIEW <span className="text-zinc-300">*</span>
                </label>
                <span className="text-[10.5px] font-mono text-zinc-500">
                  {formData.review.length} chars
                </span>
              </div>
              <textarea
                id="review-text"
                name="review"
                required
                rows={5}
                value={formData.review}
                onChange={handleChange}
                placeholder="Write your testimonial here. What project did we work on, and what stood out about the collaboration?"
                className="w-full bg-transparent border-b border-white/[0.15] focus:border-white text-sm sm:text-base text-[#f3f2ef] placeholder-zinc-500 py-2.5 focus:outline-none transition-colors font-sans resize-none leading-relaxed"
              />
            </div>

            {/* SUCCESS / ERROR ALERTS */}
            <AnimatePresence>
              {isSubmitted && (
                <Motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-3"
                >
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Thank you! Your review has been submitted successfully.
                  </span>
                </Motion.div>
              )}

              {errorMessage && (
                <Motion.div
                  key={errorMessage}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="animate-error-shake p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </Motion.div>
              )}
            </AnimatePresence>

            {/* FOOTER FORM (NOTE & SOLID WHITE SUBMIT BUTTON) */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Your email stays private and is never published.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-none font-sans font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer active:scale-95 ${
                  isSubmitted
                    ? "bg-emerald-500 text-black hover:bg-emerald-400"
                    : isSubmitting
                    ? "bg-zinc-700 text-zinc-300 cursor-not-allowed"
                    : "bg-white text-black hover:bg-zinc-200 hover:scale-105"
                }`}
              >
                <span
                  key={isSubmitting ? "sending" : isSubmitted ? "sent" : "idle"}
                  className="animate-state-in inline-flex items-center justify-center gap-2.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-300" />
                      <span>SENDING REVIEW...</span>
                    </>
                  ) : isSubmitted ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>REVIEW SENT</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-black" />
                      <span>SUBMIT REVIEW</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </Motion.div>
      </div>

      {/* FULL-WIDTH BOTTOM PINNED FOOTER */}
      <Footer />
    </div>
  );
};

export default ReviewPage;
