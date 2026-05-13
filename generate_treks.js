const fs = require('fs');

const file = fs.readFileSync('prisma/seed.mjs', 'utf8');

const treksMatch = file.match(/const treks = \[\s*([\s\S]*?)\s*\];/);
const treksStr = `[${treksMatch[1]}]`;
let treks = eval(treksStr);

function generateHighlights(regionSlug) {
  const regionNames = {
    "khumbu": "Everest region",
    "annapurna": "Annapurna region",
    "langtang": "Langtang valley",
    "mustang": "Mustang",
    "dolpo": "Dolpo",
    "manaslu": "Manaslu circuit",
    "makalu": "Makalu base",
    "kanchenjunga": "Kanchenjunga",
    "dhaulagiri": "Dhaulagiri",
    "rolwaling": "Rolwaling",
    "ganesh-himal": "Ganesh Himal",
    "tsum-valley": "Tsum Valley",
    "helambu": "Helambu",
    "rara": "Rara Lake",
    "humla": "Humla",
    "nar-phu-valley": "Nar Phu Valley",
    "panchase": "Panchase",
    "pikey-peak": "Pikey Peak",
    "khaptad": "Khaptad National Park",
    "arun-valley": "Arun Valley",
    "api-nampa": "Api Nampa"
  };
  
  const rName = regionNames[regionSlug] || "the Himalayas";
  
  const options = [
    `Panoramic views of ${rName} peaks`,
    "Experience authentic local culture and hospitality",
    "Walk through beautiful alpine meadows and forests",
    "Cross thrilling suspension bridges",
    "Visit ancient monasteries and sacred sites",
    "Spot rare wildlife and alpine flora",
    "Enjoy spectacular sunrise and sunset views",
    "Trek along pristine glacial rivers",
    "Challenge yourself on high mountain passes"
  ];
  
  // pick 4 random highlights
  const shuffled = options.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4).join("\\n");
}

function generateItinerary(duration, title, regionSlug) {
  const days = [];
  days.push("Day 1: Arrival in Kathmandu & transfer to hotel - Upon your arrival at Tribhuvan International Airport, our representative will warmly welcome you and transfer you to your hotel. You can spend the rest of the day resting, recovering from jet lag, or exploring the vibrant streets of Thamel.");
  
  if (duration > 5) {
    days.push("Day 2: Preparation, sightseeing and briefing - Today, we will explore the cultural heritage sites of Kathmandu, including Swayambhunath, Pashupatinath, and Boudhanath. Later in the afternoon, we will have a pre-trek briefing and prepare our gear for the upcoming adventure.");
  }
  
  const travelModes = [
    "Drive to the trek starting point - We take a scenic drive along winding mountain roads, enjoying views of terraced fields, rushing rivers, and distant snow-capped peaks before arriving at our trailhead.",
    "Fly to the trek starting point - A thrilling morning flight offers breathtaking aerial views of the Himalayas. Upon landing, we meet our trekking crew and begin our journey.",
    "Scenic journey to the trek starting point - We embark on a beautiful overland journey passing through lush valleys and traditional rural settlements, immersing ourselves in the local landscape."
  ];
  const mode = travelModes[Math.floor(Math.random() * travelModes.length)];
  
  days.push(`Day ${days.length + 1}: ${mode}`);
  
  const trekActivities = [
    "Trek through lush green forests to the next village - We ascend gradually through dense rhododendron and oak forests, crossing several suspension bridges and enjoying the peaceful sounds of nature.",
    "Ascend slowly along the river valley - Following the glacial river, the trail gently climbs past small farming communities and terraced fields, offering stunning glimpses of the surrounding peaks.",
    "Steep climb offering rewarding mountain vistas - Today involves a challenging but rewarding steep ascent. As we gain altitude, the tree line fades, revealing spectacular panoramic views of the Himalayan range.",
    "Walk through traditional farming villages and terraced fields - We trek through picturesque traditional villages where you can observe the daily lifestyle of the local people and beautiful terraced farms.",
    "Acclimatization and exploration day - We take a rest day to allow our bodies to adjust to the high altitude. We will do a short hike to a nearby viewpoint to stay active and enjoy the spectacular scenery.",
    "Trek across a high suspension bridge and climb the ridge - The trail takes us across a thrilling high suspension bridge over a deep gorge, followed by a steady climb up a rugged ridge with expansive views.",
    "Journey through beautiful rhododendron forests - Especially spectacular in spring, today's trail winds through magical rhododendron forests. We might also spot diverse bird species and local wildlife.",
    "Trek towards the high camp with stunning views - We leave the lower valleys behind and ascend into the alpine zone. The air gets thinner, but the incredibly dramatic mountain vistas make the effort worthwhile.",
    "Cross the major pass and descend to the valley - A big day as we tackle the high mountain pass. We start early to catch the clear morning views from the top before making a long descent into the neighboring valley.",
    "Hike up to the viewpoint for sunrise, then trek onwards - We wake up before dawn to hike to a famous viewpoint, witnessing a magnificent sunrise over the Himalayas, before continuing our trek to the next destination."
  ];
  
  const remainingDays = duration - days.length - 1; // 1 day for departure
  
  for (let i = 0; i < remainingDays; i++) {
    if (i === Math.floor(remainingDays / 2) && duration > 7) {
      days.push(`Day ${days.length + 1}: Reach the main destination/Base Camp of ${title} - The climax of our trek! We finally reach our ultimate destination, surrounded by towering, majestic peaks. We will spend time taking photos, exploring the area, and soaking in the incredible achievement.`);
    } else {
      const activity = trekActivities[Math.floor(Math.random() * trekActivities.length)];
      days.push(`Day ${days.length + 1}: ${activity}`);
    }
  }
  
  days.push(`Day ${duration}: Return to Kathmandu & final departure - We bid farewell to the mountains and return to Kathmandu. You will be transferred to the airport for your onward journey, taking with you unforgettable memories of the Himalayas.`);
  
  return days.join("\\n");
}

for (const t of treks) {
  t.highlights = generateHighlights(t.regionSlug);
  t.itinerary = generateItinerary(t.durationDays || 10, t.title, t.regionSlug);
}

const newTreksStr = "const treks = [\n" + treks.map(t => {
  return `  {
    title: "${t.title}",
    slug: "${t.slug}",
    description: "${t.description}",
    durationDays: ${t.durationDays},
    difficulty: "${t.difficulty}",
    altitude: "${t.altitude}",
    price: ${t.price},
    regionSlug: "${t.regionSlug}",
    season: "${t.season}",
    images: "${t.images}",
    highlights: "${t.highlights}",
    itinerary: "${t.itinerary}",
  }`;
}).join(",\n") + "\n];";

const newFile = file.replace(/const treks = \[\s*([\s\S]*?)\s*\];/, newTreksStr);
fs.writeFileSync('prisma/seed.mjs', newFile);
