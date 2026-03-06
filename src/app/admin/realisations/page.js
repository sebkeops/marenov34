"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/admin/ImageUpload";

const EMPTY_FORM = { title: "", subtitle: "", cover_image_url: "", slug: "" };

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function AdminRealisationsPage() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { fetchFamilies(); }, []);

  async function fetchFamilies() {
    setLoading(true);
    const { data } = await supabase
      .from("families")
      .select("*")
      .order("order", { ascending: true });
    setFamilies(data || []);
    setLoading(false);
  }

  function startEdit(f) {
    setEditingId(f.id);
    setForm({ title: f.title, subtitle: f.subtitle, cover_image_url: f.cover_image_url, slug: f.slug || "" });
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Le titre est requis."); return; }
    setSaving(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      cover_image_url: form.cover_image_url,
      slug: form.slug.trim() || toSlug(form.title.trim()),
      order: editingId
        ? families.find((f) => f.id === editingId)?.order ?? 0
        : families.length,
    };

    let err;
    if (editingId) {
      ({ error: err } = await supabase.from("families").update(payload).eq("id", editingId));
    } else {
      ({ error: err } = await supabase.from("families").insert(payload));
    }

    if (err) { setError("Erreur lors de l'enregistrement."); setSaving(false); return; }
    cancelEdit();
    await fetchFamilies();
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cette famille et toutes ses photos ?")) return;
    setDeletingId(id);
    await supabase.from("families").delete().eq("id", id);
    await fetchFamilies();
    setDeletingId(null);
  }

  async function moveFamily(id, direction) {
    const idx = families.findIndex((f) => f.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= families.length) return;

    const reordered = [...families];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];

    await Promise.all(
      reordered.map((f, i) =>
        supabase.from("families").update({ order: i }).eq("id", f.id)
      )
    );
    await fetchFamilies();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <a href="/admin" className="text-sm text-slate-500 hover:text-slate-900">← Tableau de bord</a>
          <h1 className="mt-1 text-base font-semibold text-slate-900">Réalisations</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-8">

        {/* Formulaire */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">
            {editingId ? "Modifier la famille" : "Ajouter une famille"}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Titre *</label>
              <input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({
                    ...f,
                    title,
                    slug: f.slug === toSlug(f.title) || f.slug === "" ? toSlug(title) : f.slug,
                  }));
                }}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="Ex : Portails aluminium"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Slug (URL)</label>
              <div className="mt-1 flex items-center rounded-xl border border-slate-200 focus-within:border-slate-400 overflow-hidden">
                <span className="shrink-0 bg-slate-50 px-3 py-3 text-xs text-slate-400 border-r border-slate-200">/realisations/</span>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                  className="flex-1 px-3 py-3 text-sm outline-none"
                  placeholder="portails-aluminium"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Sous-titre</label>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="Ex : Sur mesure et motorisés"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Image de couverture</label>
              <div className="mt-1">
                <ImageUpload
                  currentUrl={form.cover_image_url}
                  onUploaded={(url) => setForm({ ...form, cover_image_url: url })}
                  folder="families"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition"
              >
                {saving ? "Enregistrement..." : editingId ? "Mettre à jour" : "Ajouter"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Liste */}
        <section>
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Familles ({families.length})
          </h2>

          {loading ? (
            <p className="text-sm text-slate-500">Chargement...</p>
          ) : families.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune famille pour l'instant.</p>
          ) : (
            <div className="space-y-3">
              {families.map((f, i) => (
                <div key={f.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                    {f.cover_image_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={f.cover_image_url} alt={f.title} className="h-full w-full object-cover" />
                      : <div className="flex h-full items-center justify-center text-xs text-slate-400">img</div>
                    }
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-900 truncate">{f.title}</div>
                    {f.subtitle && <div className="text-xs text-slate-500 truncate">{f.subtitle}</div>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveFamily(f.id, "up")} disabled={i === 0}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition">▲</button>
                    <button onClick={() => moveFamily(f.id, "down")} disabled={i === families.length - 1}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition">▼</button>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <a href={`/admin/realisations/${f.id}`}
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
                      Photos
                    </a>
                    <button onClick={() => startEdit(f)}
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(f.id)} disabled={deletingId === f.id}
                      className="rounded-xl border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-60">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
