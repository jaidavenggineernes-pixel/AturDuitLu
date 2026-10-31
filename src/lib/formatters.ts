export function getStoredCurrency(): string {
  if (typeof window !== "undefined") {
    try {
      const val = localStorage.getItem("aturduitlu_currency");
      if (val && ["IDR", "USD", "SGD", "EUR"].includes(val)) {
        return val;
      }
    } catch {
      // ignore
    }
  }
  return "IDR";
}

export function setStoredCurrency(currency: string): void {
  if (typeof window !== "undefined" && currency) {
    try {
      localStorage.setItem("aturduitlu_currency", currency);
    } catch {
      // ignore
    }
  }
}

export function getStoredTimezone(): string {
  if (typeof window !== "undefined") {
    try {
      const val = localStorage.getItem("aturduitlu_timezone");
      if (val) return val;
    } catch {
      // ignore
    }
  }
  return "Asia/Jakarta";
}

export function setStoredTimezone(timezone: string): void {
  if (typeof window !== "undefined" && timezone) {
    try {
      localStorage.setItem("aturduitlu_timezone", timezone);
    } catch {
      // ignore
    }
  }
}

export function getCurrencySymbol(currency?: string): string {
  const c = currency || getStoredCurrency();
  switch (c) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "SGD":
      return "S$";
    case "IDR":
    default:
      return "Rp";
  }
}

export function formatCurrency(amount: number, currency?: string): string {
  const activeCurrency = currency || getStoredCurrency();
  const num = typeof amount === "number" ? amount : parseFloat(String(amount)) || 0;
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  if (activeCurrency === "IDR") {
    const formatted = Math.round(absNum).toLocaleString("id-ID");
    return `${isNegative ? "- Rp " : "Rp "}${formatted}`;
  }

  if (activeCurrency === "USD") {
    const formatted = absNum.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return `${isNegative ? "- $" : "$"}${formatted}`;
  }

  if (activeCurrency === "EUR") {
    const formatted = absNum.toLocaleString("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return `${isNegative ? "- €" : "€"}${formatted}`;
  }

  if (activeCurrency === "SGD") {
    const formatted = absNum.toLocaleString("en-SG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return `${isNegative ? "- S$" : "S$"}${formatted}`;
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: activeCurrency,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${activeCurrency} ${absNum.toLocaleString()}`;
  }
}

export function formatDateIndo(dateInput: string | Date | number, timezone?: string): string {
  const date = new Date(dateInput);
  const activeTz = timezone || getStoredTimezone();
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: activeTz,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(date);
  }
}

export function formatDateTimeIndo(dateInput: string | Date | number, timezone?: string): string {
  const date = new Date(dateInput);
  const activeTz = timezone || getStoredTimezone();
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: activeTz,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(date);
  }
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
