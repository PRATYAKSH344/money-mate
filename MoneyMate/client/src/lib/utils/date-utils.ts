import {
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  parseISO,
  isValid
} from "date-fns";

export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = parseISO(date);
  }
  return format(date, "MMMM d, yyyy");
}

export function formatMonthYear(date: Date | string): string {
  if (typeof date === "string") {
    date = parseISO(date);
  }
  return format(date, "MMMM yyyy");
}

export function getDateRangeForFilter(filterValue: string): { startDate: Date; endDate: Date } {
  const now = new Date();
  
  switch (filterValue) {
    case "current-month":
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now)
      };
    case "last-month":
      const lastMonth = subMonths(now, 1);
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth)
      };
    case "last-3-months":
      return {
        startDate: startOfMonth(subMonths(now, 2)),
        endDate: endOfMonth(now)
      };
    case "last-6-months":
      return {
        startDate: startOfMonth(subMonths(now, 5)),
        endDate: endOfMonth(now)
      };
    case "current-year":
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now)
      };
    default:
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now)
      };
  }
}

export function formatDateForInput(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseDateString(dateString: string): Date | null {
  if (!dateString) return null;
  
  const date = parseISO(dateString);
  return isValid(date) ? date : null;
}
