import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { verifyToken } from "@/lib/auth-helpers";
import type { PermissionSet } from "@/lib/permissions";
import { OWNER_PERMISSIONS } from "@/lib/permissions";

export type AppSession = {
  userId: string;
  ownerId: string;
  email: string;
  role: "owner" | "employee" | "superadmin";
  businessId: string | null;
  activated: boolean;
  permissions: PermissionSet;
};

export async function requireSession(requireActivated = true): Promise<AppSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Unauthorized");
  const payload = await verifyToken(token);
  if (!payload) throw new Error("Unauthorized");

  const db = await getDb();
  const user = await db.collection("users").findOne({ _id: payload.userId });
  if (!user) throw new Error("Unauthorized");

  const role = (user.role as AppSession["role"]) || "owner";
  const activated = user.activated === false ? false : Boolean(user.activated ?? true);
  if (requireActivated && !activated) throw new Error("Account not activated");

  const ownerId = role === "employee" ? (user.owner_id as string) : (user._id as string);
  const permissions = (user.permissions as PermissionSet) || (role === "owner" ? OWNER_PERMISSIONS : {});

  return {
    userId: user._id as string,
    ownerId,
    email: user.email as string,
    role,
    businessId: (user.business_id as string) || null,
    activated,
    permissions: role === "owner" ? OWNER_PERMISSIONS : permissions,
  };
}

export function generateLicenseKey(prefix: string) {
  const seg = () => crypto.randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  return `${prefix}-${seg()}-${seg()}-${seg()}`;
}
