# xAPI

A repository to host definitions for xAPI verbs, activities and other related features.

**Browse the registry at <https://omilaxr-ecosystem.github.io/xapi/>.** The website lists every definition
with its IRI, description in English and German, and change history. You can search by name, description or
IRI (also former IRIs), collect definitions in a shareable list and export it as JSON or CSV. Each
definition's IRI is also its address on the website, so opening an IRI in the browser shows its definition.

Each definition is a JSON file at `definitions/<context>/{verbs,activities}/<name>.json` or
`definitions/<context>/extensions/{activity,context,result}/<name>.json`.
Its IRI is `https://omilaxr-ecosystem.github.io/xapi/definitions/<path without .json>`, with spaces replaced by `_`.
Renaming or moving a file changes the IRI. Up to version 1.x the IRIs started with `https://xapi.elearn.rwth-aachen.de/`;
every definition keeps its former IRI as the first entry of `exactMatch`.

## Versions

The registry follows [Semantic Versioning](https://semver.org/): a changed IRI is a major version, new
definitions a minor, corrections a patch. Each release is a tag `vX.Y.Z` with a GitHub release; the current
version is in `version.txt`, in the footer of the website and in `registry.json`. Pin a tag instead of `main`
to get a fixed set of definitions. Releases are made by release-please, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Website

`site/` builds a static website from `definitions/`: search, one page per definition with its history,
a shareable list, and the raw JSON of every definition at `definitions/<id>.json`
(all definitions: `definitions.json`). Every push to `main` deploys it to GitHub Pages
(`.github/workflows/pages.yml`). Pull requests build it in the "Website" check (`.github/workflows/checks.yml`).

Run it locally (Node 22.23 or newer, see `site/.nvmrc`):

```bash
cd site
npm ci
npm run dev      # http://localhost:4321/xapi
npm run build    # writes site/dist, fails on invalid definitions
```

Environment variables: `SITE_URL` and `BASE_PATH` set where the site is served (CI takes them from the
Pages settings). `REGISTRY_URL` is the IRI base and defaults to `https://omilaxr-ecosystem.github.io/xapi/`.

## Contributors

Everyone who has worked on the registry, from the first commit in January 2020 to version 2.0.0.
The history goes back to the original registry at [gitlab.com/learntech-rwth/xapi](https://gitlab.com/learntech-rwth/xapi).
The website's [about page](https://omilaxr-ecosystem.github.io/xapi/about#contributors) shows the same list.

### By person

*Active* is the period of the person's commits on `main`. *Created* counts the definitions per context whose file the
person added. *Edited* counts the definitions per context the person changed after they were added. Names link to
the person's page at the [Learning Technologies Research Group](https://learntech.rwth-aachen.de/) or at their
current research group, where one exists.

| Person | Active | Created | Edited |
| --- | --- | --- | --- |
| [Annabell Brocker](https://learntech.rwth-aachen.de/cms/learntech/Das-Lehr-und-Forschungsgebiet/Mitarbeiter/Wissenschaftliche-Mitarbeiterinnen-und-M/~hdcay/Annabell-Brocker/lidx/1/) | 2022-01 – 2024-08 | `projectJupyter` (1) | `projectJupyter` (10), `generic` (7), `seriousGames` (2), `systemControl` (2) |
| [Matthias Ehlenz](https://learntech.rwth-aachen.de/cms/learntech/Das-Lehr-und-Forschungsgebiet/Mitarbeiter/Ehemalige-Externe-Mitarbeiterinnen-und-M/~jygg/Matthias-Ehlenz/lidx/1/) | 2020-01 – 2024-03 | `lms` (40), `studybuddy` (3), `generic` (1), `rightsEngine` (1) | `gitanalysis` (48), `observation` (3) |
| [Jasper vom Felde](https://learntech.rwth-aachen.de/cms/learntech/Das-Lehr-und-Forschungsgebiet/Mitarbeiter/Ehemalige-Externe-Mitarbeiterinnen-und-M/~bfktdi/Jasper-vom-Felde/lidx/1/) | 2024-12 | `rightsEngine` (4) | `rightsEngine` (10) |
| Philipp Goerick | 2020-03 | `generic` (81), `seriousGames` (27), `multitouch` (17), `systemControl` (14), `ide` (1) | – |
| [Sergej Görzen](https://learntech.rwth-aachen.de/cms/learntech/Das-Lehr-und-Forschungsgebiet/Mitarbeiter/Wissenschaftliche-Mitarbeiterinnen-und-M/~nwbzq/Sergej-Goerzen/lidx/1/) | 2021-10 – 2026-11 | `ide` (46), `virtualReality` (44), `ppm` (30), `generic` (27), `eyeTracking` (22), `attention` (12), `facialTracking` (8), `gestures` (8), `systemControl` (8), `voice` (2), `assistanceSystem` (1) | `systemControl` (17), `eyeTracking` (13), `ide` (10), `generic` (7), `seriousGames` (5), `facialTracking` (4), `virtualReality` (4), `lms` (3), `ppm` (2), `attention` (1), `media` (1), `studybuddy` (1) |
| [Birte Heinemann](https://learntech.rwth-aachen.de/cms/learntech/Das-Lehr-und-Forschungsgebiet/Mitarbeiter/Wissenschaftliche-Mitarbeiterinnen-und-M/~dxpnu/Birte-Heinemann/lidx/1/) | 2020-06 – 2025-01 | `vrRfidChamber` (42), `tagformance` (37), `uhfReader` (18), `voice` (10), `generic` (2), `gestures` (1), `seriousGames` (1) | `generic` (48), `virtualReality` (10), `seriousGames` (7), `systemControl` (6), `vrRfidChamber` (5), `gestures` (2), `voice` (2), `attention` (1), `eyeTracking` (1), `lms` (1), `studybuddy` (1) |
| [Sven Judel](https://learntech.rwth-aachen.de/cms/learntech/Das-Lehr-und-Forschungsgebiet/Mitarbeiter/Wissenschaftliche-Mitarbeiterinnen-und-M/~rmjb/Sven-Judel/lidx/1/) | 2021-07 – 2025-12 | `lms` (45), `studybuddy` (12), `media` (11), `exerciseGenerator` (6), `rightsEngine` (6) | `lms` (46), `media` (10), `studybuddy` (5), `rightsEngine` (2) |
| Fredrik Konrad | 2022-01 | `seriousGames` (7) | – |
| [Sam Mattiussi](https://learntech.rwth-aachen.de/cms/learntech/Das-Lehr-und-Forschungsgebiet/Mitarbeiter/Ehemalige-Externe-Mitarbeiterinnen-und-M/~bdvydl/Sam-Mattiussi/lidx/1/) | 2023-04 | `assistanceSystem` (10) | `assistanceSystem` (9) |
| [Lars Florian Meiendresch](https://s3.paluno.uni-due.de/team/wissenschaftliche-mitarbeiterinnnen-und-mitarbeiter/lars-meiendresch) | 2022-02 – 2024-07 | `360tours` (13) | `360tours` (12), `vrRfidChamber` (3), `tagformance` (1) |
| Philip Niederprüm | 2022-11 | `seriousGames` (2) | – |
| Paul Rennecke | 2021-03 | `observation` (66) | `observation` (8) |
| Yanik Söltzer | 2021-05 – 2021-08 | `projectJupyter` (12), `generic` (10) | `generic` (50) |
| Marc Troll | 2023-07 – 2025-07 | – | `seriousGames` (1), `virtualReality` (1) |
| Lukas Witeczek | 2023-09 | `gitanalysis` (48) | – |

Work on the repository itself:

- Matthias Ehlenz set up the repository with license and contributing guide (2020-01), added the lint pipeline and
  restructured the definitions into contexts (2020-09).
- Philipp Goerick and Birte Heinemann wrote the first templates for definition files (2020-03 – 2020-06).
- Annabell Brocker pinned the JSON linter in the lint pipeline (2024-08).
- Sergej Görzen built the website, the formatting script, the CHANGELOG and the contributing guides, and prepared
  version 2.0.0 (2026-11).

### By context

*Active* is the period from the first to the last counted change to a definition of the context.

| Context | Definitions | Active | Created by | Edited by |
| --- | ---: | --- | --- | --- |
| `360tours` | 13 | 2024-06 – 2024-07 | Lars Florian Meiendresch (13) | Lars Florian Meiendresch (12) |
| `assistanceSystem` | 11 | 2023-04 – 2024-02 | Sam Mattiussi (10), Sergej Görzen (1) | Sam Mattiussi (9) |
| `attention` | 12 | 2021-10 – 2025-10 | Sergej Görzen (12) | Sergej Görzen (1), Birte Heinemann (1) |
| `exerciseGenerator` | 6 | 2024-09 – 2024-09 | Sven Judel (6) | – |
| `eyeTracking` | 22 | 2021-10 – 2025-10 | Sergej Görzen (22) | Sergej Görzen (13), Birte Heinemann (1) |
| `facialTracking` | 8 | 2025-10 – 2025-10 | Sergej Görzen (8) | Sergej Görzen (4) |
| `generic` | 121 | 2020-03 – 2025-10 | Philipp Goerick (81), Sergej Görzen (27), Yanik Söltzer (10), Birte Heinemann (2), Matthias Ehlenz (1) | Yanik Söltzer (50), Birte Heinemann (48), Annabell Brocker (7), Sergej Görzen (7) |
| `gestures` | 9 | 2021-10 – 2022-01 | Sergej Görzen (8), Birte Heinemann (1) | Birte Heinemann (2) |
| `gitanalysis` | 48 | 2023-09 – 2024-03 | Lukas Witeczek (48) | Matthias Ehlenz (48) |
| `ide` | 47 | 2020-03 – 2023-04 | Sergej Görzen (46), Philipp Goerick (1) | Sergej Görzen (10) |
| `lms` | 85 | 2020-09 – 2025-12 | Sven Judel (45), Matthias Ehlenz (40) | Sven Judel (46), Sergej Görzen (3), Birte Heinemann (1) |
| `media` | 11 | 2023-06 – 2026-11 | Sven Judel (11) | Sven Judel (10), Sergej Görzen (1) |
| `multitouch` | 17 | 2020-03 – 2020-03 | Philipp Goerick (17) | – |
| `observation` | 66 | 2021-03 – 2021-03 | Paul Rennecke (66) | Paul Rennecke (8), Matthias Ehlenz (3) |
| `ppm` | 30 | 2024-11 – 2025-10 | Sergej Görzen (30) | Sergej Görzen (2) |
| `projectJupyter` | 13 | 2021-05 – 2024-07 | Yanik Söltzer (12), Annabell Brocker (1) | Annabell Brocker (10) |
| `rightsEngine` | 11 | 2020-09 – 2024-12 | Sven Judel (6), Jasper vom Felde (4), Matthias Ehlenz (1) | Jasper vom Felde (10), Sven Judel (2) |
| `seriousGames` | 37 | 2020-03 – 2023-07 | Philipp Goerick (27), Fredrik Konrad (7), Philip Niederprüm (2), Birte Heinemann (1) | Birte Heinemann (7), Sergej Görzen (5), Annabell Brocker (2), Marc Troll (1) |
| `studybuddy` | 15 | 2020-09 – 2025-04 | Sven Judel (12), Matthias Ehlenz (3) | Sven Judel (5), Sergej Görzen (1), Birte Heinemann (1) |
| `systemControl` | 22 | 2020-03 – 2024-10 | Philipp Goerick (14), Sergej Görzen (8) | Sergej Görzen (17), Birte Heinemann (6), Annabell Brocker (2) |
| `tagformance` | 37 | 2021-04 – 2022-02 | Birte Heinemann (37) | Lars Florian Meiendresch (1) |
| `uhfReader` | 18 | 2021-04 – 2021-04 | Birte Heinemann (18) | – |
| `virtualReality` | 44 | 2021-10 – 2025-10 | Sergej Görzen (44) | Birte Heinemann (10), Sergej Görzen (4), Marc Troll (1) |
| `voice` | 12 | 2021-10 – 2022-07 | Birte Heinemann (10), Sergej Görzen (2) | Birte Heinemann (2) |
| `vrRfidChamber` | 42 | 2021-04 – 2022-02 | Birte Heinemann (42) | Birte Heinemann (5), Lars Florian Meiendresch (3) |

### How this is counted

The tables are derived from the git history of `main` for the definitions that exist today. A definition is credited
to the author of the commit that added its file. Renames and moves are followed (`git log --follow`), so a definition
keeps its author when its context changes. Authors are merged across their email addresses. Repository-wide
mechanical commits are not counted as edits: the restructurings of 2020 (`387d323`, `bc1b571`, `ef516a7`, `2948ce5`),
whitespace fixes (`7047532`, `10c6094`), the rename of `seriousgames` to `seriousGames` (`c4a2618`) and the 2.0.0
changes to all definitions (`b3c380f`, `2970625`, `a78124b`). Definitions that were removed later are not listed.
The history of each definition is shown on its page on the website.
