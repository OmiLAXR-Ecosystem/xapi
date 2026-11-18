#!/usr/bin/env python3
"""Check the definition files against the rules of CONTRIBUTING.md.

Usage:
    check-definitions.py [--base REF] [--allow-breaking]

Always checked, for every file:
- The path is definitions/<context>/{verbs,activities}/<name>.json or
  definitions/<context>/extensions/{activity,context,result}/<name>.json, and
  context and file name are lowerCamelCase with ASCII letters and digits only.
  Fixing a wrong path changes the IRI: rename the file in a breaking change
  and list the old IRI in exactMatch.
- "name" and "description" are language maps with valid language tags,
  non-empty texts and an "en-US" entry.
- Every "...Match" list, also nested ones such as choices[].exactMatch, is a
  non-empty list of distinct IRIs without spaces.
- References to this registry point to a definition that exists. The IRI of
  "a b.json" ends in "a_b", so a reference must use "_" too.

Checked with --base, for the files changed since REF (merge base with HEAD):
- Deleting or renaming a definition changes its IRI. That is a breaking change
  and an error unless --allow-breaking is given (the pull request title is
  marked with "!", e.g. "feat!: ...").
- A renamed definition lists its old IRI in exactMatch. A deleted definition
  should be replaced: another definition lists its IRI in exactMatch
  (a warning otherwise).
- An IRI under a former registry base (see FORMER_BASES) that the file listed
  before is still listed.
- Added and changed files: a missing "de-DE" text is a warning.

Exit code 1 if there is an error. Warnings do not fail. On GitHub Actions the
findings are also printed as annotations.
"""

import json
import os
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFINITIONS = "definitions"
BASE = "https://omilaxr-ecosystem.github.io/xapi/"
FORMER_BASES = ["https://xapi.elearn.rwth-aachen.de/"]
TYPES = ("verbs", "activities", "extensions")
EXTENSION_TYPES = ("activity", "context", "result")

CAMEL_CASE = re.compile(r"^[a-z][a-zA-Z0-9]*$")
LANGUAGE_TAG = re.compile(r"^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$")
IRI = re.compile(r"^[a-zA-Z][a-zA-Z0-9+.-]*:\S+$")
ON_GITHUB = os.environ.get("GITHUB_ACTIONS") == "true"


class Report:
    def __init__(self) -> None:
        self.errors = 0
        self.warnings = 0

    def _print(self, level: str, file: str, message: str) -> None:
        print(f"{level}: {file}: {message}")
        if ON_GITHUB:
            print(f"::{level} file={file}::{message}")

    def error(self, file: str, message: str) -> None:
        self.errors += 1
        self._print("error", file, message)

    def warning(self, file: str, message: str) -> None:
        self.warnings += 1
        self._print("warning", file, message)


def git(*args: str) -> str:
    return subprocess.run(
        ["git", "-c", "core.quotepath=false", *args],
        cwd=ROOT, check=True, capture_output=True, text=True, encoding="utf-8",
    ).stdout


def definition_id(file: str) -> str:
    """definitions/a/verbs/b c.json -> a/verbs/b_c (same rule as site/src/lib/definitions.ts)."""
    return unicodedata.normalize("NFC", file[len(DEFINITIONS) + 1:]).removesuffix(".json").replace(" ", "_")


def iri(file: str, base: str = BASE) -> str:
    return f"{base}{DEFINITIONS}/{definition_id(file)}"


def parse(raw: str) -> dict | None:
    try:
        data = json.loads(raw.removeprefix("﻿"))
    except json.JSONDecodeError:
        return None  # the formatting check and the website build report invalid JSON
    return data if isinstance(data, dict) else None


def match_lists(value, path: str = ""):
    """Yields (path, list) for every "...Match" key, at any depth."""
    if isinstance(value, dict):
        for key, child in value.items():
            child_path = f"{path}/{key}"
            if key.endswith("Match"):
                yield child_path, child
            else:
                yield from match_lists(child, child_path)
    elif isinstance(value, list):
        for i, child in enumerate(value):
            yield from match_lists(child, f"{path}/{i}")


def check_references(files: dict[str, dict], report: Report) -> None:
    ids = {definition_id(f) for f in files}
    prefix = f"{BASE}{DEFINITIONS}/"
    for file, data in files.items():
        for path, entries in match_lists(data):
            for entry in entries if isinstance(entries, list) else []:
                if not isinstance(entry, str) or not entry.startswith(prefix):
                    continue
                # Exact match: the IRI of "a b.json" is ".../a_b", never ".../a b".
                if unicodedata.normalize("NFC", entry[len(prefix):]) not in ids:
                    report.error(file, f"{path} points to {entry}, which is not in the registry")


def check_language_map(file: str, data: dict, key: str, report: Report) -> None:
    value = data.get(key)
    if not isinstance(value, dict) or not value:
        report.error(file, f'"{key}" must be a non-empty language map')
        return
    for tag, text in value.items():
        if not LANGUAGE_TAG.match(tag):
            report.error(file, f'"{key}" has the invalid language tag "{tag}"')
        if not isinstance(text, str) or not text.strip():
            report.error(file, f'"{key}.{tag}" must be a non-empty string')
    if "en-US" not in value:
        report.error(file, f'"{key}" has no "en-US" text, which is mandatory')


