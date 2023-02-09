import got from 'got';

import type {
  PostTHSRTimeTableRequest,
  PostTHSRTimeTableResponse,
  TimeOption,
} from '../schema/searchSchema.js';
import { thsrUrls } from './config.js';
import { timeOptions } from './constants.js';

export async function postTHSRTimeTable(request: PostTHSRTimeTableRequest) {
  const response = (await got
    .post(thsrUrls.timeTableSearch, { json: request })
    .json()) as PostTHSRTimeTableResponse;

  if (!response.success) {
    throw new Error('Get TimeTable Data Failed');
  }
  return response.data;
}

export async function getAvailableDate() {
  const now = new Date();
  /**
   * @returns string: yyyy/mm/dd
   */
  const { body } = await got.get(thsrUrls.availableDate(now));
  const date = new Date(body);
  date.setHours(23);
  date.setMinutes(59);
  return date;
}

export function findNearestSelectedTime(time: Date): TimeOption {
  const findLatestTime = timeOptions.find(
    (option) =>
      (option.time[0] === time.getHours() &&
        option.time[1] >= time.getMinutes()) ||
      option.time[0] > time.getHours(),
  );
  return findLatestTime ?? timeOptions[0];
}
