import { z } from "zod";

import { bookingFlow } from "../../THSR/bookingFlow";
import type { BookingOptions } from "../../THSR/utils/bookingRequestSchema";
import { publicProcedure, router } from "../trpc";

export const bookRouter = router({
  ticket: publicProcedure
    .input(
      z.object({
        bookingOptions: z.object({
          selectStartStation: z.number().int().min(1).max(12),
          selectDestinationStation: z.number().int().min(1).max(12),
          "trainCon:trainRadioGroup": z.literal(0).or(z.literal(1)),
          "tripCon:typesoftrip": z.literal(0).or(z.literal(1)),
          "seatCon:seatRadioGroup": z
            .literal(0)
            .or(z.literal(1))
            .or(z.literal(2)),
          toTimeInputField: z.string().regex(/^\d{4}\/\d{2}\/\d{2}$/),
          toTimeTable: z.string().regex(/^\d{3,4}(A|P)$/),
          "ticketPanel:rows:0:ticketAmount": z.string().regex(/^(\d|10)F$/),
          "ticketPanel:rows:1:ticketAmount": z.string().regex(/^(\d|10)H$/),
          "ticketPanel:rows:2:ticketAmount": z.string().regex(/^(\d|10)W$/),
          "ticketPanel:rows:3:ticketAmount": z.string().regex(/^(\d|10)E$/),
          "ticketPanel:rows:4:ticketAmount": z.string().regex(/^(\d|10)P$/),
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
      const result = await bookingFlow(
        input.bookingOptions as BookingOptions,
        input.buyerInfo,
        input.buyNthTrainItem
      );
      console.log(result);

      return result;
    }),
});
