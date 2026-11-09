// The definition file as committed, at <IRI path>.json. GitHub Pages can't do
// content negotiation, so machines fetch this instead of the HTML page.
import type { APIRoute, GetStaticPaths } from "astro";
import { getDefinitions, type Definition } from "../../lib/definitions";

export const getStaticPaths: GetStaticPaths = async () =>
  (await getDefinitions()).map((definition) => ({ params: { id: definition.id }, props: { definition } }));

export const GET: APIRoute = ({ props }) =>
  new Response((props as { definition: Definition }).definition.raw.replace(/^﻿/, ""), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
