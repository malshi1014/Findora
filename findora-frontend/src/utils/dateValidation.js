/**
 * Utility functions for date and time validation in Sri Lanka timezone (Asia/Colombo).
 */

export const getSriLankaNow = () => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const values = {};

  parts.forEach(({ type, value }) => {
    values[type] = value;
  });

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
};

export const getMaxDate = () => {
  return getSriLankaNow().date;
};

export const convertToMinutes = (timeStr, period = null) => {
  if (!timeStr || !timeStr.trim()) return null;

  let cleaned = timeStr.trim();
  let ampm = period;

  const matchAmpm = cleaned.match(/^(\d{1,2}:\d{2})\s*(AM|PM)$/i);
  if (matchAmpm) {
    cleaned = matchAmpm[1];
    ampm = matchAmpm[2].toUpperCase();
  }

  const [hourStr, minuteStr] = cleaned.split(":");
  let hour = Number(hourStr);
  const minute = Number(minuteStr);

  if (isNaN(hour) || isNaN(minute)) return null;

  if (ampm) {
    ampm = ampm.toUpperCase();
    if (ampm === "AM" && hour === 12) hour = 0;
    if (ampm === "PM" && hour < 12) hour += 12;
  }

  return hour * 60 + minute;
};

export const validateNotFuture = (
  date,
  time = "",
  period = null,
  fieldName = "Date and time"
) => {
  if (!date) return null;

  const now = getSriLankaNow();

  if (date < now.date) {
    return null;
  }

  if (date > now.date) {
    return "Date and time cannot be in the future.";
  }

  if (!time || !time.trim()) {
    return null;
  }

  const enteredMinutes = convertToMinutes(time, period);
  if (enteredMinutes === null) {
    return null;
  }

  const currentMinutes = now.hour * 60 + now.minute;

  if (enteredMinutes > currentMinutes) {
    return "Date and time cannot be in the future.";
  }

  return null;
};
