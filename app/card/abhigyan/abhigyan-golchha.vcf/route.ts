import { readFileSync } from "node:fs";
import { join } from "node:path";
import { vcardFile } from "@/components/card/vcard";
import { CONTACT } from "../person";

export const dynamic = "force-static";

/** Abhigyan Golchha's contact file, written at build time, with the
 *  CoreValley mark as the contact's photo. Nothing links to it in plain
 *  text: the card unseals its address with the phone and email. */
export function GET() {
  const photo = readFileSync(join(process.cwd(), "app/apple-icon.png")).toString("base64");
  return new Response(vcardFile(CONTACT, photo), {
    headers: { "Content-Type": "text/vcard; charset=utf-8" },
  });
}
