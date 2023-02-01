import * as functions from "firebase-functions";
import got from "got";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions
    .region("asia-east1")
    .https.onRequest(async (request, response) => {
      const data = await got
          .get("https://thsr-auto-buy.vercel.app/api/test")
          .json();
      response.send(data);
    });
