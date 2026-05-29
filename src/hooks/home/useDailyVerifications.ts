import { useState, useEffect } from 'react';
import { homeService } from '../../service/home/homeService';
import type { DailyVerificationsResponse } from '../../types/homeTypes';

export const useDailyVerifications = (date?: string) => {
  const [data, setData] = useState<DailyVerificationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async (isInitial = false) => {
      if (isInitial) setLoading(true);
      try {
        setError(null);
        const result = await homeService.getDailyVerifications();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError('Error al cargar los datos diarios');
        console.error('Error fetching daily verifications:', err);
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
  }, [date]);

  return { data, loading, error };
};
