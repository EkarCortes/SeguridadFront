import { useState, useEffect } from 'react';
import { homeService } from '../../service/home/homeService';
import type { TimeSeriesData } from '../../types/homeTypes';

export const useHomeData = () => {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async (isInitial = false) => {
      if (isInitial) setLoading(true);
      try {
        setError(null);
        const data = await homeService.getTimeSeries();
        if (!cancelled) setTimeSeriesData(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        if (isInitial && !cancelled) setLoading(false);
      }
    };

    fetchData(true);
    const interval = setInterval(() => fetchData(false), 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const totalData = timeSeriesData.reduce(
    (acc, item) => ({
      aceptados: acc.aceptados + item.aceptados,
      rechazados: acc.rechazados + item.rechazados,
    }),
    { aceptados: 0, rechazados: 0 }
  );

  return { timeSeriesData, totalData, loading, error };
};
