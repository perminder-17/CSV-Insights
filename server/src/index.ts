import 'dotenv/config';
import { connectDb } from './db.js';
import express from "express"
import cors from 'cors';
import { healthRouter } from './routes/health.js';
import { reportsRouter } from './routes/reports.js';


const PORT = Number(process.env.PORT ?? 4000);
const MONGODB_URI = process.env.MONGODB_URI ?? '';


async function main() {
  const app = express();

  app.use(cors({ origin: '*', credentials: false }));
  app.use(express.json({ limit: '2mb' }));

  app.get('/', (_req, res) => res.send('CSV Insights API'));

  app.use('/api', healthRouter);
  app.use('/api', reportsRouter);

  app.use((req, res) => res.status(404).json({ error: `Not found: ${req.method} ${req.path}` }));

  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI in .env');
    process.exit(1);
  }

  await connectDb(MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
