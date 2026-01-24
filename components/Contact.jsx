"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaComment, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

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
        setStatusMessage('');
        setFormData({ name: "", email: "", message: "" });
      } else {
        let msg = 'Something went wrong. Please try again!';
        try {
          const json = await res.json();
          if (json?.error) msg = json.error;
          else if (json?.message) msg = json.message;
        } catch (e) {
          const text = await res.text().catch(() => null);
          if (text) msg = text;
        }
        setStatus("error");
        setStatusMessage(msg);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setStatusMessage('Network error. Please check your connection.');
    }

    setLoading(false);
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen px-6 md:px-20 py-16
        bg-gradient-to-br from-slate-50 via-white to-indigo-50
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden"
    >
      {/* Floating particles */}
      <svg className="absolute inset-0 w-full h-full -z-20">
        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * window.innerWidth}
            cy={Math.random() * window.innerHeight}
            r={Math.random() * 3 + 1.5}
            fill="rgba(99,102,241,0.1)"
          />
        ))}
      </svg>

      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
        Contact Me
      </h2>
      <p className="text-center text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        Have a question or want to work together? Fill out the form and I will get back to you as soon as possible.
      </p>

      {/* Split layout */}
      <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
        {/* Left - Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex-1 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6 border border-indigo-300/20 dark:border-indigo-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder=" "
                className="peer w-full pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
              />
              <label className="absolute left-10 top-3 text-gray-400 dark:text-gray-300 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-sm peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400">
                Your Name
              </label>
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder=" "
                className="peer w-full pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
              />
              <label className="absolute left-10 top-3 text-gray-400 dark:text-gray-300 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-sm peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400">
                Your Email
              </label>
            </div>

            <div className="relative">
              <FaComment className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder=" "
                className="peer w-full pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
              />
              <label className="absolute left-10 top-3 text-gray-400 dark:text-gray-300 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-sm peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400">
                Your Message
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-4 rounded-lg font-semibold hover:bg-indigo-500 transition transform hover:scale-105"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          <AnimatePresence>
            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-green-600 text-center font-medium"
              >
                Message sent successfully!
              </motion.div>
            )}
            {status === "error" && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-red-600 text-center font-medium"
              >
                {statusMessage || 'Something went wrong. Please try again!'}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>

        {/* Right - Info / Illustration */}
        <div className="flex-1 flex flex-col justify-center gap-6 p-6 rounded-2xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-md shadow-xl border border-indigo-300/20 dark:border-indigo-500/20">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h3>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <FaEnvelope /> <span>abdullah.almaruf1121@gmail.com</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <FaPhoneAlt /> <span>+8801571350711</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <FaMapMarkerAlt /> <span>Dhaka, Bangladesh</span>
          </div>
          <div className="mt-6">
            <a
              href="/Maruf_CV.pdf"
              target="_blank"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-500 transition"
            >
              Download My CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
