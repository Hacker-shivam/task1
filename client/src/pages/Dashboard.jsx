import { useEffect, useState } from "react";
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

export default function Dashboard() {
  const [data, setData] = useState(null);

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const orderedStatus = ["New", "Interested", "Converted", "Rejected"];

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const cached = sessionStorage.getItem("dashboard");

    if (cached) {
      setData(JSON.parse(cached));
      fetchFresh();
      return;
    }

    fetchFresh();
  };

  const fetchFresh = async () => {
    try {
      const [t, s, c, srv, ins] = await Promise.all([
        API.get("/dashboard/total"),
        API.get("/dashboard/status"),
        API.get("/dashboard/city"),
        API.get("/dashboard/service"),
        API.get("/analytics"),
      ]);

      const newData = {
        total: t.data.total,
        status: s.data,
        city: c.data,
        service: srv.data,
        insights: ins.data,
      };

      setData(newData);
      sessionStorage.setItem("dashboard", JSON.stringify(newData));
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <Skeleton />;

  const { total, status, city, service, insights } = data;

  const sortedStatus = orderedStatus.map(
    (name) => status.find((s) => s._id === name) || { _id: name, count: 0 }
  );

  const COLORS_LIGHT = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];
  const COLORS_DARK = ["#818cf8", "#4ade80", "#fbbf24", "#f87171"];
  const chartColors = dark ? COLORS_DARK : COLORS_LIGHT;

  return (
    <div className="
      min-h-screen 
      bg-white 
      dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
      px-4 sm:px-6 lg:px-10 py-6
    ">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor your leads and performance insights
          </p>
        </div>

        <button
          onClick={() => setDark(!dark)}
          className="px-4 py-2 rounded-lg border text-sm dark:bg-gray-800 dark:text-white"
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <PremiumCard title="Total" value={total} gradient="from-indigo-500 to-purple-500" />

        {sortedStatus.map((s) => (
          <PremiumCard
            key={s._id}
            title={s._id}
            value={s.count}
            gradient="from-blue-500 to-cyan-400"
          />
        ))}
      </div>

      {/* INSIGHTS */}
      {insights && (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Insights
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <InsightBox label="Top City" value={insights.top_city} />
            <InsightBox label="Top Service" value={insights.top_service} />
            <InsightBox label="Conversion Rate" value={`${insights.conversion_rate}%`} />
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Most leads are coming from <b>{insights.top_city}</b>. Top service is{" "}
            <b>{insights.top_service}</b>. Conversion rate is{" "}
            <b>{insights.conversion_rate}%</b>.
          </p>
        </div>
      )}

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <ChartBox title="Status Breakdown">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={status} dataKey="count" nameKey="_id">
                {status.map((entry, index) => (
                  <Cell key={index} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: dark ? "#1f2937" : "#fff",
                  border: "none",
                  color: dark ? "#fff" : "#000",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="City Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={city}>
              <XAxis dataKey="_id" stroke={dark ? "#0000FF" : "#0000FF"} />
              <YAxis stroke={dark ? "#000000" : "#0000000"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: dark ? "#1f2937" : "#fff",
                  border: "none",
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {city.map((entry, index) => (
                  <Cell key={index} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Service Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={service}>
              <XAxis dataKey="_id" stroke={dark ? "#0000FF" : "#0000FF"} />
              <YAxis stroke={dark ? "#000000" : "#000000"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: dark ? "#1f2937" : "#fff",
                  border: "none",
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {service.map((entry, index) => (
                  <Cell key={index} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function PremiumCard({ title, value, gradient }) {
  return (
    <div className={`p-4 rounded-xl text-white shadow-lg bg-gradient-to-br ${gradient} hover:scale-[1.03] transition`}>
      <p className="text-xs opacity-80">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}

function InsightBox({ label, value }) {
  return (
    <div className="bg-gradient-to-r from-sky-200 via-sky-300 to-indigo-300 dark:bg-gray-800 rounded-xl p-4 shadow">
      <p className="text-gray-600 text-xs">{label}</p>
      <p className="text-lg font-semibold text-gray-800 dark:text-white">{value}</p>
    </div>
  );
}

function ChartBox({ title, children }) {
  return (
    <div className="bg-gradient-to-r from-sky-200 via-sky-300 to-indigo-300 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-5 rounded-2xl shadow hover:shadow-xl transition">
      <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="p-6 animate-pulse space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-60 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}