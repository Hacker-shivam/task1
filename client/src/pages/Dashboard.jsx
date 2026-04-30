import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { 
  Sparkles, 
  MapPin, 
  Zap, 
  TrendingUp, 
  Sun, 
  Moon, 
  Layers, 
  BarChart3, 
  PieChart as PieIcon 
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  const orderedStatus = useMemo(() => ["New", "Interested", "Converted", "Rejected"], []);

  /* ---------------- THEME OPTIMIZED ---------------- */
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  /* ---------------- OPTIMIZED LOADING ---------------- */
  useEffect(() => {
    const loadData = async () => {
      const cached = sessionStorage.getItem("dashboard");
      if (cached) {
        setData(JSON.parse(cached));
      }
      await fetchFresh();
    };
    loadData();
  }, []);

  const fetchFresh = async () => {
    try {
      const coreRequests = [
        API.get("/dashboard/total"),
        API.get("/dashboard/status"),
        API.get("/dashboard/city"),
        API.get("/dashboard/service"),
      ];

      const [t, s, c, srv] = await Promise.all(coreRequests);

      const coreUpdate = {
        total: t.data.total,
        status: s.data,
        city: c.data,
        service: srv.data,
        insights: data?.insights || null,
      };

      setData((prev) => ({ ...prev, ...coreUpdate }));

      const ins = await API.get("/analytics");
      const finalData = { ...coreUpdate, insights: ins.data };

      setData(finalData);
      sessionStorage.setItem("dashboard", JSON.stringify(finalData));
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    }
  };

  /* ---------------- DERIVED DATA ---------------- */
  const sortedStatus = useMemo(() => {
    if (!data?.status) return [];
    return orderedStatus.map(
      (name) => data.status.find((s) => s._id === name) || { _id: name, count: 0 }
    );
  }, [data, orderedStatus]);

  const chartColors = useMemo(
    () =>
      dark
        ? ["#818cf8", "#4ade80", "#fbbf24", "#f87171"]
        : ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"],
    [dark]
  );

  const aiInsights = useMemo(() => {
    if (!data?.insights) return null;
    const insights = data.insights;
    const conversion = insights.conversion_rate || 0;

    let trend = "Stable 📊";
    if (conversion >= 60) trend = "Strong Growth 🚀";
    else if (conversion >= 30) trend = "Moderate Growth 📈";
    else trend = "Needs Attention ⚠";

    return {
      summary: `Most leads are coming from ${insights.top_city}. ${insights.top_service} is the best performing service.`,
      trend,
      recommendation: conversion < 30 
        ? "Improve follow-ups and lead quality. Focus on faster response time." 
        : `Scale marketing for ${insights.top_service} service.`,
      confidence: Math.min(95, Math.max(55, conversion + 20)),
    };
  }, [data]);

  if (!data) return <Skeleton />;

  const { total, status, city, service, insights } = data;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 px-4 sm:px-6 lg:px-10 py-6 transition-colors duration-300">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Executive <span className="text-indigo-600 dark:text-indigo-400">Overview</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time performance metrics and AI analysis</p>
        </div>
        <button
          onClick={() => setDark(!dark)}
          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-10">
        <PremiumCard title="Grand Total" value={total} icon={<Layers size={16}/>} gradient="from-slate-800 to-slate-900 dark:from-indigo-600 dark:to-violet-700" />
        {sortedStatus.map((s) => (
          <PremiumCard key={s._id} title={s._id} value={s.count} gradient="from-white to-slate-50 dark:from-slate-800 dark:to-slate-900" isLight />
        ))}
      </div>

      {/* AI INSIGHTS - ULTRA PREMIUM VIEW */}
      {insights && aiInsights ? (
        <div className="relative group overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-slate-800/50 rounded-[32px] p-1 mb-10 shadow-2xl transition-all duration-500">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[32px] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          
          <div className="relative bg-white/90 dark:bg-slate-900/90 rounded-[30px] p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Intelligent Analysis
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <InsightBox label="Core Market" value={insights.top_city} icon={<MapPin className="w-5 h-5" />} color="blue" />
              <InsightBox label="Peak Service" value={insights.top_service} icon={<Zap className="w-5 h-5" />} color="purple" />
              <InsightBox label="Conversion" value={`${insights.conversion_rate}%`} icon={<TrendingUp className="w-5 h-5" />} color="emerald" />
            </div>

            <div className="relative overflow-hidden p-6 rounded-3xl border border-indigo-100 dark:border-slate-800 bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-800/50 dark:to-slate-900/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Strategic Guidance</span>
                    <div className="h-[1px] w-12 bg-indigo-200 dark:bg-slate-700"></div>
                  </div>
                  <p className="text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-semibold">
                    {aiInsights.recommendation}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                    &ldquo;{aiInsights.summary}&rdquo;
                  </p>
                </div>
                
                <div className="flex flex-col items-start md:items-end shrink-0 gap-1">
                  <div className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{aiInsights.trend}</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-1">
                    AI Confidence: {aiInsights.confidence}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-24 mb-10 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] text-slate-400 text-sm animate-pulse">
           <Sparkles className="w-4 h-4 mr-2 animate-spin-slow" />
           Synthesizing Fresh Data Insights...
        </div>
      )}

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartBox title="Status Segmentation" icon={<PieIcon size={18}/>}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={status} dataKey="count" nameKey="_id" innerRadius={60} outerRadius={80} paddingAngle={5}>
                {status.map((_, i) => (
                  <Cell key={i} fill={chartColors[i % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Geographic Distribution" icon={<MapPin size={18}/>}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={city}>
              <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis hide />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '16px', border: 'none' }} />
              <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                {city.map((_, i) => (
                  <Cell key={i} fill={chartColors[i % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Service Performance" icon={<BarChart3 size={18}/>} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={service}>
              <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis hide />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                {service.map((_, i) => (
                  <Cell key={i} fill={chartColors[i % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>
    </div>
  );
}

/* ---------------- PREMIUM COMPONENTS ---------------- */

function PremiumCard({ title, value, gradient, isLight, icon }) {
  return (
    <div className={`p-6 rounded-[24px] shadow-sm border border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br ${gradient} hover:translate-y-[-4px] transition-all duration-300 group`}>
      <div className="flex justify-between items-start mb-4">
        <p className={`text-xs font-bold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/60'}`}>{title}</p>
        <div className={`${isLight ? 'text-slate-300 dark:text-slate-600' : 'text-white/30'}`}>{icon}</div>
      </div>
      <h2 className={`text-3xl font-black ${isLight ? 'text-slate-900 dark:text-white' : 'text-white'}`}>{value}</h2>
    </div>
  );
}

function InsightBox({ label, value, icon, color }) {
  const themes = {
    blue: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    purple: "from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20",
    emerald: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
  };

  return (
    <div className={`flex items-center gap-4 p-5 rounded-3xl border bg-gradient-to-br ${themes[color]} transition-all hover:shadow-lg hover:shadow-indigo-500/5`}>
      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] font-black opacity-60 mb-0.5">{label}</p>
        <p className="text-xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function ChartBox({ title, children, icon, className = "" }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-indigo-500">{icon}</span>
        <h3 className="font-bold text-slate-800 dark:text-slate-200">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="p-10 animate-pulse space-y-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="h-12 w-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-[24px]" />
        ))}
      </div>
      <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-[32px]" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-[32px]" />
        ))}
      </div>
    </div>
  );
}