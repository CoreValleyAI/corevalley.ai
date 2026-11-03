/**
 * Liquid glass inside a WebGL scene (docs/revamp/05 §4; the technique after
 * kube.io, Aave and Kyant's AndroidLiquidGlass). For DOM panels that sit
 * over one of our canvases — the hero's stat strip over the valley — the
 * scene draws the glass itself, so it is exact in every browser: the
 * backdrop is the scene's own pixels, blurred and refracted at the rim.
 *
 * Per frame, after the scene has drawn into the canvas:
 *   1. the canvas is copied down to half size (blitFramebuffer, linear);
 *   2. a dual-Kawase blur takes it to a quarter (down, down, up);
 *   3. each panel is one quad: a rounded rectangle whose rim bends the
 *      blurred backdrop inward (Snell's law over a convex-squircle bezel),
 *      tinted for the theme with a scrim that holds the text's contrast,
 *      lit along the rim, and lifted on a soft shadow.
 *
 * The page behind a transparent canvas is not in the canvas, so the backdrop
 * is the scene laid over the host's sky (its CSS gradient, rebuilt here).
 * The DOM element stays the source of truth: it carries the text, and its
 * CSS glass shows until the first glass frame and again on context loss.
 */
import { compileProgram, compileProgramAsync, uniforms } from "./core";

export interface GlassRect {
  /** Centre and half-size, drawing-buffer px, DOM orientation (y down). */
  cx: number;
  cy: number;
  hw: number;
  hh: number;
  r: number;
}

/** How one pane looks, beyond the theme's clear glass. */
export interface GlassStyle {
  /** Display-encoded tint and its strength (a coloured pane: a button). */
  tint?: readonly [number, number, number, number];
  /** Relative luminance of the text on the pane (for the contrast scrim). */
  textLum?: number;
  /** 0–1: the element's own opacity (entrance fades). */
  opacity?: number;
  /** 0–1: hover or press, which brightens the pane and its rim. */
  lift?: number;
}

export interface GlassLook {
  dark: boolean;
  /** Display-encoded colours (what the canvas holds). */
  bg: readonly [number, number, number];
  hydro: readonly [number, number, number];
  /** The host's sky: radial gradient centre (0–1 of the canvas), radii
      (fractions of width and height), the hydro share at the centre and
      the stop where it reaches the background. */
  sky: { cx: number; cy: number; rx: number; ry: number; mix: number; stop: number };
  /** How frosted the glass is (0 clear … 1 fully frosted); default by theme. */
  frost?: number;
  /** How much of the scene's light the glass gathers; default by theme. */
  gain?: number;
  /** A light in the scene, drawing-buffer px: the rim and glint turn toward
      it (weight 0–1) and brighten within `reach` px of it. Without it the
      light comes from the top left, as over the valley. */
  light?: { x: number; y: number; weight: number; reach: number };
  /** The drop shadow's strength (0–1); default by theme. Given, it is drawn
      out to where it ends instead of stopping at the pane's quad. */
  shadow?: number;
  /** Dither the glass: over a smooth scene (one soft light) its eight-bit
      blur would band. */
  dither?: boolean;
  /** How far into the bezel (0–1 of it) the scrim reaches full strength;
      default 1. Lower it where text sits close to the rim. */
  scrimEdge?: number;
}

