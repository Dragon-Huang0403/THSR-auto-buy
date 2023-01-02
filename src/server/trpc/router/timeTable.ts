import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { stationValues } from "~/src/models/THSRTimeTable";
import {
  getAvailableDate,
  postTHSRTimeTable,
} from "~/src/server/THSR/utils/api";
import {
  getFormattedDate,
  getFormattedTime,
  getMinSearchTime,
} from "~/src/utils/helper";

import { publicProcedure, router } from "../trpc";

export const timeTableRouter = router({
  searchTable: publicProcedure
    .input(
      z.object({
        SearchType: z.enum(["S", "R"]),
        Lang: z.literal("TW"),
        StartStation: z.enum(stationValues),
        EndStation: z.enum(stationValues),
        OutWardSearchDate: z.date(),
        ReturnSearchDate: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.SearchType === "R") {
        throw new TRPCError({
          code: "METHOD_NOT_SUPPORTED",
          message: "Method is not supported yet.",
        });
      }
      if (input.OutWardSearchDate < getMinSearchTime()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "不能選擇過去時間",
        });
      }
      const maxSearchDate = await getAvailableDate();
      if (input.OutWardSearchDate > maxSearchDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "不能選擇太久以後的時間",
        });
      }

      return postTHSRTimeTable({
        SearchType: input.SearchType,
        Lang: input.Lang,
        StartStation: input.StartStation,
        EndStation: input.EndStation,
        OutWardSearchDate: getFormattedDate(input.OutWardSearchDate),
        OutWardSearchTime: getFormattedTime(input.OutWardSearchDate),
      });
    }),
  availableDate: publicProcedure.query(() => getAvailableDate()),
});
