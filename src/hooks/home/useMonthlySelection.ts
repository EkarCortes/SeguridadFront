import { useState, useEffect, useMemo, useCallback } from 'react';
import type { MonthlyStats } from '../../types/homeTypes';

//Este hook gestiona la selección de año y mes, y proporciona los datos correspondientes.

type RefetchFn = (year_from?: number, year_to?: number) => Promise<void> | void;

export const useMonthlySelection = (
  monthlyStats: MonthlyStats[],
  refetch: RefetchFn
) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const years = useMemo(
    () => Array.from(new Set(monthlyStats.map(s => s.año))).sort((a, b) => b - a),
    [monthlyStats]
  );

  // Meses disponibles para el año seleccionado (orden descendente)
  const months = useMemo(() => {
    if (selectedYear == null) return [];
    return monthlyStats
      .filter(s => s.año === selectedYear)
      .sort((a, b) => b.mes - a.mes);
  }, [monthlyStats, selectedYear]);

  // Inicialización (último año y último mes disponible)
  useEffect(() => {
    if (monthlyStats.length === 0 || selectedYear !== null) return;
    const latestYear = Math.max(...monthlyStats.map(s => s.año));
    const latestMonth = monthlyStats
      .filter(s => s.año === latestYear)
      .sort((a, b) => b.mes - a.mes)[0]?.mes;
    setSelectedYear(latestYear);
    if (latestMonth) setSelectedMonth(latestMonth);
  }, [monthlyStats, selectedYear]);

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const year = Number(e.target.value);
      setSelectedYear(year);

      const monthsForYear = monthlyStats
        .filter(s => s.año === year)
        .sort((a, b) => b.mes - a.mes);

      setSelectedMonth(monthsForYear[0]?.mes ?? null);
      refetch(year, year);
    },
    [monthlyStats, refetch]
  );

  const handleMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedMonth(value === '' ? null : Number(value));
    },
    []
  );

  const currentMonthData = useMemo(() => {
    if (!selectedYear || !selectedMonth) return undefined;
    const found = monthlyStats.find(
      s => s.año === selectedYear && s.mes === selectedMonth
    );
    if (!found) return undefined;
    return {
      ...found,
      autorizados: Number(found.autorizados),
      rechazados: Number(found.rechazados),
      total_verificaciones: Number(found.total_verificaciones)
    };
  }, [monthlyStats, selectedYear, selectedMonth]);

  return {
    years,
    months,
    selectedYear,
    selectedMonth,
    handleYearChange,
    handleMonthChange,
    currentMonthData
  };
};