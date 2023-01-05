import { bookingFlow } from "../../THSR/bookingFlow";
import { publicProcedure, router } from "../trpc";

export const bookRouter = router({
  ticket: publicProcedure.mutation(async () => {
    const result = await bookingFlow(
      {
        selectStartStation: 1,
        selectDestinationStation: 2,
        "trainCon:trainRadioGroup": 0,
        "tripCon:typesoftrip": 0,
        "seatCon:seatRadioGroup": 0,
        toTimeInputField: "2023/01/13",
        toTimeTable: "1000A",
        "ticketPanel:rows:0:ticketAmount": "1F",
        "ticketPanel:rows:1:ticketAmount": "0H",
        "ticketPanel:rows:2:ticketAmount": "0W",
        "ticketPanel:rows:3:ticketAmount": "0E",
        "ticketPanel:rows:4:ticketAmount": "0P",
      },
      {
        dummyId: "A123456789",
        dummyPhone: "",
        email: "",
      }
    );
    console.log(result);

    return result;
  }),
});
