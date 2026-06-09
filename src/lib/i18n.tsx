import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "bn" | "en";

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
  returns: { bn: "ফেরত", en: "Returns" },
} as const;

export type DictKey = keyof typeof dict;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: DictKey) => string };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (saved === "bn" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (k: DictKey) => dict[k]?.[lang] ?? k;
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used within I18nProvider");
  return ctx;
}