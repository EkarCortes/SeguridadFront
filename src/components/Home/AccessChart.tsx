import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface AccessChartProps {
  totalData: {
    aceptados: number;
    rechazados: number;
  };
  loading?: boolean;
  error?: string | null;
}

const COLORS: Record<string, string> = {
  Permitido: "#22c55e",
  Denegado: "#ef4444",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm shadow-md">
        <div className="font-semibold text-slate-700">{label}</div>
        <div style={{ color: COLORS[label] }} className="font-bold">
          {payload[0].value.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

const CustomXAxisTick = ({ x, y, payload, data }: any) => {
  const entry = data?.find((d: any) => d.tipo === payload.value);
  const color = COLORS[payload.value] ?? "#64748b";
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#64748b" fontSize={13}>
        {payload.value}
      </text>
      {entry && (
        <text x={0} y={0} dy={34} textAnchor="middle" fill={color} fontSize={12} fontWeight={600}>
          {entry.cantidad.toLocaleString()}
        </text>
      )}
    </g>
  );
};

const AccessChart: React.FC<AccessChartProps> = ({ totalData, loading, error }) => {
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

  const accessData = [
    { tipo: "Permitido", cantidad: totalData.aceptados },
    { tipo: "Denegado", cantidad: totalData.rechazados },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            className="text-base font-bold text-slate-800"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Análisis Comparativo
          </h3>
          <p className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            Accesos permitidos vs denegados (Mensual)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Permitidos
          </span>
          <span className="w-px h-3.5 bg-slate-200" />
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            Denegados
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={accessData} barCategoryGap="55%" margin={{ top: 8, right: 8, left: -20, bottom: 24 }}>
            <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="0" />
            <XAxis
              dataKey="tipo"
              axisLine={false}
              tickLine={false}
              tick={<CustomXAxisTick data={accessData} />}
              height={52}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} isAnimationActive={false}>
              {accessData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.tipo]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AccessChart;
