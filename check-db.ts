import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const treks = await prisma.trek.findMany({
    include: { region: true }
  });
  console.log('--- TREK LIST ---');
  treks.forEach(t => {
    console.log(`[${t.region?.name}] ${t.title} (${t.slug})`);
  });
  console.log('Total Treks:', treks.length);

  const regions = await prisma.region.findMany();
  console.log('Total Regions:', regions.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
