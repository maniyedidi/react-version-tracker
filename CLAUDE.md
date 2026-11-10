# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`react-version-tracker` is a small npm library (React 19 peer dependency) that tells a React app when a newer deployed version exists. Source is plain JS/JSX in `src/`; there is no TypeScript or linter. React ^19 is the only supported peer.

## Commands

- `npm run build-lib` — Rollup 4 build (`rollup.config.mjs`) of `src/index.js` to `dist/index.js` (CJS) and `dist/index.es.js` (ES). Imports in `src/` need explicit `.js` extensions because no node-resolve plugin is used. `dist/` is gitignored and published (`files`).
- `npm test` — Vitest + jsdom (`vitest.config.mjs`, tests in `tests/`). Single test: `npx vitest run tests/emitter.test.js` or `-t "name"`.
- `npm run storybook` / `npm run build-storybook` — Storybook (react-vite); stories in `src/stories/` mock `fetch` via `mockFetch.js`.
- `package.json` has an `overrides.glob` entry to keep `npm audit` clean (dev-only Storybook dependency chain).

## Architecture

Two independent mechanisms for detecting a version change, both exported from `src/index.js`:

1. **Polling — `VersionTracker` component** (`src/components/version-tracker/index.js`): renders `null`; checks immediately, then every `interval` seconds (default 60), re-armed when `interval`/`versionFileUrl` change; latest props are read via a ref. It `fetch`es (`cache: 'no-store'`) `versionFileUrl` (default `/version.json`, expects `{ "version": "x" }`) and calls `onVersionChange({ version })` when it differs from `currentVersion`, optionally `alert()`ing with `message`.
2. **Header-based — `useVersionTracker` + `useVersion` hooks**: `useVersionTracker(response, headerKey)` (`src/hooks/useVersionTracker.js`) is *not* a real React hook; it is called from fetch/axios response handlers, reads the version header (default `x-version`), and emits it on a module-level singleton `Emitter`. `useVersion()` (`src/hooks/useVersion.js`) subscribes to that same emitter (event id `app-version-event`, exported from `useVersionTracker.js`) and returns the latest `{ version }` as state.

The two hooks share state only through the exported `emitter` singleton, so both must resolve to the same module instance. `src/utils/tiny-emitter.js` is a minimal custom event emitter backed by a `Map`.

README.md documents the public API (props table, server-side `x-version` / `Access-Control-Expose-Headers` setup) and a roadmap; keep it in sync when changing public props or hook behavior.
