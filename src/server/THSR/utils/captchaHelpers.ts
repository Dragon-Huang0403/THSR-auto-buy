import type { Got } from 'got';
import got from 'got';

import { env } from '~/src/env/server.mjs';

/**
 * https://2captcha.com/2captcha-api#solving_normal_captcha
 */
type SolveImageCaptchaResponse =
  | {
      status: 0;
    }
  | {
      status: 1;
      request: string;
    };

async function sendSolveCaptchaRequest(base64Buffer: string) {
  const res = (await got
    .post('http://2captcha.com/in.php', {
      form: {
        key: env.CAPTCHA_KEY,
        method: 'base64',
        body: base64Buffer,
        // tells the server to send the response as JSON
        json: 1,
      },
    })
    .json()) as SolveImageCaptchaResponse;
  return res;
}

async function getSolveCaptchaResult(requestId: string) {
  let retry = 10;
  let delay = 5000;
  let response: SolveImageCaptchaResponse = { status: 0 };

  console.time('Get Captcha Result');
  while (retry && response.status === 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    response = await got
      .get(
        `http://2captcha.com/res.php?key=${env.CAPTCHA_KEY}&action=get&id=${requestId}&json=1`,
      )
      .json();

    delay = delay > 1000 ? delay - 1000 : delay;
    retry--;
  }
  console.timeEnd('Get Captcha Result');

  return response;
}

export async function getCaptchaResult(client: Got, captchaImageUrl: string) {
  const imageBody = await client.get(captchaImageUrl).buffer();
  const response = await sendSolveCaptchaRequest(imageBody.toString('base64'));

  if (response.status === 0) {
    throw new Error('Send Solve Captcha Request Failed');
  }

  const captchaResponse = await getSolveCaptchaResult(response.request);

  if (captchaResponse.status === 0) {
    throw new Error('Get Captcha Result Failed');
  }

  return captchaResponse.request.toUpperCase();
}
