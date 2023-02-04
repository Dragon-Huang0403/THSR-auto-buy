import { z } from 'zod';

import { reservationSchema } from '~/firestore/schema';
import { getBookDate } from '~/src/utils/helper';
import { checkTaiwanId } from '~/src/utils/taiwanIdGenerator';

import { ticketHistoryFlow } from '../../THSR/ticketHistoryFlow';
import { publicProcedure, router } from '../trpc';
reservationSchema;
import { addReservation, findReservations } from '~/src/server/db/firestore';

export const ticketRouter = router({
  reserve: publicProcedure
    .input(
      reservationSchema.omit({
        id: true,
        hasBook: true,
        ticketResults: true,
        createdAt: true,
        updatedAt: true,
        bookDate: true,
      }),
    )
    .mutation(async ({ input }) => {
      const bookDate = getBookDate(input.searchDate);
      await addReservation({ ...input, bookDate });
    }),
  history: publicProcedure
    .input(
      z.object({
        taiwanId: z
          .string()
          .refine(checkTaiwanId, { message: '身分證字號錯誤' }),
      }),
    )
    .query(async ({ input }) => {
      const result = findReservations(input.taiwanId);
      return result;
    }),
  ticketResult: publicProcedure
    .input(
      z.object({
        taiwanId: z
          .string()
          .refine(checkTaiwanId, { message: '身分證字號錯誤' }),
        ticketId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const result = await ticketHistoryFlow({
        typesofid: 0,
        rocId: input.taiwanId,
        orderId: input.ticketId,
      });
      return result;
    }),
});
