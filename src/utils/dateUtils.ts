/**
 * Convierte un timestamp UTC a la zona horaria de Costa Rica (UTC-6).
 * Retorna fecha y hora formateadas y el objeto Date local.
 */
export function convertToCostaRicaTime(utcTimestamp: string) {
  const utcDate = new Date(utcTimestamp);

  // Costa Rica está en UTC-6 (CST) todo el año
  const costaRicaOffset = -6 * 60; // -6 horas en minutos
  const costaRicaTime = new Date(utcDate.getTime() + costaRicaOffset * 60 * 1000);

  const fechaFormatted = costaRicaTime.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const horaFormatted = costaRicaTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return { fechaFormatted, horaFormatted, localDate: costaRicaTime };
}