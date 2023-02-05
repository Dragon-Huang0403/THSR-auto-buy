import { addDays, getISODay, setDay, subDays } from 'date-fns';

import { EARLY_BOOK_DAY } from './constants';
import { specialBookDates } from './specialBookDates';
import type { DropFirstFewInTuple, EnumerateStringArray } from './typeHelper';

export function padTo2Digit(num: number) {
  return num.toString().padStart(2, '0');
}

export function intRangeArray<
  Min extends number,
  Max extends number,
  PostFix extends string = '',
>(min: Min, max: Max, postFix: PostFix = '' as PostFix) {
  const arr = [];
  for (let i = min; i < max; i++) {
    arr.push(`${i}${postFix}`);
  }
  return arr as DropFirstFewInTuple<Min, EnumerateStringArray<Max, PostFix>>;
}

export function getBookDate(date: Date) {
  let targetDate = new Date(date);
  const specialBookDate = specialBookDates.find(
    (data) => targetDate >= data.min && targetDate <= data.max,
  );
  if (specialBookDate) {
    return specialBookDate.bookDate;
  }

  // Between Saturday to Sunday, set To Friday
  if (getISODay(targetDate) >= 6) {
    targetDate = setDay(targetDate, 5, { weekStartsOn: 1 });
  }

  targetDate.setHours(0);
  targetDate.setMinutes(0);
  targetDate.setSeconds(0);
  targetDate.setMilliseconds(0);

  const bookDate = subDays(targetDate, EARLY_BOOK_DAY);

  return bookDate;
}

export function getMinBookDate() {
  const now = new Date();
  const minBookDate = addDays(now, EARLY_BOOK_DAY);
  while (getBookDate(minBookDate) < now) {
    minBookDate.setTime(minBookDate.getTime() + 1000 * 3600 * 24);
  }
  return minBookDate;
}