def check_format(file: str, data: dict, report: Report) -> None:
    check_language_map(file, data, "name", report)
    check_language_map(file, data, "description", report)
    for path, entries in match_lists(data):
        if not isinstance(entries, list) or not entries:
            report.error(file, f"{path} must be a non-empty list (leave the key out instead of an empty list)")
            continue
        if len(set(map(str, entries))) != len(entries):
            report.error(file, f"{path} lists an IRI twice")
        for entry in entries:
            if not isinstance(entry, str) or not IRI.match(entry):
                report.error(file, f"{path} contains {entry!r}, which is not an IRI")


def check_path(file: str, report: Report) -> None:
    """definitions/<context>/{verbs,activities}/<name>.json or
    definitions/<context>/extensions/{activity,context,result}/<name>.json, all names lowerCamelCase."""
    parts = file.split("/")
    if not file.endswith(".json"):
        report.error(file, "only .json files belong into definitions/")
        return
    stem = parts[-1].removesuffix(".json")
    if not CAMEL_CASE.match(stem):
        report.error(file, f'file name "{stem}" must be lowerCamelCase with ASCII letters and digits only')
    if len(parts) < 4:
        report.error(file, "must be inside definitions/<context>/{verbs,activities,extensions}/")
        return
    context, kind = parts[1], parts[2]
    if not CAMEL_CASE.match(context):
        report.error(file, f'context "{context}" must be lowerCamelCase with ASCII letters and digits only')
    if kind not in TYPES:
        report.error(file, f'"{kind}" is not one of {", ".join(TYPES)}')
    elif kind == "extensions":
        if len(parts) != 5 or parts[3] not in EXTENSION_TYPES:
            report.error(file, f"extensions belong directly into extensions/{{{','.join(EXTENSION_TYPES)}}}/")
    elif len(parts) != 4:
        report.error(file, f"{kind} belong directly into {kind}/, without subfolders ({'/'.join(parts[3:-1])})")


def former_iris(data: dict | None) -> list[str]:
    entries = data.get("exactMatch") if data else None
    return [e for e in entries or [] if isinstance(e, str) and any(e.startswith(b) for b in FORMER_BASES)]


def changes(base: str) -> list[tuple[str, str, str | None]]:
    """(status, path, old path) for every changed definition file; status is A, M, D or R."""
    out = git("diff", "--name-status", "-z", "-M", "--no-ext-diff", f"{base}...HEAD", "--", DEFINITIONS)
    fields = out.split("\0")
    result = []
    i = 0
    while i < len(fields) - 1:
        status = fields[i][0]
        if status in "RC":
            old, new = fields[i + 1], fields[i + 2]
            result.append(("R", new, old) if status == "R" else ("A", new, None))
            i += 3
        else:
            result.append((status if status in "ADM" else "M", fields[i + 1], None))
            i += 2
    return result


def main(argv: list[str]) -> int:
    args = argv[:]
    allow_breaking = "--allow-breaking" in args
    if allow_breaking:
        args.remove("--allow-breaking")
    base = None
    if "--base" in args:
        i = args.index("--base")
        base = args[i + 1] if i + 1 < len(args) else None
        if not base:
            print("--base needs a git ref", file=sys.stderr)
            return 2

    report = Report()
    files: dict[str, dict] = {}
    for path in sorted(p for p in (ROOT / DEFINITIONS).rglob("*") if p.is_file()):
        file = unicodedata.normalize("NFC", path.relative_to(ROOT).as_posix())
        check_path(file, report)
        if path.suffix == ".json" and (data := parse(path.read_text("utf-8"))) is not None:
            files[file] = data
    for file, data in files.items():
        check_format(file, data, report)
    check_references(files, report)
    # Every IRI that some definition declares as exactMatch; a deleted definition should be one of them.
    replaced = {e for d in files.values() for e in d.get("exactMatch") or [] if isinstance(e, str)}

    changed = []
    if base:
        try:
            changed = changes(base)
        except subprocess.CalledProcessError as e:
            print(f"cannot diff against {base}: {e.stderr.strip()}", file=sys.stderr)
            return 2
        for status, file, old in changed:
            if status == "D":
                if not allow_breaking:
                    report.error(file, f"deleting a definition removes its IRI {iri(file)}. "
                                       "This is a breaking change: mark the pull request title with \"!\"")
                if iri(file) not in replaced:
                    report.warning(file, f"no definition lists the deleted IRI {iri(file)} in exactMatch; "
                                         "if another definition replaces it, add the IRI there")
                continue

            data = files.get(file)
            if data is None:
                continue  # invalid JSON, reported elsewhere
            for key in ("name", "description"):
                if isinstance(data.get(key), dict) and "de-DE" not in data[key]:
                    report.warning(file, f'"{key}" has no "de-DE" text')

            if status == "R" and definition_id(old) != definition_id(file):
                if not allow_breaking:
                    report.error(file, f"renaming {old} changes its IRI. "
                                       "This is a breaking change: mark the pull request title with \"!\"")
                if iri(old) not in (data.get("exactMatch") or []):
                    report.error(file, f"renamed from {old}: add its old IRI {iri(old)} to exactMatch")

            if status in "MR":
                before = parse(git("show", f"{base}:{old or file}"))
                for former in former_iris(before):
                    if former not in (data.get("exactMatch") or []):
                        report.error(file, f"exactMatch no longer lists the former IRI {former}. Do not remove it")

    scope = f"{len(changed)} changed since {base}" if base else "without --base: no checks of changes"
    print(f"{len(files)} definitions ({scope}): {report.errors} errors, {report.warnings} warnings")
    return 1 if report.errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
