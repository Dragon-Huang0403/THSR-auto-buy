import got from "got";

import type {
  PostTHSRTimeTableRequest,
  PostTHSRTimeTableResponse,
} from "~/src/models/THSRTimeTable";

const thsrcTimeTableSearchUrl = "https://www.thsrc.com.tw/TimeTable/Search";

export async function postTHSRTimeTable(request: PostTHSRTimeTableRequest) {
  const response = (await got
    .post(thsrcTimeTableSearchUrl, { json: request })
    .json()) as PostTHSRTimeTableResponse;

  if (!response.success) {
    throw new Error("Get TimeTable Data Failed");
  }
  return response.data;
}
