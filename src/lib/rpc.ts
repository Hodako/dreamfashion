"use server";

import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { hashPassword, comparePassword, signToken, verifyToken } from "@/lib/auth-helpers";
import { requireSession } from "@/lib/session";
import type { PermissionSet } from "@/lib/permissions";
import { DEFAULT_EMPLOYEE_PERMISSIONS, OWNER_PERMISSIONS } from "@/lib/permissions";

type CashboxKind = "deposit" | "withdraw" | "sale" | "expense";

async function insertCashboxEntry(
  db: Awaited<ReturnType<typeof getDb>>,
  ownerId: string,
  entry: { kind: CashboxKind; amount: number; note?: string | null; ref_id?: string | null },
) {
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: ownerId,
    kind: entry.kind,
    amount: entry.amount,
    note: entry.note ?? null,
    ref_id: entry.ref_id ?? null,
    created_at: new Date().toISOString(),
  };
  await db.collection("cashbox_entries").insertOne(doc);
  return { ...doc, id };
}

function saleCashboxAmount(data: { type: string; sell_price: number; qty: number; paid_amount: number }) {
  if (data.type === "credit") return Number(data.paid_amount) || 0;
  if (data.type === "cash" || data.type === "online") return Number(data.sell_price) * data.qty;
  return 0;
}

async function mapUser(db: Awaited<ReturnType<typeof getDb>>, userId: string) {
  const user = await db.collection("users").findOne({ _id: userId });
  if (!user) return null;
  const business = user.business_id
    ? await db.collection("businesses").findOne({ _id: user.business_id })
    : null;
  return {
    id: user._id as string,
    email: user.email as string,
    full_name: (user.full_name as string) || "",
    activated: user.activated === false ? false : Boolean(user.activated ?? true),
    role: (user.role as string) || "owner",
    business_id: (user.business_id as string) || null,
    business_name: (business?.name as string) || "HakimEzy",
    logo_url: (business?.logo_url as string) || "/logo.png",
    avatar_url: (user.avatar_url as string) || "",
    permissions: (user.role === "owner" ? OWNER_PERMISSIONS : (user.permissions as PermissionSet)) || DEFAULT_EMPLOYEE_PERMISSIONS,
  };
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function getMeFn() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return { user: null };
    const session = await verifyToken(token);
    if (!session) return { user: null };
    const db = await getDb();
    const user = await mapUser(db, session.userId);
    return { user };
  } catch {
    return { user: null };
  }
}

export async function loginFn(input: { data: { email: string; password: string } }) {
  const { data } = input;
  const db = await getDb();
  const user = await db.collection("users").findOne({ email: data.email.toLowerCase() });
  if (!user || !(await comparePassword(data.password, user.password as string))) {
    throw new Error("Invalid email or password");
  }
  const token = await signToken({ userId: user._id as string, email: user.email as string });
  const cookieStore = await cookies();
  cookieStore.set("token", token, { maxAge: 30 * 24 * 60 * 60, httpOnly: true, sameSite: "lax", path: "/" });
  const mapped = await mapUser(db, user._id as string);
  return { user: mapped };
}

export async function registerFn(input: { data: { email: string; password: string; fullName?: string } }) {
  const { data } = input;
  const db = await getDb();
  const existing = await db.collection("users").findOne({ email: data.email.toLowerCase() });
  if (existing) throw new Error("User already exists");
  const userId = crypto.randomUUID();
  await db.collection("users").insertOne({
    _id: userId,
    email: data.email.toLowerCase(),
    password: await hashPassword(data.password),
    full_name: data.fullName || "",
    role: "owner",
    activated: false,
    created_at: new Date().toISOString(),
  });
  const token = await signToken({ userId, email: data.email.toLowerCase() });
  const cookieStore = await cookies();
  cookieStore.set("token", token, { maxAge: 30 * 24 * 60 * 60, httpOnly: true, sameSite: "lax", path: "/" });
  const mapped = await mapUser(db, userId);
  return { user: mapped };
}

