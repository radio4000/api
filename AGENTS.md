Always use the npm scripts defined in `package.json`. Never invoke vitest or other tools directly.

## Running tests

- `npm test` — run tests against local dev server (`localhost:8788`, requires `npm run dev` running in another terminal)
- `npm run test:preview` — run tests against the Cloudflare Workers preview deployment (the Hono rewrite)
- `npm run test:live` — run tests against production (`api.radio4000.com`), which currently runs the old Next.js codebase and will have expected failures

Use `npm run test:preview` as the primary way to verify the Hono rewrite works correctly.

## Code quality

- `npm run check` — run Biome linting/formatting and TypeScript type checking
