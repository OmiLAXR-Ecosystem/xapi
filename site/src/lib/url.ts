// Links inside the site. BASE_URL comes from `base` in astro.config.mjs.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/**
 * The start page is BASE itself, without a trailing slash: the site uses trailingSlash "never",
 * so "/xapi/" does not resolve in `astro dev` and `astro preview`.
 */
export function href(path = ""): string {
  const rest = encodeURI(path.replace(/^\//, ""));
  if (rest === "" || rest.startsWith("?") || rest.startsWith("#")) return `${BASE || "/"}${rest}`;
  return `${BASE}/${rest}`;
}

export function definitionHref(id: string): string {
  return href(`definitions/${id}`);
}
