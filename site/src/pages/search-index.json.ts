// Compact rows for the client-side search and the list page.
import type { APIRoute } from "astro";
import { getDefinitions, toIndexEntry } from "../lib/definitions";

export const GET: APIRoute = async () =>
  new Response(JSON.stringify((await getDefinitions()).map(toIndexEntry)), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
