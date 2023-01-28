import { SwapVert } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  styled,
  TextField,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { addDays } from 'date-fns';

import { Select } from '../components/Select';
import { stationObjects, stations } from '../models/thsr';
import { useTicketStore } from '../store';
import {
  BOOKING_METHODS,
  MAX_BOOK_DAYS,
  MAX_TIME,
  MIN_TIME,
} from '../utils/constants';
import { getRandomTaiwanId } from '../utils/taiwanIdGenerator';
import { trpc } from '../utils/trpc';

const Form = styled('form')({});

const ReservePage = () => {
  const { searchOptions, dispatch, userInfo, bookingOptions, minBookDate } =
    useTicketStore();

  const reserve = trpc.ticket.reserve.useMutation();

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        const request = {
          searchOptions,
          bookingOptions,
          userInfo,
        };

        reserve.mutate(request, {
          onSuccess(data) {
            console.log(data);
          },
        });
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
            <SwapVert />
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
        value={searchOptions.searchDate}
        minDate={minBookDate}
        maxDate={addDays(minBookDate, MAX_BOOK_DAYS)}
        onChange={(newValue) => {
          if (!newValue) return;
          dispatch({
            type: 'searchOptions',
            payload: { searchDate: newValue },
          });
        }}
        renderInput={(params) => (
          <TextField id="input-date-picker" {...params} helperText={null} />
        )}
      />
      <FormControl>
        <FormLabel>訂票方法</FormLabel>
        <RadioGroup
          row
          value={bookingOptions.bookingMethod}
          onChange={(e, newMethod) => {
            dispatch({
              type: 'bookingOptions',
              payload: {
                bookingMethod:
                  newMethod as typeof BOOKING_METHODS[number]['value'],
              },
            });
          }}
        >
          {BOOKING_METHODS.map((method) => (
            <FormControlLabel
              key={method.value}
              value={method.value}
              label={method.label}
              control={<Radio />}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {bookingOptions.bookingMethod === 'time' && (
        <TimePicker
          renderInput={(params) => (
            <TextField id="input-time-picker" {...params} />
          )}
          value={searchOptions.searchDate}
          label="選擇時間"
          ampm={false}
          onChange={(newValue) => {
            if (!newValue) return;
            dispatch({
              type: 'searchOptions',
              payload: { searchDate: newValue },
            });
          }}
          minTime={MIN_TIME}
          maxTime={MAX_TIME}
        />
      )}
      {bookingOptions.bookingMethod === 'trainNo' && (
        <TextField
          id="input-trainNo"
          required
          label="輸入車次"
          type={'number'}
          value={bookingOptions.trainNo}
          onChange={(e) => {
            dispatch({
              type: 'bookingOptions',
              payload: { trainNo: e.target.value },
            });
          }}
        />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'stretch', gap: 2 }}>
        <TextField
          id="input-taiwanId"
          required
          label="身分證字號"
          value={userInfo.taiwanId}
          sx={{ flexGrow: 1 }}
          onChange={(e) => {
            dispatch({
              type: 'userInfo',
              payload: { taiwanId: e.target.value },
            });
          }}
        />

        <Button
          sx={{ height: '100%' }}
          onClick={() => {
            const randomId = getRandomTaiwanId();
            dispatch({
              type: 'userInfo',
              payload: { taiwanId: randomId },
            });
          }}
        >
          隨機產生
        </Button>
      </Box>
      <TextField
        id="input-email"
        label="E-mail"
        value={userInfo.email}
        sx={{ flexGrow: 1 }}
        onChange={(e) => {
          dispatch({
            type: 'userInfo',
            payload: { email: e.target.value },
          });
        }}
      />
      <TextField
        id="input-phone"
        label="聯絡電話"
        value={userInfo.phone}
        sx={{ flexGrow: 1 }}
        onChange={(e) => {
          dispatch({
            type: 'userInfo',
            payload: { phone: e.target.value },
          });
        }}
      />
      <Button type="submit">立即訂票</Button>
    </Form>
  );
};

export default ReservePage;
