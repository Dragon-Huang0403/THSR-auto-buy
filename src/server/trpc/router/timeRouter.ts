import { TRPCError } from '@trpc/server';
import { format } from 'date-fns';
import { z } from 'zod';

import { discountType, stations } from '~/src/models/thsr';
import {
  getAvailableDate,
  postTHSRTimeTable,
} from '~/src/server/THSR/utils/searchApis';

import { publicProcedure, router } from '../trpc';

export const timeRouter = router({
  search: publicProcedure
    .input(
      z.object({
        startStation: z.enum(stations),
        endStation: z.enum(stations),
        searchDate: z.date(),
      }),
    )
    .query(async ({ input }) => {
      if (input.startStation === input.endStation) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '啟程站與到達站不能相同',
        });
      }

      try {
        const [response, discounts] = await Promise.all([
          postTHSRTimeTable({
            SearchType: 'S',
            Lang: 'TW',
            StartStation: input.startStation,
            EndStation: input.endStation,
            OutWardSearchDate: format(input.searchDate, 'yyyy/MM/dd'),
            OutWardSearchTime: format(input.searchDate, 'HH:mm'),
          }),
          postTHSRTimeTable({
            SearchType: 'S',
            Lang: 'TW',
            StartStation: input.startStation,
            EndStation: input.endStation,
            OutWardSearchDate: format(input.searchDate, 'yyyy/MM/dd'),
            OutWardSearchTime: format(input.searchDate, 'HH:mm'),
            DiscountType: discountType.all,
          }),
        ]);
        response.DepartureTable.TrainItem =
          response.DepartureTable.TrainItem.map((trainItem) => {
            const target = discounts.DepartureTable.TrainItem.find(
              (discountedTrainItem) =>
                discountedTrainItem.TrainNumber === trainItem.TrainNumber,
            );
            if (target) {
              trainItem.Discount = target.Discount;
            }
            return trainItem;
          });

        return response;
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '拿取資料失敗',
        });
      }
    }),
  availableDate: publicProcedure
    .output(z.date())
    .query(() => getAvailableDate()),
});
