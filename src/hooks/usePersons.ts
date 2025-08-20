import { useState, useEffect } from 'react';
import { agregadosService, type PersonsResponse, type Persona } from '../service/agregados/agregadosService';

export const usePersons = () => {
  const [persons, setPersons] = useState<Persona[]>([]);
  const [totalPersonas, setTotalPersonas] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: PersonsResponse = await agregadosService.getPersons();
      setPersons(data.personas);
      setTotalPersonas(data.total_personas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las personas');
      console.error('Error fetching persons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  return {
    persons,
    totalPersonas,
    loading,
    error,
    refetch: fetchPersons
  };
};