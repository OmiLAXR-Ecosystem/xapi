# Changelog

All notable changes to this repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the registry follows [Semantic Versioning](https://semver.org/):

- **Major:** an IRI changes, i.e. a definition file is renamed, moved or deleted.
- **Minor:** new definitions, contexts or fields.
- **Patch:** corrections of names and descriptions, formatting, tooling.

The file path of a definition is part of its IRI
(`https://xapi.elearn.rwth-aachen.de/definitions/<path>`). Renaming, moving or
deleting a definition file breaks existing statements. Such changes are always
listed under **Changed** or **Removed** and marked with **BREAKING**.

Versions 1.x were not tagged. They are the history of the original repository
at [gitlab.com/learntech-rwth/xapi](https://gitlab.com/learntech-rwth/xapi).

## [2.0.0] - 2026-11-09

### Added

- Registry website in `site/`, a static Astro build deployed to GitHub Pages by
  `.github/workflows/pages.yml`. It has full-text search, a page per definition
  with its git history, a shareable list with JSON/CSV export, and a DE/EN
  switch. Every definition is also served as raw JSON at `definitions/<id>.json`,
  and all of them at `definitions.json`. It replaces the Docker/MongoDB stack of
  xAPI-frontend, including its server-side baskets.
- The website build validates every definition file (valid JSON, `name` and
  `description` language maps, location in `verbs`/`activities`/`extensions`,
  no two files with the same IRI). Pull requests that touch `definitions/` run it.
- `Makefile` for common tasks: `install`, `dev`, `build`, `preview`, `format`,
  `check-format`, `check` and `clean`. Run `make` to list them.
- `CONTRIBUTING.md` (English) and `CONTRIBUTING.de.md` (German): repository
  layout, why file paths must not change, file format, naming and writing
  conventions, and how to submit a change.
- The about page links to the original registry at xapi.elearn.rwth-aachen.de
  and cites the paper "xAPI Made Easy"
  ([doi:10.3991/ijoe.v18i14.35079](https://doi.org/10.3991/ijoe.v18i14.35079)).
- `scripts/format-definitions.py` normalizes the formatting of all definition
  files (`make format`). With `--check` it only reports files that are not
  normalized (`make check-format`).

### Changed

- Moved the concept text formerly in `CONTRIBUTING.md` to `docs/concept.md`.
- Normalized the formatting of 615 definition files. They now use UTF-8 without
  BOM (80 files had one), LF line endings (2 files used CRLF), 4-space
  indentation (211 files used 2 spaces or tabs) and a trailing newline (405
  files had none). Formatting only: names, descriptions, matches and key order
  are unchanged.
- **BREAKING:** Moved `media/extensions/duration.json` to
  `media/extensions/activity/duration.json`, the folder `CONTRIBUTING.md`
  requires for extensions. Its IRI changes from
  `…/definitions/media/extensions/duration` to
  `…/definitions/media/extensions/activity/duration`. xAPI4Unity skipped the
  file before ("Unknown extension type"), so generated registries did not
  contain it.

### Fixed

- Corrected 101 typos and grammar errors in the English (`en-US`) names and
  descriptions of 86 definitions, e.g. "renamend", "Rhe name", "A actor",
  "an UI element", "transpnder", "Actors physical". Names of irregular verbs now
  use the correct past tense ("shook", "evaluated", "ran"). File names and IRIs
  are unchanged.