export async function logoutFn() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return { success: true };
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProductsFn() {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("products").find({ owner_id: session.ownerId }).sort({ created_at: -1 }).toArray();
  return items.map((p) => ({ ...p, id: p._id as string }));
}

export async function createProductFn(input: { data: { name: string; image_url?: string | null; buy_price?: number; sell_price?: number; stock?: number; attributes?: Record<string, string>; min_stock?: number; category?: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = { _id: id, owner_id: session.ownerId, name: data.name, image_url: data.image_url || null, buy_price: data.buy_price || 0, sell_price: data.sell_price || 0, stock: data.stock || 0, attributes: data.attributes || {}, min_stock: data.min_stock ?? 5, category: data.category || "", archived: false, created_at: new Date().toISOString() };
  await db.collection("products").insertOne(doc);
  return { ...doc, id };
}

export async function updateProductFn(input: { data: { id: string; name?: string; image_url?: string | null; buy_price?: number; sell_price?: number; stock?: number; attributes?: Record<string, string>; min_stock?: number; category?: string; archived?: boolean } }) {
  const { data } = input;
  const session = await requireSession();
  const { id, ...updates } = data;
  const db = await getDb();
  await db.collection("products").updateOne({ _id: id, owner_id: session.ownerId }, { $set: updates });
  const updated = await db.collection("products").findOne({ _id: id });
  return { ...updated, id };
}

export async function deleteProductFn(input: { data: { id: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  await db.collection("products").deleteOne({ _id: data.id, owner_id: session.ownerId });
  return { success: true };
}

export async function archiveProductFn(input: { data: { id: string; archived: boolean } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  await db.collection("products").updateOne({ _id: data.id, owner_id: session.ownerId }, { $set: { archived: data.archived } });
  return { success: true };
}

// ─── Parties ─────────────────────────────────────────────────────────────────

export async function getPartiesFn() {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("parties").find({ owner_id: session.ownerId }).sort({ name: 1 }).toArray();
  return items.map((p) => ({ ...p, id: p._id as string }));
}

export async function createPartyFn(input: { data: { name: string; phone?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = { _id: id, owner_id: session.ownerId, name: data.name, phone: data.phone || null, created_at: new Date().toISOString() };
  await db.collection("parties").insertOne(doc);
  return { ...doc, id };
}

export async function updatePartyFn(input: { data: { id: string; name?: string; phone?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const { id, ...updates } = data;
  const db = await getDb();
  await db.collection("parties").updateOne({ _id: id, owner_id: session.ownerId }, { $set: updates });
  const updated = await db.collection("parties").findOne({ _id: id });
  return { ...updated, id };
}

export async function deletePartyFn(input: { data: { id: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  await db.collection("parties").deleteOne({ _id: data.id, owner_id: session.ownerId });
  return { success: true };
}

export async function archivePartyFn(input: { data: { id: string; archived: boolean } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  await db.collection("parties").updateOne({ _id: data.id, owner_id: session.ownerId }, { $set: { archived: data.archived } });
  return { success: true };
}

export async function getPartyFn(input: { data: { id: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const p = await db.collection("parties").findOne({ _id: data.id, owner_id: session.ownerId });
  if (!p) return null;
  return { ...p, id: p._id as string };
}

export async function createPartyReceivableFn(input: { data: { party_id: string; amount: number; note?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = { _id: id, owner_id: session.ownerId, party_id: data.party_id, amount: data.amount, note: data.note || null, created_at: new Date().toISOString() };
  await db.collection("party_receivables").insertOne(doc);
  return { ...doc, id };
}

export async function createPartyPayableFn(input: { data: { party_id: string; amount: number; note?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = { _id: id, owner_id: session.ownerId, party_id: data.party_id, amount: data.amount, note: data.note || null, created_at: new Date().toISOString() };
  await db.collection("party_payables").insertOne(doc);
  return { ...doc, id };
}

export async function getAllPartyReceivablesFn() {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("party_receivables").find({ owner_id: session.ownerId }).toArray();
  return items.map((r) => ({ ...r, id: r._id as string }));
}

export async function getPartyReceivablesFn(input: { data: { partyId: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("party_receivables").find({ owner_id: session.ownerId, party_id: data.partyId }).sort({ created_at: -1 }).toArray();
  return items.map((r) => ({ ...r, id: r._id as string }));
}

export async function getPartyPayablesFn(input: { data: { partyId: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("party_payables").find({ owner_id: session.ownerId, party_id: data.partyId }).sort({ created_at: -1 }).toArray();
  return items.map((r) => ({ ...r, id: r._id as string }));
}

export async function deletePartyReceivableFn(input: { data: { id: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  await db.collection("party_receivables").deleteOne({ _id: data.id, owner_id: session.ownerId });
  return { success: true };
}

export async function deletePartyPayableFn(input: { data: { id: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  await db.collection("party_payables").deleteOne({ _id: data.id, owner_id: session.ownerId });
  return { success: true };
}

export async function createPayableSettlementFn(input: { data: { party_id: string; amount: number; note?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = { _id: id, owner_id: session.ownerId, party_id: data.party_id, amount: data.amount, note: data.note || null, created_at: new Date().toISOString() };
  await db.collection("party_payable_settlements").insertOne(doc);
  return { ...doc, id };
}

export async function getPayableSettlementsFn(input: { data: { partyId: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("party_payable_settlements").find({ owner_id: session.ownerId, party_id: data.partyId }).sort({ created_at: -1 }).toArray();
  return items.map((r) => ({ ...r, id: r._id as string }));
}

// ─── Sales ───────────────────────────────────────────────────────────────────

export async function getSalesFn() {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("sales").find({ owner_id: session.ownerId }).sort({ created_at: -1 }).limit(200).toArray();
  return items.map((s) => ({ ...s, id: s._id as string }));
}

export async function getSalesForPartyFn(input: { data: { partyId: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("sales").find({ owner_id: session.ownerId, party_id: data.partyId }).sort({ created_at: -1 }).toArray();
  return items.map((s) => ({ ...s, id: s._id as string }));
}

export async function createSaleFn(input: { data: { product_id?: string | null; product_name: string; qty: number; buy_price: number; sell_price: number; profit: number; type: string; party_id?: string | null; paid_amount: number; due_amount: number; note?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = { _id: id, owner_id: session.ownerId, ...data, party_id: data.type === "credit" ? data.party_id : null, created_at: new Date().toISOString() };
  await db.collection("sales").insertOne(doc);
  if (data.product_id) {
    const product = await db.collection("products").findOne({ _id: data.product_id });
    if (product) await db.collection("products").updateOne({ _id: data.product_id }, { $set: { stock: Math.max(((product.stock as number) ?? 0) - data.qty, 0) } });
  }
  const cashAmt = saleCashboxAmount(data);
  if (cashAmt > 0) {
    await insertCashboxEntry(db, session.ownerId, {
      kind: "sale",
      amount: cashAmt,
      note: `Sale: ${data.product_name}`,
      ref_id: id,
    });
  }
  return { ...doc, id };
}

export async function deleteSaleFn(input: { data: { id: string } }) {
  try {
    const { data } = input;
    const session = await requireSession();
    const db = await getDb();
    const sale = await db.collection("sales").findOne({ _id: data.id, owner_id: session.ownerId });
    if (!sale) throw new Error("Sale not found");

    if (sale.product_id) {
      const qtyToRestore = sale.returned ? 0 : (Number(sale.qty) || 0);
      if (qtyToRestore > 0) {
        await db.collection("products").updateOne(
          { _id: sale.product_id, owner_id: session.ownerId },
          { $inc: { stock: qtyToRestore } }
        );
      }
    }

    // Clean up associated returns for this sale
    await db.collection("returns").deleteMany({ sale_id: data.id, owner_id: session.ownerId });

    // Clean up cashbox entries for this sale and its returns
    await db.collection("cashbox_entries").deleteMany({ owner_id: session.ownerId, ref_id: data.id });
    
    await db.collection("sales").deleteOne({ _id: data.id, owner_id: session.ownerId });
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteSaleFn:", err);
    return { success: false, error: err.message || String(err) };
  }
}

export async function updateUserAvatarFn(input: { data: { avatar_url: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  await db.collection("users").updateOne(
    { _id: session.userId },
    { $set: { avatar_url: data.avatar_url } }
  );
  const user = await mapUser(db, session.userId);
  return { user };
}

export async function createReturnFn(input: { data: { sale_id: string; qty: number; note?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const sale = await db.collection("sales").findOne({ _id: data.sale_id, owner_id: session.ownerId });
  if (!sale) throw new Error("Sale not found");
  if (!sale.product_id) throw new Error("Cannot return non-product sale");
  if (sale.returned) throw new Error("Already returned");
  const returnQty = Math.min(data.qty, sale.qty as number);
  if (returnQty <= 0) throw new Error("Invalid quantity");

  const id = crypto.randomUUID();
  const profitPerUnit = (sale.profit as number) / (sale.qty as number);
  const doc = {
    _id: id, owner_id: session.ownerId, sale_id: data.sale_id,
    product_id: sale.product_id, product_name: sale.product_name,
    qty: returnQty, note: data.note || null, created_at: new Date().toISOString(),
  };
  await db.collection("returns").insertOne(doc);

  const product = await db.collection("products").findOne({ _id: sale.product_id });
  if (product) {
    await db.collection("products").updateOne(
      { _id: sale.product_id },
      { $set: { stock: ((product.stock as number) ?? 0) + returnQty } },
    );
  }

  if (returnQty >= (sale.qty as number)) {
    await db.collection("sales").updateOne({ _id: data.sale_id }, { $set: { returned: true, return_qty: returnQty } });
  } else {
    const remaining = (sale.qty as number) - returnQty;
    await db.collection("sales").updateOne(
      { _id: data.sale_id },
      { $set: { qty: remaining, profit: profitPerUnit * remaining, return_qty: returnQty } },
    );
  }
  return { ...doc, id };
}

export async function createDirectProductReturnFn(input: { data: { product_id: string; qty: number; return_price: number; note?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const product = await db.collection("products").findOne({ _id: data.product_id, owner_id: session.ownerId });
  if (!product) throw new Error("Product not found");
  
  const returnQty = Number(data.qty);
  if (returnQty <= 0) throw new Error("Invalid quantity");

  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    sale_id: null,
    product_id: data.product_id,
    product_name: product.name,
    qty: returnQty,
    return_price: Number(data.return_price) || 0,
    note: data.note || null,
    created_at: new Date().toISOString(),
  };
  await db.collection("returns").insertOne(doc);

  await db.collection("products").updateOne(
    { _id: data.product_id, owner_id: session.ownerId },
    { $set: { stock: ((product.stock as number) ?? 0) + returnQty } }
  );

  const refundAmt = returnQty * (Number(data.return_price) || 0);
  if (refundAmt > 0) {
    await insertCashboxEntry(db, session.ownerId, {
      kind: "withdraw",
      amount: refundAmt,
      note: `Direct Return: ${product.name} (Qty: ${returnQty})`,
      ref_id: id,
    });
  }

  return { ...doc, id };
}

export async function getReturnsFn() {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("returns").find({ owner_id: session.ownerId }).sort({ created_at: -1 }).limit(200).toArray();
  return items.map((r) => ({ ...r, id: r._id as string }));
}

export async function deleteReturnFn(input: { data: { id: string } }) {
  try {
    const { data } = input;
    const session = await requireSession();
    const db = await getDb();

    const ret = await db.collection("returns").findOne({ _id: data.id, owner_id: session.ownerId });
    if (!ret) throw new Error("Return record not found");

    if (ret.product_id) {
      const product = await db.collection("products").findOne({ _id: ret.product_id });
      if (product) {
        await db.collection("products").updateOne(
          { _id: ret.product_id },
          { $set: { stock: Math.max(((product.stock as number) ?? 0) - (ret.qty as number), 0) } }
        );
      }
    }

    if (ret.sale_id) {
      const sale = await db.collection("sales").findOne({ _id: ret.sale_id, owner_id: session.ownerId });
      if (sale) {
        const originalQty = (sale.qty as number) + (ret.qty as number);
        const buyPrice = Number(sale.buy_price) || 0;
        const sellPrice = Number(sale.sell_price) || 0;
        const updatedProfit = (sellPrice - buyPrice) * originalQty;

        await db.collection("sales").updateOne(
          { _id: ret.sale_id },
          {
            $set: {
              returned: false,
              qty: originalQty,
              profit: updatedProfit,
            },
            $unset: {
              return_qty: "",
            }
          }
        );
      }
    }

    await db.collection("cashbox_entries").deleteMany({ owner_id: session.ownerId, ref_id: data.id });
    await db.collection("returns").deleteOne({ _id: data.id, owner_id: session.ownerId });

    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteReturnFn:", err);
    return { success: false, error: err.message || String(err) };
  }
}

// ─── Purchases ───────────────────────────────────────────────────────────────

export async function getPurchasesFn() {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("purchases").find({ owner_id: session.ownerId }).sort({ created_at: -1 }).limit(200).toArray();
  return items.map((p) => ({ ...p, id: p._id as string }));
}

export async function createPurchaseFn(input: { data: { product_id?: string | null; product_name: string; qty: number; unit_cost: number; sell_price?: number; total: number; note?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = { _id: id, owner_id: session.ownerId, ...data, created_at: new Date().toISOString() };
  await db.collection("purchases").insertOne(doc);
  if (data.product_id) {
    const product = await db.collection("products").findOne({ _id: data.product_id });
    if (product) {
      const updates: Record<string, number> = {
        stock: ((product.stock as number) ?? 0) + data.qty,
        buy_price: data.unit_cost,
      };
      if (data.sell_price != null && data.sell_price > 0) {
        updates.sell_price = data.sell_price;
      }
      await db.collection("products").updateOne({ _id: data.product_id }, { $set: updates });
    }
  }
  return { ...doc, id };
}

export async function deletePurchaseFn(input: { data: { id: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const purchase = await db.collection("purchases").findOne({ _id: data.id, owner_id: session.ownerId });
  if (!purchase) throw new Error("Purchase not found");
  if (purchase.product_id) {
    const product = await db.collection("products").findOne({ _id: purchase.product_id });
    if (product) {
      await db.collection("products").updateOne(
        { _id: purchase.product_id },
        { $set: { stock: Math.max(((product.stock as number) ?? 0) - (purchase.qty as number), 0) } },
      );
    }
  }
  await db.collection("purchases").deleteOne({ _id: data.id, owner_id: session.ownerId });
  return { success: true };
}

// ─── Expenses ─────────────────────────────────────────────────────────────────

export async function getExpensesFn() {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("expenses").find({ owner_id: session.ownerId }).sort({ created_at: -1 }).limit(200).toArray();
  return items.map((e) => ({ ...e, id: e._id as string }));
}

export async function createExpenseFn(input: { data: { title: string; amount: number; note?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = { _id: id, owner_id: session.ownerId, ...data, created_at: new Date().toISOString() };
  await db.collection("expenses").insertOne(doc);
  await insertCashboxEntry(db, session.ownerId, {
    kind: "expense",
    amount: data.amount,
    note: data.title,
    ref_id: id,
  });
  return { ...doc, id };
}

export async function deleteExpenseFn(input: { data: { id: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  await db.collection("cashbox_entries").deleteOne({ owner_id: session.ownerId, ref_id: data.id, kind: "expense" });
  await db.collection("expenses").deleteOne({ _id: data.id, owner_id: session.ownerId });
  return { success: true };
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function getPaymentsForPartyFn(input: { data: { partyId: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("payments").find({ owner_id: session.ownerId, party_id: data.partyId }).sort({ created_at: -1 }).toArray();
  return items.map((p) => ({ ...p, id: p._id as string }));
}

export async function getAllPaymentsFn() {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("payments").find({ owner_id: session.ownerId }).toArray();
  return items.map((p) => ({ ...p, id: p._id as string }));
}

export async function createPaymentFn(input: { data: { party_id: string; amount: number; note?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = { _id: id, owner_id: session.ownerId, ...data, created_at: new Date().toISOString() };
  await db.collection("payments").insertOne(doc);
  return { ...doc, id };
}

export async function deletePaymentFn(input: { data: { id: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  await db.collection("payments").deleteOne({ _id: data.id, owner_id: session.ownerId });
  return { success: true };
}

// ─── Somiti ───────────────────────────────────────────────────────────────────

export async function getSomitiFn() {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("somiti_entries").find({ owner_id: session.ownerId }).sort({ created_at: -1 }).limit(200).toArray();
  return items.map((s) => ({ ...s, id: s._id as string }));
}

export async function createSomitiFn(input: { data: { kind: string; amount: number; note?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = { _id: id, owner_id: session.ownerId, ...data, created_at: new Date().toISOString() };
  await db.collection("somiti_entries").insertOne(doc);
  return { ...doc, id };
}

export async function updateSomitiFn(input: { data: { id: string; kind: string; amount: number; note?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const { id, ...updates } = data;
  await db.collection("somiti_entries").updateOne(
    { _id: id, owner_id: session.ownerId },
    { $set: updates }
  );
  const updated = await db.collection("somiti_entries").findOne({ _id: id });
  return { ...updated, id };
}

export async function deleteSomitiFn(input: { data: { id: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  await db.collection("somiti_entries").deleteOne({ _id: data.id, owner_id: session.ownerId });
  return { success: true };
}

// ─── Withdrawals ──────────────────────────────────────────────────────────────

export async function getWithdrawalsFn() {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("owner_withdrawals").find({ owner_id: session.ownerId }).sort({ created_at: -1 }).limit(200).toArray();
  return items.map((w) => ({ ...w, id: w._id as string }));
}

export async function createWithdrawalFn(input: { data: { amount: number; note?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = { _id: id, owner_id: session.ownerId, ...data, created_at: new Date().toISOString() };
  await db.collection("owner_withdrawals").insertOne(doc);
  return { ...doc, id };
}

// ─── Cashbox ──────────────────────────────────────────────────────────────────

export async function getCashboxFn() {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("cashbox_entries").find({ owner_id: session.ownerId }).sort({ created_at: -1 }).limit(200).toArray();
  return items.map((e) => ({ ...e, id: e._id as string }));
}

export async function createCashboxFn(input: { data: { kind: "deposit" | "withdraw"; amount: number; note?: string | null } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const saved = await insertCashboxEntry(db, session.ownerId, {
    kind: data.kind,
    amount: data.amount,
    note: data.note ?? null,
  });
  return saved;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export async function uploadImageFn(input: { data: { base64: string; fileName?: string } }) {
  const { data } = input;
  await requireSession();
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) throw new Error("IMGBB_API_KEY is not configured");
  const form = new FormData();
  form.append("image", data.base64);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Image upload failed");
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Upload failed");
  return { url: json.data.url as string };
}

// ─── Reminders ───────────────────────────────────────────────────────────────

export async function getRemindersFn() {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("reminders").find({ owner_id: session.ownerId }).sort({ created_at: -1 }).toArray();
  return items.map((r) => ({ ...r, id: r._id as string }));
}

export async function createReminderFn(input: { data: { title: string; due_date: string; logic_type?: string; logic_config?: any } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    title: data.title,
    due_date: data.due_date,
    logic_type: data.logic_type || "none",
    logic_config: data.logic_config || null,
    completed: false,
    created_at: new Date().toISOString(),
  };
  await db.collection("reminders").insertOne(doc);
  return { ...doc, id };
}

export async function toggleReminderFn(input: { data: { id: string; completed: boolean } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  await db.collection("reminders").updateOne({ _id: data.id, owner_id: session.ownerId }, { $set: { completed: data.completed } });
  return { success: true };
}

export async function deleteReminderFn(input: { data: { id: string } }) {
  const { data } = input;
  const session = await requireSession();
  const db = await getDb();
  await db.collection("reminders").deleteOne({ _id: data.id, owner_id: session.ownerId });
  return { success: true };
}
