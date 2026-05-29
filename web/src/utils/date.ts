export const dateLocale = "en-US";

export const DATE_FORMAT_SHORT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

export const DATE_FORMAT_LONG: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
};

export function formatDate(
  value: string | Date | undefined | null,
  options: Intl.DateTimeFormatOptions = DATE_FORMAT_SHORT,
) {
  if (!value) return "N/A";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(dateLocale, options).format(date);
}

export function formatDateTime(value: string | Date | undefined | null) {
  if (!value) return "N/A";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(dateLocale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}
