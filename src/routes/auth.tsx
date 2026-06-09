import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppLogo } from "@/components/app-logo";
import { SpeedLoader } from "@/components/speed-loader";
import { useAuth } from "@/hooks/use-auth";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { loginFn, registerFn } from "@/lib/rpc";
import type { AuthUser } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const { user, loading, login } = useAuth();
  const { t, lang, setLang } = useT();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <SpeedLoader />;
  if (user?.activated) return <Navigate to="/dashboard" replace />;
  if (user && !user.activated) return <Navigate to="/activate" replace />;

  function afterAuth(u: AuthUser | null) {
    if (!u) return;
    login(u);
    navigate({ to: u.activated ? "/dashboard" : "/activate", replace: true });
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await loginFn({ data: { email, password } });
      afterAuth(data.user as AuthUser);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await registerFn({ data: { email, password, fullName } });
      toast.success(lang === "bn" ? "একাউন্ট তৈরি — লাইসেন্স দিয়ে সক্রিয় করুন" : "Account created — activate with license");
      afterAuth(data.user as AuthUser);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4">
        <AppLogo size="sm" alt="HakimEzy" />
        <div className="flex gap-1 rounded-full glass-card p-1 text-xs">
          <button type="button" onClick={() => setLang("bn")} className={`px-3 py-1 rounded-full ${lang === "bn" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>বাংলা</button>
          <button type="button" onClick={() => setLang("en")} className={`px-3 py-1 rounded-full ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>EN</button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="glass-card w-full max-w-md p-6">
          <div className="text-center mb-6 flex flex-col items-center gap-2">
            <AppLogo size="lg" alt="HakimEzy" />
            <h1 className="text-xl font-serif font-bold">HakimEzy</h1>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">{t("sign_in")}</TabsTrigger>
              <TabsTrigger value="signup">{t("sign_up")}</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-3 pt-4">
                <Field label={t("email")}>
                  <Input type="email" required placeholder="you@business.com" value={email} onChange={e => setEmail(e.target.value)} />
                </Field>
                <Field label={t("password")}>
                  <Input type="password" required placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                </Field>
                <Button type="submit" disabled={busy} className="w-full">{busy ? "…" : t("sign_in")}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-3 pt-4">
                <Field label={t("full_name")}>
                  <Input placeholder="Your full name" value={fullName} onChange={e => setFullName(e.target.value)} />
                </Field>
                <Field label={t("email")}>
                  <Input type="email" required placeholder="owner@hakimezy.com" value={email} onChange={e => setEmail(e.target.value)} />
                </Field>
                <Field label={t("password")}>
                  <Input type="password" required minLength={6} placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
                </Field>
                <p className="text-xs text-muted-foreground">After signup you will activate with a license key (HZ-… or EMP-…).</p>
                <Button type="submit" disabled={busy} className="w-full">{busy ? "…" : t("create_account")}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
