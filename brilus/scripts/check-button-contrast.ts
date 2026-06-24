/**
 * Automated visual/contrast check for CTA buttons.
 *
 * Validates the Brilus Design System button variants against WCAG 2.1 contrast
 * requirements for both base and hover states, including hover-on-dark scenarios.
 *
 * Usage: bun run scripts/check-button-contrast.ts
 *
 * Exit code: 0 = all pass, 1 = failures found.
 */

import fs from "node:fs";
import path from "node:path";

// ──────────────────────────────────────────────────────────────────────────────
// Color utilities
// ──────────────────────────────────────────────────────────────────────────────

type RGB = { r: number; g: number; b: number };

const hexToRgb = (hex: string): RGB => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
};

const hslToRgb = (h: number, s: number, l: number): RGB => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
};

/** Composite a foreground (with alpha 0..1) over a solid background. */
const composite = (fg: RGB, alpha: number, bg: RGB): RGB => ({
  r: Math.round(fg.r * alpha + bg.r * (1 - alpha)),
  g: Math.round(fg.g * alpha + bg.g * (1 - alpha)),
  b: Math.round(fg.b * alpha + bg.b * (1 - alpha)),
});

const relLuminance = ({ r, g, b }: RGB): number => {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

const contrastRatio = (a: RGB, b: RGB): number => {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};

// ──────────────────────────────────────────────────────────────────────────────
// Parse design tokens from index.css
// ──────────────────────────────────────────────────────────────────────────────

const cssPath = path.resolve("src/index.css");
const cssText = fs.readFileSync(cssPath, "utf8");

const parseHslTokens = (css: string): Record<string, RGB> => {
  // Match lines like:  --brand-coral: 12 97% 62%;
  const rootBlock = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (!rootBlock) throw new Error("Could not find :root block in index.css");
  const tokens: Record<string, RGB> = {};
  const re = /--([a-z0-9-]+):\s*([0-9.]+)\s+([0-9.]+)%\s+([0-9.]+)%/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rootBlock[1])) !== null) {
    const [, name, h, s, l] = m;
    tokens[name] = hslToRgb(parseFloat(h), parseFloat(s), parseFloat(l));
  }
  return tokens;
};

const tokens = parseHslTokens(cssText);

// Resolve a Tailwind-ish color reference to RGB.
const resolveColor = (ref: string): RGB => {
  if (ref.startsWith("#")) return hexToRgb(ref);
  if (ref.startsWith("hsl(")) {
    const m = ref.match(/hsl\(\s*([0-9.]+)[,\s]+([0-9.]+)%[,\s]+([0-9.]+)%/);
    if (!m) throw new Error(`Bad hsl(): ${ref}`);
    return hslToRgb(+m[1], +m[2], +m[3]);
  }
  // Token name (e.g. "brand-white", "foreground")
  const t = tokens[ref];
  if (!t) throw new Error(`Unknown token: --${ref}`);
  return t;
};

// ──────────────────────────────────────────────────────────────────────────────
// Parse button variants from src/components/ui/button.tsx
// ──────────────────────────────────────────────────────────────────────────────

const buttonPath = path.resolve("src/components/ui/button.tsx");
const buttonText = fs.readFileSync(buttonPath, "utf8");

interface VariantStyle {
  name: string;
  bg?: string;       // base background (hex, hsl(), or token)
  bgAlpha?: number;  // 0..1
  text?: string;
  textAlpha?: number;
  hoverBg?: string;
  hoverBgAlpha?: number;
  hoverText?: string;
  hoverTextAlpha?: number;
  hasBorder?: boolean;
}

const TAILWIND_NAMED: Record<string, string> = {
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
};

/** Parse a single Tailwind class into structured info. */
const parseClass = (cls: string) => {
  // Strip "hover:" prefix
  const isHover = cls.startsWith("hover:");
  const c = isHover ? cls.slice(6) : cls;

  // Match arbitrary value: bg-[#1F1F1F] / text-[rgba(0,0,0,0.1)]
  const arb = c.match(/^(bg|text|border)-\[([^\]]+)\]$/);
  if (arb) {
    return { isHover, prop: arb[1], value: arb[2], alpha: 1 };
  }

  // Match token form with optional /alpha:  bg-brand-white/10  text-brand-coral
  const tok = c.match(/^(bg|text|border)-([a-z0-9-]+(?:-(?:10|25|50))?)(?:\/(\d+))?$/);
  if (tok) {
    const [, prop, name, alphaStr] = tok;
    let value = name;
    if (TAILWIND_NAMED[name]) value = TAILWIND_NAMED[name];
    const alpha = alphaStr ? parseInt(alphaStr, 10) / 100 : 1;
    return { isHover, prop, value, alpha };
  }

  if (c.startsWith("border-")) return { isHover, prop: "border", value: c, alpha: 1 };
  return null;
};

