import axios from 'axios';

import type { components, paths } from './schema';

const client = axios.create({
  baseURL: 'https://tdx.transportdata.tw/api/basic',
});

const urls = {
  timeTable: '/v2/Rail/THSR/GeneralTimetable',
} as const;

type TimeTableOperation = paths[typeof urls.timeTable]['get'];
export type ServiceDays =
  keyof components['schemas']['PTX.Service.DTO.Rail.Specification.V2.THSR.ServiceDay'];

/**
 * https://tdx.transportdata.tw/api-service/swagger/basic/268fc230-2e04-471b-a728-a726167c1cfc#/
 */
export async function getTimeTable() {
  const query: TimeTableOperation['parameters']['query'] = {
    $format: 'JSON',
  };

  const { data } = await client.get<
    TimeTableOperation['responses'][200]['content']['application/json']
  >(urls.timeTable, { params: query });

  return data;
}
