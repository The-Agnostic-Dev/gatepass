import { seed } from './seed.js';

export function createStore() {
  const data = seed();

  return {
    events: data.events,
    promos: data.promos,
    tickets: data.tickets,
    nextTicketNumber: data.nextTicketNumber,

    findEvent(id) {
      return this.events.find((e) => e.id === id);
    },

    findTicket(id) {
      return this.tickets.find((t) => t.id === id);
    },

    nextRef() {
      const number = this.nextTicketNumber++;
      return { id: `t${number}`, ref: `GP-${number}` };
    },
  };
}

export function remaining(tier) {
  return Math.max(0, tier.capacity - tier.sold);
}

export function eventSummary(event) {
  return {
    id: event.id,
    title: event.title,
    category: event.category,
    city: event.city,
    venue: event.venue,
    startsAt: event.startsAt,
    organiser: event.organiser,
    tiers: event.tiers.map((t) => ({ id: t.id, name: t.name, price: t.price, remaining: remaining(t) })),
  };
}

export function eventDetail(event) {
  return {
    ...eventSummary(event),
    description: event.description,
    tiers: event.tiers.map((t) => ({ ...t, remaining: remaining(t) })),
  };
}
