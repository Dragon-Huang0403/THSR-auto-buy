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
import { useRouter } from 'next/router';

import { STATION_OBJECTS, STATIONS } from '~/firestore/constants.mjs';

import { Select } from '../components/Select';
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
  const { dispatch, ...ticketStore } = useTicketStore();

  const reserve = trpc.ticket.reserve.useMutation();

  const router = useRouter();
  const utils = trpc.useContext();
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        reserve.mutate(ticketStore, {
          onSuccess() {
            router.push('/history');
            utils.ticket.history.prefetch({ taiwanId: ticketStore.taiwanId });
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
            label: STATION_OBJECTS[ticketStore.startStation].name,
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
                  startStation: ticketStore.endStation,
                  endStation: ticketStore.startStation,
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
            label: STATION_OBJECTS[ticketStore.endStation].name,
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
        value={ticketStore.searchDate}
        minDate={ticketStore.minBookDate}
        maxDate={addDays(ticketStore.minBookDate, MAX_BOOK_DAYS)}
        onChange={(newValue) => {
          if (!newValue) return;
          dispatch({
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
          value={ticketStore.bookingMethod}
          onChange={(e, newMethod) => {
            dispatch({
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
      {ticketStore.bookingMethod === 'time' && (
        <TimePicker
          renderInput={(params) => (
            <TextField id="input-time-picker" {...params} />
          )}
          value={ticketStore.searchDate}
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
      )}
      {ticketStore.bookingMethod === 'trainNo' && (
        <TextField
          id="input-trainNo"
          required
          label="輸入車次"
          type={'number'}
          value={ticketStore.trainNo}
          onChange={(e) => {
            dispatch({
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
          value={ticketStore.taiwanId}
          sx={{ flexGrow: 1 }}
          onChange={(e) => {
            dispatch({
              payload: { taiwanId: e.target.value },
            });
          }}
        />

        <Button
          sx={{ height: '100%' }}
          onClick={() => {
            const randomId = getRandomTaiwanId();
            dispatch({
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
        value={ticketStore.email}
        sx={{ flexGrow: 1 }}
        onChange={(e) => {
          dispatch({
            payload: { email: e.target.value },
          });
        }}
      />
      <TextField
        id="input-phone"
        label="聯絡電話"
        value={ticketStore.phone}
        sx={{ flexGrow: 1 }}
        onChange={(e) => {
          dispatch({
            payload: { phone: e.target.value },
          });
        }}
      />
      <Button type="submit">立即訂票</Button>
    </Form>
  );
};

export default ReservePage;
