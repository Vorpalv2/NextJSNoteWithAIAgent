"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

// Theme hook to detect device preference
const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to device preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const deviceTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    setTheme(savedTheme || deviceTheme);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Update document class for global styling
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme, mounted };
};

// Custom hook for counting animation
const useCountAnimation = (endValue: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;

      setCount(parseFloat(currentValue.toFixed(1)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue, duration]);

  return count;
};

const LandingPage = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const constraintsRef = useRef(null);
  const { theme, toggleTheme, mounted } = useTheme();

  // Use the counting animation hook for all stats
  const usersCount = useCountAnimation(1000, 2000);
  const notesCount = useCountAnimation(50, 2200);
  const uptimeCount = useCountAnimation(99.9, 2500);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
            theme === "dark"
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {theme === "dark" ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Hero Section */}

      <div className="container mx-auto px-4 py-16 ">
        <motion.div className="text-center" ref={constraintsRef}>
          <h1
            className={`text-6xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NoteNextJS
            </span>
          </h1>
          <p
            className={`text-xl mb-8 max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            A modern, AI-powered note-taking application built with Next.js.
            Organize your thoughts, collaborate seamlessly, and let AI enhance
            your productivity.
          </p>

          {/* CTA Buttons */}
          <motion.div
            drag
            dragElastic={0.5}
            dragConstraints={constraintsRef}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, animationDuration: 2 }}
            className="flex gap-4 justify-center mb-12 "
          >
            <button
              type="button"
              onClick={() => router.push("/application")}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Get Started
            </button>
            <button
              className={`px-8 py-3 border-2 rounded-lg font-semibold transition-all duration-200 ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              Learn More
            </button>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div
            className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Smart Notes
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Create, organize, and search through your notes with intelligent
              categorization.
            </p>
          </div>

          <div
            className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              AI Assistant
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Get intelligent suggestions and help with your note-taking
              workflow.
            </p>
          </div>

          <div
            className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Secure & Fast
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Built with modern technologies for speed, security, and
              reliability.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <motion.div
                className="text-3xl font-bold text-blue-600 mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {Math.round(usersCount).toLocaleString()}+
              </motion.div>
              <div
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Active Users
              </div>
            </div>
            <div>
              <motion.div
                className="text-3xl font-bold text-purple-600 mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {Math.round(notesCount).toLocaleString()}K+
              </motion.div>
              <div
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Notes Created
              </div>
            </div>
            <div>
              <motion.div
                className="text-3xl font-bold text-green-600 mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {uptimeCount}%
              </motion.div>
              <div
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Uptime
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements for Visual Appeal */}
      <div
        className={`fixed top-20 left-10 w-20 h-20 rounded-full opacity-20 animate-pulse ${
          theme === "dark" ? "bg-blue-800" : "bg-blue-200"
        }`}
      ></div>
      <div
        className={`fixed bottom-20 right-10 w-32 h-32 rounded-full opacity-20 animate-pulse delay-1000 ${
          theme === "dark" ? "bg-purple-800" : "bg-purple-200"
        }`}
      ></div>
      <div
        className={`fixed top-1/2 left-5 w-16 h-16 rounded-full opacity-20 animate-pulse delay-500 ${
          theme === "dark" ? "bg-green-800" : "bg-green-200"
        }`}
      ></div>
    </div>
  );
};

export default LandingPage;
