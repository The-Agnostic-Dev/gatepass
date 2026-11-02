const DAY = 24 * 60 * 60 * 1000;

function at(daysFromToday, hour, minute = 0) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return new Date(d.getTime() + daysFromToday * DAY).toISOString();
}

const events = [
  {
    id: 'afrobeats-in-the-park',
    title: 'Afrobeats in the Park',
    category: 'music',
    city: 'Lagos',
    venue: 'Muri Okunola Park, Victoria Island',
    startsAt: at(3, 16),
    organiser: 'Sound Republic',
    description:
      'An afternoon-into-night open air concert with six live acts, food trucks and a silent disco tent. Gates open two hours before the first act.',
    tiers: [
      { id: 'aitp-regular', name: 'Regular', price: 5000, capacity: 300, sold: 0 },
      { id: 'aitp-vip', name: 'VIP', price: 25000, capacity: 50, sold: 0 },
    ],
  },
  {
    id: 'lagos-jazz-night',
    title: 'Lagos Jazz Night',
    category: 'music',
    city: 'Lagos',
    venue: 'Terra Kulture, Victoria Island',
    startsAt: at(5, 19),
    organiser: 'Blue Note Collective',
    description: 'Two sets of live jazz from the Blue Note Collective quartet with special guests. Small plates available at the bar.',
    tiers: [
      { id: 'ljn-standard', name: 'Standard', price: 8000, capacity: 150, sold: 0 },
      { id: 'ljn-premium', name: 'Premium seating', price: 15000, capacity: 40, sold: 0 },
    ],
  },
  {
    id: 'acoustic-rooftop-sessions',
    title: 'Acoustic Rooftop Sessions',
    category: 'music',
    city: 'Lagos',
    venue: 'The Rooftop, Ikoyi',
    startsAt: at(6, 18),
    organiser: 'Sound Republic',
    description: 'Stripped back sets from three singer-songwriters under the stars. Very limited capacity.',
    tiers: [
      { id: 'ars-general', name: 'General', price: 6000, capacity: 80, sold: 0 },
      { id: 'ars-backstage', name: 'Backstage pass', price: 9000, capacity: 20, sold: 16 },
    ],
  },
  {
    id: 'devfest-lagos',
    title: 'DevFest Lagos',
    category: 'tech',
    city: 'Lagos',
    venue: 'Landmark Event Centre, Oniru',
    startsAt: at(8, 9),
    organiser: 'GDG Lagos',
    description: 'A full day of talks and workshops on web, mobile, cloud and AI from community speakers.',
    tiers: [
      { id: 'dfl-community', name: 'Community', price: 0, capacity: 500, sold: 210 },
      { id: 'dfl-supporter', name: 'Supporter', price: 10000, capacity: 100, sold: 12 },
    ],
  },
  {
    id: 'abuja-food-festival',
    title: 'Abuja Food Festival',
    category: 'food',
    city: 'Abuja',
    venue: 'Millennium Park, Maitama',
    startsAt: at(10, 11),
    organiser: 'Taste of Naija',
    description: 'Over forty vendors, a jollof cook-off and live cooking demos for the whole family.',
    tiers: [
      { id: 'aff-day', name: 'Day pass', price: 3000, capacity: 400, sold: 95 },
      { id: 'aff-weekend', name: 'Weekend pass', price: 5000, capacity: 200, sold: 40 },
    ],
  },
  {
    id: 'product-people-meetup',
    title: 'Product People Meetup',
    category: 'tech',
    city: 'Abuja',
    venue: 'Ventures Park, Maitama',
    startsAt: at(12, 17, 30),
    organiser: 'Product Abuja',
    description: 'Lightning talks from product managers and designers, followed by networking.',
    tiers: [{ id: 'ppm-rsvp', name: 'RSVP', price: 0, capacity: 120, sold: 64 }],
  },
  {
    id: 'garden-city-art-fair',
    title: 'Garden City Art Fair',
    category: 'arts',
    city: 'Port Harcourt',
    venue: 'Port Harcourt Pleasure Park',
    startsAt: at(14, 10),
    organiser: 'Rivers Creative Hub',
    description: 'Painting, sculpture and photography from emerging artists across the south-south.',
    tiers: [
      { id: 'gcaf-entry', name: 'Entry', price: 2000, capacity: 600, sold: 120 },
      { id: 'gcaf-collector', name: 'Collector preview', price: 12000, capacity: 60, sold: 9 },
    ],
  },
  {
    id: 'ibadan-half-marathon',
    title: 'Ibadan Half Marathon',
    category: 'sports',
    city: 'Ibadan',
    venue: 'Liberty Stadium',
    startsAt: at(16, 6),
    organiser: 'Run Ibadan',
    description: 'A 21 km road race through the city. Bib, medal and finisher shirt included.',
    tiers: [
      { id: 'ihm-runner', name: 'Runner', price: 7500, capacity: 1000, sold: 430 },
      { id: 'ihm-team', name: 'Corporate team slot', price: 50000, capacity: 30, sold: 4 },
    ],
  },
  {
    id: 'naija-comedy-live',
    title: 'Naija Comedy Live',
    category: 'arts',
    city: 'Lagos',
    venue: 'Eko Hotel Convention Centre',
    startsAt: at(18, 19),
    organiser: 'Laugh Factory NG',
    description: 'Four headline comedians, one long night. Strictly 18 and over.',
    tiers: [
      { id: 'ncl-regular', name: 'Regular', price: 10000, capacity: 800, sold: 350 },
      { id: 'ncl-table', name: 'Table of 6', price: 150000, capacity: 25, sold: 11 },
    ],
  },
  {
    id: 'enugu-coal-city-run',
    title: 'Coal City 10K',
    category: 'sports',
    city: 'Enugu',
    venue: 'Michael Okpara Square',
    startsAt: at(20, 6, 30),
    organiser: 'Enugu Runners Club',
    description: 'A friendly 10 km fun run with water stations every 2 km.',
    tiers: [{ id: 'ecr-entry', name: 'Entry', price: 4000, capacity: 500, sold: 180 }],
  },
  {
    id: 'women-in-fintech-summit',
    title: 'Women in Fintech Summit',
    category: 'tech',
    city: 'Lagos',
    venue: 'Civic Centre, Victoria Island',
    startsAt: at(23, 9),
    organiser: 'FinHer Africa',
    description: 'Panels, workshops and mentoring sessions for women building in financial technology.',
    tiers: [
      { id: 'wifs-delegate', name: 'Delegate', price: 20000, capacity: 300, sold: 140 },
      { id: 'wifs-student', name: 'Student', price: 5000, capacity: 100, sold: 52 },
    ],
  },
  {
    id: 'street-food-friday',
    title: 'Street Food Friday',
    category: 'food',
    city: 'Port Harcourt',
    venue: 'Rumuola Road Food Court',
    startsAt: at(26, 17),
    organiser: 'Taste of Naija',
    description: 'Suya, boli, roasted corn and more from the best street vendors in town.',
    tiers: [{ id: 'sff-entry', name: 'Entry', price: 1500, capacity: 350, sold: 77 }],
  },
  {
    id: 'highlife-heritage-concert',
    title: 'Highlife Heritage Concert',
    category: 'music',
    city: 'Enugu',
    venue: 'Nike Lake Resort',
    startsAt: at(30, 18),
    organiser: 'Eastern Sounds',
    description: 'A celebration of classic highlife with a twelve-piece band.',
    tiers: [
      { id: 'hhc-regular', name: 'Regular', price: 7000, capacity: 250, sold: 30 },
      { id: 'hhc-vip', name: 'VIP', price: 20000, capacity: 40, sold: 6 },
    ],
  },
  {
    id: 'photowalk-ibadan',
    title: 'Photowalk: Old Ibadan',
    category: 'arts',
    city: 'Ibadan',
    venue: 'Mapo Hall',
    startsAt: at(34, 8),
    organiser: 'Lens Collective',
    description: 'A guided photography walk through the oldest parts of the city. Bring any camera.',
    tiers: [{ id: 'poi-walker', name: 'Walker', price: 2500, capacity: 40, sold: 18 }],
  },
  {
    id: 'founders-breakfast',
    title: 'Founders Breakfast',
    category: 'tech',
    city: 'Lagos',
    venue: 'Co-Creation Hub, Yaba',
    startsAt: at(-4, 8),
    organiser: 'CcHUB',
    description: 'Monthly breakfast for early-stage founders.',
    tiers: [{ id: 'fb-seat', name: 'Seat', price: 0, capacity: 60, sold: 0 }],
  },
];

