import { BarChart2, ShieldCheck, ShieldX } from "lucide-react";

const stats = [
  {
    label: "TOTAL ACCESOS",
    value: "1,284",
    color: "#0f172a",
    icon: <BarChart2 size={22} strokeWidth={1.6} color="#94a3b8" />,
    iconBg: "#f1f5f9",
  },
  {
    label: "AUTORIZADOS",
    value: "1,156",
    color: "#16a34a",
    icon: <ShieldCheck size={22} strokeWidth={1.6} color="#16a34a" />,
    iconBg: "#f0fdf4",
  },
  {
    label: "DENEGADOS",
    value: "128",
    color: "#dc2626",
    icon: <ShieldX size={22} strokeWidth={1.6} color="#dc2626" />,
    iconBg: "#fff1f2",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 flex items-center justify-between"
        >
          <div className="flex flex-col gap-1">
            <span
              className="text-[11px] font-semibold tracking-widest"
              style={{ color: "#94a3b8", fontFamily: "'Inter', sans-serif" }}
            >
              {stat.label}
            </span>
            <span
              className="text-3xl font-bold leading-tight"
              style={{ color: stat.color, fontFamily: "'Manrope', sans-serif" }}
            >
              {stat.value}
            </span>
          </div>
          <div
            className="flex items-center justify-center rounded-xl w-10 h-10 flex-shrink-0"
            style={{ background: stat.iconBg }}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
