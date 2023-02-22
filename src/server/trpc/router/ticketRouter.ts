import { z } from 'zod';

import { clientReservationSchema } from '~/firestore/schema.mjs';
import { addReservation, findReservations } from '~/src/server/db/firestore';
import { getBookDate } from '~/src/utils/helper';
import { checkTaiwanId } from '~/src/utils/taiwanIdGenerator';

import { publicProcedure, router } from '../trpc';

export const ticketRouter = router({
  reserve: publicProcedure
    .input(clientReservationSchema)
    .mutation(async ({ input }) => {
      const bookDate = getBookDate(input.searchDate);
      await addReservation({
        ...input,
        bookDate,
        createdAt: new Date(),
        ticketResult: null,
      });
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
});
