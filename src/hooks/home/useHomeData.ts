import { useState, useEffect } from 'react';
import { homeService } from '../../service/home/homeService';
import type { TimeSeriesData } from '../../types/homeTypes';

// Hook que gestiona la obtención de datos de series temporales para la página de inicio

export const useHomeData = () => {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeSeriesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await homeService.getTimeSeries();
      setTimeSeriesData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeSeriesData();
  }, []);

  // Calcular totales para el chart de barras
  const totalData = timeSeriesData.reduce(
    (acc, item) => ({
      aceptados: acc.aceptados + item.aceptados,
      rechazados: acc.rechazados + item.rechazados,
    }),
    { aceptados: 0, rechazados: 0 }
  );

  return {
    timeSeriesData,
    totalData,
    loading,
    error,
    refetch: fetchTimeSeriesData
  };
};