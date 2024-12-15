export function todayDates(): { dayStart: Date, dayEnd: Date } {
  const [dayStart, dayEnd] = [new Date(), new Date()];

  dayStart.setHours(0, 0, 0, 0);
  dayEnd.setHours(23, 59, 59, 999);

  return { dayStart, dayEnd };
}
