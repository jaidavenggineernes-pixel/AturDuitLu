export function formatCurrency(amount: number, currency: string = "IDR"): string {
  if (currency === "IDR") {
    const formatted = Math.abs(Math.round(amount)).toLocaleString("id-ID");
    return `${amount < 0 ? "- Rp " : "Rp "}${formatted}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateIndo(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export function formatDateTimeIndo(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
