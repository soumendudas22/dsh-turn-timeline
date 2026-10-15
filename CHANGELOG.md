# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.2] - 2026-10-16

No change to the plugin itself. This is the first version published to npm; 1.0.1 was tagged on GitHub but never reached npm.

### Changed

- Releases are staged on npm and only go live after a maintainer approves them with two-factor authentication.

## [1.0.1] - 2026-10-16

No change to the plugin itself; this release adds project documentation and automation.

### Added

- Contributing guide with the branch model, commit conventions and release process.
- Security policy with private reporting channels.
- Code of conduct (Contributor Covenant 2.1).
- Support guide.
- Issue forms for bug reports and feature requests, and a pull request template.
- CI checks for package consistency on pushes and pull requests, and a release workflow that publishes to npm from version tags.
- CI and release workflows use actions/checkout v7 and actions/setup-node v7.
- CI and npm badges, and Contributing and Security sections in the README.

## [1.0.0] - 2026-10-15

### Added

- Timeline rail through each turn's process group.
- Status dots for reasoning, preparing, running, error and stopped steps.
- Padded surfaces around process groups and turn triggers.
- Colours taken from the active theme's tokens, so light and dark themes both work.
- Reduced-motion support: the dot colour transition is disabled when the system asks for reduced motion.
- English and Chinese plugin title and description.

[Unreleased]: https://github.com/soumendudas22/dsh-turn-timeline/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/soumendudas22/dsh-turn-timeline/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/soumendudas22/dsh-turn-timeline/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/soumendudas22/dsh-turn-timeline/releases/tag/v1.0.0
