import { TRPCError } from "@trpc/server";
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
import { getFormattedDate } from "~/src/utils/helper";

import {
  bookingByDateFlow,
  bookingByTrainNoFlow,
} from "../../THSR/bookingFlow";
import { ticketHistoryFlow } from "../../THSR/ticketHistoryFlow";
import { getAvailableDate } from "../../THSR/utils/searchApis";
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
          toTimeInputField: z.date(),
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
      const minBookingDate = await getAvailableDate();
      const formattedDate = getFormattedDate(
        input.bookingOptions.toTimeInputField
      );
      if (input.bookingOptions.toTimeInputField < minBookingDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `此時間 ${formattedDate} 台灣高鐵已開放購票，請自行上網進行購買`,
        });
      }
      const bookingOptions = {
        ...input.bookingOptions,
        toTimeInputField: formattedDate,
      };

      let result;
      if (input.bookingOptions.toTrainIDInputField) {
        result = await bookingByTrainNoFlow(bookingOptions, input.buyerInfo);
      } else {
        result = await bookingByDateFlow(
          bookingOptions,
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
