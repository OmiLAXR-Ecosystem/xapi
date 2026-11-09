// Current UI language. The inline script in Base.astro sets <html data-lang>
// before first paint; this module reads and switches it.
import type { Lang } from "../lib/i18n";

const KEY = "xapi-registry:lang";
export const LANG_EVENT = "xapi-lang-change";

export function getLang(): Lang {
  return document.documentElement.dataset.lang === "de" ? "de" : "en";
}

export function setLang(lang: Lang): void {
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    // Not persisted; the toggle still works for this page.
  }
  document.dispatchEvent(new CustomEvent(LANG_EVENT));
}
