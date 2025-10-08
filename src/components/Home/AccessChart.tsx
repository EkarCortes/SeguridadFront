import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";

//Componente usado en Home para mostrar un grafico de barras con los accesos totales

interface AccessChartProps {
  totalData: {
    aceptados: number;
    rechazados: number;
  };
  loading?: boolean;
  error?: string | null;
}

const COLORS: Record<string, string> = {
  Permitido: "#10b981",
  Denegado: "#ef4444",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#262c3e] rounded-lg px-3 py-2 text-sm text-white shadow">
        <div className="font-semibold">{label}</div>
        <div>
          <span className="mr-2" style={{ color: COLORS[label] }}>
            ●
          </span>
          {payload[0].name}: <span className="font-bold">{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
};

const AccessChart: React.FC<AccessChartProps> = ({ totalData, loading, error }) => {
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
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
          <span className="text-red-400 text-2xl">⚠</span>
        </div>
        <div className="text-center">
          <span className="text-red-400 text-base font-medium">Error al cargar datos</span>
          <div className="text-neutral-500 text-sm mt-1 max-w-64 text-center">{error}</div>
        </div>
      </div>
    );
  }

  const accessData = [
    { tipo: "Permitido", cantidad: totalData.aceptados },
    { tipo: "Denegado", cantidad: totalData.rechazados },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <span className="text-white font-semibold mb-4 text-lg">
        Accesos totales
      </span>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={accessData} barCategoryGap="60%">
          <CartesianGrid stroke="#23232a" vertical={false} />
          <XAxis
            dataKey="tipo"
            tick={{ fill: "#a3a3a3", fontSize: 15 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#a3a3a3", fontSize: 15 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "none" }}
          />
          <Legend
            wrapperStyle={{ color: "#a3a3a3", fontSize: 14, fill: "#23222B" }}
            iconType="circle"
          />
          <Bar
            dataKey="cantidad"
            name="Cantidad"
            radius={[8, 8, 0, 0]}
            isAnimationActive={false}
          >
            {accessData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.tipo]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccessChart;