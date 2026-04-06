export const allTreks = [
  {
    title: "Everest Base Camp",
    description: "The world's most iconic trek. Walk in the footsteps of legends through Sherpa villages to the base of the highest mountain on Earth.",
    image: "/everest.png",
    duration: "14 Days",
    difficulty: "Hard",
    altitude: "5,364m",
    price: "$1,450",
    region: "Khumbu",
    season: "Mar–May, Sep–Nov",
    slug: "everest-base-camp"
  },
  {
    title: "Annapurna Circuit",
    description: "Circumnavigate the Annapurna massif through diverse landscapes — lush subtropical forests to arid Tibetan plateau.",
    image: "/annapurna.png",
    duration: "12 Days",
    difficulty: "Moderate",
    altitude: "5,416m",
    price: "$1,200",
    region: "Annapurna",
    season: "Mar–May, Sep–Nov",
    slug: "annapurna-circuit"
  },
  {
    title: "Mardi Himal Trek",
    description: "A secret off-the-beaten-path gem offering jaw-dropping views of Machhapuchhre and the Annapurna range.",
    image: "/mardi.png",
    duration: "7 Days",
    difficulty: "Moderate",
    altitude: "4,500m",
    price: "$750",
    region: "Annapurna",
    season: "Year-round",
    slug: "mardi-himal-trek"
  },
  {
    title: "Langtang Valley Trek",
    description: "Explore the 'Valley of Glaciers' — a Tamang homeland rich in Buddhist culture, dense rhododendron forests, and dramatic scenery.",
    image: "/langtang.png",
    duration: "10 Days",
    difficulty: "Moderate",
    altitude: "3,870m",
    price: "$900",
    region: "Langtang",
    season: "Mar–May, Sep–Dec",
    slug: "langtang-valley-trek"
  },
  {
    title: "Gosaikunda Lake Trek",
    description: "A sacred pilgrimage and trekking destination — a stunning high-altitude glacial lake revered by both Hindus and Buddhists.",
    image: "/gosaikunda.png",
    duration: "8 Days",
    difficulty: "Moderate–Hard",
    altitude: "4,380m",
    price: "$820",
    region: "Langtang",
    season: "Apr–Jun, Sep–Nov",
    slug: "gosaikunda-lake-trek"
  },
  {
    title: "Poon Hill Sunrise",
    description: "The classic introduction to Nepal trekking. Experience a breathtaking 360° Himalayan sunrise from the legendary Poon Hill viewpoint.",
    image: "/trekkers.png",
    duration: "5 Days",
    difficulty: "Easy",
    altitude: "3,210m",
    price: "$550",
    region: "Annapurna",
    season: "Year-round",
    slug: "poon-hill-sunrise"
  },
];

export const difficultyColor: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Moderate: "bg-amber-100 text-amber-700",
  "Moderate–Hard": "bg-orange-100 text-orange-700",
  Hard: "bg-red-100 text-red-700",
};
