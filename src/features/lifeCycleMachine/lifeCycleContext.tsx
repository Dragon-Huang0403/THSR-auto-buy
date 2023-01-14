import { useActor, useInterpret } from '@xstate/react';
import React from 'react';
import { createContext, useContext } from 'react';
import type { ActorRefFrom } from 'xstate';

import { lifeCycleMachine } from './lifeCycleMachine';

const LifeCycleContext = createContext(
  {} as ActorRefFrom<typeof lifeCycleMachine>,
);

type LifeCycleMachineProviderProps = {
  children: React.ReactNode;
};
export function LifeCycleProvider({ children }: LifeCycleMachineProviderProps) {
  const lifeCycleActor = useInterpret(lifeCycleMachine);

  return (
    <LifeCycleContext.Provider value={lifeCycleActor}>
      {children}
    </LifeCycleContext.Provider>
  );
}

export const useLifeCycleContext = () => useContext(LifeCycleContext);

export const useLifeCycleActor = () => useActor(useLifeCycleContext());
