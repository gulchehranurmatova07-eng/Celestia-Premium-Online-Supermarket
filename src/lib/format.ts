export function formatSum(amount: number): string {
  return `${Math.round(amount).toLocaleString("ru-RU").replace(/,/g, " ")} so‘m`;
}

export function formatNumber(amount: number): string {
  return Math.round(amount).toLocaleString("ru-RU").replace(/,/g, " ");
}
