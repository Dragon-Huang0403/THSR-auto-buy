import axios from 'axios';
import { addDays } from 'date-fns';
import { z } from 'zod';

import { env } from '~/src/env/server.mjs';

import type { components, paths } from './schema';

const urls = {
  base: 'https://tdx.transportdata.tw/api/basic',
  accessToken:
    'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
  timeTable: '/v2/Rail/THSR/GeneralTimetable',
} as const;
const client = axios.create({ baseURL: urls.base });

export const token = { accessToken: '', expiredAt: new Date(2000, 1, 1) };

const refreshAccessTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
});

/**
 * https://github.com/tdxmotc/SampleCode
 */
export async function getRefreshAccessToken() {
  const { data } = await axios.post(
    urls.accessToken,
    {
      grant_type: 'client_credentials',
      client_id: env.TDX_CLIENT_ID,
      client_secret: env.TDX_CLIENT_SECRET,
    },
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    },
  );
  const result = refreshAccessTokenSchema.safeParse(data);
  if (!result.success) {
    return false;
  }
  token.accessToken = result.data.access_token;
  token.expiredAt = addDays(new Date(), 1);
  return true;
}

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
  try {
    const { data } = await client.get<
      TimeTableOperation['responses'][200]['content']['application/json']
    >(urls.timeTable, {
      params: query,
      headers: { authorization: `Bearer ${token.accessToken}` },
    });

    return data;
  } catch (e) {
    console.log({ e });
  }
}
