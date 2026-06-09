import { c as createServerRpc, v as verifyToken, g as getDb, a as comparePassword, s as signToken, h as hashPassword, r as requireSession } from "./session-DkH6muQ_.mjs";
import { c as createServerFn, b as getCookie, s as setCookie, d as deleteCookie } from "./server-DaU8DV72.mjs";
import { O as OWNER_PERMISSIONS, D as DEFAULT_EMPLOYEE_PERMISSIONS } from "./permissions-Dq-yqX07.mjs";
import "../_libs/bcryptjs.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
async function insertCashboxEntry(db, ownerId, entry) {
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: ownerId,
    kind: entry.kind,
    amount: entry.amount,
    note: entry.note ?? null,
    ref_id: entry.ref_id ?? null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("cashbox_entries").insertOne(doc);
  return {
    ...doc,
    id
  };
}
function saleCashboxAmount(data) {
  if (data.type === "credit") return Number(data.paid_amount) || 0;
  if (data.type === "cash" || data.type === "online") return Number(data.sell_price) * data.qty;
  return 0;
}
async function mapUser(db, userId) {
  const user = await db.collection("users").findOne({
    _id: userId
  });
  if (!user) return null;
  const business = user.business_id ? await db.collection("businesses").findOne({
    _id: user.business_id
  }) : null;
  return {
    id: user._id,
    email: user.email,
    full_name: user.full_name || "",
    activated: user.activated === false ? false : Boolean(user.activated ?? true),
    role: user.role || "owner",
    business_id: user.business_id || null,
    business_name: business?.name || "HakimEzy",
    logo_url: business?.logo_url || "/logo.png",
    permissions: (user.role === "owner" ? OWNER_PERMISSIONS : user.permissions) || DEFAULT_EMPLOYEE_PERMISSIONS
  };
}
const getMeFn_createServerFn_handler = createServerRpc({
  id: "8a91d402077b4649c709527a495cc7b5a81bd0b26f8a90b5a7d5855d123aa999",
  name: "getMeFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getMeFn.__executeServer(opts));
const getMeFn = createServerFn({
  method: "GET"
}).handler(getMeFn_createServerFn_handler, async () => {
  try {
    const token = getCookie("token");
    if (!token) return {
      user: null
    };
    const session = await verifyToken(token);
    if (!session) return {
      user: null
    };
    const db = await getDb();
    const user = await mapUser(db, session.userId);
    return {
      user
    };
  } catch {
    return {
      user: null
    };
  }
});
const loginFn_createServerFn_handler = createServerRpc({
  id: "0fd32aa5f3809e0d748e1f334a3fff5123b5cf93a56048ccdd74bb7d0c5dadd6",
  name: "loginFn",
  filename: "src/lib/rpc.ts"
}, (opts) => loginFn.__executeServer(opts));
const loginFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(loginFn_createServerFn_handler, async ({
  data
}) => {
  const db = await getDb();
  const user = await db.collection("users").findOne({
    email: data.email.toLowerCase()
  });
  if (!user || !comparePassword(data.password, user.password)) {
    throw new Error("Invalid email or password");
  }
  const token = await signToken({
    userId: user._id,
    email: user.email
  });
  setCookie("token", token, {
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
  const mapped = await mapUser(db, user._id);
  return {
    user: mapped
  };
});
const registerFn_createServerFn_handler = createServerRpc({
  id: "1d29bbe418cf2733340dd0d856c3d6fcfe03efd036ec6c8f538c10aa3b96de4c",
  name: "registerFn",
  filename: "src/lib/rpc.ts"
}, (opts) => registerFn.__executeServer(opts));
const registerFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(registerFn_createServerFn_handler, async ({
  data
}) => {
  const db = await getDb();
  const existing = await db.collection("users").findOne({
    email: data.email.toLowerCase()
  });
  if (existing) throw new Error("User already exists");
  const userId = crypto.randomUUID();
  await db.collection("users").insertOne({
    _id: userId,
    email: data.email.toLowerCase(),
    password: hashPassword(data.password),
    full_name: data.fullName || "",
    role: "owner",
    activated: false,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  const token = await signToken({
    userId,
    email: data.email.toLowerCase()
  });
  setCookie("token", token, {
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
  const mapped = await mapUser(db, userId);
  return {
    user: mapped
  };
});
const logoutFn_createServerFn_handler = createServerRpc({
  id: "5e5fcc18e008e8f662e0c8c0e6e8cfb0d5c1136d26b2c08ea70ddf6ff64f115d",
  name: "logoutFn",
  filename: "src/lib/rpc.ts"
}, (opts) => logoutFn.__executeServer(opts));
const logoutFn = createServerFn({
  method: "POST"
}).handler(logoutFn_createServerFn_handler, async () => {
  deleteCookie("token");
  return {
    success: true
  };
});
const getProductsFn_createServerFn_handler = createServerRpc({
  id: "197878eb75fe7c9da93872f98bb82ca2406010b0d7bf9e0bd3de872f78ed2fbd",
  name: "getProductsFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getProductsFn.__executeServer(opts));
const getProductsFn = createServerFn({
  method: "GET"
}).handler(getProductsFn_createServerFn_handler, async () => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("products").find({
    owner_id: session.ownerId
  }).sort({
    created_at: -1
  }).toArray();
  return items.map((p) => ({
    ...p,
    id: p._id
  }));
});
const createProductFn_createServerFn_handler = createServerRpc({
  id: "d478ab63d4264e8b18ec3e043f7ff94f9da0117ce5c7f8c6c8aff64d210993a2",
  name: "createProductFn",
  filename: "src/lib/rpc.ts"
}, (opts) => createProductFn.__executeServer(opts));
const createProductFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createProductFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    name: data.name,
    image_url: data.image_url || null,
    buy_price: data.buy_price || 0,
    sell_price: data.sell_price || 0,
    stock: data.stock || 0,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("products").insertOne(doc);
  return {
    ...doc,
    id
  };
});
const updateProductFn_createServerFn_handler = createServerRpc({
  id: "406cc3c3a9fa081881ac5e8a069753b231d1761be4d289d6390f3f44661a7d21",
  name: "updateProductFn",
  filename: "src/lib/rpc.ts"
}, (opts) => updateProductFn.__executeServer(opts));
const updateProductFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(updateProductFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const {
    id,
    ...updates
  } = data;
  const db = await getDb();
  await db.collection("products").updateOne({
    _id: id,
    owner_id: session.ownerId
  }, {
    $set: updates
  });
  const updated = await db.collection("products").findOne({
    _id: id
  });
  return {
    ...updated,
    id
  };
});
const deleteProductFn_createServerFn_handler = createServerRpc({
  id: "4f78fb314b19d41f1bc0efee3c89ba53af44743f8286f5095e9251aa543574e3",
  name: "deleteProductFn",
  filename: "src/lib/rpc.ts"
}, (opts) => deleteProductFn.__executeServer(opts));
const deleteProductFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(deleteProductFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  await db.collection("products").deleteOne({
    _id: data.id,
    owner_id: session.ownerId
  });
  return {
    success: true
  };
});
const getPartiesFn_createServerFn_handler = createServerRpc({
  id: "2d85f76d9c7bedd5385c1bb7aead0e30d04d94eb12ff5bc2f4168ba2e8bd4b3e",
  name: "getPartiesFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getPartiesFn.__executeServer(opts));
const getPartiesFn = createServerFn({
  method: "GET"
}).handler(getPartiesFn_createServerFn_handler, async () => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("parties").find({
    owner_id: session.ownerId
  }).sort({
    name: 1
  }).toArray();
  return items.map((p) => ({
    ...p,
    id: p._id
  }));
});
const createPartyFn_createServerFn_handler = createServerRpc({
  id: "da56d4798480e46cbef8a26e458781374e2acc089a4cf199553f67f9c3199138",
  name: "createPartyFn",
  filename: "src/lib/rpc.ts"
}, (opts) => createPartyFn.__executeServer(opts));
const createPartyFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createPartyFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    name: data.name,
    phone: data.phone || null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("parties").insertOne(doc);
  return {
    ...doc,
    id
  };
});
const updatePartyFn_createServerFn_handler = createServerRpc({
  id: "18c5496affc8b698b7bb4e70ce29d0259a07063eff31aac3129d5ffc7a8a8b31",
  name: "updatePartyFn",
  filename: "src/lib/rpc.ts"
}, (opts) => updatePartyFn.__executeServer(opts));
const updatePartyFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(updatePartyFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const {
    id,
    ...updates
  } = data;
  const db = await getDb();
  await db.collection("parties").updateOne({
    _id: id,
    owner_id: session.ownerId
  }, {
    $set: updates
  });
  const updated = await db.collection("parties").findOne({
    _id: id
  });
  return {
    ...updated,
    id
  };
});
const deletePartyFn_createServerFn_handler = createServerRpc({
  id: "dc5b146b8d549d8ad532d7224b51832cafb9444996c11125ae64c4a203903437",
  name: "deletePartyFn",
  filename: "src/lib/rpc.ts"
}, (opts) => deletePartyFn.__executeServer(opts));
const deletePartyFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(deletePartyFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  await db.collection("parties").deleteOne({
    _id: data.id,
    owner_id: session.ownerId
  });
  return {
    success: true
  };
});
const getPartyFn_createServerFn_handler = createServerRpc({
  id: "34c6f1fbb5b43b372a6c7ff5ed1ec519ad600d02b86ff57a889a79d630347256",
  name: "getPartyFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getPartyFn.__executeServer(opts));
const getPartyFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(getPartyFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const p = await db.collection("parties").findOne({
    _id: data.id,
    owner_id: session.ownerId
  });
  if (!p) return null;
  return {
    ...p,
    id: p._id
  };
});
const createPartyReceivableFn_createServerFn_handler = createServerRpc({
  id: "b62fc769a8bbdb401797d8d00afe0991ec9e60e70490bdebf0c3083fa67778a6",
  name: "createPartyReceivableFn",
  filename: "src/lib/rpc.ts"
}, (opts) => createPartyReceivableFn.__executeServer(opts));
const createPartyReceivableFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createPartyReceivableFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    party_id: data.party_id,
    amount: data.amount,
    note: data.note || null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("party_receivables").insertOne(doc);
  return {
    ...doc,
    id
  };
});
const createPartyPayableFn_createServerFn_handler = createServerRpc({
  id: "28e765981f11700a76cbb3c540030833ab66c3f776206bc2c0eb32ed470ecbaf",
  name: "createPartyPayableFn",
  filename: "src/lib/rpc.ts"
}, (opts) => createPartyPayableFn.__executeServer(opts));
const createPartyPayableFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createPartyPayableFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    party_id: data.party_id,
    amount: data.amount,
    note: data.note || null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("party_payables").insertOne(doc);
  return {
    ...doc,
    id
  };
});
const getAllPartyReceivablesFn_createServerFn_handler = createServerRpc({
  id: "895302891b18daebd4ff7034b6fd480133c3e5c126ae1027e67311bf8fccc350",
  name: "getAllPartyReceivablesFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getAllPartyReceivablesFn.__executeServer(opts));
const getAllPartyReceivablesFn = createServerFn({
  method: "GET"
}).handler(getAllPartyReceivablesFn_createServerFn_handler, async () => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("party_receivables").find({
    owner_id: session.ownerId
  }).toArray();
  return items.map((r) => ({
    ...r,
    id: r._id
  }));
});
const getPartyReceivablesFn_createServerFn_handler = createServerRpc({
  id: "6d2af82d0ca322bb084927cf650ba88eac72dc0870f572e06a36f7822ac2ee9e",
  name: "getPartyReceivablesFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getPartyReceivablesFn.__executeServer(opts));
const getPartyReceivablesFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(getPartyReceivablesFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("party_receivables").find({
    owner_id: session.ownerId,
    party_id: data.partyId
  }).sort({
    created_at: -1
  }).toArray();
  return items.map((r) => ({
    ...r,
    id: r._id
  }));
});
const getPartyPayablesFn_createServerFn_handler = createServerRpc({
  id: "71217d3113d4faefdd53ed334885ec2b04913662aa56b1f3c4fb26386a52fd1c",
  name: "getPartyPayablesFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getPartyPayablesFn.__executeServer(opts));
const getPartyPayablesFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(getPartyPayablesFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("party_payables").find({
    owner_id: session.ownerId,
    party_id: data.partyId
  }).sort({
    created_at: -1
  }).toArray();
  return items.map((r) => ({
    ...r,
    id: r._id
  }));
});
const deletePartyReceivableFn_createServerFn_handler = createServerRpc({
  id: "5b54f9ad5ddc52b08a888f96c7624add6c1925e9e50b3e634853ec4fe93a1cb3",
  name: "deletePartyReceivableFn",
  filename: "src/lib/rpc.ts"
}, (opts) => deletePartyReceivableFn.__executeServer(opts));
const deletePartyReceivableFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(deletePartyReceivableFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  await db.collection("party_receivables").deleteOne({
    _id: data.id,
    owner_id: session.ownerId
  });
  return {
    success: true
  };
});
const deletePartyPayableFn_createServerFn_handler = createServerRpc({
  id: "852718695be7a4316b93825e8bfc2f2909f10860a5220541da50238a16344589",
  name: "deletePartyPayableFn",
  filename: "src/lib/rpc.ts"
}, (opts) => deletePartyPayableFn.__executeServer(opts));
const deletePartyPayableFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(deletePartyPayableFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  await db.collection("party_payables").deleteOne({
    _id: data.id,
    owner_id: session.ownerId
  });
  return {
    success: true
  };
});
const createPayableSettlementFn_createServerFn_handler = createServerRpc({
  id: "3a6a58631b94a3534bc75bb72f304da1dafd65e1c83358c16b6e2bafe17cee94",
  name: "createPayableSettlementFn",
  filename: "src/lib/rpc.ts"
}, (opts) => createPayableSettlementFn.__executeServer(opts));
const createPayableSettlementFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createPayableSettlementFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    party_id: data.party_id,
    amount: data.amount,
    note: data.note || null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("party_payable_settlements").insertOne(doc);
  return {
    ...doc,
    id
  };
});
const getPayableSettlementsFn_createServerFn_handler = createServerRpc({
  id: "715cc11c14eb60a0c8e3dd7b2569f441039b53444ecb8743aad47db9f519493f",
  name: "getPayableSettlementsFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getPayableSettlementsFn.__executeServer(opts));
const getPayableSettlementsFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(getPayableSettlementsFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("party_payable_settlements").find({
    owner_id: session.ownerId,
    party_id: data.partyId
  }).sort({
    created_at: -1
  }).toArray();
  return items.map((r) => ({
    ...r,
    id: r._id
  }));
});
const getSalesFn_createServerFn_handler = createServerRpc({
  id: "a9bfb9bd91b0cb3986fdd64f61014658c86d729ae6e399630f304d2ff4790c46",
  name: "getSalesFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getSalesFn.__executeServer(opts));
const getSalesFn = createServerFn({
  method: "GET"
}).handler(getSalesFn_createServerFn_handler, async () => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("sales").find({
    owner_id: session.ownerId
  }).sort({
    created_at: -1
  }).limit(200).toArray();
  return items.map((s) => ({
    ...s,
    id: s._id
  }));
});
const getSalesForPartyFn_createServerFn_handler = createServerRpc({
  id: "505280a5105db09ac030398b23ea33ea4111696ed719e0d466723cd01551c8ac",
  name: "getSalesForPartyFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getSalesForPartyFn.__executeServer(opts));
const getSalesForPartyFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(getSalesForPartyFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("sales").find({
    owner_id: session.ownerId,
    party_id: data.partyId
  }).sort({
    created_at: -1
  }).toArray();
  return items.map((s) => ({
    ...s,
    id: s._id
  }));
});
const createSaleFn_createServerFn_handler = createServerRpc({
  id: "bf49f786e7cb1d9f6cfbe91f9b2269d546cb84b819c04477a15ed806c3128612",
  name: "createSaleFn",
  filename: "src/lib/rpc.ts"
}, (opts) => createSaleFn.__executeServer(opts));
const createSaleFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSaleFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    ...data,
    party_id: data.type === "credit" ? data.party_id : null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("sales").insertOne(doc);
  if (data.product_id) {
    const product = await db.collection("products").findOne({
      _id: data.product_id
    });
    if (product) await db.collection("products").updateOne({
      _id: data.product_id
    }, {
      $set: {
        stock: Math.max((product.stock ?? 0) - data.qty, 0)
      }
    });
  }
  const cashAmt = saleCashboxAmount(data);
  if (cashAmt > 0) {
    await insertCashboxEntry(db, session.ownerId, {
      kind: "sale",
      amount: cashAmt,
      note: `Sale: ${data.product_name}`,
      ref_id: id
    });
  }
  return {
    ...doc,
    id
  };
});
const deleteSaleFn_createServerFn_handler = createServerRpc({
  id: "fdc9026d53020babcb8de9abf44f84ee1f339c3a08206f02572e5cbd970ec6ed",
  name: "deleteSaleFn",
  filename: "src/lib/rpc.ts"
}, (opts) => deleteSaleFn.__executeServer(opts));
const deleteSaleFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(deleteSaleFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const sale = await db.collection("sales").findOne({
    _id: data.id,
    owner_id: session.ownerId
  });
  if (!sale) throw new Error("Sale not found");
  if (sale.returned) throw new Error("Already returned");
  await db.collection("cashbox_entries").deleteOne({
    owner_id: session.ownerId,
    ref_id: data.id,
    kind: "sale"
  });
  await db.collection("sales").deleteOne({
    _id: data.id,
    owner_id: session.ownerId
  });
  return {
    success: true
  };
});
const createReturnFn_createServerFn_handler = createServerRpc({
  id: "42f6ec911953635df9810fd5660d8e3571c270d5d89f6168be7467cdfd775ac3",
  name: "createReturnFn",
  filename: "src/lib/rpc.ts"
}, (opts) => createReturnFn.__executeServer(opts));
const createReturnFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createReturnFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const sale = await db.collection("sales").findOne({
    _id: data.sale_id,
    owner_id: session.ownerId
  });
  if (!sale) throw new Error("Sale not found");
  if (!sale.product_id) throw new Error("Cannot return non-product sale");
  if (sale.returned) throw new Error("Already returned");
  const returnQty = Math.min(data.qty, sale.qty);
  if (returnQty <= 0) throw new Error("Invalid quantity");
  const id = crypto.randomUUID();
  const profitPerUnit = sale.profit / sale.qty;
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    sale_id: data.sale_id,
    product_id: sale.product_id,
    product_name: sale.product_name,
    qty: returnQty,
    note: data.note || null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("returns").insertOne(doc);
  const product = await db.collection("products").findOne({
    _id: sale.product_id
  });
  if (product) {
    await db.collection("products").updateOne({
      _id: sale.product_id
    }, {
      $set: {
        stock: (product.stock ?? 0) + returnQty
      }
    });
  }
  if (returnQty >= sale.qty) {
    await db.collection("sales").updateOne({
      _id: data.sale_id
    }, {
      $set: {
        returned: true,
        return_qty: returnQty
      }
    });
  } else {
    const remaining = sale.qty - returnQty;
    await db.collection("sales").updateOne({
      _id: data.sale_id
    }, {
      $set: {
        qty: remaining,
        profit: profitPerUnit * remaining,
        return_qty: returnQty
      }
    });
  }
  return {
    ...doc,
    id
  };
});
const getReturnsFn_createServerFn_handler = createServerRpc({
  id: "69899356142ae9a152929e3bb10b33c7d665caa01caf69a2ea0954785d8a6be7",
  name: "getReturnsFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getReturnsFn.__executeServer(opts));
const getReturnsFn = createServerFn({
  method: "GET"
}).handler(getReturnsFn_createServerFn_handler, async () => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("returns").find({
    owner_id: session.ownerId
  }).sort({
    created_at: -1
  }).limit(200).toArray();
  return items.map((r) => ({
    ...r,
    id: r._id
  }));
});
const getPurchasesFn_createServerFn_handler = createServerRpc({
  id: "1c60a22c6a61ca2ac303f8d307ec08a20b0fa9415ff3ca7d41dfc434ff2fd036",
  name: "getPurchasesFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getPurchasesFn.__executeServer(opts));
const getPurchasesFn = createServerFn({
  method: "GET"
}).handler(getPurchasesFn_createServerFn_handler, async () => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("purchases").find({
    owner_id: session.ownerId
  }).sort({
    created_at: -1
  }).limit(200).toArray();
  return items.map((p) => ({
    ...p,
    id: p._id
  }));
});
const createPurchaseFn_createServerFn_handler = createServerRpc({
  id: "ea2681f0406c0c8ea90fc2ea0930cd4d665256d13c207f974e50570af7c0f912",
  name: "createPurchaseFn",
  filename: "src/lib/rpc.ts"
}, (opts) => createPurchaseFn.__executeServer(opts));
const createPurchaseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createPurchaseFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    ...data,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("purchases").insertOne(doc);
  if (data.product_id) {
    const product = await db.collection("products").findOne({
      _id: data.product_id
    });
    if (product) {
      const updates = {
        stock: (product.stock ?? 0) + data.qty,
        buy_price: data.unit_cost
      };
      if (data.sell_price != null && data.sell_price > 0) {
        updates.sell_price = data.sell_price;
      }
      await db.collection("products").updateOne({
        _id: data.product_id
      }, {
        $set: updates
      });
    }
  }
  return {
    ...doc,
    id
  };
});
const deletePurchaseFn_createServerFn_handler = createServerRpc({
  id: "b921f4eddc9cd7e4a582ecaab146398749c0a5a71c99ec5742ac1d61e8dfcc55",
  name: "deletePurchaseFn",
  filename: "src/lib/rpc.ts"
}, (opts) => deletePurchaseFn.__executeServer(opts));
const deletePurchaseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(deletePurchaseFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const purchase = await db.collection("purchases").findOne({
    _id: data.id,
    owner_id: session.ownerId
  });
  if (!purchase) throw new Error("Purchase not found");
  if (purchase.product_id) {
    const product = await db.collection("products").findOne({
      _id: purchase.product_id
    });
    if (product) {
      await db.collection("products").updateOne({
        _id: purchase.product_id
      }, {
        $set: {
          stock: Math.max((product.stock ?? 0) - purchase.qty, 0)
        }
      });
    }
  }
  await db.collection("purchases").deleteOne({
    _id: data.id,
    owner_id: session.ownerId
  });
  return {
    success: true
  };
});
const getExpensesFn_createServerFn_handler = createServerRpc({
  id: "67c35452109f9ec3520af996f2bd846942435fd9b068e9f44dfe34dadbf39a02",
  name: "getExpensesFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getExpensesFn.__executeServer(opts));
const getExpensesFn = createServerFn({
  method: "GET"
}).handler(getExpensesFn_createServerFn_handler, async () => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("expenses").find({
    owner_id: session.ownerId
  }).sort({
    created_at: -1
  }).limit(200).toArray();
  return items.map((e) => ({
    ...e,
    id: e._id
  }));
});
const createExpenseFn_createServerFn_handler = createServerRpc({
  id: "875f3cb0f03514f86b4d32afb3a412c90a2ecdac76823a14b62d4b8cceac05b7",
  name: "createExpenseFn",
  filename: "src/lib/rpc.ts"
}, (opts) => createExpenseFn.__executeServer(opts));
const createExpenseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createExpenseFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    ...data,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("expenses").insertOne(doc);
  await insertCashboxEntry(db, session.ownerId, {
    kind: "expense",
    amount: data.amount,
    note: data.title,
    ref_id: id
  });
  return {
    ...doc,
    id
  };
});
const deleteExpenseFn_createServerFn_handler = createServerRpc({
  id: "833c2d0892adb464f7a955fe8c4e47020025023b789da8b86a47813b4b51b7a1",
  name: "deleteExpenseFn",
  filename: "src/lib/rpc.ts"
}, (opts) => deleteExpenseFn.__executeServer(opts));
const deleteExpenseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(deleteExpenseFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  await db.collection("cashbox_entries").deleteOne({
    owner_id: session.ownerId,
    ref_id: data.id,
    kind: "expense"
  });
  await db.collection("expenses").deleteOne({
    _id: data.id,
    owner_id: session.ownerId
  });
  return {
    success: true
  };
});
const getPaymentsForPartyFn_createServerFn_handler = createServerRpc({
  id: "759b85110030d10fa0981da550e9dd9f6689cd8e53ad73d712e4975a85fba239",
  name: "getPaymentsForPartyFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getPaymentsForPartyFn.__executeServer(opts));
const getPaymentsForPartyFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(getPaymentsForPartyFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("payments").find({
    owner_id: session.ownerId,
    party_id: data.partyId
  }).sort({
    created_at: -1
  }).toArray();
  return items.map((p) => ({
    ...p,
    id: p._id
  }));
});
const getAllPaymentsFn_createServerFn_handler = createServerRpc({
  id: "e333a5b29f70af28fbb49ec5669f9b43ef1ade290d9e44c14a8de482648f57e3",
  name: "getAllPaymentsFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getAllPaymentsFn.__executeServer(opts));
const getAllPaymentsFn = createServerFn({
  method: "GET"
}).handler(getAllPaymentsFn_createServerFn_handler, async () => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("payments").find({
    owner_id: session.ownerId
  }).toArray();
  return items.map((p) => ({
    ...p,
    id: p._id
  }));
});
const createPaymentFn_createServerFn_handler = createServerRpc({
  id: "856b35b2d1891c0521352d858580fc54187d46d4b8aab4ba8bad2c623dcc431b",
  name: "createPaymentFn",
  filename: "src/lib/rpc.ts"
}, (opts) => createPaymentFn.__executeServer(opts));
const createPaymentFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createPaymentFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    ...data,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("payments").insertOne(doc);
  return {
    ...doc,
    id
  };
});
const deletePaymentFn_createServerFn_handler = createServerRpc({
  id: "e7b245cbb50146abd5b6cab9c826554ea29f02433114c0818a0bc262b47d208a",
  name: "deletePaymentFn",
  filename: "src/lib/rpc.ts"
}, (opts) => deletePaymentFn.__executeServer(opts));
const deletePaymentFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(deletePaymentFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  await db.collection("payments").deleteOne({
    _id: data.id,
    owner_id: session.ownerId
  });
  return {
    success: true
  };
});
const getSomitiFn_createServerFn_handler = createServerRpc({
  id: "54c56bcf809309a8867d9eae3c5340d7da199983417432a69e2edc53656ef68e",
  name: "getSomitiFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getSomitiFn.__executeServer(opts));
const getSomitiFn = createServerFn({
  method: "GET"
}).handler(getSomitiFn_createServerFn_handler, async () => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("somiti_entries").find({
    owner_id: session.ownerId
  }).sort({
    created_at: -1
  }).limit(200).toArray();
  return items.map((s) => ({
    ...s,
    id: s._id
  }));
});
const createSomitiFn_createServerFn_handler = createServerRpc({
  id: "2244afac97482fdd48b13168de6ab9726ff4259df2bf4753978b5fd36735e02b",
  name: "createSomitiFn",
  filename: "src/lib/rpc.ts"
}, (opts) => createSomitiFn.__executeServer(opts));
const createSomitiFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSomitiFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    ...data,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("somiti_entries").insertOne(doc);
  return {
    ...doc,
    id
  };
});
const getWithdrawalsFn_createServerFn_handler = createServerRpc({
  id: "211730cff76a79abc2f04a02a35314747abd08977370e88f9c9c6c0830334f9e",
  name: "getWithdrawalsFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getWithdrawalsFn.__executeServer(opts));
const getWithdrawalsFn = createServerFn({
  method: "GET"
}).handler(getWithdrawalsFn_createServerFn_handler, async () => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("owner_withdrawals").find({
    owner_id: session.ownerId
  }).sort({
    created_at: -1
  }).limit(200).toArray();
  return items.map((w) => ({
    ...w,
    id: w._id
  }));
});
const createWithdrawalFn_createServerFn_handler = createServerRpc({
  id: "fea9cf785c105c00b2e1a8ddaf2b329b5dfe9573fa8eaa5ca8035d012e5db8ac",
  name: "createWithdrawalFn",
  filename: "src/lib/rpc.ts"
}, (opts) => createWithdrawalFn.__executeServer(opts));
const createWithdrawalFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createWithdrawalFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc = {
    _id: id,
    owner_id: session.ownerId,
    ...data,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("owner_withdrawals").insertOne(doc);
  return {
    ...doc,
    id
  };
});
const getCashboxFn_createServerFn_handler = createServerRpc({
  id: "44008eb5112cd8a2be426a8be052a1a73217a3c02af39861387e28b13216cd91",
  name: "getCashboxFn",
  filename: "src/lib/rpc.ts"
}, (opts) => getCashboxFn.__executeServer(opts));
const getCashboxFn = createServerFn({
  method: "GET"
}).handler(getCashboxFn_createServerFn_handler, async () => {
  const session = await requireSession();
  const db = await getDb();
  const items = await db.collection("cashbox_entries").find({
    owner_id: session.ownerId
  }).sort({
    created_at: -1
  }).limit(200).toArray();
  return items.map((e) => ({
    ...e,
    id: e._id
  }));
});
const createCashboxFn_createServerFn_handler = createServerRpc({
  id: "17937ed3c6db3906bfab398605947fd2f200482cc81bb0ecb845cb0734908c91",
  name: "createCashboxFn",
  filename: "src/lib/rpc.ts"
}, (opts) => createCashboxFn.__executeServer(opts));
const createCashboxFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createCashboxFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  const db = await getDb();
  const saved = await insertCashboxEntry(db, session.ownerId, {
    kind: data.kind,
    amount: data.amount,
    note: data.note ?? null
  });
  return saved;
});
const uploadImageFn_createServerFn_handler = createServerRpc({
  id: "6a2b28455971168f16628f6e1f1145972c6630849ad7b4ff9c85e9fd79c22eff",
  name: "uploadImageFn",
  filename: "src/lib/rpc.ts"
}, (opts) => uploadImageFn.__executeServer(opts));
const uploadImageFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(uploadImageFn_createServerFn_handler, async ({
  data
}) => {
  await requireSession();
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) throw new Error("IMGBB_API_KEY is not configured");
  const form = new FormData();
  form.append("image", data.base64);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: form
  });
  if (!res.ok) throw new Error("Image upload failed");
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Upload failed");
  return {
    url: json.data.url
  };
});
export {
  createCashboxFn_createServerFn_handler,
  createExpenseFn_createServerFn_handler,
  createPartyFn_createServerFn_handler,
  createPartyPayableFn_createServerFn_handler,
  createPartyReceivableFn_createServerFn_handler,
  createPayableSettlementFn_createServerFn_handler,
  createPaymentFn_createServerFn_handler,
  createProductFn_createServerFn_handler,
  createPurchaseFn_createServerFn_handler,
  createReturnFn_createServerFn_handler,
  createSaleFn_createServerFn_handler,
  createSomitiFn_createServerFn_handler,
  createWithdrawalFn_createServerFn_handler,
  deleteExpenseFn_createServerFn_handler,
  deletePartyFn_createServerFn_handler,
  deletePartyPayableFn_createServerFn_handler,
  deletePartyReceivableFn_createServerFn_handler,
  deletePaymentFn_createServerFn_handler,
  deleteProductFn_createServerFn_handler,
  deletePurchaseFn_createServerFn_handler,
  deleteSaleFn_createServerFn_handler,
  getAllPartyReceivablesFn_createServerFn_handler,
  getAllPaymentsFn_createServerFn_handler,
  getCashboxFn_createServerFn_handler,
  getExpensesFn_createServerFn_handler,
  getMeFn_createServerFn_handler,
  getPartiesFn_createServerFn_handler,
  getPartyFn_createServerFn_handler,
  getPartyPayablesFn_createServerFn_handler,
  getPartyReceivablesFn_createServerFn_handler,
  getPayableSettlementsFn_createServerFn_handler,
  getPaymentsForPartyFn_createServerFn_handler,
  getProductsFn_createServerFn_handler,
  getPurchasesFn_createServerFn_handler,
  getReturnsFn_createServerFn_handler,
  getSalesFn_createServerFn_handler,
  getSalesForPartyFn_createServerFn_handler,
  getSomitiFn_createServerFn_handler,
  getWithdrawalsFn_createServerFn_handler,
  loginFn_createServerFn_handler,
  logoutFn_createServerFn_handler,
  registerFn_createServerFn_handler,
  updatePartyFn_createServerFn_handler,
  updateProductFn_createServerFn_handler,
  uploadImageFn_createServerFn_handler
};
