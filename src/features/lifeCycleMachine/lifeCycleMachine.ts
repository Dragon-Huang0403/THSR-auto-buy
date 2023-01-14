import { assign, createMachine } from 'xstate';

import { getMinSearchTime } from '~/src/utils/helper';
import type { RouterInputs } from '~/src/utils/trpc';

type LifeCycleMachineContext = RouterInputs['ticket']['reserve'];

type UpdateBookingOptionsEvent = {
  type: 'UpdateBookingOptions';
  data: Partial<RouterInputs['ticket']['reserve']['bookingOptions']>;
};

type LifeCycleMachineEvent = UpdateBookingOptionsEvent;

export const lifeCycleMachine = createMachine(
  {
    id: 'lifeCycle',
    tsTypes: {} as import('./lifeCycleMachine.typegen').Typegen0,
    schema: {
      context: {} as LifeCycleMachineContext,
      events: {} as LifeCycleMachineEvent,
    },
    context: {
      bookingOptions: {
        selectStartStation: '1',
        selectDestinationStation: '12',
        'trainCon:trainRadioGroup': 0,
        'tripCon:typesoftrip': 0,
        'seatCon:seatRadioGroup': 0,
        toTimeInputField: getMinSearchTime(),
        toTimeTable: '1201A',
        'ticketPanel:rows:0:ticketAmount': '1F',
        'ticketPanel:rows:1:ticketAmount': '0H',
        'ticketPanel:rows:2:ticketAmount': '0W',
        'ticketPanel:rows:3:ticketAmount': '0E',
        'ticketPanel:rows:4:ticketAmount': '0P',
        toTrainIDInputField: '',
      },
      buyerInfo: {
        dummyId: '',
        dummyPhone: '',
        email: '',
      },
    },
    on: {
      UpdateBookingOptions: {
        actions: 'updateBookingOptions',
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
    },
  },
);
