import { useState, useEffect } from 'react';
import { agregadosService } from '../service/agregados/agregadosService';
import type { Persona, PersonsResponse } from '../types/agregados';

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
      setPersons(data.personas || []); // Asegurar que sea un array
      console.log('Fetched persons:', data.personas);
      setTotalPersonas(data.total_personas || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las personas');
      setPersons([]); // Asegurar array vacío en caso de error
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