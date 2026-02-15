// server/src/routes/reports.ts
import mongoose from 'mongoose';
import { Router } from 'express';
import multer from 'multer';
import Papa from 'papaparse';
import { Report } from '../models/Report';
import { profileCsv } from '../lib/csvProfile';
import { heuristicInsights } from '../lib/insights';
import { llmAnswer } from '../services/llm/index.js';

export const reportsRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

reportsRouter.get('/reports', async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 5), 5);

  const reports = await Report.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .select({ fileName: 1, rowCount: 1, columnCount: 1, createdAt: 1 });

  res.json({ reports });
});

reportsRouter.get('/reports/:id', async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'invalid_id' });
  res.json({ report });
});

reportsRouter.post('/reports', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'no_file' });

  const fileName = file.originalname ?? 'upload.csv';
  if (!fileName.toLowerCase().endsWith('.csv')) {
    return res.status(400).json({ error: 'not_csv' });
  }

  const text = file.buffer.toString('utf8').trim();
  if (!text) return res.status(400).json({ error: 'empty_csv' });

  const parsed = Papa.parse<Record<string, any>>(text, { header: true, skipEmptyLines: true });
  if (parsed.errors?.length) {
    return res.status(400).json({ error: 'parse_failed', details: parsed.errors.slice(0, 3) });
  }

  const headers = (parsed.meta.fields ?? []).filter(Boolean) as string[];
  const rows = (parsed.data ?? []).filter((r) => r && Object.keys(r).length > 0);

  if (!headers.length || !rows.length) return res.status(400).json({ error: 'no_data' });

  const profileRows = rows.slice(0, 5000);
  const sampleRows = rows.slice(0, 30);

  const profile = profileCsv(headers, profileRows);
  const insightsMd = heuristicInsights(profile, { rowCount: rows.length, columnCount: headers.length });

  const created = await Report.create({
    fileName,
    rowCount: rows.length,
    columnCount: headers.length,
    columns: headers,
    sampleRows,
    profile,
    insightsMd,
    followups: [],
  });

  res.json({ id: created._id });
});

reportsRouter.post('/reports/:id/followups', async (req, res) => {
  const question = String(req.body?.question ?? '').trim();
  if (!question) return res.status(400).json({ error: 'empty_question' });


  const report: any = await Report.findById(req.params.id);
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'invalid_id' });

  const answer = await llmAnswer(question, report?.profile);
  const followup = { question, answer, createdAt: new Date().toISOString() };

  report.followups = Array.isArray(report.followups) ? report.followups : [];
  report.followups.unshift(followup);
  report.followups = report.followups.slice(0, 10);

  await report.save();

  res.json({ followup });
});
