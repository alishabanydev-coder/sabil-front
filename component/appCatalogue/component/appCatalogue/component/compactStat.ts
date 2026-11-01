export function compactStat(value: number) {
  const amount = Math.abs(Number(value));
  if (!Number.isFinite(amount)) return "0";

  const units = [
    { threshold: 1_000_000, suffix: "M" },
    { threshold: 1_000, suffix: "K" },
  ];

  for (const unit of units) {
    if (amount >= unit.threshold) {
      const scaled = amount / unit.threshold;
      const digits = scaled >= 100 ? 0 : 1;
      return `${scaled.toFixed(digits).replace(/\.0$/, "")}${unit.suffix}`;
    }
  }

  return String(Math.round(amount));
}
