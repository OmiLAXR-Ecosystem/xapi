// The definition file as committed, at <IRI path>.json. GitHub Pages can't do
// content negotiation, so machines fetch this instead of the HTML page.
import type { APIRoute, GetStaticPaths } from "astro";
import { getDefinitions, getRedirects, type Definition } from "../../lib/definitions";

// A renamed or merged definition is also served at its old id; its exactMatch lists the old IRI.
export const getStaticPaths: GetStaticPaths = async () => [
  ...(await getDefinitions()).map((definition) => ({ params: { id: definition.id }, props: { definition } })),
  ...(await getRedirects()).map(({ id, target }) => ({ params: { id }, props: { definition: target } })),
];

export const GET: APIRoute = ({ props }) =>
  new Response((props as { definition: Definition }).definition.raw.replace(/^﻿/, ""), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
