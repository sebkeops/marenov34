"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminSpotlightPage() {
  const [spotlight, setSpotlight] = useState(null);
  const [form, setForm] = useState({ label: "À la une", title: "", text: "", image_url: "", visible: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchSpotlight(); }, []);

  async function fetchSpotlight() {
    const { data } = await supabase.from("spotlight").select("*").single();
    if (data) {
      setSpotlight(data);
      setForm({ label: data.label || "À la une", title: data.title, text: data.text, image_url: data.image_url || "", visible: data.visible });
    }
    setLoading(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    const { error: err } = await supabase
      .from("spotlight")
      .update({ label: form.label, title: form.title, text: form.text, image_url: form.image_url, visible: form.visible })
      .eq("id", spotlight.id);

    if (err) { setError("Erreur lors de l'enregistrement."); setSaving(false); return; }

    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div className="p-8 text-sm text-slate-500">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <a href="/admin" className="text-sm text-slate-500 hover:text-slate-900">← Tableau de bord</a>
        <h1 className="mt-1 text-base font-semibold text-slate-900">À la une</h1>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          {/* Toggle visibilité en haut, bien visible */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 mb-6">
            <div>
              <div className="text-sm font-medium text-slate-900">Afficher sur le site</div>
              <div className="text-xs text-slate-500">
                {form.visible ? "Le bloc est visible sur le site" : "Le bloc est masqué sur le site"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, visible: !form.visible })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${form.visible ? "bg-slate-900" : "bg-slate-300"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${form.visible ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Texte du badge</label>
              <input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="Ex : À la une, Offre spéciale, Nouveauté..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Titre</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="Ex : Offre spéciale printemps"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Texte</label>
              <textarea
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                rows={4}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="Description de l'offre ou de l'actualité..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Image</label>
              <div className="mt-1">
                <ImageUpload
                  currentUrl={form.image_url}
                  onUploaded={(url) => setForm({ ...form, image_url: url })}
                  folder="spotlight"
                />
              </div>
              {form.image_url && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image_url: "" })}
                  className="mt-2 text-xs text-red-500 hover:text-red-700 transition"
                >
                  Supprimer l&apos;image
                </button>
              )}
            </div>

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
        </section>
      </main>
    </div>
  );
}
