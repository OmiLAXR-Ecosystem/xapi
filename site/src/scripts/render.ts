// Client-side rendering of definition rows (search results, list page).
import { pick, t, typeLabel, type Lang } from "../lib/i18n";
import { definitionHref, href } from "../lib/url";
import type { IndexEntry } from "../lib/definitions";

export async function loadIndex(): Promise<IndexEntry[]> {
  const response = await fetch(href("search-index.json"));
  return response.json();
}

function escape(text: string): string {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export function rowHtml(entry: IndexEntry, lang: Lang): string {
  const name = escape(pick(entry.name, lang));
  const description = escape(pick(entry.description, lang));
  return `<li class="row">
  <button type="button" class="star" data-list-toggle="${escape(entry.id)}" aria-pressed="false" title="${escape(t("addToList", lang))}">
    <span class="star-icon" aria-hidden="true"></span><span class="sr-only">${escape(t("addToList", lang))}</span>
  </button>
  <div class="row-body">
    <div class="row-title">
      <a href="${definitionHref(entry.id)}">${name}</a>
      <span class="badge badge-${entry.type}">${escape(typeLabel(entry.type, lang))}</span>
      <a class="row-context" href="${href(`contexts/${entry.context}`)}">${escape(entry.context)}</a>
    </div>
    <p class="row-desc">${description}</p>
    <code class="row-iri">${escape(entry.iri)}</code>
  </div>
</li>`;
}

/** Writes a file for the user to save. */
export function download(filename: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function toCsv(rows: string[][]): string {
  // BOM so Excel opens UTF-8 (umlauts) correctly.
  return "﻿" + rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\r\n") + "\r\n";
}
