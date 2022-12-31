import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { stationValues } from "~/src/models/THSRTimeTable";
import { postTHSRTimeTable } from "~/src/server/THSR/api";
import { getFormattedDate, getFormattedTime } from "~/src/utils/helper";

import { publicProcedure, router } from "../trpc";

function getMaxSearchDate() {
  const now = new Date();
  now.setMonth(now.getMonth() + 2);
  return now;
}

export const timeTableRouter = router({
  searchTable: publicProcedure
    .input(
      z.object({
        SearchType: z.enum(["S", "R"]),
        Lang: z.literal("TW"),
        StartStation: z.enum(stationValues),
        EndStation: z.enum(stationValues),
        OutWardSearchDate: z
          .date()
          .min(new Date(), { message: "不能選擇過去時間" })
          .max(getMaxSearchDate(), { message: "不能選擇太久以後的時間" }),
        ReturnSearchDate: z
          .date()
          .min(new Date(), { message: "不能選擇過去時間" })
          .max(getMaxSearchDate(), { message: "不能選擇太久以後的時間" })
          .optional(),
      })
    )
    .mutation(({ input }) => {
      if (input.SearchType === "R") {
        throw new TRPCError({
          code: "METHOD_NOT_SUPPORTED",
          message: "Method is not supported yet.",
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
});
