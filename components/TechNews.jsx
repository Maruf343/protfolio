    "use client";

    import { useEffect, useState } from "react";
    import { motion } from "framer-motion";

    export default function TechNews() {
        const [articles, setArticles] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

    const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
        const res = await fetch("/api/tech-news");
        const data = await res.json();

        // The API should return an array of articles. If it returns an object
        // (for example { error: '...' }) guard against that to avoid .map errors.
        if (!Array.isArray(data)) {
            console.error("Unexpected tech-news response:", data);
            setArticles([]);
            setError(data?.error || "Failed to load news.");
        } else {
            setArticles(data);
        }
        } catch (err) {
        console.error(err);
        setArticles([]);
        setError("Failed to fetch news.");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();

        // Auto-update every 5 minutes
        const interval = setInterval(fetchNews, 300000);
        return () => clearInterval(interval);
    }, []);

    const sampleArticles = [
        {
            title: 'Sample: New JS Framework Released',
            description: 'A lightweight JS framework was released today offering fast hydration and tiny bundles.',
            url: '#',
            urlToImage: '/placeholder.png',
        },
        {
            title: 'Sample: TypeScript 5.x Improvements',
            description: 'TypeScript introduces ergonomics improvements and faster builds in the latest release.',
            url: '#',
            urlToImage: '/placeholder.png',
        },
    ];

    return (
        <section
        id="tech-news"
        className="min-h-screen px-6 md:px-20 py-16 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800"
        >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            📰 Tech News
        </h2>

        {loading ? (
            <p className="text-center text-gray-700 dark:text-gray-300">Loading news...</p>
        ) : error ? (
            <div className="text-center">
                <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
                <div className="flex items-center justify-center gap-3">
                    <button onClick={fetchNews} className="px-4 py-2 bg-indigo-600 text-white rounded">Retry</button>
                    <button onClick={() => setArticles(sampleArticles)} className="px-4 py-2 bg-gray-200 rounded">Show sample news</button>
                </div>
            </div>
        ) : articles.length === 0 ? (
            <p className="text-center text-gray-700 dark:text-gray-300">No news available.</p>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
                <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col"
                >
                {article.urlToImage && (
                    <div className="relative w-full h-48 md:h-56">
                    <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover"
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
                    className="mt-auto inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition"
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
