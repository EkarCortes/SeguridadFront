import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface DonutChartProps {
  monthlyData: {
    autorizados: number;
    rechazados: number;
    total_verificaciones: number;
    tasa_autorizacion: number;
    mes_nombre: string;
    personas_unicas: number;
  };
  loading?: boolean;
  error?: string | null;
}

const COLORS = {
  Autorizados: "#22c55e",
  Rechazados: "#ef4444",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm shadow-md">
        <div className="font-semibold text-slate-700">{data.name}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.fill }} />
          <span className="text-slate-500">{data.value.toLocaleString()}</span>
          <span className="text-slate-400 text-xs">({data.payload.percentage}%)</span>
        </div>
      </div>
    );
  }
  return null;
};

const DonutChart: React.FC<DonutChartProps> = ({ monthlyData, loading, error }) => {
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-red-500 text-xl">⚠</span>
        </div>
        <span className="text-red-500 text-sm font-medium">Error al cargar datos</span>
      </div>
    );
  }

  const { autorizados, rechazados, total_verificaciones, tasa_autorizacion, personas_unicas } = monthlyData;

  const donutData = [
    {
      name: "Autorizados",
      value: autorizados,
      percentage: total_verificaciones > 0 ? ((autorizados / total_verificaciones) * 100).toFixed(1) : "0",
    },
    {
      name: "Rechazados",
      value: rechazados,
      percentage: total_verificaciones > 0 ? ((rechazados / total_verificaciones) * 100).toFixed(1) : "0",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Donut */}
      <div className="relative flex-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={false}
              strokeWidth={0}
            >
              {donutData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ zIndex: 50, outline: "none" }}
              position={{ y: -70 }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-2xl font-bold text-slate-800"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {total_verificaciones.toLocaleString()}
          </span>
          <span
            className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mt-0.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Total
          </span>
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-3 space-y-2" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            Autorizados
          </span>
          <span className="font-semibold text-slate-700">{autorizados.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
            Rechazados
          </span>
          <span className="font-semibold text-slate-700">{rechazados.toLocaleString()}</span>
        </div>

        <div className="border-t border-slate-100 pt-3 mt-1 grid grid-cols-2 gap-2 text-xs text-center">
          <div>
            <div
              className="text-slate-800 font-bold text-sm"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              {(tasa_autorizacion * 100).toFixed(1)}%
            </div>
            <div className="text-slate-400 uppercase tracking-wide text-[10px] font-semibold mt-0.5">
              Tasa éxito
            </div>
          </div>
          <div>
            <div
              className="text-slate-800 font-bold text-sm"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              {personas_unicas.toLocaleString()}
            </div>
            <div className="text-slate-400 uppercase tracking-wide text-[10px] font-semibold mt-0.5">
              Personas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
