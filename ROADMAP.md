# Roadmap

This roadmap tracks the development of an osu!standard-inspired engine for Sonolus. Items are marked complete only when the corresponding functionality is implemented and verified.

## Phase 1 — Core

- [x] Load and validate `.osu` files.
- [x] Parse beatmap metadata and hit objects.
- [x] Convert hit objects into a normalized chart.
- [x] Implement initial judgement and gameplay logic.
- [x] Add automated tests for core modules.
- [ ] Document the current architecture and module responsibilities.

## Phase 2 — Sonolus Integration

- [ ] Define the data contract between the core chart model and Sonolus level data.
- [ ] Pass parsed beatmap data into the Sonolus engine.
- [ ] Render hit circles in-game.
- [ ] Implement approach circles and hit feedback.
- [ ] Connect player input to judgement logic.
- [ ] Display score, combo, and accuracy.

## Phase 3 — Hit Object Support

- [ ] Verify circle timing against real beatmaps.
- [ ] Implement slider gameplay and scoring.
- [ ] Implement spinner gameplay and scoring.
- [ ] Improve timing-point and difficulty-setting support.
- [ ] Handle common edge cases found in real `.osu` files.

## Phase 4 — Beatmap Workflow

- [ ] Document how to provide a legally obtained `.osu` beatmap.
- [ ] Handle audio and asset references safely.
- [ ] Test with a small set of permitted sample beatmaps.
- [ ] Document known compatibility limitations.

## Phase 5 — Testing and Release

- [ ] Run core tests automatically on every push and pull request.
- [ ] Add a reproducible Sonolus build and test guide.
- [ ] Capture screenshots or a short gameplay demonstration.
- [ ] Publish an early playable release when integration is ready.

## How to contribute

Pick an unchecked item or open an issue to discuss a new idea. For larger changes, please open an issue before starting implementation so the design can be discussed first.

This project is in active development. The roadmap may change as technical limitations and compatibility requirements become clearer.
