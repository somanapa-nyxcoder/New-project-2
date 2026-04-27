import { WeekdayCode } from "@/lib/types";

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  timeZone: "UTC",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function getTodayDateKeyInTimeZone(timezone: string, now = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(now);
}

export function toUtcDate(dateKey: string): Date {
  return new Date(`${dateKey}T12:00:00.000Z`);
}

export function addDays(dateKey: string, days: number): string {
  const date = toUtcDate(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDateKey(date);
}

export function diffDays(startDateKey: string, endDateKey: string): number {
  const start = toUtcDate(startDateKey).getTime();
  const end = toUtcDate(endDateKey).getTime();
  return Math.floor((end - start) / 86_400_000);
}

export function getWeekdayCode(dateKey: string): WeekdayCode {
  const formatted = weekdayFormatter.format(toUtcDate(dateKey));
  return formatted as WeekdayCode;
}

export function getWeekStartDate(dateKey: string): string {
  const weekday = getWeekdayCode(dateKey);
  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
  return addDays(dateKey, -dayIndex);
}

export function getMonthStartDate(dateKey: string): string {
  const [year, month] = dateKey.split("-").map(Number);
  return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-01`;
}

export function getMonthGridStartDate(dateKey: string): string {
  const monthStart = getMonthStartDate(dateKey);
  const weekday = getWeekdayCode(monthStart);
  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
  return addDays(monthStart, -dayIndex);
}

export function formatShortDateLabel(dateKey: string): string {
  return shortDateFormatter.format(toUtcDate(dateKey));
}

export function formatFullDateLabel(dateKey: string): string {
  return fullDateFormatter.format(toUtcDate(dateKey));
}

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
