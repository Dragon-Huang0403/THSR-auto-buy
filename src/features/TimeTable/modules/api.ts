import axios from "axios";

import type {
  PostTHSRTimeTableRequest,
  PostTHSRTimeTableResponse,
} from "~/src/models/THSRTimeTable";

const thsrcTimeTableSearchUrl = "https://www.thsrc.com.tw/TimeTable/Search";

export async function postTHSRTimeTable(request: PostTHSRTimeTableRequest) {
  const { data } = await axios.post<PostTHSRTimeTableResponse>(
    thsrcTimeTableSearchUrl,
    { body: request }
  );
  if (!data.success) {
    throw new Error("Get TimeTable Data Failed");
  }
  return data.data;
}