const parseVariants = (src: string): VariantStyle[] => {
  // Grab the contents of the `variant: { ... }` object inside cva config.
  const variantsBlock = src.match(/variant:\s*\{([\s\S]*?)\n\s{6}\}/);
  if (!variantsBlock) throw new Error("Could not find variants block in button.tsx");
  const block = variantsBlock[1];

  const out: VariantStyle[] = [];
  // Each entry: optional quotes around key, then : "classes"
  const entryRe = /(?:"([^"]+)"|([a-zA-Z_-]+))\s*:\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(block)) !== null) {
    const name = m[1] ?? m[2];
    const classes = m[3].split(/\s+/);
    const v: VariantStyle = { name };
    for (const cls of classes) {
      const p = parseClass(cls);
      if (!p) continue;
      if (p.prop === "bg") {
        if (p.isHover) {
          v.hoverBg = p.value;
          v.hoverBgAlpha = p.alpha;
        } else {
          v.bg = p.value;
          v.bgAlpha = p.alpha;
        }
      } else if (p.prop === "text") {
        if (p.isHover) {
          v.hoverText = p.value;
          v.hoverTextAlpha = p.alpha;
        } else {
          v.text = p.value;
          v.textAlpha = p.alpha;
        }
      } else if (p.prop === "border") {
        v.hasBorder = true;
      }
    }
    out.push(v);
  }
  return out;
};

const variants = parseVariants(buttonText);

// ──────────────────────────────────────────────────────────────────────────────
// Backdrop scenarios — common page surfaces a CTA may sit on
// ──────────────────────────────────────────────────────────────────────────────

type Tone = "light" | "dark";

const backdrops: { name: string; rgb: RGB; tone: Tone }[] = [
  { name: "white surface", rgb: resolveColor("brand-white"), tone: "light" },
  { name: "secondary/muted", rgb: resolveColor("secondary"), tone: "light" },
  { name: "brand-coral fill", rgb: resolveColor("brand-coral"), tone: "light" },
  { name: "brand-blue fill", rgb: resolveColor("brand-blue"), tone: "light" },
  { name: "foreground (dark)", rgb: resolveColor("foreground"), tone: "dark" },
  // Hero overlay: bg-foreground/50 over an arbitrary photo → conservatively
  // treat as a mid-dark grey for contrast purposes.
  { name: "hero overlay (foreground/50)", rgb: composite(resolveColor("foreground"), 0.5, { r: 90, g: 90, b: 90 }), tone: "dark" },
];

/**
 * Each variant declares which surfaces it's *designed* to live on.
 * Issues on other surfaces are reported as misuse, not DS bugs (downgraded to info).
 */
const VARIANT_INTENT: Record<string, Tone[]> = {
  default: ["light"],
  destructive: ["light"],
  outline: ["light"],
  secondary: ["light"],
  ghost: ["light"],
  link: ["light"],
  coral: ["light", "dark"],
  blue: ["light", "dark"],
  amber: ["light", "dark"],
  "outline-coral": ["light"],
  "outline-blue": ["light"],
  "outline-white": ["dark"], // explicitly for dark/photo backgrounds
};

// ──────────────────────────────────────────────────────────────────────────────
// Run checks
// ──────────────────────────────────────────────────────────────────────────────

const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE = 3.0; // Large text (≥18.66px bold or ≥24px regular). CTAs typically qualify.

interface Finding {
  variant: string;
  state: "base" | "hover";
  backdrop: string;
  tone: Tone;
  intended: boolean;
  textOver: RGB;
  bgOver: RGB;
  ratio: number;
  severity: "fail" | "warn" | "info";
  reason: string;
}

const findings: Finding[] = [];

