# Gatepass

Gatepass is our event RSVP and ticketing app. Attendees browse upcoming events, pick a ticket tier, RSVP with guests and promo codes, and manage their bookings under **My tickets**. Organisers get a dashboard with sales per event and a guest list for check-in at the door.

The repo holds both halves of the product:

| Path | What lives there |
| --- | --- |
| `src/` | Angular 22 single page app (standalone components, signals, zoneless) |
| `server/` | Express 5 JSON API under `/api`, which also serves the built SPA in production |
| `server/seed.js` | Demo data, regenerated on every start with dates relative to today |

Data is held in memory, so restarting the server resets everything to the seed.

## Requirements

- Node.js 22 or newer and npm 10

## Running it

### Docker

```bash
docker compose up --build
```

Then open http://localhost:5104.

### Natively

```bash
npm ci
npm run build      # builds the SPA into dist/gatepass
npm start          # API + SPA on http://localhost:5104
```

For day to day frontend work run the API and the Angular dev server side by side:

```bash
npm run dev:api    # API with --watch on http://localhost:3000
npm run dev        # ng serve on http://localhost:4200, proxies /api to :3000
```

`PORT` changes the API port. `MAIL_LATENCY_MS` controls the simulated delay of the development mailer (defaults to 60 ms).

## Tests

```bash
npm test
```

This runs the Angular unit tests with Vitest (`ng test`, jsdom, headless) and then the API tests with the Node test runner (`npm run test:server`).

## Demo accounts and data

- You are signed in as **Ada Obi** (`ada.obi@example.com`). Use **Change** in the header to act as another attendee; tickets are looked up by email.
- Promo codes: `GATEPASS10` (10% off), `NAIJA2K` (N2,000 off an order), `JAZZLOVER` (15% off Lagos Jazz Night only). `EARLYBIRD` ended a few days ago.
- The organiser area has no login in this build.

## API overview

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/meta` | Categories and cities for the filters |
| GET | `/api/events?q=&category=&city=&page=` | Upcoming events, 6 per page |
| GET | `/api/events/:id` | Event details with tiers and remaining capacity |
| POST | `/api/promos/check` | Validate a promo code for an event |
| POST | `/api/events/:id/rsvp` | Book a ticket (`tierId`, `name`, `email`, `guests`, `promoCode`) |
| GET | `/api/tickets?email=` | Tickets for an attendee |
| PATCH | `/api/tickets/:id` | Change the number of guests |
| DELETE | `/api/tickets/:id` | Cancel a ticket |
| GET | `/api/organiser/events` | Sales and attendance per event |
| GET | `/api/organiser/events/:id/attendees` | Guest list |
| POST / DELETE | `/api/tickets/:id/check-in` | Check an attendee in, or undo it |

## Conventions

- Money is stored and sent as whole naira (integers). Format it in the UI with the `naira` pipe.
- Every ticket admits the booker plus their guests (`quantity = 1 + guests`); capacity is counted in people.
- Formatting is handled by Prettier (`npx prettier --write .`).
