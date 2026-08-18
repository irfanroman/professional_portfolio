import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#050608] text-[#f3f2ef] transition-colors duration-500 font-sans selection:bg-white selection:text-black">
          <Routes>
            {/* Primary Clean Production Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Legacy Staging Redirects & Compatibility */}
            <Route path="/hero-staging" element={<Navigate to="/" replace />} />
            <Route path="/about-staging" element={<Navigate to="/about" replace />} />
            <Route path="/projects-staging" element={<Navigate to="/projects" replace />} />
            <Route path="/blog-staging" element={<Navigate to="/blog" replace />} />
            <Route path="/contact-staging" element={<Navigate to="/contact" replace />} />

            {/* 404 Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
