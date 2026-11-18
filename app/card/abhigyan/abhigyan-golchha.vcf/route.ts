import { readFileSync } from "node:fs";
import { join } from "node:path";
import { unseal } from "@/components/card/seal";
import { absoluteUrl, ORG } from "@/lib/site";
import { NAME, PERSON } from "../person";

export const dynamic = "force-static";

/* vCard 3.0, which every phone's contacts app reads: CRLF line endings,
   lines folded at 75 octets, the CoreValley mark as the contact's photo. */

const text = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`);

function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) parts.push(` ${line.slice(i, i + 74)}`);
  return parts.join("\r\n");
}

/** Abhigyan Golchha's contact file, written at build time. Nothing links to
 *  it in plain text: the card unseals its address with the phone and email. */
export function GET() {
  const photo = readFileSync(join(process.cwd(), "app/apple-icon.png")).toString("base64");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${text(NAME.family)};${text(NAME.given)};;;`,
    `FN:${text(PERSON.name)}`,
    `ORG:${text(PERSON.org)}`,
    `TITLE:${text(PERSON.title)}`,
    `TEL;TYPE=CELL,VOICE,PREF:${unseal(PERSON.sealed.phone)}`,
    `EMAIL;TYPE=INTERNET,WORK,PREF:${unseal(PERSON.sealed.email)}`,
    `item1.URL:${PERSON.linkedin}`,
    "item1.X-ABLabel:LinkedIn",
    `X-SOCIALPROFILE;TYPE=linkedin:${PERSON.linkedin}`,
    `item2.URL:${absoluteUrl("/")}`,
    "item2.X-ABLabel:Website",
    `ADR;TYPE=WORK:;;;${text(ORG.locality)};;;${text(ORG.countryName)}`,
    `PHOTO;ENCODING=b;TYPE=PNG:${photo}`,
    "END:VCARD",
  ];
  return new Response(`${lines.map(fold).join("\r\n")}\r\n`, {
    headers: { "Content-Type": "text/vcard; charset=utf-8" },
  });
}
