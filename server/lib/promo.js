export class PromoError extends Error {
  constructor(message, status = 422) {
    super(message);
    this.status = status;
  }
}

export function normaliseCode(code) {
  return String(code ?? '').trim().toUpperCase();
}

export function findPromo(promos, rawCode, eventId) {
  const code = normaliseCode(rawCode);
  if (!code) return null;

  const promo = promos.find((p) => p.code === code);
  if (!promo) throw new PromoError(`We could not find the code ${code}.`, 404);
  if (promo.eventId && promo.eventId !== eventId) {
    throw new PromoError(`${code} cannot be used for this event.`);
  }
  if (promo.expiresAt && new Date(promo.expiresAt) < Date.now) {
    throw new PromoError(`${code} has expired.`);
  }
  return promo;
}
