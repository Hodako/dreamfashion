"use client";


import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  getBusinessSettingsFn,
  updateBusinessSettingsFn,
  createEmployeeLicenseFn,
  updateEmployeePermissionsFn,
  deleteLicenseFn,
} from "@/lib/rpc-admin";
import { Trash2 } from "lucide-react";
import type { PermissionSet } from "@/lib/permissions";
import { DEFAULT_EMPLOYEE_PERMISSIONS } from "@/lib/permissions";
import { uploadImageFn } from "@/lib/rpc";
import { useTheme, type ThemeMode } from "@/hooks/use-theme";
import { SpeedLoader } from "@/components/speed-loader";
import { useIsMobile } from "@/hooks/use-mobile";



const BUSINESS_TYPES = ["retail", "wholesale", "fashion", "grocery", "services"];

export default function SettingsPage() {
  const { t } = useT();
  const { user, refresh } = useAuth();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const qc = useQueryClient();
  const settings = useQuery({ queryKey: ["business-settings"], queryFn: getBusinessSettingsFn });
  const [busy, setBusy] = useState(false);

  const biz = settings.data?.business;
  const isOwner = settings.data?.role === "owner";

  async function saveBusiness(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isOwner) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await updateBusinessSettingsFn({
        data: {
          name: String(fd.get("name") || "HakimEzy"),
          logo_url: String(fd.get("logo_url") || "/logo.png"),
          business_type: String(fd.get("business_type") || "retail"),
          theme: "green",
          employee_limit: Number(fd.get("employee_limit")) || 5,
        },
      });
      await refresh();
      qc.invalidateQueries({ queryKey: ["business-settings"] });
      toast.success(t("save"));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function uploadLogo(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        const { url } = await uploadImageFn({ data: { base64, fileName: file.name } });
        await updateBusinessSettingsFn({ data: { logo_url: url } });
        await refresh();
        qc.invalidateQueries({ queryKey: ["business-settings"] });
        toast.success(t("save"));
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : String(err));
      }
    };
    reader.readAsDataURL(file);
  }

  if (settings.isLoading && !settings.data) return <SpeedLoader fullScreen={false} />;

  return (
    <div className={`space-y-6 pb-8 ${isMobile ? "max-w-lg" : "max-w-5xl"} mx-auto`}>
      <div>
        <h1 className="text-2xl font-serif font-bold">{t("settings")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
      </div>

      {isOwner && biz && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Card className="glass-card p-5 space-y-4">
          <h2 className="font-semibold">Business Profile</h2>
          <form onSubmit={saveBusiness} className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Company Name</Label>
              <Input name="name" defaultValue={biz.name} placeholder="HakimEzy" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Logo URL</Label>
              <Input name="logo_url" defaultValue={biz.logo_url} placeholder="/logo.png" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Upload Logo</Label>
              <Input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Business Type</Label>
              <select name="business_type" defaultValue={biz.business_type} className="w-full h-9 rounded-md border border-input bg-input px-3 text-sm">
                {BUSINESS_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Employee License Limit</Label>
              <Input name="employee_limit" type="number" min={1} defaultValue={biz.employee_limit} placeholder="5" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t("appearance")}</Label>
              <select
                name="theme_mode"
                value={theme}
                onChange={e => setTheme(e.target.value as ThemeMode)}
                className="w-full h-9 rounded-md border border-input bg-input px-3 text-sm"
              >
                <option value="light">{t("theme_light")}</option>
                <option value="dark">{t("theme_dark")}</option>
                <option value="system">{t("theme_system")}</option>
              </select>
            </div>
            <Button type="submit" disabled={busy} className="w-full sm:w-auto">{busy ? "…" : t("save")}</Button>
          </form>
        </Card>

        <Card className="glass-card p-5 space-y-4">
          <h2 className="font-semibold">Employee Licenses</h2>
          <p className="text-xs text-muted-foreground">1 license = 1 employee. Share key during their signup activation.</p>
          <Button
            size="sm"
            onClick={async () => {
              try {
                const res = await createEmployeeLicenseFn({ data: { permissions: DEFAULT_EMPLOYEE_PERMISSIONS } });
                toast.success(`Employee key: ${res.key}`);
                qc.invalidateQueries({ queryKey: ["business-settings"] });
              } catch (err: unknown) {
                toast.error(err instanceof Error ? err.message : String(err));
              }
            }}
          >
            Generate Employee License
          </Button>
          <div className="divide-y divide-border rounded-md border overflow-hidden">
            {(settings.data?.employeeLicenses ?? []).map(l => (
              <div key={l.id} className="p-2 flex items-center justify-between gap-2 text-xs">
                <code className="font-mono truncate">{l.id}</code>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={l.used ? "text-muted-foreground" : "text-success"}>{l.used ? "Used" : "Open"}</span>
                  {!l.used && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6 text-destructive"
                      aria-label={t("delete_license")}
                      onClick={async () => {
                        try {
                          await deleteLicenseFn({ data: { licenseKey: l.id } });
                          qc.invalidateQueries({ queryKey: ["business-settings"] });
                          toast.success(t("delete_license"));
                        } catch (err: unknown) {
                          toast.error(err instanceof Error ? err.message : String(err));
                        }
                      }}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
        </div>
      )}

      {isOwner && (settings.data?.employees ?? []).length > 0 && (
        <Card className="glass-card p-5 space-y-4">
          <h2 className="font-semibold">Team & Privileges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(settings.data?.employees ?? []).map(emp => (
            <EmployeePermissions
              key={emp.id}
              employee={emp}
              onSave={async perms => {
                await updateEmployeePermissionsFn({ data: { employeeId: emp.id, permissions: perms } });
                qc.invalidateQueries({ queryKey: ["business-settings"] });
                toast.success(t("save"));
              }}
            />
          ))}
          </div>
        </Card>
      )}

      {!isOwner && (
        <Card className="glass-card p-5 text-sm text-muted-foreground max-w-2xl">
          Employee account — contact your business owner for settings changes.
        </Card>
      )}
    </div>
  );
}

function EmployeePermissions({
  employee,
  onSave,
}: {
  employee: { id: string; email: string; full_name: string; permissions: PermissionSet };
  onSave: (p: PermissionSet) => Promise<void>;
}) {
  const [perms, setPerms] = useState<PermissionSet>(employee.permissions || DEFAULT_EMPLOYEE_PERMISSIONS);

  const modules: (keyof PermissionSet)[] = ["dashboard", "products", "sales", "parties", "purchases", "expenses", "settings", "reports"];

  return (
    <div className="border border-border rounded-lg p-3 space-y-2">
      <div className="font-medium text-sm">{employee.full_name || employee.email}</div>
      <div className="grid grid-cols-2 gap-2">
        {modules.map(m => (
          <label key={m} className="flex items-center justify-between text-xs capitalize">
            {m}
            <Switch checked={perms[m]} onCheckedChange={v => setPerms(p => ({ ...p, [m]: v }))} />
          </label>
        ))}
      </div>
      <Button size="sm" variant="outline" onClick={() => onSave(perms)}>Save permissions</Button>
    </div>
  );
}
