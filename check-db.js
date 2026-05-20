const { PrismaClient } = require('./src/generated/prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  console.log('📊 查询数据库中的数据...');
  
  const profiles = await prisma.profile.findMany();
  console.log('Profile 表数据:', profiles);
  
  const projects = await prisma.project.findMany();
  console.log('Project 表数据:', projects);
  
  const awards = await prisma.award.findMany();
  console.log('Award 表数据:', awards);
  
  const experiences = await prisma.experience.findMany();
  console.log('Experience 表数据:', experiences);
  
  await prisma.$disconnect();
}

checkData().catch(console.error);
