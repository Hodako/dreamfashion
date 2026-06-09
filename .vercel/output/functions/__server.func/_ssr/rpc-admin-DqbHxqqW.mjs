import { c as createServerRpc, g as getDb, a as comparePassword, s as signToken, b as generateLicenseKey, r as requireSession, h as hashPassword, v as verifyToken } from "./session-DkH6muQ_.mjs";
import { c as createServerFn, s as setCookie, d as deleteCookie, b as getCookie } from "./server-DaU8DV72.mjs";
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
const DEFAULT_COMPANY = "HakimEzy";
async function ensureSuperAdmin() {
  const db = await getDb();
  const exists = await db.collection("super_admins").findOne({
    username: "superadmin"
  });
  if (!exists) {
    await db.collection("super_admins").insertOne({
      _id: "superadmin",
      username: "superadmin",
      password: hashPassword("superadmin123"),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
}
async function requireSuperAdminSession() {
  const token = getCookie("super_token");
  if (!token) throw new Error("Unauthorized");
  const payload = await verifyToken(token);
  if (!payload || payload.userId !== "superadmin") throw new Error("Unauthorized");
  return payload;
}
const superAdminLoginFn_createServerFn_handler = createServerRpc({
  id: "a4343087d568b7ad350c17256fd77d25f0ce41ccc68dcda33aa9015bb55ec622",
  name: "superAdminLoginFn",
  filename: "src/lib/rpc-admin.ts"
}, (opts) => superAdminLoginFn.__executeServer(opts));
const superAdminLoginFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(superAdminLoginFn_createServerFn_handler, async ({
  data
}) => {
  await ensureSuperAdmin();
  const db = await getDb();
  const admin = await db.collection("super_admins").findOne({
    username: data.username
  });
  if (!admin || !comparePassword(data.password, admin.password)) {
    throw new Error("Invalid credentials");
  }
  const token = await signToken({
    userId: "superadmin",
    email: "superadmin@hakimezy.local"
  });
  setCookie("super_token", token, {
    maxAge: 8 * 60 * 60,
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
  return {
    success: true
  };
});
const superAdminLogoutFn_createServerFn_handler = createServerRpc({
  id: "3601c9c86c4f1f6edf292e76bb40111a0bb2426563ca38a659bc1c38f4e61703",
  name: "superAdminLogoutFn",
  filename: "src/lib/rpc-admin.ts"
}, (opts) => superAdminLogoutFn.__executeServer(opts));
const superAdminLogoutFn = createServerFn({
  method: "POST"
}).handler(superAdminLogoutFn_createServerFn_handler, async () => {
  deleteCookie("super_token");
  return {
    success: true
  };
});
const superAdminCheckFn_createServerFn_handler = createServerRpc({
  id: "272a4c0546229cb6a7b82f9e51c71785985819b1fd325be74f5a2e71ef9bfd61",
  name: "superAdminCheckFn",
  filename: "src/lib/rpc-admin.ts"
}, (opts) => superAdminCheckFn.__executeServer(opts));
const superAdminCheckFn = createServerFn({
  method: "GET"
}).handler(superAdminCheckFn_createServerFn_handler, async () => {
  try {
    await requireSuperAdminSession();
    return {
      authenticated: true
    };
  } catch {
    return {
      authenticated: false
    };
  }
});
const generatePlatformLicenseFn_createServerFn_handler = createServerRpc({
  id: "30a6f54f1363e67776c7eba415c2f9b4d4a3e44c3a93efdb6ab34982043b6ffd",
  name: "generatePlatformLicenseFn",
  filename: "src/lib/rpc-admin.ts"
}, (opts) => generatePlatformLicenseFn.__executeServer(opts));
const generatePlatformLicenseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(generatePlatformLicenseFn_createServerFn_handler, async ({
  data
}) => {
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
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await db.collection("licenses").insertOne(doc);
  return {
    key,
    employee_limit: doc.employee_limit
  };
});
const listPlatformLicensesFn_createServerFn_handler = createServerRpc({
  id: "2f529d33d7ad06cd3d36f90e4910479633ac707b67acd8feb8a2b3afdeaa7f57",
  name: "listPlatformLicensesFn",
  filename: "src/lib/rpc-admin.ts"
}, (opts) => listPlatformLicensesFn.__executeServer(opts));
const listPlatformLicensesFn = createServerFn({
  method: "GET"
}).handler(listPlatformLicensesFn_createServerFn_handler, async () => {
  await requireSuperAdminSession();
  const db = await getDb();
  const items = await db.collection("licenses").find({
    type: "platform"
  }).sort({
    created_at: -1
  }).limit(100).toArray();
  return items.map((l) => ({
    ...l,
    id: l._id
  }));
});
const listBusinessesFn_createServerFn_handler = createServerRpc({
  id: "edd8031c6ee6a90fcca4a7a9756e9a20162b9cecd6c02c83b4d9646dd95897ed",
  name: "listBusinessesFn",
  filename: "src/lib/rpc-admin.ts"
}, (opts) => listBusinessesFn.__executeServer(opts));
const listBusinessesFn = createServerFn({
  method: "GET"
}).handler(listBusinessesFn_createServerFn_handler, async () => {
  await requireSuperAdminSession();
  const db = await getDb();
  const items = await db.collection("businesses").find({}).sort({
    created_at: -1
  }).limit(100).toArray();
  return items.map((b) => ({
    ...b,
    id: b._id
  }));
});
const activateLicenseFn_createServerFn_handler = createServerRpc({
  id: "95c60082ca6cae832909e442661d4b8d7eaf7bb38a833932f37fa8d6548d4f75",
  name: "activateLicenseFn",
  filename: "src/lib/rpc-admin.ts"
}, (opts) => activateLicenseFn.__executeServer(opts));
const activateLicenseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(activateLicenseFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession(false);
  if (session.activated) throw new Error("Already activated");
  const db = await getDb();
  const license = await db.collection("licenses").findOne({
    _id: data.licenseKey.trim().toUpperCase()
  });
  if (!license) throw new Error("Invalid license key");
  if (license.used) throw new Error("License already used");
  const now = (/* @__PURE__ */ new Date()).toISOString();
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
      created_at: now
    });
    await db.collection("users").updateOne({
      _id: session.userId
    }, {
      $set: {
        activated: true,
        role: "owner",
        business_id: businessId,
        owner_id: session.userId,
        permissions: OWNER_PERMISSIONS,
        license_key: data.licenseKey,
        activated_at: now
      }
    });
  } else if (license.type === "employee") {
    const business = await db.collection("businesses").findOne({
      _id: license.business_id
    });
    if (!business) throw new Error("Business not found");
    const employeeCount = await db.collection("users").countDocuments({
      business_id: license.business_id,
      role: "employee",
      activated: true
    });
    if (employeeCount >= business.employee_limit) {
      throw new Error("Employee limit reached for this business");
    }
    await db.collection("users").updateOne({
      _id: session.userId
    }, {
      $set: {
        activated: true,
        role: "employee",
        business_id: license.business_id,
        owner_id: license.owner_id,
        permissions: license.permissions || DEFAULT_EMPLOYEE_PERMISSIONS,
        license_key: data.licenseKey,
        activated_at: now
      }
    });
  } else {
    throw new Error("Invalid license type");
  }
  await db.collection("licenses").updateOne({
    _id: license._id
  }, {
    $set: {
      used: true,
      used_by: session.userId,
      used_at: now
    }
  });
  return {
    success: true
  };
});
const getBusinessSettingsFn_createServerFn_handler = createServerRpc({
  id: "d253bef31ddfa5292f0bfa849b648ad0d1ba2ef1745f125bdd142e92dd8c787d",
  name: "getBusinessSettingsFn",
  filename: "src/lib/rpc-admin.ts"
}, (opts) => getBusinessSettingsFn.__executeServer(opts));
const getBusinessSettingsFn = createServerFn({
  method: "GET"
}).handler(getBusinessSettingsFn_createServerFn_handler, async () => {
  const session = await requireSession();
  const db = await getDb();
  let business = session.businessId ? await db.collection("businesses").findOne({
    _id: session.businessId
  }) : await db.collection("businesses").findOne({
    owner_id: session.ownerId
  });
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
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    await db.collection("businesses").insertOne(business);
    await db.collection("users").updateOne({
      _id: session.userId
    }, {
      $set: {
        business_id: id
      }
    });
  }
  const employees = await db.collection("users").find({
    business_id: business?._id,
    role: "employee"
  }).project({
    password: 0
  }).toArray();
  const employeeLicenses = await db.collection("licenses").find({
    type: "employee",
    business_id: business?._id
  }).sort({
    created_at: -1
  }).limit(50).toArray();
  return {
    business: business ? {
      id: business._id,
      name: business.name,
      logo_url: business.logo_url || "/logo.png",
      business_type: business.business_type || "retail",
      theme: business.theme || "green",
      employee_limit: business.employee_limit || 5
    } : null,
    role: session.role,
    permissions: session.permissions,
    employees: employees.map((e) => ({
      id: e._id,
      email: e.email,
      full_name: e.full_name || "",
      activated: Boolean(e.activated),
      permissions: e.permissions
    })),
    employeeLicenses: employeeLicenses.map((l) => ({
      id: l._id,
      used: Boolean(l.used),
      used_by: l.used_by,
      created_at: l.created_at
    }))
  };
});
const updateBusinessSettingsFn_createServerFn_handler = createServerRpc({
  id: "eb52a18b530af295aeac39eb9ed54dd665cc8ec50057c3ef392acb75f5d28212",
  name: "updateBusinessSettingsFn",
  filename: "src/lib/rpc-admin.ts"
}, (opts) => updateBusinessSettingsFn.__executeServer(opts));
const updateBusinessSettingsFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(updateBusinessSettingsFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  if (session.role !== "owner") throw new Error("Only business owner can change settings");
  const db = await getDb();
  const business = await db.collection("businesses").findOne({
    owner_id: session.ownerId
  });
  if (!business) throw new Error("Business not found");
  await db.collection("businesses").updateOne({
    _id: business._id
  }, {
    $set: data
  });
  return {
    success: true
  };
});
const createEmployeeLicenseFn_createServerFn_handler = createServerRpc({
  id: "bf95e95aac424cf38fa7667815f0d56e663114c36d7ad7190287431402acaab2",
  name: "createEmployeeLicenseFn",
  filename: "src/lib/rpc-admin.ts"
}, (opts) => createEmployeeLicenseFn.__executeServer(opts));
const createEmployeeLicenseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createEmployeeLicenseFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  if (session.role !== "owner") throw new Error("Only owner can create employee licenses");
  const db = await getDb();
  const business = await db.collection("businesses").findOne({
    owner_id: session.ownerId
  });
  if (!business) throw new Error("Business not found");
  const usedCount = await db.collection("licenses").countDocuments({
    type: "employee",
    business_id: business._id
  });
  if (usedCount >= business.employee_limit) {
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
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  return {
    key
  };
});
const updateEmployeePermissionsFn_createServerFn_handler = createServerRpc({
  id: "aba10c5c6f76da3873d9443c9f089218dcc89ff7515283a40c3f757b777f33a9",
  name: "updateEmployeePermissionsFn",
  filename: "src/lib/rpc-admin.ts"
}, (opts) => updateEmployeePermissionsFn.__executeServer(opts));
const updateEmployeePermissionsFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(updateEmployeePermissionsFn_createServerFn_handler, async ({
  data
}) => {
  const session = await requireSession();
  if (session.role !== "owner") throw new Error("Only owner can update permissions");
  const db = await getDb();
  await db.collection("users").updateOne({
    _id: data.employeeId,
    owner_id: session.ownerId,
    role: "employee"
  }, {
    $set: {
      permissions: data.permissions
    }
  });
  return {
    success: true
  };
});
const deleteLicenseFn_createServerFn_handler = createServerRpc({
  id: "351bef4856dd2798fa6dc663571f1678937a6e487cff673966f0fe8a087904f3",
  name: "deleteLicenseFn",
  filename: "src/lib/rpc-admin.ts"
}, (opts) => deleteLicenseFn.__executeServer(opts));
const deleteLicenseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(deleteLicenseFn_createServerFn_handler, async ({
  data
}) => {
  const db = await getDb();
  const key = data.licenseKey.trim().toUpperCase();
  const license = await db.collection("licenses").findOne({
    _id: key
  });
  if (!license) throw new Error("License not found");
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
  await db.collection("licenses").deleteOne({
    _id: key
  });
  return {
    success: true
  };
});
export {
  activateLicenseFn_createServerFn_handler,
  createEmployeeLicenseFn_createServerFn_handler,
  deleteLicenseFn_createServerFn_handler,
  generatePlatformLicenseFn_createServerFn_handler,
  getBusinessSettingsFn_createServerFn_handler,
  listBusinessesFn_createServerFn_handler,
  listPlatformLicensesFn_createServerFn_handler,
  superAdminCheckFn_createServerFn_handler,
  superAdminLoginFn_createServerFn_handler,
  superAdminLogoutFn_createServerFn_handler,
  updateBusinessSettingsFn_createServerFn_handler,
  updateEmployeePermissionsFn_createServerFn_handler
};
