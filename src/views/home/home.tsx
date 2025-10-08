import AccessTable from "../../components/Home/AccessTable";
import AccessChart from "../../components/Home/AccessChart";
import DonutChart from "../../components/Home/DonutChart";
import { useHomeData } from "../../hooks/home/useHomeData";
import { useMonthlyStats } from "../../hooks/home/useMonthlyStats";
import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const { totalData, loading, error } = useHomeData();
  const { monthlyStats, loading: monthlyLoading, error: monthlyError, refetch } = useMonthlyStats();

  // Estados para año y mes seleccionados
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null); 

  // Extrae años únicos de los datos
  const years = Array.from(new Set(monthlyStats.map(stat => stat.año))).sort((a, b) => b - a);

  // Inicializa el año y mes seleccionados cuando los datos estén disponibles
  useEffect(() => {
    if (monthlyStats.length > 0 && selectedYear === null) {
      const latestYear = Math.max(...monthlyStats.map(stat => stat.año));
      const latestMonthForYear = monthlyStats
        .filter(stat => stat.año === latestYear)
        .sort((a, b) => b.mes - a.mes)[0];
      
      setSelectedYear(latestYear);
      setSelectedMonth(latestMonthForYear.mes);
    }
  }, [monthlyStats, selectedYear]);

  // Filtra meses disponibles para el año seleccionado
  const months = selectedYear 
    ? monthlyStats.filter(stat => stat.año === selectedYear).sort((a, b) => b.mes - a.mes)
    : [];

  // Maneja cambio de año
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(e.target.value);
    setSelectedYear(year);
    
    // Obtener el mes más reciente del año seleccionado
    const monthsForYear = monthlyStats
      .filter(stat => stat.año === year)
      .sort((a, b) => b.mes - a.mes);
    
    if (monthsForYear.length > 0) {
      setSelectedMonth(monthsForYear[0].mes);
    }
    
    refetch(year, year);
  };

  // Maneja cambio de mes
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMonth(value === "" ? null : Number(value));
  };

  // Obtiene los datos del mes seleccionado
  const currentMonthData = React.useMemo(() => {
    if (!selectedYear || !selectedMonth) return undefined;
    
    return monthlyStats.find(stat => stat.año === selectedYear && stat.mes === selectedMonth);
  }, [selectedYear, selectedMonth, monthlyStats]);

  // Debug: Agregar console.log para verificar datos
  useEffect(() => {
    console.log('Current Month Data:', currentMonthData);
    console.log('Selected Year:', selectedYear);
    console.log('Selected Month:', selectedMonth);
    console.log('Monthly Stats:', monthlyStats);
  }, [currentMonthData, selectedYear, selectedMonth, monthlyStats]);

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
            {/* Selects de filtro */}
            <div className="w-full flex gap-2 mb-4">
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
            
            {/* DonutChart con datos correctos */}
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