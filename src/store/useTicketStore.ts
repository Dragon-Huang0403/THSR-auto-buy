import superjson from 'superjson';
import { create } from 'zustand';
import type { StorageValue } from 'zustand/middleware';
import { persist } from 'zustand/middleware';

import { STATIONS } from '~/firestore/constants';
import type { ClientReservation } from '~/firestore/schema';

import { getMinBookDate } from '../utils/helper';

type StoreData = Omit<ClientReservation, 'bookDate'> & {
  minBookDate: Date;
};

export interface TicketStore extends StoreData {
  dispatch: (action: {
    payload: Partial<Omit<TicketStore, 'dispatch' | 'minBookDate'>>;
  }) => void;
}

function getInitialStoreData(): StoreData {
  const minBookDate = getMinBookDate();
  const now = new Date();
  const searchDate = new Date(minBookDate);
  searchDate.setHours(now.getHours());
  searchDate.setMinutes(now.getMinutes());
  return {
    minBookDate,

    startStation: STATIONS[0],
    endStation: STATIONS[1],
    searchDate,

    bookingMethod: 'time',
    trainNo: '',
    carType: 0,
    seatType: 0,

    adult: 1,
    child: 0,
    disabled: 0,
    elder: 0,
    college: 0,

    taiwanId: '',
    email: '',
    phone: '',
  };
}
const initialStoreData = getInitialStoreData();

export const useTicketStore = create<TicketStore>()(
  persist(
    (set) => {
      return {
        ...initialStoreData,
        dispatch: ({ payload }) =>
          set(() => ({
            ...payload,
          })),
      };
    },
    {
      name: 'ticketStore',
      version: 1,
      storage: {
        getItem: async (name) => {
          const str = localStorage.getItem(name);
          if (!str) {
            return null;
          }
          /**
           * TODO: Fix mui input ssr class name not match issue
           */
          await new Promise((res) => {
            setTimeout(res, 500);
          });

          const oldState = superjson.parse<StorageValue<TicketStore>>(str);

          if (oldState.version !== 1) {
            return null;
          }

          const minBookDate = getMinBookDate();
          oldState.state.minBookDate = minBookDate;
          if (oldState.state.searchDate < minBookDate) {
            const now = new Date();
            const searchDate = new Date(minBookDate);
            searchDate.setHours(now.getHours());
            searchDate.setMinutes(now.getMinutes());
            oldState.state.searchDate = searchDate;
          }
          return oldState;
        },
        setItem: (name, newValue) => {
          const str = superjson.stringify(newValue);
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