const evalState = (
  v: VariantStyle,
  state: "base" | "hover",
  backdrop: { name: string; rgb: RGB; tone: Tone },
) => {
  const bgRef = state === "hover" ? v.hoverBg ?? v.bg : v.bg;
  const bgAlpha = state === "hover" ? v.hoverBgAlpha ?? v.bgAlpha ?? 1 : v.bgAlpha ?? 1;
  const textRef = state === "hover" ? v.hoverText ?? v.text : v.text;
  const textAlpha = state === "hover" ? v.hoverTextAlpha ?? v.textAlpha ?? 1 : v.textAlpha ?? 1;

  if (!textRef) return;

  let effBg: RGB;
  if (!bgRef || bgRef === "transparent") {
    effBg = backdrop.rgb;
  } else {
    const bgRgb = resolveColor(bgRef);
    effBg = bgAlpha < 1 ? composite(bgRgb, bgAlpha, backdrop.rgb) : bgRgb;
  }

  const textRgb = resolveColor(textRef);
  const effText = textAlpha < 1 ? composite(textRgb, textAlpha, effBg) : textRgb;
  const ratio = contrastRatio(effText, effBg);

  // Solid (opaque) backgrounds aren't affected by the page backdrop — only
  // need to evaluate them once.
  const bgIsOpaque = bgRef && bgRef !== "transparent" && bgAlpha === 1;
  if (bgIsOpaque && backdrop.name !== "white surface") return;

  const intent = VARIANT_INTENT[v.name] ?? ["light", "dark"];
  const intended = intent.includes(backdrop.tone);

  let severity: "fail" | "warn" | "info" | null = null;
  let reason = "";

  if (ratio < WCAG_AA_LARGE) {
    severity = intended ? "fail" : "info";
    reason = intended
      ? `Below WCAG AA large-text minimum (${WCAG_AA_LARGE}:1) on a surface this variant is designed for`
      : `Illegible — but this variant is not intended for ${backdrop.tone} surfaces (misuse, not a DS bug)`;
  } else if (ratio < WCAG_AA_NORMAL) {
    severity = intended ? "warn" : null;
    reason = `Below WCAG AA normal-text minimum (${WCAG_AA_NORMAL}:1) — OK for large CTA text`;
  }

  if (!severity) return;

  findings.push({
    variant: v.name,
    state,
    backdrop: backdrop.name,
    tone: backdrop.tone,
    intended,
    textOver: effText,
    bgOver: effBg,
    ratio,
    severity,
    reason,
  });
};

for (const v of variants) {
  for (const bd of backdrops) {
    evalState(v, "base", bd);
    evalState(v, "hover", bd);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Report
// ──────────────────────────────────────────────────────────────────────────────

const fmtRgb = ({ r, g, b }: RGB) =>
  `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase()}`;

console.log("");
console.log("Brilus DS — Button Contrast Audit");
console.log("══════════════════════════════════════════════════════════════════════");
console.log(`Variants analysed: ${variants.length}`);
console.log(`Backdrops tested:  ${backdrops.length}`);
console.log(`Findings:          ${findings.length}`);
console.log("");

const fails = findings.filter((f) => f.severity === "fail");
const warns = findings.filter((f) => f.severity === "warn");
const infos = findings.filter((f) => f.severity === "info");

if (fails.length === 0 && warns.length === 0) {
  console.log("✅ All intended button/backdrop combinations meet WCAG AA large-text contrast (≥3:1).");
  if (infos.length) {
    console.log(`   (${infos.length} non-issue${infos.length > 1 ? "s" : ""} flagged as misuse — variants used outside their intended surface tone.)`);
  }
  process.exit(0);
}

const printFinding = (f: Finding) => {
  const icon = f.severity === "fail" ? "❌" : f.severity === "warn" ? "⚠️ " : "ℹ️ ";
  console.log(`${icon} [${f.variant}] ${f.state.toUpperCase()} on "${f.backdrop}" (${f.tone})`);
  console.log(
    `     text ${fmtRgb(f.textOver)}  on  bg ${fmtRgb(f.bgOver)}  →  ratio ${f.ratio.toFixed(2)}:1`,
  );
  console.log(`     ${f.reason}`);
  console.log("");
};

if (fails.length) {
  console.log("─── FAILURES — DS bugs (variant fails on a surface it's designed for) ───");
  fails.forEach(printFinding);
}
if (warns.length) {
  console.log("─── WARNINGS (3:1–4.5:1, OK only for large CTA text ≥18.66px bold) ──────");
  warns.forEach(printFinding);
}
if (infos.length) {
  console.log("─── INFO — misuse (variant placed outside its intended surface tone) ────");
  console.log("   Fix at the call site by switching to a variant whose intent matches.");
  console.log("");
  infos.forEach(printFinding);
}

console.log("══════════════════════════════════════════════════════════════════════");
console.log(`Result: ${fails.length} fail, ${warns.length} warn, ${infos.length} info`);
process.exit(fails.length > 0 ? 1 : 0);