export const FULLSCREEN_VS = /* glsl */ `#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const DOWN_FS = /* glsl */ `#version 300 es
precision mediump float;
uniform sampler2D u_src;
uniform vec2 u_half;
in vec2 v_uv;
out vec4 o;
void main() {
  o = (texture(u_src, v_uv) * 4.0
    + texture(u_src, v_uv - u_half) + texture(u_src, v_uv + u_half)
    + texture(u_src, v_uv + vec2(u_half.x, -u_half.y))
    + texture(u_src, v_uv - vec2(u_half.x, -u_half.y))) / 8.0;
}`;

const UP_FS = /* glsl */ `#version 300 es
precision mediump float;
uniform sampler2D u_src;
uniform vec2 u_half;
in vec2 v_uv;
out vec4 o;
void main() {
  vec2 h = u_half;
  o = (texture(u_src, v_uv + vec2(-2.0 * h.x, 0.0)) + texture(u_src, v_uv + vec2(-h.x, h.y)) * 2.0
    + texture(u_src, v_uv + vec2(0.0, 2.0 * h.y)) + texture(u_src, v_uv + vec2(h.x, h.y)) * 2.0
    + texture(u_src, v_uv + vec2(2.0 * h.x, 0.0)) + texture(u_src, v_uv + vec2(h.x, -h.y)) * 2.0
    + texture(u_src, v_uv + vec2(0.0, -2.0 * h.y)) + texture(u_src, v_uv + vec2(-h.x, -h.y)) * 2.0) / 12.0;
}`;

const PANEL_VS = /* glsl */ `#version 300 es
uniform vec2 u_res;
uniform vec2 u_center;
uniform vec2 u_halfSize;
uniform float u_pad;
void main() {
  vec2 corner = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1));
  vec2 px = u_center + (corner * 2.0 - 1.0) * (u_halfSize + u_pad);
  vec2 ndc = px / u_res * 2.0 - 1.0;
  gl_Position = vec4(ndc.x, -ndc.y, 0.0, 1.0);
}`;

const PANEL_FS = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D u_blur;     // the blurred scene, premultiplied
uniform sampler2D u_sharp;    // the scene at half size, barely softened
uniform float u_frost;        // 0 clear … 1 fully frosted
uniform float u_gain;         // light the glass gathers from the scene
uniform vec2 u_res;
uniform vec2 u_center;
uniform vec2 u_halfSize;
uniform float u_radius;
uniform float u_bezel;
uniform float u_thick;
uniform float u_ior;
uniform float u_disp;
uniform vec4 u_tint;          // rgb, strength
uniform float u_textLum;
uniform float u_minContrast;
uniform vec2 u_light;
uniform vec4 u_lightPos;      // a light in the scene: x, y (px), weight, reach (px); weight 0 = none
uniform float u_specular;
uniform float u_shadow;
uniform float u_opacity;
uniform float u_lift;
uniform float u_tinted;       // a coloured pane: tint mixed as displayed, so it stays saturated
uniform vec3 u_skyA;          // the sky at its centre
uniform vec3 u_skyB;          // the background
uniform vec4 u_sky;           // cx, cy, rx, ry (0-1 of the canvas)
uniform float u_skyStop;
uniform float u_dither;       // dither amplitude, in 8-bit steps; 0 = none
uniform float u_scrimEdge;    // where in the bezel the scrim is at full strength
out vec4 o;

const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
float srgbEncode(float x) { return x <= 0.0031308 ? 12.92 * x : 1.055 * pow(x, 1.0 / 2.4) - 0.055; }

float sdPanel(vec2 p, vec2 b, float r, out vec2 nrm) {
  vec2 s = vec2(p.x < 0.0 ? -1.0 : 1.0, p.y < 0.0 ? -1.0 : 1.0);
  vec2 q = abs(p) - (b - r);
  if (q.x > 0.0 && q.y > 0.0) {
    float len = length(q);
    nrm = s * q / max(len, 1e-4);
    return len - r;
  }
  nrm = q.x > q.y ? vec2(s.x, 0.0) : vec2(0.0, s.y);
  return max(q.x, q.y) - r;
}

float bezelHeight(float x) { float a = 1.0 - x; return pow(max(1.0 - a * a * a * a, 0.0), 0.25); }
float bezelSlope(float x) { float a = 1.0 - x; return a * a * a * pow(max(1.0 - a * a * a * a, 1e-5), -0.75); }

float refractShift(float x, float ior) {
  float t1 = atan(bezelSlope(x) * (u_thick / u_bezel));
  float t2 = asin(sin(t1) / ior);
  return u_thick * bezelHeight(x) * tan(t1 - t2);
}

vec3 sky(vec2 px) {
  vec2 uv = px / u_res;
  float t = length((uv - u_sky.xy) / u_sky.zw);
  return mix(u_skyA, u_skyB, clamp(t / u_skyStop, 0.0, 1.0));
}

vec3 backdrop(vec2 px) {
  vec2 uv = clamp(vec2(px.x, u_res.y - px.y) / u_res, 0.0, 1.0);
  vec4 s = mix(texture(u_sharp, uv), texture(u_blur, uv), u_frost);
  return s.rgb * u_gain + sky(px) * (1.0 - s.a);
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 p = px - u_center;
  vec2 nrm, nShadow, nSmooth;
  float d = sdPanel(p, u_halfSize, u_radius, nrm);
  float ds = sdPanel(p - vec2(0.0, u_bezel * 0.45), u_halfSize, u_radius, nShadow);
  float shadow = u_shadow * (1.0 - smoothstep(-u_bezel * 0.3, u_bezel * 1.6, ds));
  float coverage = clamp(0.5 - d, 0.0, 1.0);
  if (coverage <= 0.0) { o = vec4(0.0, 0.0, 0.0, shadow); return; }

  // Normals from a rounder copy of the shape: the rim turns its corners smoothly.
  float rN = min(max(u_radius, u_bezel * 1.5), min(u_halfSize.x, u_halfSize.y));
  sdPanel(p, u_halfSize, rN, nSmooth);

  float inside = -d;
  float x = clamp(inside / u_bezel, 0.0, 1.0);

  vec3 col;
  if (x < 1.0) {
    vec3 shift = vec3(refractShift(x, u_ior - u_disp), refractShift(x, u_ior), refractShift(x, u_ior + u_disp));
    col.r = backdrop(px - nSmooth * shift.r).r;
    col.g = backdrop(px - nSmooth * shift.g).g;
    col.b = backdrop(px - nSmooth * shift.b).b;
  } else {
    col = backdrop(px);
  }
  // Before the scrim, so the contrast it holds includes the dither.
  if (u_dither > 0.0) col = max(col + (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) * (u_dither / 255.0), 0.0);

  // Tint, then a scrim that guarantees the text's contrast (in linear light).
  // A coloured pane is mixed as displayed (mixing a dark green with white
  // in linear light would wash it out); clear glass is mixed in linear light.
  vec3 tint = pow(u_tint.rgb, vec3(2.2));
  vec3 lin = u_tinted > 0.5 ? pow(mix(col, u_tint.rgb, u_tint.a), vec3(2.2)) : mix(pow(col, vec3(2.2)), tint, u_tint.a);
  float Lb = dot(lin, LUMA), Lk = dot(tint, LUMA);
  bool lightText = u_textLum > Lk;
  float target = lightText ? (u_textLum + 0.05) / u_minContrast - 0.05 : u_minContrast * (u_textLum + 0.05) - 0.05;
  // That target is true (sRGB) luminance; carry it into the 2.2 space the
  // glass is mixed in, which reads the darks low (4.26:1 where 4.5 was meant).
  target = pow(srgbEncode(clamp(target, 0.0, 1.0)), 2.2);
  bool fails = lightText ? (Lb > target) : (Lb < target);
  float den = Lb - Lk;
  // The text sits inside the flat top, never on the bezel: the rim keeps
  // its refracted light; the scrim holds the contrast where the words are.
  if (fails && abs(den) > 1e-5) lin = mix(lin, tint, clamp((Lb - target) / den, 0.0, 1.0) * smoothstep(0.15, u_scrimEdge, x));
  col = pow(lin, vec3(1.0 / 2.2));

  // The rim: a glint where the bezel faces the light, Fresnel, and a fine edge line.
  // With a light in the scene, the rim faces it and brightens near it.
  vec2 Ld = u_light;
  float boost = 1.0;
  if (u_lightPos.z > 0.0) {
    vec2 toL = u_lightPos.xy - px;
    float dl = length(toL);
    vec2 m = mix(u_light, toL / max(dl, 1e-3), u_lightPos.z * smoothstep(0.0, 2.0 * u_bezel, dl));
    Ld = dot(m, m) > 1e-6 ? normalize(m) : u_light;
    boost = 1.0 + 0.6 * u_lightPos.z * exp(-dl * dl / max(u_lightPos.w * u_lightPos.w, 1.0));
  }
  float slope = bezelSlope(x) * (u_thick / u_bezel);
  vec3 N = normalize(vec3(nSmooth * slope, 1.0));
  vec3 H = normalize(normalize(vec3(Ld, 0.75)) + vec3(0.0, 0.0, 1.0));
  float glint = pow(max(dot(N, H), 0.0), 40.0) * (1.0 - x);
  float fresnel = pow(1.0 - N.z, 5.0);
  float facing = dot(nSmooth, Ld);
  float rimLine = (1.0 - smoothstep(0.0, 1.5, inside)) * (0.25 + 0.75 * max(facing, 0.0) + 0.35 * max(-facing, 0.0));
  col += (u_specular * boost * (u_tinted > 0.5 ? 0.5 : 1.0) + 0.35 * u_lift) * (0.55 * glint + 0.3 * fresnel + 0.7 * rimLine);
  col = mix(col, vec3(1.0), 0.07 * u_lift);

  vec4 res = vec4(min(col, vec3(1.0)) * coverage, coverage + shadow * (1.0 - coverage));
  o = res * u_opacity;
}`;

