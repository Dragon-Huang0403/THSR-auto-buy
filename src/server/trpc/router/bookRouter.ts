import { z } from "zod";

import {
  adultTicketValues,
  childTicketValues,
  collegeTicketValues,
  disabledTicketValues,
  elderTicketValues,
  stationValues,
  toTimeTableValues,
} from "~/src/models/thsr/constants";

import {
  bookingByDateFlow,
  bookingByTrainNoFlow,
} from "../../THSR/bookingFlow";
import { ticketHistoryFlow } from "../../THSR/ticketHistoryFlow";
import { publicProcedure, router } from "../trpc";

export const bookRouter = router({
  ticket: publicProcedure
    .input(
      z.object({
        bookingOptions: z.object({
          selectStartStation: z.enum(stationValues),
          selectDestinationStation: z.enum(stationValues),
          "trainCon:trainRadioGroup": z.literal(0).or(z.literal(1)),
          "tripCon:typesoftrip": z.literal(0).or(z.literal(1)),
          "seatCon:seatRadioGroup": z
            .literal(0)
            .or(z.literal(1))
            .or(z.literal(2)),
          toTimeInputField: z.string().regex(/^\d{4}\/\d{2}\/\d{2}$/),
          toTimeTable: z.enum(toTimeTableValues),
          "ticketPanel:rows:0:ticketAmount": z.enum(adultTicketValues),
          "ticketPanel:rows:1:ticketAmount": z.enum(childTicketValues),
          "ticketPanel:rows:2:ticketAmount": z.enum(disabledTicketValues),
          "ticketPanel:rows:3:ticketAmount": z.enum(elderTicketValues),
          "ticketPanel:rows:4:ticketAmount": z.enum(collegeTicketValues),
          toTrainIDInputField: z.string(),
        }),
        buyerInfo: z.object({
          dummyId: z.string().length(10),
          dummyPhone: z.string(),
          email: z.string(),
        }),
        buyNthTrainItem: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      let result;
      if (input.bookingOptions.toTrainIDInputField) {
        result = await bookingByTrainNoFlow(
          input.bookingOptions,
          input.buyerInfo
        );
      } else {
        result = await bookingByDateFlow(
          input.bookingOptions,
          input.buyerInfo,
          input.buyNthTrainItem
        );
      }

      console.log({ result });

      return result;
    }),
  search: publicProcedure
    .input(
      z.object({
        typesofid: z.union([z.literal(0), z.literal(1)]),
        rocId: z.string(),
        orderId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await ticketHistoryFlow(input);
      console.log(result);
    }),
});
