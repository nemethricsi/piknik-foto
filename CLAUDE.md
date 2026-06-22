# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js 16 — Breaking Changes from Training Data

This project runs **Next.js 16.2.9**, which has significant breaking changes. Always read `node_modules/next/dist/docs/` before writing Next.js-specific code. Key divergences from Next.js 13–15:

- **`middleware.ts` is renamed to `proxy.ts`**; the exported function must be named `proxy`, not `middleware`.
- **`next lint` is removed**; use `eslint` directly (already reflected in `package.json`).
- **`serverRuntimeConfig` / `publicRuntimeConfig` are removed**; use `process.env` / `NEXT_PUBLIC_` instead.
- **Async Request APIs are fully mandatory** — `cookies()`, `headers()`, `draftMode()`, route `params`, and `searchParams` are all async and must be awaited. Synchronous access throws.
- **`revalidateTag` requires a second `cacheLife` argument** (e.g. `revalidateTag('posts', 'max')`); use `updateTag` for immediate cache invalidation.
- **PPR**: `experimental.ppr` / `experimental_ppr` segment config are removed; use `cacheComponents: true` in `next.config.ts` instead.
- **Turbopack is the default** for both `next dev` and `next build`. The `webpack` config key causes build failure unless `--webpack` flag is passed.
- **Parallel routes** require explicit `default.js` in every slot or builds fail.
- **`cacheLife` / `cacheTag`** are stable — drop the `unstable_` prefix.
- **`next/legacy/image` is deprecated**; use `next/image`.
- **`images.domains` is deprecated**; use `images.remotePatterns`.
- **`next dev` outputs to `.next/dev`** (separate from `.next/` used by `next build`).

## Commands

```bash
pnpm dev        # Start dev server (Turbopack, http://localhost:3000)
pnpm build      # Production build (Turbopack by default)
pnpm start      # Serve production build
pnpm lint       # Run ESLint via ESLint CLI (not next lint)
```

No test runner is configured yet.

## Architecture

App Router project (`src/app/`) using the Next.js 16 App Router. Alias `@/*` maps to `src/*`.

- **Styling**: Tailwind CSS v4 (imported with `@import "tailwindcss"` — no `@tailwind` directives). Theme tokens are defined via `@theme inline` in `globals.css`. Dark mode is driven by `prefers-color-scheme`.
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`, exposed as CSS variables `--font-geist-sans` / `--font-geist-mono` on `<html>`.
- **TypeScript**: strict mode, `moduleResolution: bundler`, path alias `@/*`.
- **ESLint**: Flat config format (`eslint.config.mjs`) — uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
