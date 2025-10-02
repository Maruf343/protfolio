import React from "react";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-base-200 dark:bg-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
