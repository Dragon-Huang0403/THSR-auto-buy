import { router } from '../trpc';
import { ticketRouter } from './ticketRouter';
import { timeRouter } from './timeRouter';

export const appRouter = router({
  ['ticket']: ticketRouter,
  ['time']: timeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
