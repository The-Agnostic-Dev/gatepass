import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../app.js';

let server;
let baseUrl;

async function api(path, init = {}) {
  const res = await fetch(`${baseUrl}/api${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...init.headers },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

describe('events', () => {
  it('lists only upcoming events, soonest first', async () => {
    const { status, body } = await api('/events');
    assert.equal(status, 200);
    assert.equal(body.page, 1);
    assert.ok(body.items.length > 0);
    const times = body.items.map((e) => new Date(e.startsAt).getTime());
    assert.ok(times.every((t) => t >= Date.now()));
    assert.deepEqual(times, [...times].sort((a, b) => a - b));
    assert.ok(!body.items.some((e) => e.id === 'founders-breakfast'));
  });

  it('filters by category and city', async () => {
    const { body } = await api('/events?category=food&city=Abuja');
    assert.deepEqual(
      body.items.map((e) => e.id),
      ['abuja-food-festival'],
    );
  });

  it('returns event details with remaining capacity per tier', async () => {
    const { status, body } = await api('/events/abuja-food-festival');
    assert.equal(status, 200);
    const day = body.tiers.find((t) => t.id === 'aff-day');
    assert.equal(day.remaining, day.capacity - day.sold);
  });

  it('returns 404 for an unknown event', async () => {
    const { status } = await api('/events/does-not-exist');
    assert.equal(status, 404);
  });
});

describe('rsvp', () => {
  it('books a ticket with guests and a promo code', async () => {
    const { status, body } = await api('/events/abuja-food-festival/rsvp', {
      method: 'POST',
      body: { tierId: 'aff-day', name: 'Ngozi Okeke', email: 'ngozi@example.com', guests: 2, promoCode: 'gatepass10' },
    });
    assert.equal(status, 201);
    assert.equal(body.quantity, 3);
    assert.equal(body.subtotal, 9000);
    assert.equal(body.discount, 900);
    assert.equal(body.total, 8100);
    assert.match(body.ref, /^GP-\d+$/);

    const mine = await api('/tickets?email=ngozi@example.com');
    assert.equal(mine.body.length, 1);
    assert.equal(mine.body[0].event.title, 'Abuja Food Festival');
  });

  it('rejects a booking without a name', async () => {
    const { status, body } = await api('/events/abuja-food-festival/rsvp', {
      method: 'POST',
      body: { tierId: 'aff-day', name: '', email: 'someone@example.com', guests: 0 },
    });
    assert.equal(status, 422);
    assert.ok(body.errors.name);
  });

  it('rejects an unknown promo code', async () => {
    const { status } = await api('/promos/check', { method: 'POST', body: { code: 'NOPE', eventId: 'devfest-lagos' } });
    assert.equal(status, 404);
  });

  it('only allows event specific codes on their event', async () => {
    const ok = await api('/promos/check', { method: 'POST', body: { code: 'JAZZLOVER', eventId: 'lagos-jazz-night' } });
    assert.equal(ok.status, 200);
    const wrong = await api('/promos/check', { method: 'POST', body: { code: 'JAZZLOVER', eventId: 'devfest-lagos' } });
    assert.equal(wrong.status, 422);
  });

  it('frees capacity when a ticket is cancelled', async () => {
    const before = (await api('/events/street-food-friday')).body.tiers[0].remaining;
    const booked = await api('/events/street-food-friday/rsvp', {
      method: 'POST',
      body: { tierId: 'sff-entry', name: 'Kunle', email: 'kunle@example.com', guests: 1 },
    });
    assert.equal((await api('/events/street-food-friday')).body.tiers[0].remaining, before - 2);
    await api(`/tickets/${booked.body.id}`, { method: 'DELETE' });
    assert.equal((await api('/events/street-food-friday')).body.tiers[0].remaining, before);
  });
});

describe('organiser', () => {
  it('checks attendees in and out', async () => {
    const { body } = await api('/organiser/events/afrobeats-in-the-park/attendees');
    const target = body.attendees.find((a) => !a.checkedInAt);
    const checked = await api(`/tickets/${target.id}/check-in`, { method: 'POST' });
    assert.ok(checked.body.checkedInAt);
    const undone = await api(`/tickets/${target.id}/check-in`, { method: 'DELETE' });
    assert.equal(undone.body.checkedInAt, null);
  });

  it('summarises headcount per event', async () => {
    const { body } = await api('/organiser/events');
    const jazz = body.find((e) => e.id === 'lagos-jazz-night');
    assert.equal(jazz.ticketCount, 3);
    assert.equal(jazz.headcount, 5);
  });
});
