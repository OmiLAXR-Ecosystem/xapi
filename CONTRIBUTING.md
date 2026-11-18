# Contributing

Thanks for helping to extend the registry. This guide covers how definitions
are stored, the conventions for writing them, and how to submit a change.

Deutsche Fassung: [CONTRIBUTING.de.md](CONTRIBUTING.de.md). The background and
original concept of the registry are described in [docs/concept.md](docs/concept.md)
(German).

## Repository layout

Every definition is a JSON file:

```
definitions/<context>/verbs/<name>.json
definitions/<context>/activities/<name>.json
definitions/<context>/extensions/{activity,context,result}/<name>.json
```

- A **context** groups definitions by subject, e.g. `lms`, `eyeTracking` or
  `generic`. Check the existing contexts before creating a new one, and put
  definitions that fit any subject into `generic`.
- Extensions go into the subfolder that matches where they are used in a
  statement: `activity` (`object.definition.extensions`), `context`
  (`context.extensions`) or `result` (`result.extensions`).

## The file path is the IRI

The IRI of a definition is built from its path below `definitions/`, without
`.json`:

```
definitions/generic/verbs/opened.json
→ https://omilaxr-ecosystem.github.io/xapi/definitions/generic/verbs/opened
```

Once a definition is merged, statements in the wild use its IRI. Therefore:

- **Do not rename, move or delete merged files.** Fix the text inside the file
  instead.
- If a rename is unavoidable, it is a breaking change. Add the old full IRI to
  `exactMatch` in the moved file, so statements using the old IRI can still be
  mapped, and mark the entry in the CHANGELOG with **BREAKING**.
- Choose the file name carefully, it cannot be fixed later.
- Up to version 1.x the IRIs started with `https://xapi.elearn.rwth-aachen.de/`.
  Every definition from that time lists its former IRI as the first entry of
  `exactMatch`. Do not remove it.

## File format

```json
{
    "name": {
        "en-US": "opened",
        "de-DE": "öffnete"
    },
    "description": {
        "en-US": "An actor opened something, for example the settings.",
        "de-DE": "Ein Akteur öffnete etwas, zum Beispiel die Einstellungen."
    },
    "exactMatch": [
        "http://activitystrea.ms/schema/1.0/open"
    ]
}
```

| Field | Required | Content |
|---|---|---|
| `name` | yes | Language map with a short label |
| `description` | yes | Language map with one or more full sentences |
| `exactMatch` | no | IRIs of definitions elsewhere that mean exactly the same |
| `relatedMatch` | no | IRIs of definitions elsewhere that are similar |

- `en-US` is mandatory in `name` and `description`; it is the fallback for all
  other languages. `de-DE` is strongly encouraged. Further languages are welcome.
