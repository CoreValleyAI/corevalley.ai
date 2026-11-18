import type { CardPerson } from "@/components/card/business-card";
import { seal } from "@/components/card/seal";
import { asset } from "@/lib/links";
import { ORG } from "@/lib/site";

/* Abhigyan Golchha's card, shared by the page and its contact file.

   The phone number and email are sealed (components/card/seal.ts): neither
   is written out in this repository or in the page. To change one, seal
   the new value with the command in that file and paste it here.

   The QR code (public/card/abhigyan-qr.svg) encodes the page's URL and was
   made with:
     qrencode -t SVG --svg-path -m 0 -l M -o public/card/abhigyan-qr.svg URL */

export const NAME = { given: "Abhigyan", family: "Golchha" };

/** The contact file, written at build time (./abhigyan-golchha.vcf/route.ts). */
const VCARD_PATH = "/card/abhigyan/abhigyan-golchha.vcf";

export const PERSON: CardPerson = {
  name: `${NAME.given} ${NAME.family}`,
  title: "Managing Director",
  org: ORG.name,
  location: `${ORG.locality}, ${ORG.countryName}`,
  linkedin: "https://www.linkedin.com/in/abhigyang/",
  linkedinLabel: "in/abhigyang",
  sealed: {
    phone: "Q34AMDDF5YuvWzEZNpM",
    phoneLabel: "Q34AMCnE7Yq7WDoZPJn65w",
    email: "CSVfbm6EtNTWCmxZa92js8X5D3NcYA",
    vcard: seal(asset(VCARD_PATH)),
  },
  qr: asset("/card/abhigyan-qr.svg"),
  markMask: asset("/brand/brandmark-mask.svg"),
  urlLabel: "corevalley.ai/card/abhigyan",
};
