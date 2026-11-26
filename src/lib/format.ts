export function formatUtcTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);

  return `${time} UTC`;
}

export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "0 min";
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (hours === 0) {
    return `${remainder} min`;
  }

  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
}

export function formatDayKey(isoDateTime: string): string {
  return isoDateTime.slice(0, 10);
}
