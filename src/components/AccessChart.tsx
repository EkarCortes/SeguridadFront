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
  
  const accessData = [
    { tipo: "Permitido", cantidad: 245 },
    { tipo: "Denegado", cantidad: 46 },
  ];
  
  const COLORS: Record<string, string> = {
    Permitido: "#223F31",
    Denegado: "#50272A",
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#23222A] rounded-lg px-3 py-2 text-sm text-white shadow">
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
  
  const AccessChart = () => (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <span className="text-white font-semibold mb-2 text-lg">
        Accesos totales
      </span>
      <ResponsiveContainer width="100%" height={220}>
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
            cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
          />
          <Legend
            wrapperStyle={{ color: "#a3a3a3", fontSize: 14 , fill: "#23222B"}}
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
  
  export default AccessChart;