import { z } from 'zod';

import { stations } from '~/src/models/thsr/constants';
import { prisma } from '~/src/server/db/client';
import { getBookDate } from '~/src/utils/helper';
import { checkTaiwanId } from '~/src/utils/taiwanIdGenerator';

import { ticketHistoryFlow } from '../../THSR/ticketHistoryFlow';
import { publicProcedure, router } from '../trpc';

export const ticketRouter = router({
  reserve: publicProcedure
    .input(
      z.object({
        searchOptions: z.object({
          startStation: z.enum(stations),
          endStation: z.enum(stations),
          searchDate: z.date(),
        }),
        bookingOptions: z.object({
          bookingMethod: z.enum(['trainNo', 'time']),
          trainNo: z.string(),
          ticketCounts: z.object({
            adult: z.number().min(0).max(10),
            child: z.number().min(0).max(10),
            disabled: z.number().min(0).max(10),
            elder: z.number().min(0).max(10),
            college: z.number().min(0).max(10),
          }),
        }),
        userInfo: z.object({
          taiwanId: z
            .string()
            .refine(checkTaiwanId, { message: '身分證字號錯誤' }),
          email: z.string().email().or(z.literal('')),
          phone: z.string(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const bookDate = getBookDate(input.searchOptions.searchDate);
      const result = await prisma.reservation.create({
        data: {
          ...input.searchOptions,
          ...input.bookingOptions.ticketCounts,
          ...input.userInfo,
          trainNo: input.bookingOptions.trainNo || null,
          bookDate,
        },
      });
      return result;
    }),
  history: publicProcedure
    .input(
      z.object({
        taiwanId: z
          .string()
          .refine(checkTaiwanId, { message: '身分證字號錯誤' }),
      }),
    )
    .mutation(async ({ input }) => {
      const result = prisma.reservation.findMany({
        where: {
          taiwanId: input.taiwanId,
        },
        include: {
          ticketResults: true,
        },
        orderBy: {
          searchDate: 'desc',
        },
      });
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
