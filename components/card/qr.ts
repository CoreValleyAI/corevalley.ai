/**
 * A QR code encoder, small enough to ship with the card: text in byte mode
 * at error correction level L, the smallest version that holds it (1–40),
 * following ISO/IEC 18004. Level L suits a code shown on a screen, which
 * nothing scuffs, and keeps the modules as coarse as the text allows.
 *
 * The card draws its contact QR in the browser with this, from the
 * unsealed contact (./seal.ts), so no image of it sits in the site.
 */

/* Per version (index 1–40), at level L: error correction codewords per
   block, and the number of blocks. */
const ECC_PER_BLOCK = [
  0, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30,
  30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
];
const BLOCKS = [
  0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19,
  19, 20, 21, 22, 24, 25,
];
/** Format bits for level L. */
const LEVEL_L = 1;

const bit = (n: number, i: number) => ((n >>> i) & 1) !== 0;

/** Modules left for data and error correction once the patterns are drawn. */
function rawModules(v: number): number {
  let n = (16 * v + 128) * v + 64;
  if (v >= 2) {
    const align = Math.floor(v / 7) + 2;
    n -= (25 * align - 10) * align - 55;
    if (v >= 7) n -= 36;
  }
  return n;
}

const dataCodewords = (v: number) => Math.floor(rawModules(v) / 8) - (ECC_PER_BLOCK[v] ?? 0) * (BLOCKS[v] ?? 0);

/* Reed–Solomon over GF(256), modulo x^8 + x^4 + x^3 + x^2 + 1. */
function gfMul(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function rsDivisor(degree: number): number[] {
  const d = new Array<number>(degree).fill(0);
  d[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      d[j] = gfMul(d[j] ?? 0, root) ^ (d[j + 1] ?? 0);
    }
    root = gfMul(root, 2);
  }
  return d;
}

function rsRemainder(data: number[], divisor: number[]): number[] {
  const r = divisor.map(() => 0);
  for (const b of data) {
    const factor = b ^ (r.shift() ?? 0);
    r.push(0);
    divisor.forEach((c, i) => {
      r[i] = (r[i] ?? 0) ^ gfMul(c, factor);
    });
  }
  return r;
}

/** The data codewords, split into blocks, each given its error correction,
 *  and interleaved in the order they are placed. */
function codewords(text: Uint8Array, v: number): number[] {
  const bits: number[] = [];
  const put = (value: number, length: number) => {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  const capacity = dataCodewords(v) * 8;
  put(0b0100, 4); // byte mode
  put(text.length, v < 10 ? 8 : 16);
  for (const b of text) put(b, 8);
  put(0, Math.min(4, capacity - bits.length));
  put(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) put(pad, 8);

  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((n, b) => (n << 1) | b, 0));

  const blocks = BLOCKS[v] ?? 1;
  const eccLen = ECC_PER_BLOCK[v] ?? 0;
  const raw = Math.floor(rawModules(v) / 8);
  const shortBlocks = blocks - (raw % blocks);
  const shortLen = Math.floor(raw / blocks);
  const divisor = rsDivisor(eccLen);
  const split: { data: number[]; ecc: number[] }[] = [];
  for (let i = 0, k = 0; i < blocks; i++) {
    const len = shortLen - eccLen + (i < shortBlocks ? 0 : 1);
    const d = data.slice(k, k + len);
    k += len;
    split.push({ data: d, ecc: rsRemainder(d, divisor) });
  }
  const out: number[] = [];
  for (let i = 0; i <= shortLen - eccLen; i++) for (const b of split) if (i < b.data.length) out.push(b.data[i] ?? 0);
  for (let i = 0; i < eccLen; i++) for (const b of split) out.push(b.ecc[i] ?? 0);
  return out;
}

