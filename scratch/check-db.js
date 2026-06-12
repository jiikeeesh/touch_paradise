const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = await prisma.serviceCategory.findMany();
  console.log('Categories:', categories.map(c => ({ name: c.name, image: c.image })));
  
  const services = await prisma.service.findMany({
    where: {
      images: {
        contains: 'heli-tour'
      }
    }
  });
  console.log('Services with heli-tour:', services.map(s => ({ title: s.title, images: s.images })));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
