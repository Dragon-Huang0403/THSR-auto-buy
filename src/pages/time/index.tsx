import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Box, Button, IconButton, styled, TextField } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { addDays } from 'date-fns';
import { useRouter } from 'next/router';
import { shallow } from 'zustand/shallow';

import { Select } from '~/src/components/Select';
import { useTicketStore } from '~/src/store';
import {
  MAX_BOOK_DAYS,
  MAX_TIME,
  MIN_TIME,
  STATION_OBJECTS,
  STATIONS,
} from '~/src/utils/constants';

const Form = styled('form')({});

const TimePage = () => {
  const { startStation, endStation, searchDate, dispatch, minBookDate } =
    useTicketStore(
      (state) => ({
        startStation: state.startStation,
        endStation: state.endStation,
        searchDate: state.searchDate,
        minBookDate: state.minBookDate,
        dispatch: state.dispatch,
      }),
      shallow,
    );

  const router = useRouter();

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/time/search`);
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
            label: STATION_OBJECTS[startStation].name,
          }}
          onChange={(newOption) => {
            dispatch({
              payload: {
                startStation: newOption.value,
              },
            });
          }}
          options={STATIONS.map((station) => ({
            value: station,
            label: STATION_OBJECTS[station].name,
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
                payload: {
                  endStation,
                  startStation,
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
            label: STATION_OBJECTS[endStation].name,
          }}
          onChange={(newOption) => {
            dispatch({
              payload: {
                endStation: newOption.value,
              },
            });
          }}
          options={STATIONS.map((station) => ({
            value: station,
            label: STATION_OBJECTS[station].name,
          }))}
        />
      </Box>
      <DatePicker
        views={['day']}
        label="選擇日期"
        value={searchDate}
        minDate={minBookDate}
        maxDate={addDays(minBookDate, MAX_BOOK_DAYS)}
        onChange={(newValue) => {
          if (!newValue) return;
          dispatch({
            payload: { searchDate: newValue },
          });
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
          dispatch({
            payload: { searchDate: newValue },
          });
        }}
        minTime={MIN_TIME}
        maxTime={MAX_TIME}
      />
      <Button type="submit">查詢</Button>
    </Form>
  );
};

export default TimePage;
