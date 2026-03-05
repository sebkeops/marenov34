"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/admin/ImageUpload";

const EMPTY_FORM = { title: "", subtitle: "", image_url: "" };

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("order", { ascending: true });
    setServices(data || []);
    setLoading(false);
  }

  function startEdit(service) {
    setEditingId(service.id);
    setForm({ title: service.title, subtitle: service.subtitle, image_url: service.image_url });
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
      image_url: form.image_url,
      order: editingId
        ? services.find((s) => s.id === editingId)?.order ?? 0
        : services.length,
    };

    let err;
    if (editingId) {
      ({ error: err } = await supabase.from("services").update(payload).eq("id", editingId));
    } else {
      ({ error: err } = await supabase.from("services").insert(payload));
    }

    if (err) { setError("Erreur lors de l'enregistrement."); setSaving(false); return; }

    cancelEdit();
    await fetchServices();
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer ce service ?")) return;
    setDeletingId(id);
    await supabase.from("services").delete().eq("id", id);
    await fetchServices();
    setDeletingId(null);
  }

  async function moveService(id, direction) {
    const idx = services.findIndex((s) => s.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= services.length) return;

    // Réorganise le tableau localement
    const reordered = [...services];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];

    // Renumérotation complète 0, 1, 2... pour éviter tout doublon
    await Promise.all(
      reordered.map((s, i) =>
        supabase.from("services").update({ order: i }).eq("id", s.id)
      )
    );
    await fetchServices();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <a href="/admin" className="text-sm text-slate-500 hover:text-slate-900">← Tableau de bord</a>
          <h1 className="mt-1 text-base font-semibold text-slate-900">Services</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-8">

        {/* Formulaire création / édition */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">
            {editingId ? "Modifier le service" : "Ajouter un service"}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Titre *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="Ex : Portails sur mesure"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Sous-titre</label>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="Ex : Gamme qualitative, motorisation NICE."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Image</label>
              <div className="mt-1">
                <ImageUpload
                  currentUrl={form.image_url}
                  onUploaded={(url) => setForm({ ...form, image_url: url })}
                  folder="services"
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
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Liste des services */}
        <section>
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Services ({services.length})
          </h2>

          {loading ? (
            <p className="text-sm text-slate-500">Chargement...</p>
          ) : services.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun service pour l'instant.</p>
          ) : (
            <div className="space-y-3">
              {services.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  {/* Miniature */}
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                    {s.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.image_url} alt={s.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">img</div>
                    )}
                  </div>

                  {/* Texte */}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-900 truncate">{s.title}</div>
                    {s.subtitle && (
                      <div className="text-xs text-slate-500 truncate">{s.subtitle}</div>
                    )}
                  </div>

                  {/* Actions ordre */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveService(s.id, "up")}
                      disabled={i === 0}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition"
                    >▲</button>
                    <button
                      onClick={() => moveService(s.id, "down")}
                      disabled={i === services.length - 1}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition"
                    >▼</button>
                  </div>

                  {/* Actions édition */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(s)}
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={deletingId === s.id}
                      className="rounded-xl border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-60"
                    >
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
