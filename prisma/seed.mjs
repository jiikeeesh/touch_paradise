import 'dotenv/config';
import { treks } from './data/index.mjs';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
  {
    name: "Mustang",
    slug: "mustang",
    description: "The forbidden kingdom — a remote high-desert plateau with ancient cave dwellings, walled cities, and Tibetan Buddhist heritage.",
    image: "/hero.png",
  },
  {
    name: "Dolpo",
    slug: "dolpo",
    description: "Nepal's most remote and mysterious region, immortalised in 'The Snow Leopard'. A pristine Tibetan plateau culture at the edge of the world.",
    image: "/hero.png",
  },
  {
    name: "Manaslu",
    slug: "manaslu",
    description: "Circumnavigate the world's eighth-highest peak through ancient villages, dense forests, and the dramatic Larkya La pass.",
    image: "/hero.png",
  },
  {
    name: "Makalu",
    slug: "makalu",
    description: "An outstanding trek in the eastern region of Nepal offering exceptional scenery and close-up views of Makalu.",
    image: "/hero.png",
  },
  {
    name: "Kanchenjunga",
    slug: "kanchenjunga",
    description: "Journey to the base camps of the world's third highest peak in the remote north-eastern corner of Nepal.",
    image: "/hero.png",
  },
  {
    name: "Dhaulagiri",
    slug: "dhaulagiri",
    description: "A challenging trek around the world's seventh highest peak, offering true wilderness and adventure.",
    image: "/hero.png",
  },
  {
    name: "Rolwaling",
    slug: "rolwaling",
    description: "A strenuous and rewarding trek in the east-central region, famous for the perilous Tashi Lapcha pass.",
    image: "/hero.png",
  },
  {
    name: "Ganesh Himal",
    slug: "ganesh-himal",
    description: "A beautiful, less-crowded trek offering spectacular views of the Ganesh Himal range and insight into local village life.",
    image: "/hero.png",
  },
  {
    name: "Tsum Valley",
    slug: "tsum-valley",
    description: "A sacred Himalayan pilgrimage valley situated in northern Gorkha, rich in ancient art, culture, and religion.",
    image: "/hero.png",
  },
  {
    name: "Helambu",
    slug: "helambu",
    description: "A relatively low-altitude trek renowned for its scenic grandeur and pleasant climate, just north of Kathmandu.",
    image: "/hero.png",
  },
  {
    name: "Rara",
    slug: "rara",
    description: "Journey to Nepal's largest lake, Rara, situated in the remote far-western region surrounded by pine and juniper forests.",
    image: "/hero.png",
  },
  {
    name: "Humla",
    slug: "humla",
    description: "Trek in Nepal's highest and most remote district, a hidden valley near the Tibetan border with pristine landscapes.",
    image: "/hero.png",
  },
  {
    name: "Nar Phu Valley",
    slug: "nar-phu-valley",
    description: "A rugged and wild trek taking you to the hidden valleys of Nar and Phu, filled with ancient Tibetan culture.",
    image: "/hero.png",
  },
  {
    name: "Panchase",
    slug: "panchase",
    description: "A short, beautiful trek starting from Pokhara, perfect for all ages and offering panoramic views of the Annapurnas.",
    image: "/hero.png",
  },
  {
    name: "Pikey Peak",
    slug: "pikey-peak",
    description: "Considered by Edmund Hillary to offer the best view of Everest, this trek offers a fantastic off-the-beaten-path experience.",
    image: "/hero.png",
  },
  {
    name: "Khaptad",
    slug: "khaptad",
    description: "A picturesque plateau in far-western Nepal, known for its rolling green hills, moorlands, and the ashram of Khaptad Baba.",
    image: "/hero.png",
  },
  {
    name: "Arun Valley",
    slug: "arun-valley",
    description: "A deeply incised valley between Everest and Makalu, rich in biodiversity and traditional Rai and Limbu cultures.",
    image: "/hero.png",
  },
  {
    name: "Api Nampa",
    slug: "api-nampa",
    description: "An unexplored treasure in far-western Nepal, offering untouched wilderness, cultural diversity, and stunning mountain views.",
    image: "/hero.png",
  },
];

// Treks loaded from ./data/index.mjs

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