const people = [
  ['Ada Obi', 'ada.obi@example.com'],
  ['Tunde Bakare', 'tunde.bakare@example.com'],
  ['Chiamaka Eze', 'chiamaka.eze@example.com'],
  ['Musa Abdullahi', 'musa.abdullahi@example.com'],
  ['Funke Adeyemi', 'funke.adeyemi@example.com'],
  ['Emeka Nwosu', 'emeka.nwosu@example.com'],
  ['Halima Yusuf', 'halima.yusuf@example.com'],
  ['Kelechi Okafor', 'kelechi.okafor@example.com'],
  ['Bisi Alade', 'bisi.alade@example.com'],
  ['Ifeanyi Obi', 'ifeanyi.obi@example.com'],
];

// [eventId, tierId, personIndex, guests, checkedIn]
const bookings = [
  ['afrobeats-in-the-park', 'aitp-regular', 0, 1, false],
  ['afrobeats-in-the-park', 'aitp-regular', 1, 0, true],
  ['afrobeats-in-the-park', 'aitp-vip', 2, 2, true],
  ['afrobeats-in-the-park', 'aitp-regular', 3, 0, false],
  ['afrobeats-in-the-park', 'aitp-regular', 4, 3, false],
  ['afrobeats-in-the-park', 'aitp-vip', 5, 1, false],
  ['afrobeats-in-the-park', 'aitp-regular', 6, 0, false],
  ['afrobeats-in-the-park', 'aitp-regular', 7, 2, false],
  ['afrobeats-in-the-park', 'aitp-regular', 8, 0, false],
  ['lagos-jazz-night', 'ljn-standard', 0, 0, false],
  ['lagos-jazz-night', 'ljn-premium', 9, 1, false],
  ['lagos-jazz-night', 'ljn-standard', 3, 1, false],
  ['devfest-lagos', 'dfl-supporter', 0, 0, false],
  ['abuja-food-festival', 'aff-weekend', 6, 2, false],
  ['naija-comedy-live', 'ncl-regular', 1, 1, false],
];

