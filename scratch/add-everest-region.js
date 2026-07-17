const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

require('dotenv').config({ path: '.env' });


const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const region = await prisma.region.upsert({
    where: { slug: 'everest-region' },
    update: {},
    create: {
      name: 'Everest Region',
      slug: 'everest-region',
      description:
        "The legendary gateway to the world's highest peak. Trek through breathtaking Himalayan landscapes, vibrant Sherpa villages, and awe-inspiring glaciers on the path to Everest Base Camp.",
      image: '/everest.png',
    },
  });
  console.log('✅ Everest Region added/verified:', region);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
