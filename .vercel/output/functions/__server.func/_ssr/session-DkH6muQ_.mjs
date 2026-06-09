import { T as TSS_SERVER_FUNCTION, b as getCookie } from "./server-DaU8DV72.mjs";
import { b as bcrypt } from "../_libs/bcryptjs.mjs";
import { O as OWNER_PERMISSIONS } from "./permissions-Dq-yqX07.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
let _clientPromise;
async function getClient() {
  if (_clientPromise) return _clientPromise;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to .env.local and restart the dev server."
    );
  }
  const { MongoClient } = await import("../_libs/mongodb.mjs").then(function(n) {
    return n.i;
  });
  {
    _clientPromise = new MongoClient(uri).connect();
  }
  return _clientPromise;
}
async function getDb() {
  const client = await getClient();
  return client.db();
}
async function getSecret() {
  const { default: process2 } = await import("node:process");
  const { TextEncoder } = globalThis;
  return new TextEncoder().encode(
    process2.env.JWT_SECRET || "dreamfashion-fallback-secret-key-123456"
  );
}
async function signToken(payload) {
  const { SignJWT } = await import("../_libs/jose.mjs");
  const secret = await getSecret();
  return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("30d").sign(secret);
}
async function verifyToken(token) {
  try {
    const { jwtVerify } = await import("../_libs/jose.mjs");
    const secret = await getSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}
function comparePassword(password, hashed) {
  return bcrypt.compareSync(password, hashed);
}
async function requireSession(requireActivated = true) {
  const token = getCookie("token");
  if (!token) throw new Error("Unauthorized");
  const payload = await verifyToken(token);
  if (!payload) throw new Error("Unauthorized");
  const db = await getDb();
  const user = await db.collection("users").findOne({ _id: payload.userId });
  if (!user) throw new Error("Unauthorized");
  const role = user.role || "owner";
  const activated = user.activated === false ? false : Boolean(user.activated ?? true);
  if (requireActivated && !activated) throw new Error("Account not activated");
  const ownerId = role === "employee" ? user.owner_id : user._id;
  const permissions = user.permissions || (role === "owner" ? OWNER_PERMISSIONS : {});
  return {
    userId: user._id,
    ownerId,
    email: user.email,
    role,
    businessId: user.business_id || null,
    activated,
    permissions: role === "owner" ? OWNER_PERMISSIONS : permissions
  };
}
function generateLicenseKey(prefix) {
  const seg = () => crypto.randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  return `${prefix}-${seg()}-${seg()}-${seg()}`;
}
export {
  comparePassword as a,
  generateLicenseKey as b,
  createServerRpc as c,
  getDb as g,
  hashPassword as h,
  requireSession as r,
  signToken as s,
  verifyToken as v
};
