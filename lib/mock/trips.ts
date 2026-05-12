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

export function filterTripsByProfile(
  source: Trip[],
  profile: Profile | null
): Trip[] {
  if (!profile) return source;
  return source.filter((t) => matchesProfile(t, profile));
}
