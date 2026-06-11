"use server";

import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { hashPassword, comparePassword, signToken, verifyToken } from "@/lib/auth-helpers";
import { requireSession, generateLicenseKey } from "@/lib/session";
import { DEFAULT_EMPLOYEE_PERMISSIONS, OWNER_PERMISSIONS, type PermissionSet } from "@/lib/permissions";

const DEFAULT_COMPANY = "HakimEzy";

async function ensureSuperAdmin() {
  const db = await getDb();
  const exists = await db.collection("super_admins").findOne({ username: "superadmin" });
  if (!exists) {
    await db.collection("super_admins").insertOne({
      _id: "superadmin",
      username: "superadmin",
      password: await hashPassword("superadmin123"),
      created_at: new Date().toISOString(),
    });
  }
}

async function requireSuperAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("super_token")?.value;
  if (!token) throw new Error("Unauthorized");
  const payload = await verifyToken(token);
  if (!payload || payload.userId !== "superadmin") throw new Error("Unauthorized");
  return payload;
}

// ─── Super Admin Auth ────────────────────────────────────────────────────────

export async function superAdminLoginFn(input: { data: { username: string; password: string } }) {
  const { data } = input;
  await ensureSuperAdmin();
  const db = await getDb();
  const admin = await db.collection("super_admins").findOne({ username: data.username });
  if (!admin || !(await comparePassword(data.password, admin.password as string))) {
    throw new Error("Invalid credentials");
  }
  const token = await signToken({ userId: "superadmin", email: "superadmin@hakimezy.local" });
  const cookieStore = await cookies();
  cookieStore.set("super_token", token, { maxAge: 8 * 60 * 60, httpOnly: true, sameSite: "lax", path: "/" });
  return { success: true };
}

export async function superAdminLogoutFn() {
  const cookieStore = await cookies();
  cookieStore.delete("super_token");
  return { success: true };
}

export async function superAdminCheckFn() {
  try {
    await requireSuperAdminSession();
    return { authenticated: true };
  } catch {
    return { authenticated: false };
  }
}

export async function generatePlatformLicenseFn(input: { data: { employeeLimit?: number; note?: string } }) {
  const { data } = input;
  await requireSuperAdminSession();
  const db = await getDb();
  const key = generateLicenseKey("HZ");
  const doc = {
    _id: key,
    type: "platform",
    employee_limit: data.employeeLimit ?? 5,
    note: data.note || null,
    used: false,
    used_by: null,
    created_at: new Date().toISOString(),
  };
  await db.collection("licenses").insertOne(doc);
  return { key, employee_limit: doc.employee_limit };
}

export async function listPlatformLicensesFn() {
  await requireSuperAdminSession();
  const db = await getDb();
  const items = await db.collection("licenses").find({ type: "platform" }).sort({ created_at: -1 }).limit(100).toArray();
  return items.map(l => ({ ...l, id: l._id as string }));
}

export async function listBusinessesFn() {
  await requireSuperAdminSession();
  const db = await getDb();
  const items = await db.collection("businesses").find({}).sort({ created_at: -1 }).limit(100).toArray();
  return items.map(b => ({ ...b, id: b._id as string }));
}

// ─── User activation & licenses ──────────────────────────────────────────────

export async function activateLicenseFn(input: { data: { licenseKey: string } }) {
  const { data } = input;
  const session = await requireSession(false);
  if (session.activated) throw new Error("Already activated");

  const db = await getDb();
  const license = await db.collection("licenses").findOne({ _id: data.licenseKey.trim().toUpperCase() });
  if (!license) throw new Error("Invalid license key");
  if (license.used) throw new Error("License already used");

  const now = new Date().toISOString();

  if (license.type === "platform") {
    const businessId = crypto.randomUUID();
    await db.collection("businesses").insertOne({
      _id: businessId,
      owner_id: session.userId,
      name: DEFAULT_COMPANY,
      logo_url: "/logo.png",
      business_type: "retail",
      theme: "green",
      employee_limit: license.employee_limit ?? 5,
      created_at: now,
    });
    await db.collection("users").updateOne(
      { _id: session.userId },
      {
        $set: {
          activated: true,
          role: "owner",
          business_id: businessId,
          owner_id: session.userId,
          permissions: OWNER_PERMISSIONS,
          license_key: data.licenseKey,
          activated_at: now,
        },
      },
    );
  } else if (license.type === "employee") {
    const business = await db.collection("businesses").findOne({ _id: license.business_id });
    if (!business) throw new Error("Business not found");
    const employeeCount = await db.collection("users").countDocuments({
      business_id: license.business_id,
      role: "employee",
      activated: true,
    });
    if (employeeCount >= (business.employee_limit as number)) {
      throw new Error("Employee limit reached for this business");
    }
    await db.collection("users").updateOne(
      { _id: session.userId },
      {
        $set: {
          activated: true,
          role: "employee",
          business_id: license.business_id,
          owner_id: license.owner_id,
          permissions: license.permissions || DEFAULT_EMPLOYEE_PERMISSIONS,
          license_key: data.licenseKey,
          activated_at: now,
        },
      },
    );
  } else {
    throw new Error("Invalid license type");
  }

  await db.collection("licenses").updateOne(
    { _id: license._id },
    { $set: { used: true, used_by: session.userId, used_at: now } },
  );

  return { success: true };
}

