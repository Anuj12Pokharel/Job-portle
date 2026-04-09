/**
 * Standard utility for calculating correctly the days remaining until a job expires.
 * Normalizes to the end of the day (23:59:59.999) to ensure consistency.
 */
export const calculateDaysLeft = (expiryDate?: string | Date | null): number | null => {
  if (!expiryDate) return null;

  const expiry = new Date(expiryDate);
  if (isNaN(expiry.getTime())) return null;

  // Set to end of day local time
  expiry.setHours(23, 59, 59, 999);

  const diff = expiry.getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return days;
};

/**
 * Standard formatting for days left display.
 */
export const formatDaysLeftDisplay = (days: number | null): string => {
  if (days === null) return "No expiry";
  if (days < 0) return "Expired";
  if (days === 0) return "Expires Today";
  return `${days} days left`;
};
