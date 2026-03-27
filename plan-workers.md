# Migration Plan: Vercel/Next.js to Cloudflare Workers

This document outlines the plan to rewrite the Radio4000 API from Vercel/Next.js to Cloudflare Workers, with one file per endpoint.

## Critical Requirement: No Breaking Changes

**All existing API behavior must be preserved exactly.** This migration is a platform change only—not a refactor or API redesign.

### API Contract Guarantees

- **Same URL paths**: All endpoints remain at identical URLs (e.g., `api.radio4000.com/embed`)
- **Same HTTP methods**: GET/POST methods unchanged
- **Same query parameters**: All parameter names preserved (`slug`, `uid`, `id`, `query`, `channelSlug`, `channelId`, `trackId`, etc.)
- **Same response format**: JSON structure, field names, and data types must match exactly
- **Same HTTP status codes**: Error codes (400, 404, 500) and success codes unchanged
- **Same error messages**: Error response format preserved
- **Same CORS headers**: `Access-Control-*` headers identical
- **Same Content-Type headers**: `application/json`, `text/html` as appropriate

### Validation

For each endpoint: compare response against current production (JSON structure, headers, error responses).

---

## Current Stack

- **Runtime**: Next.js on Vercel
- **External**: YouTube Data API, Cloudinary

## Target Stack

- **Runtime**: Cloudflare Workers
- **Router**: Hono
- **Data**: `@radio4000/sdk`
- **External**: YouTube Data API

---

## Proposed Directory Structure

```
/
├── src/
│   ├── index.ts                    # Main router, imports all endpoints
│   ├── root.ts                     # GET /
│   ├── embed.ts                    # GET /embed
│   ├── oembed.ts                   # GET /oembed
│   ├── youtube.ts                  # GET /youtube
│   ├── search-youtube.ts           # GET /search-youtube
│   ├── v2/
│   │   ├── index.ts                # GET /v2
│   │   ├── backup.ts               # GET /v2/backup
│   │   └── embed.ts                # GET /v2/embed
│   └── config.ts                   # Environment bindings
├── wrangler.toml                   # Cloudflare Workers config
├── package.json
└── tsconfig.json
```

---

## Endpoints to Migrate

### V1 Endpoints

| Endpoint | Method | File | Notes |
|----------|--------|------|-------|
| `/` | GET | `root.ts` | API info, config URLs |
| `/embed` | GET | `embed.ts` | Returns HTML iframe |
| `/oembed` | GET | `oembed.ts` | oEmbed JSON spec |
| `/youtube` | GET | `youtube.ts` | YouTube video metadata |
| `/search-youtube` | GET | `search-youtube.ts` | YouTube search |
| `/backup` | GET | — | **Skip** (Firebase) |
| `/import/firebase-realtime` | POST | — | **Skip** (Firebase) |

### V2 Endpoints

| Endpoint | Method | File | Notes |
|----------|--------|------|-------|
| `/v2` | GET | `v2/index.ts` | V2 API info |
| `/v2/backup` | GET | `v2/backup.ts` | Channel + tracks export |
| `/v2/embed` | GET | `v2/embed.ts` | V2 player embed |

---

## Tasks

- [ ] Initialize Cloudflare Workers project
- [ ] Install `hono`, `@radio4000/sdk`
- [ ] Configure `wrangler.toml`
- [ ] Port each endpoint (see table above)
- [ ] Test locally, compare against production
- [ ] Deploy to `api.radio4000.com`

---

## Environment Variables

Required secrets (via `wrangler secret put`):
- `YOUTUBE_API_KEY`

Required vars:
- `RADIO4000_URL`
- `RADIO4000_CMS`
- `CLOUDINARY_URL`

---

## Dependencies

- `hono` - routing
- `@radio4000/sdk` - data fetching for v2/backup
