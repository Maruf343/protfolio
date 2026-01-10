"use client"

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * InteractiveDashboard
 * - Shows project stats with Chart.js (bar + line charts)
 * - Styled with Tailwind CSS and animated using Framer Motion
 * - Uses sample data but accepts `data` prop for future wiring
 *
 * Props:
 *  - data (optional) = { completedProjects: [...months], demoOrders: [...months], contributions: [...months] }
 */
export default function InteractiveDashboard({ data = null }) {
  // Sample month labels
  const labels = useMemo(() => {
    return [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  }, []);

  // Default/sample data
  const sample = useMemo(() => {
    return {
      completedProjects: [2, 1, 3, 2, 4, 3, 5, 2, 4, 6, 3, 4],
      demoOrders: [12, 9, 14, 15, 11, 20, 22, 18, 25, 28, 24, 30],
      contributions: [4, 6, 5, 9, 12, 8, 10, 6, 11, 14, 9, 13],
    };
  }, []);

  const dataset = data ?? sample;

  // --- THEMES -------------------------------------------------------------
  const THEMES = {
    indigo_emerald: {
      name: "Indigo • Emerald",
      bg: "linear-gradient(180deg,#ffffff 0%,#eef2ff 100%)",
      titleColor: "#0f172a",
      subtitleColor: "#6b7280",
      cardBg: "#ffffff",
      cardText: "#0f172a",
      primary: "rgba(79,70,229,0.9)",
      secondary: "rgba(16,185,129,0.9)",
      accent: "rgba(99,102,241,0.12)",
    },
    slate_cyan: {
      name: "Slate • Cyan",
      bg: "linear-gradient(180deg,#f8fafc 0%,#ecfeff 100%)",
      titleColor: "#0f172a",
      subtitleColor: "#475569",
      cardBg: "#f8fafc",
      cardText: "#0f172a",
      primary: "rgba(15,23,42,0.95)",
      secondary: "rgba(6,182,212,0.95)",
      accent: "rgba(6,182,212,0.12)",
    },
    rose_gold: {
      name: "Rose • Gold",
      bg: "linear-gradient(180deg,#fff7f9 0%,#fffaf0 100%)",
      titleColor: "#3f3f46",
      subtitleColor: "#7c2d12",
      cardBg: "#fffaf0",
      cardText: "#3f3f46",
      primary: "rgba(244,63,94,0.95)",
      secondary: "rgba(245,158,11,0.95)",
      accent: "rgba(244,63,94,0.12)",
    },
    solarized: {
      name: "Solarized",
      bg: "linear-gradient(180deg,#fdf6e3 0%,#fffef9 100%)",
      titleColor: "#073642",
      subtitleColor: "#586e75",
      cardBg: "#fffef9",
      cardText: "#073642",
      primary: "rgba(38,139,210,0.95)",
      secondary: "rgba(133,153,0,0.95)",
      accent: "rgba(38,139,210,0.12)",
    },
  };

  const [themeKey, setThemeKey] = React.useState("indigo_emerald");
  const theme = THEMES[themeKey] || THEMES.indigo_emerald;

  const barData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Completed Projects",
          data: dataset.completedProjects,
          backgroundColor: theme.primary,
          borderRadius: 6,
          barThickness: 18,
        },
        {
          label: "Demo Orders",
          data: dataset.demoOrders,
          backgroundColor: theme.secondary,
          borderRadius: 6,
          barThickness: 18,
        },
      ],
    }),
    [labels, dataset, themeKey]
  );

  const lineData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Contributions",
          data: dataset.contributions,
          fill: true,
          backgroundColor: theme.accent,
          borderColor: theme.primary,
          tension: 0.25,
          pointRadius: 3,
        },
      ],
    }),
    [labels, dataset, themeKey]
  );

  const barOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: false },
        tooltip: { mode: "index", intersect: false },
      },
      interaction: { mode: "nearest", axis: "x", intersect: false },
      scales: {
        x: { stacked: false, grid: { display: false } },
        y: { stacked: false, beginAtZero: true, grid: { color: "rgba(200,200,200,0.06)" } },
      },
    }),
    []
  );

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
    }),
    []
  );

  // Small stat values for top cards
  const totalCompleted = dataset.completedProjects.reduce((a, b) => a + b, 0);
  const totalDemos = dataset.demoOrders.reduce((a, b) => a + b, 0);
  const totalContrib = dataset.contributions.reduce((a, b) => a + b, 0);

  // --- admin auth state ---
  const [authenticated, setAuthenticated] = React.useState(null); // null = loading, false = not authed, true = authed
  const [password, setPassword] = React.useState("");
  const [loadingAuth, setLoadingAuth] = React.useState(false);

  React.useEffect(() => {
    // check session
    let mounted = true;
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return;
        setAuthenticated(Boolean(j?.authenticated));
      })
      .catch(() => mounted && setAuthenticated(false));
    return () => {
      mounted = false;
    };
  }, []);

  const doLogin = async (e) => {
    e?.preventDefault();
    setLoadingAuth(true);
    try {
      const resp = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (resp.ok) {
        setAuthenticated(true);
      } else {
        const j = await resp.json();
        alert(j?.message || "Invalid password");
      }
    } catch (err) {
      alert("Login error");
    } finally {
      setLoadingAuth(false);
    }
  };

  const doLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      // ignore
    }
    setAuthenticated(false);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ background: theme.bg }}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: theme.titleColor }}>Interactive Dashboard</h2>
            <p className="text-sm" style={{ color: theme.subtitleColor }}>Summary of recent project activity</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme selector */}
            <div className="flex items-center gap-2">
              {Object.keys(THEMES).map((k) => (
                <button
                  key={k}
                  title={THEMES[k].name}
                  onClick={() => setThemeKey(k)}
                  className={`w-8 h-8 rounded-md ring-1 ring-slate-200`} 
                  style={{ background: `linear-gradient(180deg, ${THEMES[k].primary}, ${THEMES[k].secondary})`, border: themeKey===k? '2px solid rgba(0,0,0,0.08)':'none' }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            className="shadow-sm rounded-lg p-4 flex flex-col"
            whileHover={{ scale: 1.02 }}
            style={{ background: theme.cardBg, color: theme.cardText }}
          >
            <div className="text-sm" style={{ color: theme.subtitleColor }}>Completed Projects</div>
            <div className="mt-2 flex items-end gap-3">
              <div className="text-2xl font-bold" style={{ color: theme.primary }}>{totalCompleted}</div>
              <div className="text-sm text-slate-400">this year</div>
            </div>
          </motion.div>

          <motion.div
            className="shadow-sm rounded-lg p-4 flex flex-col"
            whileHover={{ scale: 1.02 }}
            style={{ background: theme.cardBg, color: theme.cardText }}
          >
            <div className="text-sm" style={{ color: theme.subtitleColor }}>Demo Orders</div>
            <div className="mt-2 flex items-end gap-3">
              <div className="text-2xl font-bold" style={{ color: theme.secondary }}>{totalDemos}</div>
              <div className="text-sm text-slate-400">this year</div>
            </div>
          </motion.div>

          <motion.div
            className="shadow-sm rounded-lg p-4 flex flex-col"
            whileHover={{ scale: 1.02 }}
            style={{ background: theme.cardBg, color: theme.cardText }}
          >
            <div className="text-sm" style={{ color: theme.subtitleColor }}>Contributions</div>
            <div className="mt-2 flex items-end gap-3">
              <div className="text-2xl font-bold" style={{ color: theme.primary }}>{totalContrib}</div>
              <div className="text-sm text-slate-400">this year</div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Monthly Overview</h3>
            <Bar data={barData} options={barOptions} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Contribution Trend</h3>
            <Line data={lineData} options={lineOptions} />
          </motion.div>
        </div>

        <div className="text-xs text-slate-400 mt-2">Tip: pass a `data` prop to populate charts from a backend or GitHub/NPM stats.</div>
      </motion.div>
    </section>
  );
}
