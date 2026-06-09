function cashboxDelta(kind, amount) {
  return kind === "deposit" || kind === "sale" ? Number(amount) : -Number(amount);
}
function cashboxBalance(entries) {
  return entries.reduce((sum, e) => sum + cashboxDelta(e.kind, e.amount), 0);
}
export {
  cashboxDelta as a,
  cashboxBalance as c
};
