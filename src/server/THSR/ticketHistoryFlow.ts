import type { Got } from 'got';
import parse from 'node-html-parser';

import type { SearchBookedTicketRequest } from '~/src/models/thsr';

import { getCaptchaResult } from './utils/captchaHelpers';
import {
  searchBookedTicketRequestFiller,
  visitHistoryPageResultFiller,
} from './utils/config';
import { getClient } from './utils/config';
import { thsrUrls } from './utils/config';
import { parsePageErrors, parsePurchaseResult } from './utils/parseHelper';

export async function ticketHistoryFlow(
  request: Omit<
    SearchBookedTicketRequest,
    keyof typeof searchBookedTicketRequestFiller | 'divCaptcha:securityCode'
  >,
) {
  const client = getClient();

  const captchaImageUrl = await visitHistoryPage(client);
  const captchaResult = await getCaptchaResult(client, captchaImageUrl);

  const result = await postTicketHistoryResult(client, {
    ...searchBookedTicketRequestFiller,
    ...request,
    'divCaptcha:securityCode': captchaResult,
  });
  return result;
}

async function visitHistoryPage(client: Got) {
  const { body } = await client.get(thsrUrls.bookingPage, {
    searchParams: visitHistoryPageResultFiller,
  });
  const page = parse(body);
  const pageErrors = parsePageErrors(page);
  if (pageErrors) {
    throw new Error(pageErrors.join('. '));
  }

  let captchaImageUrl = page
    .getElementById('HistoryForm_divCaptcha_passCode')
    ?.getAttribute('src');
  if (!captchaImageUrl) {
    throw new Error("Can't find captcha image url");
  }

  captchaImageUrl = thsrUrls.baseUrl + captchaImageUrl;
  return captchaImageUrl;
}

async function postTicketHistoryResult(
  client: Got,
  request: SearchBookedTicketRequest,
) {
  const { body } = await client.post(thsrUrls.bookingPage, {
    searchParams: request,
  });

  const page = parse(body);
  const pageErrors = parsePageErrors(page);
  if (pageErrors) {
    throw new Error(pageErrors.join('. '));
  }

  const purchaseResult = parsePurchaseResult(page);
  return purchaseResult;
}
