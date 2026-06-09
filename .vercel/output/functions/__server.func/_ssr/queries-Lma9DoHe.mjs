import { D as getSomitiFn, E as getSalesFn, J as getExpensesFn, U as getWithdrawalsFn, G as getProductsFn, H as getPartiesFn, I as getPurchasesFn, K as getReturnsFn, V as getCashboxFn, L as getAllPaymentsFn, M as getAllPartyReceivablesFn, N as getPartyFn, O as getSalesForPartyFn, P as getPaymentsForPartyFn, Q as getPartyReceivablesFn, S as getPartyPayablesFn, T as getPayableSettlementsFn } from "./router-z4LwQaWn.mjs";
const getProducts = () => getProductsFn();
const getParties = () => getPartiesFn();
const getParty = (id) => getPartyFn({ data: { id } });
const getSales = () => getSalesFn();
const getPurchases = () => getPurchasesFn();
const getExpenses = () => getExpensesFn();
const getSomiti = () => getSomitiFn();
const getWithdrawals = () => getWithdrawalsFn();
const getCashbox = () => getCashboxFn();
const getSalesForParty = (partyId) => getSalesForPartyFn({ data: { partyId } });
const getPaymentsForParty = (partyId) => getPaymentsForPartyFn({ data: { partyId } });
const getAllPayments = () => getAllPaymentsFn();
const getAllPartyReceivables = () => getAllPartyReceivablesFn();
const getPartyReceivables = (partyId) => getPartyReceivablesFn({ data: { partyId } });
const getPartyPayables = (partyId) => getPartyPayablesFn({ data: { partyId } });
const getPayableSettlements = (partyId) => getPayableSettlementsFn({ data: { partyId } });
const getReturns = () => getReturnsFn();
async function signedImage(path) {
  return path || null;
}
export {
  getSales as a,
  getParties as b,
  getPurchases as c,
  getExpenses as d,
  getReturns as e,
  getSomiti as f,
  getProducts as g,
  getWithdrawals as h,
  getCashbox as i,
  getAllPayments as j,
  getAllPartyReceivables as k,
  getParty as l,
  getSalesForParty as m,
  getPaymentsForParty as n,
  getPartyReceivables as o,
  getPartyPayables as p,
  getPayableSettlements as q,
  signedImage as s
};
