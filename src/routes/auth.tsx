import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Admin Sign In — Studio Nova CMS" }, { name: "description", content: "Secure administrator access for the Studio Nova website content manager." },
    { property: "og:title", content: "Admin Sign In — Studio Nova CMS" }, { property: "og:description", content: "Secure administrator access for website content." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up" | "reset">("in");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true);
    const form = new FormData(e.currentTarget); const email = String(form.get("email")); const password = String(form.get("password") ?? "");
    const result = mode === "reset"
      ? await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` })
      : mode === "up"
        ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/auth", data: { display_name: String(form.get("name") ?? "") } } })
        : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) { toast.error(result.error.message); return; }
    if (mode === "in") { navigate({ to: "/admin", replace: true }); return; }
    toast.success(mode === "up" ? "Check your email to confirm your account." : "Password reset email sent.");
  }
  async function social(provider: "google" | "lovable") {
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}/auth` });
    if (result.error) { toast.error(result.error.message); return; }
    if (!result.redirected) navigate({ to: "/admin", replace: true });
  }
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="eyebrow text-clay">Studio Nova CMS</p>
        <h1 className="display-xl mt-4 text-5xl">{mode === "up" ? "Create account" : mode === "reset" ? "Reset password" : "Welcome back"}</h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === "up" && <div className="space-y-2"><Label htmlFor="name">Display name</Label><Input id="name" name="name" required /></div>}
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
          {mode !== "reset" && <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" minLength={8} required /></div>}
          <Button className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "up" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in"}</Button>
        </form>
        {mode !== "reset" && <div className="mt-4 grid gap-3">
          <Button type="button" variant="outline" onClick={() => social("google")}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="!size-[18px]"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
            Continue with Google</Button>
          <Button type="button" variant="outline" onClick={() => social("lovable")}><LovableMark className="!size-[18px]" />Continue with Lovable</Button>
        </div>}
        <div className="mt-6 flex justify-between text-sm text-muted-foreground">
          <button onClick={() => setMode(mode === "up" ? "in" : "up")}>{mode === "up" ? "Have an account? Sign in" : "Create account"}</button>
          <button onClick={() => setMode(mode === "reset" ? "in" : "reset")}>{mode === "reset" ? "Back to sign in" : "Forgot password?"}</button>
        </div>
      </section>
    </main>
  );
}
