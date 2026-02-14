import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { connectDb } from './db';

async function main() {
  const app = createApp();

  const PORT = Number(process.env.PORT ?? 4000);
  const MONGODB_URI = process.env.MONGODB_URI ?? '';

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
