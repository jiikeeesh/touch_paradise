import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialVideos = [
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
  {
    title: "Langtang Valley Morning",
    location: "Langtang, Nepal",
    duration: "0:58",
    cover: "/langtang.png",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    title: "Gosaikunda Sacred Lake",
    location: "Rasuwa, Nepal",
    duration: "1:30",
    cover: "/gosaikunda.png",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
];

async function main() {
  console.log('Seeding videos...');
  for (const video of initialVideos) {
    await prisma.video.create({
      data: video
    });
  }
  console.log('Done seeding videos.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
