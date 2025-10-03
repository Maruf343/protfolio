import React from "react";
import "./globals.css";
import LiveChat from "@/components/LiveChat";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-base-200 dark:bg-gray-900 font-sans">
        {children}
        {/* LiveChat globally visible */}
         <LiveChat />
      </body>
    </html>
  );
}
