# osu! Standard for Sonolus

An independent, open-source **osu!standard-inspired rhythm-game engine for Sonolus**, with the long-term goal of making beatmaps from the official osu! website playable in Sonolus.

> **Status: Work in progress.** The beatmap parsing and core gameplay logic are under development. Full in-game integration, visual presentation, and end-to-end compatibility are not complete yet.

## Project goals

- Load and parse `.osu` beatmap files.
- Convert beatmap hit objects into a normalized chart representation.
- Build a maintainable gameplay core for timing, hit detection, scoring, and misses.
- Integrate the core with the Sonolus.js engine template.
- Explore a workflow for bringing legally obtained beatmaps from osu! into Sonolus while respecting the original game's and creators' terms.

## Current implementation

- `.osu` file loading with extension, file-size, and format-header validation.
- Beatmap parsing and chart construction.
- Initial gameplay and judgement logic.
- Automated tests using Node.js's built-in test runner.
- A validated chart-payload bridge (`src/engine/sonolus-chart.js`) to prepare parsed osu! charts for the next Sonolus integration stage.
- A Sonolus.js template in `sonolus-engine/` for integration work.

This is an early-stage project. The items above describe implemented development components, not a claim that the full engine is already playable in Sonolus.

## License

This project is licensed under the **MIT License** (SPDX: `MIT`).

The MIT License is a permissive open-source license. For the material covered by this repository's copyright, it allows people to:

- use the software for any purpose;
- copy and modify it;
- publish and distribute copies;
- sublicense it;
- sell copies or include it in commercial software.

The main condition is that the copyright notice and MIT permission notice are retained in copies or substantial portions of the software. The software is provided without warranty, as stated in the license.

The complete license text is available in [LICENSE](LICENSE). The official MIT License text is also published by the [Open Source Initiative](https://opensource.org/license/mit).

### Copyright and third-party materials

**Copyright (c) 2026 @dopin2278-ux**

The MIT License applies only to material in this repository that the copyright holder has the right to license. It does not automatically license third-party code, dependencies, Sonolus, osu!, beatmaps, music, artwork, trademarks, or other external materials. Those materials remain subject to their own licenses, permissions, and terms.

The project's use of third-party material must not be interpreted as a claim of ownership over that material.

## Project documentation

- [Authors, contributors and developer recognition](AUTHORS.md)
- [Sonolus integration guide](docs/SONOLUS_INTEGRATION.md)
- [Development roadmap](ROADMAP.md)
- [Architecture overview](docs/ARCHITECTURE.md)
- [Contributing guide](CONTRIBUTING.md)
- [License text](LICENSE)
- [Open issues and planned work](https://github.com/dopin2278-ux/osu-standard-sonolus/issues)

## Technology

- JavaScript / Node.js
- Node.js built-in test runner
- [Sonolus.js](https://github.com/Sonolus/sonolus.js) engine template

## Getting started

### Core project

Requires a recent Node.js version.

```bash
npm install
npm test
```

To parse the included demo beatmap:

```bash
npm run parse -- assets/maps/demo.osu
```

### Sonolus engine template

```bash
cd sonolus-engine
npm install
npm run build
```

The template build is a development check; it does not by itself mean the osu! gameplay integration is finished.

## Roadmap

- [x] Initial `.osu` loader and parser
- [x] Initial chart model
- [x] Core judgement and gameplay logic
- [x] Automated tests for core components
- [x] Initial validated chart payload for the Sonolus integration boundary
- [ ] Convert the transport payload into native Sonolus level data
- [ ] Render circles and other hit objects in-game
- [ ] Handle player input and timing in Sonolus
- [ ] Validate gameplay against real beatmaps
- [ ] Document beatmap import and compatibility limitations

## Contributing

Contributions, testing, bug reports, and architecture feedback are welcome—especially around JavaScript, rhythm-game timing, beatmap formats, and Sonolus engine development.

Before opening a pull request:

1. Run `npm test`.
2. Describe the change and how it was tested.
3. Keep changes focused and avoid committing copyrighted beatmap audio or other assets without permission.

Contributions are accepted under the repository's applicable MIT License terms unless a separate written agreement states otherwise. Contributors who make a substantial, meaningful contribution may be recognized as project developers. See [CONTRIBUTING.md](CONTRIBUTING.md) and [AUTHORS.md](AUTHORS.md) for details.

## Legal and attribution

This is an independent community project and is not affiliated with or endorsed by osu! or Sonolus. Please follow the applicable terms and licenses for osu!, Sonolus, beatmaps, music, and other assets. Only use content you have permission to use.

---

Copyright (c) 2026 @dopin2278-ux

Independent community project; not affiliated with or endorsed by osu! or Sonolus.
