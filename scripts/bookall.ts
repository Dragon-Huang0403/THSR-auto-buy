import { format } from 'date-fns';

import type { Station } from '~/src/models/thsr';
import { stationObjects } from '~/src/models/thsr';
import { prisma } from '~/src/server/db/client';
import {
  bookingByDateFlow,
  bookingByTrainNoFlow,
} from '~/src/server/THSR/bookingFlow';
import { findNearestSelectedTime } from '~/src/utils/helper';

async function bookAll() {
  const tickets = await prisma.reservation.findMany({
    where: { bookDate: { lte: new Date() }, hasBook: false },
  });

  await Promise.all(
    tickets.map(async (ticket) => {
      const request = {
        selectStartStation:
          stationObjects[ticket.startStation as Station].value,
        selectDestinationStation:
          stationObjects[ticket.endStation as Station].value,
        toTimeInputField: format(ticket.searchDate, 'yyyy/MM/dd'),
        'trainCon:trainRadioGroup': 0,
        'seatCon:seatRadioGroup': 0,
        'tripCon:typesoftrip': 0,
        'ticketPanel:rows:0:ticketAmount': `${ticket.adult}F`,
        'ticketPanel:rows:1:ticketAmount': `${ticket.child}H`,
        'ticketPanel:rows:2:ticketAmount': `${ticket.disabled}W`,
        'ticketPanel:rows:3:ticketAmount': `${ticket.elder}E`,
        'ticketPanel:rows:4:ticketAmount': `${ticket.college}P`,
        toTimeTable: findNearestSelectedTime(ticket.searchDate).value,
        toTrainIDInputField: ticket.trainNo ?? '',
      } as const;

      const buyerInfo = {
        dummyId: ticket.taiwanId,
        dummyPhone: ticket.phone,
        email: ticket.email,
      } as const;

      let result;
      let error;
      try {
        if (ticket.trainNo) {
          result = await bookingByTrainNoFlow(request, buyerInfo);
        } else {
          result = await bookingByDateFlow(request, buyerInfo);
        }
      } catch (e) {
        error = e as Error;
      }

      await prisma.reservation.update({
        where: { id: ticket.id },
        data: {
          hasBook: true,
          ticketResults: {
            create: {
              ticketId: result?.ticketId,
              errorMessage: error?.message,
            },
          },
        },
        include: {
          ticketResults: true,
        },
      });
    }),
  );
}

bookAll()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
