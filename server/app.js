import express from 'express';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createStore } from './store.js';
import { eventsRouter } from './routes/events.js';
import { ticketsRouter } from './routes/tickets.js';
import { organiserRouter } from './routes/organiser.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const browserDist = path.resolve(here, '../dist/gatepass/browser');

export function createApp(store = createStore()) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());

  const api = express.Router();
  api.use(eventsRouter(store));
  api.use(ticketsRouter(store));
  api.use(organiserRouter(store));
  api.use((_req, res) => res.status(404).json({ message: 'Not found.' }));
  app.use('/api', api);

  if (existsSync(browserDist)) {
    app.use(express.static(browserDist));
    app.get('/{*path}', (_req, res) => res.sendFile(path.join(browserDist, 'index.html')));
  }

  app.use((err, _req, res, _next) => {
    const status = err.status ?? 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ message: status >= 500 ? 'Something went wrong on our side.' : err.message });
  });

  return app;
}
