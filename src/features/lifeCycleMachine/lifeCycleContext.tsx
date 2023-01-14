import { useActor, useInterpret } from '@xstate/react';
import React, { useMemo } from 'react';
import { createContext, useContext } from 'react';
import type { ActorRefFrom } from 'xstate';

import { findNearestSelectedTime, getMinSearchTime } from '~/src/utils/helper';

import { lifeCycleMachine } from './lifeCycleMachine';

const LifeCycleContext = createContext(
  {} as ActorRefFrom<typeof lifeCycleMachine>,
);

type LifeCycleMachineProviderProps = {
  children: React.ReactNode;
};
export function LifeCycleProvider({ children }: LifeCycleMachineProviderProps) {
  const lifeCycleMachineMemo = useMemo(() => {
    const toTimeInputField = getMinSearchTime();
    const toTimeTable = findNearestSelectedTime(toTimeInputField).value;
    return lifeCycleMachine.withContext({
      bookingOptions: {
        selectStartStation: '1',
        selectDestinationStation: '12',
        'trainCon:trainRadioGroup': 0,
        'tripCon:typesoftrip': 0,
        'seatCon:seatRadioGroup': 0,
        toTimeInputField: toTimeInputField,
        toTimeTable: toTimeTable,
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
    });
  }, []);

  const lifeCycleActor = useInterpret(lifeCycleMachineMemo);

  return (
    <LifeCycleContext.Provider value={lifeCycleActor}>
      {children}
    </LifeCycleContext.Provider>
  );
}

export const useLifeCycleContext = () => useContext(LifeCycleContext);

export const useLifeCycleActor = () => useActor(useLifeCycleContext());
