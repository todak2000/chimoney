export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const currencyFormater = (value: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    value
  );
};

export const dateFormater = (date?: any) => {
  let today = date || new Date();
  let options = { year: "numeric", month: "short", day: "numeric" };
  return today.toLocaleDateString("en-US", options);
};

export const valueFormatter = function (num: number) {
  if (num >= 1e9) {
    return "$" + (num / 1e9).toFixed(2) + "B";
  } else if (num >= 1e6) {
    return "$" + (num / 1e6).toFixed(2) + "M";
  } else if (num >= 1e4) {
    return "$" + (num / 1e3).toFixed(0) + "K";
  } else {
    return "$" + new Intl.NumberFormat("us").format(num).toString();
  }
};

export const valueFormatterNGN = function (num: number) {
  if (num >= 1e9) {
    return "₦" + (num / 1e9).toFixed(2) + "B";
  } else if (num >= 1e6) {
    return "₦" + (num / 1e6).toFixed(2) + "M";
  } else if (num >= 1e4) {
    return "₦" + (num / 1e3).toFixed(0) + "K";
  } else {
    return "₦" + new Intl.NumberFormat("us").format(num).toString();
  }
};
