import { e as createSsrRpc } from "./router-z4LwQaWn.mjs";
import { c as createServerFn } from "./server-DaU8DV72.mjs";
const superAdminLoginFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("a4343087d568b7ad350c17256fd77d25f0ce41ccc68dcda33aa9015bb55ec622"));
const superAdminLogoutFn = createServerFn({
  method: "POST"
}).handler(createSsrRpc("3601c9c86c4f1f6edf292e76bb40111a0bb2426563ca38a659bc1c38f4e61703"));
const superAdminCheckFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("272a4c0546229cb6a7b82f9e51c71785985819b1fd325be74f5a2e71ef9bfd61"));
const generatePlatformLicenseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("30a6f54f1363e67776c7eba415c2f9b4d4a3e44c3a93efdb6ab34982043b6ffd"));
const listPlatformLicensesFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("2f529d33d7ad06cd3d36f90e4910479633ac707b67acd8feb8a2b3afdeaa7f57"));
const listBusinessesFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("edd8031c6ee6a90fcca4a7a9756e9a20162b9cecd6c02c83b4d9646dd95897ed"));
const activateLicenseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("95c60082ca6cae832909e442661d4b8d7eaf7bb38a833932f37fa8d6548d4f75"));
const getBusinessSettingsFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("d253bef31ddfa5292f0bfa849b648ad0d1ba2ef1745f125bdd142e92dd8c787d"));
const updateBusinessSettingsFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("eb52a18b530af295aeac39eb9ed54dd665cc8ec50057c3ef392acb75f5d28212"));
const createEmployeeLicenseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("bf95e95aac424cf38fa7667815f0d56e663114c36d7ad7190287431402acaab2"));
const updateEmployeePermissionsFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("aba10c5c6f76da3873d9443c9f089218dcc89ff7515283a40c3f757b777f33a9"));
const deleteLicenseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("351bef4856dd2798fa6dc663571f1678937a6e487cff673966f0fe8a087904f3"));
export {
  listBusinessesFn as a,
  superAdminLoginFn as b,
  superAdminLogoutFn as c,
  deleteLicenseFn as d,
  activateLicenseFn as e,
  getBusinessSettingsFn as f,
  generatePlatformLicenseFn as g,
  createEmployeeLicenseFn as h,
  updateBusinessSettingsFn as i,
  listPlatformLicensesFn as l,
  superAdminCheckFn as s,
  updateEmployeePermissionsFn as u
};
