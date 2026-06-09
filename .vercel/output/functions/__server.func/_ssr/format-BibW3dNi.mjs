function fmtMoney(n) {
  const num = typeof n === "string" ? Number(n) : n ?? 0;
  if (!Number.isFinite(num)) return "৳0";
  return "৳" + num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
function fmtDateTime(d) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString(void 0, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}
export {
  fmtMoney as a,
  fmtDateTime as f
};
