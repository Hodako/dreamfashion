import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-DaU8DV72.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { P as Plus } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const appCss = "/assets/styles-DgfuEmVl.css";
const dict = {
  app_name: { bn: "হাকিম ইজি", en: "HakimEzy" },
  tagline: { bn: "ইনভেন্টরি ও বিক্রয় ব্যবস্থাপনা", en: "Inventory & Sales" },
  version: { bn: "v1.0", en: "v1.0" },
  navigation: { bn: "নেভিগেশন", en: "Navigation" },
  // nav
  home: { bn: "হোম", en: "Home" },
  products: { bn: "পণ্য", en: "Products" },
  sales: { bn: "বিক্রি", en: "Sales" },
  parties: { bn: "পার্টি", en: "Parties" },
  more: { bn: "আরও", en: "More" },
  online_sell: { bn: "অনলাইন বিক্রি", en: "Online Sell" },
  cash_management: { bn: "নগদ ব্যবস্থাপনা", en: "Cash Management" },
  cashbox: { bn: "ক্যাশবক্স", en: "Cashbox" },
  add_money: { bn: "টাকা যোগ", en: "Add money" },
  take_money: { bn: "টাকা তোলা", en: "Take money" },
  view_details: { bn: "বিস্তারিত দেখুন", en: "View details" },
  cashbox_ledger: { bn: "ক্যাশবক্স লেজার", en: "Cashbox ledger" },
  money_in: { bn: "টাকা এসেছে", en: "Money in" },
  money_out: { bn: "টাকা গেছে", en: "Money out" },
  net_change: { bn: "নিট পরিবর্তন", en: "Net change" },
  all: { bn: "সব", en: "All" },
  income: { bn: "আয়", en: "Income" },
  // auth
  sign_in: { bn: "লগইন", en: "Sign in" },
  sign_up: { bn: "নতুন একাউন্ট", en: "Sign up" },
  email: { bn: "ইমেইল", en: "Email" },
  password: { bn: "পাসওয়ার্ড", en: "Password" },
  full_name: { bn: "নাম", en: "Full name" },
  sign_out: { bn: "লগআউট", en: "Sign out" },
  welcome_back: { bn: "আবার স্বাগতম", en: "Welcome back" },
  create_account: { bn: "একাউন্ট তৈরি করুন", en: "Create your account" },
  owner_only: { bn: "শুধুমাত্র মালিকের জন্য", en: "Owner-only access" },
  // dashboard
  today: { bn: "আজ", en: "Today" },
  this_week: { bn: "এই সপ্তাহ", en: "This week" },
  this_month: { bn: "এই মাস", en: "This month" },
  custom: { bn: "কাস্টম", en: "Custom" },
  cash_sale: { bn: "নগদ বিক্রি", en: "Cash sale" },
  credit_sale: { bn: "বাকী বিক্রি", en: "Credit sale" },
  profit: { bn: "লাভ", en: "Profit" },
  expense: { bn: "দোকান খরচ", en: "Expense" },
  due: { bn: "মোট বাকী", en: "Total dues" },
  cash_in_hand: { bn: "হাতে নগদ", en: "Cash in hand" },
  total_sales: { bn: "মোট বিক্রি", en: "Total sales" },
  expenses_withdrawals: { bn: "খরচ ও উত্তোলন", en: "Expenses & withdrawals" },
  daily_sales_trend: { bn: "দৈনিক বিক্রির ট্রেন্ড", en: "Daily sales trend" },
  payment_method_breakdown: { bn: "পেমেন্ট পদ্ধতি বিশ্লেষণ", en: "Payment method breakdown" },
  monthly_cash_flow: { bn: "মাসিক ক্যাশ ফ্লো", en: "Monthly cash flow" },
  inflow: { bn: "আয়", en: "Inflow" },
  outflow: { bn: "ব্যয়", en: "Outflow" },
  export_csv: { bn: "CSV এক্সপোর্ট", en: "Export CSV" },
  export_json: { bn: "JSON এক্সপোর্ট", en: "Export JSON" },
  recent_activity: { bn: "সাম্প্রতিক কার্যকলাপ", en: "Recent activity" },
  no_activity: { bn: "এখনো কোনো কার্যকলাপ নেই", en: "Nothing yet" },
  // products
  add_product: { bn: "নতুন পণ্য", en: "Add product" },
  product_name: { bn: "পণ্যের নাম", en: "Product name" },
  buy_price: { bn: "কেনা দাম", en: "Buy price" },
  sell_price: { bn: "বিক্রয় দাম", en: "Sell price" },
  stock: { bn: "স্টক", en: "Stock" },
  image: { bn: "ছবি", en: "Image" },
  save: { bn: "সংরক্ষণ", en: "Save" },
  cancel: { bn: "বাতিল", en: "Cancel" },
  delete: { bn: "ডিলিট", en: "Delete" },
  edit: { bn: "এডিট", en: "Edit" },
  buy: { bn: "ক্রয়", en: "Buy" },
  sell: { bn: "বিক্রি", en: "Sell" },
  no_products: { bn: "এখনো কোনো পণ্য যোগ করা হয়নি", en: "No products yet" },
  upload_image: { bn: "ছবি আপলোড", en: "Upload image" },
  all_products: { bn: "সকল পণ্য", en: "All Products" },
  best_selling: { bn: "সেরা বিক্রি", en: "Best Selling" },
  less_selling: { bn: "কম বিক্রি", en: "Less Selling" },
  critical_stock: { bn: "সংকট স্টক", en: "Critical Stock" },
  most_profited: { bn: "সর্বোত্তম লাভ", en: "Most Profited" },
  top_rated: { bn: "সেরা রেটেড", en: "Top Rated" },
  // sales
  new_sale: { bn: "নতুন বিক্রি", en: "New sale" },
  select_product: { bn: "পণ্য নির্বাচন করুন", en: "Select product" },
  qty: { bn: "পরিমাণ", en: "Qty" },
  party: { bn: "পার্টি", en: "Party" },
  paid_amount: { bn: "জমা টাকা", en: "Paid amount" },
  due_amount: { bn: "বাকী টাকা", en: "Due amount" },
  record_sale: { bn: "বিক্রি যোগ করুন", en: "Record sale" },
  no_sales: { bn: "এখনো কোনো বিক্রি নেই", en: "No sales yet" },
  // purchases
  new_purchase: { bn: "নতুন ক্রয়", en: "New purchase" },
  unit_cost: { bn: "প্রতি ইউনিট দাম", en: "Unit cost" },
  total: { bn: "মোট", en: "Total" },
  // expenses
  expenses: { bn: "দোকান খরচ", en: "Expenses" },
  add_expense: { bn: "খরচ যোগ", en: "Add expense" },
  title: { bn: "শিরোনাম", en: "Title" },
  amount: { bn: "টাকা", en: "Amount" },
  note: { bn: "নোট", en: "Note" },
  // somiti
  somiti: { bn: "সমিতি", en: "Samity" },
  deposit: { bn: "জমা", en: "Deposit" },
  withdraw: { bn: "উত্তোলন", en: "Withdraw" },
  add_somiti: { bn: "সমিতি এন্ট্রি", en: "Samity entry" },
  balance: { bn: "ব্যালেন্স", en: "Balance" },
  // parties
  party_collection: { bn: "পার্টি কালেকশন", en: "Party collection" },
  add_party: { bn: "নতুন পার্টি", en: "Add party" },
  party_name: { bn: "পার্টির নাম", en: "Party name" },
  phone: { bn: "ফোন", en: "Phone" },
  collect_payment: { bn: "টাকা আদায়", en: "Collect payment" },
  add_money_owed: { bn: "পাওনা টাকা যোগ করুন", en: "Add money owed" },
  outstanding: { bn: "বাকী টাকা", en: "Outstanding" },
  no_parties: { bn: "কোনো পার্টি যোগ করা হয়নি", en: "No parties added" },
  total_owed: { bn: "মোট প্রাপ্য", en: "Total owed to you" },
  history: { bn: "ইতিহাস", en: "History" },
  owner_withdraw: { bn: "মালিক টাকা নেওয়া", en: "Owner withdrawal" },
  added_to: { bn: "কে যোগ করা হয়েছে", en: "added to" },
  money_owed: { bn: "পাওনা টাকা", en: "Money Owed" },
  add: { bn: "যোগ", en: "Add" },
  // common
  language: { bn: "ভাষা", en: "Language" },
  settings: { bn: "সেটিংস", en: "Settings" },
  taka: { bn: "৳", en: "৳" },
  loading: { bn: "লোড হচ্ছে...", en: "Loading…" },
  required: { bn: "আবশ্যক", en: "Required" },
  date: { bn: "তারিখ", en: "Date" },
  type: { bn: "ধরন", en: "Type" },
  cash: { bn: "নগদ", en: "Cash" },
  credit: { bn: "বাকী", en: "Credit" },
  dashboard: { bn: "ড্যাশবোর্ড", en: "Dashboard" },
  view: { bn: "দেখুন", en: "View" },
  search: { bn: "খুঁজুন", en: "Search" },
  return_product: { bn: "পণ্য ফেরত", en: "Return product" },
  returned: { bn: "ফেরত দেওয়া", en: "Returned" },
  edit_party: { bn: "পার্টি এডিট", en: "Edit party" },
  money_payable: { bn: "আমার দেনা", en: "Money I owe" },
  add_payable: { bn: "দেনা যোগ করুন", en: "Add payable" },
  pay_party: { bn: "পার্টিকে টাকা দিন", en: "Pay party" },
  receivable: { bn: "পাওনা", en: "Receivable" },
  payable: { bn: "দেনা", en: "Payable" },
  clear: { bn: "পরিষ্কার", en: "Clear" },
  search_products: { bn: "পণ্য খুঁজুন…", en: "Search products…" },
  universal_search: { bn: "সব কিছু খুঁজুন…", en: "Search everything…" },
  no_results: { bn: "কিছু পাওয়া যায়নি", en: "No results found" },
  delete_license: { bn: "লাইসেন্স মুছুন", en: "Delete license" },
  sell_price_on_purchase: { bn: "বিক্রয় দাম ক্রয়ের সময় সেট করুন", en: "Set sell price when purchasing stock" },
  add_to_cart: { bn: "কার্টে যোগ", en: "Add to cart" },
  cart: { bn: "কার্ট", en: "Cart" },
  borrowed_from_me: { bn: "আমার পাওনা", en: "They owe me" },
  borrowed_from_him: { bn: "আমার দেনা", en: "I owe them" },
  theme_light: { bn: "লাইট", en: "Light" },
  theme_dark: { bn: "ডার্ক", en: "Dark" },
  theme_system: { bn: "সিস্টেম", en: "System" },
  appearance: { bn: "থিম", en: "Appearance" },
  search_sales: { bn: "বিক্রি খুঁজুন…", en: "Search sales…" },
  search_parties: { bn: "পার্টি খুঁজুন…", en: "Search parties…" },
  records: { bn: "রেকর্ড", en: "records" },
  export_sales_csv: { bn: "বিক্রি CSV", en: "Export sales" },
  export_buys_csv: { bn: "ক্রয় CSV", en: "Export buys" },
  trackback: { bn: "ট্র্যাকব্যাক", en: "Track Back" },
  reports: { bn: "রিপোর্ট", en: "Reports" },
  download_csv: { bn: "CSV ডাউনলোড", en: "Download CSV" },
  filter_date: { bn: "তারিখ ফিল্টার", en: "Filter by date" },
  all_records: { bn: "সকল রেকর্ড", en: "All records" },
  purchases: { bn: "ক্রয়", en: "Purchases" },
  returns: { bn: "ফেরত", en: "Returns" }
};
const I18nContext = reactExports.createContext(null);
function I18nProvider({ children }) {
  const [lang, setLangState] = reactExports.useState("bn");
  reactExports.useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (saved === "bn" || saved === "en") setLangState(saved);
  }, []);
  reactExports.useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };
  const t = (k) => dict[k]?.[lang] ?? k;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(I18nContext.Provider, { value: { lang, setLang, t }, children });
}
function useT() {
  const ctx = reactExports.useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used within I18nProvider");
  return ctx;
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getMeFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("8a91d402077b4649c709527a495cc7b5a81bd0b26f8a90b5a7d5855d123aa999"));
const loginFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("0fd32aa5f3809e0d748e1f334a3fff5123b5cf93a56048ccdd74bb7d0c5dadd6"));
const registerFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("1d29bbe418cf2733340dd0d856c3d6fcfe03efd036ec6c8f538c10aa3b96de4c"));
const logoutFn = createServerFn({
  method: "POST"
}).handler(createSsrRpc("5e5fcc18e008e8f662e0c8c0e6e8cfb0d5c1136d26b2c08ea70ddf6ff64f115d"));
const getProductsFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("197878eb75fe7c9da93872f98bb82ca2406010b0d7bf9e0bd3de872f78ed2fbd"));
const createProductFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("d478ab63d4264e8b18ec3e043f7ff94f9da0117ce5c7f8c6c8aff64d210993a2"));
const updateProductFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("406cc3c3a9fa081881ac5e8a069753b231d1761be4d289d6390f3f44661a7d21"));
createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("4f78fb314b19d41f1bc0efee3c89ba53af44743f8286f5095e9251aa543574e3"));
const getPartiesFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("2d85f76d9c7bedd5385c1bb7aead0e30d04d94eb12ff5bc2f4168ba2e8bd4b3e"));
const createPartyFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("da56d4798480e46cbef8a26e458781374e2acc089a4cf199553f67f9c3199138"));
const updatePartyFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("18c5496affc8b698b7bb4e70ce29d0259a07063eff31aac3129d5ffc7a8a8b31"));
const deletePartyFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("dc5b146b8d549d8ad532d7224b51832cafb9444996c11125ae64c4a203903437"));
const getPartyFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("34c6f1fbb5b43b372a6c7ff5ed1ec519ad600d02b86ff57a889a79d630347256"));
const createPartyReceivableFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("b62fc769a8bbdb401797d8d00afe0991ec9e60e70490bdebf0c3083fa67778a6"));
const createPartyPayableFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("28e765981f11700a76cbb3c540030833ab66c3f776206bc2c0eb32ed470ecbaf"));
const getAllPartyReceivablesFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("895302891b18daebd4ff7034b6fd480133c3e5c126ae1027e67311bf8fccc350"));
const getPartyReceivablesFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("6d2af82d0ca322bb084927cf650ba88eac72dc0870f572e06a36f7822ac2ee9e"));
const getPartyPayablesFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("71217d3113d4faefdd53ed334885ec2b04913662aa56b1f3c4fb26386a52fd1c"));
const deletePartyReceivableFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("5b54f9ad5ddc52b08a888f96c7624add6c1925e9e50b3e634853ec4fe93a1cb3"));
const deletePartyPayableFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("852718695be7a4316b93825e8bfc2f2909f10860a5220541da50238a16344589"));
const createPayableSettlementFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("3a6a58631b94a3534bc75bb72f304da1dafd65e1c83358c16b6e2bafe17cee94"));
const getPayableSettlementsFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("715cc11c14eb60a0c8e3dd7b2569f441039b53444ecb8743aad47db9f519493f"));
const getSalesFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("a9bfb9bd91b0cb3986fdd64f61014658c86d729ae6e399630f304d2ff4790c46"));
const getSalesForPartyFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("505280a5105db09ac030398b23ea33ea4111696ed719e0d466723cd01551c8ac"));
const createSaleFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("bf49f786e7cb1d9f6cfbe91f9b2269d546cb84b819c04477a15ed806c3128612"));
const deleteSaleFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("fdc9026d53020babcb8de9abf44f84ee1f339c3a08206f02572e5cbd970ec6ed"));
const createReturnFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("42f6ec911953635df9810fd5660d8e3571c270d5d89f6168be7467cdfd775ac3"));
const getReturnsFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("69899356142ae9a152929e3bb10b33c7d665caa01caf69a2ea0954785d8a6be7"));
const getPurchasesFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("1c60a22c6a61ca2ac303f8d307ec08a20b0fa9415ff3ca7d41dfc434ff2fd036"));
const createPurchaseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("ea2681f0406c0c8ea90fc2ea0930cd4d665256d13c207f974e50570af7c0f912"));
const deletePurchaseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("b921f4eddc9cd7e4a582ecaab146398749c0a5a71c99ec5742ac1d61e8dfcc55"));
const getExpensesFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("67c35452109f9ec3520af996f2bd846942435fd9b068e9f44dfe34dadbf39a02"));
const createExpenseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("875f3cb0f03514f86b4d32afb3a412c90a2ecdac76823a14b62d4b8cceac05b7"));
const deleteExpenseFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("833c2d0892adb464f7a955fe8c4e47020025023b789da8b86a47813b4b51b7a1"));
const getPaymentsForPartyFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("759b85110030d10fa0981da550e9dd9f6689cd8e53ad73d712e4975a85fba239"));
const getAllPaymentsFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("e333a5b29f70af28fbb49ec5669f9b43ef1ade290d9e44c14a8de482648f57e3"));
const createPaymentFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("856b35b2d1891c0521352d858580fc54187d46d4b8aab4ba8bad2c623dcc431b"));
const deletePaymentFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("e7b245cbb50146abd5b6cab9c826554ea29f02433114c0818a0bc262b47d208a"));
const getSomitiFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("54c56bcf809309a8867d9eae3c5340d7da199983417432a69e2edc53656ef68e"));
const createSomitiFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("2244afac97482fdd48b13168de6ab9726ff4259df2bf4753978b5fd36735e02b"));
const getWithdrawalsFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("211730cff76a79abc2f04a02a35314747abd08977370e88f9c9c6c0830334f9e"));
const createWithdrawalFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("fea9cf785c105c00b2e1a8ddaf2b329b5dfe9573fa8eaa5ca8035d012e5db8ac"));
const getCashboxFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("44008eb5112cd8a2be426a8be052a1a73217a3c02af39861387e28b13216cd91"));
const createCashboxFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("17937ed3c6db3906bfab398605947fd2f200482cc81bb0ecb845cb0734908c91"));
const uploadImageFn = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("6a2b28455971168f16628f6e1f1145972c6630849ad7b4ff9c85e9fd79c22eff"));
const AUTH_KEY = "hz-auth-profile";
const BRAND_KEY = "hz-brand";
function read(key, maxAgeMs) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.updatedAt && Date.now() - parsed.updatedAt > maxAgeMs) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
function write(key, data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify({ ...data, updatedAt: Date.now() }));
  } catch {
  }
}
const PROFILE_TTL = 7 * 24 * 60 * 60 * 1e3;
function readAuthProfile() {
  return read(AUTH_KEY, PROFILE_TTL);
}
function writeAuthProfile(profile) {
  write(AUTH_KEY, profile);
}
function clearAuthProfile() {
  if (typeof window !== "undefined") localStorage.removeItem(AUTH_KEY);
}
function writeBrand(brand) {
  write(BRAND_KEY, brand);
}
const Ctx$1 = reactExports.createContext({
  user: null,
  loading: true,
  login: () => {
  },
  logout: async () => {
  },
  refresh: async () => {
  }
});
function cacheUser(u) {
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
    logo_url: u.logo_url
  });
}
function profileToUser(p) {
  if (!p) return null;
  return {
    id: p.id,
    email: p.email,
    full_name: p.full_name,
    activated: p.activated,
    role: p.role,
    business_id: p.business_id,
    business_name: p.business_name,
    logo_url: p.logo_url
  };
}
function AuthProvider({ children }) {
  const cached = typeof window !== "undefined" ? readAuthProfile() : null;
  const [user, setUser] = reactExports.useState(() => profileToUser(cached));
  const [loading, setLoading] = reactExports.useState(!cached);
  async function checkUser() {
    try {
      const data = await getMeFn();
      const next = data.user;
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
  reactExports.useEffect(() => {
    void checkUser();
  }, []);
  const login = (newUser) => {
    setUser(newUser);
    cacheUser(newUser);
    writeBrand({ name: newUser.business_name, logo_url: newUser.logo_url });
    setLoading(false);
  };
  const logout = async () => {
    try {
      await logoutFn();
    } catch {
    }
    setUser(null);
    clearAuthProfile();
    setLoading(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx$1.Provider, { value: { user, loading, login, logout, refresh: checkUser }, children });
}
const useAuth = () => reactExports.useContext(Ctx$1);
const STORAGE_KEY = "hz-theme";
const Ctx = reactExports.createContext(null);
function systemPrefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function resolveTheme(mode) {
  if (mode === "system") return systemPrefersDark() ? "dark" : "light";
  return mode;
}
function applyTheme(resolved) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}
function ThemeProvider({ children }) {
  const [theme, setThemeState] = reactExports.useState(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" || saved === "system" ? saved : "light";
  });
  const resolved = resolveTheme(theme);
  reactExports.useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);
  reactExports.useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(resolveTheme("system"));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);
  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  };
  const toggle = () => setTheme(resolved === "dark" ? "light" : "dark");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value: { theme, resolved, setTheme, toggle }, children });
}
function useTheme() {
  const ctx = reactExports.useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Try refreshing or go back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { suppressHydrationWarning: true, children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$l.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(I18nProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-center" })
  ] }) }) }) });
}
const Route$l = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "theme-color", content: "#1a3d2e" },
      { title: "HakimEzy — Inventory & Sales" },
      { name: "description", content: "Inventory and sales management for HakimEzy." },
      { name: "author", content: "HakimEzy" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Hind+Siliguri:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@400;500;600;700&display=swap"
      },
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
const $$splitComponentImporter$k = () => import("./whois2uperadmin-DrKQFLu3.mjs");
const Route$k = createFileRoute("/whois2uperadmin")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./auth-1fIDFE2X.mjs");
const Route$j = createFileRoute("/auth")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./activate-Q0L-XjMY.mjs");
const Route$i = createFileRoute("/activate")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./route--IOTzW6c.mjs");
const Route$h = createFileRoute("/_authenticated")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./index-BJeMyIs_.mjs");
const Route$g = createFileRoute("/")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./trackback-hRyJUdw5.mjs");
const Route$f = createFileRoute("/_authenticated/trackback")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./somiti-BFf7vpj7.mjs");
const Route$e = createFileRoute("/_authenticated/somiti")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./settings-B3Ri2aOU.mjs");
const Route$d = createFileRoute("/_authenticated/settings")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./sales-DYCBA_5g.mjs");
const Route$c = createFileRoute("/_authenticated/sales")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./purchases-CfNok_t-.mjs");
const Route$b = createFileRoute("/_authenticated/purchases")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./products-Oqnucl0p.mjs");
const Route$a = createFileRoute("/_authenticated/products")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
function FAB({
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: "fixed mobile-fab-bottom right-3 z-20 size-12 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg shadow-primary/25 active:scale-95 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-5" }) });
}
const $$splitComponentImporter$9 = () => import("./parties-BFrD8upK.mjs");
const Route$9 = createFileRoute("/_authenticated/parties")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./online-sells-DKA-AN-N.mjs");
const Route$8 = createFileRoute("/_authenticated/online-sells")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./more-8Y9A_CQp.mjs");
const Route$7 = createFileRoute("/_authenticated/more")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./expenses-D0mMK0Ix.mjs");
const Route$6 = createFileRoute("/_authenticated/expenses")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./dashboard-VHEnM0Og.mjs");
const Route$5 = createFileRoute("/_authenticated/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./cash-management-C6kpZg0R.mjs");
const Route$4 = createFileRoute("/_authenticated/cash-management")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./parties.index-8CRCKY_l.mjs");
const Route$3 = createFileRoute("/_authenticated/parties/")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./cash-management.index-BDfN8-oZ.mjs");
const Route$2 = createFileRoute("/_authenticated/cash-management/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./parties._id-cG3HzDqb.mjs");
const Route$1 = createFileRoute("/_authenticated/parties/$id")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./cash-management.cashbox-CyA1vVh3.mjs");
const Route = createFileRoute("/_authenticated/cash-management/cashbox")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const Whois2uperadminRoute = Route$k.update({
  id: "/whois2uperadmin",
  path: "/whois2uperadmin",
  getParentRoute: () => Route$l
});
const AuthRoute = Route$j.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$l
});
const ActivateRoute = Route$i.update({
  id: "/activate",
  path: "/activate",
  getParentRoute: () => Route$l
});
const AuthenticatedRouteRoute = Route$h.update({
  id: "/_authenticated",
  getParentRoute: () => Route$l
});
const IndexRoute = Route$g.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$l
});
const AuthenticatedTrackbackRoute = Route$f.update({
  id: "/trackback",
  path: "/trackback",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedSomitiRoute = Route$e.update({
  id: "/somiti",
  path: "/somiti",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedSettingsRoute = Route$d.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedSalesRoute = Route$c.update({
  id: "/sales",
  path: "/sales",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedPurchasesRoute = Route$b.update({
  id: "/purchases",
  path: "/purchases",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedProductsRoute = Route$a.update({
  id: "/products",
  path: "/products",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedPartiesRoute = Route$9.update({
  id: "/parties",
  path: "/parties",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedOnlineSellsRoute = Route$8.update({
  id: "/online-sells",
  path: "/online-sells",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedMoreRoute = Route$7.update({
  id: "/more",
  path: "/more",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedExpensesRoute = Route$6.update({
  id: "/expenses",
  path: "/expenses",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedDashboardRoute = Route$5.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedCashManagementRoute = Route$4.update({
  id: "/cash-management",
  path: "/cash-management",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedPartiesIndexRoute = Route$3.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedPartiesRoute
});
const AuthenticatedCashManagementIndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedCashManagementRoute
});
const AuthenticatedPartiesIdRoute = Route$1.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AuthenticatedPartiesRoute
});
const AuthenticatedCashManagementCashboxRoute = Route.update({
  id: "/cashbox",
  path: "/cashbox",
  getParentRoute: () => AuthenticatedCashManagementRoute
});
const AuthenticatedCashManagementRouteChildren = {
  AuthenticatedCashManagementCashboxRoute,
  AuthenticatedCashManagementIndexRoute
};
const AuthenticatedCashManagementRouteWithChildren = AuthenticatedCashManagementRoute._addFileChildren(
  AuthenticatedCashManagementRouteChildren
);
const AuthenticatedPartiesRouteChildren = {
  AuthenticatedPartiesIdRoute,
  AuthenticatedPartiesIndexRoute
};
const AuthenticatedPartiesRouteWithChildren = AuthenticatedPartiesRoute._addFileChildren(AuthenticatedPartiesRouteChildren);
const AuthenticatedRouteRouteChildren = {
  AuthenticatedCashManagementRoute: AuthenticatedCashManagementRouteWithChildren,
  AuthenticatedDashboardRoute,
  AuthenticatedExpensesRoute,
  AuthenticatedMoreRoute,
  AuthenticatedOnlineSellsRoute,
  AuthenticatedPartiesRoute: AuthenticatedPartiesRouteWithChildren,
  AuthenticatedProductsRoute,
  AuthenticatedPurchasesRoute,
  AuthenticatedSalesRoute,
  AuthenticatedSettingsRoute,
  AuthenticatedSomitiRoute,
  AuthenticatedTrackbackRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  ActivateRoute,
  AuthRoute,
  Whois2uperadminRoute
};
const routeTree = Route$l._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1e3,
        gcTime: 60 * 60 * 1e3,
        refetchOnWindowFocus: false,
        retry: 1
      }
    }
  });
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 6e4
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  createPartyReceivableFn as A,
  createPartyPayableFn as B,
  createCashboxFn as C,
  getSomitiFn as D,
  getSalesFn as E,
  FAB as F,
  getProductsFn as G,
  getPartiesFn as H,
  getPurchasesFn as I,
  getExpensesFn as J,
  getReturnsFn as K,
  getAllPaymentsFn as L,
  getAllPartyReceivablesFn as M,
  getPartyFn as N,
  getSalesForPartyFn as O,
  getPaymentsForPartyFn as P,
  getPartyReceivablesFn as Q,
  Route$1 as R,
  getPartyPayablesFn as S,
  getPayableSettlementsFn as T,
  getWithdrawalsFn as U,
  getCashboxFn as V,
  router as W,
  useT as a,
  useTheme as b,
  createSomitiFn as c,
  uploadImageFn as d,
  createSsrRpc as e,
  createReturnFn as f,
  deletePurchaseFn as g,
  updateProductFn as h,
  createProductFn as i,
  createPurchaseFn as j,
  createSaleFn as k,
  loginFn as l,
  createWithdrawalFn as m,
  deleteExpenseFn as n,
  createExpenseFn as o,
  createPartyFn as p,
  deletePartyFn as q,
  registerFn as r,
  deletePaymentFn as s,
  deleteSaleFn as t,
  useAuth as u,
  deletePartyReceivableFn as v,
  deletePartyPayableFn as w,
  createPaymentFn as x,
  createPayableSettlementFn as y,
  updatePartyFn as z
};
