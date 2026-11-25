import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, History, Image as ImageIcon, LogOut, Plus, Save, Send, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getAdminContent, restoreRevision, saveContent } from "@/lib/cms/cms.functions";
import type { SiteContent } from "@/lib/cms/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Content Manager — Studio Nova CMS" }, { name: "description", content: "Manage Studio Nova website copy, projects, links, images and publishing." }, { property: "og:title", content: "Content Manager — Studio Nova CMS" }, { property: "og:description", content: "Private website administration." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const labels: Record<string, string> = { settings: "Site settings", hero: "Hero", studio: "Studio intro", capabilities: "Capabilities", work: "Projects", process: "Process", recognition: "Testimonials", awards: "Awards", cta: "Call to action", navigation: "Navigation", socials: "Social links", media: "Media library", history: "History" };
const pretty = (k: string) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

function AdminPage() {
  const load = useServerFn(getAdminContent); const save = useServerFn(saveContent); const restore = useServerFn(restoreRevision);
  const navigate = useNavigate(); const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["cms-admin"], queryFn: () => load(), retry: false });
  const [doc, setDoc] = useState<SiteContent | null>(null); const [active, setActive] = useState("settings"); const [busy, setBusy] = useState(false); const [dirty, setDirty] = useState(false);
  useEffect(() => { if (query.data && !dirty) setDoc(query.data.document); }, [query.data, dirty]);
  async function signOut() { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); navigate({ to: "/auth", replace: true }); }
  if (query.error) return <main className="grid min-h-screen place-items-center p-6 text-center"><div><h1 className="display-xl text-5xl">Administrator access required</h1><p className="mt-4 text-muted-foreground">Your account is signed in but has not been granted website editing access.</p><Button className="mt-6" onClick={signOut}>Sign out</Button></div></main>;
  if (!doc || !query.data) return <main className="grid min-h-screen place-items-center text-muted-foreground">Loading content…</main>;
  const data = query.data;
  const update = (fn: (d: SiteContent) => void) => { const next = structuredClone(doc); fn(next); setDoc(next); setDirty(true); };
  const current = doc.sections.find((s) => s.key === active);
  async function persist(publish: boolean) { setBusy(true); try { await save({ data: { document: doc!, version: data.version, publish } }); setDirty(false); await query.refetch(); toast.success(publish ? "Changes are live on the website." : "Draft saved."); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not save"); } finally { setBusy(false); } }
  async function upload(file: File, set: (url: string) => void) {
    const name = `${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
    const { error } = await supabase.storage.from("website-media").upload(name, file, { contentType: file.type });
    if (error) return toast.error(error.message); set(`/api/public/media/${name}`); toast.success("Image uploaded."); query.refetch();
  }
  const preview = (url = "") => data.media.find((m) => m.reference === url)?.url ?? url;
  const field = (label: string, value: string, set: (v: string) => void) => {
    const isImage = /image/i.test(label) && !/alt/i.test(label); const long = value.length > 80 || /desc|quote|address|title|description/i.test(label);
    return <div className="space-y-2" key={label}><Label>{pretty(label)}</Label>{long ? <Textarea value={value} onChange={(e) => set(e.target.value)} rows={3} /> : <Input value={value} onChange={(e) => set(e.target.value)} />}
      {isImage && <div className="flex items-center gap-3">{value && <img src={preview(value)} alt="" className="h-16 w-24 rounded-md object-cover" />}<Input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, set); }} /></div>}</div>;
  };
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="border-b border-border bg-card p-5 lg:min-h-screen lg:border-b-0 lg:border-r">
        <p className="font-display text-lg font-semibold">studio<span className="text-clay">.</span>cms</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{data.profile?.display_name || data.email}</p>
        <nav className="mt-6 flex gap-1 overflow-x-auto lg:flex-col">{["settings", ...doc.sections.map((s) => s.key), "media", "history"].map((k) => <button key={k} onClick={() => setActive(k)} className={`whitespace-nowrap rounded-md px-3 py-2 text-left text-sm ${active === k ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{labels[k] ?? pretty(k)}</button>)}</nav>
        <div className="mt-6 flex gap-2 lg:flex-col"><Button asChild variant="outline"><Link to="/" target="_blank"><ExternalLink />View site</Link></Button><Button variant="ghost" onClick={signOut}><LogOut />Sign out</Button></div>
      </aside>
      <main className="p-5 sm:p-8 lg:p-12">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow text-clay">{dirty ? "Unsaved changes" : "All changes saved"}</p><h1 className="display-xl mt-3 text-5xl">{labels[active] ?? pretty(active)}</h1><p className="mt-2 text-sm text-muted-foreground">Last published {new Date(data.publishedAt).toLocaleString()}</p></div>
          <div className="flex gap-2"><Button variant="outline" disabled={busy || !dirty} onClick={() => persist(false)}><Save />Save draft</Button><Button disabled={busy} onClick={() => persist(true)}><Send />Publish</Button></div>
        </header>
        <div className="mt-8 max-w-4xl space-y-6">
          {active === "settings" && Object.entries(doc.settings).map(([k, v]) => field(k, v, (x) => update((d) => { d.settings[k] = x; })))}
          {current && <>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"><Switch checked={current.enabled} onCheckedChange={(v) => update((d) => { d.sections.find((s) => s.key === active)!.enabled = v; })} /><Label>Show this section on the website</Label></div>
            {(["label", "title", "description"] as const).map((k) => field(k, current[k], (x) => update((d) => { d.sections.find((s) => s.key === active)![k] = x; })))}
            {Object.entries(current.fields).map(([k, v]) => field(k, v, (x) => update((d) => { d.sections.find((s) => s.key === active)!.fields[k] = x; })))}
            {(current.items.length > 0 || active !== "hero") && active !== "studio" && <section className="space-y-4"><div className="flex items-center justify-between"><h2 className="font-display text-2xl">Items</h2><Button variant="outline" onClick={() => update((d) => { const s = d.sections.find((x) => x.key === active)!; s.items.push(Object.fromEntries(Object.keys(s.items[0] ?? { title: "" }).map((k) => [k, ""]))); })}><Plus />Add item</Button></div>
              {current.items.map((item, i) => <div key={i} className="space-y-4 rounded-xl border border-border bg-card p-5"><div className="flex justify-between"><p className="eyebrow text-muted-foreground">Item {i + 1}</p><div className="flex gap-1">
                <Button size="icon" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => update((d) => { const a = d.sections.find((x) => x.key === active)!.items; [a[i - 1], a[i]] = [a[i]!, a[i - 1]!]; })}><ArrowUp /></Button>
                <Button size="icon" variant="ghost" aria-label="Move down" disabled={i === current.items.length - 1} onClick={() => update((d) => { const a = d.sections.find((x) => x.key === active)!.items; [a[i + 1], a[i]] = [a[i]!, a[i + 1]!]; })}><ArrowDown /></Button>
                <Button size="icon" variant="ghost" aria-label="Delete item" onClick={() => update((d) => { d.sections.find((x) => x.key === active)!.items.splice(i, 1); })}><Trash2 /></Button></div></div>
                {Object.entries(item).map(([k, v]) => field(k, v, (x) => update((d) => { d.sections.find((s) => s.key === active)!.items[i]![k] = x; })))}</div>)}</section>}
          </>}
          {active === "media" && <div><Input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, (url) => navigator.clipboard?.writeText(url)); }} /><p className="mt-2 text-sm text-muted-foreground">Uploads appear here; choose them from image fields or paste their address.</p><div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{data.media.map((m) => <button key={m.name} onClick={() => { navigator.clipboard?.writeText(m.reference); toast.success("Image address copied."); }} className="overflow-hidden rounded-xl border border-border bg-card text-left"><img src={m.url} alt="" className="aspect-square w-full object-cover" /><p className="truncate p-2 text-xs"><ImageIcon className="mr-1 inline size-3" />{m.name}</p></button>)}</div></div>}
          {active === "history" && <div className="divide-y divide-border rounded-xl border border-border">{data.revisions.map((r) => <div key={r.id} className="flex items-center justify-between p-4"><div><p className="font-medium capitalize">{r.action}</p><p className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p></div><Button variant="outline" onClick={async () => { setDoc(await restore({ data: { id: r.id } })); setDirty(true); toast.success("Version loaded. Save or publish to keep it."); }}><History />Restore</Button></div>)}{!data.revisions.length && <p className="p-6 text-muted-foreground">No saved versions yet.</p>}</div>}
        </div>
      </main>
    </div>
  );
}
