import type { Trip, TripTags } from "./types";
import type { Profile } from "@/lib/profile";

const img = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const avatar = (seed: string) =>
  `https://i.pravatar.cc/120?u=${encodeURIComponent(seed)}`;

const rawTrips: Trip[] = [
  {
    id: "tokyo-spring",
    title: "Tokyo in Cherry Blossom",
    subtitle: "Four days chasing sakura, sushi, and neon",
    guideNote: "The timing is everything — hit Ueno and Sumida on day three and you'll understand why people plan around the blossoms for years. And don't waste the city's late-night energy on your hotel; Tokyo switches modes after midnight in a way most visitors never see.",
    author: { name: "Mei Tanaka", avatarUrl: avatar("mei") },
    coverImageUrl: img("tokyo-cover", 1200, 800),
    startLng: 139.7568,
    startLat: 35.6646,
    durationDays: 4,
    days: [
      {
        dayNumber: 1,
        date: "Apr 02",
        title: "Arrival & Tsukiji",
        steps: [
          { id: "t-1-1", kind: "airport", name: "Haneda Airport (HND)", lng: 139.7798, lat: 35.5494, time: "09:30", imageUrl: img("hnd"), notes: "Long-haul landing, JR train into the city." },
          { id: "t-1-2", kind: "hotel", name: "Park Hotel Tokyo", lng: 139.7568, lat: 35.6646, time: "12:00", imageUrl: img("park-hotel"), notes: "Check-in, room with a Tokyo Tower view." },
          { id: "t-1-3", kind: "activity", name: "Tsukiji Outer Market", lng: 139.7707, lat: 35.6654, time: "14:30", imageUrl: img("tsukiji"), notes: "Tamago skewers and uni rice bowl." },
          { id: "t-1-4", kind: "viewpoint", name: "Hamarikyu Gardens", lng: 139.7634, lat: 35.6597, time: "16:30", imageUrl: img("hamarikyu") },
        ],
      },
      {
        dayNumber: 2,
        date: "Apr 03",
        title: "Shibuya & Shinjuku",
        steps: [
          { id: "t-2-1", kind: "activity", name: "Shibuya Crossing", lng: 139.7004, lat: 35.6595, time: "10:00", imageUrl: img("shibuya") },
          { id: "t-2-2", kind: "activity", name: "Meiji Jingu Shrine", lng: 139.6993, lat: 35.6764, time: "11:30", imageUrl: img("meiji") },
          { id: "t-2-3", kind: "activity", name: "Takeshita-dori, Harajuku", lng: 139.7026, lat: 35.6712, time: "13:30", imageUrl: img("harajuku") },
          { id: "t-2-4", kind: "restaurant", name: "Omoide Yokocho", lng: 139.6997, lat: 35.6938, time: "19:00", imageUrl: img("omoide"), notes: "Yakitori under the train tracks." },
        ],
      },
      {
        dayNumber: 3,
        date: "Apr 04",
        title: "Asakusa to Akihabara",
        steps: [
          { id: "t-3-1", kind: "activity", name: "Senso-ji Temple", lng: 139.7967, lat: 35.7148, time: "09:30", imageUrl: img("sensoji") },
          { id: "t-3-2", kind: "viewpoint", name: "Sumida Park sakura", lng: 139.8019, lat: 35.7115, time: "11:00", imageUrl: img("sumida") },
          { id: "t-3-3", kind: "viewpoint", name: "Tokyo Skytree", lng: 139.8107, lat: 35.7101, time: "13:30", imageUrl: img("skytree") },
          { id: "t-3-4", kind: "activity", name: "Akihabara Electric Town", lng: 139.7745, lat: 35.7022, time: "16:30", imageUrl: img("akiba") },
        ],
      },
      {
        dayNumber: 4,
        date: "Apr 05",
        title: "Final bites & flight",
        steps: [
          { id: "t-4-1", kind: "restaurant", name: "Sushi Dai", lng: 139.7707, lat: 35.6655, time: "08:30", imageUrl: img("sushi-dai") },
          { id: "t-4-2", kind: "transport", name: "Tokyo Station", lng: 139.7671, lat: 35.6812, time: "11:00", imageUrl: img("tokyo-station") },
          { id: "t-4-3", kind: "airport", name: "Haneda Airport (HND)", lng: 139.7798, lat: 35.5494, time: "13:30", imageUrl: img("hnd-out") },
        ],
      },
    ],
  },
  {
    id: "paris-classic",
    title: "Long Weekend in Paris",
    subtitle: "Cafés, museums, and a day at Versailles",
    guideNote: "Go to Notre-Dame first thing — by mid-morning the crowds thin and the light through the nave is unlike anything else in the city. And give Versailles a full day, not the half-day most people squeeze in; the gardens alone take two hours if you actually walk them.",
    author: { name: "Hugo Laurent", avatarUrl: avatar("hugo") },
    coverImageUrl: img("paris-cover", 1200, 800),
    startLng: 2.3151,
    startLat: 48.8718,
    durationDays: 3,
    days: [
      {
        dayNumber: 1,
        date: "Sep 12",
        title: "Arrival & Champs-Élysées",
        steps: [
          { id: "p-1-1", kind: "airport", name: "Charles de Gaulle (CDG)", lng: 2.5479, lat: 49.0097, time: "08:00", imageUrl: img("cdg") },
          { id: "p-1-2", kind: "hotel", name: "Hôtel Le Bristol", lng: 2.3151, lat: 48.8718, time: "10:30", imageUrl: img("bristol") },
          { id: "p-1-3", kind: "activity", name: "Champs-Élysées walk", lng: 2.3076, lat: 48.8698, time: "14:00", imageUrl: img("champs") },
          { id: "p-1-4", kind: "viewpoint", name: "Eiffel Tower at golden hour", lng: 2.2945, lat: 48.8584, time: "18:30", imageUrl: img("eiffel") },
        ],
      },
      {
        dayNumber: 2,
        date: "Sep 13",
        title: "Museums & Montmartre",
        steps: [
          { id: "p-2-1", kind: "activity", name: "Louvre Museum", lng: 2.3376, lat: 48.8606, time: "09:30", imageUrl: img("louvre") },
          { id: "p-2-2", kind: "activity", name: "Notre-Dame de Paris", lng: 2.3499, lat: 48.8530, time: "13:00", imageUrl: img("notredame") },
          { id: "p-2-3", kind: "restaurant", name: "Le Procope", lng: 2.3387, lat: 48.8533, time: "15:00", imageUrl: img("procope") },
          { id: "p-2-4", kind: "viewpoint", name: "Sacré-Cœur, Montmartre", lng: 2.3431, lat: 48.8867, time: "19:00", imageUrl: img("sacrecoeur") },
        ],
      },
      {
        dayNumber: 3,
        date: "Sep 14",
        title: "Versailles & home",
        steps: [
          { id: "p-3-1", kind: "activity", name: "Château de Versailles", lng: 2.1204, lat: 48.8049, time: "10:00", imageUrl: img("versailles") },
          { id: "p-3-2", kind: "airport", name: "Charles de Gaulle (CDG)", lng: 2.5479, lat: 49.0097, time: "18:00", imageUrl: img("cdg-out") },
        ],
      },
    ],
  },
  {
    id: "rome-eternal",
    title: "Four Days in the Eternal City",
    subtitle: "Ancient ruins, pasta, and Vatican walks",
    guideNote: "Book the Vatican Museums for 8am — you'll have the Sistine Chapel nearly to yourself for about fifteen minutes before the groups arrive. The Forum makes sense only after you've read a little history; otherwise it's just rubble, and rubble doesn't move you the way it should.",
    author: { name: "Sofia Romano", avatarUrl: avatar("sofia") },
    coverImageUrl: img("rome-cover", 1200, 800),
    startLng: 12.4949,
    startLat: 41.9009,
    durationDays: 4,
    days: [
      {
        dayNumber: 1,
        date: "May 18",
        title: "Arrival & central Rome",
        steps: [
          { id: "r-1-1", kind: "airport", name: "Fiumicino (FCO)", lng: 12.2389, lat: 41.8003, time: "10:00", imageUrl: img("fco") },
          { id: "r-1-2", kind: "hotel", name: "Hotel Artemide", lng: 12.4949, lat: 41.9009, time: "12:30", imageUrl: img("artemide") },
          { id: "r-1-3", kind: "viewpoint", name: "Trevi Fountain", lng: 12.4833, lat: 41.9009, time: "16:00", imageUrl: img("trevi") },
          { id: "r-1-4", kind: "viewpoint", name: "Spanish Steps", lng: 12.4823, lat: 41.9059, time: "18:00", imageUrl: img("spanish-steps") },
        ],
      },
      {
        dayNumber: 2,
        date: "May 19",
        title: "Ancient Rome",
        steps: [
          { id: "r-2-1", kind: "activity", name: "Colosseum", lng: 12.4922, lat: 41.8902, time: "09:00", imageUrl: img("colosseum") },
          { id: "r-2-2", kind: "activity", name: "Roman Forum", lng: 12.4853, lat: 41.8925, time: "11:30", imageUrl: img("forum") },
          { id: "r-2-3", kind: "viewpoint", name: "Palatine Hill", lng: 12.4869, lat: 41.8893, time: "13:30", imageUrl: img("palatine") },
          { id: "r-2-4", kind: "restaurant", name: "Trattoria in Trastevere", lng: 12.4685, lat: 41.8898, time: "20:00", imageUrl: img("trastevere") },
        ],
      },
      {
        dayNumber: 3,
        date: "May 20",
        title: "Vatican",
        steps: [
          { id: "r-3-1", kind: "activity", name: "Vatican Museums", lng: 12.4536, lat: 41.9065, time: "08:30", imageUrl: img("vatican-museum") },
          { id: "r-3-2", kind: "activity", name: "St. Peter's Basilica", lng: 12.4533, lat: 41.9022, time: "12:00", imageUrl: img("stpeters") },
          { id: "r-3-3", kind: "viewpoint", name: "Castel Sant'Angelo", lng: 12.4663, lat: 41.9031, time: "15:30", imageUrl: img("castel") },
        ],
      },
      {
        dayNumber: 4,
        date: "May 21",
        title: "Borghese & flight",
        steps: [
          { id: "r-4-1", kind: "activity", name: "Galleria Borghese", lng: 12.4922, lat: 41.9142, time: "10:00", imageUrl: img("borghese") },
          { id: "r-4-2", kind: "airport", name: "Fiumicino (FCO)", lng: 12.2389, lat: 41.8003, time: "16:00", imageUrl: img("fco-out") },
        ],
      },
    ],
  },
  {
    id: "nyc-three-days",
    title: "Three Days in New York",
    subtitle: "Manhattan to Brooklyn at a runner's pace",
    guideNote: "The High Line at 7am before anyone else shows up is a completely different city — do that first. And the DUMBO pizza spot isn't a secret anymore, but it's still the best slice in New York and you owe it to yourself to find out why.",
    author: { name: "Avery Chen", avatarUrl: avatar("avery") },
    coverImageUrl: img("nyc-cover", 1200, 800),
    startLng: -74.0079,
    startLat: 40.7466,
    durationDays: 3,
    days: [
      {
        dayNumber: 1,
        date: "Oct 04",
        title: "High Line & Times Square",
        steps: [
          { id: "n-1-1", kind: "airport", name: "JFK International", lng: -73.7781, lat: 40.6413, time: "09:00", imageUrl: img("jfk") },
          { id: "n-1-2", kind: "hotel", name: "The Standard, High Line", lng: -74.0079, lat: 40.7466, time: "11:30", imageUrl: img("standard") },
          { id: "n-1-3", kind: "activity", name: "High Line walk", lng: -74.0048, lat: 40.7480, time: "14:00", imageUrl: img("highline") },
          { id: "n-1-4", kind: "viewpoint", name: "Times Square at night", lng: -73.9855, lat: 40.7580, time: "20:30", imageUrl: img("times-square") },
        ],
      },
      {
        dayNumber: 2,
        date: "Oct 05",
        title: "Central Park to DUMBO",
        steps: [
          { id: "n-2-1", kind: "activity", name: "Central Park run", lng: -73.9654, lat: 40.7829, time: "08:00", imageUrl: img("central-park") },
          { id: "n-2-2", kind: "activity", name: "MoMA", lng: -73.9776, lat: 40.7614, time: "11:30", imageUrl: img("moma") },
          { id: "n-2-3", kind: "viewpoint", name: "Brooklyn Bridge", lng: -73.9969, lat: 40.7061, time: "16:00", imageUrl: img("brooklyn-bridge") },
          { id: "n-2-4", kind: "restaurant", name: "DUMBO pizza", lng: -73.9881, lat: 40.7033, time: "19:00", imageUrl: img("dumbo") },
        ],
      },
      {
        dayNumber: 3,
        date: "Oct 06",
        title: "Liberty & flight home",
        steps: [
          { id: "n-3-1", kind: "viewpoint", name: "Statue of Liberty ferry", lng: -74.0445, lat: 40.6892, time: "09:30", imageUrl: img("liberty") },
          { id: "n-3-2", kind: "activity", name: "9/11 Memorial", lng: -74.0134, lat: 40.7115, time: "13:00", imageUrl: img("memorial") },
          { id: "n-3-3", kind: "airport", name: "JFK International", lng: -73.7781, lat: 40.6413, time: "18:30", imageUrl: img("jfk-out") },
        ],
      },
    ],
  },
  {
    id: "cape-town-summit",
    title: "Cape Town & the Cape Peninsula",
    subtitle: "Mountains, penguins, and wine country",
    guideNote: "Hike Table Mountain instead of taking the cable car — it's two hours up and you earn every metre of that view. Boulders Beach sounds like a tourist cliché until you're actually sitting three feet from penguins, and then you stop caring about that entirely.",
    author: { name: "Thandi Nkosi", avatarUrl: avatar("thandi") },
    coverImageUrl: img("capetown-cover", 1200, 800),
    startLng: 18.4216,
    startLat: -33.9067,
    durationDays: 4,
    days: [
      {
        dayNumber: 1,
        date: "Jan 14",
        title: "Arrival & Bo-Kaap",
        steps: [
          { id: "c-1-1", kind: "airport", name: "Cape Town Intl (CPT)", lng: 18.5972, lat: -33.9695, time: "10:00", imageUrl: img("cpt") },
          { id: "c-1-2", kind: "hotel", name: "The Silo Hotel", lng: 18.4216, lat: -33.9067, time: "12:00", imageUrl: img("silo") },
          { id: "c-1-3", kind: "activity", name: "V&A Waterfront", lng: 18.4205, lat: -33.9033, time: "14:30", imageUrl: img("waterfront") },
          { id: "c-1-4", kind: "viewpoint", name: "Bo-Kaap painted houses", lng: 18.4136, lat: -33.9188, time: "17:00", imageUrl: img("bokaap") },
        ],
      },
      {
        dayNumber: 2,
        date: "Jan 15",
        title: "Table Mountain",
        steps: [
          { id: "c-2-1", kind: "viewpoint", name: "Table Mountain summit", lng: 18.4098, lat: -33.9628, time: "09:00", imageUrl: img("table-mountain") },
          { id: "c-2-2", kind: "activity", name: "Camps Bay beach", lng: 18.3776, lat: -33.9510, time: "13:30", imageUrl: img("camps-bay") },
          { id: "c-2-3", kind: "viewpoint", name: "Sea Point promenade", lng: 18.3824, lat: -33.9159, time: "17:30", imageUrl: img("seapoint") },
        ],
      },
      {
        dayNumber: 3,
        date: "Jan 16",
        title: "Cape of Good Hope",
        steps: [
          { id: "c-3-1", kind: "viewpoint", name: "Cape of Good Hope", lng: 18.4737, lat: -34.3568, time: "10:00", imageUrl: img("good-hope") },
          { id: "c-3-2", kind: "activity", name: "Boulders Beach penguins", lng: 18.4515, lat: -34.1973, time: "13:00", imageUrl: img("boulders") },
          { id: "c-3-3", kind: "restaurant", name: "Constantia wine estate", lng: 18.4145, lat: -34.0421, time: "17:00", imageUrl: img("constantia") },
        ],
      },
      {
        dayNumber: 4,
        date: "Jan 17",
        title: "Robben Island & flight",
        steps: [
          { id: "c-4-1", kind: "activity", name: "Robben Island tour", lng: 18.3667, lat: -33.8064, time: "09:00", imageUrl: img("robben") },
          { id: "c-4-2", kind: "airport", name: "Cape Town Intl (CPT)", lng: 18.5972, lat: -33.9695, time: "16:00", imageUrl: img("cpt-out") },
        ],
      },
    ],
  },
  {
    id: "iceland-golden-circle",
    title: "Iceland: Reykjavik & Golden Circle",
    subtitle: "Geysers, waterfalls, and the Blue Lagoon",
    guideNote: "February is brutally cold but the Golden Circle is almost entirely yours — that trade-off is worth it. Book the Blue Lagoon for the last entry slot of the day; the crowds drop off, the steam thickens, and you get something closer to what this place is actually supposed to feel like.",
    author: { name: "Erik Magnusson", avatarUrl: avatar("erik") },
    coverImageUrl: img("iceland-cover", 1200, 800),
    startLng: -21.9426,
    startLat: 64.1466,
    durationDays: 3,
    days: [
      {
        dayNumber: 1,
        date: "Feb 22",
        title: "Reykjavik",
        steps: [
          { id: "i-1-1", kind: "airport", name: "Keflavik (KEF)", lng: -22.6056, lat: 63.985, time: "07:30", imageUrl: img("kef") },
          { id: "i-1-2", kind: "hotel", name: "101 Hotel Reykjavik", lng: -21.9426, lat: 64.1466, time: "10:00", imageUrl: img("101") },
          { id: "i-1-3", kind: "viewpoint", name: "Hallgrímskirkja", lng: -21.9266, lat: 64.1417, time: "13:00", imageUrl: img("hallgrim") },
          { id: "i-1-4", kind: "viewpoint", name: "Sun Voyager sculpture", lng: -21.9224, lat: 64.1475, time: "16:00", imageUrl: img("sun-voyager") },
        ],
      },
      {
        dayNumber: 2,
        date: "Feb 23",
        title: "Golden Circle",
        steps: [
          { id: "i-2-1", kind: "viewpoint", name: "Þingvellir National Park", lng: -21.1297, lat: 64.2559, time: "09:30", imageUrl: img("thingvellir") },
          { id: "i-2-2", kind: "viewpoint", name: "Geysir geothermal area", lng: -20.3024, lat: 64.3104, time: "12:30", imageUrl: img("geysir") },
          { id: "i-2-3", kind: "viewpoint", name: "Gullfoss waterfall", lng: -20.1199, lat: 64.3271, time: "14:30", imageUrl: img("gullfoss") },
        ],
      },
      {
        dayNumber: 3,
        date: "Feb 24",
        title: "Blue Lagoon & flight",
        steps: [
          { id: "i-3-1", kind: "activity", name: "Blue Lagoon", lng: -22.4495, lat: 63.8804, time: "10:00", imageUrl: img("blue-lagoon") },
          { id: "i-3-2", kind: "airport", name: "Keflavik (KEF)", lng: -22.6056, lat: 63.985, time: "15:00", imageUrl: img("kef-out") },
        ],
      },
    ],
  },
  {
    id: "bali-ubud",
    title: "Bali: Ubud & Beyond",
    subtitle: "Rice terraces, temples, and surf sunsets",
    guideNote: "Get to Tegallalang at sunrise before the tour groups arrive and the terraces are genuinely yours — that stillness is the whole point. The Batur trek at 4am sounds brutal until the sun comes up over the caldera, and then you understand why people keep doing it.",
    author: { name: "Putu Wirawan", avatarUrl: avatar("putu") },
    coverImageUrl: img("bali-cover", 1200, 800),
    startLng: 115.2625,
    startLat: -8.5069,
    durationDays: 4,
    days: [
      {
        dayNumber: 1,
        date: "Jul 08",
        title: "Arrival in Ubud",
        steps: [
          { id: "b-1-1", kind: "airport", name: "Denpasar (DPS)", lng: 115.1667, lat: -8.7467, time: "13:00", imageUrl: img("dps") },
          { id: "b-1-2", kind: "hotel", name: "Bisma Eight Ubud", lng: 115.2625, lat: -8.5069, time: "15:30", imageUrl: img("bisma") },
          { id: "b-1-3", kind: "viewpoint", name: "Tegallalang rice terraces", lng: 115.2778, lat: -8.4321, time: "17:00", imageUrl: img("tegallalang") },
          { id: "b-1-4", kind: "activity", name: "Sacred Monkey Forest", lng: 115.2588, lat: -8.5183, time: "19:00", imageUrl: img("monkey-forest") },
        ],
      },
      {
        dayNumber: 2,
        date: "Jul 09",
        title: "Mount Batur",
        steps: [
          { id: "b-2-1", kind: "activity", name: "Tirta Empul water temple", lng: 115.3158, lat: -8.4156, time: "09:00", imageUrl: img("tirta") },
          { id: "b-2-2", kind: "viewpoint", name: "Mount Batur trek", lng: 115.3753, lat: -8.2421, time: "13:00", imageUrl: img("batur") },
          { id: "b-2-3", kind: "restaurant", name: "Kintamani lakeside lunch", lng: 115.3625, lat: -8.2784, time: "15:30", imageUrl: img("kintamani") },
        ],
      },
      {
        dayNumber: 3,
        date: "Jul 10",
        title: "Uluwatu & Jimbaran",
        steps: [
          { id: "b-3-1", kind: "viewpoint", name: "Uluwatu Temple sunset", lng: 115.0848, lat: -8.8290, time: "17:00", imageUrl: img("uluwatu") },
          { id: "b-3-2", kind: "restaurant", name: "Jimbaran beach seafood", lng: 115.1689, lat: -8.7756, time: "20:00", imageUrl: img("jimbaran") },
        ],
      },
      {
        dayNumber: 4,
        date: "Jul 11",
        title: "Tanah Lot & flight",
        steps: [
          { id: "b-4-1", kind: "viewpoint", name: "Tanah Lot temple", lng: 115.0868, lat: -8.6212, time: "08:30", imageUrl: img("tanahlot") },
          { id: "b-4-2", kind: "airport", name: "Denpasar (DPS)", lng: 115.1667, lat: -8.7467, time: "13:00", imageUrl: img("dps-out") },
        ],
      },
    ],
  },
  {
    id: "marrakech-medina",
    title: "Marrakech & the Atlas",
    subtitle: "Riads, souks, and a day in the mountains",
    guideNote: "The souks are designed to disorient you — lean into it on day two and get genuinely lost, because the parts no tour group reaches are where the city actually lives. Jemaa el-Fnaa at dusk, with the smoke from the food stalls and the sound of a dozen competing musicians, is one of those rare places that earns its reputation.",
    author: { name: "Yasmine Bouazza", avatarUrl: avatar("yasmine") },
    coverImageUrl: img("marrakech-cover", 1200, 800),
    startLng: -7.9890,
    startLat: 31.6310,
    durationDays: 3,
    days: [
      {
        dayNumber: 1,
        date: "Mar 11",
        title: "Medina by night",
        steps: [
          { id: "m-1-1", kind: "airport", name: "Marrakech Menara (RAK)", lng: -8.0363, lat: 31.6069, time: "11:00", imageUrl: img("rak") },
          { id: "m-1-2", kind: "hotel", name: "Riad Yasmine", lng: -7.9890, lat: 31.6310, time: "13:00", imageUrl: img("riad-yasmine") },
          { id: "m-1-3", kind: "activity", name: "Jemaa el-Fnaa square", lng: -7.9892, lat: 31.6258, time: "19:00", imageUrl: img("jemaa") },
          { id: "m-1-4", kind: "viewpoint", name: "Koutoubia Mosque", lng: -7.9933, lat: 31.6242, time: "21:00", imageUrl: img("koutoubia") },
        ],
      },
      {
        dayNumber: 2,
        date: "Mar 12",
        title: "Palaces & souks",
        steps: [
          { id: "m-2-1", kind: "activity", name: "Bahia Palace", lng: -7.9824, lat: 31.6217, time: "09:30", imageUrl: img("bahia") },
          { id: "m-2-2", kind: "activity", name: "Saadian Tombs", lng: -7.9889, lat: 31.6182, time: "11:30", imageUrl: img("saadian") },
          { id: "m-2-3", kind: "activity", name: "Souks of the Medina", lng: -7.9869, lat: 31.6300, time: "14:00", imageUrl: img("souks") },
          { id: "m-2-4", kind: "restaurant", name: "Le Jardin restaurant", lng: -7.9867, lat: 31.6308, time: "20:00", imageUrl: img("le-jardin") },
        ],
      },
      {
        dayNumber: 3,
        date: "Mar 13",
        title: "Atlas day trip & flight",
        steps: [
          { id: "m-3-1", kind: "activity", name: "Majorelle Garden", lng: -8.0033, lat: 31.6418, time: "08:30", imageUrl: img("majorelle") },
          { id: "m-3-2", kind: "viewpoint", name: "Atlas Mountains village", lng: -7.9170, lat: 31.0840, time: "12:00", imageUrl: img("atlas") },
          { id: "m-3-3", kind: "airport", name: "Marrakech Menara (RAK)", lng: -8.0363, lat: 31.6069, time: "20:30", imageUrl: img("rak-out") },
        ],
      },
    ],
  },
  {
    id: "buenos-aires-tango",
    title: "Buenos Aires: Steak & Tango",
    subtitle: "Recoleta, La Boca, and the Tigre delta",
    guideNote: "Arrive at Don Julio at 7pm sharp, before the real porteño dinner hour starts, and you'll skip the queue that forms by 8:30. La Boca is touristy, yes — but the Caminito murals at the right angle of afternoon light are legitimately beautiful, and writing them off entirely is a mistake.",
    author: { name: "Lucía Fernández", avatarUrl: avatar("lucia") },
    coverImageUrl: img("ba-cover", 1200, 800),
    startLng: -58.3915,
    startLat: -34.5882,
    durationDays: 4,
    days: [
      {
        dayNumber: 1,
        date: "Nov 02",
        title: "Recoleta",
        steps: [
          { id: "ba-1-1", kind: "airport", name: "Ezeiza (EZE)", lng: -58.5358, lat: -34.8222, time: "09:30", imageUrl: img("eze") },
          { id: "ba-1-2", kind: "hotel", name: "Alvear Palace Hotel", lng: -58.3915, lat: -34.5882, time: "12:00", imageUrl: img("alvear") },
          { id: "ba-1-3", kind: "activity", name: "Recoleta Cemetery", lng: -58.3933, lat: -34.5876, time: "15:00", imageUrl: img("recoleta") },
          { id: "ba-1-4", kind: "restaurant", name: "Don Julio steakhouse", lng: -58.4341, lat: -34.5887, time: "21:00", imageUrl: img("donjulio") },
        ],
      },
      {
        dayNumber: 2,
        date: "Nov 03",
        title: "La Boca & San Telmo",
        steps: [
          { id: "ba-2-1", kind: "activity", name: "La Boca neighborhood", lng: -58.3621, lat: -34.6383, time: "10:00", imageUrl: img("la-boca") },
          { id: "ba-2-2", kind: "viewpoint", name: "Caminito street", lng: -58.3636, lat: -34.6384, time: "11:30", imageUrl: img("caminito") },
          { id: "ba-2-3", kind: "activity", name: "Plaza de Mayo", lng: -58.3712, lat: -34.6083, time: "14:00", imageUrl: img("plaza-mayo") },
          { id: "ba-2-4", kind: "activity", name: "Tango show, San Telmo", lng: -58.3725, lat: -34.6210, time: "21:00", imageUrl: img("tango") },
        ],
      },
      {
        dayNumber: 3,
        date: "Nov 04",
        title: "Tigre Delta",
        steps: [
          { id: "ba-3-1", kind: "activity", name: "Tigre Delta boat", lng: -58.5793, lat: -34.4264, time: "10:00", imageUrl: img("tigre") },
          { id: "ba-3-2", kind: "activity", name: "Puerto Madero stroll", lng: -58.3640, lat: -34.6111, time: "17:00", imageUrl: img("puerto-madero") },
        ],
      },
      {
        dayNumber: 4,
        date: "Nov 05",
        title: "Palermo & flight",
        steps: [
          { id: "ba-4-1", kind: "activity", name: "Palermo cafés", lng: -58.4198, lat: -34.5793, time: "10:00", imageUrl: img("palermo") },
          { id: "ba-4-2", kind: "activity", name: "MALBA museum", lng: -58.4032, lat: -34.5775, time: "13:00", imageUrl: img("malba") },
          { id: "ba-4-3", kind: "airport", name: "Ezeiza (EZE)", lng: -58.5358, lat: -34.8222, time: "18:00", imageUrl: img("eze-out") },
        ],
      },
    ],
  },
  {
    id: "sydney-harbour",
    title: "Sydney Harbour Long Weekend",
    subtitle: "Opera House, Bondi, and a bridge climb",
    guideNote: "The Bondi to Coogee coastal walk doesn't feel like exercise — it feels like the city showing off, and it earns that description for two solid hours. The harbour bridge climb is overpriced and I'd still do it again; dusk from up there, with the ferries below, is worth whatever they're charging.",
    author: { name: "Liam O'Connor", avatarUrl: avatar("liam") },
    coverImageUrl: img("sydney-cover", 1200, 800),
    startLng: 151.2090,
    startLat: -33.8568,
    durationDays: 3,
    days: [
      {
        dayNumber: 1,
        date: "Dec 02",
        title: "Circular Quay",
        steps: [
          { id: "s-1-1", kind: "airport", name: "Sydney Kingsford Smith (SYD)", lng: 151.1753, lat: -33.9399, time: "10:00", imageUrl: img("syd") },
          { id: "s-1-2", kind: "hotel", name: "Park Hyatt Sydney", lng: 151.2090, lat: -33.8568, time: "12:30", imageUrl: img("hyatt") },
          { id: "s-1-3", kind: "viewpoint", name: "Sydney Opera House", lng: 151.2153, lat: -33.8568, time: "15:00", imageUrl: img("opera") },
          { id: "s-1-4", kind: "restaurant", name: "Circular Quay dinner", lng: 151.2117, lat: -33.8617, time: "20:00", imageUrl: img("quay") },
        ],
      },
      {
        dayNumber: 2,
        date: "Dec 03",
        title: "Bondi to Coogee",
        steps: [
          { id: "s-2-1", kind: "activity", name: "Bondi Beach", lng: 151.2767, lat: -33.8915, time: "08:30", imageUrl: img("bondi") },
          { id: "s-2-2", kind: "activity", name: "Bondi-to-Coogee walk", lng: 151.2603, lat: -33.9135, time: "11:00", imageUrl: img("coastal-walk") },
          { id: "s-2-3", kind: "viewpoint", name: "Coogee Beach", lng: 151.2580, lat: -33.9201, time: "13:30", imageUrl: img("coogee") },
        ],
      },
      {
        dayNumber: 3,
        date: "Dec 04",
        title: "Bridge climb & flight",
        steps: [
          { id: "s-3-1", kind: "activity", name: "Taronga Zoo ferry", lng: 151.2410, lat: -33.8430, time: "09:00", imageUrl: img("taronga") },
          { id: "s-3-2", kind: "viewpoint", name: "Harbour Bridge climb", lng: 151.2108, lat: -33.8523, time: "13:00", imageUrl: img("bridge-climb") },
          { id: "s-3-3", kind: "airport", name: "Sydney Kingsford Smith (SYD)", lng: 151.1753, lat: -33.9399, time: "19:30", imageUrl: img("syd-out") },
        ],
      },
    ],
  },
  {
    id: "patagonia-w-trek",
    title: "Patagonia: The W Trek",
    subtitle: "Five days through Torres del Paine",
    guideNote: "Weather changes by the hour here — start the Base Torres climb before sunrise and you might get the towers glowing red with nobody else around. Pack layers you can shed; the wind does half the work of exhausting you.",
    author: { name: "Camila Rivas", avatarUrl: avatar("camila") },
    coverImageUrl: img("patagonia-cover", 1200, 800),
    startLng: -72.5064,
    startLat: -51.7236,
    durationDays: 5,
    days: [
      {
        dayNumber: 1,
        date: "Nov 09",
        title: "Arrival in Puerto Natales",
        steps: [
          { id: "pw-1-1", kind: "airport", name: "Punta Arenas Airport (PUQ)", lng: -70.8546, lat: -53.0028, time: "10:00", imageUrl: img("puq"), notes: "Bus transfer north to Puerto Natales." },
          { id: "pw-1-2", kind: "hotel", name: "The Singular Patagonia", lng: -72.5064, lat: -51.7236, time: "14:00", imageUrl: img("singular-patagonia") },
          { id: "pw-1-3", kind: "viewpoint", name: "Mirador Última Esperanza", lng: -72.5100, lat: -51.7280, time: "17:30", imageUrl: img("ultima-esperanza") },
        ],
      },
      {
        dayNumber: 2,
        date: "Nov 10",
        title: "Grey Glacier",
        steps: [
          { id: "pw-2-1", kind: "transport", name: "Pudeto Catamaran", lng: -72.9667, lat: -51.0833, time: "09:00", imageUrl: img("pudeto") },
          { id: "pw-2-2", kind: "hotel", name: "Refugio Paine Grande", lng: -73.0072, lat: -51.0686, time: "11:00", imageUrl: img("paine-grande") },
          { id: "pw-2-3", kind: "viewpoint", name: "Grey Glacier Lookout", lng: -73.1900, lat: -51.0000, time: "15:00", imageUrl: img("grey-glacier"), notes: "Icebergs calving into Lago Grey." },
        ],
      },
      {
        dayNumber: 3,
        date: "Nov 11",
        title: "French Valley",
        steps: [
          { id: "pw-3-1", kind: "activity", name: "Valle del Francés trail", lng: -72.9333, lat: -50.9667, time: "08:30", imageUrl: img("valle-frances") },
          { id: "pw-3-2", kind: "viewpoint", name: "Mirador Británico", lng: -72.9280, lat: -50.9550, time: "12:00", imageUrl: img("mirador-britanico") },
          { id: "pw-3-3", kind: "hotel", name: "Refugio Los Cuernos", lng: -72.8540, lat: -50.9930, time: "17:00", imageUrl: img("los-cuernos") },
        ],
      },
      {
        dayNumber: 4,
        date: "Nov 12",
        title: "Base of the Towers",
        steps: [
          { id: "pw-4-1", kind: "activity", name: "Ascencio Valley trail", lng: -72.9500, lat: -50.9600, time: "05:30", imageUrl: img("ascencio") },
          { id: "pw-4-2", kind: "viewpoint", name: "Mirador Las Torres", lng: -72.9870, lat: -50.9420, time: "08:00", imageUrl: img("las-torres"), notes: "Sunrise on the granite towers." },
          { id: "pw-4-3", kind: "hotel", name: "Hotel Las Torres", lng: -72.9760, lat: -50.9900, time: "15:00", imageUrl: img("hotel-las-torres") },
        ],
      },
      {
        dayNumber: 5,
        date: "Nov 13",
        title: "Return",
        steps: [
          { id: "pw-5-1", kind: "transport", name: "Transfer to Puerto Natales", lng: -72.5064, lat: -51.7236, time: "09:00", imageUrl: img("pn-return") },
          { id: "pw-5-2", kind: "airport", name: "Punta Arenas Airport (PUQ)", lng: -70.8546, lat: -53.0028, time: "15:00", imageUrl: img("puq-out") },
        ],
      },
    ],
  },
  {
    id: "kyoto-temples",
    title: "Kyoto: Temples & Tea",
    subtitle: "Four quiet days in old Japan",
    guideNote: "Kyoto is spread out and deceptively slow to cross — group the temples by district like the locals do. Fushimi Inari at 7am is a different shrine entirely; by 10 it's a queue.",
    author: { name: "Haruki Saito", avatarUrl: avatar("haruki") },
    coverImageUrl: img("kyoto-cover", 1200, 800),
    startLng: 135.7587,
    startLat: 34.9858,
    durationDays: 4,
    days: [
      {
        dayNumber: 1,
        date: "Nov 18",
        title: "Fushimi Inari & Gion",
        steps: [
          { id: "ky-1-1", kind: "airport", name: "Kansai Airport (KIX)", lng: 135.2441, lat: 34.4347, time: "09:00", imageUrl: img("kix"), notes: "Haruka express into Kyoto." },
          { id: "ky-1-2", kind: "hotel", name: "Hotel near Kyoto Station", lng: 135.7587, lat: 34.9858, time: "11:30", imageUrl: img("kyoto-hotel") },
          { id: "ky-1-3", kind: "activity", name: "Fushimi Inari Taisha", lng: 135.7727, lat: 34.9671, time: "14:00", imageUrl: img("fushimi-inari"), notes: "Walk the torii tunnel up Mt. Inari." },
          { id: "ky-1-4", kind: "viewpoint", name: "Gion after dark", lng: 135.7752, lat: 35.0037, time: "19:00", imageUrl: img("gion") },
        ],
      },
      {
        dayNumber: 2,
        date: "Nov 19",
        title: "Arashiyama",
        steps: [
          { id: "ky-2-1", kind: "viewpoint", name: "Arashiyama Bamboo Grove", lng: 135.6716, lat: 35.0170, time: "08:30", imageUrl: img("bamboo-grove") },
          { id: "ky-2-2", kind: "activity", name: "Tenryū-ji Temple", lng: 135.6738, lat: 35.0156, time: "10:00", imageUrl: img("tenryuji") },
          { id: "ky-2-3", kind: "viewpoint", name: "Togetsukyo Bridge", lng: 135.6779, lat: 35.0131, time: "12:00", imageUrl: img("togetsukyo") },
          { id: "ky-2-4", kind: "restaurant", name: "Kaiseki lunch, Arashiyama", lng: 135.6770, lat: 35.0145, time: "13:30", imageUrl: img("kaiseki") },
        ],
      },
      {
        dayNumber: 3,
        date: "Nov 20",
        title: "Golden Pavilion & Zen",
        steps: [
          { id: "ky-3-1", kind: "activity", name: "Kinkaku-ji (Golden Pavilion)", lng: 135.7292, lat: 35.0394, time: "09:00", imageUrl: img("kinkakuji") },
          { id: "ky-3-2", kind: "activity", name: "Ryōan-ji rock garden", lng: 135.7183, lat: 35.0345, time: "11:00", imageUrl: img("ryoanji") },
          { id: "ky-3-3", kind: "restaurant", name: "Nishiki Market food walk", lng: 135.7649, lat: 35.0050, time: "14:00", imageUrl: img("nishiki") },
        ],
      },
      {
        dayNumber: 4,
        date: "Nov 21",
        title: "Higashiyama & flight",
        steps: [
          { id: "ky-4-1", kind: "activity", name: "Kiyomizu-dera", lng: 135.7850, lat: 34.9948, time: "08:00", imageUrl: img("kiyomizu") },
          { id: "ky-4-2", kind: "viewpoint", name: "Philosopher's Path", lng: 135.7947, lat: 35.0270, time: "10:30", imageUrl: img("philosophers-path") },
          { id: "ky-4-3", kind: "airport", name: "Kansai Airport (KIX)", lng: 135.2441, lat: 34.4347, time: "16:00", imageUrl: img("kix-out") },
        ],
      },
    ],
  },
  {
    id: "sahara-merzouga",
    title: "Sahara: Fez to the Dunes",
    subtitle: "Four days to the Erg Chebbi sea of sand",
    guideNote: "The drive is the trip — don't treat it as transit. Cedar forests, Berber villages, the Ziz palm valley. Ride the camels at dawn, not sunset; the light is softer and the dunes are yours.",
    author: { name: "Yusuf El Idrissi", avatarUrl: avatar("yusuf") },
    coverImageUrl: img("sahara-cover", 1200, 800),
    startLng: -4.9733,
    startLat: 34.0617,
    durationDays: 4,
    days: [
      {
        dayNumber: 1,
        date: "Oct 03",
        title: "Fez medina",
        steps: [
          { id: "sa-1-1", kind: "airport", name: "Fès–Saïss Airport (FEZ)", lng: -4.9779, lat: 33.9273, time: "11:00", imageUrl: img("fez-airport") },
          { id: "sa-1-2", kind: "hotel", name: "Riad in Fez el-Bali", lng: -4.9733, lat: 34.0617, time: "13:00", imageUrl: img("fez-riad") },
          { id: "sa-1-3", kind: "activity", name: "Bab Bou Jeloud & tanneries", lng: -4.9826, lat: 34.0636, time: "16:00", imageUrl: img("fez-tanneries") },
        ],
      },
      {
        dayNumber: 2,
        date: "Oct 04",
        title: "Over the Atlas",
        steps: [
          { id: "sa-2-1", kind: "viewpoint", name: "Ifrane cedar forest", lng: -5.1106, lat: 33.5273, time: "09:30", imageUrl: img("ifrane"), notes: "Barbary macaques in the cedars." },
          { id: "sa-2-2", kind: "viewpoint", name: "Ziz Valley overlook", lng: -4.2667, lat: 31.9333, time: "14:00", imageUrl: img("ziz-valley") },
          { id: "sa-2-3", kind: "hotel", name: "Erg Chebbi desert camp", lng: -3.9772, lat: 31.0995, time: "18:30", imageUrl: img("erg-chebbi-camp") },
        ],
      },
      {
        dayNumber: 3,
        date: "Oct 05",
        title: "Erg Chebbi",
        steps: [
          { id: "sa-3-1", kind: "activity", name: "Sunrise camel trek", lng: -3.9772, lat: 31.0995, time: "06:00", imageUrl: img("camel-trek") },
          { id: "sa-3-2", kind: "activity", name: "Khamlia Gnawa music village", lng: -4.0072, lat: 31.0561, time: "11:00", imageUrl: img("khamlia") },
          { id: "sa-3-3", kind: "viewpoint", name: "Dune bivouac, starlit dinner", lng: -3.9800, lat: 31.1020, time: "20:00", imageUrl: img("dune-bivouac") },
        ],
      },
      {
        dayNumber: 4,
        date: "Oct 06",
        title: "Out via Errachidia",
        steps: [
          { id: "sa-4-1", kind: "transport", name: "Drive to Errachidia", lng: -4.4240, lat: 31.9314, time: "09:00", imageUrl: img("errachidia-drive") },
          { id: "sa-4-2", kind: "airport", name: "Moulay Ali Cherif (ERH)", lng: -4.3983, lat: 31.9475, time: "13:00", imageUrl: img("erh") },
        ],
      },
    ],
  },
  {
    id: "maldives-atolls",
    title: "Maldives: North Malé Atoll",
    subtitle: "Four slow days over turquoise water",
    guideNote: "The house reef is the whole point — snorkel it at slack tide, early, before the boats stir the sand. Don't over-plan; the Maldives rewards doing almost nothing, beautifully.",
    author: { name: "Aisha Naseem", avatarUrl: avatar("aisha") },
    coverImageUrl: img("maldives-cover", 1200, 800),
    startLng: 73.4000,
    startLat: 4.3000,
    durationDays: 4,
    days: [
      {
        dayNumber: 1,
        date: "Feb 12",
        title: "Seaplane in",
        steps: [
          { id: "md-1-1", kind: "airport", name: "Velana Intl Airport (MLE)", lng: 73.5286, lat: 4.1918, time: "12:00", imageUrl: img("male-airport") },
          { id: "md-1-2", kind: "transport", name: "Seaplane transfer", lng: 73.5290, lat: 4.2200, time: "13:30", imageUrl: img("seaplane"), notes: "20 minutes over the atolls." },
          { id: "md-1-3", kind: "hotel", name: "Overwater villa", lng: 73.4000, lat: 4.3000, time: "14:30", imageUrl: img("overwater-villa") },
        ],
      },
      {
        dayNumber: 2,
        date: "Feb 13",
        title: "Reef & sandbank",
        steps: [
          { id: "md-2-1", kind: "activity", name: "House reef snorkel", lng: 73.4010, lat: 4.3010, time: "08:00", imageUrl: img("house-reef") },
          { id: "md-2-2", kind: "viewpoint", name: "Sandbank picnic", lng: 73.3800, lat: 4.3200, time: "12:00", imageUrl: img("sandbank") },
          { id: "md-2-3", kind: "activity", name: "Sunset dolphin cruise", lng: 73.4100, lat: 4.2900, time: "17:30", imageUrl: img("dolphin-cruise") },
        ],
      },
      {
        dayNumber: 3,
        date: "Feb 14",
        title: "Spa & manta point",
        steps: [
          { id: "md-3-1", kind: "activity", name: "Overwater spa pavilion", lng: 73.4005, lat: 4.3005, time: "10:00", imageUrl: img("overwater-spa") },
          { id: "md-3-2", kind: "activity", name: "Manta Point dive", lng: 73.3500, lat: 4.3500, time: "14:00", imageUrl: img("manta-point") },
          { id: "md-3-3", kind: "restaurant", name: "Beach dinner under lanterns", lng: 73.4000, lat: 4.2995, time: "20:00", imageUrl: img("beach-dinner") },
        ],
      },
      {
        dayNumber: 4,
        date: "Feb 15",
        title: "Back to Malé",
        steps: [
          { id: "md-4-1", kind: "transport", name: "Seaplane to Malé", lng: 73.5290, lat: 4.2200, time: "11:00", imageUrl: img("seaplane-out") },
          { id: "md-4-2", kind: "airport", name: "Velana Intl Airport (MLE)", lng: 73.5286, lat: 4.1918, time: "13:00", imageUrl: img("male-out") },
        ],
      },
    ],
  },
  {
    id: "norway-fjords",
    title: "Norway: Bergen & the Fjords",
    subtitle: "Four days of rail, water, and granite",
    guideNote: "The Flåm Railway and the Nærøyfjord cruise are the headline, but Stegastein at golden hour is the shot you'll remember. Sit on the left of the train out of Myrdal.",
    author: { name: "Ingrid Halvorsen", avatarUrl: avatar("ingrid") },
    coverImageUrl: img("norway-cover", 1200, 800),
    startLng: 5.3221,
    startLat: 60.3975,
    durationDays: 4,
    days: [
      {
        dayNumber: 1,
        date: "Jun 20",
        title: "Bergen",
        steps: [
          { id: "nf-1-1", kind: "airport", name: "Bergen Airport Flesland (BGO)", lng: 5.2181, lat: 60.2934, time: "10:00", imageUrl: img("bergen-airport") },
          { id: "nf-1-2", kind: "hotel", name: "Hotel on Bryggen wharf", lng: 5.3221, lat: 60.3975, time: "12:00", imageUrl: img("bryggen-hotel") },
          { id: "nf-1-3", kind: "viewpoint", name: "Mount Fløyen funicular", lng: 5.3300, lat: 60.3937, time: "15:00", imageUrl: img("floyen") },
        ],
      },
      {
        dayNumber: 2,
        date: "Jun 21",
        title: "Rail to the fjord",
        steps: [
          { id: "nf-2-1", kind: "transport", name: "Bergen Railway to Voss", lng: 6.4154, lat: 60.6296, time: "08:30", imageUrl: img("bergen-railway") },
          { id: "nf-2-2", kind: "transport", name: "Bus to Gudvangen", lng: 6.8392, lat: 60.8717, time: "10:30", imageUrl: img("gudvangen-bus") },
          { id: "nf-2-3", kind: "viewpoint", name: "Nærøyfjord cruise", lng: 7.0000, lat: 60.9000, time: "12:00", imageUrl: img("naroyfjord"), notes: "UNESCO fjord, cliffs straight out of the water." },
          { id: "nf-2-4", kind: "hotel", name: "Fretheim Hotel, Flåm", lng: 7.1136, lat: 60.8625, time: "16:00", imageUrl: img("fretheim") },
        ],
      },
      {
        dayNumber: 3,
        date: "Jun 22",
        title: "Flåm Railway",
        steps: [
          { id: "nf-3-1", kind: "activity", name: "Flåm Railway to Myrdal", lng: 7.1242, lat: 60.7314, time: "09:00", imageUrl: img("flam-railway") },
          { id: "nf-3-2", kind: "viewpoint", name: "Stegastein viewpoint", lng: 7.2106, lat: 60.9075, time: "14:00", imageUrl: img("stegastein") },
          { id: "nf-3-3", kind: "restaurant", name: "Ægir Brewpub, Flåm", lng: 7.1140, lat: 60.8628, time: "19:00", imageUrl: img("aegir") },
        ],
      },
      {
        dayNumber: 4,
        date: "Jun 23",
        title: "Back to Bergen",
        steps: [
          { id: "nf-4-1", kind: "transport", name: "Return rail to Bergen", lng: 5.3330, lat: 60.3900, time: "09:00", imageUrl: img("return-rail") },
          { id: "nf-4-2", kind: "airport", name: "Bergen Airport Flesland (BGO)", lng: 5.2181, lat: 60.2934, time: "16:00", imageUrl: img("bergen-out") },
        ],
      },
    ],
  },
  {
    id: "queenstown-nz",
    title: "Queenstown & Fiordland",
    subtitle: "Four big days in New Zealand's south",
    guideNote: "Milford Sound is worth the long day — leave at dawn and the Mirror Lakes will be glass. Save a night for Queenstown itself; the lakefront bars are half the trip.",
    author: { name: "Liam Patel", avatarUrl: avatar("liam-nz") },
    coverImageUrl: img("queenstown-cover", 1200, 800),
    startLng: 168.6626,
    startLat: -45.0312,
    durationDays: 4,
    days: [
      {
        dayNumber: 1,
        date: "Mar 07",
        title: "Queenstown",
        steps: [
          { id: "qt-1-1", kind: "airport", name: "Queenstown Airport (ZQN)", lng: 168.7392, lat: -45.0211, time: "11:00", imageUrl: img("zqn") },
          { id: "qt-1-2", kind: "hotel", name: "Hotel on Lake Wakatipu", lng: 168.6626, lat: -45.0312, time: "13:00", imageUrl: img("wakatipu-hotel") },
          { id: "qt-1-3", kind: "viewpoint", name: "Skyline Gondola, Bob's Peak", lng: 168.6536, lat: -45.0286, time: "16:00", imageUrl: img("skyline-gondola") },
        ],
      },
      {
        dayNumber: 2,
        date: "Mar 08",
        title: "Glenorchy & Routeburn",
        steps: [
          { id: "qt-2-1", kind: "viewpoint", name: "Glenorchy scenic road", lng: 168.3839, lat: -44.8500, time: "08:30", imageUrl: img("glenorchy") },
          { id: "qt-2-2", kind: "activity", name: "Routeburn Track start", lng: 168.1700, lat: -44.7350, time: "10:30", imageUrl: img("routeburn"), notes: "Day-hike to Routeburn Flats." },
          { id: "qt-2-3", kind: "restaurant", name: "Glenorchy lakeside lunch", lng: 168.3850, lat: -44.8510, time: "14:00", imageUrl: img("glenorchy-lunch") },
        ],
      },
      {
        dayNumber: 3,
        date: "Mar 09",
        title: "Milford Sound",
        steps: [
          { id: "qt-3-1", kind: "viewpoint", name: "Mirror Lakes", lng: 168.0167, lat: -45.2333, time: "08:00", imageUrl: img("mirror-lakes") },
          { id: "qt-3-2", kind: "activity", name: "Milford Sound cruise", lng: 167.9255, lat: -44.6414, time: "11:30", imageUrl: img("milford-sound"), notes: "Mitre Peak and Stirling Falls." },
          { id: "qt-3-3", kind: "hotel", name: "Te Anau overnight", lng: 167.7167, lat: -45.4167, time: "18:00", imageUrl: img("te-anau") },
        ],
      },
      {
        dayNumber: 4,
        date: "Mar 10",
        title: "Arrowtown & out",
        steps: [
          { id: "qt-4-1", kind: "activity", name: "Shotover Jet", lng: 168.7000, lat: -45.0167, time: "09:30", imageUrl: img("shotover-jet") },
          { id: "qt-4-2", kind: "activity", name: "Historic Arrowtown", lng: 168.8333, lat: -44.9417, time: "12:00", imageUrl: img("arrowtown") },
          { id: "qt-4-3", kind: "airport", name: "Queenstown Airport (ZQN)", lng: 168.7392, lat: -45.0211, time: "17:00", imageUrl: img("zqn-out") },
        ],
      },
    ],
  },
  {
    id: "lisbon-fado",
    title: "Lisbon: Fado & Tiles",
    subtitle: "Four days of miradouros, azulejos, and saudade",
    guideNote: "Lisbon is a city of hills and weather that turns fast — keep an indoor backup in your pocket for every afternoon. The tiles and the fado are the soul of the place; don't rush either.",
    author: { name: "Beatriz Costa", avatarUrl: avatar("beatriz") },
    coverImageUrl: img("lisbon-cover", 1200, 800),
    startLng: -9.1300,
    startLat: 38.7128,
    durationDays: 4,
    days: [
      {
        dayNumber: 1,
        date: "May 14",
        title: "Baixa & Chiado",
        steps: [
          { id: "li-1-1", kind: "airport", name: "Humberto Delgado Airport (LIS)", lng: -9.1342, lat: 38.7742, time: "10:30", imageUrl: img("lis"), notes: "Metro red line straight into the centre." },
          { id: "li-1-2", kind: "hotel", name: "Hotel in Chiado", lng: -9.1422, lat: 38.7103, time: "12:30", imageUrl: img("chiado-hotel") },
          { id: "li-1-3", kind: "activity", name: "Praça do Comércio & Rua Augusta", lng: -9.1366, lat: 38.7079, time: "15:00", imageUrl: img("praca-comercio") },
          { id: "li-1-4", kind: "viewpoint", name: "Elevador de Santa Justa", lng: -9.1393, lat: 38.7120, time: "17:30", imageUrl: img("santa-justa") },
        ],
      },
      {
        dayNumber: 2,
        date: "May 15",
        title: "Belém",
        steps: [
          { id: "li-2-1", kind: "activity", name: "Jerónimos Monastery", lng: -9.2065, lat: 38.6979, time: "09:30", imageUrl: img("jeronimos") },
          { id: "li-2-2", kind: "viewpoint", name: "Belém Tower", lng: -9.2160, lat: 38.6916, time: "11:30", imageUrl: img("belem-tower") },
          { id: "li-2-3", kind: "restaurant", name: "Pastéis de Belém", lng: -9.2032, lat: 38.6975, time: "13:00", imageUrl: img("pasteis-belem"), notes: "The original custard tarts, warm." },
          { id: "li-2-4", kind: "activity", name: "MAAT museum", lng: -9.1939, lat: 38.6961, time: "15:30", imageUrl: img("maat") },
        ],
      },
      {
        dayNumber: 3,
        date: "May 16",
        title: "Alfama & Fado",
        steps: [
          { id: "li-3-1", kind: "activity", name: "São Jorge Castle", lng: -9.1334, lat: 38.7139, time: "10:30", imageUrl: img("sao-jorge") },
          { id: "li-3-2", kind: "restaurant", name: "Lunch in Mouraria", lng: -9.1320, lat: 38.7165, time: "13:00", imageUrl: img("mouraria-lunch") },
          { id: "li-3-3", kind: "viewpoint", name: "Alfama & miradouros walking tour", lng: -9.1300, lat: 38.7196, time: "14:00", imageUrl: img("alfama-walk"), notes: "Senhora do Monte, Graça, and the tangle of Alfama lanes." },
          { id: "li-3-4", kind: "restaurant", name: "Fado dinner, Alfama", lng: -9.1450, lat: 38.7140, time: "20:00", imageUrl: img("fado-dinner"), notes: "Reservation — traditional fado vadio." },
        ],
      },
      {
        dayNumber: 4,
        date: "May 17",
        title: "Sintra day & out",
        steps: [
          { id: "li-4-1", kind: "transport", name: "Train to Sintra", lng: -9.3858, lat: 38.7997, time: "09:00", imageUrl: img("sintra-train") },
          { id: "li-4-2", kind: "viewpoint", name: "Pena Palace", lng: -9.3907, lat: 38.7876, time: "10:30", imageUrl: img("pena-palace") },
          { id: "li-4-3", kind: "airport", name: "Humberto Delgado Airport (LIS)", lng: -9.1342, lat: 38.7742, time: "18:00", imageUrl: img("lis-out") },
        ],
      },
    ],
  },
];

