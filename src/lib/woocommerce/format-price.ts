export function formatStorePrice(
  price: string,
  currencySymbol = "تومان",
): string {
  const minorUnit = 0;
  const num = parseInt(price, 10);
  if (isNaN(num)) return price;
  const value = minorUnit > 0 ? num / Math.pow(10, minorUnit) : num;
  return `${value.toLocaleString("fa-IR")} ${currencySymbol}`;
}

export function formatDisplayPrice(price: string): string {
  const cleaned = price.replace(/,/g, "");
  const num = parseInt(cleaned, 10);
  if (isNaN(num)) return price;
  return num.toLocaleString("fa-IR");
}
