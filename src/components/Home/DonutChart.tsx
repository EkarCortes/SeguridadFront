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
  Autorizados: "#6FBF73",
  Rechazados: "#B85C5C",
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
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#303036] border-t-green-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-transparent border-t-green-400 rounded-full animate-spin animate-reverse"></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-neutral-400 text-base font-medium">Cargando datos</div>
           
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
          <span className="text-red-400 text-xl">⚠</span>
        </div>
        <div className="text-center">
          <span className="text-red-400 text-sm font-medium">Error al cargar datos</span>
          <div className="text-neutral-500 text-xs mt-1 text-center max-w-48">{error}</div>
        </div>
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
      <div className="text-center mb-3">
        <h3 className="text-[#262c3e] font-semibold text-base">{mes_nombre} {}</h3>
        <p className="text-neutral-400 text-xs">Estadísticas del mes</p>
      </div>

      <div className="relative flex-1 min-h-[140px]" style={{ height: "180px" }}>
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
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-black font-bold text-lg">{total_verificaciones}</div>
          <div className="text-neutral-400 text-xs">Total</div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#6FBF73]"></div>
            <span className="text-neutral-500 text-xs">Autorizados</span>
          </div>
          <span className="text-white text-xs font-semibold">{autorizados}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#B85C5C]"></div>
            <span className="text-neutral-500 text-xs">Rechazados</span>
          </div>
          <span className="text-white text-xs font-semibold">{rechazados}</span>
        </div>

        <div className="border-t border-[#303036] my-2"></div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center">
            <div className="text-[#262c3e] font-semibold">{(tasa_autorizacion * 100).toFixed(0)}%</div>
            <div className="text-neutral-400">Tasa éxito</div>
          </div>
          <div className="text-center">
            <div className="text-[#262c3e] font-semibold">{personas_unicas}</div>
            <div className="text-neutral-400">Personas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;