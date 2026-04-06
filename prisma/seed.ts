import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const regions = [
  {
    name: "Khumbu",
    slug: "khumbu",
    description: "The home of Mount Everest and the Sherpa people. Famous for high-altitude trails and ancient monasteries.",
    image: "/everest.png",
  },
  {
    name: "Annapurna",
    slug: "annapurna",
    description: "A diverse region offering lush subtropical forests to arid Tibetan-style landscapes.",
    image: "/annapurna.png",
  },
  {
    name: "Langtang",
    slug: "langtang",
    description: "The 'Valley of Glaciers' — a sacred landscape rich in Tamang culture and dramatic scenery.",
    image: "/langtang.png",
  },
];

const treks = [
  {
    title: "Everest Base Camp",
    slug: "everest-base-camp",
    description: "The world's most iconic trek. Walk in the footsteps of legends through Sherpa villages to the base of the highest mountain on Earth.",
    durationDays: 14,
    difficulty: "Hard",
    altitude: "5,364m",
    price: 1450,
    regionSlug: "khumbu",
    season: "Mar–May, Sep–Nov",
    images: "/everest.png",
  },
  {
    title: "Annapurna Circuit",
    slug: "annapurna-circuit",
    description: "Circumnavigate the Annapurna massif through diverse landscapes — lush subtropical forests to arid Tibetan plateau.",
    durationDays: 12,
    difficulty: "Moderate",
    altitude: "5,416m",
    price: 1200,
    regionSlug: "annapurna",
    season: "Mar–May, Sep–Nov",
    images: "/annapurna.png",
  },
  {
    title: "Mardi Himal Trek",
    slug: "mardi-himal-trek",
    description: "A secret off-the-beaten-path gem offering jaw-dropping views of Machhapuchhre and the Annapurna range.",
    durationDays: 7,
    difficulty: "Moderate",
    altitude: "4,500m",
    price: 750,
    regionSlug: "annapurna",
    season: "Year-round",
    images: "/mardi.png",
  },
  {
    title: "Langtang Valley Trek",
    slug: "langtang-valley-trek",
    description: "Explore the 'Valley of Glaciers' — a Tamang homeland rich in Buddhist culture, dense rhododendron forests, and dramatic scenery.",
    durationDays: 10,
    difficulty: "Moderate",
    altitude: "3,870m",
    price: 900,
    regionSlug: "langtang",
    season: "Mar–May, Sep–Dec",
    images: "/langtang.png",
  },
  {
    title: "Gosaikunda Lake Trek",
    slug: "gosaikunda-lake-trek",
    description: "A sacred pilgrimage and trekking destination — a stunning high-altitude glacial lake revered by both Hindus and Buddhists.",
    durationDays: 8,
    difficulty: "Moderate–Hard",
    altitude: "4,380m",
    price: 820,
    regionSlug: "langtang",
    season: "Apr–Jun, Sep–Nov",
    images: "/gosaikunda.png",
  },
  {
    title: "Poon Hill Sunrise",
    slug: "poon-hill-sunrise",
    description: "The classic introduction to Nepal trekking. Experience a breathtaking 360° Himalayan sunrise from the legendary Poon Hill viewpoint.",
    durationDays: 5,
    difficulty: "Easy",
    altitude: "3,210m",
    price: 550,
    regionSlug: "annapurna",
    season: "Year-round",
    images: "/trekkers.png",
  },
];

const videos = [
  {
    title: "Sunrise at Everest Base Camp",
    location: "Khumbu, Nepal",
    duration: "1:24",
    cover: "/everest.png",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    title: "Annapurna Circuit Highlights",
    location: "Annapurna, Nepal",
    duration: "2:10",
    cover: "/annapurna.png",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    title: "Mardi Himal Ridge Walk",
    location: "Pokhara, Nepal",
    duration: "1:45",
    cover: "/mardi.png",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
];

async function main() {
  console.log('Seeding database...');

  // 1. Create Regions
  for (const r of regions) {
    await prisma.region.upsert({
      where: { slug: r.slug },
      update: {},
      create: r,
    });
  }

  // 2. Fetch created regions to map by slug
  const allRegions = await prisma.region.findMany();
  const regionMap = Object.fromEntries(allRegions.map(r => [r.slug, r.id]));

  // 3. Create Treks
  for (const t of treks) {
    const { regionSlug, ...trekData } = t;
    const regionId = regionMap[regionSlug];
    
    if (!regionId) {
      console.warn(`Region ${regionSlug} not found for trek ${t.title}`);
      continue;
    }

    await prisma.trek.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        ...trekData,
        regionId,
      },
    });
  }

  // 4. Create Videos
  for (const v of videos) {
    await prisma.video.create({
      data: v,
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
