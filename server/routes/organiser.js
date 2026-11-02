import { Router } from 'express';
import { presentTicket } from './present.js';

export function organiserRouter(store) {
  const router = Router();

  router.get('/organiser/events', (_req, res) => {
    const rows = store.events
      .map((event) => {
        const tickets = store.tickets.filter((t) => t.eventId === event.id);
        return {
          id: event.id,
          title: event.title,
          startsAt: event.startsAt,
          city: event.city,
          ticketCount: tickets.length,
          headcount: tickets.reduce((sum, t) => sum + t.quantity, 0),
          checkedIn: tickets.filter((t) => t.checkedInAt).reduce((sum, t) => sum + t.quantity, 0),
          revenue: tickets.reduce((sum, t) => sum + t.total, 0),
        };
      })
      .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
    res.json(rows);
  });

  router.get('/organiser/events/:id/attendees', (req, res) => {
    const event = store.findEvent(req.params.id);
    if (!event) return res.status(404).json({ message: 'We could not find that event.' });
    const attendees = store.tickets
      .filter((t) => t.eventId === event.id)
      .map((t) => presentTicket(store, t))
      .sort((a, b) => a.name.localeCompare(b.name));
    res.json({ event: { id: event.id, title: event.title, startsAt: event.startsAt }, attendees });
  });

  router.post('/tickets/:id/check-in', (req, res) => {
    const ticket = store.findTicket(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'We could not find that ticket.' });
    ticket.checkedInAt ??= new Date().toISOString();
    res.json(presentTicket(store, ticket));
  });

  router.delete('/tickets/:id/check-in', (req, res) => {
    const ticket = store.findTicket(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'We could not find that ticket.' });
    ticket.checkedInAt = null;
    res.json(presentTicket(store, ticket));
  });

  return router;
}
