const fs = require('fs');

const file = fs.readFileSync('prisma/seed.mjs', 'utf8');

const realTreksMap = {
  "khumbu": ["Everest Base Camp Trek", "Gokyo Lakes Trek", "Three Passes Trek", "Everest View Trek", "Ama Dablam Base Camp Trek"],
  "annapurna": ["Annapurna Circuit Trek", "Annapurna Base Camp Trek", "Mardi Himal Trek", "Poon Hill Trek", "Khopra Danda Trek"],
  "langtang": ["Langtang Valley Trek", "Gosaikunda Lake Trek", "Tamang Heritage Trail", "Helambu Langtang Trek", "Langtang Ganja La Pass Trek"],
  "mustang": ["Upper Mustang Trek", "Lower Mustang Trek", "Mustang Teri La Pass", "Jomsom Muktinath Trek", "Upper Mustang Tiji Festival Trek"],
  "dolpo": ["Upper Dolpo Trek", "Lower Dolpo Trek", "Phoksundo Lake Trek", "Inner Dolpo Trek", "Dolpo to Mugu Trek"],
  "manaslu": ["Manaslu Circuit Trek", "Tsum Valley Trek", "Manaslu Base Camp Trek", "Lower Manaslu Trek", "Manaslu Rupina La Pass"],
  "makalu": ["Makalu Base Camp Trek", "Arun Valley to Makalu Trek", "Makalu Sherpani Col Pass", "Saldima Valley Trek", "Lower Makalu Cultural Trek"],
  "kanchenjunga": ["Kanchenjunga North Base Camp", "Kanchenjunga South Base Camp", "Kanchenjunga Circuit Trek", "Olangchung Gola Trek", "Lumba Sumba Pass Trek"],
  "dhaulagiri": ["Dhaulagiri Circuit Trek", "Dhaulagiri Base Camp Trek", "French Pass Trek", "Hidden Valley Trek", "Round Dhaulagiri Trek"],
  "rolwaling": ["Rolwaling Valley Trek", "Tashi Lapcha Pass Trek", "Bigu Gompa Trek", "Gauri Shankar Base Camp", "Na Village Trek"],
  "ganesh-himal": ["Ganesh Himal Base Camp Trek", "Ruby Valley Trek", "Paldor Peak Base Camp", "Sing La Pass Trek", "Ganesh Himal Panorama Trek"],
  "tsum-valley": ["Tsum Valley Cultural Trek", "Upper Tsum Valley Trek", "Mu Gompa Trek", "Tsum Valley to Manaslu Trek", "Ganesh Himal to Tsum Valley"],
  "helambu": ["Helambu Circuit Trek", "Shivapuri Helambu Trek", "Gosainkunda to Helambu Trek", "Melamchi Ghyang Trek", "Tharepati Trek"],
  "rara": ["Rara Lake Trek", "Jumla to Rara Trek", "Rara to Khaptad Trek", "Karnali River Corridor Trek", "Mugu Rara Trek"],
  "humla": ["Limi Valley Trek", "Simikot to Mount Kailash Trek", "Humla Karnali Trek", "Nyalu La Pass Trek", "Saipal Base Camp Trek"],
  "nar-phu-valley": ["Nar Phu Valley Trek", "Nar Phu to Upper Mustang", "Kang La Pass Trek", "Phu Village Trek", "Nar Phu and Annapurna Circuit"],
  "panchase": ["Panchase Trek", "Panchase to Australian Camp", "Bhadaure Village Trek", "Panchase Peak Trek", "Panchase Cultural Trek"],
  "pikey-peak": ["Pikey Peak Trek", "Dudh Kunda Pikey Peak Trek", "Pikey Peak to Everest View", "Lower Solukhumbu Trek", "Phaplu to Pikey Peak"],
  "khaptad": ["Khaptad National Park Trek", "Khaptad to Rara Trek", "Khaptad Ashram Trek", "Silgadhi to Khaptad Trek", "Khaptad Ramaroshan Trek"],
  "arun-valley": ["Arun Valley Trek", "Salpa Pass Trek", "Arun Valley to Everest Base Camp", "Tumlingtar to Mera Peak", "Arun Valley Cultural Trek"],
  "api-nampa": ["Api Base Camp Trek", "Nampa Valley Trek", "Far West Api Trek", "Darchula to Api Base Camp", "Tinkar Valley Trek"]
};

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function generateHighlights(regionSlug) {
  const options = [
    "Panoramic views of majestic Himalayan peaks",
    "Experience authentic local culture and hospitality",
    "Walk through beautiful alpine meadows and rhododendron forests",
    "Cross thrilling high-altitude suspension bridges",
    "Visit ancient monasteries and sacred Buddhist/Hindu sites",
    "Spot rare wildlife like snow leopards, blue sheep, and alpine flora",
    "Enjoy spectacular sunrise and sunset views over the mountains",
    "Trek along pristine glacial rivers and turquoise lakes",
    "Challenge yourself on legendary high mountain passes",
    "Stay in traditional teahouses and interact with local ethnic groups"
  ];
  return options.sort(() => 0.5 - Math.random()).slice(0, 4).join("\\n");
}

