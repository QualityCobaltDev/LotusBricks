export const motionTokens = {
  duration: {
    micro: 160,
    hover: 200,
    reveal: 420,
    page: 320
  },
  easing: {
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
    swift: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    smooth: "cubic-bezier(0.16, 1, 0.3, 1)"
  },
  stagger: {
    fast: 40,
    base: 60,
    slow: 80
  }
} as const;

export function getStaggerDelay(index: number, base = motionTokens.stagger.base, cap = 420) {
  return Math.min(index * base, cap);
}
