import { PrismaClient } from '@prisma/client';

import { getRandomTaiwanId } from '~/src/utils/taiwanIdGenerator';
const prisma = new PrismaClient();

function getDateWithNDaysLater(days: number) {
  const date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 60 * 24 * days);
  return date;
}
async function main() {
  const after35Days = getDateWithNDaysLater(35);

  const dummyTickets = await prisma.ticketsByDate.create({
    data: {
      selectStartStation: '1',
      selectDestinationStation: '10',
      trainRadioGroup: 0,
      typesoftrip: 0,
      seatRadioGroup: 0,
      toTimeInputField: after35Days,
      adultTicketValue: 1,
      childTicketValue: 0,
      disabledTicketValue: 0,
      elderTicketValue: 0,
      collegeTicketValue: 0,
      dummyId: getRandomTaiwanId(),
      dummyPhone: '',
      email: '',
      buyNthTrainItem: 0,
      toTimeTable: '1000A',
    },
  });
  console.log(dummyTickets);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
