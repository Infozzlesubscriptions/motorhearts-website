export const categories = [
  { slug: "cars", name: "Cars", blurb: "Road tests, launches and the machines that define an era." },
  { slug: "motorcycles", name: "Motorcycles", blurb: "Two wheels, open roads and the art of balance." },
  { slug: "electric-bikes", name: "Electric Bikes", blurb: "The quiet revolution reshaping how cities move." },
  { slug: "classic-cars", name: "Classic Cars", blurb: "Restorations, provenance and timeless design." },
  { slug: "performance-tuning", name: "Performance Tuning", blurb: "Engineering, setup and the pursuit of the perfect lap." },
  { slug: "trailers", name: "Trailers", blurb: "Towing, touring and taking the journey further." },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export type Article = {
  slug: string;
  title: string;
  dek: string;
  category: CategorySlug;
  image: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: number;
  pullQuote: string;
  body: string[];
  specs?: { label: string; value: string }[];
};

const img = (id: string, w = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const articles: Article[] = [
  {
    slug: "alpine-passes-in-the-new-gt-coupe",
    title: "Above the Clouds: Three Alpine Passes in the New GT Coupé",
    dek: "Six hundred horsepower, eleven hundred hairpins and one perfect morning on the Stelvio. We went looking for the limits of grand touring.",
    category: "cars",
    image: img("photo-1503376780353-7e6692767b70", 2400),
    author: "Elena Marchetti",
    authorRole: "Road Test Editor",
    date: "2025-05-14",
    readTime: 12,
    pullQuote: "At altitude the engine breathes differently, and so do you. Every corner becomes a conversation.",
    specs: [
      { label: "Power", value: "612 hp" },
      { label: "0–100 km/h", value: "3.2 s" },
      { label: "Top speed", value: "318 km/h" },
      { label: "Weight", value: "1,545 kg" },
    ],
    body: [
      "The alarm went off at 4:40 a.m., which is the only reasonable time to drive the Stelvio Pass. By sunrise the tour coaches and cyclists begin their slow procession; before it, the mountain belongs to you, the marmots and whatever you happen to have parked outside the hotel.",
      "What we had parked outside the hotel was the new GT Coupé, finished in a silver so liquid it seemed to borrow its colour from the overcast sky. It is a car that makes a promise most grand tourers can't keep: comfort enough for a thousand-kilometre day, and precision enough to make that final hour the best of the trip.",
      "The first twenty hairpins are a test of patience. The steering is light at low speed, almost too light, and the twin-turbocharged engine idles with a muted, expensive hum. Then the road opens between switchbacks and you discover that the throttle has a second personality. Past 4,000 rpm, the coupé stops being polite.",
      "It's the chassis that impresses most. Adaptive dampers read the broken tarmac of the upper slopes and soften their reply without ever losing control of the body. Rear-axle steering shrinks the car through the tightest bends, so a vehicle nearly five metres long feels compact, eager, alive.",
      "By the time we crested the summit, the sun had broken through the cloud line and the valley below turned gold. We drove the Umbrail and the Gavia before lunch, and somewhere between them the car stopped feeling like a test subject and started feeling like a companion.",
      "There are faster cars. There are certainly more theatrical ones. But few machines this capable are also this easy to live with, and that combination is the rarest kind of luxury.",
    ],
  },
  {
    slug: "concrete-and-chrome-modern-cafe-racer",
    title: "Concrete & Chrome: The Modern Café Racer Comes of Age",
    dek: "A new generation of builders is reimagining the café racer as rolling sculpture — without forgetting that it has to ride beautifully.",
    category: "motorcycles",
    image: img("photo-1558981806-ec527fa84c39"),
    author: "Tom Hadley",
    authorRole: "Motorcycle Editor",
    date: "2025-05-10",
    readTime: 9,
    pullQuote: "A great café racer looks fast standing still. A brilliant one feels even faster than it looks.",
    specs: [
      { label: "Engine", value: "1,170 cc twin" },
      { label: "Power", value: "109 hp" },
      { label: "Dry weight", value: "189 kg" },
      { label: "Seat height", value: "810 mm" },
    ],
    body: [
      "The café racer was born of rebellion: young riders in post-war Britain stripping their bikes down to the essentials and racing from café to café before a song finished on the jukebox. Seventy years later, the silhouette remains — low bars, long tank, a seat built for one — but the philosophy has matured.",
      "In a converted warehouse on the edge of the city, we met three builders who treat the form as a design discipline rather than nostalgia. Brushed aluminium replaces chrome where weight matters. Deep red stitching lifts an otherwise monochrome palette. Every bracket is drawn, refined and drawn again.",
      "The result is a motorcycle that would be at home on a gallery plinth — yet each one is ridden hard before it leaves the workshop. Modern suspension, radial brakes and cornering ABS hide in plain sight beneath the classic lines.",
      "On the road, the riding position asks for commitment. Your weight is forward, your elbows bent, your eyes fixed through the next bend. It is not the most comfortable way to cross a continent, but it is one of the most rewarding ways to spend an afternoon.",
      "What unites these builders is restraint. They know the strongest designs are defined as much by what they leave out as by what they add.",
    ],
  },
  {
    slug: "the-city-commuter-reinvented",
    title: "The City Commuter, Reinvented",
    dek: "Integrated batteries, belt drives and frames that disappear into the architecture. Premium e-bikes have finally found their design language.",
    category: "electric-bikes",
    image: img("photo-1571068316344-75bc76f77890"),
    author: "Maya Lindqvist",
    authorRole: "Urban Mobility Writer",
    date: "2025-05-07",
    readTime: 7,
    pullQuote: "The best electric bike is the one you forget is electric — until the hill arrives.",
    specs: [
      { label: "Range", value: "Up to 120 km" },
      { label: "Motor", value: "250 W mid-drive" },
      { label: "Weight", value: "19.8 kg" },
      { label: "Drive", value: "Carbon belt" },
    ],
    body: [
      "For years, electric bicycles looked like what they were: ordinary bikes with a battery bolted on. The new wave is different. The battery vanishes into the down tube, cables route internally, and the motor is so compact it is almost invisible at the bottom bracket.",
      "We spent a month commuting across the city on four of the most considered designs available. The common thread was not speed — European models are limited to 25 km/h of assistance — but refinement. Power arrives smoothly, in proportion to your effort, so the bike feels like a stronger version of you.",
      "Carbon belt drives are the quiet heroes. They never need oiling, never mark your trousers, and last for many thousands of kilometres. Paired with internally geared hubs, they make the daily ride almost maintenance-free.",
      "There are trade-offs. Integrated batteries are harder to remove for charging, and premium prices still give pause. But the experience — arriving at the office unhurried, on time and without breaking a sweat — makes a compelling case.",
    ],
  },
  {
    slug: "a-burgundy-gt-reborn",
    title: "A Burgundy Grand Tourer, Reborn After Forty Years",
    dek: "Found in a barn in 1984 and restored over four painstaking years, this coupé tells a story of patience, provenance and craft.",
    category: "classic-cars",
    image: img("photo-1552519507-da3b142c6e3d"),
    author: "James Whitford",
    authorRole: "Classic Car Correspondent",
    date: "2025-05-03",
    readTime: 14,
    pullQuote: "Restoration is not about making a car new. It is about making it honest again.",
    specs: [
      { label: "Year", value: "1967" },
      { label: "Engine", value: "4.0 L V12" },
      { label: "Restoration", value: "4 years" },
      { label: "Original parts", value: "92%" },
    ],
    body: [
      "The first photograph of the car shows it under a tarpaulin, nose-first into a hay bale, its chrome dulled to grey. The family who found it had no idea what it was. The restorer who bought it from them knew immediately.",
      "Four years and roughly 6,000 hours later, it sits in the afternoon sun outside a mid-century house, burgundy paint glowing like old wine. Ninety-two per cent of the parts are original, carefully repaired rather than replaced.",
      "The interior took the longest. The leather was re-dyed by hand to match an unfaded patch found beneath the rear seat. The clocks were rebuilt by a watchmaker. Even the period radio works, though it only finds one station.",
      "Driving it is a lesson in mechanical sympathy. The steering is heavy until you're rolling, the gearbox demands a measured hand, and the V12 builds power in a long, glorious crescendo that no modern engine quite replicates.",
      "Classic cars are often treated as investments, locked away in climate-controlled garages. This one, its owner insists, will be driven — gently, often and with enormous gratitude.",
    ],
  },
  {
    slug: "the-science-of-the-perfect-setup",
    title: "The Science of the Perfect Setup",
    dek: "Inside an independent tuning workshop where alignment, damping and brake balance matter more than headline horsepower.",
    category: "performance-tuning",
    image: img("photo-1486262715619-67b85e0b08d3"),
    author: "Ravi Desai",
    authorRole: "Technical Editor",
    date: "2025-04-29",
    readTime: 11,
    pullQuote: "Anyone can add power. The real work is making a car you trust at the limit.",
    specs: [
      { label: "Lap gain", value: "−2.8 s" },
      { label: "Power added", value: "+0 hp" },
      { label: "Setup time", value: "3 days" },
      { label: "Track", value: "Brands Hatch Indy" },
    ],
    body: [
      "The most surprising thing about the car we tested was that its owner hadn't added a single horsepower. Instead, three days in an immaculate workshop transformed a capable road car into one that lapped nearly three seconds quicker.",
      "It started on the alignment rig. A touch more negative camber at the front, a fraction of toe-out, and the rear set to calm rather than nervous. The engineer works in minutes of a degree, the way a jeweller works in fractions of a millimetre.",
      "Then the dampers: adjustable coilovers set first on the shaker rig and then refined on track, one click at a time. Brake bias shifted subtly rearward. New pads, fresh high-temperature fluid and stainless lines gave the pedal a firm, consistent feel lap after lap.",
      "The result was not dramatic in the way a turbo upgrade is dramatic. It was something better: confidence. The car turned in sharply, settled quickly and told the driver exactly what the tyres were doing.",
      "If you're tempted to chase peak power, consider spending the money on setup first. Your lap times — and your nerves — will thank you.",
    ],
  },
  {
    slug: "the-lakeside-tow",
    title: "The Lakeside Tow: Living Well on the Road",
    dek: "Lightweight aluminium trailers and capable SUVs are rewriting the rules of adventure travel. We spent a week finding out how far comfort can go.",
    category: "trailers",
    image: img("photo-1523987355523-c7b5b0dd90a7"),
    author: "Sophie Carrell",
    authorRole: "Travel & Touring Editor",
    date: "2025-04-24",
    readTime: 10,
    pullQuote: "The best campsite is the one you didn't plan to find.",
    specs: [
      { label: "Trailer weight", value: "1,180 kg" },
      { label: "Length", value: "5.4 m" },
      { label: "Berths", value: "2" },
      { label: "Off-grid", value: "5 days" },
    ],
    body: [
      "We left the city on a Friday afternoon with no fixed destination, only a rough line on a map pointing north toward the lakes. Behind the SUV, a compact aluminium trailer followed with barely a whisper.",
      "Modern trailers are lighter, better insulated and more aerodynamic than ever. Ours carried a solar array, a lithium battery bank and an induction hob, giving us five days of comfortable off-grid living without hunting for a hook-up.",
      "Towing has also become far less intimidating. Trailer-assist systems let you reverse with a dial, sway control steadies the rig in crosswinds, and surround cameras make tight lanes manageable even for first-timers.",
      "On the third morning we woke beside a still mountain lake, mist rising off the water. Coffee on the step, the vehicles silver in the early light — it felt less like camping and more like owning a small, very well-located house.",
      "Choose your weight carefully, practise your hitching, and keep your plans loose. The road will do the rest.",
    ],
  },
  {
    slug: "the-electric-hypercar-question",
    title: "Silence at Speed: The Electric Hypercar Question",
    dek: "They are faster than anything before them. But can a car without a soundtrack still stir the soul?",
    category: "cars",
    image: img("photo-1492144534655-ae79c964c9d7"),
    author: "Elena Marchetti",
    authorRole: "Road Test Editor",
    date: "2025-04-19",
    readTime: 8,
    pullQuote: "Without the noise, you notice everything else — the tyres, the wind, your own pulse.",
    body: [
      "The first full-throttle launch in an electric hypercar is a physical event. There is no build-up, no drama of revs climbing. Just a shove so instant and relentless that your vision narrows and your stomach is left somewhere behind.",
      "Yet after the initial shock, a question lingers. For a century, emotion in performance cars has been carried largely by sound. Remove it, and what remains?",
      "The answer, it turns out, is a different kind of intimacy. In near silence you hear the tyres working at the edge of grip and the wind changing tone as speed rises. The car communicates in subtler ways.",
      "Engineers are experimenting with synthesised soundscapes, haptic feedback and simulated gearshifts. Some are convincing; others feel like costumes. The most successful cars, we found, are the ones that embrace what they are.",
    ],
  },
  {
    slug: "first-big-ride-touring-on-two-wheels",
    title: "Your First Big Ride: Touring on Two Wheels",
    dek: "From luggage to layering, the practical wisdom that turns a long-distance motorcycle trip from ordeal into adventure.",
    category: "motorcycles",
    image: img("photo-1449426468159-d96dbf08f19f"),
    author: "Tom Hadley",
    authorRole: "Motorcycle Editor",
    date: "2025-04-15",
    readTime: 6,
    pullQuote: "Plan for 300 kilometres a day. Then plan to be delighted when you only do 200.",
    body: [
      "The difference between a memorable motorcycle tour and an exhausting one usually comes down to preparation. Not of the route — that's the fun part — but of you and the bike.",
      "Pack light, then remove a third. Soft luggage keeps weight low and centred. Layer your clothing so you can adapt to mountain chill and valley heat in the same afternoon.",
      "Stop every ninety minutes, even when you don't feel you need to. Hydrate constantly. Fatigue creeps up quietly and dulls the judgement that keeps you safe.",
      "And leave room in the schedule. The best moments of any ride happen in the detours you never planned.",
    ],
  },
  {
    slug: "garage-to-grid-tuning-legends",
    title: "Garage to Grid: The Quiet Legends of Tuning",
    dek: "Small workshops, big reputations. Meet the engineers whose names are whispered in paddocks across Europe.",
    category: "performance-tuning",
    image: img("photo-1487754180451-c456f719a1fc"),
    author: "Ravi Desai",
    authorRole: "Technical Editor",
    date: "2025-04-09",
    readTime: 9,
    pullQuote: "We don't advertise. The cars do that for us.",
    body: [
      "Some of the most respected names in performance tuning don't have websites worth mentioning. They have waiting lists, a handful of loyal clients and reputations built entirely on results.",
      "We visited three such workshops, each specialising in a different discipline: engine building, chassis development and electronics calibration. What united them was an obsession with detail and an almost total indifference to marketing.",
      "Their advice to enthusiasts was refreshingly consistent: understand what you want the car to do before you change anything, and resist the temptation to chase numbers for their own sake.",
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
