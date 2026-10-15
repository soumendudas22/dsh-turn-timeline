# Contributing to Turn Timeline

Thanks for taking the time to contribute! This is a small plugin, and every report, idea and fix helps.

You can help by:

- **Reporting bugs** — something looks wrong or breaks in the chat.
- **Suggesting ideas** — a status, layout or accessibility improvement.
- **Writing code** — fixes and features in `client.js`.
- **Improving docs** — the README, this guide, or comments in the code.
- **Translating** — the plugin title and description in [`locale/`](locale). Add a new `locale/<lang>.json` with the same shape as `locale/en.json`.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By taking part you agree to uphold it.

## Before you start

- **Search [existing issues](https://github.com/soumendudas22/dsh-turn-timeline/issues)** first; someone may already be on it.
- **Open an issue before large changes** so we can agree on the approach before you spend time on it. Small fixes can go straight to a pull request.
- **Security issues:** never report them in a public issue, pull request or discussion. Follow [SECURITY.md](SECURITY.md) instead.

## Development setup

### Prerequisites

- The DeepSeek Harness (DSH) Web app.
- Node.js 20 or newer.
- `pnpm` on your `PATH` (DSH uses it to install plugins).

### Get the code

1. Fork the repository on GitHub, then clone your fork and switch to the integration branch:

   ```sh
   git clone https://github.com/<your-user>/dsh-turn-timeline.git
   cd dsh-turn-timeline
   git switch development
   ```

2. Link your checkout into a DSH profile (run this from the folder that contains `dsh-turn-timeline`):

   ```sh
   dsh plugin --profile web add ./dsh-turn-timeline
   ```

3. Reload the Web app. Edits to `client.js` take effect after another reload.

To unlink your checkout:

```sh
dsh plugin --profile web remove @soumendudas22/dsh-turn-timeline
```

### Project layout

| Path | Purpose |
| --- | --- |
| `client.js` | Browser module that injects the timeline stylesheet. All the visible work happens here. |
| `index.js` | Server-side entry. A no-op; kept so DSH can load the bundle. |
| `cordis.patch.yml` | Inserts the plugin row (`id: turn-timeline`) into the DSH configuration. |
| `locale/*.json` | Plugin title and description per language. |
| `icon.svg` | Plugin icon shown in the Web app. |
| `scripts/check.mjs` | Package consistency checks run by `npm test` (not published). |
| `.github/` | CI and release workflows, issue forms, pull request template. |

## Branch model

| Branch | Purpose |
| --- | --- |
| `development` | Default and integration branch. All contributor pull requests target it. Protected. |
| `master` | Released code only; every commit on it is a tagged release. Protected. |
| `feature/<short-name>`, `fix/<short-name>`, `docs/<short-name>`, `chore/<short-name>` | Work branches. Branch from `development`, open a pull request back into `development`. |
| `release/<x.y.z>` | Cut by maintainers from `development` to prepare a release. Kept as the record of the release. |
| `hotfix/<x.y.z>` | Cut from `master` for urgent fixes to a released version. |

```text
feature/*  fix/*  docs/*  chore/*
        │ PR
        ▼
   development ──► release/x.y.z ──(no-ff)──► master ──► tag vX.Y.Z
        ▲                                       │
        └────────────── merge back ─────────────┘

   master ──► hotfix/x.y.z ──► master (tag vX.Y.Z) ──► development
```

Protected branches (`development`, `master`) only accept merges through pull requests with passing CI. Force-pushes and deletion are not allowed.

## Making changes

- **Style:** follow [`.editorconfig`](.editorconfig) — 2-space indentation, LF line endings, UTF-8, final newline.
- **Selectors:** target stable `data-*` hooks only. Never use hashed CSS-module class names; they change between DSH builds.
- **Colours:** use theme tokens (`--dsw-alias-*`, re-exported as `--tl-*`) only. No hard-coded colours, so light and dark themes keep working.
- **Stylesheet only:** the plugin must not replace slots or change behaviour such as folding, search or per-tool views.
- **Motion:** keep it minimal and disable it under `prefers-reduced-motion: reduce`.
- **Plugin id:** keep `PLUGIN_ID` in `client.js`, the row `name` in `cordis.patch.yml` and the `name` in `package.json` identical. `npm test` checks this.

## Testing

Run the automated checks (no install needed):

```sh
npm test
```

Then check your change by hand in the DSH Web app:

- [ ] Light theme and dark theme.
- [ ] A turn with reasoning.
- [ ] A running tool call.
- [ ] A failed tool call.
- [ ] A stopped (interrupted) tool call.
- [ ] Reduced motion enabled in the operating system.
- [ ] Browser zoom and a larger content font size.

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/): `<type>: <short summary>` in the imperative, at most 72 characters, with an optional body explaining why.

