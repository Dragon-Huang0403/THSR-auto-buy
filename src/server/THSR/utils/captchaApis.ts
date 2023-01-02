import got from "got";

import { env } from "~/src/env/server.mjs";

export async function sendSolveCaptchaRequest(base64Buffer: Buffer) {
  const res = await got
    .post("http://2captcha.com/in.php", {
      form: {
        key: env.CAPTCHA_KEY,
        method: "base64",
        body: base64Buffer,
        // tells the server to send the response as JSON
        json: 1,
      },
    })
    .json();
  return res;
}

export async function getSolveCaptchaResult(requestId: string) {
  let retry = 50;
  const delay = 300;
  let response = { status: 0 };
  console.time("Get Captcha Result");
  while (retry && response.status === 0) {
    response = await got
      .get(
        `http://2captcha.com/res.php?key=${env.CAPTCHA_KEY}&action=get&id=${requestId}&json=1`
      )
      .json();
    await new Promise((resolve) => setTimeout(resolve, delay));
    retry--;
  }
  console.timeEnd("Get Captcha Result");
  return response;
}
