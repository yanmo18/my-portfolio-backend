const { PrismaClient } = require('../generated/prisma/client');

const prisma = globalThis.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

prisma.$connect().then(async () => {
  await prisma.$executeRawUnsafe('SET NAMES utf8mb4');
  console.log('MySQL charset set to utf8mb4');
}).catch(err => {
  console.error('Failed to set charset:', err);
});

module.exports = prisma;