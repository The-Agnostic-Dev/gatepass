import { Router } from 'express';
import { remaining } from '../store.js';
import { findPromo } from '../lib/promo.js';
import { priceOrder } from '../lib/pricing.js';
import { parseGuests, validateRsvp } from '../lib/validation.js';
import { sendConfirmation } from '../lib/mailer.js';
import { presentTicket } from './present.js';

function availabilityMessage(tier) {
  const left = remaining(tier);
  return left === 0 ? `${tier.name} tickets are sold out.` : `Only ${left} ${tier.name} tickets are left.`;
}

export function ticketsRouter(store) {
  const router = Router();

  router.post('/promos/check', (req, res) => {
    const promo = findPromo(store.promos, req.body?.code, req.body?.eventId);
    if (!promo) return res.status(422).json({ message: 'Please enter a promo code.' });
    res.json({ code: promo.code, kind: promo.kind, amount: promo.amount, description: promo.description });
  });

  router.post('/events/:id/rsvp', async (req, res) => {
    const event = store.findEvent(req.params.id);
    if (!event) return res.status(404).json({ message: 'We could not find that event.' });
    if (new Date(event.startsAt).getTime() < Date.now()) {
      return res.status(422).json({ message: 'This event has already taken place.' });
    }

    const { errors, value } = validateRsvp(req.body ?? {});
    const tier = event.tiers.find((t) => t.id === value.tierId);
    if (value.tierId && !tier) errors.tierId = 'Please choose a ticket type.';
    if (Object.keys(errors).length) {
      return res.status(422).json({ message: 'Please check the highlighted fields.', errors });
    }

    const quantity = 1 + value.guests;
    if (remaining(tier) < quantity) {
      return res.status(409).json({ message: availabilityMessage(tier) });
    }

    const promo = findPromo(store.promos, value.promoCode, event.id);
    const ticket = {
      ...store.nextRef(),
      eventId: event.id,
      tierId: tier.id,
      name: value.name,
      email: value.email,
      guests: value.guests,
      quantity,
      unitPrice: tier.price,
      promoCode: promo?.code ?? null,
      ...priceOrder(tier.price, quantity, promo),
      createdAt: new Date().toISOString(),
      checkedInAt: null,
    };

    await sendConfirmation(ticket, event);
    tier.sold += quantity;
    store.tickets.push(ticket);

    res.status(201).json(presentTicket(store, ticket));
  });

  router.get('/tickets', (req, res) => {
    const email = String(req.query.email ?? '').trim().toLowerCase();
    if (!email) return res.json([]);
    const mine = store.tickets
      .filter((t) => t.email === email)
      .map((t) => presentTicket(store, t))
      .sort((a, b) => new Date(a.event?.startsAt) - new Date(b.event?.startsAt));
    res.json(mine);
  });

  router.patch('/tickets/:id', (req, res) => {
    const ticket = store.findTicket(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'We could not find that ticket.' });
    if (ticket.checkedInAt) {
      return res.status(409).json({ message: 'This ticket has already been used at the door.' });
    }

    const guests = parseGuests(req.body?.guests);
    if (guests === null) return res.status(422).json({ message: 'You can bring between 0 and 5 guests.' });

    const tier = store.findEvent(ticket.eventId).tiers.find((t) => t.id === ticket.tierId);
    const quantity = 1 + guests;
    const extra = quantity - ticket.quantity;
    if (extra > remaining(tier)) {
      return res.status(409).json({ message: availabilityMessage(tier) });
    }

    tier.sold += extra;
    ticket.guests = guests;
    ticket.quantity = quantity;

    res.json(presentTicket(store, ticket));
  });

  router.delete('/tickets/:id', (req, res) => {
    const index = store.tickets.findIndex((t) => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'We could not find that ticket.' });
    const [ticket] = store.tickets.splice(index, 1);
    const tier = store.findEvent(ticket.eventId).tiers.find((t) => t.id === ticket.tierId);
    tier.sold = Math.max(0, tier.sold - ticket.quantity);
    res.status(204).end();
  });

  return router;
}
