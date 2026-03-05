"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminArtisanPage() {
  const [artisan, setArtisan] = useState(null);
  const [form, setForm] = useState({ photo_url: "", title: "", bio: "", bullets: [], trust_items: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [newBullet, setNewBullet] = useState("");
  const [newTrust, setNewTrust] = useState("");

  useEffect(() => { fetchArtisan(); }, []);

  async function fetchArtisan() {
    const { data } = await supabase.from("artisan").select("*").single();
    if (data) {
      setArtisan(data);
      setForm({
        photo_url: data.photo_url,
        title: data.title,
        bio: data.bio,
        bullets: data.bullets || [],
        trust_items: data.trust_items || [],
      });
    }
    setLoading(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    const { error: err } = await supabase
      .from("artisan")
      .update({ photo_url: form.photo_url, title: form.title, bio: form.bio, bullets: form.bullets, trust_items: form.trust_items })
      .eq("id", artisan.id);

    if (err) { setError("Erreur lors de l'enregistrement."); setSaving(false); return; }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  function addBullet() {
    if (!newBullet.trim()) return;
    setForm({ ...form, bullets: [...form.bullets, newBullet.trim()] });
    setNewBullet("");
  }

  function removeBullet(i) {
    setForm({ ...form, bullets: form.bullets.filter((_, idx) => idx !== i) });
  }

  function moveBullet(i, direction) {
    const arr = [...form.bullets];
    const swapIdx = direction === "up" ? i - 1 : i + 1;
    if (swapIdx < 0 || swapIdx >= arr.length) return;
    [arr[i], arr[swapIdx]] = [arr[swapIdx], arr[i]];
    setForm({ ...form, bullets: arr });
  }

  function addTrust() {
    if (!newTrust.trim()) return;
    setForm({ ...form, trust_items: [...form.trust_items, newTrust.trim()] });
    setNewTrust("");
  }

  function removeTrust(i) {
    setForm({ ...form, trust_items: form.trust_items.filter((_, idx) => idx !== i) });
  }

  function moveTrust(i, direction) {
    const arr = [...form.trust_items];
    const swapIdx = direction === "up" ? i - 1 : i + 1;
    if (swapIdx < 0 || swapIdx >= arr.length) return;
    [arr[i], arr[swapIdx]] = [arr[swapIdx], arr[i]];
    setForm({ ...form, trust_items: arr });
  }

  if (loading) return <div className="p-8 text-sm text-slate-500">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <a href="/admin" className="text-sm text-slate-500 hover:text-slate-900">← Tableau de bord</a>
        <h1 className="mt-1 text-base font-semibold text-slate-900">Présentation artisan</h1>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <form onSubmit={handleSave} className="space-y-6">

          {/* Photo */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Photo</h2>
            <ImageUpload
              currentUrl={form.photo_url}
              onUploaded={(url) => setForm({ ...form, photo_url: url })}
              folder="artisan"
            />
          </section>

          {/* Titre & bio */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">Texte de présentation</h2>

            <div>
              <label className="text-sm font-medium text-slate-700">Titre</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="Ex : Artisan menuisier à Restinclières"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Présentation</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={5}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </section>

          {/* Points forts (bullets) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">Points forts</h2>

            <ul className="space-y-2">
              {form.bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button type="button" onClick={() => moveBullet(i, "up")} disabled={i === 0}
                      className="rounded border border-slate-200 px-1.5 py-0.5 text-xs text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition">▲</button>
                    <button type="button" onClick={() => moveBullet(i, "down")} disabled={i === form.bullets.length - 1}
                      className="rounded border border-slate-200 px-1.5 py-0.5 text-xs text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition">▼</button>
                  </div>
                  <input
                    value={b}
                    onChange={(e) => {
                      const arr = [...form.bullets];
                      arr[i] = e.target.value;
                      setForm({ ...form, bullets: arr });
                    }}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  <button type="button" onClick={() => removeBullet(i)}
                    className="text-xs text-red-500 hover:text-red-700 transition shrink-0">Retirer</button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <input
                value={newBullet}
                onChange={(e) => setNewBullet(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBullet())}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                placeholder="Ajouter un point fort..."
              />
              <button type="button" onClick={addBullet}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition">
                Ajouter
              </button>
            </div>
          </section>

          {/* Blocs de confiance */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">Blocs de confiance</h2>
            <p className="text-xs text-slate-500">Affiché sous la présentation (ex : Devis gratuit, Réactivité...)</p>

            <ul className="space-y-2">
              {form.trust_items.map((t, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button type="button" onClick={() => moveTrust(i, "up")} disabled={i === 0}
                      className="rounded border border-slate-200 px-1.5 py-0.5 text-xs text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition">▲</button>
                    <button type="button" onClick={() => moveTrust(i, "down")} disabled={i === form.trust_items.length - 1}
                      className="rounded border border-slate-200 px-1.5 py-0.5 text-xs text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition">▼</button>
                  </div>
                  <input
                    value={t}
                    onChange={(e) => {
                      const arr = [...form.trust_items];
                      arr[i] = e.target.value;
                      setForm({ ...form, trust_items: arr });
                    }}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  <button type="button" onClick={() => removeTrust(i)}
                    className="text-xs text-red-500 hover:text-red-700 transition shrink-0">Retirer</button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <input
                value={newTrust}
                onChange={(e) => setNewTrust(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTrust())}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                placeholder="Ex : Devis gratuit"
              />
              <button type="button" onClick={addTrust}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition">
                Ajouter
              </button>
            </div>
          </section>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {saved && <p className="text-sm text-green-600">Enregistré !</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </main>
    </div>
  );
}
