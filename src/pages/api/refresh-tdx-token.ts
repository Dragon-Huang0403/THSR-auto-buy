import type { NextApiRequest, NextApiResponse } from 'next';

import { getRefreshAccessToken } from '~/src/models/openapi/utils';

const refreshTDXToken = async (req: NextApiRequest, res: NextApiResponse) => {
  await getRefreshAccessToken();

  res.status(200).send(null);
};

export default refreshTDXToken;
