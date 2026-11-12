/**
 * Content-Security-Policy for the static export.
 *
 * GitHub Pages cannot send response headers, so every HTML file gets the
 * policy as <meta http-equiv="Content-Security-Policy">, placed right after
 * <meta charset> and before any script. Inline scripts are allowed only by
 * the SHA-256 of their exact text, computed per file after the build, so a
 * script injected into a page (by content, a dependency or a tampered build
 * step) does not run.
 *
 * A meta policy cannot carry frame-ancestors, report-to or sandbox; those
 * need real headers (a CDN in front of Pages).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const FORMS = "https://formsubmit.co";
const VIDEO = ["https://www.youtube-nocookie.com", "https://player.vimeo.com"];
const CMS = (process.env.NEXT_PUBLIC_CMS_ORIGINS || "https://cms.corevalley.ai")
  .split(",")
  .map((s) => s.trim())
  .filter((s) => /^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(s) || /^http:\/\/localhost(:\d+)?$/.test(s));

const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
const DATA_ONLY = /\btype\s*=\s*["']?application\/(ld\+)?json/i;

function hashes(html) {
  const out = new Set();
  for (const [, attrs, body] of html.matchAll(SCRIPT)) {
    if (/\bsrc\s*=/i.test(attrs) || DATA_ONLY.test(attrs)) continue;
    out.add(`'sha256-${crypto.createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }
  return [...out];
}

function policy(html, isCmsPreview) {
  const extra = isCmsPreview ? CMS : [];
  return [
    "default-src 'self'",
    `script-src 'self' ${hashes(html).join(" ")}`.trim(),
    // React renders style="" attributes (layout variables, animation delays).
    "style-src 'self' 'unsafe-inline'",
    ["img-src 'self' data:", ...extra].join(" "),
    "font-src 'self'",
    ["connect-src 'self'", FORMS, ...extra].join(" "),
    `form-action 'self' ${FORMS}`,
    `frame-src ${VIDEO.join(" ")}`,
    "media-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

const CHARSET = /<meta\s+char[sS]et\s*=\s*["']?utf-8["']?\s*\/?>/i;
const HEAD = /<head(\s[^>]*)?>/i;

function inject(file) {
  let html = fs.readFileSync(file, "utf8");
  // Rebuilds and a second pass replace the old policy instead of stacking them.
  html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/gi, "");
  const isCmsPreview = file.split(path.sep).includes("cms-preview");
  const tags =
    `<meta http-equiv="Content-Security-Policy" content="${policy(html, isCmsPreview)}">` +
    (/<meta\s+name=["']referrer["']/i.test(html) ? "" : `<meta name="referrer" content="strict-origin-when-cross-origin">`);
  const at = html.match(CHARSET) ?? html.match(HEAD);
  if (!at) throw new Error(`csp: ${file} has no <head> or <meta charset>; refusing to ship it without a policy`);
  const i = at.index + at[0].length;
  fs.writeFileSync(file, html.slice(0, i) + tags + html.slice(i));
}

/** Adds the policy to every .html file under `dir`. Returns the count. */
export function applyCsp(dir) {
  let n = 0;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith(".html")) {
        inject(full);
        n++;
      }
    }
  };
  walk(dir);
  return n;
}
