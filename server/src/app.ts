import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health.js';
import { reportsRouter } from './routes/reports.js';

dotenv.config();

export function createApp() {
  const app = express();

  app.use(cors({ origin: '*', credentials: false }));

  app.use(express.json({ limit: '2mb' }));

  app.get('/', (_req, res) => res.send('CSV Insights API'));

  app.use('/api', healthRouter);
  app.use('/api', reportsRouter);

  app.use((req, res) => res.status(404).json({ error: `Not found: ${req.method} ${req.path}` }));

  export default app;
}
