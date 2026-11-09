# Mitwirken

Danke, dass du die Registry erweitern möchtest. Diese Anleitung beschreibt, wie
Definitionen abgelegt werden, welche Konventionen für sie gelten und wie du eine
Änderung einreichst.

English version: [CONTRIBUTING.md](CONTRIBUTING.md). Hintergrund und
ursprüngliches Konzept der Registry stehen in [docs/concept.md](docs/concept.md).

## Aufbau des Repositorys

Jede Definition ist eine JSON-Datei:

```
definitions/<kontext>/verbs/<name>.json
definitions/<kontext>/activities/<name>.json
definitions/<kontext>/extensions/{activity,context,result}/<name>.json
```

- Ein **Kontext** fasst Definitionen eines Themas zusammen, z. B. `lms`,
  `eyeTracking` oder `generic`. Prüfe die vorhandenen Kontexte, bevor du einen
  neuen anlegst. Definitionen, die zu jedem Thema passen, gehören nach `generic`.
- Extensions kommen in den Unterordner, der ihrer Stelle im Statement
  entspricht: `activity` (`object.definition.extensions`), `context`
  (`context.extensions`) oder `result` (`result.extensions`).

## Der Dateipfad ist die IRI

Die IRI einer Definition ergibt sich aus ihrem Pfad unterhalb von
`definitions/`, ohne `.json`:

```
definitions/generic/verbs/opened.json
→ https://omilaxr-ecosystem.github.io/xapi/definitions/generic/verbs/opened
```

Sobald eine Definition gemergt ist, verwenden Statements ihre IRI. Deshalb gilt:

- **Gemergte Dateien nicht umbenennen, verschieben oder löschen.** Korrigiere
  stattdessen den Text in der Datei.
- Ist eine Umbenennung unvermeidbar, ist sie ein Breaking Change. Trage die alte
  volle IRI in der verschobenen Datei unter `exactMatch` ein, damit Statements mit der
  alten IRI weiterhin zugeordnet werden können, und markiere den Eintrag im
  CHANGELOG mit **BREAKING**.
- Wähle den Dateinamen sorgfältig, er lässt sich später nicht mehr korrigieren.
- Bis Version 1.x begannen die IRIs mit `https://xapi.elearn.rwth-aachen.de/`.
  Jede Definition aus dieser Zeit führt ihre frühere IRI als ersten Eintrag in
  `exactMatch`. Entferne sie nicht.

## Dateiformat

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

| Feld | Pflicht | Inhalt |
|---|---|---|
| `name` | ja | Language Map mit einer kurzen Bezeichnung |
| `description` | ja | Language Map mit einem oder mehreren ganzen Sätzen |
| `exactMatch` | nein | IRIs von Definitionen anderswo, die genau dasselbe bedeuten |
| `relatedMatch` | nein | IRIs von Definitionen anderswo, die ähnlich sind |

- `en-US` ist in `name` und `description` Pflicht und dient als Fallback für
  alle anderen Sprachen. `de-DE` wird dringend empfohlen. Weitere Sprachen sind
  willkommen.
