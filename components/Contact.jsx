"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSuccess("Something went wrong. Try again!");
      }
    } catch (error) {
      setSuccess("Something went wrong. Try again!");
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

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={5}
          required
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-4 rounded-lg font-semibold hover:bg-indigo-500 transition duration-300"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        {success && <p className="text-center text-green-500 mt-2">{success}</p>}
      </form>
    </section>
  );
}
