const OWNER_PERMISSIONS = {
  dashboard: true,
  products: true,
  sales: true,
  parties: true,
  purchases: true,
  expenses: true,
  settings: true,
  reports: true
};
const DEFAULT_EMPLOYEE_PERMISSIONS = {
  dashboard: true,
  products: true,
  sales: true,
  parties: false,
  purchases: false,
  expenses: false,
  settings: false,
  reports: false
};
function resolvePermissions(role, permissions) {
  if (role === "owner") return OWNER_PERMISSIONS;
  return permissions ?? DEFAULT_EMPLOYEE_PERMISSIONS;
}
function canAccess(permissions, module) {
  return permissions?.[module] ?? false;
}
const ROUTE_PERMISSIONS = [
  { prefix: "/parties", perm: "parties" },
  { prefix: "/expenses", perm: "expenses" },
  { prefix: "/trackback", perm: "reports" },
  { prefix: "/cash-management", perm: "expenses" },
  { prefix: "/somiti", perm: "expenses" },
  { prefix: "/settings", perm: "settings" },
  { prefix: "/purchases", perm: "purchases" }
];
function permissionForPath(pathname) {
  const match = ROUTE_PERMISSIONS.find((r) => pathname === r.prefix || pathname.startsWith(r.prefix + "/"));
  return match?.perm ?? null;
}
export {
  DEFAULT_EMPLOYEE_PERMISSIONS as D,
  OWNER_PERMISSIONS as O,
  canAccess as c,
  permissionForPath as p,
  resolvePermissions as r
};
