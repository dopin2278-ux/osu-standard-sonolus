# Architecture

This document describes the current code boundaries. The Sonolus integration is not complete yet.

## Data flow

```text
.osu file
   |
   v
src/beatmap/loader.js
   | validates file path, extension, size, and format header
   v
src/beatmap/parser.js
   | parses metadata, timing points, and hit objects
   v
src/engine/chart.js
   | validates and normalizes hit objects into a chart
   v
src/engine/game.js
   | tracks time, visible objects, and game state
   v
src/engine/judgement.js
     evaluates hits, misses, score, combo, and accuracy
```

The chart/game modules currently form a standalone core. Connecting this core to Sonolus level data and in-game rendering remains planned work.

## Modules

### `src/beatmap/loader.js`

- Loads a local `.osu` file using Node.js file APIs.
- Checks the extension, verifies the path is a file, enforces a 16 MiB size limit, and checks the osu! format header.
- Passes the file contents to `parseOsu`.

### `src/beatmap/parser.js`

- Parses the format version and section contents.
- Reads key-value data from the `General`, `Metadata`, and `Difficulty` sections.
- Parses timing points and hit objects.
- Classifies recognized hit-object types as circles, sliders, spinners, or holds.
- Sorts timing points and hit objects by time.

Parsing a type does not mean its full gameplay behavior is implemented.

### `src/engine/chart.js`

- Validates the parsed beatmap structure.
- Creates normalized chart objects with IDs, timing, coordinates, type, and hit-sound information.
- Copies metadata, difficulty settings, and timing points into the chart model.

### `src/engine/game.js`

- Manages the standalone gameplay state and current time.
- Determines which objects should be visible based on the approach time and judgement window.
- Accepts hit attempts and updates the game until completion.

### `src/engine/judgement.js`

- Defines hit timing windows and score values.
- Records judgements, misses, score, combo, maximum combo, and accuracy.

## Tests

Run the core tests from the repository root:

```bash
npm ci
npm test
```

When changing a module, update or add tests for the behavior being changed. Keep core gameplay logic independent of Sonolus-specific rendering where practical.

## Current limitation

This document describes the core Node.js implementation. It does not claim that the full game is playable in Sonolus yet. The next major integration step is to map the normalized chart into Sonolus level data and render objects in-game.
