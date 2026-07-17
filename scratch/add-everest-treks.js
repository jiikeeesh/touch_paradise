const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

require('dotenv').config({ path: '.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const EVEREST_REGION_SLUG = 'everest-region';

const treks = [
  {
    title: 'Everest Base Camp Trek',
    slug: 'everest-base-camp-trek',
    description:
      "The world's most iconic trek. Walk in the footsteps of legends through Sherpa villages, Buddhist monasteries, and rugged glacial moraines to reach the base of the highest mountain on Earth at 5,364m.",
    durationDays: 14,
    difficulty: 'Hard',
    altitude: '5,364m',
    price: 1450,
    season: 'Mar–May, Sep–Nov',
    images: '/everest.png',
    highlights: [
      'Scenic mountain flight to Lukla',
      'Explore the vibrant Sherpa capital of Namche Bazaar',
      'Visit the sacred Tengboche Monastery',
      'Acclimatization day at Dingboche (4,410m)',
      'Stand at Kala Patthar (5,545m) for a panoramic Everest sunrise',
      'Reach the legendary Everest Base Camp at 5,364m',
      'Close-up views of the Khumbu Icefall',
    ].join('\n'),
    itinerary: [
      'Day 1: Fly Kathmandu → Lukla (2,840m), trek to Phakding (2,610m)',
      'Day 2: Trek to Namche Bazaar (3,440m)',
      'Day 3: Acclimatization day — hike to Everest View Hotel (3,880m)',
      'Day 4: Trek to Tengboche (3,860m) — monastery visit',
      'Day 5: Trek to Dingboche (4,410m)',
      'Day 6: Acclimatization hike to Nagarjuna Hill (5,100m)',
      'Day 7: Trek to Lobuche (4,940m)',
      'Day 8: Trek to Gorak Shep (5,140m), visit EBC (5,364m)',
      'Day 9: Sunrise at Kala Patthar (5,545m), descend to Pheriche (4,240m)',
      'Day 10: Trek to Namche Bazaar (3,440m)',
      'Day 11: Trek to Lukla (2,840m)',
      'Day 12: Fly Lukla → Kathmandu',
      'Day 13: Rest and city tour',
      'Day 14: Departure',
    ].join('\n'),
  },
  {
    title: 'Gokyo Lakes Trek',
    slug: 'gokyo-lakes-trek',
    description:
      "Discover the turquoise-blue Gokyo Lakes — a chain of six sacred high-altitude glacial lakes — and summit Gokyo Ri (5,357m) for some of the most spectacular panoramic views of Everest, Lhotse, Makalu, and Cho Oyu in the Himalayas.",
    durationDays: 13,
    difficulty: 'Moderate–Hard',
    altitude: '5,357m',
    price: 1350,
    season: 'Mar–May, Sep–Nov',
    images: '/everest.png',
    highlights: [
      'Sunrise panorama from Gokyo Ri (5,357m)',
      'Visit the sacred Gokyo Lakes — six glacial lakes at altitude',
      'Walk along the giant Ngozumpa Glacier — Nepal\'s longest',
      'Sherpa culture and hospitality in Namche Bazaar',
      'Views of four 8,000m peaks: Everest, Lhotse, Makalu, Cho Oyu',
      'Less crowded than the main EBC route',
    ].join('\n'),
    itinerary: [
      'Day 1: Fly Kathmandu → Lukla, trek to Phakding',
      'Day 2: Trek to Namche Bazaar (3,440m)',
      'Day 3: Acclimatization — hike to Khumjung village',
      'Day 4: Trek to Phortse Thanga (3,680m)',
      'Day 5: Trek to Machhermo (4,470m)',
      'Day 6: Trek to Gokyo (4,790m) — first lake',
      'Day 7: Hike Gokyo Ri (5,357m), explore 2nd–4th lakes',
      'Day 8: Trek to Dole (4,200m)',
      'Day 9: Trek to Namche Bazaar (3,440m)',
      'Day 10: Trek to Lukla (2,840m)',
      'Day 11: Fly Lukla → Kathmandu',
      'Day 12: Rest day / City tour',
      'Day 13: Departure',
    ].join('\n'),
  },
  {
    title: 'Everest Three Passes Trek',
    slug: 'everest-three-passes-trek',
    description:
      "The ultimate Khumbu adventure. Cross three dramatic high-altitude passes — Kongma La (5,535m), Cho La (5,420m), and Renjo La (5,340m) — while visiting both Everest Base Camp and the Gokyo Lakes in one epic 21-day circuit.",
    durationDays: 21,
    difficulty: 'Hard',
    altitude: '5,545m',
    price: 2200,
    season: 'Mar–May, Sep–Nov',
    images: '/everest.png',
    highlights: [
      'Cross three high passes: Kongma La, Cho La & Renjo La',
      'Visit Everest Base Camp (5,364m) and Kala Patthar (5,545m)',
      'Explore the pristine Gokyo Lakes and summit Gokyo Ri',
      'Experience the full Khumbu region circuit',
      'Dramatic close-up views of Lhotse, Nuptse, Makalu and Ama Dablam',
      'The most complete Everest region trekking experience',
    ].join('\n'),
    itinerary: [
      'Day 1: Fly Kathmandu → Lukla, trek to Phakding',
      'Day 2: Trek to Namche Bazaar (3,440m)',
      'Day 3: Acclimatization day at Namche',
      'Day 4: Trek to Tengboche (3,860m)',
      'Day 5: Trek to Dingboche (4,410m)',
      'Day 6: Acclimatization hike above Dingboche',
      'Day 7: Cross Kongma La Pass (5,535m) to Lobuche (4,940m)',
      'Day 8: Trek to Gorak Shep, visit EBC (5,364m)',
      'Day 9: Kala Patthar (5,545m), trek to Dzongla (4,830m)',
      'Day 10: Cross Cho La Pass (5,420m) to Thagnak (4,700m)',
      'Day 11: Trek to Gokyo (4,790m)',
      'Day 12: Summit Gokyo Ri (5,357m), explore lakes',
      'Day 13: Cross Renjo La Pass (5,340m) to Lungden (4,380m)',
      'Day 14: Trek to Thame (3,820m)',
      'Day 15: Trek to Namche Bazaar',
      'Day 16: Trek to Lukla',
      'Day 17: Fly Lukla → Kathmandu',
      'Day 18–21: Contingency/Sightseeing/Departure',
    ].join('\n'),
  },
  {
    title: 'EBC & Gokyo via Cho La Pass',
    slug: 'ebc-gokyo-cho-la-pass',
    description:
      "The best of both worlds — combine the iconic Everest Base Camp trek with the breathtaking Gokyo Lakes by crossing the thrilling Cho La Pass (5,420m). This classic circuit delivers unmatched panoramic views and a true sense of high-altitude adventure.",
    durationDays: 17,
    difficulty: 'Hard',
    altitude: '5,545m',
    price: 1850,
    season: 'Mar–May, Sep–Nov',
    images: '/everest.png',
    highlights: [
      'Summit Kala Patthar (5,545m) for the best Everest sunrise',
      'Cross the challenging Cho La Pass (5,420m)',
      'Camp at Everest Base Camp (5,364m)',
      'Summit Gokyo Ri for panoramic 8,000m peak views',
      'Trek alongside the massive Ngozumpa Glacier',
      'Visit sacred Tengboche and Pangboche monasteries',
    ].join('\n'),
    itinerary: [
      'Day 1: Fly Kathmandu → Lukla, trek to Phakding',
      'Day 2: Trek to Namche Bazaar (3,440m)',
      'Day 3: Acclimatization day at Namche',
      'Day 4: Trek to Tengboche (3,860m)',
      'Day 5: Trek to Dingboche (4,410m)',
      'Day 6: Acclimatization hike above Dingboche',
      'Day 7: Trek to Lobuche (4,940m)',
      'Day 8: Trek to Gorak Shep, visit EBC',
      'Day 9: Kala Patthar sunrise, trek to Dzongla (4,830m)',
      'Day 10: Cross Cho La Pass (5,420m), descend to Thagnak',
      'Day 11: Trek to Gokyo (4,790m)',
      'Day 12: Gokyo Ri summit day (5,357m)',
      'Day 13: Trek to Namche via Phortse',
      'Day 14: Trek to Lukla',
      'Day 15: Fly Lukla → Kathmandu',
      'Day 16–17: Rest and Departure',
    ].join('\n'),
  },
  {
    title: 'Everest Panorama Trek',
    slug: 'everest-panorama-trek',
    description:
      "A shorter, more accessible trek offering stunning close-up views of Mount Everest without the extreme altitude. Trek through lush rhododendron forests to the peaceful Tengboche Monastery and the picturesque Sherpa village of Khumjung — perfect for first-time trekkers.",
    durationDays: 9,
    difficulty: 'Moderate',
    altitude: '3,867m',
    price: 850,
    season: 'Mar–May, Sep–Nov, Dec–Feb',
    images: '/everest.png',
    highlights: [
      'Crystal-clear views of Everest, Ama Dablam, and Lhotse',
      'Visit the iconic Tengboche Monastery at 3,867m',
      'Explore the famous Sherpa market town of Namche Bazaar',
      'Trek through lush rhododendron and juniper forests',
      'Ideal for beginners and families',
      'Visit the Hillary School and Sir Edmund Hillary Museum in Khumjung',
    ].join('\n'),
    itinerary: [
      'Day 1: Fly Kathmandu → Lukla (2,840m), trek to Phakding (2,610m)',
      'Day 2: Trek to Namche Bazaar (3,440m)',
      'Day 3: Acclimatization — hike to Everest View Hotel (3,880m)',
      'Day 4: Trek to Tengboche (3,867m), visit monastery',
      'Day 5: Trek back to Namche Bazaar',
      'Day 6: Trek to Lukla (2,840m)',
      'Day 7: Fly Lukla → Kathmandu',
      'Day 8: City sightseeing (Pashupatinath, Boudhanath)',
      'Day 9: Departure',
    ].join('\n'),
  },
  {
    title: 'Ama Dablam Base Camp Trek',
    slug: 'ama-dablam-base-camp-trek',
    description:
      "Stand at the foot of one of the world's most beautiful mountains. Trek to Ama Dablam Base Camp (4,600m) — a shorter, incredibly rewarding journey through Sherpa heartland offering dramatic views of the iconic 6,812m spire that towers above the Khumbu valley.",
    durationDays: 11,
    difficulty: 'Moderate',
    altitude: '4,600m',
    price: 1100,
    season: 'Mar–May, Sep–Nov',
    images: '/everest.png',
    highlights: [
      'Close-up views of the iconic Ama Dablam (6,812m)',
      'Trek through the spiritual heart of Sherpa country',
      'Visit Pangboche — the oldest monastery in the Khumbu',
      'Acclimatization hikes with panoramic mountain views',
      'Relaxed pace ideal for moderate-fitness trekkers',
      'Shorter and less crowded than the EBC trail',
    ].join('\n'),
    itinerary: [
      'Day 1: Fly Kathmandu → Lukla, trek to Phakding',
      'Day 2: Trek to Namche Bazaar (3,440m)',
      'Day 3: Acclimatization at Namche — hike to Khumjung (3,790m)',
      'Day 4: Trek to Tengboche (3,860m)',
      'Day 5: Trek to Pangboche (3,985m) — oldest monastery visit',
      'Day 6: Trek to Ama Dablam Base Camp (4,600m) and back to Dingboche',
      'Day 7: Rest and acclimatization at Dingboche (4,410m)',
      'Day 8: Trek to Namche Bazaar',
      'Day 9: Trek to Lukla',
      'Day 10: Fly Lukla → Kathmandu',
      'Day 11: Departure',
    ].join('\n'),
  },
  {
    title: 'Jiri to Everest Base Camp Trek',
    slug: 'jiri-to-everest-base-camp-trek',
    description:
      "Follow the original route walked by Sir Edmund Hillary and Tenzing Norgay on their historic 1953 ascent. Starting from the road head at Jiri, this classic long-route trek allows superior acclimatization through rich cultural landscapes before reaching Everest Base Camp.",
    durationDays: 23,
    difficulty: 'Hard',
    altitude: '5,545m',
    price: 2100,
    season: 'Mar–May, Sep–Nov',
    images: '/everest.png',
    highlights: [
      'Trek the historic 1953 Everest expedition route from Jiri',
      'Superior natural acclimatization with a gentle altitude gain',
      'Authentic Sherpa and Rai cultural villages off the tourist trail',
      'Cross multiple dramatic ridgelines and river valleys',
      'Stand at Kala Patthar (5,545m) for best Everest views',
      'Deep immersion into rural Nepali life and culture',
    ].join('\n'),
    itinerary: [
      'Day 1: Drive Kathmandu → Jiri (1,905m) — 7–8 hrs',
      'Day 2: Trek Jiri → Sete (2,575m)',
      'Day 3: Trek Sete → Junbesi (2,675m) via Lamjura Pass (3,530m)',
      'Day 4: Trek Junbesi → Nunthala (2,330m)',
      'Day 5: Trek Nunthala → Kharikhola (2,010m)',
      'Day 6: Trek Kharikhola → Bupsa (2,300m)',
      'Day 7: Trek Bupsa → Lukla (2,840m)',
      'Day 8: Trek to Namche Bazaar (3,440m)',
      'Day 9: Acclimatization day at Namche',
      'Day 10: Trek to Tengboche (3,860m)',
      'Day 11: Trek to Dingboche (4,410m)',
      'Day 12: Acclimatization hike',
      'Day 13: Trek to Lobuche (4,940m)',
      'Day 14: Trek to Gorak Shep, visit EBC',
      'Day 15: Kala Patthar sunrise, descend to Namche',
      'Day 16–20: Return to Lukla and fly to Kathmandu',
      'Day 21–23: Sightseeing and departure',
    ].join('\n'),
  },
  {
    title: 'Pikey Peak Trek',
    slug: 'pikey-peak-trek',
    description:
      "Escape the crowds on this hidden gem of the Solu-Khumbu region. Summit Pikey Peak (4,069m) for one of the most rewarding Everest panoramas in Nepal — a sweeping sunrise view encompassing Everest, Makalu, Kanchenjunga, and a dozen other Himalayan giants.",
    durationDays: 8,
    difficulty: 'Moderate',
    altitude: '4,069m',
    price: 750,
    season: 'Mar–May, Sep–Nov, Dec–Feb',
    images: '/everest.png',
    highlights: [
      '360° Himalayan panorama from Pikey Peak (4,069m)',
      'Views of Everest, Makalu, Kanchenjunga, and Numbur',
      'Off-the-beaten-path, uncrowded trails',
      'Authentic Sherpa and Jirel village culture',
      'Trek through lush rhododendron and oak forests',
      'Ideal short adventure for beginners and families',
    ].join('\n'),
    itinerary: [
      'Day 1: Drive Kathmandu → Dhap (2,775m) — 6 hrs / fly to Phaplu',
      'Day 2: Trek Dhap → Junbesi (2,675m) via Pikey Peak trail',
      'Day 3: Trek to Pikey Peak base camp (3,600m)',
      'Day 4: Early summit push to Pikey Peak (4,069m), descend to Jhapre',
      'Day 5: Trek to Salleri (2,400m) — Solu Khumbu district HQ',
      'Day 6: Drive or fly back to Kathmandu',
      'Day 7: Rest and city sightseeing',
      'Day 8: Departure',
    ].join('\n'),
  },
  {
    title: 'Phaplu to Everest Base Camp Trek',
    slug: 'phaplu-to-everest-base-camp-trek',
    description:
      "A superb alternative to the classic Lukla-start, this route flies to Phaplu and begins trekking through the scenic Solu Khumbu valleys. Enjoy the best acclimatization profile in the Everest region with uncrowded trails, traditional villages, and incredible mountain views.",
    durationDays: 18,
    difficulty: 'Moderate–Hard',
    altitude: '5,364m',
    price: 1650,
    season: 'Mar–May, Sep–Nov',
    images: '/everest.png',
    highlights: [
      'Fly directly to Phaplu — no booking rush for Lukla flights',
      'Superior acclimatization profile with gentle daily altitude gain',
      'Trek through authentic Sherpa villages before the main trail',
      'Visit Chiwong Monastery — a spectacular perched gompa',
      'Reach Everest Base Camp (5,364m) via the classic route',
      'Less crowded trails especially between Phaplu and Namche',
    ].join('\n'),
    itinerary: [
      'Day 1: Fly Kathmandu → Phaplu (2,413m)',
      'Day 2: Trek Phaplu → Ringmu (2,740m), visit Chiwong Monastery',
      'Day 3: Trek Ringmu → Junbesi (2,675m)',
      'Day 4: Trek Junbesi → Nunthala (2,330m)',
      'Day 5: Trek Nunthala → Kharikhola (2,010m)',
      'Day 6: Trek Kharikhola → Bupsa (2,300m)',
      'Day 7: Trek Bupsa → Lukla, continue to Phakding (2,610m)',
      'Day 8: Trek to Namche Bazaar (3,440m)',
      'Day 9: Acclimatization day at Namche',
      'Day 10: Trek to Tengboche (3,860m)',
      'Day 11: Trek to Dingboche (4,410m)',
      'Day 12: Acclimatization hike',
      'Day 13: Trek to Lobuche (4,940m)',
      'Day 14: Trek to Gorak Shep, visit EBC (5,364m)',
      'Day 15: Kala Patthar (5,545m), descend to Pheriche',
      'Day 16: Trek to Namche Bazaar',
      'Day 17: Trek to Lukla, fly to Kathmandu',
      'Day 18: Departure',
    ].join('\n'),
  },
  {
    title: 'Renjo La Pass Trek',
    slug: 'renjo-la-pass-trek',
    description:
      "Trek to the rarely visited Renjo La Pass (5,340m) — the least-explored of the three Khumbu high passes — and be rewarded with arguably the finest view of Mount Everest available on any Himalayan trek, combined with a full circuit of the Gokyo Valley lakes.",
    durationDays: 14,
    difficulty: 'Moderate–Hard',
    altitude: '5,340m',
    price: 1250,
    season: 'Mar–May, Sep–Nov',
    images: '/everest.png',
    highlights: [
      'Cross Renjo La Pass (5,340m) — one of Nepal\'s finest viewpoints',
      'Jaw-dropping panorama of Everest from the pass summit',
      'Turquoise Gokyo Lakes — sacred glacial lakes at high altitude',
      'Summit Gokyo Ri (5,357m) for 360° Himalayan views',
      'Walk alongside the giant Ngozumpa Glacier',
      'Off-the-beaten-path with far fewer trekkers than EBC',
    ].join('\n'),
    itinerary: [
      'Day 1: Fly Kathmandu → Lukla (2,840m), trek to Phakding',
      'Day 2: Trek to Namche Bazaar (3,440m)',
      'Day 3: Acclimatization — hike above Namche toward Thame',
      'Day 4: Trek to Thame (3,820m)',
      'Day 5: Trek to Lungden (4,380m)',
      'Day 6: Cross Renjo La Pass (5,340m), descend to Gokyo (4,790m)',
      'Day 7: Summit Gokyo Ri (5,357m), explore 2nd–4th lakes',
      'Day 8: Trek to Machhermo (4,470m)',
      'Day 9: Trek to Dole (4,200m)',
      'Day 10: Trek to Namche Bazaar (3,440m)',
      'Day 11: Trek to Lukla (2,840m)',
      'Day 12: Fly Lukla → Kathmandu',
      'Day 13: Rest and city tour',
      'Day 14: Departure',
    ].join('\n'),
  },
];

async function main() {
  console.log('🔍 Looking up Everest Region in database...');
  const region = await prisma.region.findUnique({
    where: { slug: EVEREST_REGION_SLUG },
  });

  if (!region) {
    throw new Error(`Region "${EVEREST_REGION_SLUG}" not found. Run add-everest-region.js first.`);
  }

  console.log(`✅ Found region: ${region.name} (${region.id})`);
  console.log(`\n🚀 Inserting ${treks.length} treks...\n`);

  for (const trek of treks) {
    try {
      const created = await prisma.trek.upsert({
        where: { slug: trek.slug },
        update: {},
        create: {
          ...trek,
          regionId: region.id,
        },
      });
      console.log(`  ✅ ${created.title}`);
    } catch (err) {
      console.error(`  ❌ Failed: ${trek.title}`, err.message);
    }
  }

  console.log('\n🎉 All treks inserted successfully!');
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
