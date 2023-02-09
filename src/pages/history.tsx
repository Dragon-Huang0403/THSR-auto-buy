import { CalendarMonthRounded, EastRounded } from '@mui/icons-material';
import { Box, Button, styled, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';

import { STATION_OBJECTS, TICKET_TYPES } from '~/src/utils/constants';
import type { RouterOutputs } from '~/src/utils/trpc';
import { trpc } from '~/src/utils/trpc';

import { useTicketStore } from '../store';

const Form = styled('form')({});

type ReservationProps = {
  reservation: RouterOutputs['ticket']['history'][number];
};
const Reservation = ({ reservation }: ReservationProps) => {
  const ticketResult = reservation.ticketResult;

  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          !ticketResult
            ? theme.palette.grey[200]
            : 'errorMessage' in ticketResult
            ? theme.palette.error.light
            : theme.palette.success.light,
        borderRadius: 2,
        py: 1,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="h6">
            {STATION_OBJECTS[reservation.startStation].name}
          </Typography>
          <EastRounded />
          <Typography variant="h6">
            {STATION_OBJECTS[reservation.endStation].name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, placeItems: 'center' }}>
          <CalendarMonthRounded fontSize="small" />
          <Typography>
            {format(reservation.searchDate, 'yyyy/MM/dd')}
          </Typography>
        </Box>
      </Box>
      {TICKET_TYPES.map((ticketType) => (
        <Typography key={ticketType.value}>{`${ticketType.name} ${
          reservation[ticketType.value]
        } 張`}</Typography>
      ))}
      {ticketResult ? (
        <>
          {'ticketId' in ticketResult && (
            <>
              <Typography>{`車票號碼：${ticketResult.ticketId}`}</Typography>
              <Typography>{`出發時間：${ticketResult.arrivalTime}`}</Typography>
              <Typography>{`抵達時間：${ticketResult.departureTime}`}</Typography>
              <Typography>{ticketResult.totalPrice}</Typography>
            </>
          )}
          {'errorMessage' in ticketResult && (
            <Typography variant="body2">{ticketResult.errorMessage}</Typography>
          )}
        </>
      ) : (
        <>
          {reservation.trainNo ? (
            <Typography>預定班次：{reservation.trainNo}</Typography>
          ) : (
            <Typography>
              預計時間：{format(reservation.searchDate, 'hh:mm a')}
            </Typography>
          )}
          <Typography>
            開放購票時間：{format(reservation.bookDate, 'yyyy/MM/dd')}
          </Typography>
        </>
      )}
    </Box>
  );
};

const HistoryPage = () => {
  const _taiwanId = useTicketStore((state) => state.taiwanId);
  const [taiwanId, setTaiwanId] = useState(() => _taiwanId);
  const history = trpc.ticket.history.useQuery(
    { taiwanId },
    { enabled: false },
  );

  return (
    <Box>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          history.refetch();
        }}
        sx={{ display: 'grid', gap: 2, pt: 4, px: 2 }}
      >
        <TextField
          id="input-taiwanId"
          required
          label="輸入身分證字號"
          value={taiwanId}
          onChange={(e) => {
            setTaiwanId(e.target.value);
          }}
        />
        <Button type="submit">查詢</Button>
      </Form>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 2,
          overflow: 'auto',
          height: '100%',
        }}
      >
        {history.data?.map((reservation) => (
          <Reservation key={reservation.id} reservation={reservation} />
        ))}
      </Box>
    </Box>
  );
};

export default HistoryPage;
