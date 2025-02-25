export function lerp(x: number, y: number, alpha: number) {
  return x + (y - x) * alpha;
}

export function clamp(x: number, min: number, max: number) {
  return Math.min(Math.max(x, min), max);
}

export function trunc(num: number, fixed = 0) {
  fixed = 10 ** fixed;

  return Math.floor(num * fixed) / fixed;
}

export function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function hash(x: number): number {
  x = (x << 13) ^ x;
  return ((x * (x * x * 15731 + 789221) + 1376312589) & 0x7fffffff) / 0x7fffffff;
}

export function grad(x: number, y: number): number {
  const h = hash(x + hash(y)) & 15;
  return ((h & 1) === 0 ? x : -x) + ((h & 2) === 0 ? y : -y);
}
