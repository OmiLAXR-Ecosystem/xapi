// Reads every definition file from ../definitions at build time, derives its
// id and IRI and validates it. A validation error fails the build.
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

export const REPO_ROOT = path.resolve(process.cwd(), "..");
export const DEFINITIONS_DIR = path.join(REPO_ROOT, "definitions");

/** Base of every IRI. It is the identifier, independent of where this site is hosted. */
export const REGISTRY_URL = withSlash(process.env.REGISTRY_URL || "https://xapi.elearn.rwth-aachen.de/");
export const REPO_URL = (process.env.REPO_URL || "https://github.com/OmiLAXR-Ecosystem/xapi").replace(/\/$/, "");

export const TYPES = ["verbs", "activities", "extensions"] as const;
export type DefinitionType = (typeof TYPES)[number];

export type LanguageMap = Record<string, string>;

export interface Commit {
  hash: string;
  date: string;
  author: string;
  message: string;
  /** Repo-relative path of the file in this commit (differs after a rename). */
  file: string;
}

export interface Definition {
  /** Path below definitions/ without ".json", spaces replaced by "_". */
  id: string;
  /** Repo-relative path of the source file. */
  file: string;
  iri: string;
  context: string;
  type: DefinitionType;
  /** Folders between the type folder and the file, e.g. ["activity"] for extensions. */
  group: string[];
  name: LanguageMap;
  description: LanguageMap;
  /** The parsed file. */
  data: Record<string, unknown>;
  /** The file content as committed. */
  raw: string;
  history: Commit[];
}

function withSlash(url: string): string {
  return url.endsWith("/") ? url : url + "/";
}

/** Same rule as the old registry (xAPI-frontend buildDatabase.ts): spaces become "_". */
export function toId(relativePath: string): string {
  return relativePath.normalize("NFC").replace(/\.json$/, "").split(" ").join("_");
}

/**
 * Route parameter for the HTML page of a definition. Astro turns a trailing "index"
 * into a directory index, so such ids are built under a placeholder that
 * astro.config.mjs renames back to index.html after the build.
 */
export const INDEX_PLACEHOLDER = "__index__";
export function pageParam(id: string): string {
  return id.replace(/(^|\/)index$/, `$1${INDEX_PLACEHOLDER}`);
}

export function toIri(id: string): string {
  return `${REGISTRY_URL}definitions/${id}`;
}

async function listFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(full)));
    else files.push(full);
  }
  return files;
}

function isLanguageMap(value: unknown): value is LanguageMap {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0 &&
    Object.values(value).every((v) => typeof v === "string" && v.trim() !== "")
  );
}

async function readHistory(file: string): Promise<Commit[]> {
  const { stdout } = await run(
    "git",
    ["-c", "core.quotepath=false", "log", "--follow", "--name-only", "--format=%x1e%H%x1f%aI%x1f%an%x1f%s", "--", file],
    { cwd: REPO_ROOT, maxBuffer: 16 * 1024 * 1024 },
  );
  return stdout
    .split("\x1e")
    .filter((chunk) => chunk.trim())
    .map((chunk) => {
      const [header, ...rest] = chunk.split("\n");
      const [hash, date, author, message] = header.split("\x1f");
      return { hash, date, author, message, file: rest.find((l) => l.trim()) ?? file };
    });
}

/** Runs fn over items with at most `limit` calls in flight. */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

async function hasGit(): Promise<boolean> {
  try {
    await run("git", ["rev-parse", "--is-inside-work-tree"], { cwd: REPO_ROOT });
    return true;
  } catch {
    return false;
  }
}

async function load(): Promise<Definition[]> {
  const files = (await listFiles(DEFINITIONS_DIR)).sort();
  const errors: string[] = [];
  const warnings: string[] = [];
  const byId = new Map<string, Definition>();

  for (const full of files) {
    const rel = path.relative(DEFINITIONS_DIR, full).split(path.sep).join("/");
    const file = `definitions/${rel}`;
    if (!rel.endsWith(".json")) {
      errors.push(`${file}: not a .json file`);
      continue;
    }

    const segments = rel.split("/");
    const [context, type] = segments;
    if (segments.length < 3 || !TYPES.includes(type as DefinitionType)) {
      errors.push(`${file}: must be inside <context>/{${TYPES.join(",")}}/`);
      continue;
    }

    const raw = await fs.readFile(full, "utf8");
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(raw.replace(/^﻿/, ""));
    } catch (e) {
      errors.push(`${file}: invalid JSON (${(e as Error).message})`);
      continue;
    }

    if (!isLanguageMap(data.name)) errors.push(`${file}: "name" must be a non-empty language map`);
    if (!isLanguageMap(data.description)) errors.push(`${file}: "description" must be a non-empty language map`);
    if (!isLanguageMap(data.name) || !isLanguageMap(data.description)) continue;
    if (!data.name["en-US"]) warnings.push(`${file}: no en-US name`);

    const id = toId(rel);
    const existing = byId.get(id);
    if (existing) {
      errors.push(`${file}: same IRI as ${existing.file} (${toIri(id)})`);
      continue;
    }

    byId.set(id, {
      id,
      file,
      iri: toIri(id),
      context: context.normalize("NFC"),
      type: type as DefinitionType,
      group: segments.slice(2, -1).map((s) => s.normalize("NFC")),
      name: data.name,
      description: data.description,
      data,
      raw,
      history: [],
    });
  }

  if (errors.length) {
    throw new Error(`Invalid definitions:\n  ${errors.join("\n  ")}`);
  }
  if (warnings.length) {
    console.warn(`[definitions] ${warnings.length} definitions have no en-US name (English is the expected fallback).`);
  }

  const definitions = [...byId.values()];
  if (await hasGit()) {
    const histories = await mapLimit(definitions, 16, (d) => readHistory(d.file));
    definitions.forEach((d, i) => (d.history = histories[i]));
  } else {
    console.warn("[definitions] not a git checkout, history is empty");
  }
  return definitions;
}

let cache: Promise<Definition[]> | undefined;

/** All definitions, loaded once per build. */
export function getDefinitions(): Promise<Definition[]> {
  return (cache ??= load());
}

export async function getContexts(): Promise<{ name: string; counts: Record<DefinitionType, number> }[]> {
  const contexts = new Map<string, Record<DefinitionType, number>>();
  for (const d of await getDefinitions()) {
    const counts = contexts.get(d.context) ?? { verbs: 0, activities: 0, extensions: 0 };
    counts[d.type]++;
    contexts.set(d.context, counts);
  }
  return [...contexts].map(([name, counts]) => ({ name, counts })).sort((a, b) => a.name.localeCompare(b.name));
}

/** Resolves an IRI found inside a definition (e.g. in exactMatch) to a definition of this registry. */
export async function findByIri(iri: string): Promise<Definition | undefined> {
  if (!iri.startsWith(`${REGISTRY_URL}definitions/`)) return undefined;
  const id = toId(iri.slice(`${REGISTRY_URL}definitions/`.length));
  return (await getDefinitions()).find((d) => d.id === id);
}

/** Rows for the client-side search and the list page. */
export function toIndexEntry(d: Definition) {
  const matches = Object.entries(d.data)
    .filter(([k, v]) => k.endsWith("Match") && Array.isArray(v))
    .flatMap(([, v]) => v as unknown[])
    .filter((v): v is string => typeof v === "string");
  return { id: d.id, iri: d.iri, context: d.context, type: d.type, name: d.name, description: d.description, matches };
}

export type IndexEntry = ReturnType<typeof toIndexEntry>;
