export const getNextMonday = (date: Date) => {
  const mondayDate = new Date(date);
  const dateFrom = mondayDate.setDate(
    mondayDate.getDate() + (((7 - mondayDate.getDay()) % 7) + 1),
  );
  return new Date(dateFrom);
};

export const getThisMonday = (date: Date) => {
  const newDate = new Date(getNextMonday(date));
  return new Date(newDate.setDate(newDate.getDate() - 7));
};

export const getThisSunday = (date: Date) => {
  const newDate = new Date(getNextSunday(date));
  return new Date(newDate.setDate(newDate.getDate() - 7));
};

export const getNextSunday = (date: Date) => {
  const nextMonday = getNextMonday(date);
  return new Date(
    nextMonday.setDate(nextMonday.getDate() + (nextMonday.getDay() + 5)),
  );
};

export const getFullDate = (year: number, month: number, day: number) => {
  return new Date(year, month, day, 0);
};

export const getUTCDate = (date: Date) => {
  return new Date(
    new Date(date).toLocaleString("en-US", {
      timeZone: "UTC",
    }),
  );
};

export const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type Month = (typeof Months)[number];
