import AccessTable from "../../components/Home/AccessTable";
import AccessChart from "../../components/Home/AccessChart";
import DonutChart from "../../components/Home/DonutChart";
import { useHomeData } from "../../hooks/home/useHomeData";
import { useMonthlyStats } from "../../hooks/home/useMonthlyStats";
import { useMonthlySelection } from "../../hooks/home/useMonthlySelection";

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
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div
            className="flex-1 rounded-lg shadow-lg p-4 min-h-[370px] flex items-center justify-center bg-[#f9faff]"
            style={{ color: "#1f364a" }}
          >
            <AccessChart totalData={totalData} loading={loading} error={error} />
          </div>
          
          <div
            className="w-full md:w-[350px] rounded-lg shadow-lg p-4 min-h-[370px] flex flex-col items-center justify-center bg-[#f9faff] box-border"
            style={{ color: "#1f364a", height: "370px" }}
          >
  
            <div className="w-full flex gap-2 mb-4 justify-end">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={selectedYear ?? ""}
                onChange={handleYearChange}
                disabled={years.length === 0}
              >
                {years.length === 0 ? (
                  <option value="">Sin datos</option>
                ) : (
                  years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))
                )}
              </select>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={selectedMonth ?? ""}
                onChange={handleMonthChange}
                disabled={months.length === 0}
              >
                {months.length === 0 ? (
                  <option value="">Sin meses</option>
                ) : (
                  months.map(stat => (
                    <option key={stat.mes} value={stat.mes}>{stat.mes_nombre}</option>
                  ))
                )}
              </select>
            </div>
            

            <DonutChart 
              monthlyData={currentMonthData ?? {
                año: selectedYear ?? 0,
                mes: selectedMonth ?? 0,
                autorizados: 0,
                rechazados: 0,
                total_verificaciones: 0,
                tasa_autorizacion: 0,
                mes_nombre: 'Sin datos',
                personas_unicas: 0,
                camaras_activas: 0
              }}
              loading={monthlyLoading}
              error={monthlyError}
            />
          </div>
        </div>

        <div className="rounded-lg shadow-lg bg-[#f9faff]">
          <AccessTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;