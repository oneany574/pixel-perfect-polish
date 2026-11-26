import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set New Password — Studio Nova CMS" }, { name: "description", content: "Choose a new password for your Studio Nova administrator account." }, { property: "og:title", content: "Set New Password — Studio Nova CMS" }, { property: "og:description", content: "Secure password recovery for administrators." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: ResetPassword,
});
function ResetPassword() {
  const navigate = useNavigate(); const [busy, setBusy] = useState(false); const [ready, setReady] = useState<boolean | null>(null);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => { if (event === "PASSWORD_RECOVERY" || session) setReady(true); });
    const t = setTimeout(() => supabase.auth.getSession().then(({ data }) => setReady(!!data.session)), 1500);
    return () => { clearTimeout(t); data.subscription.unsubscribe(); };
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setBusy(true); const password = String(new FormData(e.currentTarget).get("password")); const { error } = await supabase.auth.updateUser({ password }); setBusy(false); if (error) return toast.error(error.message); toast.success("Password updated."); navigate({ to: "/admin" }); }
  if (ready === false) return <main className="grid min-h-screen place-items-center px-5"><div className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-8"><h1 className="display-xl text-4xl">Link expired</h1><p className="text-muted-foreground">This reset link is invalid or has expired. Request a new one.</p><Button asChild className="w-full"><Link to="/auth">Back to sign in</Link></Button></div></main>;
  return <main className="grid min-h-screen place-items-center px-5"><form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-8"><h1 className="display-xl text-5xl">New password</h1><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" minLength={8} required /><Button className="w-full" disabled={busy || !ready}>Update password</Button></form></main>;
}
