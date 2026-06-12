"use client";


import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getSomiti } from "@/lib/queries";
import { useT } from "@/lib/i18n";
import { fmtMoney, fmtDateTime } from "@/lib/format";
import { FAB } from "@/components/ui/fab";
import { toast } from "sonner";
import { createSomitiFn, updateSomitiFn, deleteSomitiFn } from "@/lib/rpc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, Download } from "lucide-react";



export default function SomitiPage() {
  const { t } = useT();
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["somiti"], queryFn: getSomiti });
  const [open, setOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  const balance = (data ?? []).reduce((a,e)=>a + (e.kind==="deposit"?1:-1)*Number(e.amount), 0);

  async function handleDelete(id: string) {
    if (!confirm(t("delete") + "?")) return;
    try {
      await deleteSomitiFn({ data: { id } });
      toast.success(t("delete") || "Deleted successfully");
      qc.invalidateQueries({ queryKey: ["somiti"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  }

  function exportCSV(langCode: "en" | "bn") {
    const rows = langCode === "bn"
      ? [["তারিখ", "ধরণ", "পরিমাণ", "মন্তব্য"]]
      : [["Date", "Type", "Amount", "Note"]];
    (data ?? []).forEach(e => {
      rows.push([
        new Date(e.created_at).toLocaleString(langCode === "bn" ? "bn-BD" : "en-US"),
        e.kind === "deposit"
          ? (langCode === "bn" ? "জমা" : "Deposit")
          : (langCode === "bn" ? "উত্তোলন" : "Withdrawal"),
        String(e.amount),
        e.note ?? "",
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    a.download = `somiti-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success(langCode === "bn" ? "CSV ফাইল ডাউনলোড সফল হয়েছে!" : "CSV exported successfully!");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("somiti")}</h1>
        {data && data.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="size-4 mr-1.5" />
                {t("export_csv") || "Export CSV"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportCSV("en")}>
                English (ইংরেজি)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportCSV("bn")}>
                Bangla (বাংলা)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-success/10">
        <div className="text-xs font-medium text-muted-foreground">{t("balance")}</div>
        <div className="text-2xl font-bold mt-1">{fmtMoney(balance)}</div>
      </Card>
      {(!data || data.length===0) && <Card className="p-8 text-center text-sm text-muted-foreground">{t("no_activity")}</Card>}
      <Card className="divide-y divide-border overflow-hidden">
        {data?.map(e => (
          <div key={e.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">
                {e.kind==="deposit"?t("deposit"):t("withdraw")}{e.note?` — ${e.note}`:""}
              </div>
              <div className="text-xs text-muted-foreground">{fmtDateTime(e.created_at)}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`font-semibold ${e.kind==="deposit"?"text-success":"text-destructive"}`}>
                {e.kind==="deposit"?"+":"-"}{fmtMoney(e.amount)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:bg-muted">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-28">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingEntry(e);
                      setOpen(true);
                    }}
                    className="text-xs"
                  >
                    <Pencil className="size-3 mr-1.5" /> {t("edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(e.id)}
                    className="text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <Trash2 className="size-3 mr-1.5" /> {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </Card>
      <FAB onClick={() => {
        setEditingEntry(null);
        setOpen(true);
      }} />
      <SomitiDialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setEditingEntry(null);
        }}
        entry={editingEntry}
      />
    </div>
  );
}

function SomitiDialog({
  open,
  onOpenChange,
  entry,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  entry?: any;
}) {
  const { t } = useT();
  const qc = useQueryClient();
  const [kind, setKind] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      if (entry) {
        setKind(entry.kind);
        setAmount(String(entry.amount));
        setNote(entry.note || "");
      } else {
        setKind("deposit");
        setAmount("");
        setNote("");
      }
    }
  }, [open, entry]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (entry) {
        await updateSomitiFn({
          data: {
            id: entry.id,
            kind,
            amount: Number(amount) || 0,
            note: note || null,
          },
        });
        toast.success(t("save") || "Updated successfully");
      } else {
        await createSomitiFn({
          data: {
            kind,
            amount: Number(amount) || 0,
            note: note || null,
          },
        });
        toast.success(t("save") || "Saved successfully");
      }
      setAmount("");
      setNote("");
      qc.invalidateQueries({ queryKey: ["somiti"] });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{entry ? t("edit") : t("add_somiti")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Tabs value={kind} onValueChange={(v) => setKind(v as any)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="deposit">{t("deposit")}</TabsTrigger>
              <TabsTrigger value="withdraw">{t("withdraw")}</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t("amount")}</Label>
            <Input
              required
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t("note")}</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "…" : t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
