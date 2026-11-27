# Sonolus Integration: Chart Data Bridge

## Status

This document describes the current data bridge between the existing CommonJS osu! parser/core and the separate Sonolus.js template in `sonolus-engine/`. The project now has both a validated transport payload and a validated Sonolus level-data entity bridge, but the generated level data is **not yet wired into the shared Sonolus template's complete level-loading path**. Playable end-to-end integration is still incomplete.

## License

The repository's original project code and documentation are released under the **MIT License** (SPDX: `MIT`).

For material covered by this repository's copyright, MIT permits use, modification, redistribution, sublicensing, and commercial use, subject to retention of the required copyright and license notices.

**Copyright (c) 2026 @dopin2278-ux**

See [LICENSE](../LICENSE) for the complete license text.

The MIT License does **not** grant rights to third-party materials. Sonolus, osu!, beatmaps, music, artwork, trademarks, and third-party dependencies remain subject to their own licenses and terms.

## Current pipeline

The integration boundary currently consists of:

`.osu` → parser → normalized chart → Sonolus chart payload → Sonolus level entities → Sonolus Play Engine integration.

### Chart payload

Use `createSonolusChartPayload(chart)` from `src/engine/sonolus-chart.js` after loading a `.osu` file and calling `buildChart(beatmap)`.

The payload contains:

- `schemaVersion` for future format migrations;
- source format and osu! playfield dimensions (512 × 384);
- normalized metadata and difficulty values;
- timing points;
- hit objects with stable IDs, timestamps, coordinates, object kind, type flags, and hit sounds;
- chart duration.

The adapter validates required arrays, numeric fields, and object coordinates. It intentionally omits each object's raw source line to keep the transport payload small.

### Level-data bridge

Use `createSonolusLevelData(payload)` from `src/engine/sonolus-level.js` after creating the chart payload.

The bridge:

- creates `Initialization` and `Stage` entities;
- creates one Sonolus `HitObject` entity for each chart object;
- preserves object ID, timing, position, type, and hit-sound data;
- converts object time from milliseconds to seconds for Sonolus level data;
- validates object coordinates against the osu! 512 × 384 playfield.

This is the repository's current level-data representation. It is tested independently, but it is not yet connected to the shared `sonolus-engine/shared/src/level/data/` runtime data.

## Example

```js
const { loadOsuFile } = require('../src/beatmap/loader');
const { buildChart } = require('../src/engine/chart');
const { createSonolusChartPayload } = require('../src/engine/sonolus-chart');
const { createSonolusLevelData } = require('../src/engine/sonolus-level');

async function exportLevelData(filePath) {
  const beatmap = await loadOsuFile(filePath);
  const chart = buildChart(beatmap);
  const payload = createSonolusChartPayload(chart);
  return createSonolusLevelData(payload);
}
```

## Next integration steps

1. Wire the generated level data into the Sonolus template's shared level-data module.
2. Validate the level-data entity schema against the installed Sonolus.js version.
3. Connect the generated object data to the Play Engine archetypes.
4. Map osu! playfield coordinates to the Sonolus screen coordinate system.
5. Connect input events, hit windows, misses, and scoring to the Sonolus play lifecycle.
6. Run template builds and tests against real, legally obtained beatmaps.

Do not treat a successful payload or level-data export as proof that a level is already playable end-to-end in Sonolus.
