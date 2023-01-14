import SwapVertIcon from '@mui/icons-material/SwapVert';
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
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';

import { Select } from '../components/Select';
import { useLifeCycleActor } from '../features/lifeCycleMachine';
import type { StationName, TimeOption } from '../models/thsr';
import { timeOptions } from '../models/thsr';
import { stationObjects, stations } from '../models/thsr';
import { getMinSearchTime, padTo2Digit } from '../utils/helper';
import { getRandomTaiwanId } from '../utils/taiwanIdGenerator';
import { trpc } from '../utils/trpc';

const Form = styled('form')({});

const bookingMethods = [
  { value: 'time', label: '選擇時間' },
  { value: 'trainNo', label: '輸入車次' },
] as const;

const PurchasePage = () => {
  const [minDate] = useState(() => getMinSearchTime());
  const { data: maxSearchDate } = trpc.time.availableDate.useQuery();
  const purchaseTicketMutation = trpc.ticket.reserve.useMutation();

  const [lifeCycleState, lifeCycleSend] = useLifeCycleActor();
  const bookingOptions = lifeCycleState.context.bookingOptions;
  const buyerInfo = lifeCycleState.context.buyerInfo;

  const selectableTime = timeOptions.filter((option) => {
    const now = new Date();
    if (now.getDate() !== bookingOptions.toTimeInputField.getDate()) {
      return true;
    }
    const date = new Date(bookingOptions.toTimeInputField);
    date.setHours(option.time[0]);
    date.setMinutes(option.time[1]);
    return date >= now;
  });
  const [selectedTime, setSelectedTime] = useState(() => {
    return timeOptions.find(
      (option) => option.value === bookingOptions.toTimeTable,
    ) as TimeOption;
  });

  const [bookingMethod, setBookingMethod] = useState<
    typeof bookingMethods[number]['value']
  >(() => (bookingOptions.toTrainIDInputField ? 'trainNo' : 'time'));

  console.log(purchaseTicketMutation.data);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        purchaseTicketMutation.mutate({
          ...lifeCycleState.context,
          bookingOptions: {
            ...lifeCycleState.context.bookingOptions,
            toTrainIDInputField:
              bookingMethod === 'trainNo'
                ? lifeCycleState.context.bookingOptions.toTrainIDInputField
                : '',
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
            label: Object.values(stationObjects).find(
              (stationObject) =>
                stationObject.value === bookingOptions.selectStartStation,
            )?.name as StationName,
            value: bookingOptions.selectStartStation,
          }}
          onChange={(newOption) => {
            lifeCycleSend({
              type: 'UpdateBookingOptions',
              data: {
                selectStartStation: newOption.value,
              },
            });
          }}
          options={stations.map((station) => ({
            value: stationObjects[station].value,
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
              lifeCycleSend({
                type: 'UpdateBookingOptions',
                data: {
                  selectStartStation: bookingOptions.selectDestinationStation,
                  selectDestinationStation: bookingOptions.selectStartStation,
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
            label: Object.values(stationObjects).find(
              (stationObject) =>
                stationObject.value === bookingOptions.selectDestinationStation,
            )?.name as StationName,
            value: bookingOptions.selectDestinationStation,
          }}
          onChange={(newOption) => {
            lifeCycleSend({
              type: 'UpdateBookingOptions',
              data: {
                selectDestinationStation: newOption.value,
              },
            });
          }}
          options={stations.map((station) => ({
            value: stationObjects[station].value,
            label: stationObjects[station].name,
          }))}
        />
      </Box>
      <DatePicker
        views={['day']}
        label="選擇日期"
        value={bookingOptions.toTimeInputField}
        minDate={minDate}
        maxDate={maxSearchDate}
        onChange={(newValue) => {
          if (!newValue) return;
          let newDate = new Date(bookingOptions.toTimeInputField);
          newDate.setMonth(newValue.getMonth());
          newDate.setDate(newValue.getDate());
          const now = new Date();
          if (newDate < now) {
            newDate = getMinSearchTime();
          }
          lifeCycleSend({
            type: 'UpdateBookingOptions',
            data: {
              toTimeInputField: newDate,
            },
          });
        }}
        renderInput={(params) => <TextField {...params} helperText={null} />}
      />
      <FormControl>
        <FormLabel>訂票方法</FormLabel>
        <RadioGroup
          row
          value={bookingMethod}
          onChange={(e, newMethod) => {
            setBookingMethod(
              newMethod as typeof bookingMethods[number]['value'],
            );
          }}
        >
          {bookingMethods.map((method) => (
            <FormControlLabel
              key={method.value}
              value={method.value}
              label={method.label}
              control={<Radio />}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {bookingMethod === 'time' && (
        <Select
          label="選擇時間"
          value={{
            label: selectedTime.time.map((item) => padTo2Digit(item)).join(':'),
            value: selectedTime,
          }}
          onChange={(newOption) => {
            setSelectedTime(newOption.value);
            lifeCycleSend({
              type: 'UpdateBookingOptions',
              data: {
                toTimeTable: newOption.value.value,
              },
            });
          }}
          options={selectableTime.map((option) => ({
            label: option.time.map((item) => padTo2Digit(item)).join(':'),
            value: option,
          }))}
        />
      )}
      {bookingMethod === 'trainNo' && (
        <TextField
          required
          label="選擇車次"
          type={'number'}
          value={bookingOptions.toTrainIDInputField}
          onChange={(e) => {
            lifeCycleSend({
              type: 'UpdateBookingOptions',
              data: {
                toTrainIDInputField: e.target.value,
              },
            });
          }}
        />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'stretch', gap: 2 }}>
        <TextField
          required
          label="身分證字號"
          value={buyerInfo.dummyId}
          sx={{ flexGrow: 1 }}
          onChange={(e) => {
            lifeCycleSend({
              type: 'UpdateBuyerInfo',
              data: {
                dummyId: e.target.value,
              },
            });
          }}
        />
        <Button
          sx={{ height: '100%' }}
          onClick={() => {
            const randomId = getRandomTaiwanId();
            lifeCycleSend({
              type: 'UpdateBuyerInfo',
              data: {
                dummyId: randomId,
              },
            });
          }}
        >
          隨機產生
        </Button>
      </Box>
      <TextField
        label="E-mail"
        value={buyerInfo.email}
        sx={{ flexGrow: 1 }}
        onChange={(e) => {
          lifeCycleSend({
            type: 'UpdateBuyerInfo',
            data: {
              email: e.target.value,
            },
          });
        }}
      />
      <TextField
        label="聯絡電話"
        value={buyerInfo.dummyPhone}
        sx={{ flexGrow: 1 }}
        onChange={(e) => {
          lifeCycleSend({
            type: 'UpdateBuyerInfo',
            data: {
              dummyPhone: e.target.value,
            },
          });
        }}
      />

      <Button type="submit">立即訂票</Button>
    </Form>
  );
};

export default PurchasePage;
