import { initializeApp } from 'firebase/app';
import { Timestamp } from 'firebase/firestore';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { z } from 'zod';

import { reservationSchema } from '~/firestore/schema.mjs';

import { clientEnv } from '../../env/schema.mjs';

const firebaseConfig = {
  apiKey: clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: clientEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: clientEnv.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const TABLE_NAME = 'reservations';

type ReservationWithoutId = Omit<z.infer<typeof reservationSchema>, 'id'>;

export async function addReservation(data: ReservationWithoutId) {
  const docRef = doc(collection(db, TABLE_NAME));
  const docData: z.infer<typeof reservationSchema> = {
    ...data,
    id: docRef.id,
  };
  await setDoc(docRef, docData);
}

export async function findReservations(taiwanId: string) {
  const q = query(
    collection(db, TABLE_NAME),
    where('taiwanId', '==', taiwanId),
    orderBy('searchDate', 'desc'),
  );
  const querySnapshot = await getDocs(q);
  const result = querySnapshot.docs.map((doc) => {
    /**
     * Convert Timestamp to Date
     */
    return Object.fromEntries(
      Object.entries(doc.data()).map(([key, value]) => {
        if (value instanceof Timestamp) {
          return [
            key,
            new Timestamp(value.seconds, value.nanoseconds).toDate(),
          ];
        }
        return [key, value];
      }),
    );
  });

  return z.array(reservationSchema).parse(result);
}