| Type | Use for |
| --- | --- |
| `feat` | A new user-visible feature. |
| `fix` | A bug fix. |
| `docs` | Documentation only. |
| `style` | Formatting with no behaviour change. |
| `refactor` | Code change that neither fixes a bug nor adds a feature. |
| `test` | Adding or changing checks. |
| `ci` | CI and release workflows. |
| `chore` | Maintenance: config, templates, tooling. |

Breaking changes add `!` after the type (`feat!: ...`) or a `BREAKING CHANGE:` footer, and lead to a major release.

Examples:

```text
feat: mark sub-agent calls with a distinct dot
fix: keep the rail aligned at larger font sizes
docs: add Japanese plugin description
feat!: require DSH 0.3 data attributes

BREAKING CHANGE: older DSH versions no longer render the rail.
```

Versioning follows [Semantic Versioning](https://semver.org/). A change that requires a newer DSH version, or drops support for one, is at least a minor release and must be called out in the changelog.

## Pull requests

- Target the **`development`** branch.
- Fill in the pull request template.
- Keep each pull request to one topic.
- Keep CI green (`npm test`).
- For visual changes, attach before/after screenshots in light and dark themes.
- Add a line to [CHANGELOG.md](CHANGELOG.md) under `## [Unreleased]`.

## Release process

Maintainers only.

### Regular release

1. From an up-to-date `development`, create `release/<x.y.z>`.
2. Bump `version` in `package.json` and move the `## [Unreleased]` entries in `CHANGELOG.md` to `## [<x.y.z>] - <date>`; update the compare links.
3. Open a pull request from `release/<x.y.z>` into `master` and wait for CI.
4. Merge into `master` with a merge commit (no fast-forward).
5. Tag the merge commit on `master` as `v<x.y.z>` and push the tag.
6. Merge `master` back into `development` through a pull request.
7. Keep the `release/<x.y.z>` branch as the record of the release.

### Hotfix

1. Create `hotfix/<x.y.z>` from `master`.
2. Fix the issue, bump the patch version and update `CHANGELOG.md`.
3. Open a pull request into `master`, merge it (no fast-forward) once CI passes, and tag it `v<x.y.z>`.
4. Merge `master` back into `development` through a pull request.

### Publishing

Pushing a `v<x.y.z>` tag runs the **Release** workflow. It checks that the tag matches `package.json` and is on `master`, runs `npm test`, and **stages** the package on npm with provenance (`npm stage publish`). A staged version is not installable yet:

1. A maintainer reviews the staged version in the package's **Staged Packages** tab on npmjs.com (or with `npm stage list`, `npm stage view <stage-id>` and `npm stage download <stage-id>`).
2. The maintainer approves it with 2FA on npmjs.com or with `npm stage approve <stage-id>`. Only then does it go live. A bad build is discarded with `npm stage reject <stage-id>`.
3. Create a GitHub Release from the tag, using that version's changelog section as the notes.

The workflow authenticates with npm trusted publishing (OIDC) when it is configured for this repository, and otherwise with a stage-only token stored as the `NPM_TOKEN` secret of the `npm` environment. Both are limited to staging, so neither can make a version public without the approval step.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
