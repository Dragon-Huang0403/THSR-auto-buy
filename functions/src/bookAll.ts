import { format } from 'date-fns';
import type { Firestore } from 'firebase-admin/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';

import { reservationSchema } from '../../firestore/schema.mjs';
import { bookingByDateFlow, bookingByTrainNoFlow } from './thsr/bookingFlow.js';
import { STATION_OBJECTS } from './thsr/utils/constants.js';
import { findNearestSelectedTime } from './thsr/utils/searchApis.js';

const TABLE_NAME = 'reservations';

async function getAvailableReservations(db: Firestore) {
  const now = new Date();
  const collectionRef = db.collection(TABLE_NAME);
  const documents = await collectionRef
    .where('ticketResult', '==', null)
    .where('bookDate', '<=', now)
    .get();
  const data = documents.docs.map((doc) =>
    Object.fromEntries(
      Object.entries(doc.data()).map(([key, value]) => {
        if (value instanceof Timestamp) {
          return [
            key,
            new Timestamp(value.seconds, value.nanoseconds).toDate(),
          ];
        }
        return [key, value];
      }),
    ),
  );
  return z.array(reservationSchema).parse(data);
}

export async function bookAll(db: Firestore) {
  const reservations = await getAvailableReservations(db);
  console.log('>> Got Data at: ', new Date());

  await Promise.all(
    reservations.map(async (reservation) => {
      if (!reservation) {
        console.error('no reservation');
        throw new Error('no reservation');
      }
      const data = {
        selectStartStation: STATION_OBJECTS[reservation.startStation].value,
        selectDestinationStation: STATION_OBJECTS[reservation.endStation].value,
        toTimeInputField: format(reservation.searchDate, 'yyyy/MM/dd'),
        'trainCon:trainRadioGroup': 0,
        'seatCon:seatRadioGroup': 0,
        'tripCon:typesoftrip': 0,
        'ticketPanel:rows:0:ticketAmount': `${reservation.adult}F`,
        'ticketPanel:rows:1:ticketAmount': `${reservation.child}H`,
        'ticketPanel:rows:2:ticketAmount': `${reservation.disabled}W`,
        'ticketPanel:rows:3:ticketAmount': `${reservation.elder}E`,
        'ticketPanel:rows:4:ticketAmount': `${reservation.college}P`,
        toTimeTable: findNearestSelectedTime(reservation.searchDate).value,
        toTrainIDInputField: reservation.trainNo,
      } as const;
      const buyerInfo = {
        dummyId: reservation.taiwanId,
        dummyPhone: reservation.phone,
        email: reservation.email,
      };
      const collectionRef = db.collection(TABLE_NAME);

      let ticketResult;
      try {
        let result;
        if (reservation.bookingMethod === 'trainNo') {
          result = await bookingByTrainNoFlow(data, buyerInfo);
        } else {
          result = await bookingByDateFlow(data, buyerInfo);
        }
        const totalPrice = z
          .number()
          .int()
          .parse(Number(result.paymentDetails.at(-1)?.at(-1)));

        ticketResult = {
          ticketId: result.ticketId,
          arrivalTime: result.arrivalTime,
          departureTime: result.departureTime,
          totalPrice: totalPrice,
          updatedAt: Timestamp.now(),
        };

        console.log('>> Success: ', ticketResult);
      } catch (e) {
        ticketResult = {
          errorMessage: (e as Error).message,
          updatedAt: Timestamp.now(),
        };

        console.error('>> Error: ', ticketResult);
      }
      await collectionRef
        .doc(reservation.id)
        .update('ticketResult', ticketResult);
    }),
  );
  console.log('>> Completed!!');
  return null;
}
