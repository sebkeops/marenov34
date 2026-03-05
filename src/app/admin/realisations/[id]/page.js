"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/admin/ImageUpload";

export default function FamilyPhotosPage() {
  const { id } = useParams();
  const [family, setFamily] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchData(); }, [id]);

  async function fetchData() {
    setLoading(true);
    const [{ data: fam }, { data: pics }] = await Promise.all([
      supabase.from("families").select("*").eq("id", id).single(),
      supabase.from("family_photos").select("*").eq("family_id", id).order("order", { ascending: true }),
    ]);
    setFamily(fam);
    setPhotos(pics || []);
    setLoading(false);
  }

  async function handleAddPhoto() {
    if (!newImageUrl) return;
    setAdding(true);
    await supabase.from("family_photos").insert({
      family_id: id,
      image_url: newImageUrl,
      order: photos.length,
    });
    setNewImageUrl("");
    await fetchData();
    setAdding(false);
  }

  async function handleDelete(photoId) {
    if (!confirm("Supprimer cette photo ?")) return;
    setDeletingId(photoId);
    await supabase.from("family_photos").delete().eq("id", photoId);
    await fetchData();
    setDeletingId(null);
  }

  async function movePhoto(photoId, direction) {
    const idx = photos.findIndex((p) => p.id === photoId);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= photos.length) return;

    const reordered = [...photos];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];

    await Promise.all(
      reordered.map((p, i) =>
        supabase.from("family_photos").update({ order: i }).eq("id", p.id)
      )
    );
    await fetchData();
  }

  if (loading) return <div className="p-8 text-sm text-slate-500">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <a href="/admin/realisations" className="text-sm text-slate-500 hover:text-slate-900">← Réalisations</a>
        <h1 className="mt-1 text-base font-semibold text-slate-900">
          Photos — {family?.title}
        </h1>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-8">

        {/* Ajouter une photo */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Ajouter une photo</h2>

          <ImageUpload
            currentUrl={newImageUrl}
            onUploaded={(url) => setNewImageUrl(url)}
            folder={`families/${id}`}
          />

          {newImageUrl && (
            <button
              onClick={handleAddPhoto}
              disabled={adding}
              className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition"
            >
              {adding ? "Ajout en cours..." : "Ajouter la photo"}
            </button>
          )}
        </section>

        {/* Liste des photos */}
        <section>
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Photos ({photos.length})
          </h2>

          {photos.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune photo pour l'instant.</p>
          ) : (
            <div className="space-y-3">
              {photos.map((p, i) => (
                <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">

                  {/* Miniature */}
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                  </div>

                  {/* Position */}
                  <div className="text-xs text-slate-400 w-6 text-center shrink-0">
                    {i + 1}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Boutons ordre */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => movePhoto(p.id, "up")}
                      disabled={i === 0}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition"
                    >▲</button>
                    <button
                      onClick={() => movePhoto(p.id, "down")}
                      disabled={i === photos.length - 1}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition"
                    >▼</button>
                  </div>

                  {/* Supprimer */}
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="rounded-xl border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition shrink-0"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
