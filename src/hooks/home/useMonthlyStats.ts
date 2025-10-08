import { useState, useEffect } from 'react';
import { homeService, type MonthlyStatsResponse, type MonthlyStats } from '../../service/home/homeService';

export const useMonthlyStats = () => {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [totalMeses, setTotalMeses] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyStats = async (year_from?: number, year_to?: number) => {
    try {
      setLoading(true);
      setError(null);
      const data: MonthlyStatsResponse = await homeService.getMonthlyStats(year_from, year_to);
      setMonthlyStats(data.estadisticas_mensuales);
      setTotalMeses(data.total_meses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas mensuales');
      console.error('Error fetching monthly stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  return {
    monthlyStats,
    totalMeses,
    loading,
    error,
    refetch: fetchMonthlyStats
  };
};