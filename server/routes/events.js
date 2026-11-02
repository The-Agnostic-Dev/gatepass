import { Router } from 'express';
import { eventDetail, eventSummary } from '../store.js';

const DEFAULT_PAGE_SIZE = 6;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function isUpcoming(event, now = Date.now()) {
  return new Date(event.startsAt).getTime() >= now;
}

export function eventsRouter(store) {
  const router = Router();

  router.get('/meta', (_req, res) => {
    const upcoming = store.events.filter((e) => isUpcoming(e));
    res.json({
      categories: [...new Set(upcoming.map((e) => e.category))].sort(),
      cities: [...new Set(upcoming.map((e) => e.city))].sort(),
    });
  });

  router.get('/events', (req, res) => {
    const term = String(req.query.q ?? '').trim();
    const category = String(req.query.category ?? '');
    const city = String(req.query.city ?? '');
    const pageSize = clamp(Number(req.query.pageSize) || DEFAULT_PAGE_SIZE, 1, 50);

    let events = store.events.filter((e) => isUpcoming(e));
    if (category) events = events.filter((e) => e.category === category);
    if (city) events = events.filter((e) => e.city === city);
    if (term) {
      events = events.filter(
        (e) => e.title.includes(term) || e.venue.includes(term) || e.organiser.includes(term),
      );
    }
    events.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

    const total = events.length;
    const totalPages = Math.max(1, Math.floor(total / pageSize));
    const page = clamp(Number(req.query.page) || 1, 1, totalPages);
    const start = (page - 1) * pageSize;

    res.json({
      items: events.slice(start, start + pageSize).map(eventSummary),
      page,
      pageSize,
      total,
      totalPages,
    });
  });

  router.get('/events/:id', (req, res) => {
    const event = store.findEvent(req.params.id);
    if (!event) return res.status(404).json({ message: 'We could not find that event.' });
    res.json(eventDetail(event));
  });

  return router;
}
