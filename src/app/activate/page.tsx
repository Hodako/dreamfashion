"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AppLogo } from "@/components/app-logo";
import { SpeedLoader } from "@/components/speed-loader";
import { toast } from "sonner";
import { activateLicenseFn } from "@/lib/rpc-admin";

export default function ActivatePage() {
  const { user, loading, refresh } = useAuth();
  const { t } = useT();
  const router = useRouter();
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth");
      } else if (user.activated) {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.activated) return <SpeedLoader />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    setBusy(true);
    try {
      await activateLicenseFn({ data: { licenseKey: key.trim() } });
      await refresh();
      toast.success(t("save"));
      router.replace("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="glass-card w-full max-w-md p-6 space-y-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <AppLogo size="lg" />
          <h1 className="text-xl font-serif font-bold">Activate License</h1>
          <p className="text-sm text-muted-foreground">
            Enter your business or employee license key to activate HakimEzy.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">License Key</Label>
            <Input
              placeholder="HZ-XXXX-XXXX-XXXX or EMP-XXXX-XXXX-XXXX"
              value={key}
              onChange={e => setKey(e.target.value.toUpperCase())}
              className="font-mono uppercase"
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "…" : "Activate Account"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
