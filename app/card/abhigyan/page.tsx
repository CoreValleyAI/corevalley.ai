import type { Metadata } from "next";
import { BusinessCard } from "@/components/card/business-card";
import { ValleyBackdrop } from "@/components/card/valley-backdrop";
import { ThemeToggle } from "@/components/chrome/theme-toggle";
import { absoluteUrl } from "@/lib/site";
import { STORAGE, THEME_COLOR } from "@/lib/theme";
import "../card.css";
import { PERSON } from "./person";

/* Abhigyan Golchha's digital business card at /card/abhigyan/. A standalone
   page, outside the marketing layout (no site header or footer). Shared by
   link or QR code, so it is kept out of search and out of the sitemap. The
   card's details, and how its phone and email are kept from harvesters,
   are in ./person.ts. */

const PATH = "/card/abhigyan";

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

/* Runs before the card is painted.

   Motion: the card always moves here, whatever the phone asks for. The
   turn, float and light sweep are the point of the page, and with reduced
   motion (which battery saver turns on for many phones) the card just cut
   from side to side and looked broken. Only this page; the rest of the site
   still follows the visitor's setting.

   Theme: the site is dark unless a visitor picks light. A card is opened on
   someone else's phone, so here it follows their phone's setting until they
   choose with the toggle (a choice the rest of the site then keeps too). */
const PAGE_PREFS = `(function(){document.documentElement.setAttribute("data-motion","full");var t=null;try{t=localStorage.getItem(${JSON.stringify(STORAGE.theme)})}catch(e){}if(t==="light"||t==="dark")return;try{var l=window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches,v=l?"light":"dark";document.documentElement.setAttribute("data-theme",v);var m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++){m[i].content=l?${JSON.stringify(THEME_COLOR.light)}:${JSON.stringify(THEME_COLOR.dark)};m[i].removeAttribute("media")}}catch(e){}})();`;

export default function AbhigyanCard() {
  return (
    <main id="main" tabIndex={-1} className="vc-page">
      <script dangerouslySetInnerHTML={{ __html: PAGE_PREFS }} />
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
