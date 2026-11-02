import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 5104);

createApp().listen(port, () => {
  console.log(`Gatepass is running on http://localhost:${port}`);
});
