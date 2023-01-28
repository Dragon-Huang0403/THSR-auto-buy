import { stations } from '~/src/models/thsr';
import { prisma } from '~/src/server/db/client';
import { getAvailableDate } from '~/src/server/THSR/utils/searchApis';
import { getBookDate } from '~/src/utils/helper';
import { getRandomTaiwanId } from '~/src/utils/taiwanIdGenerator';

async function main() {
  const searchDate = await getAvailableDate();
  const bookDate = getBookDate(searchDate);

  const result = await prisma.reservation.create({
    data: {
      startStation: stations[0],
      endStation: stations[11],
      searchDate,
      adult: 1,
      child: 0,
      disabled: 0,
      elder: 0,
      college: 0,
      taiwanId: getRandomTaiwanId(),
      email: '',
      phone: '',
      bookDate,
    },
  });
  console.log(result);
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