const TAG_MAP: Record<string, TripTags> = {
  "tokyo-spring": {
    vibes: ["cities"],
    interests: ["food", "museums", "architecture", "nightlife", "photography"],
    budget: "midrange",
    pace: "balanced",
    suggestedFor: ["solo", "couple", "friends"],
  },
  "paris-classic": {
    vibes: ["cities"],
    interests: ["museums", "architecture", "food", "photography"],
    budget: "luxury",
    pace: "balanced",
    suggestedFor: ["solo", "couple"],
  },
  "rome-eternal": {
    vibes: ["cities"],
    interests: ["museums", "architecture", "photography", "food"],
    budget: "midrange",
    pace: "balanced",
    suggestedFor: ["solo", "couple", "family"],
  },
  "nyc-three-days": {
    vibes: ["cities"],
    interests: ["food", "museums", "nightlife", "architecture"],
    budget: "midrange",
    pace: "packed",
    suggestedFor: ["solo", "couple", "friends"],
  },
  "cape-town-summit": {
    vibes: ["mountains", "beach"],
    interests: ["wildlife", "food", "photography", "hiking"],
    budget: "luxury",
    pace: "balanced",
    suggestedFor: ["couple", "family", "friends"],
  },
  "iceland-golden-circle": {
    vibes: ["mountains", "countryside"],
    interests: ["photography", "wellness", "hiking"],
    budget: "luxury",
    pace: "relaxed",
    suggestedFor: ["solo", "couple"],
  },
  "bali-ubud": {
    vibes: ["tropical", "islands", "beach", "mountains"],
    interests: ["wellness", "food", "hiking", "photography"],
    budget: "midrange",
    pace: "relaxed",
    suggestedFor: ["solo", "couple", "friends"],
  },
  "marrakech-medina": {
    vibes: ["cities", "deserts"],
    interests: ["architecture", "food", "photography"],
    budget: "midrange",
    pace: "balanced",
    suggestedFor: ["solo", "couple", "friends"],
  },
  "buenos-aires-tango": {
    vibes: ["cities"],
    interests: ["food", "nightlife", "museums", "photography"],
    budget: "midrange",
    pace: "packed",
    suggestedFor: ["solo", "couple", "friends"],
  },
  "sydney-harbour": {
    vibes: ["cities", "beach"],
    interests: ["food", "photography", "wildlife"],
    budget: "luxury",
    pace: "balanced",
    suggestedFor: ["couple", "family", "friends"],
  },
  "patagonia-w-trek": {
    vibes: ["mountains", "countryside", "forests"],
    interests: ["hiking", "wildlife", "photography"],
    budget: "midrange",
    pace: "packed",
    suggestedFor: ["solo", "couple", "friends"],
  },
  "kyoto-temples": {
    vibes: ["cities", "countryside"],
    interests: ["architecture", "museums", "wellness", "food"],
    budget: "midrange",
    pace: "balanced",
    suggestedFor: ["solo", "couple", "family"],
  },
  "sahara-merzouga": {
    vibes: ["deserts", "countryside"],
    interests: ["photography", "wildlife", "food"],
    budget: "midrange",
    pace: "relaxed",
    suggestedFor: ["couple", "friends", "family"],
  },
  "maldives-atolls": {
    vibes: ["islands", "beach", "tropical"],
    interests: ["wellness", "wildlife", "photography"],
    budget: "luxury",
    pace: "relaxed",
    suggestedFor: ["couple", "family"],
  },
  "norway-fjords": {
    vibes: ["mountains", "countryside", "forests"],
    interests: ["photography", "wellness", "hiking"],
    budget: "luxury",
    pace: "balanced",
    suggestedFor: ["couple", "solo", "family"],
  },
  "queenstown-nz": {
    vibes: ["mountains", "countryside", "forests"],
    interests: ["hiking", "wildlife", "nightlife", "photography"],
    budget: "midrange",
    pace: "packed",
    suggestedFor: ["friends", "couple", "solo"],
  },
  "lisbon-fado": {
    vibes: ["cities"],
    interests: ["food", "architecture", "nightlife", "photography"],
    budget: "midrange",
    pace: "balanced",
    suggestedFor: ["solo", "couple", "friends"],
  },
};

