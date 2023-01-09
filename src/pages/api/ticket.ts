import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '~/src/server/db/client';

const ticket = async (req: NextApiRequest, res: NextApiResponse) => {
  const tickets = await prisma.ticketsByDate.findMany();
  res.status(200).json(tickets);
};

export default ticket;
