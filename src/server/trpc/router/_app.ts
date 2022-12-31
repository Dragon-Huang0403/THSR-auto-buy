import { router } from "../trpc";
import { timeTableRouter } from "./timeTable";

export const appRouter = router({
  ["time-table"]: timeTableRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
