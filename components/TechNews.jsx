    "use client";

    import { useEffect, useState } from "react";
    import { motion } from "framer-motion";

    export default function TechNews() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNews = async () => {
        try {
        const res = await fetch("/api/tech-news");
        const data = await res.json();
        setArticles(data);
        } catch (err) {
        console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNews();

        // Auto-update every 5 minutes
        const interval = setInterval(fetchNews, 300000);
        return () => clearInterval(interval);
    }, []);

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
