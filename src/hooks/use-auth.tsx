import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getMeFn, logoutFn } from "@/lib/rpc";
import type { PermissionSet } from "@/lib/permissions";
import { clearAuthProfile, readAuthProfile, writeAuthProfile, writeBrand } from "@/lib/local-cache";

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  activated: boolean;
  role: string;
  business_id: string | null;
  business_name: string;
  logo_url: string;
  permissions?: PermissionSet;
};

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  refresh: async () => {},
});

function cacheUser(u: AuthUser | null) {
  if (!u) {
    clearAuthProfile();
    return;
  }
  writeAuthProfile({
    id: u.id,
    email: u.email,
    full_name: u.full_name,
    activated: u.activated,
    role: u.role,
    business_id: u.business_id,
    business_name: u.business_name,
    logo_url: u.logo_url,
  });
}

function profileToUser(p: ReturnType<typeof readAuthProfile>): AuthUser | null {
  if (!p) return null;
  return {
    id: p.id,
    email: p.email,
    full_name: p.full_name,
    activated: p.activated,
    role: p.role,
    business_id: p.business_id,
    business_name: p.business_name,
    logo_url: p.logo_url,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const cached = typeof window !== "undefined" ? readAuthProfile() : null;
  const [user, setUser] = useState<AuthUser | null>(() => profileToUser(cached));
  const [loading, setLoading] = useState(!cached);

  async function checkUser() {
    try {
      const data = await getMeFn();
      const next = data.user as AuthUser | null;
      setUser(next);
      cacheUser(next);
      if (next) writeBrand({ name: next.business_name, logo_url: next.logo_url });
    } catch {
      setUser(null);
      clearAuthProfile();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void checkUser(); }, []);

  const login = (newUser: AuthUser) => {
    setUser(newUser);
    cacheUser(newUser);
    writeBrand({ name: newUser.business_name, logo_url: newUser.logo_url });
    setLoading(false);
  };

  const logout = async () => {
    try { await logoutFn(); } catch { /* ignore */ }
    setUser(null);
    clearAuthProfile();
    setLoading(false);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, logout, refresh: checkUser }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
