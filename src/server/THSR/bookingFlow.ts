import type { Got } from "got";
import parse from "node-html-parser";

import type {
  BookingOptions,
  BuyerInfo,
  PostAvailableTrainsRequest,
  PostConfirmTrainRequest,
  PostSubmitTicketRequest,
} from "~/src/models/thsr";

import { getCaptchaResult } from "./utils/captchaHelpers";
import {
  availableTrainRequestFiller,
  confirmTrainRequestFiller,
  getClient,
  submitTicketRequestFiller,
  thsrUrls,
} from "./utils/config";
import {
  getPassengerAmount,
  parsePageErrors,
  parsePurchaseResult,
  parseTrains,
} from "./utils/parseHelper";

export async function bookingFlow(
  bookingOptions: BookingOptions,
  buyerInfo: BuyerInfo,
  buyNthTrainItem = 0
) {
  const client = getClient();

  const { bookingMethod, captchaImageUrl } = await visitBookingPage(client);

  const captchaResult = await getCaptchaResult(client, captchaImageUrl);

  const trainValue = await getAvailableTrains(
    client,
    {
      ...bookingOptions,
      ...availableTrainRequestFiller,
      "homeCaptcha:securityCode": captchaResult,
      bookingMethod,
    },
    buyNthTrainItem
  );

  const memberValue = await confirmTrain(client, {
    ...confirmTrainRequestFiller,
    "TrainQueryDataViewPanel:TrainGroup": trainValue,
  });

  const purchaseResult = await submitTicket(client, {
    ...submitTicketRequestFiller,
    ...buyerInfo,
    passengerCount: getPassengerAmount(bookingOptions),
    "TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup":
      memberValue,
  });

  return purchaseResult;
}

async function visitBookingPage(client: Got) {
  const { body } = await client.get(thsrUrls.bookingPage);
  const page = parse(body);

  const pageErrors = parsePageErrors(page);
  if (pageErrors) {
    throw new Error(pageErrors.join(". "));
  }

  const bookingMethod = page
    .querySelector("[name=bookingMethod][data-target=search-by-time]")
    ?.getAttribute("value");
  if (!bookingMethod) {
    throw new Error("Can't find booking method");
  }

  let captchaImageUrl = page
    .getElementById("BookingS1Form_homeCaptcha_passCode")
    ?.getAttribute("src");
  if (!captchaImageUrl) {
    throw new Error("Can't find captcha image url");
  }

  captchaImageUrl = thsrUrls.baseUrl + captchaImageUrl;

  return {
    bookingMethod,
    captchaImageUrl,
  };
}

async function getAvailableTrains(
  client: Got,
  availableTrainRequest: PostAvailableTrainsRequest,
  buyNthTrainItem: number
) {
  const { body } = await client.post(thsrUrls.bookingPage, {
    searchParams: availableTrainRequest,
  });

  const page = parse(body);
  const pageErrors = parsePageErrors(page);
  if (pageErrors) {
    throw new Error(pageErrors.join(". "));
  }

  const trainItems = parseTrains(page);

  const trainValue = trainItems[buyNthTrainItem]?.value;
  if (!trainValue) {
    throw new Error("No Trains Available");
  }

  return trainValue;
}

async function confirmTrain(
  client: Got,
  confirmTrainRequest: PostConfirmTrainRequest
) {
  const { body } = await client.post(thsrUrls.bookingPage, {
    searchParams: confirmTrainRequest,
  });
  const page = parse(body);
  const pageErrors = parsePageErrors(page);
  if (pageErrors) {
    throw new Error(pageErrors.join(". "));
  }

  const memberValue = page
    .querySelector(
      "input[name='TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup']"
    )
    ?.getAttribute("value");

  if (!memberValue) {
    throw new Error("Can Not Get Confirm Train's Member Input");
  }

  return memberValue;
}

async function submitTicket(client: Got, request: PostSubmitTicketRequest) {
  const { body } = await client.post(thsrUrls.bookingPage, {
    searchParams: request,
  });
  const page = parse(body);
  const pageErrors = parsePageErrors(page);
  if (pageErrors) {
    throw new Error(pageErrors.join(". "));
  }
  const purchaseResult = parsePurchaseResult(page);

  return purchaseResult;
}
