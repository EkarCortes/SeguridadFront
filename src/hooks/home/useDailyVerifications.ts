import { useState, useEffect } from 'react';
import { homeService } from '../../service/home/homeService';
import type { DailyVerificationsResponse } from '../../types/homeTypes';

// Hook que gestiona la obtención de las verificaciones diarias

export const useDailyVerifications = (date?: string) => {
  const [data, setData] = useState<DailyVerificationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await homeService.getDailyVerifications();
        setData(result);
      } catch (err) {
        setError('Error al cargar los datos diarios');
        console.error('Error fetching daily verifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  return { data, loading, error };
};