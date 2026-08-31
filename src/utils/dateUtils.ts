/**
 * Retorna la fecha de hoy en formato YYYY-MM-DD
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Retorna la fecha actual en formato ISO completo
 */
export function getNowISO(): string {
  return new Date().toISOString();
}

/**
 * Compara si dos strings de fecha corresponden al mismo día YYYY-MM-DD
 */
export function isSameDay(dateStr1?: string, dateStr2?: string): boolean {
  if (!dateStr1 || !dateStr2) return false;
  return dateStr1.split('T')[0] === dateStr2.split('T')[0];
}
