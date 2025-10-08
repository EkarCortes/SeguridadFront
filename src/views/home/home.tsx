import AccessTable from "../../components/Home/AccessTable";
import AccessChart from "../../components/Home/AccessChart";
import DonutChart from "../../components/Home/DonutChart";
import { useHomeData } from "../../hooks/useHomeData";
import { useMonthlyStats } from "../../hooks/useMonthlyStats";


const Dashboard = () => {
  const { totalData, loading, error } = useHomeData();
  const { monthlyStats, loading: monthlyLoading, error: monthlyError } = useMonthlyStats();

  const currentMonthData = monthlyStats.length > 0 ? monthlyStats[monthlyStats.length - 1] : null;

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
            style={{ color: "#1f364a" }}
          >
            {monthlyLoading ? (
              <DonutChart 
                monthlyData={{
                  autorizados: 0,
                  rechazados: 0,
                  total_verificaciones: 0,
                  tasa_autorizacion: 0,
                  mes_nombre: '',
                  personas_unicas: 0
                }}
                loading={true}
                error={null}
              />
            ) : monthlyError ? (
              <DonutChart 
                monthlyData={{
                  autorizados: 0,
                  rechazados: 0,
                  total_verificaciones: 0,
                  tasa_autorizacion: 0,
                  mes_nombre: '',
                  personas_unicas: 0
                }}
                loading={false}
                error={monthlyError}
              />
            ) : currentMonthData ? (
              <DonutChart 
                monthlyData={currentMonthData} 
                loading={false} 
                error={null} 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-neutral-400 text-sm" style={{ color: "#1f364a" }}>
                  No hay datos del mes
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <div
            className="rounded-lg shadow-lg p-4 min-h-[370px] flex items-center justify-center bg-[#f9faff]"
            style={{ color: "#1f364a" }}
          >
            <AccessTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;