- Before creating a definition, search the registry and other registries (e.g.
  [ADL](http://adlnet.gov/expapi/verbs/), [Activity Streams](http://activitystrea.ms/schema/1.0/),
  [registry.tincanapi.com](https://registry.tincanapi.com)). Reuse an existing
  definition if it fits; otherwise reference similar ones in `exactMatch` or
  `relatedMatch`.
- Copy match IRIs exactly as their registry defines them, including `http` or
  `https`. Do not use the URL of a registry's overview page.
- Leave out `exactMatch` and `relatedMatch` instead of using empty lists.

### Formatting

Files are UTF-8 without BOM, with LF line endings, 4-space indentation and a
trailing newline. `make format` applies this to all files, `make check-format`
only checks.

## Naming and writing conventions

### File names

- lowerCamelCase, ASCII letters and digits only: `zoomedIn.json`,
  `numberOfPlayers.json`. No spaces, umlauts, hyphens or underscores.
- Verbs in the past tense: `opened`, `loggedIn`, `shook` (not `open`, `shaked`).
- Activities and extensions as nouns: `controllerButton`, `pupilDiameter`.
- Contexts follow the same rule: `virtualWorld`, `eyeTracking`.

### English (`en-US`)

- **Names** are lowercase unless they contain a proper noun or abbreviation:
  `zoomed in`, `heart rate`, `IDE object`, `VR object`. Verbs in the past tense.
- **Descriptions** are full sentences ending with a period.
  - Verbs start with "An actor …" in the past tense: "An actor zoomed into a
    visual part of the game."
  - Activities start with "A …"/"An …": "A button to start a video."
  - Extensions describe the value and, where relevant, its type and unit: "The
    number of players in the game. Must be an integer."
- Put the unit of a measured value into the name in parentheses: `tracking
  error (deg)`, `window (s)`.
- Write "e.g." and "i.e." with periods; use "a UI element", "a URL" (not "an").

### German (`de-DE`)

- **Names**: Verbs in the simple past (Präteritum), separable verbs split:
  `öffnete`, `schloss ab`, `meldete sich an`. Nouns capitalized.
- **Descriptions** are full sentences ending with a period. Verbs start with
  "Ein Akteur …" in the simple past: "Ein Akteur vergrößerte einen sichtbaren
  Teil des Spiels."
- Use "Akteur" for the actor of a statement.
- Hyphenate compounds with abbreviations or English words: `VR-Objekt`,
  `Controller-Taste`, `HTML-Link`.
- Use "z. B." and a decimal comma: "zwischen 0,0 und 1,0".

## Submitting a change

1. Create a branch from `main` (or fork the repository).
2. Add or edit definition files. Keep one topic per pull request.
3. Run `make format` and `make check`. `make check` checks the formatting and
   the rules of this guide (`scripts/check-definitions.py`, see below) and
   builds the website, which validates every definition file.
4. Open a pull request against `main`. Its title becomes the CHANGELOG entry
   and decides the next version, so write it as a
   [Conventional Commit](https://www.conventionalcommits.org/):

   | Title | Use for | Version |
   |---|---|---|
   | `fix: correct German names in lms` | corrections of names, descriptions, formatting | patch |
   | `feat(virtualReality): add grabbed verb` | new definitions, contexts or fields | minor |
   | `feat!: move duration to extensions/activity` | renaming, moving or deleting a file (the IRI changes) | major |
   | `docs:`, `ci:`, `chore:` | changes that do not touch the registry | none |

   Do not edit `CHANGELOG.md` or `version.txt`. Several changes in one pull
   request can be listed as further Conventional Commit lines in the
   description of the squash commit.
5. The pull request must pass the checks **PR title**, **Definitions** and
   **Website**. It is merged with squash.
6. release-please collects the merged changes in a release pull request. When
   the maintainers merge it, the new version is tagged (`vX.Y.Z`), released on
   GitHub and shown on the website.

### What the checks enforce

For every file:

- `name` and `description` are language maps with valid language tags,
  non-empty texts and an `en-US` entry.
- Every `…Match` list, including nested ones such as
  `choices[].rules[].exactMatch`, is a non-empty list of distinct IRIs without
  spaces.
- A reference to this registry points to a definition that exists. The IRI of
  `a b.json` ends in `a_b`, so the reference must use `_` too.

For the files a pull request changes:

- Deleting or renaming a file is only allowed with `!` in the title, and a
  renamed file lists its old IRI in `exactMatch`.
- A former IRI (`https://xapi.elearn.rwth-aachen.de/…`) in `exactMatch` is
  not removed.
- New and renamed files and new contexts have lowerCamelCase names, and
  extensions are in `extensions/{activity,context,result}/`.
- A missing `de-DE` text is reported as a warning.

## Running the website locally

The website in `site/` needs the Node version from `site/.nvmrc`. With
[nvm](https://github.com/nvm-sh/nvm), run `nvm use` inside `site/` first.

```bash
make install   # npm ci
make dev       # http://localhost:4321/xapi
make build     # writes site/dist, fails on invalid definitions
```

Run `make` to list all targets.
