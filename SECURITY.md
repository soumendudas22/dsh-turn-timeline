# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 1.0.x | ✅ |
| < 1.0 | ❌ |

Only the latest minor release receives security fixes.

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues, pull requests or discussions.**

- **Preferred:** use GitHub private vulnerability reporting at <https://github.com/soumendudas22/dsh-turn-timeline/security/advisories/new>.
- **Fallback:** email <soumendudas22@gmail.com> with the subject `[SECURITY] dsh-turn-timeline`.

### What to include

- The plugin version affected.
- The DeepSeek Harness (DSH) version.
- Browser and version.
- Steps to reproduce or a proof of concept.
- The impact: what an attacker could achieve.

## What to expect

| Step | Target |
| --- | --- |
| Acknowledgement of your report | Within 3 business days |
| Triage and initial assessment | Within 7 days |
| Fix or mitigation for high and critical issues | Within 30 days |

Disclosure is coordinated through a GitHub Security Advisory once a fix is available. Reporters are credited in the advisory unless they prefer not to be.

## Scope

In scope — this repository's code and the published npm package `@soumendudas22/dsh-turn-timeline`, for example:

- CSS that could hide or spoof chat content or tool call states.
- Injection through the plugin's style handling.
- Malicious or unexpected changes in the published package (supply chain).
- The CI and release workflows in `.github/workflows`.

Out of scope:

- Vulnerabilities in DeepSeek Harness itself — report those upstream at <https://github.com/deepseek-ai/deepseek-harness>.
- Issues that require an already compromised machine or a malicious DSH profile.
- Third-party plugins.

Installing any DSH plugin runs its code inside the Web app. Install plugins you trust, and pin a version or tag (for example `@soumendudas22/dsh-turn-timeline@1.0.0` or `github:soumendudas22/dsh-turn-timeline#v1.0.0`) rather than tracking a branch.

## Safe harbour

We will not pursue or support legal action against anyone who researches and reports a vulnerability in good faith under this policy: avoid privacy violations, data destruction and service disruption, only test against your own installation, and give us reasonable time to fix the issue before any public disclosure.
