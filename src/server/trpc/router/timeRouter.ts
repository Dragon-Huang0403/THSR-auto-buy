import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { discountType, stations } from '~/src/models/thsr';
import {
  getAvailableDate,
  postTHSRTimeTable,
} from '~/src/server/THSR/utils/searchApis';
import {
  getFormattedDate,
  getFormattedTime,
  getMinSearchTime,
} from '~/src/utils/helper';

import { publicProcedure, router } from '../trpc';

export const timeRouter = router({
  search: publicProcedure
    .input(
      z.object({
        SearchType: z.enum(['S', 'R']),
        Lang: z.literal('TW'),
        StartStation: z.enum(stations),
        EndStation: z.enum(stations),
        OutWardSearchDate: z.date(),
        // ReturnSearchDate: z.date().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (input.StartStation === input.EndStation) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '啟程站與到達站不能相同',
        });
      }
      if (input.SearchType === 'R') {
        throw new TRPCError({
          code: 'METHOD_NOT_SUPPORTED',
          message: 'Method is not supported yet.',
        });
      }
      if (input.OutWardSearchDate < getMinSearchTime()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '不能選擇過去時間',
        });
      }
      const maxSearchDate = await getAvailableDate();
      if (input.OutWardSearchDate > maxSearchDate) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '不能選擇太久以後的時間',
        });
      }

      let response;
      try {
        response = await postTHSRTimeTable({
          SearchType: input.SearchType,
          Lang: input.Lang,
          StartStation: input.StartStation,
          EndStation: input.EndStation,
          OutWardSearchDate: getFormattedDate(input.OutWardSearchDate).join(
            '/',
          ),
          OutWardSearchTime: getFormattedTime(input.OutWardSearchDate),
          DiscountType: discountType.all,
        });
      } catch (e) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '拿取資料失敗',
        });
      }

      const result = {
        ...response.DepartureTable,
        TrainItem: response.DepartureTable.TrainItem.filter((item) => {
          const departureDate = new Date(
            `${item.RunDate} ${item.DepartureTime}`,
          );
          input.OutWardSearchDate.setTime(
            input.OutWardSearchDate.getTime() - 1000 * 60 * 30,
          );
          return departureDate >= input.OutWardSearchDate;
        }),
      };
      return result;
    }),
  availableDate: publicProcedure
    .output(z.date())
    .query(() => getAvailableDate()),
});