const serviceCategories = [
  {
    name: "Helicopter Tours",
    slug: "helicopter-tours",
    description: "Experience the thrill of flying over the majestic Himalayas with our premium helicopter rides.",
    image: "/heli-tour.png",
  },
  {
    name: "Day Hiking",
    slug: "day-hiking",
    description: "Explore the beautiful hills, forests, and local villages surrounding the valleys with our guided day hikes.",
    image: "/hiking.png",
  },
  {
    name: "City Sightseeing",
    slug: "city-sightseeing",
    description: "Discover the rich history, culture, and architecture of Nepal's vibrant cities.",
    image: "/city-tour.png",
  },
  {
    name: "Adventure Sports",
    slug: "adventure-sports",
    description: "Get your adrenaline pumping with our thrilling adventure sports packages.",
    image: "/adventure.png",
  },
  {
    name: "Cultural Experiences",
    slug: "cultural-experiences",
    description: "Immerse yourself in the local traditions, arts, and culinary delights of Nepal.",
    image: "/culture.png",
  }
];

const services = [
  {
    title: "Everest Base Camp Helicopter Tour",
    slug: "everest-base-camp-heli-tour",
    categorySlug: "helicopter-tours",
    description: "A spectacular 4-hour flight taking you face-to-face with Mt. Everest. Includes a brief landing at Kala Patthar for incredible panoramic views and breakfast at Everest View Hotel.",
    durationDays: 1,
    price: 1200,
    itinerary: "6:00 AM: Pick up from hotel|6:30 AM: Flight from Kathmandu to Lukla|7:30 AM: Flight to Kala Patthar and brief landing|8:30 AM: Breakfast at Everest View Hotel|10:30 AM: Return flight to Kathmandu",
    images: "/everest.png|/hero.png"
  },
  {
    title: "Annapurna Base Camp Helicopter Tour",
    slug: "annapurna-base-camp-heli-tour",
    categorySlug: "helicopter-tours",
    description: "Fly over the diverse landscapes of the Annapurna region and land directly at Annapurna Base Camp. Enjoy breakfast surrounded by towering peaks.",
    durationDays: 1,
    price: 450,
    itinerary: "7:00 AM: Flight from Pokhara|7:30 AM: Landing at Annapurna Base Camp|8:00 AM: Breakfast and photo session|9:00 AM: Return flight to Pokhara",
    images: "/annapurna.png"
  },
  {
    title: "Langtang Valley Helicopter Tour",
    slug: "langtang-valley-heli-tour",
    categorySlug: "helicopter-tours",
    description: "A quick and scenic flight from Kathmandu to the beautiful Langtang Valley, known as the 'Valley of Glaciers'.",
    durationDays: 1,
    price: 350,
    itinerary: "8:00 AM: Departure from Kathmandu|8:45 AM: Landing at Kyanjin Gompa|9:15 AM: Explore the valley|10:30 AM: Return flight to Kathmandu",
    images: "/langtang.png"
  },
  {
    title: "Muktinath Helicopter Tour",
    slug: "muktinath-heli-tour",
    categorySlug: "helicopter-tours",
    description: "A pilgrimage flight to the sacred Muktinath temple, revered by both Hindus and Buddhists, set against the backdrop of the Himalayas.",
    durationDays: 1,
    price: 800,
    itinerary: "7:00 AM: Flight from Pokhara/Kathmandu|8:00 AM: Landing near Muktinath|8:30 AM: Temple visit and prayers|10:30 AM: Return flight",
    images: "/hero.png"
  },
  {
    title: "Gosainkunda Helicopter Tour",
    slug: "gosainkunda-heli-tour",
    categorySlug: "helicopter-tours",
    description: "A breathtaking flight to the holy alpine lake of Gosainkunda, surrounded by rugged mountain terrain.",
    durationDays: 1,
    price: 300,
    itinerary: "7:30 AM: Departure from Kathmandu|8:00 AM: Landing at Gosainkunda|8:30 AM: Explore the holy lake|9:30 AM: Return flight to Kathmandu",
    images: "/gosaikunda.png"
  },
  {
    title: "Nagarjun Hill Hike",
    slug: "nagarjun-hill-hike",
    categorySlug: "day-hiking",
    description: "A peaceful hike through the Shivapuri Nagarjun National Park, ending at the Jamacho viewpoint for spectacular views of the Kathmandu valley and Himalayas.",
    durationDays: 1,
    price: 60,
    itinerary: "8:00 AM: Drive to Phulbari Gate|8:30 AM: Start hiking through the forest|11:00 AM: Reach Jamacho Viewpoint|1:00 PM: Hike down|2:30 PM: Drive back to hotel",
    images: "/trekkers.png"
  },
  {
    title: "Champadevi Hike",
    slug: "champadevi-hike",
    categorySlug: "day-hiking",
    description: "A scenic ridge hike on the southern rim of the Kathmandu Valley, offering panoramic views of the central and western Himalayas.",
    durationDays: 1,
    price: 55,
    itinerary: "8:00 AM: Drive to Pharping|9:00 AM: Start hike|12:00 PM: Reach Champadevi summit and lunch|2:00 PM: Descend to Taudaha|4:00 PM: Drive back to hotel",
    images: "/mardi.png"
  },
  {
    title: "Shivapuri Peak Hike",
    slug: "shivapuri-peak-hike",
    categorySlug: "day-hiking",
    description: "A challenging but rewarding hike to the second highest peak in the Kathmandu Valley, passing through the Nagi Gompa monastery.",
    durationDays: 1,
    price: 65,
    itinerary: "7:30 AM: Drive to Budhanilkantha|8:15 AM: Enter National Park and hike to Nagi Gompa|11:30 AM: Reach Shivapuri Peak|1:00 PM: Descend|4:30 PM: Drive back",
    images: "/trekkers.png"
  },
  {
    title: "Nagarkot to Dhulikhel Hike",
    slug: "nagarkot-dhulikhel-hike",
    categorySlug: "day-hiking",
    description: "A relatively easy hike connecting two famous hill stations, walking past terraced fields, traditional villages, and lush forests.",
    durationDays: 1,
    price: 70,
    itinerary: "6:00 AM: Drive to Nagarkot for sunrise|8:30 AM: Start hike towards Dhulikhel|1:00 PM: Lunch in a village|3:30 PM: Reach Dhulikhel|4:30 PM: Drive back to Kathmandu",
    images: "/langtang.png"
  },
  {
    title: "Phulchowki Hike",
    slug: "phulchowki-hike",
    categorySlug: "day-hiking",
    description: "Hike to the highest peak enclosing the Kathmandu Valley, known for its rich birdlife and stunning rhododendron forests.",
    durationDays: 1,
    price: 65,
    itinerary: "8:00 AM: Drive to Godawari|8:45 AM: Start ascending Phulchowki|12:30 PM: Reach the summit|2:00 PM: Descend to Godawari Botanical Garden|5:00 PM: Drive back",
    images: "/mardi.png"
  },
  {
    title: "Kathmandu Valley UNESCO Heritage Tour",
    slug: "kathmandu-valley-heritage-tour",
    categorySlug: "city-sightseeing",
    description: "A comprehensive guided tour exploring the ancient temples, stupas, and palaces of Kathmandu, including Swayambhunath, Pashupatinath, and Boudhanath.",
    durationDays: 1,
    price: 80,
    itinerary: "9:00 AM: Visit Kathmandu Durbar Square|11:00 AM: Visit Swayambhunath (Monkey Temple)|1:00 PM: Lunch|2:00 PM: Visit Pashupatinath Temple|4:00 PM: Visit Boudhanath Stupa",
    images: "/kathmandu.png"
  },
  {
    title: "Patan and Bhaktapur Day Tour",
    slug: "patan-bhaktapur-day-tour",
    categorySlug: "city-sightseeing",
    description: "Explore the medieval charm of Patan and Bhaktapur, known as the cities of fine arts and devotees respectively.",
    durationDays: 1,
    price: 85,
    itinerary: "9:30 AM: Drive to Patan Durbar Square|10:00 AM: Explore Patan museum and surrounding temples|12:30 PM: Lunch|1:30 PM: Drive to Bhaktapur|2:30 PM: Explore Bhaktapur Durbar Square, Nyatapola Temple, and Pottery Square|5:00 PM: Drive back",
    images: "/kathmandu.png"
  },
  {
    title: "Pokhara City Sightseeing Tour",
    slug: "pokhara-city-sightseeing",
    categorySlug: "city-sightseeing",
    description: "A full day exploring the natural and cultural highlights of Pokhara, including caves, waterfalls, and viewpoints.",
    durationDays: 1,
    price: 75,
    itinerary: "9:00 AM: Boating on Phewa Lake and visit Tal Barahi Temple|11:00 AM: Visit Devi's Fall and Gupteshwor Cave|1:00 PM: Lunch|2:30 PM: Visit the International Mountain Museum|4:00 PM: Drive to World Peace Pagoda for sunset views",
    images: "/annapurna.png"
  },
  {
    title: "Lumbini Buddhist Pilgrimage Tour",
    slug: "lumbini-pilgrimage-tour",
    categorySlug: "city-sightseeing",
    description: "A spiritual journey to the birthplace of Lord Buddha, exploring the sacred Maya Devi Temple and various international monasteries.",
    durationDays: 2,
    price: 250,
    itinerary: "Day 1: Fly/Drive from Kathmandu to Lumbini, visit Maya Devi Temple|Day 2: Explore the monastic zones and the World Peace Pagoda, return to Kathmandu",
    images: "/hero.png"
  },
  {
    title: "Bungee Jumping in Kushma",
    slug: "bungee-jumping-kushma",
    categorySlug: "adventure-sports",
    description: "Experience the ultimate adrenaline rush with the world's second-highest bungee jump over the Kali Gandaki river gorge.",
    durationDays: 1,
    price: 150,
    itinerary: "8:00 AM: Drive from Pokhara to Kushma|10:30 AM: Arrive and briefing|11:30 AM: The Bungee Jump|1:00 PM: Lunch and relax|3:00 PM: Drive back to Pokhara",
    images: "/mardi.png"
  },
  {
    title: "Trishuli River Rafting",
    slug: "trishuli-river-rafting",
    categorySlug: "adventure-sports",
    description: "An exciting white-water rafting adventure on the Trishuli River, featuring thrilling rapids and beautiful scenery.",
    durationDays: 1,
    price: 55,
    itinerary: "7:00 AM: Drive from Kathmandu to Charaudi|10:00 AM: Safety briefing and gear up|10:30 AM: Start rafting|1:30 PM: Finish rafting and enjoy riverside lunch|3:00 PM: Drive back to Kathmandu or onward to Pokhara",
    images: "/langtang.png"
  },
  {
    title: "Paragliding in Pokhara",
    slug: "paragliding-pokhara",
    categorySlug: "adventure-sports",
    description: "Soar like a bird over the beautiful Phewa Lake with the stunning Annapurna range as your backdrop.",
    durationDays: 1,
    price: 85,
    itinerary: "9:00 AM: Drive from Pokhara to Sarangkot|10:00 AM: Flight preparation and briefing|10:30 AM: Take-off for a 25-30 minute tandem flight|11:00 AM: Landing near Phewa Lake and return to hotel",
    images: "/annapurna.png"
  },
  {
    title: "Nepali Cooking Class in Thamel",
    slug: "nepali-cooking-class",
    categorySlug: "cultural-experiences",
    description: "Learn to cook authentic Nepali dishes like Momo (dumplings) and Dal Bhat in a hands-on culinary workshop.",
    durationDays: 1,
    price: 45,
    itinerary: "10:00 AM: Meet at the cooking school and visit local market|11:00 AM: Start cooking class|1:30 PM: Enjoy the meal you prepared|2:30 PM: Receive recipe booklet and conclude",
    images: "/kathmandu.png"
  },
  {
    title: "Thangka Painting Workshop",
    slug: "thangka-painting-workshop",
    categorySlug: "cultural-experiences",
    description: "A unique opportunity to learn the intricate art of Thangka painting from master artisans in Kathmandu.",
    durationDays: 1,
    price: 50,
    itinerary: "10:00 AM: Introduction to Thangka history and techniques|11:00 AM: Hands-on painting session|1:00 PM: Lunch break|2:00 PM: Continue painting|4:00 PM: Conclude session and take your art piece home",
    images: "/kathmandu.png"
  },
  {
    title: "Evening Aarti at Pashupatinath",
    slug: "evening-aarti-pashupatinath",
    categorySlug: "cultural-experiences",
    description: "Witness the mesmerizing and spiritual Bagmati Ganga Aarti ceremony at the sacred Pashupatinath Temple.",
    durationDays: 1,
    price: 30,
    itinerary: "4:30 PM: Pick up from hotel|5:00 PM: Arrive at Pashupatinath and explore the surroundings|6:00 PM: Take a seat on the banks of the Bagmati river|6:30 PM: Witness the Aarti ceremony|7:30 PM: Return to hotel",
    images: "/kathmandu.png"
  }
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
      update: {
        ...trekData,
        regionId,
      },
      create: {
        ...trekData,
        regionId,
      },
    });
  }

  // 4. Create Videos
  const existingVideos = await prisma.video.count();
  if (existingVideos === 0) {
    for (const v of videos) {
      await prisma.video.create({
        data: v,
      });
    }
  }

  // 5. Create Service Categories
  for (const cat of serviceCategories) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Fetch created categories to map by slug
  const allCategories = await prisma.serviceCategory.findMany();
  const categoryMap = Object.fromEntries(allCategories.map(c => [c.slug, c.id]));

  // 6. Create Services
  for (const s of services) {
    const { categorySlug, ...serviceData } = s;
    const categoryId = categoryMap[categorySlug];
    
    if (!categoryId) {
      console.warn(`Category ${categorySlug} not found for service ${s.title}`);
      continue;
    }

    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        ...serviceData,
        categoryId,
      },
      create: {
        ...serviceData,
        categoryId,
      },
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
    await pool.end();
  });
