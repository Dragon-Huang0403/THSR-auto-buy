import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { bookAll } from './bookAll.js';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();
const db = admin.firestore();

export const bookAllAtMidNight = functions
  .runWith({ secrets: ['CAPTCHA_KEY'] })
  .region('asia-east1')
  .pubsub.schedule('0 0 * * *')
  .timeZone('Asia/Taipei')
  .onRun(async () => {
    await bookAll(db);
    return null;
  });

export const bookAllOnRequest = functions
  .runWith({ secrets: ['CAPTCHA_KEY'] })
  .region('asia-east1')
  .https.onRequest(async (req, res) => {
    await bookAll(db);
    res.json({ success: true });
  });
