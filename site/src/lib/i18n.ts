// UI strings and language-map lookup. Used at build time and in client scripts.
export const LANGS = ["en", "de"] as const;
export type Lang = (typeof LANGS)[number];

const strings = {
  title: { en: "xAPI Definitions Registry", de: "xAPI Definitions Registry" },
  tagline: {
    en: "Open, community-maintained verbs, activities and extensions for xAPI statements.",
    de: "Offene, gemeinsam gepflegte Verben, Aktivitäten und Extensions für xAPI-Statements.",
  },
  search: { en: "Search", de: "Suche" },
  searchPlaceholder: { en: "Search by name, description or IRI …", de: "Nach Name, Beschreibung oder IRI suchen …" },
  allContexts: { en: "All contexts", de: "Alle Kontexte" },
  allTypes: { en: "All types", de: "Alle Typen" },
  contexts: { en: "Contexts", de: "Kontexte" },
  verbs: { en: "Verbs", de: "Verben" },
  activities: { en: "Activities", de: "Aktivitäten" },
  extensions: { en: "Extensions", de: "Extensions" },
  definitions: { en: "definitions", de: "Definitionen" },
  results: { en: "results", de: "Treffer" },
  nomatches: { en: "No definitions found", de: "Keine Definitionen gefunden" },
  loading: { en: "Loading …", de: "Wird geladen …" },
  name: { en: "Name", de: "Name" },
  desc: { en: "Description", de: "Beschreibung" },
  iri: { en: "IRI", de: "IRI" },
  formerIri: { en: "Former IRI", de: "Frühere IRI" },
  language: { en: "Language", de: "Sprache" },
  languages: { en: "Languages", de: "Sprachen" },
  matches: { en: "Related definitions", de: "Verwandte Definitionen" },
  moreFields: { en: "Further fields", de: "Weitere Felder" },
  rawJson: { en: "Raw JSON", de: "Rohes JSON" },
  history: { en: "History", de: "Historie" },
  noHistory: { en: "No history available.", de: "Keine Historie verfügbar." },
  date: { en: "Date", de: "Datum" },
  message: { en: "Commit message", de: "Commit-Nachricht" },
  author: { en: "Author", de: "Autor" },
  version: { en: "Version", de: "Version" },
  copy: { en: "Copy", de: "Kopieren" },
  copied: { en: "Copied", de: "Kopiert" },
  editOnGithub: { en: "Edit on GitHub", de: "Auf GitHub bearbeiten" },
  list: { en: "My list", de: "Merkliste" },
  addToList: { en: "Add to list", de: "Zur Merkliste" },
  inList: { en: "In list", de: "Auf der Merkliste" },
  remove: { en: "Remove", de: "Entfernen" },
  listEmpty: {
    en: "Your list is empty. Add definitions with the ☆ button.",
    de: "Die Merkliste ist leer. Definitionen lassen sich mit dem ☆-Button hinzufügen.",
  },
  listIntro: {
    en: "The list is stored in this browser only. Share it as a link or export it.",
    de: "Die Merkliste liegt nur in diesem Browser. Sie lässt sich als Link teilen oder exportieren.",
  },
  sharedList: { en: "Shared list", de: "Geteilte Liste" },
  sharedIntro: {
    en: "Someone shared this selection with you.",
    de: "Diese Auswahl wurde mit dir geteilt.",
  },
  adoptList: { en: "Add all to my list", de: "Alle in meine Merkliste übernehmen" },
  showMyList: { en: "Show my list", de: "Meine Merkliste anzeigen" },
  shareLink: { en: "Copy share link", de: "Teilen-Link kopieren" },
  exportJson: { en: "Export JSON", de: "JSON exportieren" },
  exportCsv: { en: "Export CSV", de: "CSV exportieren" },
  print: { en: "Print / PDF", de: "Drucken / PDF" },
  clear: { en: "Clear list", de: "Merkliste leeren" },
  clearConfirm: { en: "Remove all definitions from your list?", de: "Alle Definitionen von der Merkliste entfernen?" },
  unknownIds: { en: "Not found in the registry:", de: "Nicht in der Registry gefunden:" },
  about: { en: "About", de: "Über" },
  switchLang: { en: "Deutsch", de: "English" },
  sourceRepo: { en: "Definitions repository", de: "Definitions-Repository" },
  suggest: { en: "Suggest a definition", de: "Definition vorschlagen" },
  allJson: { en: "All definitions as JSON", de: "Alle Definitionen als JSON" },
  notFound: { en: "Page not found", de: "Seite nicht gefunden" },
  backHome: { en: "Back to the search", de: "Zurück zur Suche" },
} satisfies Record<string, Record<Lang, string>>;

export type StringKey = keyof typeof strings;

export function t(key: StringKey, lang: Lang): string {
  return strings[key][lang];
}

const LOCALE: Record<Lang, string> = { en: "en-US", de: "de-DE" };

/** Value of a language map for the UI language: exact locale, same language, English, then anything. */
export function pick(map: Record<string, string>, lang: Lang): string {
  const keys = Object.keys(map);
  const find = (prefix: string) => keys.find((k) => k.toLowerCase().startsWith(prefix));
  const key = map[LOCALE[lang]] !== undefined ? LOCALE[lang] : (find(lang) ?? (map["en-US"] !== undefined ? "en-US" : (find("en") ?? keys[0])));
  return key === undefined ? "" : map[key];
}

export function typeLabel(type: string, lang: Lang): string {
  return type === "verbs" || type === "activities" || type === "extensions" ? t(type, lang) : type;
}
