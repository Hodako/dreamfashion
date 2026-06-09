import { w as writeQueryCache } from "./use-cached-query-DaopYbTj.mjs";
function setCachedData(qc, queryKey, updater) {
  qc.setQueryData(queryKey, updater);
  const next = qc.getQueryData(queryKey);
  if (next !== void 0) {
    writeQueryCache(queryKey, next);
  }
}
async function refreshQueries(qc, ...keys) {
  await Promise.all(
    keys.map(
      (key) => qc.invalidateQueries({ queryKey: key }).then(
        () => qc.refetchQueries({ queryKey: key, type: "active" })
      )
    )
  );
}
export {
  refreshQueries as r,
  setCachedData as s
};
