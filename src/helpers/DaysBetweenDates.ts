export function daysBetweenDates(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(
    Math.abs((date1.getTime() - date2.getTime()) / oneDay),
  );

  return diffDays;
}
