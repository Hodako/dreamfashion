"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCachedQuery } from "@/hooks/use-cached-query";
import { getProducts, getParties, type Product, type Party } from "@/lib/queries";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { fmtMoney, fmtDate } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductSearchSelect } from "@/components/product-search";
import { toast } from "sonner";
import { Plus, Trash2, Printer, ArrowLeft, RefreshCw, ShoppingCart } from "lucide-react";
import Link from "next/link";

type InvoiceItem = {
  product: Product;
  qty: number;
  sellPrice: number;
};

export default function InvoicePage() {
  const { t } = useT();
  const { user } = useAuth();
  
  const { data: products = [] } = useCachedQuery(["products"], getProducts);
  const { data: parties = [] } = useCachedQuery(["parties"], getParties);

  const [selectedPartyId, setSelectedPartyId] = useState<string>("walk-in");
  const [customName, setCustomName] = useState("");
  const [customPhone, setCustomPhone] = useState("");
  
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  
  // Product Selector draft state
  const [draftProduct, setDraftProduct] = useState<string>("");
  const [draftQty, setDraftQty] = useState("1");
  const [draftPrice, setDraftPrice] = useState("");

  const [discount, setDiscount] = useState("0");
  const [paid, setPaid] = useState("");

  // Auto-fill price when product changes
  function handleProductChange(prodId: string) {
    setDraftProduct(prodId);
    const p = products.find(x => x.id === prodId);
    if (p) {
      setDraftPrice(String(p.sell_price || ""));
    }
  }

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!draftProduct) return toast.error(t("select_product"));
    
    const p = products.find(x => x.id === draftProduct);
    if (!p) return;

    const qty = Number(draftQty) || 0;
    if (qty <= 0) return toast.error(t("qty") + " > 0");

    const price = Number(draftPrice) || 0;
    if (price <= 0) return toast.error(t("sell_price") + " > 0");

    const existingIndex = invoiceItems.findIndex(item => item.product.id === p.id);
    if (existingIndex > -1) {
      setInvoiceItems(prev => prev.map((item, idx) => 
        idx === existingIndex ? { ...item, qty: item.qty + qty } : item
      ));
    } else {
      setInvoiceItems(prev => [...prev, { product: p, qty, sellPrice: price }]);
    }

    toast.success(t("item_added"));
    setDraftProduct("");
    setDraftQty("1");
    setDraftPrice("");
  }

  const subtotal = invoiceItems.reduce((acc, item) => acc + (item.qty * item.sellPrice), 0);
  const discountAmount = Number(discount) || 0;
  const total = Math.max(subtotal - discountAmount, 0);
  const paidAmount = Number(paid) || 0;
  const due = Math.max(total - paidAmount, 0);

  const activeCustomerName = useMemo(() => {
    if (selectedPartyId === "walk-in") return customName.trim() || t("walk_in_customer");
    const p = parties.find(x => x.id === selectedPartyId);
    return p ? p.name : "Unnamed Party";
  }, [selectedPartyId, customName, parties, t]);

  const activeCustomerPhone = useMemo(() => {
    if (selectedPartyId === "walk-in") return customPhone.trim() || "—";
    const p = parties.find(x => x.id === selectedPartyId);
    return p ? p.phone || "—" : "—";
  }, [selectedPartyId, customPhone, parties]);

  const invoiceNo = useMemo(() => {
    return `INV-${Date.now().toString().slice(-6)}`;
  }, [invoiceItems]);

  function handlePrint() {
    if (invoiceItems.length === 0) return toast.error(t("no_items_in_cart"));
    window.print();
  }

  function handleReset() {
    setInvoiceItems([]);
    setSelectedPartyId("walk-in");
    setCustomName("");
    setCustomPhone("");
    setDiscount("0");
    setPaid("");
    setDraftProduct("");
    setDraftQty("1");
    setDraftPrice("");
    toast.success(t("clear"));
  }

  return (
    <div className="space-y-4 pb-12">
      {/* Top action bar */}
      <div className="flex items-center justify-between no-print">
        <Link href="/more">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4 mr-1" />{t("more")}
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="size-3.5 mr-1" />{t("clear")}
          </Button>
          <Button size="sm" onClick={handlePrint} disabled={invoiceItems.length === 0}>
            <Printer className="size-3.5 mr-1" />{t("print")} / PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 no-print">
        {/* Billing Info Panel */}
        <Card className="lg:col-span-1 p-4 glass-card space-y-4">
          <h2 className="font-semibold text-sm flex items-center gap-1.5">
            <ShoppingCart className="size-4 text-primary" />
            {t("customer_details")}
          </h2>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">{t("select_customer")}</Label>
              <Select value={selectedPartyId} onValueChange={setSelectedPartyId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t("walk_in_customer")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walk-in">{t("walk_in_customer")}</SelectItem>
                  {parties.filter(p => !p.archived).map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPartyId === "walk-in" && (
              <>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{t("full_name")}</Label>
                  <Input 
                    placeholder={t("full_name")} 
                    value={customName} 
                    onChange={e => setCustomName(e.target.value)} 
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{t("phone")}</Label>
                  <Input 
                    placeholder={t("customer_phone")} 
                    value={customPhone} 
                    onChange={e => setCustomPhone(e.target.value)} 
                    className="h-9"
                    inputMode="tel"
                  />
                </div>
              </>
            )}

            {selectedPartyId !== "walk-in" && (
              <div className="p-2.5 rounded-lg bg-muted/30 text-xs space-y-1">
                <div><strong>{t("party_name")}:</strong> {activeCustomerName}</div>
                <div><strong>{t("phone")}:</strong> {activeCustomerPhone}</div>
              </div>
            )}
          </div>
        </Card>

        {/* Add Items & Cart Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Add product form */}
          <Card className="p-4 glass-card">
            <form onSubmit={handleAddItem} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1 md:col-span-1">
                  <Label className="text-xs text-muted-foreground">{t("select_product")}</Label>
                  <ProductSearchSelect 
                    products={products.filter(p => !p.archived && p.stock > 0)} 
                    value={draftProduct} 
                    onChange={handleProductChange} 
                  />
                </div>
                <div className="space-y-1 col-span-1">
                  <Label className="text-xs text-muted-foreground">{t("qty")}</Label>
                  <Input 
                    type="number" 
                    min={1} 
                    value={draftQty} 
                    onChange={e => setDraftQty(e.target.value)} 
                    className="h-9"
                    inputMode="numeric"
                  />
                </div>
                <div className="space-y-1 col-span-1">
                  <Label className="text-xs text-muted-foreground">{t("sell_price")}</Label>
                  <Input 
                    type="number" 
                    value={draftPrice} 
                    onChange={e => setDraftPrice(e.target.value)} 
                    className="h-9"
                    inputMode="decimal"
                  />
                </div>
              </div>
              <Button type="submit" size="sm" className="w-full">
                <Plus className="size-4 mr-1" />
                {t("add_item")}
              </Button>
            </form>
          </Card>

          {/* Cart items list */}
          <Card className="p-4 glass-card space-y-3">
            <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">{t("cart")}</h2>
            
            {invoiceItems.length === 0 && (
              <div className="text-center py-6 text-xs text-muted-foreground italic">
                {t("no_items_in_cart")}
              </div>
            )}

            {invoiceItems.length > 0 && (
              <div className="divide-y divide-border overflow-hidden rounded-lg border text-xs">
                {invoiceItems.map((item, idx) => (
                  <div key={item.product.id} className="p-2.5 flex items-center justify-between gap-3 hover:bg-muted/10">
                    <div className="min-w-0 flex-1">
                      <span className="font-medium truncate block">{item.product.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {fmtMoney(item.sellPrice)} × {item.qty}
                      </span>
                    </div>
                    <div className="font-semibold">{fmtMoney(item.qty * item.sellPrice)}</div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-7 text-destructive hover:bg-destructive/10" 
                      onClick={() => setInvoiceItems(prev => prev.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Discount & Paid amounts */}
            {invoiceItems.length > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{t("discount")} (Amount)</Label>
                  <Input 
                    type="number" 
                    value={discount} 
                    onChange={e => setDiscount(e.target.value)} 
                    className="h-9"
                    inputMode="decimal"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{t("paid_amount")}</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={paid} 
                    onChange={e => setPaid(e.target.value)} 
                    className="h-9"
                    inputMode="decimal"
                  />
                </div>
              </div>
            )}

            {/* Calculations Summary */}
            {invoiceItems.length > 0 && (
              <div className="bg-muted/20 p-3 rounded-lg text-xs space-y-1.5 font-medium border border-border/40">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span>{fmtMoney(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-500">
                    <span>{t("discount")}</span>
                    <span>-{fmtMoney(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-border pt-1.5 mt-1">
                  <span>{t("payable_amount")}</span>
                  <span>{fmtMoney(total)}</span>
                </div>
                <div className="flex justify-between text-success">
                  <span>{t("paid_amount")}</span>
                  <span>{fmtMoney(paidAmount)}</span>
                </div>
                {due > 0 && (
                  <div className="flex justify-between text-rose-600 border-t border-dashed pt-1">
                    <span>{t("due_amount")}</span>
                    <span>{fmtMoney(due)}</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* Printable Invoice Page (Always structured cleanly for Print view) */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="hidden print:block invoice-print max-w-4xl mx-auto bg-white text-black p-8 font-sans space-y-6 text-sm">
        {/* Header section */}
        <div className="flex justify-between items-start border-b pb-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold uppercase tracking-wide text-black">{user?.business_name || "HakimEzy"}</h1>
            <p className="text-xs text-zinc-500">{t("tagline")}</p>
            <p className="text-xs text-zinc-500">{user?.email}</p>
          </div>
          <div className="text-right space-y-1">
            <h2 className="text-xl font-bold uppercase text-zinc-800">{t("invoices")}</h2>
            <div className="text-xs text-zinc-600"><strong>{t("invoice_no")}:</strong> {invoiceNo}</div>
            <div className="text-xs text-zinc-600"><strong>{t("date")}:</strong> {fmtDate(new Date().toISOString())}</div>
          </div>
        </div>

        {/* Client details info */}
        <div className="grid grid-cols-2 gap-6 pt-2">
          <div className="space-y-1 p-3 bg-zinc-50 rounded-lg">
            <h3 className="text-xs font-bold uppercase text-zinc-700">{t("billed_to")}:</h3>
            <div className="font-semibold text-black">{activeCustomerName}</div>
            <div className="text-zinc-600">{activeCustomerPhone}</div>
          </div>
          <div className="space-y-1 text-right">
            {/* Placeholder info */}
          </div>
        </div>

        {/* Invoice Item list table */}
        <div className="pt-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-300 bg-zinc-100 text-zinc-700">
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">{t("product_name")}</th>
                <th className="py-2 px-3 text-right">{t("sell_price")}</th>
                <th className="py-2 px-3 text-center">{t("qty")}</th>
                <th className="py-2 px-3 text-right">{t("total")}</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item, index) => (
                <tr key={item.product.id} className="border-b border-zinc-200">
                  <td className="py-2 px-3 text-zinc-500 font-mono">{index + 1}</td>
                  <td className="py-2 px-3 font-medium">{item.product.name}</td>
                  <td className="py-2 px-3 text-right">{fmtMoney(item.sellPrice)}</td>
                  <td className="py-2 px-3 text-center font-mono">{item.qty}</td>
                  <td className="py-2 px-3 text-right font-semibold">{fmtMoney(item.qty * item.sellPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total calculation panel */}
        <div className="flex justify-end pt-4">
          <div className="w-64 space-y-2 border-t pt-3 border-zinc-200 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>{t("subtotal")}</span>
              <span>{fmtMoney(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>{t("discount")}</span>
                <span>-{fmtMoney(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-zinc-300 pt-2 font-bold text-sm text-black">
              <span>{t("payable_amount")}</span>
              <span>{fmtMoney(total)}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>{t("paid_amount")}</span>
              <span>{fmtMoney(paidAmount)}</span>
            </div>
            {due > 0 && (
              <div className="flex justify-between border-t border-dashed pt-1 text-rose-600">
                <span>{t("due_amount")}</span>
                <span>{fmtMoney(due)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer text print area */}
        <div className="text-center pt-12 border-t border-zinc-200 text-[10px] text-zinc-500">
          <p>Generated via {user?.business_name || "HakimEzy"} Invoice Manager.</p>
          <p className="mt-1">Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}
