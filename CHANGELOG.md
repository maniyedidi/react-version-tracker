# Changelog

## 1.0.0

### Breaking
- Requires React `^19` (`react`, `react-dom` peer dependencies).
- `VersionTracker` uses `fetch` (with `cache: 'no-store'`) instead of `XMLHttpRequest`.

### Fixed
- `VersionTracker` used stale props inside its interval, crashed without `onVersionChange`, never checked on mount, and re-notified/re-alerted every interval.
- `useVersion` never unsubscribed from the emitter (listener leak) and compared against stale state.
- `useVersionTracker` crashed on responses without `headers` and ignored plain-object headers (axios); header lookup is now case-insensitive.
- Emitter stored listeners on the instance, so event names like `on`/`emit` collided; rewritten on a `Map`.

### Changed
- Build tooling upgraded (Rollup 4, `@rollup/plugin-babel`, `@rollup/plugin-terser`); package `exports`/`files` added.
- Removed unused Storybook 6 and build plugins; `npm audit` now reports 0 vulnerabilities.
- Added Vitest tests and Storybook stories for every use case.
