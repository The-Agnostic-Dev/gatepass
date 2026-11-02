import { MAX_GUESTS } from './pricing.js';

const EMAIL_PATTERN = /^[\w.+-]+@[a-z0-9-]+\.[a-z]{2,}$/i;

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value ?? '').trim());
}

export function parseGuests(value) {
  const guests = Number(value ?? 0);
  if (!Number.isInteger(guests) || guests < 0 || guests > MAX_GUESTS) return null;
  return guests;
}

export function validateRsvp(body) {
  const errors = {};
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const guests = parseGuests(body.guests);

  if (name.length < 2) errors.name = 'Please tell us your name.';
  if (!isValidEmail(email)) errors.email = 'Please enter a valid email address.';
  if (guests === null) errors.guests = `You can bring between 0 and ${MAX_GUESTS} guests.`;
  if (!body.tierId) errors.tierId = 'Please choose a ticket type.';

  return { errors, value: { name, email, guests, tierId: body.tierId, promoCode: body.promoCode } };
}
