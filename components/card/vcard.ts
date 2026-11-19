/**
 * A contact as a vCard 3.0, the format every phone's contacts app reads,
 * in two cuts: the file the card's Save button opens, with every field and
 * a photo, and the short one its QR code holds, which a phone's camera
 * offers to add to Contacts as soon as it sees it.
 */

export interface VCard {
  given: string;
  family: string;
  org: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
  website: string;
  locality: string;
  country: string;
}

const text = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`);

/* Lines folded at 75 octets, continuations led by a space. */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) parts.push(` ${line.slice(i, i + 74)}`);
  return parts.join("\r\n");
}

/** The contact file: labelled links, the work address, and `photo` (a
 *  base64 PNG) as the contact's picture. CRLF line endings. */
export function vcardFile(c: VCard, photo: string): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${text(c.family)};${text(c.given)};;;`,
    `FN:${text(`${c.given} ${c.family}`)}`,
    `ORG:${text(c.org)}`,
    `TITLE:${text(c.title)}`,
    `TEL;TYPE=CELL,VOICE,PREF:${c.phone}`,
    `EMAIL;TYPE=INTERNET,WORK,PREF:${c.email}`,
    `item1.URL:${c.linkedin}`,
    "item1.X-ABLabel:LinkedIn",
    `X-SOCIALPROFILE;TYPE=linkedin:${c.linkedin}`,
    `item2.URL:${c.website}`,
    "item2.X-ABLabel:Website",
    `ADR;TYPE=WORK:;;;${text(c.locality)};;;${text(c.country)}`,
    `PHOTO;ENCODING=b;TYPE=PNG:${photo}`,
    "END:VCARD",
  ];
  return `${lines.map(fold).join("\r\n")}\r\n`;
}

/** The QR code's cut: name, company, title, phone, email and LinkedIn,
 *  nothing more, so the code stays coarse enough to scan off a screen. */
export function vcardQr(c: VCard): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${text(c.family)};${text(c.given)};;;`,
    `FN:${text(`${c.given} ${c.family}`)}`,
    `ORG:${text(c.org)}`,
    `TITLE:${text(c.title)}`,
    `TEL;TYPE=CELL:${c.phone}`,
    `EMAIL:${c.email}`,
    `URL:${c.linkedin}`,
    "END:VCARD",
  ].join("\r\n");
}
