import 'react-calendar/dist/Calendar.css';

import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import Calendar from 'react-calendar';

import { Select } from '~/src/components/Select';
import type { Station } from '~/src/models/thsr';
import { stationObjects, stations } from '~/src/models/thsr';
import { selectableTime as _selectableTime } from '~/src/utils/constants';
import { getFormattedDate, padTo2Digit } from '~/src/utils/helper';
import type { RouterInputs } from '~/src/utils/trpc';

export type SearchBarParams = Omit<
  RouterInputs['time']['search'],
  'StartStation' | 'EndStation'
> & {
  StartStation: Station;
  EndStation: Station;
};

interface SearchBarProps {
  initialValue: SearchBarParams;
  onSubmit: (params: SearchBarParams) => void;
  minSearchDate?: Date;
  maxSearchDate?: Date;
}

export function SearchBar({
  onSubmit,
  initialValue,
  minSearchDate,
  maxSearchDate,
}: SearchBarProps) {
  const [searchBarParams, setSearchBarParams] = useState(initialValue);
  const [isCalendarShown, setIsCalendarShown] = useState(false);

  const { OutWardSearchDate } = searchBarParams;
  const selectedTime: [number, number] = [
    OutWardSearchDate.getHours(),
    OutWardSearchDate.getMinutes(),
  ];
  const selectableTime = _selectableTime.filter((time) => {
    const date = new Date(OutWardSearchDate);
    date.setHours(time[0]);
    date.setMinutes(time[1]);
    return minSearchDate ? date >= minSearchDate : true;
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(searchBarParams);
      }}
    >
      <Select
        label="啟程站"
        value={{
          label: stationObjects[searchBarParams.StartStation].name,
          value: searchBarParams.StartStation,
        }}
        onChange={(newOption) => {
          setSearchBarParams((prev) => ({
            ...prev,
            StartStation: newOption.value,
          }));
        }}
        options={stations.map((station) => ({
          value: station,
          label: stationObjects[station].name,
        }))}
      />
      <Box>
        <Button
          onClick={() => {
            setSearchBarParams((prev) => ({
              ...prev,
              StartStation: prev.EndStation,
              EndStation: prev.StartStation,
            }));
          }}
        >
          交換
        </Button>
      </Box>
      <Select
        label="到達站"
        value={{
          label: stationObjects[searchBarParams.EndStation].name,
          value: searchBarParams.EndStation,
        }}
        onChange={(newOption) => {
          setSearchBarParams((prev) => ({
            ...prev,
            EndStation: newOption.value,
          }));
        }}
        options={stations.map((station) => ({
          value: station,
          label: stationObjects[station].name,
        }))}
      />
      <Select
        label="選擇時間"
        value={{
          label: selectedTime.map((item) => padTo2Digit(item)).join(':'),
          value: selectedTime,
        }}
        onChange={(newOption) => {
          const newDate = new Date(OutWardSearchDate);
          newDate.setHours(newOption.value[0]);
          newDate.setMinutes(newOption.value[1]);
          setSearchBarParams((prev) => ({
            ...prev,
            OutWardSearchDate: newDate,
          }));
        }}
        options={selectableTime.map((time) => ({
          value: time,
          label: time.map((item) => padTo2Digit(item)).join(':'),
        }))}
      />
      <Box className="relative">
        <Box>{getFormattedDate(OutWardSearchDate).join('/')}</Box>
        <Button
          type="button"
          onClick={() => {
            setIsCalendarShown(true);
          }}
        >
          選擇日期
        </Button>
        {isCalendarShown && (
          <Calendar
            value={OutWardSearchDate}
            onChange={(newDate: Date) => {
              newDate.setHours(OutWardSearchDate.getHours());
              newDate.setMinutes(OutWardSearchDate.getMinutes());
              setSearchBarParams((prev) => ({
                ...prev,
                OutWardSearchDate: newDate,
              }));
              setIsCalendarShown(false);
            }}
            className="absolute"
            minDate={minSearchDate}
            maxDate={maxSearchDate}
            view="month"
            prev2Label={null}
            next2Label={null}
          />
        )}
      </Box>
      <Button type="submit">查詢</Button>
    </form>
  );
}
