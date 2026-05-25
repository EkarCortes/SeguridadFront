import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import AccessTable from "../../components/Home/AccessTable";
import AccessChart from "../../components/Home/AccessChart";
import DonutChart from "../../components/Home/DonutChart";
import StatsCards from "../../components/Home/StatsCards";
import { useHomeData } from "../../hooks/home/useHomeData";
import { useMonthlyStats } from "../../hooks/home/useMonthlyStats";
import { useMonthlySelection } from "../../hooks/home/useMonthlySelection";

interface SelectOption { value: string | number; label: string }
interface CustomSelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function CustomSelect({ options, value, onChange, disabled }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = options.find(o => String(o.value) === String(value));

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          height: 28,
          padding: "0 8px",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          background: open ? "#f8fafc" : "#f8fafc",
          color: "#475569",
          fontSize: 12,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          cursor: disabled ? "not-allowed" : "pointer",
          outline: "none",
          whiteSpace: "nowrap",
          opacity: disabled ? 0.5 : 1,
          transition: "border-color 0.15s",
          borderColor: open ? "#cbd5e1" : "#e2e8f0",
        }}
      >
        {selected?.label ?? "—"}
        <ChevronDown
          size={12}
          strokeWidth={2}
          style={{ transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "rotate(0deg)", color: "#94a3b8" }}
        />
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          right: 0,
          minWidth: "100%",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          boxShadow: "0 4px 16px rgba(15,23,42,0.10)",
          zIndex: 50,
          overflow: "hidden",
          padding: "4px 0",
        }}>
          {options.map(opt => {
            const isActive = String(opt.value) === String(value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(String(opt.value)); setOpen(false); }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "7px 12px",
                  fontSize: 12.5,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#0f172a" : "#475569",
                  background: isActive ? "#f1f5f9" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const Dashboard = () => {
  const { totalData, loading, error } = useHomeData();
  const { monthlyStats, loading: monthlyLoading, error: monthlyError, refetch } = useMonthlyStats();

  const {
    years,
    months,
    selectedYear,
    selectedMonth,
    handleYearChange,
    handleMonthChange,
    currentMonthData
  } = useMonthlySelection(monthlyStats, refetch);

  

  return (
    <div className="w-full min-h-[600px] p-2 md:p-4">
      <div className="flex flex-col gap-4 w-full">
        <StatsCards />
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 min-h-[370px] flex flex-col">
            <AccessChart totalData={totalData} loading={loading} error={error} />
          </div>

          <div className="w-full md:w-[320px] bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col" style={{ minHeight: "370px" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-base font-bold text-slate-800" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {currentMonthData?.mes_nombre ?? "—"} {selectedYear}
              </span>
              <div className="flex gap-1.5">
                <CustomSelect
                  options={years.length === 0 ? [{ value: "", label: "—" }] : years.map(y => ({ value: y, label: String(y) }))}
                  value={selectedYear ?? ""}
                  onChange={handleYearChange}
                  disabled={years.length === 0}
                />
                <CustomSelect
                  options={months.length === 0 ? [{ value: "", label: "—" }] : months.map(s => ({ value: s.mes, label: s.mes_nombre }))}
                  value={selectedMonth ?? ""}
                  onChange={handleMonthChange}
                  disabled={months.length === 0}
                />
              </div>
            </div>

            <DonutChart
              monthlyData={currentMonthData ?? {
                autorizados: 0,
                rechazados: 0,
                total_verificaciones: 0,
                tasa_autorizacion: 0,
                mes_nombre: 'Sin datos',
                personas_unicas: 0,
              }}
              loading={monthlyLoading}
              error={monthlyError}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <AccessTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;