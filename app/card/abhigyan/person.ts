import type { CardPerson } from "@/components/card/business-card";
import { seal, unseal } from "@/components/card/seal";
import { vcardQr, type VCard } from "@/components/card/vcard";
import { asset } from "@/lib/links";
import { absoluteUrl, ORG } from "@/lib/site";

/* Abhigyan Golchha's card, shared by the page and its contact file.

   The phone number and email are sealed (components/card/seal.ts): neither
   is written out in this repository or in the page. To change one, seal
   the new value with the command in that file and paste it here. The QR
   code on the card's back holds the contact itself; the card draws it in
   the browser from a sealed copy, made below at build time. */

const PHONE = "Q34AMDDF5YuvWzEZNpM";
const PHONE_LABEL = "Q34AMCnE7Yq7WDoZPJn65w";
const EMAIL = "CSVfbm6EtNTWCmxZa92js8X5D3NcYA";

/** The contact file, written at build time (./abhigyan-golchha.vcf/route.ts). */
const VCARD_PATH = "/card/abhigyan/abhigyan-golchha.vcf";

/** The contact, unsealed at build for its file and QR code. Server only:
 *  the page gets PERSON, which carries it sealed. */
export const CONTACT: VCard = {
  given: "Abhigyan",
  family: "Golchha",
  org: ORG.name,
  title: "Managing Director",
  phone: unseal(PHONE),
  email: unseal(EMAIL),
  linkedin: "https://www.linkedin.com/in/abhigyang/",
  website: absoluteUrl("/"),
  locality: ORG.locality,
  country: ORG.countryName,
};

export const PERSON: CardPerson = {
  name: `${CONTACT.given} ${CONTACT.family}`,
  title: CONTACT.title,
  org: CONTACT.org,
  location: `${ORG.locality}, ${ORG.countryName}`,
  linkedin: CONTACT.linkedin,
  linkedinLabel: "in/abhigyang",
  sealed: {
    phone: PHONE,
    phoneLabel: PHONE_LABEL,
    email: EMAIL,
    vcard: seal(asset(VCARD_PATH)),
    qr: seal(vcardQr(CONTACT)),
  },
  markMask: asset("/brand/brandmark-mask.svg"),
  urlLabel: "corevalley.ai/card/abhigyan",
};
