"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TechNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // viewport state (for particles)
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  // fetch news
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tech-news");
      const data = await res.json();

      if (!Array.isArray(data)) {
        setArticles([]);
        setError(data?.error || "Failed to load news.");
      } else {
        setArticles(data);
      }
    } catch (err) {
      setArticles([]);
      setError("Failed to fetch news.");
    } finally {
      setLoading(false);
    }
  };

  // fetch news + polling
  useEffect(() => {
    fetchNews();
    const interval = setInterval(
      fetchNews,
      Number(process.env.NEXT_PUBLIC_NEWS_POLL_MS) || 60000
    );
    return () => clearInterval(interval);
  }, []);

  // get window size safely
  useEffect(() => {
    const updateSize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // fallback sample data
  const sampleArticles = [
    {
      title: "Sample: New JS Framework Released",
      description:
        "A lightweight JS framework was released today offering fast hydration and tiny bundles.",
      url: "#",
      urlToImage: "/placeholder.png",
    },
    {
      title: "Sample: TypeScript 5.x Improvements",
      description:
        "TypeScript introduces ergonomics improvements and faster builds in the latest release.",
      url: "#",
      urlToImage: "/placeholder.png",
    },
  ];

  return (
    <section
      id="tech-news"
      className="relative min-h-screen px-6 md:px-20 py-16
      bg-gradient-to-br from-slate-50 via-white to-indigo-50
      dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden"
    >
      {/* Floating particles */}
      {viewport.width > 0 && (
        <svg className="absolute inset-0 w-full h-full -z-20">
          {Array.from({ length: 30 }).map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * viewport.width}
              cy={Math.random() * viewport.height}
              r={Math.random() * 3 + 1.5}
              fill="rgba(99,102,241,0.1)"
            />
          ))}
        </svg>
      )}

      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        📰 Tech News
      </h2>

      {loading ? (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Loading news...
        </p>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={fetchNews}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
            >
              Retry
            </button>
            <button
              onClick={() => setArticles(sampleArticles)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Show Sample News
            </button>
          </div>
        </div>
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-700 dark:text-gray-300">
          No news available.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md
              rounded-2xl shadow-xl overflow-hidden flex flex-col
              border border-indigo-300/20 dark:border-indigo-500/20
              hover:scale-105 transition-transform duration-300"
            >
              {article.urlToImage && (
                <div className="relative w-full h-48 md:h-56 overflow-hidden">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {article.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {article.description || "No description available."}
                </p>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block px-4 py-2
                  bg-gradient-to-r from-indigo-500 to-indigo-600
                  text-white rounded-lg font-medium shadow
                  hover:from-indigo-600 hover:to-indigo-700 transition"
                >
                  Read More
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
