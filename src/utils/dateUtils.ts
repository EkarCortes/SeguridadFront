/**
 * Convierte un timestamp UTC a la zona horaria de Costa Rica (UTC-6).
 * Retorna fecha y hora formateadas y el objeto Date local.
 */
export function convertToCostaRicaTime(utcTimestamp: string) {
  const utcDate = new Date(utcTimestamp);

  // Costa Rica está en UTC-6 (America/Costa_Rica) todo el año
  const fechaFormatted = utcDate.toLocaleDateString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Costa_Rica',
  });

  const horaFormatted = utcDate.toLocaleTimeString('es-CR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Costa_Rica',
  });

  // Obtenemos el objeto Date local en CR
  const crDate = new Date(
    utcDate.toLocaleString('en-US', { timeZone: 'America/Costa_Rica' })
  );

  return { fechaFormatted, horaFormatted, localDate: crDate };
}