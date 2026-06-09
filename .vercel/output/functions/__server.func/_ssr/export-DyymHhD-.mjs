function downloadCsv(filename, headers, rows) {
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function exportDateStamp() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
export {
  downloadCsv as d,
  exportDateStamp as e
};
