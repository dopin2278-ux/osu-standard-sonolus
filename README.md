# osu! Standard for Sonolus

An independent, **non-commercial osu!standard-inspired rhythm-game engine for Sonolus**, with the long-term goal of making beatmaps from the official osu! website playable in Sonolus. Non-commercial use and modification are permitted under the project's custom license; commercial use requires prior written permission from the original author, `@dopin2278-ux`.

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

## License and attribution

This project uses the custom [Osu Standard Sonolus Non-Commercial License](LICENSE), not a standard open-source license. You may use, modify, and redistribute the project for non-commercial purposes only, subject to the license terms. **Commercial use—including paid products, advertising, sponsorships, subscriptions, and in-app purchases—requires prior written permission from `@dopin2278-ux`.** When redistributing the project or a derivative work, retain the license and copyright notices and include this exact attribution in the README or equivalent project documentation:

`Original creator: @dopin2278-ux`

The license requires source availability and the same license terms for distributed derivative works. Third-party code, beatmaps, music, artwork, and trademarks are not automatically covered by this license.

## Project documentation

- [Authors and attribution](AUTHORS.md)
- [Sonolus integration guide](docs/SONOLUS_INTEGRATION.md)
- [Development roadmap](ROADMAP.md)
- [Architecture overview](docs/ARCHITECTURE.md)
- [Contributing guide](CONTRIBUTING.md)
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

If you're interested in helping, open an issue to discuss the feature or approach before starting large changes.

## Legal and attribution

This is an independent community project and is not affiliated with or endorsed by osu! or Sonolus. Please follow the applicable terms and licenses for osu!, Sonolus, beatmaps, music, and other assets. Only use content you have permission to use.

---

Original creator: @dopin2278-ux

Independent community project; not affiliated with or endorsed by osu! or Sonolus.
