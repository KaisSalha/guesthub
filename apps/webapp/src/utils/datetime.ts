import {
  add,
  addMonths,
  getDate,
  parse,
  parseISO,
  setDay,
  setHours,
  setMinutes,
  startOfMinute,
  startOfWeek,
  toDate,
} from "date-fns";
import {
  format as formatDateFn,
  toZonedTime,
  fromZonedTime,
} from "date-fns-tz";
import { TimeValue } from "react-aria";

export enum TimestampFormat {
  ISO_DATE = "yyyy-MM-dd", // 2023-09-20
  DATE = "LLL d, yyyy", // Sep 20, 2023
  DISPLAY_DATE = "EEE • MMM d", // Wed • Sep 20
  MONTH_DAY = "LLL d", // Sep 20
  MONTH_DAY_LONG = "LLLL d", // September 20
  MONTH_YEAR = "LLL yyyy", // Sep 2023
  MONTH_YEAR_SHORT = "LLL ''yy", // Sep '23
  MONTH_YEAR_LONG = "LLLL yyyy", // September 2023
  TIME = "h:mmaaaaa'm'", // 3:30pm
  TIME_ZONED = "h:mmaaaaa'm' z", // 3:30pm GMT
  TIME_DATE_ZONED = "haaaaa'm' z 'on' LLL d, yyyy", // 3pm GMT on Sep 20, 2023
  TIME_24_HOUR = "HH:mm", // 15:30
  HOUR = "h", // 3
  HOUR_LONG = "haaaaa'm'", // 3pm
  DATE_TIME = "LLL d, yyyy 'at' h:mmaaaaa'm'", // Sep 20, 2023 at 3:30pm
  DATE_TIME_ZONED = "LLL d, yyyy 'at' h:mmaaaaa'm' z", // Sep 20, 2023 at 3:30pm GMT
  MONTH_DAY_TIME_ZONED = "LLL d 'at' h:mmaaaaa'm' z", // Sep 20 at 3:30pm GMT
  ZONE = "z", // GMT
  HOUR_ZONE_MONTH_DATE = "h a z, LLL d", // 3 PM GMT, Sep 20
  HOUR_ZONE = "h a z", // 3 PM GMT
  TIME_ZONE_MONTH_DATE = "h:mm a z, LLL d", // 3:30 PM GMT, Sep 20
}

export interface FormatOptions {
  timeZone?: string;
}

export const parseTimestamp = (
  ts: Date | string | number | null | undefined
) => {
  if (!ts) {
    return null;
  }
  if (typeof ts === "string") {
    return parseISO(ts);
  }
  return toDate(ts);
};

export const formatTimestamp = (
  ts: Date | string | number | null | undefined,
  format: keyof typeof TimestampFormat,
  options?: FormatOptions
) => {
  let date = parseTimestamp(ts);
  if (!date) {
    return "";
  }
  if (options?.timeZone) {
    date = toZonedTime(date, options.timeZone);
  }
  return formatDateFn(date, TimestampFormat[format], options);
};

export const getLocalTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const toISODate = (
  ts: Date | string | number | null | undefined,
  timeZone?: string
) => {
  return formatTimestamp(ts, "ISO_DATE", { timeZone }) || null;
};

export const fromDateAndTime = (
  date: string,
  time: string,
  timeZone: string
) => {
  const [hours, minutes] = time
    .toString()
    .split(":")
    .map((v: string) => parseInt(v, 10));
  return fromZonedTime(
    startOfMinute(
      setMinutes(
        setHours(parse(date, "yyyy-MM-dd", new Date()), hours),
        minutes
      )
    ),
    timeZone
  );
};

export const parseISODate = (date: string) => {
  return parse(date, TimestampFormat.ISO_DATE, new Date());
};

export const formatDateTimeWindow = ({
  ts1,
  ts2,
  options,
  noDate = false,
}: {
  ts1: Date | string | number | null | undefined;
  ts2: Date | string | number | null | undefined;
  options?: FormatOptions;
  noDate?: boolean;
}) => {
  if (!ts1 || !ts2) {
    return "";
  }
  return `${formatTimestamp(ts1, "HOUR", options)} - ${formatTimestamp(
    ts2,
    noDate ? "HOUR_ZONE" : "HOUR_ZONE_MONTH_DATE",
    options
  )}`;
};

export const getNextDayOfWeek = ({
  dayOfWeek,
  date = new Date(),
  includeToday = true,
}: {
  dayOfWeek: number;
  date?: Date;
  includeToday?: boolean;
}): Date => {
  // dayOfWeek: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // Calculate the start of the week considering Monday as the first day of the week
  let result = setDay(startOfWeek(date, { weekStartsOn: 1 }), dayOfWeek, {
    weekStartsOn: 1,
  });

  if (result < date || (!includeToday && result === date)) {
    // If the day is before the current date, or today but today should not be included, jump to the next week
    result = add(result, { weeks: 1 });
  }

  return result;
};

export const getNextDayOfMonth = ({
  dayOfMonth,
  date = new Date(),
  includeToday = true,
}: {
  dayOfMonth: number;
  date?: Date;
  includeToday?: boolean;
}): Date => {
  const currentDay = getDate(date);

  if (currentDay < dayOfMonth || (includeToday && currentDay === dayOfMonth)) {
    // If today's date is less than the specific day, or it's the same day and includeToday is true, set this month's date to that day
    return new Date(date.getFullYear(), date.getMonth(), dayOfMonth);
  } else {
    // If today's date is past the specific day, or it's the same day but includeToday is false, set next month's date to that day
    return addMonths(
      new Date(date.getFullYear(), date.getMonth(), dayOfMonth),
      1
    );
  }
};

export const convertToSeconds = (hours: number | null) => {
  if (!hours) {
    return hours;
  }

  return Math.max(0, hours * 3600);
};

export const convertToHours = (seconds: number | null) => {
  if (!seconds) {
    return seconds;
  }

  return Math.max(0, seconds / 3600);
};

export const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const setTime = ({ date, time }: { date: Date; time: TimeValue }) => {
  const updatedDate = new Date(date);

  updatedDate.setHours(time.hour);
  updatedDate.setMinutes(time.minute);
  updatedDate.setSeconds(time.second);
  updatedDate.setMilliseconds(time.millisecond);

  return updatedDate;
};
