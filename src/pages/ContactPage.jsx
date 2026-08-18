import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  ExternalLink, 
  FileText, 
  Check, 
  Clock,
  Loader2,
  AlertCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "e2b3294d-a604-4884-b49a-4427bc61dd14",
          name: formData.name || "Portfolio Visitor",
          email: formData.email,
          subject: formData.subject ? `[Portfolio Inquiry] ${formData.subject}` : `[Portfolio Inquiry] from ${formData.name || 'Visitor'}`,
          message: formData.message,
          from_name: formData.name ? `${formData.name} (Portfolio)` : "Portfolio Inquiry",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => {
          setIsSubmitted(false);
        }, 6000);
      } else {
        setErrorMessage(result.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Network error. Please check your connection or contact via direct email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-[#f3f2ef] selection:bg-white selection:text-black pt-4 sm:pt-6 pb-0 px-0 relative overflow-hidden font-sans flex flex-col justify-between">
      {/* Background Noise Texture Overlay */}
      <div className="grain-overlay" />

      {/* Atmospheric Charcoal to Black Gradient Background */}
      <div className="fixed inset-0 ethan-charcoal-bg pointer-events-none" />

      {/* Ambient Spotlight */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] portrait-rim-light rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-10 flex-1 flex flex-col justify-between mb-12">
        
        {/* REUSABLE NAVBAR */}
        <Navbar />

        {/* MAIN INQUIRY CARD CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#121316] border border-white/[0.12] p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8 my-auto"
        >
          {/* HEADER SECTION */}
          <div className="space-y-2 border-b border-white/[0.08] pb-6">
            <h1 className="text-2xl sm:text-4xl font-sans font-black tracking-tight uppercase text-[#f3f2ef]">
              SUBMIT PROJECT INQUIRY
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#9a9a96] tracking-wide">
              Fill out your collaboration scope below.
            </p>
          </div>

          {/* FORM FIELDS (UNDERLINE STYLE) */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* ROW 1: 2 COLUMNS (NAME & EMAIL) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Field 1: Name */}
              <div className="space-y-1">
                <label 
                  htmlFor="name" 
                  className="text-[10.5px] sm:text-xs font-mono uppercase tracking-widest text-[#5c5c5a] block"
                >
                  YOUR NAME
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-transparent border-b border-white/[0.15] focus:border-white text-sm sm:text-base text-[#f3f2ef] placeholder-zinc-700 py-2.5 focus:outline-none transition-colors font-sans"
                />
              </div>

              {/* Field 2: Email */}
              <div className="space-y-1">
                <label 
                  htmlFor="email" 
                  className="text-[10.5px] sm:text-xs font-mono uppercase tracking-widest text-[#5c5c5a] block"
                >
                  YOUR EMAIL <span className="text-zinc-400">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@company.com"
                  className="w-full bg-transparent border-b border-white/[0.15] focus:border-white text-sm sm:text-base text-[#f3f2ef] placeholder-zinc-700 py-2.5 focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>

            {/* ROW 2: FULL-WIDTH (SUBJECT / TOPIC) */}
            <div className="space-y-1">
              <label 
                htmlFor="subject" 
                className="text-[10.5px] sm:text-xs font-mono uppercase tracking-widest text-[#5c5c5a] block"
              >
                SUBJECT / TOPIC
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Web App Redesign / Cloud Architecture Setup"
                className="w-full bg-transparent border-b border-white/[0.15] focus:border-white text-sm sm:text-base text-[#f3f2ef] placeholder-zinc-700 py-2.5 focus:outline-none transition-colors font-sans"
              />
            </div>

            {/* ROW 3: FULL-WIDTH MULTI-LINE TEXTAREA (MESSAGE DETAILS) */}
            <div className="space-y-1">
              <label 
                htmlFor="message" 
                className="text-[10.5px] sm:text-xs font-mono uppercase tracking-widest text-[#5c5c5a] block"
              >
                MESSAGE DETAILS <span className="text-zinc-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your project, goals, timeline, and budget expectation..."
                className="w-full bg-transparent border-b border-white/[0.15] focus:border-white text-sm sm:text-base text-[#f3f2ef] placeholder-zinc-700 py-2.5 focus:outline-none transition-colors font-sans resize-none leading-relaxed"
              />
            </div>

            {/* SUCCESS / ERROR ALERTS */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-3"
                >
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Message sent successfully! We will get back to you shortly.</span>
                </motion.div>
              )}

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FOOTER FORM (PRIORITY NOTE & SOLID WHITE SUBMIT BUTTON) */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Priority Note */}
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 italic">
                <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>* Priority routing response: &lt; 2 hours</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-none font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer active:scale-95 ${
                  isSubmitted
                    ? "bg-emerald-500 text-black hover:bg-emerald-400"
                    : isSubmitting
                    ? "bg-zinc-700 text-zinc-300 cursor-not-allowed"
                    : "bg-white text-black hover:bg-zinc-200 hover:scale-105"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-300" />
                    <span>SENDING MESSAGE...</span>
                  </>
                ) : isSubmitted ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    <span>MESSAGE SENT ✓</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-black" />
                    <span>SUBMIT MESSAGE</span>
                  </>
                )}
              </button>

            </div>

          </form>

          {/* DIVIDER */}
          <div className="border-t border-white/[0.08] pt-6" />

          {/* SECTION: SOCIAL & CREDENTIALS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Label */}
            <span className="text-[10.5px] sm:text-xs font-mono uppercase tracking-widest text-[#5c5c5a] font-semibold">
              SOCIAL & CREDENTIALS
            </span>

            {/* 3 Outline Sharp Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/irfanfahrurohmann/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.15] hover:border-white/40 transition-all active:scale-95"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/irfanroman"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.15] hover:border-white/40 transition-all active:scale-95"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>

              {/* Download CV */}
              <a
                href="/CV_Muhammad_Irfan_Fahrurohman.pdf"
                download="CV_Muhammad_Irfan_Fahrurohman.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.15] hover:border-white/40 transition-all active:scale-95"
              >
                <FileText className="w-3 h-3 text-zinc-400" />
                <span>Download CV</span>
              </a>
            </div>

          </div>

        </motion.div>

      </div>

      {/* FULL-WIDTH BOTTOM PINNED FOOTER */}
      <Footer />
    </div>
  );
};

export default ContactPage;
