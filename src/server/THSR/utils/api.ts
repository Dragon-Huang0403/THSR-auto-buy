import type {
  PostTHSRTimeTableRequest,
  PostTHSRTimeTableResponse,
} from "~/src/models/THSRTimeTable";

import { client, thsrUrls } from "./config";

export async function postTHSRTimeTable(request: PostTHSRTimeTableRequest) {
  const response = (await client
    .post(thsrUrls.timeTableSearch, { json: request })
    .json()) as PostTHSRTimeTableResponse;

  if (!response.success) {
    throw new Error("Get TimeTable Data Failed");
  }
  return response.data;
}

export async function getAvailableDate() {
  /**
   * @returns string: yyyy/mm/dd
   */
  const { body } = await client.get(thsrUrls.availableDate);
  const date = new Date(body);
  date.setHours(23);
  date.setMinutes(59);
  return date;
}
