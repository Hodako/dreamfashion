import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "hz-theme";

type ThemeCtx = { theme: ThemeMode; resolved: "light" | "dark"; setTheme: (t: ThemeMode) => void; toggle: () => void };

const Ctx = createContext<ThemeCtx | null>(null);

function systemPrefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") return systemPrefersDark() ? "dark" : "light";
  return mode;
}

function applyTheme(resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return saved === "light" || saved === "dark" || saved === "system" ? saved : "light";
  });

  const resolved = resolveTheme(theme);

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(resolveTheme("system"));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  };

  const toggle = () => setTheme(resolved === "dark" ? "light" : "dark");

  return (
    <Ctx.Provider value={{ theme, resolved, setTheme, toggle }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
