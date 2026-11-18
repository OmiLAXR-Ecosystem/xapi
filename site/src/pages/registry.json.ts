// Version and IRI base of the registry, for tools that check which release they use.
import type { APIRoute } from "astro";
import { FORMER_REGISTRY_URLS, REGISTRY_URL, REPO_URL, getDefinitions } from "../lib/definitions";
import { RELEASE_TAG, UNRELEASED, VERSION } from "../lib/version";

export const GET: APIRoute = async () => {
  const body = {
    version: VERSION,
    tag: RELEASE_TAG,
    /** Commits on definitions/ since the tag; null if unknown. The site is built from main. */
    unreleasedChanges: UNRELEASED,
    iriBase: REGISTRY_URL,
    formerIriBases: FORMER_REGISTRY_URLS,
    definitions: (await getDefinitions()).length,
    repository: REPO_URL,
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
