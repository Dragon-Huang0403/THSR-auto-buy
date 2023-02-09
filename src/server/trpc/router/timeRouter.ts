import {
  getRefreshAccessToken,
  getTimeTable,
  token,
} from '~/src/models/openapi/utils';

import { publicProcedure, router } from '../trpc';

export const timeRouter = router({
  regular: publicProcedure.query(async () => {
    if (token.expiredAt < new Date()) {
      await getRefreshAccessToken();
    }
    return getTimeTable();
  }),
});
