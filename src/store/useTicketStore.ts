import superjson from 'superjson';
import { create } from 'zustand';
import type { StorageValue } from 'zustand/middleware';
import { persist } from 'zustand/middleware';

import type { BOOKING_METHODS } from '~/src/utils/constants';

import type { Station } from '../models/thsr';
import { stations } from '../models/thsr';
import { getMinSearchTime } from '../utils/helper';

export type TicketStore = {
  minDate: Date;
  searchOptions: {
    startStation: Station;
    endStation: Station;
    searchDate: Date;
  };
  bookingOptions: {
    bookingMethod: typeof BOOKING_METHODS[number]['value'];
    trainNo: string;
    ticketCounts: {
      adult: number;
      child: number;
      disabled: number;
      elder: number;
      college: number;
    };
  };
  userInfo: {
    taiwanId: string;
    email: string;
    phone: string;
  };
  dispatch: <
    OptionType extends Exclude<keyof TicketStore, 'minDate' | 'dispatch'>,
  >(action: {
    type: OptionType;
    payload: Partial<TicketStore[OptionType]>;
  }) => void;
};

export const useTicketStore = create<TicketStore>()(
  persist(
    (set) => {
      const minDate = getMinSearchTime();
      return {
        minDate,
        searchOptions: {
          startStation: stations[0],
          endStation: stations[1],
          searchDate: minDate,
        },
        bookingOptions: {
          bookingMethod: 'time',
          trainNo: '',
          ticketCounts: {
            adult: 1,
            child: 0,
            disabled: 0,
            elder: 0,
            college: 0,
          },
        },
        userInfo: {
          taiwanId: '',
          email: '',
          phone: '',
        },
        dispatch: ({ type, payload }) =>
          set((prev) => ({
            [type]: { ...prev[type], ...payload },
          })),
      };
    },
    {
      name: 'ticketStore',
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
          const minDate = getMinSearchTime();
          if (minDate > oldState.state.searchOptions.searchDate) {
            oldState.state.searchOptions.searchDate = minDate;
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
