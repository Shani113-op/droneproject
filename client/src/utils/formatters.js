export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return '';
  return Number(num).toFixed(decimals);
};

export const formatLargeNumber = (num) => {
  if (num === null || num === undefined) return '';
  return Number(num).toLocaleString();
};
