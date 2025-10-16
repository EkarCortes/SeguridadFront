import { useState, useEffect } from 'react';
import { ingresadosService} from '../service/ingresados/ingresadosService';
import type { Verificacion, VerificationsResponse } from '../types/ingresados';

export const useVerifications = () => {
  const [verifications, setVerifications] = useState<Verificacion[]>([]);
  const [totalVerificaciones, setTotalVerificaciones] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: VerificationsResponse = await ingresadosService.getVerifications();
      if (data && Array.isArray(data.registros)) {
        setVerifications(data.registros);
        setTotalVerificaciones(data.total_registros );
      } else {
        console.warn('Estructura de datos inesperada:', data);
        setVerifications([]);
        setTotalVerificaciones(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las verificaciones');
      setVerifications([]);
      console.error('Error fetching verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  return {
    verifications,
    totalVerificaciones,
    loading,
    error,
    refetch: fetchVerifications
  };
};