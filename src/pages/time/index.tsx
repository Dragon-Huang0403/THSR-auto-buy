import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Box, Button, IconButton, styled, TextField } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { shallow } from 'zustand/shallow';

import { Select } from '~/src/components/Select';
import { stationObjects, stations } from '~/src/models/thsr';
import { useTicketStore } from '~/src/store';
import { MAX_TIME, MIN_TIME } from '~/src/utils/constants';
import { trpc } from '~/src/utils/trpc';

import type { TimeSearchQuery } from './search';

const Form = styled('form')({});

const TimePage = () => {
  const [now] = useState(() => new Date());
  const [searchDate, setSearchDate] = useState(now);
  const { searchOptions, dispatch } = useTicketStore(
    (state) => ({
      searchOptions: state.searchOptions,
      dispatch: state.dispatch,
    }),
    shallow,
  );
  const { data: maxDate } = trpc.time.availableDate.useQuery();

  const router = useRouter();

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        const searchParams: TimeSearchQuery = {
          ...searchOptions,
          searchDate: searchDate.toString(),
        };
        router.push(`/time/search?${new URLSearchParams(searchParams)}`);
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
            label: stationObjects[searchOptions.startStation].name,
          }}
          onChange={(newOption) => {
            dispatch({
              type: 'searchOptions',
              payload: {
                startStation: newOption.value,
              },
            });
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
              dispatch({
                type: 'searchOptions',
                payload: {
                  startStation: searchOptions.endStation,
                  endStation: searchOptions.startStation,
                },
              });
            }}
          >
            <SwapVertIcon />
          </IconButton>
        </Box>
        <Select
          label="到達站"
          value={{
            label: stationObjects[searchOptions.endStation].name,
          }}
          onChange={(newOption) => {
            dispatch({
              type: 'searchOptions',
              payload: {
                endStation: newOption.value,
              },
            });
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
        value={searchDate}
        minDate={now}
        maxDate={maxDate}
        onChange={(newValue) => {
          if (!newValue) return;
          setSearchDate(newValue);
        }}
        renderInput={(params) => <TextField {...params} helperText={null} />}
      />
      <TimePicker
        renderInput={(params) => <TextField {...params} />}
        value={searchDate}
        label="選擇時間"
        ampm={false}
        onChange={(newValue) => {
          if (!newValue) return;
          setSearchDate(newValue);
        }}
        minTime={MIN_TIME}
        maxTime={MAX_TIME}
      />
      <Button type="submit">查詢</Button>
    </Form>
  );
};

export default TimePage;