interface Target {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
  w: number;
  h: number;
}

export type GlassPass = ReturnType<typeof buildGlassPass>;

/** The glass pass, compiled now (the valley's: it is built in one go). */
export function createGlassPass(gl: WebGL2RenderingContext) {
  return buildGlassPass(
    gl,
    compileProgram(gl, FULLSCREEN_VS, DOWN_FS),
    compileProgram(gl, FULLSCREEN_VS, UP_FS),
    compileProgram(gl, PANEL_VS, PANEL_FS),
  );
}

/** The glass pass, compiled off the main thread where the browser can
    (KHR_parallel_shader_compile): for stages that mount while the page
    scrolls. */
export async function createGlassPassAsync(gl: WebGL2RenderingContext) {
  const [down, up, panel] = await Promise.all([
    compileProgramAsync(gl, FULLSCREEN_VS, DOWN_FS),
    compileProgramAsync(gl, FULLSCREEN_VS, UP_FS),
    compileProgramAsync(gl, PANEL_VS, PANEL_FS),
  ]);
  return buildGlassPass(gl, down, up, panel);
}

function buildGlassPass(gl: WebGL2RenderingContext, down: WebGLProgram, up: WebGLProgram, panel: WebGLProgram) {
  const ud = uniforms(gl, down);
  const uu = uniforms(gl, up);
  const up_ = uniforms(gl, panel);
  const vao = gl.createVertexArray()!; // no attributes: vertices come from gl_VertexID

  let targets: Target[] = [];
  let width = 0;
  let height = 0;

  const makeTarget = (w: number, h: number): Target => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error("glass: framebuffer");
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { tex, fbo, w, h };
  };
  const free = () => {
    for (const t of targets) {
      gl.deleteTexture(t.tex);
      gl.deleteFramebuffer(t.fbo);
    }
    targets = [];
  };

  const pass = (prog: WebGLProgram, u: (n: string) => WebGLUniformLocation | null, src: Target, dst: Target) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
    gl.viewport(0, 0, dst.w, dst.h);
    gl.useProgram(prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, src.tex);
    gl.uniform1i(u("u_src"), 0);
    gl.uniform2f(u("u_half"), 0.5 / src.w, 0.5 / src.h);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  return {
    resize(w: number, h: number) {
      if (w === width && h === height) return;
      width = w;
      height = h;
      free();
      const half = (n: number, k: number) => Math.max(1, Math.round(n / k));
      // half, quarter, eighth, and a quarter again for the way back up.
      targets = [
        makeTarget(half(w, 2), half(h, 2)),
        makeTarget(half(w, 4), half(h, 4)),
        makeTarget(half(w, 8), half(h, 8)),
        makeTarget(half(w, 4), half(h, 4)),
      ];
    },

    /** Blur what the canvas holds now, then draw the panels over it. */
    draw(panels: (GlassRect & GlassStyle)[], look: GlassLook) {
      if (!panels.length || targets.length < 4) return;
      const [t2, t4, t8, out] = targets as [Target, Target, Target, Target];
      gl.disable(gl.BLEND);
      gl.bindVertexArray(vao);

      // 1. The canvas, down to half size.
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, t2.fbo);
      gl.blitFramebuffer(0, 0, width, height, 0, 0, t2.w, t2.h, gl.COLOR_BUFFER_BIT, gl.LINEAR);
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);

      // 2. Dual Kawase: down, down, up.
      pass(down, ud, t2, t4);
      pass(down, ud, t4, t8);
      pass(up, uu, t8, out);

      // 3. The panels, over the canvas.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(panel);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, out.tex);
      gl.uniform1i(up_("u_blur"), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, t2.tex);
      gl.uniform1i(up_("u_sharp"), 1);
      gl.activeTexture(gl.TEXTURE0);
      // On Night Valley the scene is points of light on black: frosted, they
      // would vanish, so the glass is clearer and gathers their light.
      gl.uniform1f(up_("u_frost"), look.frost ?? (look.dark ? 0.32 : 0.62));
      gl.uniform1f(up_("u_gain"), look.gain ?? (look.dark ? 1.7 : 1));
      gl.uniform2f(up_("u_res"), width, height);
      // Lighter tints than the CSS glass: the scrim below holds the text's
      // contrast pixel by pixel, so the valley can show through.
      const clear = look.dark ? [15 / 255, 19 / 255, 25 / 255, 0.38] : [1, 1, 1, 0.44];
      const clearText = look.dark ? 0.9 : 0.012;
      gl.uniform1f(up_("u_minContrast"), 4.5);
      gl.uniform2f(up_("u_light"), -0.6, -0.8);
      const L = look.light;
      gl.uniform4f(up_("u_lightPos"), L?.x ?? 0, L?.y ?? 0, L ? L.weight : 0, L?.reach ?? 0);
      gl.uniform1f(up_("u_specular"), look.dark ? 0.5 : 0.6);
      gl.uniform1f(up_("u_shadow"), look.shadow ?? (look.dark ? 0.32 : 0.14));
      const skyA = look.bg.map((b, i) => b + (look.hydro[i]! - b) * look.sky.mix);
      gl.uniform3fv(up_("u_skyA"), skyA);
      gl.uniform3fv(up_("u_skyB"), look.bg);
      gl.uniform4f(up_("u_sky"), look.sky.cx, look.sky.cy, look.sky.rx, look.sky.ry);
      gl.uniform1f(up_("u_skyStop"), look.sky.stop);
      // Through the tint, 1.5 steps here come out at about half a step.
      gl.uniform1f(up_("u_dither"), look.dither ? 1.5 : 0);
      gl.uniform1f(up_("u_scrimEdge"), look.scrimEdge ?? 1);
      // Device pixels per CSS pixel: the bezel and padding are set in CSS px.
      const k = width / Math.max(1, (gl.canvas as HTMLCanvasElement).clientWidth || width);
      for (const r of panels) {
        const bezel = Math.max(4, Math.min(22 * k, r.hh * 0.85, r.hw * 0.8));
        gl.uniform4fv(up_("u_tint"), r.tint ?? clear);
        gl.uniform1f(up_("u_textLum"), r.textLum ?? clearText);
        gl.uniform1f(up_("u_opacity"), r.opacity ?? 1);
        gl.uniform1f(up_("u_lift"), r.lift ?? 0);
        gl.uniform1f(up_("u_tinted"), r.tint ? 1 : 0);
        gl.uniform2f(up_("u_center"), r.cx, r.cy);
        gl.uniform2f(up_("u_halfSize"), r.hw, r.hh);
        gl.uniform1f(up_("u_radius"), Math.min(r.r, r.hw, r.hh));
        gl.uniform1f(up_("u_bezel"), bezel);
        gl.uniform1f(up_("u_thick"), bezel * 1.9);
        gl.uniform1f(up_("u_ior"), 1.5);
        gl.uniform1f(up_("u_disp"), 0.03);
        // The shadow ends 2.05 bezels beyond the pane (offset plus falloff).
        gl.uniform1f(up_("u_pad"), look.shadow === undefined ? 28 * k : Math.max(28 * k, bezel * 2.1 + 2));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      gl.bindVertexArray(null);
    },

    dispose() {
      free();
      gl.deleteVertexArray(vao);
      gl.deleteProgram(down);
      gl.deleteProgram(up);
      gl.deleteProgram(panel);
    },
  };
}

/** Panels over a canvas, measured in its drawing-buffer pixels. */
export function measurePanels(canvas: HTMLCanvasElement, els: HTMLElement[]): GlassRect[] {
  const c = canvas.getBoundingClientRect();
  if (!c.width) return [];
  const k = canvas.width / c.width;
  return els.map((el) => {
    const b = el.getBoundingClientRect();
    return {
      cx: (b.left - c.left + b.width / 2) * k,
      cy: (b.top - c.top + b.height / 2) * k,
      hw: (b.width / 2) * k,
      hh: (b.height / 2) * k,
      r: (parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0) * k,
    };
  });
}
