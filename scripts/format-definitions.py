#!/usr/bin/env python3
"""Normalize the formatting of the definition files.

Every file is rewritten as UTF-8 without BOM, with LF line endings, 4-space
indentation and a trailing newline. Only the formatting changes: values and
key order stay exactly as they are.

Usage:
    format-definitions.py [--check] [DIR]

DIR defaults to the definitions/ folder next to this script's parent.
With --check, no file is written; files that are not normalized are listed
and the exit code is 1.
"""

import json
import sys
from pathlib import Path


def normalize(raw: bytes) -> bytes:
    text = raw.decode("utf-8-sig")
    return (json.dumps(json.loads(text), indent=4, ensure_ascii=False) + "\n").encode("utf-8")


def main(argv: list[str]) -> int:
    check = "--check" in argv
    args = [a for a in argv if a != "--check"]
    root = Path(args[0]) if args else Path(__file__).resolve().parent.parent / "definitions"

    unformatted, invalid = [], []
    for path in sorted(root.rglob("*.json")):
        raw = path.read_bytes()
        try:
            formatted = normalize(raw)
        except (UnicodeDecodeError, json.JSONDecodeError) as e:
            invalid.append(f"{path}: {e}")
            continue
        if formatted != raw:
            unformatted.append(path)
            if not check:
                path.write_bytes(formatted)

    for line in invalid:
        print(f"invalid: {line}", file=sys.stderr)
    if check:
        for path in unformatted:
            print(f"not formatted: {path}")
        if unformatted:
            print(f"{len(unformatted)} file(s) need formatting, run: make format", file=sys.stderr)
    else:
        print(f"formatted {len(unformatted)} file(s)")

    return 1 if invalid or (check and unformatted) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
