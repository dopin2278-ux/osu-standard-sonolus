# Roadmap

This roadmap tracks the development of an osu! Standard engine for Sonolus. Items are marked complete only when the corresponding functionality is implemented and verified.

## Phase 1 — Core Engine

- [x] Load and validate `.osu` files.
- [x] Parse beatmap metadata and hit objects.
- [x] Parse timing points.
- [x] Parse Slider data: curve type, control points, repeats, and length.
- [x] Convert hit objects into a normalized chart.
- [x] Sort chart objects by hit time.
- [x] Implement initial judgement and gameplay logic.
- [x] Implement automatic misses and level completion.
- [x] Add automated tests for core modules.
- [x] Add regression tests for Slider parsing and chart data.
- [x] Document the current architecture and module responsibilities.

## Phase 2 — Sonolus Integration

- [x] Define and implement the chart → Sonolus transport data contract.
- [x] Generate Sonolus level entities from the normalized chart.
- [x] Build the Sonolus Play Engine successfully.
- [x] Render and play Circle hit objects in Sonolus.
- [x] Connect touch input to Circle judgement.
- [x] Add centralized touch ownership through InputManager.
- [x] Implement Circle timing windows: Perfect / Great / Good / Miss.
- [ ] Implement approach circles and complete hit feedback.
- [ ] Display score, combo, and accuracy in the Sonolus UI.
- [ ] Wire generated level data into the shared Sonolus template and validate the complete level-loading path.

## Phase 3 — Slider Runtime

- [x] Preserve Slider data through the core chart model.
- [x] Calculate Slider duration from beat length, SliderMultiplier, repeats, and inherited Slider Velocity.
- [x] Calculate Slider endpoints from the requested path length for supported Linear and Bezier paths.
- [x] Preserve Slider runtime data in the Sonolus chart payload.
- [x] Export Slider duration, repeats, length, endpoint, and curve type to Sonolus level data.
- [x] Add regression tests for Slider timing, endpoint calculation, transport, and level data.
- [ ] Pass complete Slider path/control-point data into the runtime representation required by Sonolus.
- [ ] Render the Slider body and path in-game.
- [ ] Implement Slider head judgement.
- [ ] Implement Slider movement/hold tracking.
- [ ] Implement Slider ticks.
- [ ] Implement Slider repeats.
- [ ] Implement Slider tail judgement.
- [ ] Implement Slider scoring and accuracy rules.

## Phase 4 — Remaining osu! Standard Objects

- [ ] Verify Circle timing and positioning against real osu! beatmaps.
- [ ] Implement Spinner gameplay and scoring.
- [ ] Implement all required hit-sound behavior.
- [ ] Improve timing-point and difficulty-setting support.
- [ ] Handle common edge cases found in real `.osu` files.
- [ ] Add support for additional osu! Standard object types as required.

## Phase 5 — Beatmap Workflow

- [ ] Document how to provide a legally obtained `.osu` beatmap.
- [ ] Implement safe beatmap/audio/asset loading workflow.
- [ ] Handle audio and asset references safely.
- [ ] Test with a small set of permitted sample beatmaps.
- [ ] Document known compatibility limitations.
- [ ] Document the complete workflow from osu! beatmap → chart → Sonolus level.

## Phase 6 — Testing, CI and Release

- [x] Run core tests locally as part of development.
- [x] Add CI validation for project changes.
- [x] Validate Sonolus Play Engine builds in CI.
- [ ] Expand CI coverage for the full core + Sonolus integration pipeline.
- [ ] Add a reproducible Sonolus build and test guide.
- [ ] Add automated regression coverage for real-world beatmaps.
- [ ] Capture screenshots or a short gameplay demonstration.
- [ ] Publish an early playable release when integration is ready.
- [x] Prepare contribution and development documentation.

## Current Priority

The immediate development priority is the Slider runtime.

The core pipeline is already in place:

`.osu` file → parser → normalized chart → Sonolus chart payload → Sonolus level entities → Play Engine.

The next major milestone is to turn the currently transported Slider runtime data into actual in-game Slider gameplay: path rendering, hold tracking, ticks, repeats, tail judgement, and scoring.

## How to contribute

Pick an unchecked item or open an issue to discuss a new idea. For larger changes, please open an issue before starting implementation so the design can be discussed first.

This project is in active development. The roadmap may change as technical limitations and compatibility requirements become clearer.
