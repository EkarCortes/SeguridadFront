import { useQuery } from '@tanstack/react-query';
import { ingresadosService } from '../../service/ingresados/ingresadosService';

export const VERIFICATIONS_QUERY_KEY = ['verifications'] as const;

export const useVerifications = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: VERIFICATIONS_QUERY_KEY,
    queryFn: () => ingresadosService.getVerifications(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    verifications: data?.registros ?? [],
    totalVerificaciones: data?.total_registros ?? 0,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? 'Error al cargar las verificaciones' : null,
    refetch,
  };
};
