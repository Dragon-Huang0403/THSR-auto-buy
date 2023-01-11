import { trpc } from '../utils/trpc';

const ReservePage = () => {
  const mutation = trpc['ticket'].reserve.useMutation();
  const history = trpc['ticket'].history.useMutation();

  return (
    <div>
      <button
        onClick={() => {
          mutation.mutate({
            bookingOptions: {
              selectStartStation: '1',
              selectDestinationStation: '2',
              'trainCon:trainRadioGroup': 0,
              'tripCon:typesoftrip': 0,
              'seatCon:seatRadioGroup': 0,
              toTimeInputField: new Date('2023/01/13'),
              toTimeTable: '1000A',
              'ticketPanel:rows:0:ticketAmount': '1F',
              'ticketPanel:rows:1:ticketAmount': '0H',
              'ticketPanel:rows:2:ticketAmount': '0W',
              'ticketPanel:rows:3:ticketAmount': '0E',
              'ticketPanel:rows:4:ticketAmount': '0P',
              toTrainIDInputField: '0609',
            },
            buyerInfo: {
              dummyId: 'A123456789',
              dummyPhone: '',
              email: '',
            },
          });
        }}
      >
        Click to book
      </button>
      <button
        onClick={() => {
          history.mutate({
            typesofid: 0,
            rocId: 'A123456789',
            orderId: '03391433',
          });
        }}
      >
        Click to search
      </button>
    </div>
  );
};

export default ReservePage;
