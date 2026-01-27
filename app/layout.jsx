import React from "react";
import "./globals.css";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

export const metadata = {
  title: 'Mohammad Abdullah Al Maruf — Frontend Developer',
  description: 'Frontend Developer specializing in Next.js, React, and modern web apps. Portfolio of projects, contact information, and blog.',
  openGraph: {
    title: 'Mohammad Abdullah Al Maruf — Frontend Developer',
    description: 'Frontend Developer specializing in Next.js, React, and modern web apps. Portfolio of projects, contact information, and blog.',
    url: 'https://yourdomain.com',
    siteName: 'Maruf Portfolio',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://yourdomain.com" />
        <link rel="icon" href="/favicon.png" type="image/svg+xml" />
        <link rel="icon" href="/maruf.png" />
        <link rel="apple-touch-icon" href="/maruf.png" />
      </head>
  <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white font-sans transition-colors duration-300">
    {children}
    <FloatingWhatsApp />
  </body>
    </html>
  );
}
