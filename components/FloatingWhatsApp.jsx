"use client";

import React from "react";

export default function FloatingWhatsApp() {
  // Bangladesh number: 01571350711 -> international format 8801571350711
  const phone = "8801571350711";
  const text = encodeURIComponent("Hi Maruf, I found your portfolio and would like to connect.");
  const href = `https://wa.me/${phone}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-xl hover:scale-105 transform transition-transform duration-200 ring-2 ring-white/30"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden>
        <path d="M20.52 3.478A11.91 11.91 0 0012.004.5C6.486.5 1.999 4.986 1.999 10.5c0 1.847.484 3.65 1.403 5.253L.5 23.5l7.992-2.08a11.93 11.93 0 004.513.92c5.518 0 10.005-4.486 10.005-9.999 0-2.665-1.03-5.17-2.99-7.862zM12.004 21.5c-1.356 0-2.686-.28-3.918-.83l-.282-.121-4.748 1.234 1.265-4.637-.148-.292A9.386 9.386 0 012.614 10.5c0-4.66 4.011-8.5 9.39-8.5 2.51 0 4.862.98 6.62 2.76 1.758 1.78 2.77 4.16 2.77 6.54 0 4.66-4.01 8.5-9.39 8.5z" />
        <path d="M17.287 14.02c-.295-.148-1.745-.862-2.015-.961-.27-.098-.467-.148-.664.148s-.762.961-.935 1.16c-.172.197-.345.223-.64.074-.295-.148-1.246-.461-2.37-1.466-.876-.78-1.466-1.74-1.64-2.035-.172-.295-.018-.455.13-.603.134-.135.295-.345.443-.518.148-.172.197-.295.295-.49.098-.197.05-.37-.025-.518-.074-.147-.664-1.6-.91-2.194-.24-.578-.484-.5-.664-.51l-.567-.01c-.197 0-.518.074-.79.37s-1.04 1.016-1.04 2.48 1.065 2.876 1.213 3.074c.148.197 2.095 3.2 5.078 4.487 2.983 1.288 2.983.86 3.523.807.54-.052 1.745-.712 1.99-1.399.246-.686.246-1.273.172-1.398-.074-.124-.27-.197-.565-.345z" fill="#fff" />
      </svg>
    </a>
  );
}
