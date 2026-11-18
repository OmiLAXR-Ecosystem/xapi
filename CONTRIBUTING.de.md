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
- Ist eine Umbenennung unvermeidbar, ist sie ein Breaking Change (`!` im Titel
  des Pull Requests). Trage die alte volle IRI in der verschobenen Datei unter
  `exactMatch` ein, damit Statements mit der alten IRI weiterhin zugeordnet
  werden können. Die Website zeigt sie dann als frühere IRI an und leitet die
  alte Adresse auf die neue Definition weiter. Werden zwei Definitionen
  zusammengeführt, führt die verbleibende die IRI der gelöschten.
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
- Dateinamen sind englisch, auch in Kontexten mit überwiegend deutschen Texten.
- Für Kontexte gilt dieselbe Regel: `virtualWorld`, `eyeTracking`. Sie dürfen
  mit einer Ziffer beginnen (`360tours`).
- Keine weiteren Unterordner: `activities/subscores/x.json` ist nicht erlaubt,
  die Gruppierung gehört in den Namen oder die Beschreibung.

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
3. Führe `make format` und `make check` aus. `make check` prüft die
   Formatierung und die Regeln dieses Leitfadens (`scripts/check-definitions.py`,
   siehe unten) und baut die Website, die dabei jede Definitionsdatei validiert.
4. Öffne einen Pull Request gegen `main`. Sein Titel wird zum Eintrag im
   CHANGELOG und bestimmt die nächste Version. Schreibe ihn deshalb als
   [Conventional Commit](https://www.conventionalcommits.org/de/):

   | Titel | Wofür | Version |
   |---|---|---|
   | `fix: correct German names in lms` | Korrekturen an Namen, Beschreibungen, Formatierung | patch |
   | `feat(virtualReality): add grabbed verb` | neue Definitionen, Kontexte oder Felder | minor |
   | `feat!: move duration to extensions/activity` | Umbenennen, Verschieben oder Löschen einer Datei (die IRI ändert sich) | major |
   | `docs:`, `ci:`, `chore:` | Änderungen, die die Registry nicht betreffen | keine |

   Bearbeite `CHANGELOG.md` und `version.txt` nicht. Mehrere Änderungen in
   einem Pull Request lassen sich als weitere Conventional-Commit-Zeilen in der
   Beschreibung des Squash-Commits aufführen.
5. Der Pull Request muss die Checks **PR title**, **Definitions** und
   **Website** bestehen. Er wird per Squash gemergt.
6. release-please sammelt die gemergten Änderungen in einem Release-Pull-Request.
   Sobald die Maintainer ihn mergen, wird die neue Version getaggt (`vX.Y.Z`),
   auf GitHub veröffentlicht und auf der Website angezeigt.

### Was die Checks prüfen

Für jede Datei:

- Der Pfad folgt [Aufbau des Repositorys](#aufbau-des-repositorys) ohne weitere
  Unterordner, Kontext und Dateiname folgen [Dateinamen](#dateinamen).
- `name` und `description` sind Language-Maps mit gültigen Sprach-Tags,
  nicht leeren Texten und einem Eintrag `en-US`.
- Jede `…Match`-Liste, auch verschachtelte wie `choices[].rules[].exactMatch`,
  ist eine nicht leere Liste verschiedener IRIs ohne Leerzeichen.
- Ein Verweis auf diese Registry zeigt auf eine existierende Definition. Die
  IRI von `a b.json` endet auf `a_b`, der Verweis muss also auch `_` verwenden.
  Nur das oberste `exactMatch` darf eine IRI enthalten, die es nicht mehr gibt:
  die frühere IRI einer umbenannten Definition. Ihr Pfad muss in der
  Git-History vorkommen, und nur eine Definition darf sie führen.

Für die Dateien, die ein Pull Request ändert:

- Löschen oder Umbenennen einer Datei ist nur mit `!` im Titel erlaubt, und
  eine umbenannte Datei führt ihre alte IRI in `exactMatch`. Eine gelöschte
  Datei, deren IRI keine andere Definition führt, wird als Warnung gemeldet.
- Eine frühere IRI (`https://xapi.elearn.rwth-aachen.de/…`) in `exactMatch`
  wird nicht entfernt.
- Ein fehlender Text `de-DE` wird als Warnung gemeldet.

Ob ein Name englisch ist, lässt sich nicht automatisch prüfen; das prüft das
Review.

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
