import type { Metadata } from "next";
import { BusinessCard, type CardPerson } from "@/components/card/business-card";
import { ValleyBackdrop } from "@/components/card/valley-backdrop";
import { ThemeToggle } from "@/components/chrome/theme-toggle";
import { asset } from "@/lib/links";
import { absoluteUrl, ORG } from "@/lib/site";
import { STORAGE, THEME_COLOR } from "@/lib/theme";
import "../card.css";

/* Abhigyan Golchha's digital business card at /card/abhigyan/. A standalone
   page, outside the marketing layout (no site header or footer). Shared by
   link or QR code, so it is kept out of search and out of the sitemap.

   The contact file and QR code are static files in public/card/. If a
   detail here changes, edit abhigyan-golchha.vcf to match (vCard 3.0, CRLF
   line endings; PHOTO is app/apple-icon.png in base64). The QR code encodes
   the page URL and was made with:
     qrencode -t SVG --svg-path -m 0 -l M -o public/card/abhigyan-qr.svg URL */

const PATH = "/card/abhigyan";

const PERSON: CardPerson = {
  name: "Abhigyan Golchha",
  title: "Managing Director",
  org: ORG.name,
  location: `${ORG.locality}, ${ORG.countryName}`,
  phone: "+9779801922288",
  phoneLabel: "+977 980-1922288",
  email: "abhigyan@corevalley.ai",
  linkedin: "https://www.linkedin.com/in/abhigyang/",
  linkedinLabel: "in/abhigyang",
  vcard: asset("/card/abhigyan-golchha.vcf"),
  qr: asset("/card/abhigyan-qr.svg"),
  markMask: asset("/brand/brandmark-mask.svg"),
  urlLabel: "corevalley.ai/card/abhigyan",
};

export const metadata: Metadata = {
  title: { absolute: `${PERSON.name} · ${PERSON.title}, ${PERSON.org}` },
  description: `${PERSON.title} at ${PERSON.org}, ${PERSON.location}. Save the contact, call, email or connect on LinkedIn.`,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    type: "profile",
    url: absoluteUrl(PATH),
    title: `${PERSON.name} · ${PERSON.title}, ${PERSON.org}`,
    description: `${PERSON.title} at ${PERSON.org}, ${PERSON.location}.`,
  },
  robots: { index: false, follow: false },
};

/* The site is dark unless a visitor picks light. A card is opened on someone
   else's phone, so here it follows their phone's setting until they choose
   with the toggle (a choice the rest of the site then keeps too). Runs
   before the card is painted. */
const FOLLOW_OS = `(function(){var t=null;try{t=localStorage.getItem(${JSON.stringify(STORAGE.theme)})}catch(e){}if(t==="light"||t==="dark")return;try{var l=window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches,v=l?"light":"dark";document.documentElement.setAttribute("data-theme",v);var m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++){m[i].content=l?${JSON.stringify(THEME_COLOR.light)}:${JSON.stringify(THEME_COLOR.dark)};m[i].removeAttribute("media")}}catch(e){}})();`;

export default function AbhigyanCard() {
  return (
    <main id="main" tabIndex={-1} className="vc-page">
      <script dangerouslySetInnerHTML={{ __html: FOLLOW_OS }} />
      <div className="vc-topbar">
        <ThemeToggle className="vc-theme" />
      </div>
      <ValleyBackdrop />
      <BusinessCard person={PERSON} />
      <footer className="vc-footer">
        <a href={absoluteUrl("/")}>corevalley.ai</a>
      </footer>
    </main>
  );
}
