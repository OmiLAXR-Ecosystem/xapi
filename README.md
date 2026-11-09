# xAPI

A repository to host definitions for xAPI verbs, activities and other related features.

Each definition is a JSON file at `definitions/<context>/<verbs|activities|extensions>/…/<name>.json`.
Its IRI is `https://omilaxr-ecosystem.github.io/xapi/definitions/<path without .json>`, with spaces replaced by `_`.
Renaming or moving a file changes the IRI. Up to version 1.x the IRIs started with `https://xapi.elearn.rwth-aachen.de/`;
every definition keeps its former IRI as the first entry of `exactMatch`.

## Website

`site/` builds a static website from `definitions/`: search, one page per definition with its history,
a shareable list, and the raw JSON of every definition at `definitions/<id>.json`
(all definitions: `definitions.json`). Every push to `main` deploys it to GitHub Pages
(`.github/workflows/pages.yml`). Pull requests only build it, which validates all definition files.

Run it locally (Node 22.23 or newer, see `site/.nvmrc`):

```bash
cd site
npm ci
npm run dev      # http://localhost:4321/xapi
npm run build    # writes site/dist, fails on invalid definitions
```

Environment variables: `SITE_URL` and `BASE_PATH` set where the site is served (CI takes them from the
Pages settings). `REGISTRY_URL` is the IRI base and defaults to `https://omilaxr-ecosystem.github.io/xapi/`.
