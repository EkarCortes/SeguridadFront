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
  Autorizados: "#10b981",
  Rechazados: "#ef4444",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#1a1a1f] border border-[#303036] rounded-lg px-3 py-2 text-sm text-white shadow-lg">
        <div className="font-semibold text-white">{data.name}</div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.fill }} />
          <span className="text-neutral-300">Cantidad: </span>
          <span className="font-bold text-white">{data.value}</span>
        </div>
        <div className="text-neutral-400 text-xs mt-1">
          {data.payload.percentage}% del total
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
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-neutral-600 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-neutral-400 text-sm">Cargando estadísticas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <span className="text-red-400 text-sm">Error al cargar datos</span>
        <span className="text-neutral-500 text-xs text-center">{error}</span>
      </div>
    );
  }

  const { autorizados, rechazados, total_verificaciones, tasa_autorizacion, mes_nombre, personas_unicas } = monthlyData;
  
  const donutData = [
    {
      name: "Autorizados",
      value: autorizados,
      percentage: total_verificaciones > 0 ? ((autorizados / total_verificaciones) * 100).toFixed(1) : 0,
    },
    {
      name: "Rechazados",
      value: rechazados,
      percentage: total_verificaciones > 0 ? ((rechazados / total_verificaciones) * 100).toFixed(1) : 0,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-3">
        <h3 className="text-white font-semibold text-base">{mes_nombre} 2025</h3>
        <p className="text-neutral-400 text-xs">Estadísticas del mes</p>
      </div>

      {/* Donut Chart */}
      <div className="relative flex-1 min-h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive={false}
            >
              {donutData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name as keyof typeof COLORS]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Información central del donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-white font-bold text-lg">{total_verificaciones}</div>
          <div className="text-neutral-400 text-xs">Total</div>
        </div>
      </div>

      {/* Stats compactas */}
      <div className="mt-3 space-y-2">
        {/* Leyenda con valores */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-neutral-300 text-xs">Autorizados</span>
          </div>
          <span className="text-white text-xs font-semibold">{autorizados}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-neutral-300 text-xs">Rechazados</span>
          </div>
          <span className="text-white text-xs font-semibold">{rechazados}</span>
        </div>

        {/* Separador */}
        <div className="border-t border-[#303036] my-2"></div>

        {/* Métricas adicionales */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center">
            <div className="text-blue-400 font-semibold">{(tasa_autorizacion * 100).toFixed(0)}%</div>
            <div className="text-neutral-400">Tasa éxito</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-semibold">{personas_unicas}</div>
            <div className="text-neutral-400">Personas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;