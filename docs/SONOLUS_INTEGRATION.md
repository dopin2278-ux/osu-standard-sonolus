# Sonolus Integration: Chart Data Bridge

## Status

This document describes the first data bridge between the existing CommonJS osu! parser/core and the separate Sonolus.js template in `sonolus-engine/`. It is an intermediate transport format, **not yet a native Sonolus level-data encoder**. Playable in-game integration is still incomplete.

## Current bridge

Use `createSonolusChartPayload(chart)` from `src/engine/sonolus-chart.js` after loading a `.osu` file and calling `buildChart(beatmap)`.

The payload contains:
- `schemaVersion` for future format migrations;
- source format and osu! playfield dimensions (512 × 384);
- normalized metadata and difficulty values;
- timing points;
- hit objects with stable IDs, timestamps, coordinates, object kind, type flags, and hit sounds;
- chart duration.

The adapter validates required arrays, numeric fields, and object coordinates. It intentionally omits each object's raw source line to keep the transport payload small.

## Example

```js
const { loadOsuFile } = require('../src/beatmap/loader');
const { buildChart } = require('../src/engine/chart');
const { createSonolusChartPayload } = require('../src/engine/sonolus-chart');

async function exportChart(filePath) {
  const beatmap = await loadOsuFile(filePath);
  const chart = buildChart(beatmap);
  return createSonolusChartPayload(chart);
}
```

## Next integration steps

1. Define the native Sonolus level data schema and validate it against the installed Sonolus.js version.
2. Convert this transport payload into that native schema in the Sonolus template's shared level data.
3. Add archetypes for circles and subsequent slider/spinner support.
4. Map osu! playfield coordinates to the Sonolus screen coordinate system.
5. Connect input events, hit windows, misses, and scoring to the Sonolus play lifecycle.
6. Run template builds and tests against real, legally obtained beatmaps.

Do not treat a successful payload export as proof that a level is already playable in Sonolus.
