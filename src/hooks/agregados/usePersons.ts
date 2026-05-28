import { useQuery } from '@tanstack/react-query';
import { agregadosService } from '../../service/agregados/agregadosService';

export const PERSONS_QUERY_KEY = ['persons'] as const;

export const usePersons = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: PERSONS_QUERY_KEY,
    queryFn: () => agregadosService.getPersons(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    persons: data?.personas ?? [],
    totalPersonas: data?.total_personas ?? 0,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? 'Error al cargar las personas' : null,
    refetch,
  };
};
