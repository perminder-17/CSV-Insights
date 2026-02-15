# CSV Insights Dashboard

A small full-stack application that lets you upload a CSV, generates a lightweight profiling summary + insights, stores the result, and supports follow-up Q&A.

> Assessment note: This repo is intentionally scoped. It focuses on clear API boundaries, clean UX, and a deployable setup.

---

## Repository structure

- `client/` — Frontend (Vite + React)
- `server/` — Backend (Express + TypeScript + MongoDB)

---

## What is done

### Frontend
- Upload CSV UI
- Reports list view
- Report detail view (renders the generated insights + sample preview)
- Follow-up Q&A UI (asks a question against an existing report)

### Backend
- CSV upload endpoint (multipart form upload)
- CSV parsing + basic validation (e.g., empty file / invalid format handling)
- CSV profiling (column metadata + simple numeric/categorical stats)
- Generates a Markdown insights report from the profile
- Stores reports in MongoDB
- Report retrieval endpoints (list + detail)
- Follow-up endpoint that uses an LLM to answer questions **based on the report/profile** (not intended to upload raw CSV to the model)

---

## What is not done (yet)

- Authentication / authorization (all reports are in one shared namespace)
- Fine-grained multi-tenant access controls
- Large-file streaming support (current approach is intended for small/medium CSVs)
- Comprehensive test suite (unit/integration/e2e)
- Advanced type inference (dates/locale formats) and robust schema inference
- Production observability (structured logs, tracing, alerting)

---

## Tech stack

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS (styling)

### Backend
- Node.js + Express
- TypeScript
- MongoDB (via Mongoose)
- CSV parsing library (implementation detail in server)
- LLM integration for follow-ups (optional via env var)

---

# Run locally

## Prerequisites
- Node.js 18+ recommended
- A MongoDB instance (local or MongoDB Atlas)

---

## 1) Backend (server)

```bash
cd server
npm install

---
## 2) Frontend (client)

```bash
cd client
npm install

---
