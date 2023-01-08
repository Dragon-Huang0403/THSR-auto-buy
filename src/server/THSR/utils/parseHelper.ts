import type { HTMLElement } from "node-html-parser";

import type { BookingOptions } from "~/src/models/thsr";

export function parseTrains(page: HTMLElement) {
  const trainItemQuery = ".result-item input";
  const trainItems = page.querySelectorAll(trainItemQuery).map((trainItem) => ({
    value: trainItem.getAttribute("value"),
    duration: trainItem.getAttribute("queryestimatedtime"),
    departureTime: trainItem.getAttribute("querydeparture"),
    arrivalTime: trainItem.getAttribute("queryarrival"),
    trainId: trainItem.getAttribute("querycode"),
  }));

  return trainItems;
}

export type TrainItem = ReturnType<typeof parseTrains>[number];

export function parsePurchaseResult(page: HTMLElement) {
  const result = {
    ticketId: page.querySelector(".pnr-code span")?.textContent,
    payment: page
      .querySelector(".payment-status")
      ?.textContent?.match(/\S+/)?.[0],
    trainId: page.getElementById("setTrainCode0")?.textContent,
    departureStation: page.querySelector(".departure-stn span")?.textContent,
    departureTime: page.getElementById("setTrainDeparture0")?.textContent,
    duration: page.getElementById("InfoEstimatedTime0")?.textContent,
    arrivalStation: page.querySelector(".arrival-stn span")?.textContent,
    arrivalTime: page.getElementById("setTrainArrival0")?.textContent,
    seats: page
      .querySelectorAll(".seat-label")
      .map((element) => element.textContent.match(/\S+/)?.[0]),
    paymentDetails: page
      .querySelectorAll(".uk-accordion-content .uk-grid-small")
      .map((paymentItem) => paymentItem.textContent.match(/\S+/gm)),
    totalPrice: page.getElementById("setTrainTotalPriceValue")?.textContent,
  };
  return result;
}

export type PurchaseResult = ReturnType<typeof parsePurchaseResult>;

export function parsePageErrors(page: HTMLElement) {
  const hasCookieExpireError = page.querySelector(".error-card.unknown");
  if (hasCookieExpireError) {
    return ["Cookie Expired"];
  }

  const errors = page
    .querySelectorAll(".feedbackPanelERROR")
    .map(
      (errorElement) =>
        errorElement.textContent.match(/\S+/)?.[0] ?? "no error message"
    );

  if (errors.length === 0) {
    return null;
  }

  return errors;
}

export function getPassengerAmount(bookingOptions: BookingOptions) {
  let passengerCount = 0;
  Object.keys(bookingOptions).forEach((_key) => {
    const key = _key as keyof BookingOptions;
    if (key.includes("ticketAmount")) {
      passengerCount += parseInt(bookingOptions[key] as string);
    }
  });

  return passengerCount;
}
