import { format } from 'date-fns';
import { z } from 'zod';

import { stationObjects, stations } from '~/src/models/thsr/constants';
import { HISTORY_SEARCH_METHOD_VALUES } from '~/src/utils/constants';
import { findNearestSelectedTime } from '~/src/utils/helper';
import { checkTaiwanId } from '~/src/utils/taiwanIdGenerator';

import {
  bookingByDateFlow,
  bookingByTrainNoFlow,
} from '../../THSR/bookingFlow';
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
      console.log(input);
      const { bookingOptions, userInfo, searchOptions } = input;

      const request = {
        selectStartStation: stationObjects[searchOptions.startStation].value,
        selectDestinationStation:
          stationObjects[searchOptions.endStation].value,
        toTimeInputField: format(searchOptions.searchDate, 'yyyy/MM/dd'),
        'trainCon:trainRadioGroup': 0,
        'seatCon:seatRadioGroup': 0,
        'tripCon:typesoftrip': 0,
        'ticketPanel:rows:0:ticketAmount': `${bookingOptions.ticketCounts.adult}F`,
        'ticketPanel:rows:1:ticketAmount': `${bookingOptions.ticketCounts.child}H`,
        'ticketPanel:rows:2:ticketAmount': `${bookingOptions.ticketCounts.disabled}W`,
        'ticketPanel:rows:3:ticketAmount': `${bookingOptions.ticketCounts.elder}E`,
        'ticketPanel:rows:4:ticketAmount': `${bookingOptions.ticketCounts.college}P`,
        toTimeTable: findNearestSelectedTime(searchOptions.searchDate).value,
        toTrainIDInputField: bookingOptions.trainNo,
      } as const;
      const buyerInfo = {
        dummyId: userInfo.taiwanId,
        dummyPhone: userInfo.phone,
        email: userInfo.email,
      } as const;

      let result;
      if (input.bookingOptions.bookingMethod === 'trainNo') {
        result = await bookingByTrainNoFlow(request, buyerInfo);
      } else {
        result = await bookingByDateFlow(request, buyerInfo);
      }
      console.log({ result });
      return result;
    }),
  history: publicProcedure
    .input(
      z.object({
        searchMethod: z.enum(HISTORY_SEARCH_METHOD_VALUES),
        taiwanId: z
          .string()
          .refine(checkTaiwanId, { message: '身分證字號錯誤' }),
        orderId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const result = await ticketHistoryFlow({
        typesofid: 0,
        rocId: input.taiwanId,
        orderId: input.orderId,
      });
      return result;
    }),
});