const MASKS: ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0,
  (_, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

/** The standard's penalty for a masked symbol; the lowest wins. */
function penalty(m: boolean[][]): number {
  const size = m.length;
  let score = 0;
  let dark = 0;
  const finderLike = [
    [true, false, true, true, true, false, true, false, false, false, false],
    [false, false, false, false, true, false, true, true, true, false, true],
  ];
  for (let a = 0; a < size; a++) {
    for (const line of [(b: number) => m[a]?.[b] ?? false, (b: number) => m[b]?.[a] ?? false]) {
      let run = 1;
      for (let b = 1; b <= size; b++) {
        if (b < size && line(b) === line(b - 1)) run++;
        else {
          if (run >= 5) score += run - 2;
          run = 1;
        }
      }
      for (let b = 0; b + 11 <= size; b++) {
        for (const p of finderLike) if (p.every((on, k) => line(b + k) === on)) score += 40;
      }
    }
    for (let b = 0; b < size; b++) {
      const c = m[a]?.[b] ?? false;
      if (c) dark++;
      if (a + 1 < size && b + 1 < size && c === m[a]?.[b + 1] && c === m[a + 1]?.[b] && c === m[a + 1]?.[b + 1]) score += 3;
    }
  }
  const total = size * size;
  score += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
  return score;
}

/** The QR code for `text`: rows of modules, true for dark, no quiet zone. */
export function qrEncode(text: string): boolean[][] {
  const bytes = new TextEncoder().encode(text);
  let v = 1;
  while (4 + (v < 10 ? 8 : 16) + bytes.length * 8 > dataCodewords(v) * 8) {
    if (++v > 40) throw new RangeError("Text too long for a QR code");
  }
  const size = v * 4 + 17;
  const mods = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const fixed = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const set = (x: number, y: number, on: boolean) => {
    const row = mods[y];
    const frow = fixed[y];
    if (!row || !frow || x < 0 || x >= size) return;
    row[x] = on;
    frow[x] = true;
  };

  // Timing, then the three finders over it, then the alignment patterns.
  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  for (const [cx, cy] of [
    [3, 3],
    [size - 4, 3],
    [3, size - 4],
  ] as const) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        if (cy + dy >= 0 && cy + dy < size) set(cx + dx, cy + dy, d !== 2 && d !== 4);
      }
    }
  }
  if (v >= 2) {
    const count = Math.floor(v / 7) + 2;
    const step = v === 32 ? 26 : Math.ceil((size - 13) / (count * 2 - 2)) * 2;
    const pos = [6];
    for (let p = size - 7; pos.length < count; p -= step) pos.splice(1, 0, p);
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        if ((i === 0 && j === 0) || (i === 0 && j === count - 1) || (i === count - 1 && j === 0)) continue;
        const cx = pos[i] ?? 0;
        const cy = pos[j] ?? 0;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) set(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }
  }

  const format = (mask: number) => {
    const data = (LEVEL_L << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++) set(8, i, bit(bits, i));
    set(8, 7, bit(bits, 6));
    set(8, 8, bit(bits, 7));
    set(7, 8, bit(bits, 8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(bits, i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(bits, i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(bits, i));
    set(8, size - 8, true);
  };
  format(0); // reserves the format areas; redrawn once the mask is chosen

  if (v >= 7) {
    let rem = v;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (v << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      set(a, b, bit(bits, i));
      set(b, a, bit(bits, i));
    }
  }

  // Codewords, two columns at a time, zigzagging up and down from the right.
  const cw = codewords(bytes, v);
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert;
        const row = mods[y];
        if (row && !fixed[y]?.[x] && i < cw.length * 8) {
          row[x] = bit(cw[i >>> 3] ?? 0, 7 - (i & 7));
          i++;
        }
      }
    }
  }

  const masked = (mask: number) => {
    const fn = MASKS[mask] ?? (() => false);
    return mods.map((row, y) => row.map((on, x) => (fixed[y]?.[x] ? on : on !== fn(x, y))));
  };
  let best = 0;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    format(mask);
    const s = penalty(masked(mask));
    if (s < bestScore) {
      best = mask;
      bestScore = s;
    }
  }
  format(best);
  return masked(best);
}

/** An SVG path of the dark modules, one unit each, runs merged per row. */
export function qrPath(m: boolean[][]): string {
  let d = "";
  m.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (!row[x]) continue;
      let run = 1;
      while (row[x + run]) run++;
      d += `M${x} ${y}h${run}v1h-${run}z`;
      x += run - 1;
    }
  });
  return d;
}
