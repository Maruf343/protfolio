"use client";

import { useEffect, useState } from "react";

export default function Particles() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!viewport.width) return null; // skip server-side render

  return (
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
  );
}
