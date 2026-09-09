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

/**
 * Verifica si una hora límite "HH:mm" ya pasó el día de hoy
 */
export function isTimePastToday(dueTime?: string): boolean {
  if (!dueTime) return false;
  const now = new Date();
  const parts = dueTime.split(':');
  if (parts.length < 2) return false;
  
  const dueHours = Number(parts[0]);
  const dueMinutes = Number(parts[1]);
  if (isNaN(dueHours) || isNaN(dueMinutes)) return false;
  
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  
  if (currentHours > dueHours) return true;
  if (currentHours === dueHours && currentMinutes >= dueMinutes) return true;
  return false;
}

/**
 * Formatea "14:30" en formato legible "2:30 PM"
 */
export function formatDueTime(dueTime?: string): string {
  if (!dueTime) return '';
  const parts = dueTime.split(':');
  if (parts.length < 2) return dueTime;
  
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  if (isNaN(h) || isNaN(m)) return dueTime;
  
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  const displayM = String(m).padStart(2, '0');
  return `${displayH}:${displayM} ${ampm}`;
}

