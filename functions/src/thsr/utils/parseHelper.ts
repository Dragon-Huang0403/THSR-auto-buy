import type { HTMLElement } from 'node-html-parser';
import { z } from 'zod';

import type { CommonBookingOptions } from '../schema/bookingRequestSchema.js';

export function parseTrains(page: HTMLElement) {
  const trainItemQuery = '.result-item input';
  const trainItems = page.querySelectorAll(trainItemQuery).map((trainItem) => ({
    value: trainItem.getAttribute('value'),
    duration: trainItem.getAttribute('queryestimatedtime'),
    departureTime: trainItem.getAttribute('querydeparture'),
    arrivalTime: trainItem.getAttribute('queryarrival'),
    trainId: trainItem.getAttribute('querycode'),
  }));

  return trainItems;
}

export type TrainItem = ReturnType<typeof parseTrains>[number];

export function parsePurchaseResult(page: HTMLElement) {
  const result = {
    ticketId: page.querySelector('.pnr-code span')?.textContent,
    payment: page
      .querySelector('.payment-status')
      ?.textContent?.match(/\S+/)?.[0],
    trainId: page.getElementById('setTrainCode0')?.textContent,
    departureStation: page.querySelector('.departure-stn span')?.textContent,
    departureTime: page.getElementById('setTrainDeparture0')?.textContent,
    duration: page.getElementById('InfoEstimatedTime0')?.textContent,
    arrivalStation: page.querySelector('.arrival-stn span')?.textContent,
    arrivalTime: page.getElementById('setTrainArrival0')?.textContent,
    seats: page
      .querySelectorAll('.seat-label')
      .map((element) => element.textContent.match(/\S+/)?.[0]),
    paymentDetails: page
      .querySelectorAll('.uk-accordion-content .uk-grid-small')
      .map((paymentItem) => paymentItem.textContent.match(/\S+/gm)),
    totalPrice: page.getElementById('setTrainTotalPriceValue')?.textContent,
  };
  const schema = z.object({
    ticketId: z.string(),
    payment: z.string(),
    trainId: z.string(),
    departureStation: z.string(),
    departureTime: z.string(),
    duration: z.string(),
    arrivalStation: z.string(),
    arrivalTime: z.string(),
    seats: z.array(z.string()),
    paymentDetails: z.array(z.array(z.string())),
  });
  return schema.parse(result);
}

export type PurchaseResult = ReturnType<typeof parsePurchaseResult>;

export function parsePageErrors(page: HTMLElement) {
  const hasCookieExpireError = page.querySelector('.error-card.unknown');
  if (hasCookieExpireError) {
    return ['Cookie Expired'];
  }

  const hasServerInternalError = page.querySelector(
    '.error-card .error-content',
  );
  if (hasServerInternalError) {
    return ['Server Internal Error'];
  }

  const errors = page
    .querySelectorAll('.feedbackPanelERROR')
    .map(
      (errorElement) =>
        errorElement.textContent.match(/\S+/)?.[0] ?? 'no error message',
    );

  if (errors.length === 0) {
    return null;
  }

  return errors;
}

export function getPassengerAmount(bookingOptions: CommonBookingOptions) {
  let passengerCount = 0;
  Object.keys(bookingOptions).forEach((_key) => {
    const key = _key as keyof CommonBookingOptions;
    if (key.includes('ticketAmount')) {
      passengerCount += parseInt(bookingOptions[key] as string);
    }
  });

  return passengerCount;
}
