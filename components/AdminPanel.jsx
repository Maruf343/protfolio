
"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiHome, FiSettings, FiGithub, FiGrid, FiBarChart2, FiLogOut } from 'react-icons/fi';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildMonthlyFromProjects(projects = []) {
	const counts = new Array(12).fill(0);
	const now = new Date();
	const currentYear = now.getFullYear();
	projects.forEach((p) => {
		try {
			const d = new Date(p.createdAt);
			if (d.getFullYear() === currentYear) counts[d.getMonth()] = (counts[d.getMonth()] || 0) + 1;
		} catch (e) {}
	});
	return counts;
}

function colorForValue(v, max) {
	if (!max) return "#f3f4f6";
	const t = Math.min(v / max, 1);
	const r = Math.floor(255 * t);
	const g = Math.floor(200 * (1 - t));
	const b = 80;
	return `rgb(${r},${g},${b})`;
}

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";

export default function AdminPanel() {
	const [auth, setAuth] = React.useState(null);
	const [password, setPassword] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const [stats, setStats] = React.useState(null);
	const [projects, setProjects] = React.useState([]);
	const [newProjectTitle, setNewProjectTitle] = React.useState("");
	const [settings, setSettings] = React.useState(null);
	const [heatmap, setHeatmap] = React.useState([]);
	const [heatmapEditing, setHeatmapEditing] = React.useState(null);
	// UI state
	const [page, setPage] = React.useState('dashboard');
	const [githubRepos, setGithubRepos] = React.useState([]);
	const [communityPosts, setCommunityPosts] = React.useState([]);
	const [searchQuery, setSearchQuery] = React.useState('');
	const [editingProjectId, setEditingProjectId] = React.useState(null);
	const [editingProjectFields, setEditingProjectFields] = React.useState({});

	// Theme support
	const THEMES = {
		light: {
			name: 'Light',
			panelBg: '#f8fafc',
			sidebarBg: '#ffffff',
			sidebarText: '#0f172a',
			contentBg: '#ffffff',
			cardBg: '#ffffff',
			cardText: '#0f172a',
			textColor: '#0f172a',
			accent: '#4f46e5',
		},
		dark: {
			name: 'Dark',
			panelBg: '#0f172a',
			sidebarBg: '#0b1220',
			sidebarText: '#e6eef8',
			contentBg: '#071127',
			cardBg: '#0b1220',
			cardText: '#e6eef8',
			textColor: '#e6eef8',
			accent: '#06b6d4',
		},
		indigo: {
			name: 'Indigo',
			panelBg: '#eef2ff',
			sidebarBg: '#eef2ff',
			sidebarText: '#0f172a',
			contentBg: '#ffffff',
			cardBg: '#ffffff',
			cardText: '#0f172a',
			textColor: '#0f172a',
			accent: '#4f46e5',
		},
		indigo_dark: {
			name: 'Indigo (Dark)',
			panelBg: '#0b1220',
			sidebarBg: '#071044',
			sidebarText: '#e6eef8',
			contentBg: '#071127',
			cardBg: '#071127',
			cardText: '#e6eef8',
			textColor: '#e6eef8',
			accent: '#8b5cf6',
		},
		rose: {
			name: 'Rose • Gold',
			panelBg: '#fff7f9',
			sidebarBg: '#fffaf0',
			sidebarText: '#3f3f46',
			contentBg: '#ffffff',
			cardBg: '#fffaf0',
			cardText: '#3f3f46',
			textColor: '#3f3f46',
			accent: '#f43f5e',
		},
		solarized: {
			name: 'Solarized',
			panelBg: '#fdf6e3',
			sidebarBg: '#fffef9',
			sidebarText: '#073642',
			contentBg: '#fffef9',
			cardBg: '#fffef9',
			cardText: '#073642',
			textColor: '#073642',
			accent: '#268bd2',
		},
	};

	const [themeKey, setThemeKey] = React.useState(() => {
		try { return localStorage.getItem('adminTheme') || 'light' } catch(e){ return 'light' }
	});
	const theme = THEMES[themeKey] || THEMES.light;

	React.useEffect(()=>{
		try{ localStorage.setItem('adminTheme', themeKey) }catch(e){}
	},[themeKey]);

	// Font/template options
	const FONT_OPTIONS = {
		Inter: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
		Serif: 'Georgia, ui-serif, "Times New Roman", Times, serif',
		Mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Helvetica Neue", monospace',
	};

	const [fontKey, setFontKey] = React.useState(() => {
		try { return localStorage.getItem('adminFont') || 'Inter' } catch(e){ return 'Inter' }
	});
	const fontFamily = FONT_OPTIONS[fontKey] || FONT_OPTIONS.Inter;

	React.useEffect(()=>{
		try{ localStorage.setItem('adminFont', fontKey) }catch(e){}
	},[fontKey]);

	// load community posts from localStorage on mount
	React.useEffect(()=>{
		try{
			const raw = localStorage.getItem('communityPosts');
			if(raw) setCommunityPosts(JSON.parse(raw));
		} catch(e) { setCommunityPosts([]); }
	},[]);

	// Template presets (each preset sets a themeKey, fontKey and site settings)
	const TEMPLATES = {
		modern: {
			name: 'Modern Dark',
			description: 'Sleek dark layout with bold typography and accent actions.',
			theme: 'indigo_dark',
			font: 'Inter',
			settings: {
				siteTitle: 'My Portfolio - Modern',
				heroText: 'Building delightful web experiences.',
				aboutText: 'I am a frontend engineer focused on performant, accessible web apps.',
				primaryTextColor: '#e6eef8',
				secondaryTextColor: '#94a3b8',
				linkColor: '#8b5cf6',
				ctaText: 'Work with me',
				ctaUrl: '/contact'
			}
		},
		clean: {
			name: 'Clean Light',
			description: 'Minimal, airy layout with emphasis on content and whitespace.',
			theme: 'light',
			font: 'Serif',
			settings: {
				siteTitle: 'My Portfolio',
				heroText: 'I craft websites and apps that scale.',
				aboutText: 'Designer & Developer. I focus on UX and performance.',
				primaryTextColor: '#0f172a',
				secondaryTextColor: '#6b7280',
				linkColor: '#4f46e5',
				ctaText: 'See my work',
				ctaUrl: '/projects'
			}
		},
		corporate: {
			name: 'Professional',
			description: 'Corporate-ready palette with clear CTAs and strong hierarchy.',
			theme: 'indigo',
			font: 'Inter',
			settings: {
				siteTitle: 'Company Portfolio',
				heroText: 'Delivering reliable engineering solutions.',
				aboutText: 'We build scalable systems for modern businesses.',
				primaryTextColor: '#0f172a',
				secondaryTextColor: '#475569',
				linkColor: '#4f46e5',
				ctaText: 'Contact Sales',
				ctaUrl: '/contact'
			}
		},
		creative: {
			name: 'Creative Studio',
			description: 'Colorful and expressive, ideal for designers and studios.',
			theme: 'rose',
			font: 'Serif',
			settings: {
				siteTitle: 'Creative Works',
				heroText: 'Ideas brought to life through design.',
				aboutText: 'Studio specializing in brand and digital experiences.',
				primaryTextColor: '#3f3f46',
				secondaryTextColor: '#7c2d12',
				linkColor: '#f43f5e',
				ctaText: 'View Portfolio',
				ctaUrl: '/projects'
			}
		}
	};

	function applyTemplate(key, save = false) {
		const t = TEMPLATES[key];
		if (!t) return;
		setThemeKey(t.theme);
		setFontKey(t.font);
		setSettings(Object.assign({}, settings || {}, t.settings));
		if (save) {
			// persist both theme/font and settings
			saveThemeAndFont();
			saveSettings();
		}
	}

	React.useEffect(() => {
		fetch(`${SERVER}/api/session`, { credentials: "include" })
			.then((r) => r.json())
			.then((j) => setAuth(Boolean(j?.authenticated)))
			.catch(() => setAuth(false));
	}, []);

	React.useEffect(() => {
		if (auth) fetchAll();
	}, [auth]);

	// Fetch GitHub repos when the GitHub page is active. Keep this hook
	// declared unconditionally to preserve the hooks call order.

	async function fetchGithub() {
		try {
			const res = await fetch('https://api.github.com/users/Maruf343/repos');
			if (!res.ok) throw new Error('github fetch failed');
			const list = await res.json();
			const sorted = list.sort((a,b)=>b.stargazers_count - a.stargazers_count).slice(0,12);
			setGithubRepos(sorted);
		} catch (e) {
			setGithubRepos([]);
		}
	}

	React.useEffect(()=>{
		if (auth && page === 'github') fetchGithub();
	},[auth, page]);


	async function fetchAll() {
		await Promise.all([fetchStats(), fetchSettings(), fetchHeatmap()]);
	}

	async function fetchStats() {
		try {
			const r = await fetch(`${SERVER}/api/dashboard/stats`, { credentials: "include" });
			if (!r.ok) throw new Error("unauth");
			const j = await r.json();
			setStats(j);
			setProjects(j.projects || []);
		} catch (err) {
			setStats(null);
		}
	}

	async function fetchSettings() {
		try {
			const r = await fetch(`${SERVER}/api/site-settings`, { credentials: "include" });
			if (!r.ok) throw new Error("no settings");
			const s = await r.json();
			setSettings(s);
			if (s?.theme) setThemeKey(s.theme);
			if (s?.font) setFontKey(s.font);
		} catch (e) {
			setSettings(null);
		}
	}

	async function saveSettings() {
		const r = await fetch(`${SERVER}/api/site-settings`, {
			method: "PUT",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(settings || {}),
		});
		if (!r.ok) return alert("Failed to save settings");
		setSettings(await r.json());
		alert("Settings saved");
	}

	async function saveThemeAndFont() {
		// requires auth (protected)
		const payload = Object.assign({}, settings || {}, { theme: themeKey, font: fontKey });
		const r = await fetch(`${SERVER}/api/site-settings`, {
			method: "PUT",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (!r.ok) return alert("Failed to save theme");
		const updated = await r.json();
		setSettings(updated);
		alert("Theme saved");
	}

	async function fetchHeatmap() {
		try {
			const r = await fetch(`${SERVER}/api/visits/heatmap`, { credentials: "include" });
			if (!r.ok) throw new Error("no heatmap");
			const h = await r.json();
			setHeatmap(h);
			setHeatmapEditing(JSON.parse(JSON.stringify(h)));
		} catch (e) {
			setHeatmap([]);
			setHeatmapEditing([]);
		}
	}

	async function saveHeatmap() {
		const r = await fetch(`${SERVER}/api/visits/heatmap`, {
			method: "PUT",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(heatmapEditing || []),
		});
		if (!r.ok) return alert("Failed to save heatmap");
		const h = await r.json();
		setHeatmap(h);
		setHeatmapEditing(JSON.parse(JSON.stringify(h)));
		alert("Heatmap saved");
	}

	async function doLogin(e) {
		e?.preventDefault();
		setLoading(true);
		try {
			// quick health check - if backend unreachable show clearer message
			try {
				const health = await fetch(`${SERVER}/api/health`, { method: 'GET' , cache: 'no-store' , mode: 'cors'});
				if (!health.ok) throw new Error('health-fail');
			} catch (pingErr) {
				console.error('Backend health check failed', pingErr);
				alert(`Cannot reach backend at ${SERVER}. Make sure the backend is running and accessible.`);
				setAuth(false);
				return;
			}

			const r = await fetch(`${SERVER}/api/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ password }),
			});
			const body = await r.json().catch(() => ({}));
			if (!r.ok) {
				// show server-provided message when available
				alert(body?.message || "Invalid password");
				setAuth(false);
				return;
			}
			setAuth(true);
			setPassword("");
			await fetchAll();
		} catch (err) {
			console.error(err);
			// network errors will be caught earlier; fallback message
			alert("Login failed — check console and ensure backend is running and CORS allows requests.");
			setAuth(false);
		} finally {
			setLoading(false);
		}
	}

	async function doLogout() {
		await fetch(`${SERVER}/api/logout`, { method: "POST", credentials: "include" });
		setAuth(false);
		setStats(null);
	}

	async function addProject(e) {
		e?.preventDefault();
		if (!newProjectTitle) return;
		const payload = { title: newProjectTitle, createdAt: new Date().toISOString() };
		const r = await fetch(`${SERVER}/api/projects`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(payload),
		});
		if (r.ok) {
			const p = await r.json();
			setProjects((s) => [p, ...s]);
			setNewProjectTitle("");
			fetchStats();
		} else alert("Failed to add project");
	}

	async function deleteProject(id) {
		if (!confirm("Delete this project?")) return;
		const r = await fetch(`${SERVER}/api/projects/${id}`, { method: "DELETE", credentials: "include" });
		if (r.ok) setProjects((s) => s.filter((p) => p.id !== id));
		else alert("Failed to delete");
		fetchStats();
	}

	function startEditProject(p) {
		setEditingProjectId(p.id);
		setEditingProjectFields({
			id: p.id,
			title: p.title || "",
			description: p.description || "",
			image: p.image || "",
			url: p.url || "",
			createdAt: p.createdAt || new Date().toISOString(),
		});
	}

	function cancelEdit() {
		setEditingProjectId(null);
		setEditingProjectFields({});
	}

	async function saveProject() {
		const id = editingProjectId;
		if (!id) return;
		const r = await fetch(`${SERVER}/api/projects/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(editingProjectFields),
		});
		if (!r.ok) return alert("Failed to save project");
		const updated = await r.json();
		setProjects((s) => s.map((p) => (p.id === id ? updated : p)));
		setEditingProjectId(null);
		setEditingProjectFields({});
		fetchStats();
	}

	// --- Admin utilities for community/local data ---

	function loadCommunityPosts() {
		try{
			const raw = localStorage.getItem('communityPosts');
			if(raw) setCommunityPosts(JSON.parse(raw));
			else setCommunityPosts([]);
		} catch(e) { setCommunityPosts([]); }
	}

	function exportPosts() {
		try{
			const data = {
				communityPosts: JSON.parse(localStorage.getItem('communityPosts') || '[]'),
				promptHistory: JSON.parse(localStorage.getItem('promptHistory') || '[]'),
				assistantHistory: JSON.parse(localStorage.getItem('assistantHistory') || '[]'),
				aiLeaderboard: JSON.parse(localStorage.getItem('aiLeaderboard') || '[]'),
			};
			const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `admin-export-${new Date().toISOString()}.json`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
			alert('Export started (JSON)');
		} catch(e) { console.error(e); alert('Export failed'); }
	}

	function clearLocalData() {
		if(!confirm('Clear admin local demo data (community posts, AI playground history)? This cannot be undone.')) return;
		try{
			localStorage.removeItem('communityPosts');
			localStorage.removeItem('promptHistory');
			localStorage.removeItem('assistantHistory');
			localStorage.removeItem('aiLeaderboard');
			localStorage.removeItem('aiVsVotes');
			setCommunityPosts([]);
			alert('Cleared local demo data');
		} catch(e){ console.error(e); alert('Failed to clear'); }
	}

	function refreshData() {
		fetchAll();
		loadCommunityPosts();
	}

	function deleteLocalPost(id) {
		if(!confirm('Delete this local post?')) return;
		try{
			const list = JSON.parse(localStorage.getItem('communityPosts') || '[]').filter(p=>p.id !== id);
			localStorage.setItem('communityPosts', JSON.stringify(list));
			setCommunityPosts(list);
		} catch(e){ console.error(e); alert('Failed to delete'); }
	}

	if (auth === null) {
		return <div className="p-6">Checking session...</div>;
	}

	if (!auth) {
		return (
			<div className="max-w-md mx-auto p-6">
				<motion.form
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					className="shadow rounded-lg p-6"
					style={{ background: theme.contentBg, color: theme.textColor }}
					onSubmit={doLogin}
				>
					<h3 className="text-lg font-semibold mb-2">Admin Login</h3>
					<input
						className="w-full p-2 rounded border mb-3 bg-white dark:bg-slate-700"
						placeholder="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<div className="flex items-center gap-2">
						<button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>
							{loading ? "Signing in..." : "Sign In"}
						</button>
					</div>
				</motion.form>
			</div>
		);
	}



		const monthlyProjects = buildMonthlyFromProjects(projects || []);
		const maxHeat = (heatmapEditing || []).flat().reduce((a,b)=>Math.max(a,b||0),0) || 1;

		const barData = {
			labels: MONTHS,
			datasets: [
				{
					label: "Completed Projects",
					data: monthlyProjects,
					backgroundColor: MONTHS.map((m,i)=>`hsl(${(i/12)*360} 80% 50%)`),
					borderRadius: 6,
				},
			],
		};

		const lineData = {
			labels: MONTHS,
			datasets: [
				{
					label: "Contributions (approx)",
					data: monthlyProjects.map((v)=>v * 2 + Math.floor(Math.random()*3)),
					fill: true,
					backgroundColor: "rgba(99,102,241,0.12)",
					borderColor: "rgba(99,102,241,1)",
				},
			],
		};

		return (
			<div className="bg-transparent flex justify-center items-start" style={{ background: theme.panelBg, color: theme.textColor, fontFamily }}>
				{/* fixed-size admin panel (responsive fallback via maxWidth) */}
				<div className="grid grid-cols-12 gap-20" style={{ width: '1300px', height: '560px', maxWidth: '100%', overflow: 'hidden' }}>
					<aside className="col-span-12 lg:col-span-3 xl:col-span-2 rounded-lg p-4 shadow" style={{ background: theme.sidebarBg, color: theme.sidebarText, height: '100%', overflowY: 'auto', minWidth: 220 }}>
						<div className="flex items-center gap-3 mb-6">
							<div className="h-10 w-10 rounded bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-bold">AD</div>
							<div>
								<div className="font-semibold">Admin</div>
								<div className="text-xs text-slate-400">@Maruf343</div>
							</div>
						</div>

						<nav className="space-y-1">
							<button onClick={()=>setPage('dashboard')} className={`w-full flex items-center gap-3 p-2 rounded`} style={{ color: theme.sidebarText, borderLeft: page==='dashboard' ? `4px solid ${theme.accent}` : '4px solid transparent', background: page==='dashboard' ? theme.cardBg : 'transparent' }}>
								<FiHome /> <span>Dashboard</span>
							</button>
							<button onClick={()=>setPage('projects')} className={`w-full flex items-center gap-3 p-2 rounded`} style={{ color: theme.sidebarText, borderLeft: page==='projects' ? `4px solid ${theme.accent}` : '4px solid transparent', background: page==='projects' ? theme.cardBg : 'transparent' }}>
								<FiGrid /> <span>Projects</span>
							</button>
							<button onClick={()=>setPage('github')} className={`w-full flex items-center gap-3 p-2 rounded`} style={{ color: theme.sidebarText, borderLeft: page==='github' ? `4px solid ${theme.accent}` : '4px solid transparent', background: page==='github' ? theme.cardBg : 'transparent' }}>
								<FiGithub /> <span>GitHub</span>
							</button>
							<button onClick={()=>setPage('heatmap')} className={`w-full flex items-center gap-3 p-2 rounded`} style={{ color: theme.sidebarText, borderLeft: page==='heatmap' ? `4px solid ${theme.accent}` : '4px solid transparent', background: page==='heatmap' ? theme.cardBg : 'transparent' }}>
								<FiBarChart2 /> <span>Heatmap</span>
							</button>
							<button onClick={()=>setPage('settings')} className={`w-full flex items-center gap-3 p-2 rounded`} style={{ color: theme.sidebarText, borderLeft: page==='settings' ? `4px solid ${theme.accent}` : '4px solid transparent', background: page==='settings' ? theme.cardBg : 'transparent' }}>
								<FiSettings /> <span>Settings</span>
							</button>
							<button onClick={()=>setPage('templates')} className={`w-full flex items-center gap-3 p-2 rounded`} style={{ color: theme.sidebarText, borderLeft: page==='templates' ? `4px solid ${theme.accent}` : '4px solid transparent', background: page==='templates' ? theme.cardBg : 'transparent' }}>
								<FiGrid /> <span>Templates</span>
							</button>
							<button onClick={()=>setPage('community')} className={`w-full flex items-center gap-3 p-2 rounded`} style={{ color: theme.sidebarText, borderLeft: page==='community' ? `4px solid ${theme.accent}` : '4px solid transparent', background: page==='community' ? theme.cardBg : 'transparent' }}>
								<FiGrid /> <span>Community</span>
							</button>
						</nav>

						<div className="mt-6 border-t pt-4">
							<button onClick={doLogout} className="w-full flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded"><FiLogOut/> Logout</button>
						</div>
					</aside>

					<main className="col-span-12 lg:col-span-9 xl:col-span-10" style={{ height: '100%', overflowY: 'auto' }}>
						<div className="rounded-lg p-4 shadow mb-6" style={{ background: theme.contentBg, color: theme.textColor }}>
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-lg font-semibold">{page === 'dashboard' ? 'Dashboard' : page === 'projects' ? 'Projects' : page === 'github' ? 'GitHub' : page === 'heatmap' ? 'Heatmap' : 'Settings'}</h1>
									<div className="text-sm" style={{ color: theme.accent }}>Welcome back — manage your site</div>
								</div>
								<div className="flex items-center gap-3">
									<select value={themeKey} onChange={(e)=>setThemeKey(e.target.value)} className="p-2 rounded border">
										{Object.keys(THEMES).map(k=> <option key={k} value={k}>{THEMES[k].name}</option>)}
									</select>
									<select value={fontKey} onChange={(e)=>setFontKey(e.target.value)} className="p-2 rounded border">
										{Object.keys(FONT_OPTIONS).map(k=> <option key={k} value={k}>{k}</option>)}
									</select>
									<button onClick={saveThemeAndFont} className="px-3 py-2 bg-indigo-600 text-white rounded">Save</button>
									<button onClick={exportPosts} className="px-3 py-2 bg-green-600 text-white rounded">Export</button>
									<button onClick={clearLocalData} className="px-3 py-2 bg-red-600 text-white rounded">Clear Local</button>
									<button onClick={refreshData} className="px-3 py-2 bg-gray-200 text-black rounded">Refresh</button>
								</div>
							</div>
						</div>

						{page === 'dashboard' && (
							<>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
									<div className="rounded p-4 shadow" style={{ background: theme.cardBg, color: theme.cardText }}>
										<div className="text-sm" style={{ color: theme.accent }}>Projects</div>
										<div className="text-2xl font-bold mt-2">{stats?.totalProjects ?? '-'}</div>
									</div>
									<div className="rounded p-4 shadow" style={{ background: theme.cardBg, color: theme.cardText }}>
										<div className="text-sm" style={{ color: theme.accent }}>Visits</div>
										<div className="text-2xl font-bold mt-2">{stats?.totalVisits ?? '-'}</div>
									</div>
									<div className="rounded p-4 shadow" style={{ background: theme.cardBg, color: theme.cardText }}>
										<div className="text-sm" style={{ color: theme.accent }}>Orders</div>
										<div className="text-2xl font-bold mt-2">{stats?.totalOrders ?? '-'}</div>
									</div>
								</div>

								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
										<div className="rounded p-4 shadow" style={{ background: theme.cardBg, color: theme.cardText }}>
											<h3 className="text-sm font-medium mb-2">Monthly Projects</h3>
											<Bar data={barData} />
										</div>
										<div className="rounded p-4 shadow" style={{ background: theme.cardBg, color: theme.cardText }}>
											<h3 className="text-sm font-medium mb-2">Contributions (est)</h3>
											<Line data={lineData} />
										</div>
								</div>
							</>
						)}

						{page === 'github' && (
							<div className="rounded p-4 shadow" style={{ background: theme.cardBg, color: theme.cardText }}>
								<h3 className="text-sm font-medium mb-2">GitHub — Top repos by stars</h3>
								{githubRepos.length === 0 ? (
									<div className="text-sm text-slate-400">No data or rate-limited. Try again later.</div>
								) : (
									<Bar data={{ labels: githubRepos.map(r=>r.name), datasets:[{label:'Stars', data: githubRepos.map(r=>r.stargazers_count), backgroundColor: githubRepos.map((_,i)=>`hsl(${(i/12)*360} 70% 50%)`)}] }} />
								)}
								<div className="mt-3 text-xs text-slate-400">Data fetched from GitHub public API (no auth).</div>
							</div>
						)}

						{page === 'projects' && (
							<div className="rounded p-4 shadow" style={{ background: theme.cardBg, color: theme.cardText }}>
								<h3 className="font-medium mb-2">Projects</h3>
								<form className="flex gap-2 mb-4" onSubmit={addProject}>
									<input value={newProjectTitle} onChange={(e) => setNewProjectTitle(e.target.value)} placeholder="New project title" className="flex-1 p-2 rounded border" style={{ background: theme.cardBg, color: theme.cardText }} />
									<button className="px-4 py-2 bg-indigo-600 text-white rounded">Add</button>
								</form>
								<ul className="space-y-3">
											{projects.map((p) => (
												<li key={p.id} className="flex items-center justify-between">
													<div>
														<div className="font-medium">{p.title}</div>
														<div className="text-xs text-slate-400">{p.createdAt}</div>
													</div>
													<div className="flex items-center gap-2">
														{editingProjectId === p.id ? (
															<button onClick={cancelEdit} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
														) : (
															<button onClick={() => startEditProject(p)} className="px-3 py-1 bg-yellow-400 text-black rounded">Edit</button>
														)}
														<button onClick={() => deleteProject(p.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
													</div>
												</li>
											))}
								</ul>

									{editingProjectId && (
										<div className="mt-4 p-3 border rounded" style={{ background: theme.contentBg, color: theme.textColor }}>
											<h4 className="font-medium mb-2">Edit Project</h4>
											<div className="grid grid-cols-1 gap-2">
												<input className="p-2 rounded border" value={editingProjectFields.title || ''} onChange={(e)=>setEditingProjectFields({...editingProjectFields, title: e.target.value})} placeholder="Title" />
												<input className="p-2 rounded border" value={editingProjectFields.description || ''} onChange={(e)=>setEditingProjectFields({...editingProjectFields, description: e.target.value})} placeholder="Short description" />
												<input className="p-2 rounded border" value={editingProjectFields.url || ''} onChange={(e)=>setEditingProjectFields({...editingProjectFields, url: e.target.value})} placeholder="URL" />
												<input className="p-2 rounded border" value={editingProjectFields.image || ''} onChange={(e)=>setEditingProjectFields({...editingProjectFields, image: e.target.value})} placeholder="Image URL" />
												<div className="flex gap-2 mt-2">
													<button onClick={saveProject} className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
													<button onClick={cancelEdit} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
												</div>
											</div>
										</div>
									)}
							</div>
						)}

						{page === 'heatmap' && (
							<div className="rounded p-4 shadow" style={{ background: theme.cardBg, color: theme.cardText }}>
								<h3 className="font-medium mb-2">Visits Heatmap (click to increment)</h3>
								<div className="overflow-auto">
									<div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${(heatmapEditing?.[0]||[]).length || 24}, minmax(20px, 1fr))` }}>
										{(heatmapEditing || []).flatMap((row, rIdx) => row.map((cell, cIdx) => ({ rIdx, cIdx, val: cell })) ).map((cellObj, idx) => {
											const { rIdx, cIdx, val } = cellObj;
											const color = colorForValue(val, maxHeat);
											return (
												<div key={`${rIdx}-${cIdx}`} onClick={()=>{
													const copy = (heatmapEditing||[]).map(r=>r.slice());
													copy[rIdx][cIdx] = (copy[rIdx][cIdx]||0)+1;
													setHeatmapEditing(copy);
												}} className="h-8 border rounded" title={`Row ${rIdx} Hour ${cIdx} — ${val}`} style={{ background: color }}></div>
											);
										})}
									</div>
								</div>
								<div className="mt-3 flex gap-2">
									<button onClick={saveHeatmap} className="px-4 py-2 bg-indigo-600 text-white rounded">Save heatmap</button>
									<button onClick={()=>{ setHeatmapEditing(JSON.parse(JSON.stringify(heatmap||[]))); }} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded">Reset</button>
								</div>
							</div>
						)}

						{page === 'settings' && (
							<div className="rounded p-4 shadow" style={{ background: theme.cardBg, color: theme.cardText }}>
								<h3 className="font-medium mb-2">Site Settings</h3>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
									<input className="p-2 rounded border" value={settings?.siteTitle || ""} onChange={(e)=>setSettings({...settings, siteTitle:e.target.value})} placeholder="Site title" />
									<input className="p-2 rounded border" value={settings?.heroText || ""} onChange={(e)=>setSettings({...settings, heroText:e.target.value})} placeholder="Hero text" />
									<input className="p-2 rounded border" value={settings?.aboutText || ""} onChange={(e)=>setSettings({...settings, aboutText:e.target.value})} placeholder="About section text" />
									<input className="p-2 rounded border" value={settings?.footerText || ""} onChange={(e)=>setSettings({...settings, footerText:e.target.value})} placeholder="Footer text" />
									<input className="p-2 rounded border" value={settings?.primaryTextColor || ""} onChange={(e)=>setSettings({...settings, primaryTextColor:e.target.value})} placeholder="Primary text color (hex)" />
									<input className="p-2 rounded border" value={settings?.secondaryTextColor || ""} onChange={(e)=>setSettings({...settings, secondaryTextColor:e.target.value})} placeholder="Secondary text color (hex)" />
									<input className="p-2 rounded border" value={settings?.linkColor || ""} onChange={(e)=>setSettings({...settings, linkColor:e.target.value})} placeholder="Link color (hex)" />
									<input className="p-2 rounded border" value={settings?.ctaText || ""} onChange={(e)=>setSettings({...settings, ctaText:e.target.value})} placeholder="CTA text" />
									<input className="p-2 rounded border" value={settings?.ctaUrl || ""} onChange={(e)=>setSettings({...settings, ctaUrl:e.target.value})} placeholder="CTA URL" />
									<input className="p-2 rounded border" value={settings?.socialLinks || ""} onChange={(e)=>setSettings({...settings, socialLinks:e.target.value})} placeholder="Social links (comma separated)" />
								</div>
								<div className="mt-3 flex gap-2">
									<button onClick={saveSettings} className="px-4 py-2 bg-indigo-600 text-white rounded">Save settings</button>
									<button onClick={saveThemeAndFont} className="px-4 py-2 bg-gray-200 rounded">Save theme & font</button>
								</div>
							</div>
						)}

						{page === 'templates' && (
							<div className="rounded p-4 shadow" style={{ background: theme.cardBg, color: theme.cardText }}>
								<h3 className="font-medium mb-2">Templates</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{Object.keys(TEMPLATES).map((k) => {
										const t = TEMPLATES[k];
										return (
											<div key={k} className="p-4 rounded border shadow-sm">
												<div className="flex items-center justify-between">
													<div>
														<div className="font-semibold">{t.name}</div>
														<div className="text-sm text-slate-500">{t.description}</div>
													</div>
													<div className="flex items-center gap-2">
														<button onClick={()=>applyTemplate(k,false)} className="px-3 py-1 rounded border">Preview</button>
														<button onClick={()=>applyTemplate(k,true)} className="px-3 py-1 bg-indigo-600 text-white rounded">Apply & Save</button>
													</div>
												</div>
												<div className="mt-3 h-24 rounded" style={{ background: THEMES[t.theme]?.panelBg || theme.cardBg }}>
													{/* simple visual swatch */}
												</div>
											</div>
										)
									})}
								</div>
							</div>
						)}

						{page === 'community' && (
							<div className="rounded p-4 shadow" style={{ background: theme.cardBg, color: theme.cardText }}>
								<h3 className="font-medium mb-2">Community — Posts</h3>
								<div className="mb-3 flex gap-2">
									<input value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search posts, author or content" className="flex-1 p-2 rounded border" />
									<button onClick={() => { loadCommunityPosts(); }} className="px-3 py-2 bg-gray-200 rounded">Reload</button>
								</div>
								{(communityPosts || []).filter(p => {
									if(!searchQuery) return true;
									const q = searchQuery.toLowerCase();
									return (String(p.title || '').toLowerCase().includes(q) || String(p.author || '').toLowerCase().includes(q) || String(p.content || '').toLowerCase().includes(q));
								}).length === 0 ? (
									<div className="text-sm text-slate-400">No community posts available.</div>
								) : (
									<ul className="space-y-3">
										{(communityPosts || []).filter(p => {
											if(!searchQuery) return true;
											const q = searchQuery.toLowerCase();
											return (String(p.title || '').toLowerCase().includes(q) || String(p.author || '').toLowerCase().includes(q) || String(p.content || '').toLowerCase().includes(q));
										}).sort((a,b)=> new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).map((p)=> (
											<li key={p.id || p.createdAt || Math.random()} className="p-3 rounded border" style={{ background: theme.contentBg }}>
												<div className="flex items-start justify-between">
													<div>
														<div className="font-semibold">{p.title || 'Untitled'}</div>
														<div className="text-xs text-slate-400">by {p.author || 'Anonymous'} — {p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</div>
													</div>
													<div className="flex items-center gap-2">
														<button onClick={()=>deleteLocalPost(p.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
													</div>
												</div>
												<div className="mt-2 text-sm" style={{ color: theme.cardText }}>{p.content}</div>
											</li>
										))}
									</ul>
								)}
							</div>
						)}

						{/* AI Hub admin: observe votes, skill tracker snapshots and prompt history stored in localStorage */}
						{page === 'ai-hub' && (
							<div className="rounded p-4 shadow" style={{ background: theme.cardBg, color: theme.cardText }}>
								<h3 className="font-medium mb-2">AI Hub — Admin Observer</h3>
								<div className="grid gap-3">
									<div>
										<div className="text-sm opacity-80">AI vs Human Votes</div>
										<pre className="p-2 bg-black text-green-200 rounded mt-2">{(() => { try { return JSON.stringify(JSON.parse(localStorage.getItem('aiVsVotes')||'{}'), null, 2) } catch(e){ return '{}' } })()}</pre>
									</div>
									<div>
										<div className="text-sm opacity-80">Skill Tracker Snapshot</div>
										<pre className="p-2 bg-black text-green-200 rounded mt-2">{(() => { try { return localStorage.getItem('skillTrackerv1') || 'not set' } catch(e){ return 'error' } })()}</pre>
									</div>
									<div>
										<div className="text-sm opacity-80">Prompt Playground History</div>
										<pre className="p-2 bg-black text-green-200 rounded mt-2">{(() => { try { return localStorage.getItem('promptHistory') || '[]' } catch(e){ return 'error' } })()}</pre>
									</div>
								</div>
							</div>
						)}
					</main>
				</div>
			</div>
		);
	}

