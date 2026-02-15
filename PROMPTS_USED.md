# Prompts Used (Sanitized)

This file records prompts I used during development. It intentionally excludes:
- Agent responses
- API keys / secrets
- Private data

---

## Backend (API + CSV processing)

1) **Express API scaffold**
- "Create an Express + TypeScript server with routes for health check and CSV report creation. Use multer for uploads and MongoDB (mongoose) for persistence."

2) **CSV parsing + validation**
- "Implement a POST /api/reports endpoint that accepts a CSV file upload, validates it has a header row, rejects empty/invalid CSV, and returns a created report id."

3) **CSV profiling**
- "Given CSV headers and rows, generate a profile per column: missing rate, approximate distinct count, top 5 frequent values, and detect numeric columns."

4) **Numeric stats + outliers**
- "For numeric columns compute min/max/mean/median/q1/q3 and estimate outliers using IQR fences."

5) **Heuristic insights (Markdown)**
- "Generate a short Markdown report from the CSV profile: summary, highest missing columns, possible outlier columns, and suggested next checks."

6) **Follow-up endpoint (LLM)**
- "Design an endpoint that answers user questions using only the CSV profile/summary (not raw data). Provide a safe prompt template and truncation strategy."

---

## Frontend (UI + integration)

7) **API client**
- "Create a small typed API wrapper using axios for uploading CSV, fetching reports, fetching report details, and posting follow-up questions."

8) **Report detail page**
- "Build a report detail page that renders Markdown insights, shows a data sample table, and includes a follow-up Q&A panel."

9) **UX polish**
- "Suggest UI improvements for loading states, error states, and copy-to-clipboard/download actions for the insights report."

---

## Deployment / Docs

10) **Vercel deployment**
- "How should I deploy a repo with separate client/ and server/ folders to Vercel? Include env vars and routing/rewrites for /api."

11) **Documentation**
- "Write a professional README describing how to run locally, what’s implemented, what’s not implemented, and known limitations."