// ─── Business settings (owner) ───────────────────────────────────────────────

export async function getBusinessSettingsFn() {
  const session = await requireSession();
  const db = await getDb();
  let business = session.businessId
    ? await db.collection("businesses").findOne({ _id: session.businessId })
    : await db.collection("businesses").findOne({ owner_id: session.ownerId });

  if (!business && session.role === "owner") {
    const id = crypto.randomUUID();
    business = {
      _id: id,
      owner_id: session.ownerId,
      name: DEFAULT_COMPANY,
      logo_url: "/logo.png",
      business_type: "retail",
      theme: "green",
      employee_limit: 5,
      created_at: new Date().toISOString(),
    };
    await db.collection("businesses").insertOne(business);
    await db.collection("users").updateOne({ _id: session.userId }, { $set: { business_id: id } });
  }

  const employees = await db.collection("users")
    .find({ business_id: business?._id, role: "employee" })
    .project({ password: 0 })
    .toArray();

  const employeeLicenses = await db.collection("licenses")
    .find({ type: "employee", business_id: business?._id })
    .sort({ created_at: -1 })
    .limit(50)
    .toArray();

  return {
    business: business ? {
      id: business._id as string,
      name: business.name as string,
      logo_url: (business.logo_url as string) || "/logo.png",
      business_type: (business.business_type as string) || "retail",
      theme: (business.theme as string) || "green",
      employee_limit: (business.employee_limit as number) || 5,
      invoice_watermark: (business.invoice_watermark as string) || "",
      invoice_watermark_enabled: Boolean(business.invoice_watermark_enabled),
      invoice_terms: (business.invoice_terms as string) || "",
      invoice_color: (business.invoice_color as string) || "black",
    } : null,
    role: session.role,
    permissions: session.permissions,
    employees: employees.map(e => ({
      id: e._id as string,
      email: e.email as string,
      full_name: (e.full_name as string) || "",
      activated: Boolean(e.activated),
      permissions: e.permissions as PermissionSet,
    })),
    employeeLicenses: employeeLicenses.map(l => ({
      id: l._id as string,
      used: Boolean(l.used),
      used_by: l.used_by as string | null,
      created_at: l.created_at as string,
    })),
  };
}

export async function updateBusinessSettingsFn(input: {
  data: {
    name?: string;
    logo_url?: string;
    business_type?: string;
    theme?: string;
    employee_limit?: number;
    invoice_watermark?: string;
    invoice_watermark_enabled?: boolean;
    invoice_terms?: string;
    invoice_color?: string;
  }
}) {
  const { data } = input;
  const session = await requireSession();
  if (session.role !== "owner") throw new Error("Only business owner can change settings");
  const db = await getDb();
  const business = await db.collection("businesses").findOne({ owner_id: session.ownerId });
  if (!business) throw new Error("Business not found");
  await db.collection("businesses").updateOne({ _id: business._id }, { $set: data });
  return { success: true };
}

export async function createEmployeeLicenseFn(input: { data: { permissions?: PermissionSet } }) {
  const { data } = input;
  const session = await requireSession();
  if (session.role !== "owner") throw new Error("Only owner can create employee licenses");
  const db = await getDb();
  const business = await db.collection("businesses").findOne({ owner_id: session.ownerId });
  if (!business) throw new Error("Business not found");

  const usedCount = await db.collection("licenses").countDocuments({
    type: "employee",
    business_id: business._id,
  });
  if (usedCount >= (business.employee_limit as number)) {
    throw new Error("Employee license limit reached. Increase limit in settings.");
  }

  const key = generateLicenseKey("EMP");
  await db.collection("licenses").insertOne({
    _id: key,
    type: "employee",
    business_id: business._id,
    owner_id: session.ownerId,
    permissions: data.permissions || DEFAULT_EMPLOYEE_PERMISSIONS,
    used: false,
    used_by: null,
    created_at: new Date().toISOString(),
  });
  return { key };
}

export async function updateEmployeePermissionsFn(input: { data: { employeeId: string; permissions: PermissionSet } }) {
  const { data } = input;
  const session = await requireSession();
  if (session.role !== "owner") throw new Error("Only owner can update permissions");
  const db = await getDb();
  await db.collection("users").updateOne(
    { _id: data.employeeId, owner_id: session.ownerId, role: "employee" },
    { $set: { permissions: data.permissions } },
  );
  return { success: true };
}

export async function deleteLicenseFn(input: { data: { licenseKey: string } }) {
  const { data } = input;
  const db = await getDb();
  const key = data.licenseKey.trim().toUpperCase();
  const license = await db.collection("licenses").findOne({ _id: key });
  if (!license) {
    // License already deleted or never existed - consider deletion successful
    // This handles race conditions where license appears in UI list but
    // has been deleted by another process, or replication lag in distributed systems
    return { success: true };
  }
  if (license.used) throw new Error("Cannot delete a license that is already used");

  if (license.type === "platform") {
    await requireSuperAdminSession();
  } else if (license.type === "employee") {
    const session = await requireSession();
    if (session.role !== "owner") throw new Error("Only owner can delete employee licenses");
    if (license.owner_id !== session.ownerId) throw new Error("Not your license");
  } else {
    throw new Error("Invalid license type");
  }

  await db.collection("licenses").deleteOne({ _id: key });
  return { success: true };
}
