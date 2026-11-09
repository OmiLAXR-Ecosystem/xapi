// Every definition with its IRI. Replaces GET /d-api of the old registry.
import type { APIRoute } from "astro";
import { getDefinitions } from "../lib/definitions";

export const GET: APIRoute = async () => {
  const definitions = (await getDefinitions()).map((d) => ({
    iri: d.iri,
    id: d.id,
    context: d.context,
    type: d.type,
    definition: d.data,
  }));
  return new Response(JSON.stringify(definitions), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
