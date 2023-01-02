import got from "got";
import { CookieJar } from "tough-cookie";

const baseUrl = "https://irs.thsrc.com.tw";
const searchBaseUrl = "https://www.thsrc.com.tw";
export const thsrUrls = {
  base: baseUrl,
  timeTableSearch: `${searchBaseUrl}/TimeTable/Search`,
  availableDate: `${searchBaseUrl}/RawData/EAIIRS_20230102.xml`,
};

export const defaultHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  Connection: "keep-alive",
  // Host: "irs.thsrc.com.tw",
  "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
};

const cookieJar = new CookieJar();
export const client = got.extend({
  headers: defaultHeaders,
  cookieJar,
});
