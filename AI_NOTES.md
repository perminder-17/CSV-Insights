# AI Notes

This document explains what I used AI for, what I verified manually, and how the LLM is used in this application.

## What I used AI for

I used AI assistance primarily to:
- Accelerate boilerplate generation (Express setup, routing structure, client-side API wrapper patterns).
- Draft and refine CSV profiling heuristics (missingness, numeric detection, basic quantiles / outlier logic).
- Improve error-handling and edge-case coverage (empty files, non-CSV uploads, parsing errors).
- Draft documentation (README and these assessment notes) to be clear and professional.

## What I verified manually

I personally verified:
- End-to-end flow by running the app locally (upload → report creation → report detail → follow-up).
- API behavior and payload shapes against the client expectations (IDs, report detail format, follow-up insert order).
- That the LLM prompt uses **only the derived CSV profile**, not raw uploaded CSV content.
- That Mongo persistence includes the fields required by the UI (filename, rowCount/columnCount, insights markdown, sample rows, follow-ups).

## LLM used by the app (provider/model) and why

Provider: **Google Gemini**  
SDK: `@google/genai`  
Model: `gemini-2.5-flash`

Why this choice:
- Strong instruction-following and summarization quality for “data analyst” style responses.
- Fast latency, suitable for interactive follow-ups.
- Official SDK support via `@google/genai`.

## How the LLM is used (scope + privacy)

- The app generates a **CSV profile** (column metadata + stats) and builds a prompt using that profile.
- The follow-up question endpoint sends the prompt to Gemini.
- The raw CSV file is **not** sent to the LLM; only the derived summary/profile is used.

## Known limitations / future improvements

- `LLM_PROVIDER` is currently used for `/api/health` reporting, but the follow-up implementation dispatches directly to Gemini; it can be extended to support multiple providers cleanly.
- Add caching / deduping for repeated questions.
- Add more robust numeric/date parsing and more defensive prompt truncation for very wide CSVs.
- Add automated tests and production-grade logging.
