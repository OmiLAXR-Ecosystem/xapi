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
