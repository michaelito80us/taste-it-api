const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;

// async function main() {
//   const allEvents = await prisma.event.findMany();
//   console.log(allEvents);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
