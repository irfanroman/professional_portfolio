import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import PageTransition, { RouteFallback } from "./components/PageTransition";
import HomePage from "./pages/HomePage";

// Below-the-fold routes are code-split: their JS (framer-motion usage, lucide icons,
// RSS/hCaptcha logic) is only fetched when the visitor actually navigates there,
// instead of blocking the initial Home render for every visitor.
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ReviewPage = lazy(() => import("./pages/ReviewPage"));
const CustomerReviewPage = lazy(() => import("./pages/CustomerReviewPage"));

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#050608] text-[#f3f2ef] font-sans selection:bg-white selection:text-black">
          <Suspense fallback={<RouteFallback />}>
            <PageTransition>
              <Routes>
                {/* Primary Clean Production Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Hidden Direct-Link Routes */}
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/customer-review" element={<CustomerReviewPage />} />

                {/* Legacy Staging Redirects & Compatibility */}
                <Route path="/hero-staging" element={<Navigate to="/" replace />} />
                <Route path="/about-staging" element={<Navigate to="/about" replace />} />
                <Route path="/projects-staging" element={<Navigate to="/projects" replace />} />
                <Route path="/blog-staging" element={<Navigate to="/blog" replace />} />
                <Route path="/contact-staging" element={<Navigate to="/contact" replace />} />

                {/* 404 Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PageTransition>
          </Suspense>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
