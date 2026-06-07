import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const { t, lang, setLang } = useT();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  if (user && !loading) return <Navigate to="/dashboard" replace />;

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/dashboard", replace: true });
  }
  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(lang === "bn" ? "একাউন্ট তৈরি হয়েছে" : "Account created");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-secondary to-accent/30">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <Sparkles className="size-5" />
          {t("app_name")}
        </div>
        <div className="flex gap-1 rounded-full bg-card border p-1 text-xs">
          <button onClick={() => setLang("bn")} className={`px-3 py-1 rounded-full ${lang==="bn"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>বাংলা</button>
          <button onClick={() => setLang("en")} className={`px-3 py-1 rounded-full ${lang==="en"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>EN</button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 shadow-xl border-border/60">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">{t("app_name")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("tagline")} · {t("owner_only")}</p>
          </div>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">{t("sign_in")}</TabsTrigger>
              <TabsTrigger value="signup">{t("sign_up")}</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-3 pt-4">
                <Field label={t("email")}><Input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></Field>
                <Field label={t("password")}><Input type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></Field>
                <Button type="submit" disabled={busy} className="w-full">{busy?"…":t("sign_in")}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-3 pt-4">
                <Field label={t("full_name")}><Input value={fullName} onChange={e=>setFullName(e.target.value)} /></Field>
                <Field label={t("email")}><Input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></Field>
                <Field label={t("password")}><Input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} /></Field>
                <Button type="submit" disabled={busy} className="w-full">{busy?"…":t("create_account")}</Button>
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