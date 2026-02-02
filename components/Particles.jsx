"use client";
import { useEffect, useState } from "react";

export default function Particles() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  if (!size.width) return null;

  return (
    <svg className="absolute inset-0 w-full h-full -z-20">
      {Array.from({ length: 30 }).map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * size.width}
          cy={Math.random() * size.height}
          r={Math.random() * 3 + 1.5}
          fill="rgba(99,102,241,0.1)"
        />
      ))}
    </svg>
  );
}
