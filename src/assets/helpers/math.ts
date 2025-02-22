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
