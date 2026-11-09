// Links inside the site. BASE_URL comes from `base` in astro.config.mjs.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function href(path = ""): string {
  return `${BASE}/${encodeURI(path.replace(/^\//, ""))}`;
}

export function definitionHref(id: string): string {
  return href(`definitions/${id}`);
}
