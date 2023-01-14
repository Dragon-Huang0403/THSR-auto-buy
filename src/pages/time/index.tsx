import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Box, Button, IconButton, styled, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Select } from '~/src/components/Select';
import type { TimeOption } from '~/src/models/thsr';
import { stationObjects, stations, timeOptions } from '~/src/models/thsr';
import { getMinSearchTime, padTo2Digit } from '~/src/utils/helper';
import type { RouterInputs } from '~/src/utils/trpc';
import { trpc } from '~/src/utils/trpc';

import type { SearchPageQuery } from './search';

const Form = styled('form')({});

const TimePage = () => {
  const [minDate] = useState(() => getMinSearchTime());
  const [searchBarParams, setSearchBarParams] = useState<
    RouterInputs['time']['search']
  >({
    SearchType: 'S',
    Lang: 'TW',
    OutWardSearchDate: minDate,
    StartStation: stations[0],
    EndStation: stations[11],
  });

  const router = useRouter();

  const { data: maxSearchDate, error } = trpc.time.availableDate.useQuery();
  error;
  const { OutWardSearchDate } = searchBarParams;
  const selectedTime = [
    OutWardSearchDate.getHours(),
    OutWardSearchDate.getMinutes(),
  ] as TimeOption['time'];

  const selectableTime = timeOptions.filter((option) => {
    const now = new Date();
    if (now.getDate() !== OutWardSearchDate.getDate()) {
      return true;
    }
    const date = new Date(OutWardSearchDate);
    date.setHours(option.time[0]);
    date.setMinutes(option.time[1]);
    return date >= now;
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        const searchPageQuery: SearchPageQuery = {
          ...searchBarParams,
          OutWardSearchDate: searchBarParams.OutWardSearchDate.toString(),
        };
        router.push(`/time/search?${new URLSearchParams(searchPageQuery)}`);
      }}
      sx={{ display: 'grid', gap: 2, py: 4, px: 2 }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
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
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            position: 'absolute',
            left: '50%',
            top: '50%',
            translate: '-50% -50%',
            zIndex: 100,
            bgcolor: (theme) => theme.palette.common.white,
            border: (theme) => `1px solid ${theme.palette.grey[500]}`,
            borderRadius: '50%',
          }}
        >
          <IconButton
            onClick={() => {
              setSearchBarParams((prev) => ({
                ...prev,
                StartStation: prev.EndStation,
                EndStation: prev.StartStation,
              }));
            }}
          >
            <SwapVertIcon />
          </IconButton>
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
      </Box>
      <DatePicker
        views={['day']}
        label="選擇日期"
        value={OutWardSearchDate}
        minDate={minDate}
        maxDate={maxSearchDate}
        onChange={(newValue) => {
          if (!newValue) return;
          let newDate = new Date(OutWardSearchDate);
          newDate.setMonth(newValue.getMonth());
          newDate.setDate(newValue.getDate());
          const now = new Date();
          if (newDate < now) {
            newDate = getMinSearchTime();
          }
          setSearchBarParams((prev) => ({
            ...prev,
            OutWardSearchDate: newDate,
          }));
        }}
        renderInput={(params) => <TextField {...params} helperText={null} />}
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
        options={selectableTime.map((option) => ({
          value: option.time,
          label: option.time.map((item) => padTo2Digit(item)).join(':'),
        }))}
      />

      <Button type="submit">查詢</Button>
    </Form>
  );
};

export default TimePage;
