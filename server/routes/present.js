export function presentTicket(store, ticket) {
  const event = store.findEvent(ticket.eventId);
  const tier = event?.tiers.find((t) => t.id === ticket.tierId);
  return {
    ...ticket,
    tierName: tier?.name ?? 'Ticket',
    event: event
      ? { id: event.id, title: event.title, startsAt: event.startsAt, venue: event.venue, city: event.city }
      : null,
  };
}
