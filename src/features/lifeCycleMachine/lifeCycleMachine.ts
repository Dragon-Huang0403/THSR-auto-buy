import { assign, createMachine } from 'xstate';

import type { RouterInputs } from '~/src/utils/trpc';

type LifeCycleMachineContext = RouterInputs['ticket']['reserve'];

type UpdateBookingOptionsEvent = {
  type: 'UpdateBookingOptions';
  data: Partial<RouterInputs['ticket']['reserve']['bookingOptions']>;
};
type UpdateBuyerInfoEvent = {
  type: 'UpdateBuyerInfo';
  data: Partial<RouterInputs['ticket']['reserve']['buyerInfo']>;
};

type LifeCycleMachineEvent = UpdateBookingOptionsEvent | UpdateBuyerInfoEvent;

export const lifeCycleMachine = createMachine(
  {
    id: 'lifeCycle',
    tsTypes: {} as import('./lifeCycleMachine.typegen').Typegen0,
    schema: {
      context: {} as LifeCycleMachineContext,
      events: {} as LifeCycleMachineEvent,
    },
    on: {
      UpdateBookingOptions: {
        actions: 'updateBookingOptions',
      },
      UpdateBuyerInfo: {
        actions: 'updateBuyerInfo',
      },
    },
  },
  {
    actions: {
      updateBookingOptions: assign((context, event) => ({
        ...context,
        bookingOptions: {
          ...context.bookingOptions,
          ...event.data,
        },
      })),
      updateBuyerInfo: assign((context, event) => ({
        ...context,
        buyerInfo: {
          ...context.buyerInfo,
          ...event.data,
        },
      })),
    },
  },
);