function generateItinerary(title, duration) {
  const days = [];
  days.push("Day 1: Arrival in Kathmandu & transfer to hotel - Upon your arrival at Tribhuvan International Airport, our representative will warmly welcome you and transfer you to your hotel. You can spend the rest of the day resting, recovering from jet lag, or exploring the vibrant streets of Thamel.");
  
  if (duration > 5) {
    days.push("Day 2: Preparation, sightseeing and briefing - Today, we will explore the cultural heritage sites of Kathmandu. Later in the afternoon, we will have a pre-trek briefing and prepare our gear for the upcoming adventure.");
  }
  
  const modes = [
    "Take a scenic drive along winding mountain roads, enjoying views of terraced fields and rushing rivers before arriving at our trailhead.",
    "A thrilling morning flight offers breathtaking aerial views of the Himalayas. Upon landing, we meet our trekking crew.",
    "We embark on a beautiful overland journey passing through lush valleys and traditional rural settlements."
  ];
  days.push(`Day ${days.length + 1}: Travel to the trek starting point - ${modes[Math.floor(Math.random() * modes.length)]}`);
  
  const activities = [
    "We ascend gradually through dense rhododendron and oak forests, crossing several suspension bridges and enjoying the peaceful sounds of nature.",
    "Following the glacial river, the trail gently climbs past small farming communities and terraced fields, offering stunning glimpses of the surrounding peaks.",
    "Today involves a challenging but rewarding steep ascent. As we gain altitude, the tree line fades, revealing spectacular panoramic views.",
    "We trek through picturesque traditional villages where you can observe the daily lifestyle of the local people and beautiful terraced farms.",
    "We take a rest day to allow our bodies to adjust to the high altitude. We will do a short hike to a nearby viewpoint to stay active.",
    "The trail takes us across a thrilling high suspension bridge over a deep gorge, followed by a steady climb up a rugged ridge.",
    "We leave the lower valleys behind and ascend into the alpine zone. The air gets thinner, but the incredibly dramatic mountain vistas make the effort worthwhile.",
    "A big day as we tackle the high mountain pass. We start early to catch the clear morning views from the top before making a long descent.",
    "We wake up before dawn to hike to a famous viewpoint, witnessing a magnificent sunrise over the Himalayas, before continuing our trek."
  ];

  const midPoint = Math.floor(duration / 2);
  for (let i = days.length + 1; i < duration; i++) {
    if (i === midPoint && duration > 7) {
      days.push(`Day ${i}: Reach the main destination of ${title} - The climax of our trek! We finally reach our ultimate destination, surrounded by towering, majestic peaks. We will spend time taking photos, exploring the area, and soaking in the incredible achievement.`);
    } else {
      const act = activities[Math.floor(Math.random() * activities.length)];
      days.push(`Day ${i}: Trekking day - ${act}`);
    }
  }
  
  days.push(`Day ${duration}: Return to Kathmandu & final departure - We bid farewell to the mountains and return to Kathmandu. You will be transferred to the airport for your onward journey, taking with you unforgettable memories of the Himalayas.`);
  
  return days.join("\\n");
}

const newTreks = [];

for (const [regionSlug, trekNames] of Object.entries(realTreksMap)) {
  for (let i = 0; i < trekNames.length; i++) {
    const title = trekNames[i];
    const duration = 7 + Math.floor(Math.random() * 12); // random duration between 7 and 18 days
    const price = duration * 80 + Math.floor(Math.random() * 300);
    const difficulties = ["Moderate", "Moderate–Hard", "Hard", "Easy"];
    const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
    const altitude = `${3000 + Math.floor(Math.random() * 2500)}m`;

    newTreks.push({
      title: title,
      slug: slugify(title),
      description: `The ${title} is an incredible journey through the ${regionSlug.replace("-", " ")} region, offering majestic mountain views, authentic cultural experiences, and an unforgettable Himalayan adventure.`,
      durationDays: duration,
      difficulty: diff,
      altitude: altitude,
      price: price,
      regionSlug: regionSlug,
      season: "Spring, Autumn",
      images: "/hero.png",
      highlights: generateHighlights(regionSlug),
      itinerary: generateItinerary(title, duration)
    });
  }
}

const newTreksStr = "const treks = [\n" + newTreks.map(t => {
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
