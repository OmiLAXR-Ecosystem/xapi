# Changelog

All notable changes to this repository are documented in this file.

The registry follows [Semantic Versioning](https://semver.org/). Versions after
2.1.0 are written by [release-please](https://github.com/googleapis/release-please)
into this file and `version.txt`, from the titles of the merged pull requests.
Do not edit them by hand; see "Submitting a change" in [CONTRIBUTING.md](CONTRIBUTING.md).

- **Major** (`feat!:`, `fix!:`): an IRI changes, i.e. a definition file is
  renamed, moved or deleted.
- **Minor** (`feat:`): new definitions, contexts or fields.
- **Patch** (`fix:`): corrections of names and descriptions, formatting.

The file path of a definition is part of its IRI
(`https://omilaxr-ecosystem.github.io/xapi/definitions/<path>`). Renaming,
moving or deleting a definition file breaks existing statements. Such changes
are listed under **BREAKING CHANGES**.

Versions 1.x were not tagged. They are the history of the original repository
at [gitlab.com/learntech-rwth/xapi](https://gitlab.com/learntech-rwth/xapi).

## [2.1.0] - 2026-11-19

### Added

- Versioned releases. The version is in `version.txt`, every release is tagged
  `vX.Y.Z` with a GitHub release, and release-please prepares each release from
  the titles of the merged pull requests (see "Submitting a change" in
  `CONTRIBUTING.md`).
- The website shows the version in the footer of every page, linked to its
  release, and the number of changes on `main` since that release.
  `registry.json` gives the version, tag, unreleased changes and IRI base for
  tools such as xAPI4Unity and OmiLAXR.MCP.
- The website redirects the former IRI of a renamed or merged definition to the
  new definition and serves the new JSON at the old `.json` path. The page of a
  definition lists its former IRIs below the IRI.
- `scripts/check-definitions.py` (`make check-definitions`) checks the rules of
  `CONTRIBUTING.md`: path and file name of every definition, language maps with
  `en-US`, non-empty match lists of valid IRIs, and references to existing
  definitions. Against the base branch it checks that a renamed or deleted
  definition is listed in the `exactMatch` of its replacement and that no
  former IRI is lost.
- Pull request checks "PR title", "Definitions" and "Website"
  (`.github/workflows/checks.yml`), and Dependabot for the workflow actions and
  the website dependencies.
- `observation/activities/oneself` ("sich selbst"), which
  `observation/verbs/motivated` already referenced.
- English names and descriptions for all definitions in `observation`.
- The website shows the xAPI Registry logo in the header, in a light and a dark
  variant, and has a favicon set with web manifest. The full-size logo, icon and
  a banner for the GitHub social preview are in the repository.
- Contributors: the README lists everyone who created or edited definitions,
  with their period and contexts, derived from the git history since January
  2020. The about page of the website shows the same list.
- Publications: the about page lists the papers that describe or use the
  original registry at xapi.elearn.rwth-aachen.de, read from
  `site/src/data/publications.json`. It notes that their IRIs point to the
  original registry and are kept as `exactMatch`.
- Icons in the navigation, footer, buttons, section headings, the search field
  and the context cards of the website. External links in running text show a
  small arrow, and each publication links its DOI and PDF.

### Changed

- **BREAKING:** All definitions in `observation` have English lowerCamelCase
  file names directly below `verbs/` or `activities/`. The subfolders
  `mainscores/` and `subscores/` are gone. Examples: `verbs/gibt` →
  `verbs/gave`, `activities/Führung ab` → `activities/leadership`,
  `activities/mainscores/Achtsamkeit` → `activities/mindfulness`,
  `activities/subscores/lässt andere ausreden` →
  `activities/lettingOthersFinish`. Each definition lists its old IRI in
  `exactMatch`, after the IRI under the former base.
- **BREAKING:** `observation/activities/Material ab` is merged into
  `observation/activities/material` (formerly `Material`), which lists the old
  IRIs of both.
- **BREAKING:** `lms/activities/book_chapter` is now
  `lms/activities/bookChapter`, and `lms/verbs/re-created` is now
  `lms/verbs/recreated`.
- **BREAKING:** `gestures/verbs/shaked` is now `gestures/verbs/shook`, the
  correct past tense.
- The German texts in `observation` follow the writing conventions: verbs in
  the simple past ("gab", "unterbrach"), "Akteur" for the actor, "z. B.".
- `CONTRIBUTING.md` and `CONTRIBUTING.de.md`: pull request titles as
  Conventional Commits replace the hand-written CHANGELOG entry. File names are
  English, there are no further subfolders, contexts may start with a digit
  (`360tours`), and the guides explain how to rename or merge a definition.
- Pull requests are built by the "Website" check. `pages.yml` only deploys
  `main`, and also when `version.txt` changes.
- The README starts with the address of the website and what it offers. The
  about page links the about page of the original registry and the original
  repository at gitlab.com/learntech-rwth/xapi, which holds the definitions up
  to version 1.x.

### Fixed

- The verbs in `observation` referenced their subscores as
  `activities/subscore/…` (the folder was `subscores`), with spaces and
  slashes, and referenced `Schere ab` and `sich selbst`, which did not exist.
  They now reference the new IRIs, and duplicate scoring rules are removed.
- Typos in the German texts of `observation`, e.g. "Akteuer", "Gegnstände",
  "Intresse", "stehts", "verschiedne".
- Removed 116 empty `relatedMatch` lists in `exerciseGenerator`, `ide`, `lms`,
  `media`, `rightsEngine` and `studybuddy`, as `CONTRIBUTING.md` asks.
- The English name of `lms/activities/bookChapter` is lowercase, and the
  descriptions of `lms/verbs/recreated` and `gestures/verbs/shook` follow the
  writing conventions.
- The header of this file named the old IRI base.
- "Search" and the logo linked the start page with a trailing slash, which
  the dev server does not serve. Links in running text on the about page that
  wrapped onto a new line lost the space before them.

### Removed

- `.gitlab-ci.yml` (jsonlint), replaced by the pull request checks.

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
  It thanks everyone at the Learning Technologies Research Group (Informatik 9)
  of RWTH Aachen University who created the original registry, and attributes
  the BMBF funding (Open Digital Lab 4 you, 16DHB2114) to that original work.
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
- **BREAKING:** New IRI base `https://omilaxr-ecosystem.github.io/xapi/`,
  replacing `https://xapi.elearn.rwth-aachen.de/`, whose hosting is not
  guaranteed long-term. The IRI of every definition changes by this prefix, e.g.
  `…/definitions/assistanceSystem/verbs/notNeeded` now starts with the new base.
  All 757 definitions list their former IRI as the first `exactMatch`, and the
  87 references between definitions (e.g. in `observation`) use the new base.
  The website shows the former IRI below the IRI, and its search finds
  definitions by their former IRI.
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
