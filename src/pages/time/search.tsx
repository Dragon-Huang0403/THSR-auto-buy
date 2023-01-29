import {
  ArrowBackRounded,
  DirectionsTransitRounded,
  EastRounded,
  KeyboardDoubleArrowRightRounded,
  ScheduleRounded,
} from '@mui/icons-material';
import { Box, IconButton, Link, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { differenceInMinutes, format, subMinutes } from 'date-fns';
import { useRouter } from 'next/router';
import React from 'react';
import { shallow } from 'zustand/shallow';

import type { ServiceDays } from '~/src/models/openapi/utils';
import { getTimeTable } from '~/src/models/openapi/utils';
import { stationObjects } from '~/src/models/thsr';
import { useTicketStore } from '~/src/store';
import { CHINESE_DAYS } from '~/src/utils/constants';
import { padTo2Digit } from '~/src/utils/helper';

const SEARCH_BUFFER_MINUTES = 30;

function getDayOfWeek(date: Date): ServiceDays {
  const dayOfWeek = format(date, 'iiii') as ServiceDays;
  /**
   * Fix api bug,
   * Service day on tuesday always 0
   */
  if (dayOfWeek === 'Tuesday') {
    return 'Wednesday';
  }
  return dayOfWeek;
}

function SearchPage() {
  const router = useRouter();

  const { searchOptions, dispatch } = useTicketStore(
    (state) => ({
      searchOptions: state.searchOptions,
      minBookDate: state.minBookDate,
      dispatch: state.dispatch,
    }),
    shallow,
  );

  const { data, error } = useQuery({
    queryFn: () => getTimeTable(),
    queryKey: ['timeTable'] as const,
    staleTime: Infinity,
  });

  const goNorth =
    Number(stationObjects[searchOptions.startStation].value) >
    Number(stationObjects[searchOptions.endStation].value);
  const stationIDs = [searchOptions.startStation, searchOptions.endStation].map(
    (station) => stationObjects[station].id,
  );

  const filteredTrainItems = data
    ?.filter((trainItem) => {
      if (
        Number(goNorth) !==
        trainItem.GeneralTimetable.GeneralTrainInfo.Direction
      ) {
        return false;
      }
      const stopStationIDs = trainItem.GeneralTimetable.StopTimes.map(
        (stopTime) => stopTime.StationID,
      );
      if (
        !stationIDs.every((stationID) => stopStationIDs.includes(stationID))
      ) {
        return false;
      }
      const departureTime =
        trainItem.GeneralTimetable.StopTimes.find(
          (stopTime) => stopTime.StationID === stationIDs[0],
        )?.DepartureTime ?? '';
      const offsetSearchDate = subMinutes(
        searchOptions.searchDate,
        SEARCH_BUFFER_MINUTES,
      );
      const searchDateTime = format(offsetSearchDate, 'hh:mm');
      if (departureTime < searchDateTime) {
        return false;
      }

      if (trainItem.GeneralTimetable.GeneralTrainInfo.TrainNo[0] === '0') {
        return true;
      }
      const dayOfWeek = getDayOfWeek(searchOptions.searchDate);
      if (!trainItem.GeneralTimetable.ServiceDay[dayOfWeek]) {
        return false;
      }
      return true;
    })
    .map((trainItem) => {
      const trainNo = trainItem.GeneralTimetable.GeneralTrainInfo.TrainNo;
      const departureTime =
        trainItem.GeneralTimetable.StopTimes.find(
          (stopTime) => stopTime.StationID === stationIDs[0],
        )?.DepartureTime ?? '';
      const arrivalTime =
        trainItem.GeneralTimetable.StopTimes.find(
          (stopTime) => stopTime.StationID === stationIDs[1],
        )?.ArrivalTime ?? '';
      const diffMinutes = differenceInMinutes(
        new Date(`2000/01/01 ${arrivalTime}`),
        new Date(`2000/01/01 ${departureTime}`),
      );
      const minutes = diffMinutes % 60;
      const hours = (diffMinutes - minutes) / 60;
      const duration = `${padTo2Digit(hours)}:${padTo2Digit(minutes)}`;
      return { trainNo, departureTime, arrivalTime, duration };
    });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          pr: 1,
          py: 1,
          gap: 2,
        }}
      >
        <IconButton
          sx={{ position: 'absolute', left: 0 }}
          LinkComponent={Link}
          href="/time"
        >
          <ArrowBackRounded />
        </IconButton>
        <Typography variant="h5">
          {stationObjects[searchOptions.startStation].name}
        </Typography>
        <KeyboardDoubleArrowRightRounded fontSize="large" />
        <Typography variant="h5">
          {stationObjects[searchOptions.endStation].name}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ ml: 2.5 }}>
        {`${format(searchOptions.searchDate, 'yyyy/MM/dd')} (${
          CHINESE_DAYS[searchOptions.searchDate.getDay()]
        })`}
      </Typography>
      {error && <Typography>{(error as Error).message}</Typography>}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          pt: 1,
          px: 2,
          pb: 2,
          overflow: 'auto',
          height: '100%',
        }}
      >
        {filteredTrainItems?.map((trainItem) => (
          <Box
            key={trainItem.trainNo}
            sx={{
              bgcolor: (theme) => theme.palette.grey[100],
              borderRadius: 2,
            }}
            onClick={() => {
              dispatch({
                type: 'bookingOptions',
                payload: {
                  bookingMethod: 'trainNo',
                  trainNo: trainItem.trainNo,
                },
              });
              router.push('/');
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pl: 2,
                pr: 1.5,
                pt: 1,
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="h6">{trainItem.departureTime}</Typography>
                <EastRounded />
                <Typography variant="h6">{trainItem.arrivalTime}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <ScheduleRounded fontSize="small" />
                <Typography variant="body2">{trainItem.duration}</Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <DirectionsTransitRounded />
                <Typography>{trainItem.trainNo}</Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}

export default SearchPage;
