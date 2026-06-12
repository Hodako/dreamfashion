"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
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
import { playTapSound } from "@/lib/audio";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, Download, ArrowLeft, PiggyBank } from "lucide-react";

export default function SomitiPage() {
  const { t, lang } = useT();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["somiti"], queryFn: getSomiti });
  const [open, setOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);
  
  // Navigation / Tabs state
  const [selectedTab, setSelectedTab] = useState<"samities" | "ledger">("samities");
  const [selectedSamity, setSelectedSamity] = useState<string | null>(null);

  // Total balance of all Somitis combined
  const totalBalance = useMemo(() => {
    return (data ?? []).reduce((a, e) => a + (e.kind === "deposit" ? 1 : -1) * Number(e.amount), 0);
  }, [data]);

  // Parse entries to extract [Samity Name] prefix from the note field
  const parsedEntries = useMemo(() => {
    return (data ?? []).map(e => {
      const rawNote = e.note || "";
      const match = rawNote.match(/^\[(.*?)\](?:\s*(.*))?$/);
      let samityName = lang === "bn" ? "সাধারণ সমিতি" : "General Samity";
      let actualNote = rawNote;
      if (match) {
        samityName = match[1].trim();
        actualNote = match[2]?.trim() || "";
      }
      return {
        ...e,
        samityName,
        actualNote,
      };
    });
  }, [data, lang]);

  // Group entries by Samity Name
  const samitiesList = useMemo(() => {
    const groups: Record<string, { name: string; balance: number; entriesCount: number; lastActivity: string }> = {};
    parsedEntries.forEach(e => {
      const name = e.samityName;
      if (!groups[name]) {
        groups[name] = { name, balance: 0, entriesCount: 0, lastActivity: e.created_at };
      }
      const amount = Number(e.amount) || 0;
      groups[name].balance += (e.kind === "deposit" ? 1 : -1) * amount;
      groups[name].entriesCount += 1;
      if (new Date(e.created_at) > new Date(groups[name].lastActivity)) {
        groups[name].lastActivity = e.created_at;
      }
    });
    return Object.values(groups).sort((a, b) => b.name.localeCompare(a.name));
  }, [parsedEntries]);

  // List of unique Samity names for autocomplete dropdown / datalist
  const uniqueSamityNames = useMemo(() => {
    const names = new Set<string>();
    parsedEntries.forEach(e => {
      if (e.samityName && e.samityName !== "General Samity" && e.samityName !== "সাধারণ সমিতি") {
        names.add(e.samityName);
      }
    });
    return Array.from(names);
  }, [parsedEntries]);

  // Filter entries if a specific Samity is selected
  const displayEntries = useMemo(() => {
    if (selectedSamity) {
      return parsedEntries.filter(e => e.samityName === selectedSamity);
    }
    return parsedEntries;
  }, [parsedEntries, selectedSamity]);

  async function handleDelete(id: string) {
    playTapSound();
    if (!confirm(t("delete") + "?")) return;
    try {
      await deleteSomitiFn({ data: { id } });
      toast.success(t("delete") || "Deleted successfully");
      qc.invalidateQueries({ queryKey: ["somiti"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  }

  function handleTabChange(tab: string) {
    playTapSound();
    setSelectedTab(tab as any);
  }

  function exportCSV(langCode: "en" | "bn") {
    playTapSound();
    const rows = langCode === "bn"
      ? [["তারিখ", "সমিতির নাম", "ধরণ", "পরিমাণ", "মন্তব্য"]]
      : [["Date", "Samity Name", "Type", "Amount", "Note"]];
    parsedEntries.forEach(e => {
      rows.push([
        new Date(e.created_at).toLocaleString(langCode === "bn" ? "bn-BD" : "en-US"),
        e.samityName,
        e.kind === "deposit"
          ? (langCode === "bn" ? "জমা" : "Deposit")
          : (langCode === "bn" ? "উত্তোলন" : "Withdrawal"),
        String(e.amount),
        e.actualNote ?? "",
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    a.download = `samity-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success(langCode === "bn" ? "CSV ফাইল ডাউনলোড সফল হয়েছে!" : "CSV exported successfully!");
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedSamity && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full border active:scale-95 transition-all"
              onClick={() => {
                playTapSound();
                setSelectedSamity(null);
              }}
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <h1 className="text-2xl font-bold font-serif select-none">
            {selectedSamity ? selectedSamity : t("somiti")}
          </h1>
        </div>
        {data && data.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="active:scale-[0.97] transition-all">
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

      {/* Overview Balance Card */}
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-success/15 shadow-sm border border-success/10 select-none">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {selectedSamity 
            ? (lang === "bn" ? "সমিতির মোট জমা" : "Total Paying Amount")
            : (lang === "bn" ? "সর্বমোট সমিতি সঞ্চয়" : "Total Net Samity Balance")
          }
        </div>
        <div className="text-2xl font-bold mt-1 tracking-tight text-zinc-900 dark:text-zinc-100">
          {fmtMoney(selectedSamity 
            ? samitiesList.find(s => s.name === selectedSamity)?.balance || 0 
            : totalBalance
          )}
        </div>
      </Card>

      {!selectedSamity && (
        <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-sm mb-2">
            <TabsTrigger value="samities" className="text-xs select-none">
              {lang === "bn" ? "সমিতি সমূহ" : "Samities"}
            </TabsTrigger>
            <TabsTrigger value="ledger" className="text-xs select-none">
              {lang === "bn" ? "সব লেনদেন" : "All Ledger"}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">{t("loading")}...</div>
      ) : parsedEntries.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">{t("no_activity")}</Card>
      ) : selectedTab === "samities" && !selectedSamity ? (
        /* List of Samities grouped */
        <div className="grid grid-cols-1 gap-2.5">
          {samitiesList.map(s => (
            <Card
              key={s.name}
              onClick={() => {
                playTapSound();
                setSelectedSamity(s.name);
              }}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:border-primary/40 active:scale-[0.98] transition-all beveled-card"
            >
              <div className="space-y-1">
                <div className="font-semibold text-sm flex items-center gap-1.5">
                  <PiggyBank className="size-4 text-primary" />
                  {s.name}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {lang === "bn" 
                    ? `${s.entriesCount} টি লেনদেন · শেষ লেনদেন: ${new Date(s.lastActivity).toLocaleDateString("bn-BD")}`
                    : `${s.entriesCount} transactions · Last: ${new Date(s.lastActivity).toLocaleDateString()}`
                  }
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold text-sm ${s.balance >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}>
                  {s.balance >= 0 ? "+" : ""}{fmtMoney(s.balance)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Ledger List of Transactions (Filterable by selectedSamity) */
        <Card className="divide-y divide-border overflow-hidden beveled-card">
          {displayEntries.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">No transactions found</div>
          )}
          {displayEntries.map(e => (
            <div key={e.id} className="p-3 flex items-center justify-between text-xs hover:bg-accent/20 transition-colors">
              <div className="space-y-0.5">
                <div className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 flex-wrap">
                  {!selectedSamity && (
                    <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary">
                      {e.samityName}
                    </span>
                  )}
                  <span>
                    {e.kind === "deposit" ? t("deposit") : t("withdraw")}
                    {e.actualNote ? ` — ${e.actualNote}` : ""}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">{fmtDateTime(e.created_at)}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`font-semibold ${e.kind === "deposit" ? "text-success" : "text-destructive"}`}>
                  {e.kind === "deposit" ? "+" : "-"}{fmtMoney(e.amount)}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-full text-muted-foreground hover:bg-muted active:scale-95 transition-all"
                      onClick={() => playTapSound()}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-28">
                    <DropdownMenuItem
                      onClick={() => {
                        playTapSound();
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
      )}

      {/* Floating Action Button (FAB) with Tap Sound & Pre-filled Samity */}
      <FAB
        onClick={() => {
          playTapSound();
          setEditingEntry(null);
          setOpen(true);
        }}
      />

      <SomitiDialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setEditingEntry(null);
        }}
        entry={editingEntry}
        prefilledSamityName={selectedSamity || undefined}
        uniqueSamityNames={uniqueSamityNames}
      />
    </div>
  );
}

function SomitiDialog({
  open,
  onOpenChange,
  entry,
  prefilledSamityName,
  uniqueSamityNames,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  entry?: any;
  prefilledSamityName?: string;
  uniqueSamityNames: string[];
}) {
  const { t, lang } = useT();
  const qc = useQueryClient();
  const [samityName, setSamityName] = useState("");
  const [kind, setKind] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      if (entry) {
        setKind(entry.kind);
        setAmount(String(entry.amount));
        setSamityName(entry.samityName || "");
        setNote(entry.actualNote || "");
      } else {
        setKind("deposit");
        setAmount("");
        setSamityName(prefilledSamityName || "");
        setNote("");
      }
    }
  }, [open, entry, prefilledSamityName]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    playTapSound();
    
    const formattedSamity = samityName.trim() || (lang === "bn" ? "সাধারণ সমিতি" : "General Samity");
    // Format the note field to keep Samity Name prefix
    const finalNote = note.trim()
      ? `[${formattedSamity}] ${note.trim()}`
      : `[${formattedSamity}]`;

    setBusy(true);
    try {
      if (entry) {
        await updateSomitiFn({
          data: {
            id: entry.id,
            kind,
            amount: Number(amount) || 0,
            note: finalNote,
          },
        });
        toast.success(t("save") || "Updated successfully");
      } else {
        await createSomitiFn({
          data: {
            kind,
            amount: Number(amount) || 0,
            note: finalNote,
          },
        });
        toast.success(t("save") || "Saved successfully");
      }
      setAmount("");
      setNote("");
      setSamityName("");
      qc.invalidateQueries({ queryKey: ["somiti"] });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  function handleKindChange(v: string) {
    playTapSound();
    setKind(v as any);
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { playTapSound(); onOpenChange(val); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{entry ? t("edit") : (lang === "bn" ? "সমিতি পেমেন্ট যোগ করুন" : "Add Samity Payment")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Tabs value={kind} onValueChange={handleKindChange}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="deposit">{t("deposit")}</TabsTrigger>
              <TabsTrigger value="withdraw">{t("withdraw")}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{lang === "bn" ? "সমিতির নাম" : "Samity Name"}</Label>
            <Input
              required
              placeholder={lang === "bn" ? "যেমন: আশা সমিতি, গ্রামীণ ব্যাংক..." : "e.g. Asha Samity, Grameen Bank..."}
              value={samityName}
              onChange={(e) => setSamityName(e.target.value)}
              list="existing-samities"
            />
            <datalist id="existing-samities">
              {uniqueSamityNames.map(name => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t("amount")}</Label>
            <Input
              required
              inputMode="decimal"
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{t("note")}</Label>
            <Input
              placeholder={lang === "bn" ? "লেনদেন সংক্রান্ত মন্তব্য..." : "Transaction notes..."}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => { playTapSound(); onOpenChange(false); }}
            >
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
