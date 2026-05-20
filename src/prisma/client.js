// backend/src/prisma/client.js
// 这是连接数据库的"钥匙"，其他地方需要数据库时引入这个

const { PrismaClient } = require('@prisma/client');

// 创建 Prisma 实例
// globalThis.prisma 是为了防止开发时热重载创建多个实例
const prisma = globalThis.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],  // 打印 SQL 日志，方便调试
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

module.exports = prisma;