- Durchsuche vor dem Anlegen diese und andere Registries (z. B.
  [ADL](http://adlnet.gov/expapi/verbs/), [Activity Streams](http://activitystrea.ms/schema/1.0/),
  [registry.tincanapi.com](https://registry.tincanapi.com)). Verwende eine
  vorhandene Definition, wenn sie passt. Verweise sonst in `exactMatch` oder
  `relatedMatch` auf ähnliche.
- Übernimm Match-IRIs exakt so, wie die jeweilige Registry sie definiert,
  einschließlich `http` oder `https`. Verwende nicht die URL einer Übersichtsseite.
- Lass `exactMatch` und `relatedMatch` weg, statt leere Listen einzutragen.

### Formatierung

Dateien sind UTF-8 ohne BOM, mit LF-Zeilenenden, 4 Leerzeichen Einrückung und
einem Zeilenumbruch am Ende. `make format` wendet das auf alle Dateien an,
`make check-format` prüft nur.

## Benennungs- und Schreibkonventionen

### Dateinamen

- lowerCamelCase, nur ASCII-Buchstaben und Ziffern: `zoomedIn.json`,
  `numberOfPlayers.json`. Keine Leerzeichen, Umlaute, Bindestriche oder
  Unterstriche.
- Verben in der Vergangenheitsform: `opened`, `loggedIn`, `shook` (nicht
  `open`, `shaked`).
- Activities und Extensions als Substantive: `controllerButton`,
  `pupilDiameter`.
- Für Kontexte gilt dieselbe Regel: `virtualWorld`, `eyeTracking`.

### Englisch (`en-US`)

- **Namen** werden kleingeschrieben, außer sie enthalten Eigennamen oder
  Abkürzungen: `zoomed in`, `heart rate`, `IDE object`, `VR object`. Verben in
  der Vergangenheitsform.
- **Beschreibungen** sind ganze Sätze mit Punkt am Ende.
  - Verben beginnen mit „An actor …“ in der Vergangenheitsform: „An actor zoomed
    into a visual part of the game.“
  - Activities beginnen mit „A …“/„An …“: „A button to start a video.“
  - Extensions beschreiben den Wert und, wo sinnvoll, Typ und Einheit: „The
    number of players in the game. Must be an integer.“
- Die Einheit eines Messwerts steht in Klammern im Namen: `tracking error (deg)`,
  `window (s)`.
- „e.g.“ und „i.e.“ mit Punkten schreiben; „a UI element“, „a URL“ (nicht „an“).

### Deutsch (`de-DE`)

- **Namen**: Verben im Präteritum, trennbare Verben getrennt: `öffnete`,
  `schloss ab`, `meldete sich an`. Substantive groß.
- **Beschreibungen** sind ganze Sätze mit Punkt am Ende. Verben beginnen mit
  „Ein Akteur …“ im Präteritum: „Ein Akteur vergrößerte einen sichtbaren Teil des
  Spiels.“
- Für den Handelnden eines Statements wird „Akteur“ verwendet.
- Komposita mit Abkürzungen oder englischen Wörtern mit Bindestrich: `VR-Objekt`,
  `Controller-Taste`, `HTML-Link`.
- „z. B.“ und Dezimalkomma verwenden: „zwischen 0,0 und 1,0“.

## Eine Änderung einreichen

1. Lege einen Branch von `main` an (oder forke das Repository).
2. Lege Definitionsdateien an oder bearbeite sie. Ein Thema pro Pull Request.
3. Führe `make format` und `make check` aus. `make check` baut die Website und
   validiert dabei jede Definitionsdatei.
4. Jede Änderung wird veröffentlicht, sobald sie gemergt ist. Lege oben in
   `CHANGELOG.md` eine neue Version mit heutigem Datum an
   (`## [X.Y.Z] - YYYY-MM-DD`) und ordne die Einträge in die Abschnitte von
   [Keep a Changelog](https://keepachangelog.com/de/1.1.0/) ein (**Added**,
   **Changed**, **Fixed**, **Removed**). Erhöhe die Version wie oben im
   CHANGELOG beschrieben: major, wenn sich eine IRI ändert, minor für neue
   Definitionen oder Felder, patch für Korrekturen. Markiere Umbenennungen und
   Löschungen mit **BREAKING**.
5. Öffne einen Pull Request gegen `main`. Der Website-Build läuft bei jedem Pull
   Request, der `definitions/` berührt.

## Website lokal starten

Die Website in `site/` braucht die Node-Version aus `site/.nvmrc`. Mit
[nvm](https://github.com/nvm-sh/nvm) führst du dafür zuerst `nvm use` in `site/`
aus.

```bash
make install   # npm ci
make dev       # http://localhost:4321/xapi
make build     # schreibt site/dist, schlägt bei ungültigen Definitionen fehl
```

`make` listet alle Targets auf.
