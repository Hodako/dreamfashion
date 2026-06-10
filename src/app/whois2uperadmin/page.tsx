"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  superAdminLoginFn,
  superAdminLogoutFn,
  superAdminCheckFn,
  generatePlatformLicenseFn,
  listPlatformLicensesFn,
  listBusinessesFn,
  deleteLicenseFn,
} from "@/lib/rpc-admin";
import { Trash2 } from "lucide-react";
import { SpeedLoader } from "@/components/speed-loader";
import { fmtDateTime } from "@/lib/format";

export default function SuperAdminPage() {
  const qc = useQueryClient();
  const auth = useQuery({ queryKey: ["super-admin"], queryFn: superAdminCheckFn });
  const [username, setUsername] = useState("superadmin");
  const [password, setPassword] = useState("");
  const [limit, setLimit] = useState("5");
  const [busy, setBusy] = useState(false);

  const licenses = useQuery({
    queryKey: ["platform-licenses"],
    queryFn: listPlatformLicensesFn,
    enabled: auth.data?.authenticated === true,
  });
  const businesses = useQuery({
    queryKey: ["businesses-admin"],
    queryFn: listBusinessesFn,
    enabled: auth.data?.authenticated === true,
  });

  if (auth.isLoading) return <SpeedLoader />;

  if (!auth.data?.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="glass-card w-full max-w-sm p-6 space-y-4">
          <h1 className="text-lg font-bold text-center">HakimEzy Super Admin</h1>
          <form
            onSubmit={async e => {
              e.preventDefault();
              setBusy(true);
              try {
                await superAdminLoginFn({ data: { username, password } });
                qc.invalidateQueries({ queryKey: ["super-admin"] });
              } catch (err: unknown) {
                toast.error(err instanceof Error ? err.message : "Login failed");
              } finally {
                setBusy(false);
              }
            }}
            className="space-y-3"
          >
            <div className="space-y-1">
              <Label className="text-xs">Username</Label>
              <Input placeholder="superadmin" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Password</Label>
              <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "…" : "Login"}</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Super Admin Panel</h1>
          <p className="text-sm text-muted-foreground">HakimEzy platform licenses</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await superAdminLogoutFn();
            qc.invalidateQueries({ queryKey: ["super-admin"] });
          }}
        >
          Logout
        </Button>
      </div>

      <Card className="glass-card p-4 space-y-3">
        <h2 className="font-semibold">Generate Business License</h2>
        <div className="flex gap-2 flex-wrap">
          <Input
            className="w-24"
            inputMode="numeric"
            placeholder="Limit"
            value={limit}
            onChange={e => setLimit(e.target.value)}
          />
          <Button
            onClick={async () => {
              try {
                const res = await generatePlatformLicenseFn({
                  data: { employeeLimit: Number(limit) || 5 },
                });
                toast.success(`License: ${res.key}`);
                qc.invalidateQueries({ queryKey: ["platform-licenses"] });
              } catch (err: unknown) {
                toast.error(err instanceof Error ? err.message : String(err));
              }
            }}
          >
            Generate HZ License
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">1 license = 1 business owner signup. Set employee limit per license.</p>
      </Card>

      <Card className="glass-card divide-y overflow-hidden">
        <div className="p-3 font-semibold text-sm">Platform Licenses</div>
        {(licenses.data ?? []).map(l => (
          <div key={l.id} className="p-3 flex items-center justify-between text-sm gap-2">
            <code className="font-mono text-xs truncate">{l.id}</code>
            <div className="flex items-center gap-2 shrink-0">
              <span className={l.used ? "text-muted-foreground" : "text-success font-medium"}>
                {l.used ? "Used" : "Available"} · limit {l.employee_limit}
              </span>
              {!l.used && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-destructive"
                  onClick={async () => {
                     try {
                       await deleteLicenseFn({ data: { licenseKey: l.id } });
                       qc.invalidateQueries({ queryKey: ["platform-licenses"] });
                       toast.success("License deleted");
                     } catch (err: unknown) {
                       toast.error(err instanceof Error ? err.message : String(err));
                     }
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </Card>

      <Card className="glass-card divide-y overflow-hidden">
        <div className="p-3 font-semibold text-sm">Businesses</div>
        {(businesses.data ?? []).map(b => (
          <div key={b.id} className="p-3 flex justify-between text-sm">
            <span className="font-medium">{b.name as string}</span>
            <span className="text-muted-foreground text-xs">{fmtDateTime(b.created_at as string)}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
