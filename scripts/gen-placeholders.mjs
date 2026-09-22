import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "products");
mkdirSync(outDir, { recursive: true });

// Brand palette
const NAVY = "#0b1e3d";
const NAVY_2 = "#16305c";
const GOLD = "#c9a04f";
const GOLD_2 = "#e4c580";
const CREAM = "#faf7f0";

function card({ icon, bg1, bg2 }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="${CREAM}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${CREAM}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="600" rx="36" fill="url(#g)"/>
  <rect width="600" height="600" rx="36" fill="url(#glow)"/>
  <circle cx="300" cy="270" r="150" fill="${CREAM}" fill-opacity="0.08"/>
  <text x="300" y="325" font-size="200" text-anchor="middle" dominant-baseline="middle">${icon}</text>
  <rect x="0" y="520" width="600" height="80" fill="${NAVY}" fill-opacity="0.15"/>
</svg>`;
}

const items = [
  // slug, icon, gradient pair
  ["tvorog-qoqon", "🧀", NAVY, NAVY_2],
  ["yogurt-danone", "🥣", NAVY_2, NAVY],
  ["oltin-dala-yog", GOLD, NAVY, NAVY_2],
  ["anchor-butter", "🧈", GOLD, GOLD_2],
  ["mol-goshti", "🥩", NAVY, "#3a1414"],
  ["qoy-goshti", "🥩", "#3a1414", NAVY],
  ["tovuq-file", "🍗", NAVY_2, NAVY],
  ["tovuq-son", "🍗", NAVY, NAVY_2],
  ["banan", "🍌", GOLD_2, GOLD],
  ["pomidor", "🍅", "#7a1f1f", NAVY],
  ["bodring", "🥒", "#1f5c3a", NAVY],
  ["oq-non", "🍞", GOLD, NAVY],
  ["baget-non", "🥖", GOLD_2, GOLD],
  ["fanta", "🥤", "#c9720f", NAVY],
  ["mineral-suv", "💧", NAVY_2, NAVY],
  ["alpen-gold", "🍫", "#4a2c14", NAVY],
  ["oreo", "🍪", NAVY, "#2a2a2a"],
  ["guruch-lazzat", "🍚", NAVY_2, GOLD],
  ["un-oltin-don", "🌾", GOLD, NAVY],
  ["fairy-idish", "🧽", NAVY, NAVY_2],
  ["zewa-qogoz", "🧻", NAVY_2, NAVY],
  ["colgate-pasta", "🪥", NAVY, GOLD],
  ["dove-sovun", "🧼", GOLD_2, NAVY],
  ["pampers", "👶", NAVY_2, GOLD],
  ["johnsons-shampun", "🧴", GOLD, NAVY_2],
];

for (const [slug, icon, bg1, bg2] of items) {
  writeFileSync(join(outDir, `${slug}.svg`), card({ slug, icon, bg1, bg2 }));
}

console.log(`Generated ${items.length} placeholder product images in ${outDir}`);
