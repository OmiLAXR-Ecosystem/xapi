# Changelog

All notable changes to this repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The file path of a definition is part of its IRI
(`https://xapi.elearn.rwth-aachen.de/definitions/<path>`). Renaming, moving or
deleting a definition file breaks existing statements. Such changes are always
listed under **Changed** or **Removed** and marked with **BREAKING**.

## [Unreleased]

### Changed

- Normalized the formatting of 615 definition files. They now use UTF-8 without
  BOM (80 files had one), LF line endings (2 files used CRLF), 4-space
  indentation (211 files used 2 spaces or tabs) and a trailing newline (405
  files had none). Formatting only: names, descriptions, matches and key order
  are unchanged.
