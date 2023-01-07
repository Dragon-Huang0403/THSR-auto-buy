import { type NextPage } from "next";

import { trpc } from "../utils/trpc";

const ReservePage: NextPage = () => {
  const mutation = trpc["book"].ticket.useMutation();
  console.log(mutation.data);

  return (
    <div>
      <button
        onClick={() => {
          mutation.mutate({
            bookingOptions: {
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
            buyerInfo: {
              dummyId: "A123456789",
              dummyPhone: "",
              email: "",
            },
          });
        }}
      >
        Click to book
      </button>
    </div>
  );
};

export default ReservePage;
