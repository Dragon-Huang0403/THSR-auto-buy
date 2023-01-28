import superjson from 'superjson';
import { create } from 'zustand';
import type { StorageValue } from 'zustand/middleware';
import { persist } from 'zustand/middleware';

import type { BOOKING_METHODS } from '~/src/utils/constants';

import type { Station } from '../models/thsr';
import { stations } from '../models/thsr';
import { getMinBookDate } from '../utils/helper';

export type TicketStore = {
  minBookDate: Date;
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
    OptionType extends Exclude<keyof TicketStore, 'minBookDate' | 'dispatch'>,
  >(action: {
    type: OptionType;
    payload: Partial<TicketStore[OptionType]>;
  }) => void;
};

export const useTicketStore = create<TicketStore>()(
  persist(
    (set) => {
      const minBookDate = getMinBookDate();
      const now = new Date();
      const searchDate = new Date(minBookDate);
      searchDate.setHours(now.getHours());
      searchDate.setMinutes(now.getMinutes());

      return {
        minBookDate,
        searchOptions: {
          startStation: stations[0],
          endStation: stations[1],
          searchDate,
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

          const minBookDate = getMinBookDate();
          oldState.state.minBookDate = minBookDate;
          if (oldState.state.searchOptions.searchDate < minBookDate) {
            const now = new Date();
            const searchDate = new Date(minBookDate);
            searchDate.setHours(now.getHours());
            searchDate.setMinutes(now.getMinutes());
            oldState.state.searchOptions.searchDate = searchDate;
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
