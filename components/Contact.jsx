"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // "", "success", "error"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }

    setLoading(false);
  };

  return (
    <section
      id="contact"
      className="min-h-screen px-6 md:px-20 py-16 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800"
    >
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
        Contact Me
      </h2>
      <p className="text-center text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        Have a question or want to work together? Fill out the form and I will get back to you as soon as possible.
      </p>

      <motion.form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Floating label inputs */}
        {["name", "email", "message"].map((field) => (
          <div key={field} className="relative">
            {field !== "message" ? (
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                placeholder=" "
                className="peer w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
              />
            ) : (
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder=" "
                className="peer w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
              />
            )}
            <label className="absolute left-4 top-3 text-gray-400 dark:text-gray-300 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-sm peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400">
              {field === "name" ? "Your Name" : field === "email" ? "Your Email" : "Your Message"}
            </label>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-4 rounded-lg font-semibold hover:bg-indigo-500 transition transform hover:scale-105"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        {/* Animated success/error message */}
        <AnimatePresence>
          {status === "success" && (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-green-600 mt-2 text-center font-medium"
            >
              Message sent successfully!
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-600 mt-2 text-center font-medium"
            >
              Something went wrong. Please try again!
            </motion.p>
          )}
        </AnimatePresence>
      </motion.form>
    </section>
  );
}
