// The list ("Merkliste"): definition ids in localStorage, shareable as a
// compressed URL parameter. Replaces the server-side baskets of the old registry.
const KEY = "xapi-registry:list";
export const CHANGE_EVENT = "xapi-list-change";

export function getList(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function setList(ids: string[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    // Storage unavailable (private mode, blocked): the list just isn't kept.
  }
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function toggle(id: string): void {
  const list = getList();
  setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): Uint8Array {
  const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Blob([bytes]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

export async function encodeIds(ids: string[]): Promise<string> {
  const bytes = new TextEncoder().encode(ids.join("\n"));
  return toBase64Url(await pipe(bytes, new CompressionStream("deflate-raw")));
}

export async function decodeIds(text: string): Promise<string[]> {
  const bytes = await pipe(fromBase64Url(text), new DecompressionStream("deflate-raw"));
  return new TextDecoder().decode(bytes).split("\n").filter(Boolean);
}

/** Syncs every [data-list-toggle] button and [data-list-count] badge with the stored list. */
export function bindListButtons(root: ParentNode = document): void {
  const list = new Set(getList());
  root.querySelectorAll<HTMLButtonElement>("[data-list-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(list.has(button.dataset.listToggle!)));
    if (!button.dataset.bound) {
      button.dataset.bound = "1";
      button.addEventListener("click", () => toggle(button.dataset.listToggle!));
    }
  });
  document.querySelectorAll<HTMLElement>("[data-list-count]").forEach((el) => {
    el.textContent = list.size ? String(list.size) : "";
  });
}

document.addEventListener(CHANGE_EVENT, () => bindListButtons());
window.addEventListener("storage", (e) => e.key === KEY && bindListButtons());
