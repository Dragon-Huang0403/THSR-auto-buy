import { timeOptions } from '../models/thsr';
import type { DropFirstFewInTuple, EnumerateStringArray } from './typeHelper';

export function padTo2Digit(num: number) {
  return num.toString().padStart(2, '0');
}

export function getFormattedDate(date: Date) {
  return [
    date.getFullYear(),
    padTo2Digit(date.getMonth() + 1),
    padTo2Digit(date.getDate()),
  ];
}

export function getFormattedTime(date: Date) {
  return [padTo2Digit(date.getHours()), padTo2Digit(date.getMinutes())].join(
    ':',
  );
}

export function findNearestSelectedTime(time: Date) {
  const findLatestTime = timeOptions.find(
    (option) =>
      (option.time[0] === time.getHours() &&
        option.time[1] >= time.getMinutes()) ||
      option.time[0] > time.getHours(),
  );
  return findLatestTime;
}

export function getMinSearchTime() {
  const now = new Date();
  now.setSeconds(0);
  now.setMilliseconds(0);
  const findLatestTime = findNearestSelectedTime(now);

  if (findLatestTime) {
    now.setHours(findLatestTime.time[0]);
    now.setMinutes(findLatestTime.time[1]);
  }
  return now;
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