export const trips: Trip[] = rawTrips.map((t) => ({
  ...t,
  tags: TAG_MAP[t.id],
}));

export function getTripById(id: string): Trip | undefined {
  return trips.find((t) => t.id === id);
}

export function matchesProfile(trip: Trip, profile: Profile | null): boolean {
  if (!profile || !trip.tags) return true;

  if (profile.vibes.length > 0) {
    const overlap = trip.tags.vibes.some((v) => profile.vibes.includes(v));
    if (!overlap) return false;
  }

  if (profile.interests.length > 0) {
    const overlap = trip.tags.interests.some((i) =>
      profile.interests.includes(i)
    );
    if (!overlap) return false;
  }

  if (
    profile.travelStyle &&
    !trip.tags.suggestedFor.includes(profile.travelStyle)
  ) {
    return false;
  }

  return true;
}

export function scoreTrip(trip: Trip, profile: Profile): number {
  if (!trip.tags) return 0;
  let score = 0;
  for (const v of profile.vibes)
    if (trip.tags.vibes.includes(v)) score += 2;
  for (const i of profile.interests)
    if (trip.tags.interests.includes(i)) score += 2;
  if (profile.travelStyle && trip.tags.suggestedFor.includes(profile.travelStyle))
    score += 3;
  if (profile.budget && trip.tags.budget === profile.budget) score += 1;
  if (profile.pace && trip.tags.pace === profile.pace) score += 1;
  return score;
}

export function filterTripsByProfile(
  source: Trip[],
  profile: Profile | null
): Trip[] {
  if (!profile) return source;

  const strict = source.filter((t) => matchesProfile(t, profile));
  if (strict.length > 0) {
    // Best matches first, but keep every strict match.
    return [...strict].sort(
      (a, b) => scoreTrip(b, profile) - scoreTrip(a, profile)
    );
  }

  // Nothing passes the strict filter — never show an empty globe.
  // Fall back to the closest matches by score so any filter
  // combination still surfaces at least one destination.
  const ranked = [...source]
    .map((t) => ({ t, s: scoreTrip(t, profile) }))
    .sort((a, b) => b.s - a.s);

  const best = ranked[0]?.s ?? 0;
  if (best <= 0) {
    // No overlap at all (rare) — show a small curated handful.
    return ranked.slice(0, 3).map((r) => r.t);
  }
  // Everything sharing the top score, capped so it stays focused.
  return ranked
    .filter((r) => r.s >= Math.max(1, best - 2))
    .slice(0, 5)
    .map((r) => r.t);
}
