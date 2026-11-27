# Contributing

Thanks for your interest in contributing to osu! Standard for Sonolus!

This project is an early-stage, community-driven effort to build an osu!standard-inspired rhythm-game engine for Sonolus. Contributions of code, testing, documentation, and technical feedback are welcome.

## License for the project

The repository's original project code and documentation are released under the **MIT License** (SPDX: `MIT`).

The MIT License is permissive: covered material may be used, modified, copied, distributed, sublicensed, and used in commercial software, provided the required copyright and license notices are retained.

See [LICENSE](LICENSE) for the complete terms.

## Contributions

Unless a separate written agreement states otherwise, contributions submitted to this repository are intended to be distributed under the repository's MIT License terms.

By submitting a contribution, you confirm that you have the right to submit it under those terms. You retain any copyright you may have in your original contribution; the project receives the permissions necessary to distribute that contribution as part of the project under the MIT License.

Do not submit material that you do not have the right to redistribute.

## Before you start

- Check the README for the current project status and roadmap.
- Search existing issues to avoid duplicating work.
- For a large change, open an issue first to discuss the design and scope.
- Please be clear that the full in-game integration is still in progress.

## Development setup

The core project uses Node.js.

```bash
npm install
npm test
```

The Sonolus.js template is in `sonolus-engine/`:

```bash
cd sonolus-engine
npm install
npm run build
```

Run commands from the appropriate directory. The template build does not by itself verify complete osu! gameplay integration.

## Contribution guidelines

- Keep changes focused and easy to review.
- Prefer clear, maintainable JavaScript and meaningful names.
- Validate external input and handle errors explicitly.
- Add or update automated tests when changing parser, chart, judgement, or gameplay behavior.
- Do not claim compatibility with a feature or beatmap unless it has been tested.
- Update documentation when behavior, setup, or limitations change.
- Do not commit secrets, access tokens, copyrighted music, or beatmap assets unless you have permission to redistribute them.

## Suggested areas to help

- Sonolus level-data integration
- Rendering hit circles and other object types
- Player input and timing in Sonolus
- Beatmap format compatibility and edge cases
- Judgement/scoring tests
- Documentation, examples, and bug reports

## Pull requests

Please include:
1. What changed and why.
2. How you tested it.
3. Any known limitations or follow-up work.

Run `npm test` before submitting core-project changes. If you modify the Sonolus template, also run its build and report the result.

## Third-party materials

The MIT License applies only to project material that the copyright holder has the right to license. It does not automatically grant rights to third-party code, Sonolus, osu!, beatmaps, music, artwork, trademarks, or other external materials. Make sure you have the necessary rights before redistributing such materials.
