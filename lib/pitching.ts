export const formatInnings = (outs: number) => {
  const whole = Math.floor(outs / 3);
  const remainder = outs % 3;
  return `${whole}.${remainder}`;
};

export const formatEra = (runs: number, outs: number) => {
  if (outs === 0) return "0.00";
  const innings = outs / 3;
  const era = (runs * 9) / innings;
  return era.toFixed(2);
};
