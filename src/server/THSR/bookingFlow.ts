import type { Got } from "got";
import parse from "node-html-parser";

import type {
  BookingByDateOptions,
  BookingByTrainNoOptions as BookingByTrainNoOptions,
  BookingByTrainNoRequest,
  BuyerInfo,
  PostAvailableTrainsRequest,
  PostConfirmTrainRequest,
  PostSubmitTicketRequest,
} from "~/src/models/thsr";

import { getCaptchaResult } from "./utils/captchaHelpers";
import {
  availableTrainRequestFiller,
  bookingByTainIdRequestFiller,
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

export async function bookingByDateFlow(
  bookingOptions: BookingByDateOptions,
  buyerInfo: BuyerInfo,
  buyNthTrainItem = 0
) {
  const client = getClient();
  const { bookingMethods, captchaImageUrl } = await visitBookingPage(client);
  const captchaResult = await getCaptchaResult(client, captchaImageUrl);

  const trainValue = await getAvailableTrains(
    client,
    {
      ...bookingOptions,
      ...availableTrainRequestFiller,
      "homeCaptcha:securityCode": captchaResult,
      bookingMethod: bookingMethods[0],
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
    "wicket:interface": ":2:BookingS3Form::IFormSubmitListener",
    passengerCount: getPassengerAmount(bookingOptions),
    "TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup":
      memberValue,
  });

  return purchaseResult;
}

export async function bookingByTrainNoFlow(
  bookingOptions: BookingByTrainNoOptions,
  buyerInfo: BuyerInfo
) {
  const client = getClient();
  const { bookingMethods, captchaImageUrl } = await visitBookingPage(client);
  const captchaResult = await getCaptchaResult(client, captchaImageUrl);

  const memberValue = await confirmTrain(client, {
    ...bookingByTainIdRequestFiller,
    ...bookingOptions,
    bookingMethod: bookingMethods[1],
    "homeCaptcha:securityCode": captchaResult,
  });

  const purchaseResult = await submitTicket(client, {
    ...submitTicketRequestFiller,
    ...buyerInfo,
    "wicket:interface": ":1:BookingS3Form::IFormSubmitListener",
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

  /**
   * bookingMethods[0] = search-by-time
   * bookingMethods[1] = search-by-trainNo
   */
  const bookingMethods = page
    .querySelectorAll("[name=bookingMethod]")
    .map((element) => element.getAttribute("value")) as [string, string];

  if (bookingMethods.length !== 2) {
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
    bookingMethods,
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
  confirmTrainRequest: PostConfirmTrainRequest | BookingByTrainNoRequest
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
