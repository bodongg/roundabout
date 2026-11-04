const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mod = (a) => ((a % CONFIG.TAU) + CONFIG.TAU) % CONFIG.TAU;
const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
