/**
 * Contact details kept away from harvesters.
 *
 * A business card hands out a phone number and an email address, but
 * neither has to sit in the page's HTML or in this public repository,
 * where bots collect them in bulk. Sealed, each is a run of letters that
 * matches no phone or email pattern; the card unseals them in the visitor's
 * browser on their first touch, click or key press, so a bot that loads the
 * page, with or without running its scripts, finds neither.
 *
 * This keeps them from machines, not from people: whoever opens the card
 * can read the number, as on a printed one, and the key is in the page's
 * script. Used by the card (in the browser) and its contact file (at build).
 *
 * To seal a new value (Node 23.6 or later runs this file as it is):
 *   node -e 'import("./components/card/seal.ts").then((m) => console.log(m.seal("…")))'
 */

const KEY = "corevalley.ai/card";

/** Its own inverse: mixing a sealed value's bytes gives the plain ones back. */
function mix(bytes: Uint8Array): Uint8Array {
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    out[i] = (bytes[i] ?? 0) ^ KEY.charCodeAt(i % KEY.length) ^ ((i * 29 + 11) & 0xff);
  }
  return out;
}

export function seal(text: string): string {
  const bytes = mix(new TextEncoder().encode(text));
  return btoa(String.fromCharCode(...bytes)).replace(/=+$/, "");
}

export function unseal(sealed: string): string {
  const bin = atob(sealed + "=".repeat((4 - (sealed.length % 4)) % 4));
  return new TextDecoder().decode(mix(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
}
