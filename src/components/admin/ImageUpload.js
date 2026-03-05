"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ImageUpload({ currentUrl, onUploaded, folder = "misc" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Format non supporté. Utilisez JPG, PNG ou WebP.");
      return;
    }

    setUploading(true);
    setError("");

    const ext = file.name.split(".").pop();
    const filename = `${folder}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filename, file, { upsert: true });

    if (uploadError) {
      setError("Erreur lors de l'upload.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filename);
    onUploaded(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      {currentUrl && (
        <div className="h-32 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentUrl} alt="Aperçu" className="h-full w-full object-cover" />
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 hover:border-slate-400 hover:bg-slate-100 transition">
        <span>{uploading ? "Upload en cours..." : currentUrl ? "Changer l'image" : "Choisir une image"}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFile}
          disabled={uploading}
        />
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
