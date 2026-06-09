import { k as keepPreviousData } from "../_libs/tanstack__query-core.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
const CACHE_PREFIX = "df-cache:";
const CACHE_META_KEY = "df-cache-meta";
const MAX_AGE_MS = 60 * 60 * 1e3;
function storageKey(queryKey) {
  return CACHE_PREFIX + JSON.stringify(queryKey);
}
function readQueryCache(queryKey) {
  if (typeof window === "undefined") return void 0;
  try {
    const raw = localStorage.getItem(storageKey(queryKey));
    if (!raw) return void 0;
    const entry = JSON.parse(raw);
    if (Date.now() - entry.updatedAt > MAX_AGE_MS) {
      localStorage.removeItem(storageKey(queryKey));
      return void 0;
    }
    return entry.data;
  } catch {
    return void 0;
  }
}
function writeQueryCache(queryKey, data) {
  if (typeof window === "undefined") return;
  try {
    const key = storageKey(queryKey);
    const entry = { data, updatedAt: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
    const meta = JSON.parse(localStorage.getItem(CACHE_META_KEY) ?? '{"keys":[]}');
    if (!meta.keys.includes(key)) {
      meta.keys.push(key);
      if (meta.keys.length > 40) {
        const removed = meta.keys.shift();
        if (removed) localStorage.removeItem(removed);
      }
      localStorage.setItem(CACHE_META_KEY, JSON.stringify(meta));
    }
  } catch {
  }
}
function useCachedQuery(queryKey, queryFn, options) {
  const cached = readQueryCache(queryKey);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const data = await queryFn();
      writeQueryCache(queryKey, data);
      return data;
    },
    initialData: cached,
    initialDataUpdatedAt: cached ? Date.now() - 1e3 : void 0,
    placeholderData: keepPreviousData,
    staleTime: 30 * 1e3,
    gcTime: 60 * 60 * 1e3,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    ...options
  });
}
export {
  useCachedQuery as u,
  writeQueryCache as w
};
