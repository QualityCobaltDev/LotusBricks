export const currency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

export const toTitleCase = (value: string) =>
  value
    .split(" ")
    .map((item) => item[0]?.toUpperCase() + item.slice(1).toLowerCase())
    .join(" ");
