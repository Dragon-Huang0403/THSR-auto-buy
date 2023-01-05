import { router } from "../trpc";
import { bookRouter } from "./bookRouter";
import { searchRouter } from "./searchRouter";

export const appRouter = router({
  ["book"]: bookRouter,
  ["search"]: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
