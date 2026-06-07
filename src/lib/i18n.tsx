import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "bn" | "en";

const dict = {
  app_name: { bn: "ড্রিম ফ্যাশন", en: "Dream Fashion" },
  tagline: { bn: "ইনভেন্টরি ও বিক্রয় ব্যবস্থাপনা", en: "Inventory & Sales" },
  // nav
  home: { bn: "হোম", en: "Home" },
  products: { bn: "পণ্য", en: "Products" },
  sales: { bn: "বিক্রি", en: "Sales" },
  parties: { bn: "পার্টি", en: "Parties" },
  more: { bn: "আরও", en: "More" },
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
  cash_sale: { bn: "নগদ বিক্রি", en: "Cash sale" },
  credit_sale: { bn: "বাকী বিক্রি", en: "Credit sale" },
  profit: { bn: "লাভ", en: "Profit" },
  expense: { bn: "দোকান খরচ", en: "Expense" },
  due: { bn: "মোট বাকী", en: "Total dues" },
  cash_in_hand: { bn: "হাতে নগদ", en: "Cash in hand" },
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
  outstanding: { bn: "বাকী টাকা", en: "Outstanding" },
  no_parties: { bn: "কোনো পার্টি যোগ করা হয়নি", en: "No parties added" },
  total_owed: { bn: "মোট প্রাপ্য", en: "Total owed to you" },
  history: { bn: "ইতিহাস", en: "History" },
  owner_withdraw: { bn: "মালিক টাকা নেওয়া", en: "Owner withdrawal" },
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

  const t = (k: DictKey) => dict[k][lang];
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used within I18nProvider");
  return ctx;
}