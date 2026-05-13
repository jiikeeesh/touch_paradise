const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
