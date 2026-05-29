import { useState, useEffect, useRef } from 'react';
import { homeService } from '../../service/home/homeService';
import type { MonthlyStats, MonthlyStatsResponse } from '../../types/homeTypes';

const normalize = (data: MonthlyStatsResponse): MonthlyStats[] =>
  data.estadisticas_mensuales.map(s => ({
    ...s,
    autorizados: typeof s.autorizados === 'string' ? Number(s.autorizados) : s.autorizados,
    rechazados: typeof s.rechazados === 'string' ? Number(s.rechazados) : s.rechazados,
    total_verificaciones: typeof s.total_verificaciones === 'string' ? Number(s.total_verificaciones) : s.total_verificaciones,
  }));

export const useMonthlyStats = () => {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [totalMeses, setTotalMeses] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const paramsRef = useRef<{ year_from?: number; year_to?: number }>({});

  const doFetch = async (year_from?: number, year_to?: number, isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      setError(null);
      const data: MonthlyStatsResponse = await homeService.getMonthlyStats(year_from, year_to);
      setMonthlyStats(normalize(data));
      setTotalMeses(data.total_meses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas mensuales');
      console.error('Error fetching monthly stats:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    doFetch(undefined, undefined, true);

    const interval = setInterval(() => {
      if (!cancelled) {
        const { year_from, year_to } = paramsRef.current;
        doFetch(year_from, year_to, false);
      }
    }, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const refetch = async (year_from?: number, year_to?: number) => {
    paramsRef.current = { year_from, year_to };
    await doFetch(year_from, year_to, true);
  };

  return { monthlyStats, totalMeses, loading, error, refetch };
};