const promos = [
  { code: 'GATEPASS10', kind: 'percent', amount: 10, expiresAt: at(60, 23, 59), description: '10% off any ticket' },
  { code: 'EARLYBIRD', kind: 'percent', amount: 20, expiresAt: at(-3, 23, 59), description: 'Early bird 20% off' },
  { code: 'NAIJA2K', kind: 'fixed', amount: 2000, expiresAt: null, description: 'N2,000 off your order' },
  { code: 'JAZZLOVER', kind: 'percent', amount: 15, eventId: 'lagos-jazz-night', expiresAt: at(30, 23, 59), description: '15% off Lagos Jazz Night' },
];

export function seed() {
  const data = {
    events: structuredClone(events),
    promos: structuredClone(promos),
    tickets: [],
    nextTicketNumber: 1001,
  };

  for (const [eventId, tierId, personIndex, guests, checkedIn] of bookings) {
    const event = data.events.find((e) => e.id === eventId);
    const tier = event.tiers.find((t) => t.id === tierId);
    const [name, email] = people[personIndex];
    const quantity = 1 + guests;
    const number = data.nextTicketNumber++;
    tier.sold += quantity;
    data.tickets.push({
      id: `t${number}`,
      ref: `GP-${number}`,
      eventId,
      tierId,
      name,
      email,
      guests,
      quantity,
      unitPrice: tier.price,
      promoCode: null,
      subtotal: tier.price * quantity,
      discount: 0,
      total: tier.price * quantity,
      createdAt: at(-2, 12),
      checkedInAt: checkedIn ? new Date().toISOString() : null,
    });
  }

  // Box office and partner sales that are not tracked as individual tickets.
  const extraSold = { 'aitp-regular': 120, 'aitp-vip': 14, 'ljn-standard': 55, 'ljn-premium': 8, 'ars-general': 31 };
  for (const event of data.events) {
    for (const tier of event.tiers) tier.sold += extraSold[tier.id] ?? 0;
  }

  return data;
}
